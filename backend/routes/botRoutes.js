const TelegramBot = require('node-telegram-bot-api');
const summaryController = require('../controllers/summaryController');
const qaController = require('../controllers/qaController');
const youtubeUtils = require('../utils/youtubeUtils');

const setupBot = () => {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const bot = new TelegramBot(token, { polling: true });

    console.log('Telegram Bot is running...');

    // Handle Commands
    bot.onText(/\/(start|summary|deepdive|actionpoints|language)/, (msg) => {
        const command = msg.text.split(' ')[0];
        qaController.handleCommand(bot, msg, msg.text);
    });

    // Handle Messages
    bot.on('message', async (msg) => {
        if (!msg.text) return;
        if (msg.text.startsWith('/')) return; // Commands handled above

        // Check if it's a YouTube link
        if (youtubeUtils.isValidYoutubeUrl(msg.text)) {
            await summaryController.handleYoutubeLink(bot, msg);
        } else {
            // Otherwise treat as a Q&A question
            await qaController.handleQA(bot, msg);
        }
    });

    return bot;
};

module.exports = setupBot;
