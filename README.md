# 🤖 Telegram YouTube Summarizer & Q&A Bot
[Live Bot Link](https://t.me/ritittttbot)

A professional, production-ready Telegram bot that provides structured summaries and answers contextual questions about YouTube videos. Built using a specialized microservice architecture with Node.js, Python, and Google Gemini AI.

## 🚀 Features

- **Instant Summaries**: Get structured summaries (Key Points, Timestamps, Takeaways) just by sending a link.
- **Contextual Q&A**: Ask follow-up questions about the video content.
- **Multi-language Support**: Fully functional in both **English** and **Hindi**.
- **Anti-Hallucination**: AI responses are strictly grounded in the video transcript.
- **Smart Microservice**: Dedicated Python service for robust transcript extraction.

## 🛠 Tech Stack

- **Backend**: Node.js, Express.js
- **Microservice**: Python (FastAPI, YouTube Transcript API)
- **Database**: MongoDB (Session & History Management)
- **AI Integration**: Google Gemini 2.5 Flash
- **Bot Framework**: node-telegram-bot-api

## 📂 Project Structure

```text
EWassig/
├── backend/                # Node.js Server (Bot Logic & Gemini AI)
│   ├── controllers/        # Summary & QA logic
│   ├── services/           # Gemini, Language & Transcript service
│   ├── routes/             # Telegram routing
│   └── models/             # MongoDB Schemas
├── transcript-service/     # Python Microservice
│   └── app.py              # FastAPI service for transcripts
└── .venv/                  # Python Virtual Environment
```

## ⚙️ Setup & Installation

### 1. Prerequisite
- Node.js (v16+)
- Python (3.8+)
- MongoDB Atlas Account
- Telegram Bot Token (from @BotFather)
- Gemini API Key (from Google AI Studio)

### 2. Configure Environment Variables
Create a `.env` file in the `backend/` directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
GEMINI_API_KEY=your_gemini_api_key
TRANSCRIPT_SERVICE_URL=http://127.0.0.1:8001
```

### 3. Run Python Microservice
```bash
cd transcript-service
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

### 4. Run Node.js Backend
```bash
cd backend
npm install
npm run dev
```

## 🤖 How to Use

1. Start the bot on Telegram using `/start`.
2. (Optional) Switch language using `/language hi` or `/language en`.
3. **Paste a YouTube link** to receive an instant structured summary.
4. **Type a question** directly after the summary to ask the AI about the video.

## 🧠 Architecture & Design Decisions

- **Microservice Separation**: Transcript extraction is handled by a separate Python service to leverage the superior `youtube-transcript-api` library, ensuring better compatibility with YouTube's structure.
- **Reliable Networking**: Used fixed IP (`127.0.0.1`) for local inter-service communication to avoid DNS resolution delays common on Windows development environments.
- **Model Choice**: Implemented Gemini 2.5 Flash for high-speed processing and superior context window handling, essential for long video transcripts.

---
**Author:** Ritik Parmar
