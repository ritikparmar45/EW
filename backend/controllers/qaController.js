const geminiService = require('../services/geminiService');
const languageService = require('../services/languageService');
const Session = require('../models/sessionModel');

/**
 * Handle incoming QA questions from the user
 */
const handleQA = async (bot, msg) => {
    const chatId = msg.chat.id;
    const question = msg.text;

    try {
        const session = await Session.findOne({ telegramId: chatId.toString() });

        if (!session || !session.transcript) {
            // If no transcript exists, do not reply as a QA session is not active
            return;
        }

        const lang = session.language || 'en';
        const systemPrompt = languageService.getString('qa_system_prompt', lang);

        // Prepend transcript to system prompt for grounding
        const fullSystemPrompt = `${systemPrompt}\n\n${session.transcript}`;

        // Send a temporary typing indicator to show response is loading
        await bot.sendChatAction(chatId, 'typing');

        const answer = await geminiService.generateResponse(fullSystemPrompt, question);

        await bot.sendMessage(chatId, answer, { parse_mode: 'HTML' });

    } catch (error) {
        console.error(`QA Controller Error: ${error.message}`);
        const session = await Session.findOne({ telegramId: chatId.toString() });
        const lang = session?.language || 'en';
        bot.sendMessage(chatId, languageService.getString('error', lang), { parse_mode: 'HTML' });
    }
};

/**
 * Handle slash commands /start and /language
 */
const handleCommand = async (bot, msg, command) => {
    const chatId = msg.chat.id;
    const session = await Session.findOne({ telegramId: chatId.toString() });
    const lang = session?.language || 'en';

    if (command.startsWith('/language') || command === '/start') {
        const welcomeText = languageService.getString('welcome', lang);
        
        await bot.sendMessage(chatId, welcomeText, {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: lang === 'en' ? '🇬🇧 English (Active)' : '🇬🇧 English', callback_data: 'set_lang:en' },
                        { text: lang === 'hi' ? '🇮🇳 हिंदी (Active)' : '🇮🇳 हिंदी', callback_data: 'set_lang:hi' }
                    ]
                ]
            }
        });
    }
};

/**
 * Handle interactive inline button clicks
 */
const handleCallbackQuery = async (bot, callbackQuery) => {
    const chatId = callbackQuery.message.chat.id;
    const messageId = callbackQuery.message.message_id;
    const data = callbackQuery.data;

    // 1. Language Toggle handler
    if (data.startsWith('set_lang:')) {
        const newLang = data.split(':')[1];
        
        await Session.findOneAndUpdate(
            { telegramId: chatId.toString() },
            { language: newLang },
            { upsert: true }
        );

        // Strip HTML tags for clean popup toast notification
        const toastText = languageService.getString('lang_switched', newLang).replace(/<\/?[^>]+(>|$)/g, "");
        await bot.answerCallbackQuery(callbackQuery.id, { text: toastText, show_alert: false });

        // Update welcome menu language layout in-place
        const updatedWelcome = languageService.getString('welcome', newLang);
        await bot.editMessageText(updatedWelcome, {
            chat_id: chatId,
            message_id: messageId,
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: newLang === 'en' ? '🇬🇧 English (Active)' : '🇬🇧 English', callback_data: 'set_lang:en' },
                        { text: newLang === 'hi' ? '🇮🇳 हिंदी (Active)' : '🇮🇳 हिंदी', callback_data: 'set_lang:hi' }
                    ]
                ]
            }
        }).catch(() => {});
        return;
    }

    // 2. Summary Section Viewer handler
    if (data.startsWith('view_')) {
        const match = data.match(/^view_([a-z]+):(.+)$/);
        if (!match) {
            await bot.answerCallbackQuery(callbackQuery.id);
            return;
        }

        const section = match[1];
        const videoId = match[2];

        const session = await Session.findOne({ telegramId: chatId.toString() });

        if (!session || session.videoId !== videoId) {
            await bot.answerCallbackQuery(callbackQuery.id, {
                text: "❌ Session expired. Please send a new YouTube link.",
                show_alert: true
            });
            return;
        }

        let newText = '';
        switch (section) {
            case 'overview':
                newText = `🎬 <b>${session.title}</b>\n\n📝 <b>Overview:</b>\n${session.summary}\n\n<i>Use the buttons below to explore key points, timestamps, and takeaways.</i>`;
                break;
            case 'keypoints':
                newText = `🎬 <b>${session.title}</b>\n\n📌 <b>Key Points:</b>\n${session.keyPoints}`;
                break;
            case 'timestamps':
                newText = `🎬 <b>${session.title}</b>\n\n⏱️ <b>Important Timestamps:</b>\n${session.timestamps}`;
                break;
            case 'takeaway':
                newText = `🎬 <b>${session.title}</b>\n\n🧠 <b>Core Takeaway:</b>\n${session.takeaway}`;
                break;
            default:
                newText = `🎬 <b>${session.title}</b>`;
        }

        const buttons = [
            [
                { text: section === 'overview' ? '📊 Overview (Active)' : '📊 Overview', callback_data: `view_overview:${videoId}` },
                { text: section === 'keypoints' ? '📌 Key Points (Active)' : '📌 Key Points', callback_data: `view_keypoints:${videoId}` }
            ],
            [
                { text: section === 'timestamps' ? '⏱️ Timestamps (Active)' : '⏱️ Timestamps', callback_data: `view_timestamps:${videoId}` },
                { text: section === 'takeaway' ? '🧠 Takeaway (Active)' : '🧠 Takeaway', callback_data: `view_takeaway:${videoId}` }
            ]
        ];

        try {
            await bot.editMessageText(newText, {
                chat_id: chatId,
                message_id: messageId,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: buttons
                }
            });
        } catch (e) {
            // Suppress "message is not modified" exceptions from Telegram API
        }

        await bot.answerCallbackQuery(callbackQuery.id);
    }
};

module.exports = {
    handleQA,
    handleCommand,
    handleCallbackQuery
};
