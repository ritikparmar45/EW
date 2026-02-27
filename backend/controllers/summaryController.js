const transcriptService = require('../services/transcriptService');
const geminiService = require('../services/geminiService');
const languageService = require('../services/languageService');
const Session = require('../models/sessionModel');
const youtubeUtils = require('../utils/youtubeUtils');

const handleYoutubeLink = async (bot, msg) => {
    const chatId = msg.chat.id;
    const url = msg.text;

    if (!youtubeUtils.isValidYoutubeUrl(url)) {
        return bot.sendMessage(chatId, languageService.getString('invalid_url'));
    }

    const videoId = youtubeUtils.extractVideoId(url);

    try {
        // Get user preference (default en)
        const userSession = await Session.findOne({ telegramId: chatId.toString() });
        const lang = userSession?.language || 'en';

        await bot.sendMessage(chatId, languageService.getString('fetching', lang));

        const transcript = await transcriptService.fetchTranscript(videoId);

        // Save/Update session
        await Session.findOneAndUpdate(
            { telegramId: chatId.toString() },
            { videoId, transcript, language: lang },
            { upsert: true, new: true }
        );

        const systemPrompt = languageService.getString('summary_prompt', lang);
        const summary = await geminiService.generateResponse(systemPrompt, transcript);

        await bot.sendMessage(chatId, summary);
        await bot.sendMessage(chatId, languageService.getString('ask_question', lang));

    } catch (error) {
        console.error(error);
        const userSession = await Session.findOne({ telegramId: chatId.toString() });
        const lang = userSession?.language || 'en';

        if (error.message.toLowerCase().includes('transcript')) {
            bot.sendMessage(chatId, languageService.getString('no_transcript', lang));
        } else {
            bot.sendMessage(chatId, languageService.getString('error', lang));
        }
    }
};

module.exports = {
    handleYoutubeLink
};
