const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    telegramId: {
        type: String,
        required: true,
        index: true
    },
    videoId: {
        type: String,
        required: true
    },
    transcript: {
        type: String,
        required: true
    },
    language: {
        type: String,
        default: 'en',
        enum: ['en', 'hi']
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 86400 // Session expires after 24 hours
    }
});

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;
