require('dotenv').config();
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first'); // Force IPv4 to avoid timeout
const express = require('express');
const connectDB = require('./config/db');
const setupBot = require('./routes/botRoutes');

const app = express();
app.use(express.json());

// Basic health check route
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'YouTube Summarizer Bot Server is running' });
});

const startServer = async () => {
    try {
        // 1. Connect to Database
        await connectDB();

        // 2. Initialize Telegram Bot
        setupBot();

        // 3. Start Express Server
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error(`Startup Error: ${error.message}`);
        process.exit(1);
    }
};

startServer();
