const transcriptService = require('../services/transcriptService');
const geminiService = require('../services/geminiService');
const languageService = require('../services/languageService');
const Session = require('../models/sessionModel');
const youtubeUtils = require('../utils/youtubeUtils');

/**
 * Safely parse JSON that may be wrapped in Markdown code blocks
 */
const cleanAndParseJSON = (str) => {
    let cleanStr = str.trim();
    if (cleanStr.startsWith('```')) {
        cleanStr = cleanStr.replace(/^```(?:json)?\s*/i, '');
        cleanStr = cleanStr.replace(/\s*```$/, '');
    }
    return JSON.parse(cleanStr.trim());
};

const handleYoutubeLink = async (bot, msg) => {
    const chatId = msg.chat.id;
    const url = msg.text;

    if (!youtubeUtils.isValidYoutubeUrl(url)) {
        return bot.sendMessage(chatId, languageService.getString('invalid_url'), { parse_mode: 'HTML' });
    }

    const videoId = youtubeUtils.extractVideoId(url);
    let statusMsg;

    try {
        // Get user preference (default en)
        const userSession = await Session.findOne({ telegramId: chatId.toString() });
        const lang = userSession?.language || 'en';

        // Send step 1 progress status
        statusMsg = await bot.sendMessage(chatId, languageService.getString('fetching_start', lang), { parse_mode: 'HTML' });

        const transcript = await transcriptService.fetchTranscript(videoId);

        // Edit status to step 2 progress status
        await bot.editMessageText(languageService.getString('fetching_ai', lang), {
            chat_id: chatId,
            message_id: statusMsg.message_id,
            parse_mode: 'HTML'
        });

        // Request Gemini to generate a structured JSON summary
        const systemPrompt = languageService.getString('summary_prompt', lang);
        const rawResponse = await geminiService.generateResponse(systemPrompt, transcript, true);
        
        let parsedData;
        try {
            parsedData = cleanAndParseJSON(rawResponse);
        } catch (jsonErr) {
            console.error('Failed to parse JSON response from Gemini:', rawResponse);
            throw new Error('Gemini response format invalid');
        }

        // Cache full summary details in the session
        await Session.findOneAndUpdate(
            { telegramId: chatId.toString() },
            {
                videoId,
                transcript,
                language: lang,
                title: parsedData.title,
                summary: parsedData.summary,
                keyPoints: parsedData.keyPoints,
                timestamps: parsedData.timestamps,
                takeaway: parsedData.takeaway
            },
            { upsert: true, new: true }
        );

        // Delete the progress status message to keep chat clean
        await bot.deleteMessage(chatId, statusMsg.message_id).catch(() => {});

        // Build the HTML overview card
        const overviewText = `🎬 <b>${parsedData.title}</b>\n\n📝 <b>Overview:</b>\n${parsedData.summary}\n\n<i>Use the buttons below to explore key points, timestamps, and takeaways.</i>`;

        const options = {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: '📊 Overview', callback_data: `view_overview:${videoId}` },
                        { text: '📌 Key Points', callback_data: `view_keypoints:${videoId}` }
                    ],
                    [
                        { text: '⏱️ Timestamps', callback_data: `view_timestamps:${videoId}` },
                        { text: '🧠 Takeaway', callback_data: `view_takeaway:${videoId}` }
                    ]
                ]
            }
        };

        // Send the beautiful overview card
        await bot.sendMessage(chatId, overviewText, options);

        // Prompt the user for follow-up questions
        await bot.sendMessage(chatId, languageService.getString('ask_question', lang), { parse_mode: 'HTML' });

    } catch (error) {
        console.error(error);
        const userSession = await Session.findOne({ telegramId: chatId.toString() });
        const lang = userSession?.language || 'en';

        // Attempt to cleanup status message on failure
        if (statusMsg) {
            await bot.deleteMessage(chatId, statusMsg.message_id).catch(() => {});
        }

        if (error.message.toLowerCase().includes('transcript')) {
            bot.sendMessage(chatId, languageService.getString('no_transcript', lang), { parse_mode: 'HTML' });
        } else {
            bot.sendMessage(chatId, languageService.getString('error', lang), { parse_mode: 'HTML' });
        }
    }
};

module.exports = {
    handleYoutubeLink
};
