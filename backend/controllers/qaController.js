const geminiService = require('../services/geminiService');
const languageService = require('../services/languageService');
const Session = require('../models/sessionModel');

const handleQA = async (bot, msg) => {
    const chatId = msg.chat.id;
    const question = msg.text;

    try {
        const session = await Session.findOne({ telegramId: chatId.toString() });

        if (!session || !session.transcript) {
            // If no session found and it's not a link, might be a greeting or just unhandled text
            // summaryController handles links, so if we are here it's likely a question or text
            return;
        }

        const lang = session.language || 'en';
        const systemPrompt = languageService.getString('qa_system_prompt', lang);

        // Low-cost anti-hallucination: prepend transcript to system prompt
        const fullSystemPrompt = `${systemPrompt}\n\n${session.transcript}`;

        const answer = await geminiService.generateResponse(fullSystemPrompt, question);

        await bot.sendMessage(chatId, answer);

    } catch (error) {
        console.error(`QA Controller Error: ${error.message}`);
        const session = await Session.findOne({ telegramId: chatId.toString() });
        const lang = session?.language || 'en';
        bot.sendMessage(chatId, languageService.getString('error', lang));
    }
};

const handleCommand = async (bot, msg, command) => {
    const chatId = msg.chat.id;
    const session = await Session.findOne({ telegramId: chatId.toString() });
    const lang = session?.language || 'en';

    if (command.startsWith('/language')) {
        const newLang = command.split(' ')[1];
        if (['en', 'hi'].includes(newLang)) {
            await Session.findOneAndUpdate(
                { telegramId: chatId.toString() },
                { language: newLang },
                { upsert: true }
            );
            return bot.sendMessage(chatId, languageService.getString('lang_switched', newLang));
        }
    }

    if (command === '/start') {
        return bot.sendMessage(chatId, languageService.getString('welcome', lang));
    }
};

module.exports = {
    handleQA,
    handleCommand
};
