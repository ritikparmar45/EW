# 🤖 Telegram YouTube Summarizer & Q&A Bot

A production-ready Telegram bot that summarizes YouTube videos and answers contextual questions using the MERN stack (MongoDB, Express, Node.js) and Google Gemini AI API.

## 🚀 Features

- **Instant Summaries**: Send any YouTube link and get a structured summary.
- **Contextual Q&A**: Ask follow-up questions specialized to the video content.
- **Multi-language Support**: Supports both English and Hindi.
- **Anti-Hallucination**: Answers are strictly grounded in the provided transcript.
- **Session Management**: Remembers which video you're talking about for seamless Q&A.

## 🛠 Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Bot Framework**: node-telegram-bot-api
- **Transcript Extraction**: youtube-transcript
- **AI Integration**: Google Gemini AI (using @google/generative-ai)
- **Utilities**: Axios, Dotenv

## 📂 Project Structure

```text
backend/
 ├── controllers/       # Business logic for summary and Q&A
 ├── services/          # External API integrations (Gemini, YouTube, Lang)
 ├── models/            # Database schema
 ├── routes/            # Telegram bot message routing
 ├── config/            # Database and app config
 ├── utils/             # Helper functions (URL validation)
 ├── index.js           # Entry point
```

## ⚙️ Setup Instructions

1. **Clone the repository**
2. **Install dependencies**:
   ```bash
   cd backend
   npm install
   ```
3. **Configure Environment Variables**:
   Create a `.env` file in the `backend/` directory:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   TELEGRAM_BOT_TOKEN=your_telegram_bot_token
   GEMINI_API_KEY=your_gemini_api_key
   ```
4. **Run the application**:
   ```bash
   npm run dev
   ```

## 🤖 Bot Commands

- `/start`: Initialize the bot.
- `/language en`: Switch to English.
- `/language hi`: Switch to Hindi.
- Simply paste a YouTube link to get a summary.
- Type any question after receiving a summary to ask about the video.

## 🧠 Design Decisions & Trade-offs

### 1. **Anti-Hallucination Strategy**
We implement a strict system prompt: *"Answer ONLY using the provided transcript. If the answer is not explicitly mentioned, respond that the topic is not covered."* This ensures the AI doesn't bring in external training data which might be incorrect for the specific video.

### 2. **Session Persistence**
Transcripts are stored in MongoDB indexed by the user's Telegram ID. This allows the bot to handle multiple users simultaneously without mixing up video contexts. Sessions expire after 24 hours to keep the database lean.

### 3. **Transcript Chunking**
For extremely long videos, the `transcriptService` includes logic to handle large text blocks, ensuring we stay within LLM token limits while maintaining context.

### 4. **Language Service**
A centralized `languageService` handles all UI strings and system prompts, making it easy to add more languages in the future without touching the core logic.

## 🛡 Disclaimer
The bot relies on publicly available closed captions/transcripts. If a video has transcripts disabled, the bot will notify the user gracefully.
