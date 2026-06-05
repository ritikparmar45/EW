const translations = {
    en: {
        welcome: "👋 <b>Welcome to YouTube Summarizer Bot!</b>\n\nI extract structured summaries, key points, timestamps, and takeaways from any YouTube video instantly using Gemini AI.\n\n👇 <b>How to use:</b>\n1. Send me a YouTube video link.\n2. Use the interactive buttons to explore sections.\n3. Send any question to ask AI about the video.\n\n🌐 <b>Choose your language below:</b>",
        invalid_url: "❌ <b>Invalid YouTube URL.</b> Please provide a valid link.",
        fetching_start: "⚙️ <b>Processing YouTube Video...</b>\n⏳ Step 1: Connecting and downloading transcript...",
        fetching_ai: "⚙️ <b>Processing YouTube Video...</b>\n✅ Step 1: Transcript retrieved successfully.\n⏳ Step 2: Analyzing content with Gemini AI...",
        no_transcript: "😕 <b>No Transcript Found.</b>\nI couldn't fetch a transcript for this video. Please make sure the video has closed captions/subtitles enabled.",
        error: "⚠️ <b>An error occurred</b> while processing your request. Please try again later.",
        not_covered: "This topic is not covered in the video.",
        lang_switched: "🌐 <b>Language switched to English.</b>",
        ask_question: "💬 <b>Now you can ask questions about the video!</b> Just type your question in the chat.",
        summary_prompt: "Analyze the following YouTube transcript. Provide a structured summary in English, returned as a valid JSON object matching this schema:\n{\n  \"title\": \"A short, descriptive, clean title of the video\",\n  \"summary\": \"A concise, engaging 2-3 sentence overview summarizing the video context\",\n  \"keyPoints\": \"5 bulleted key points, using HTML format like: • First key point\\n• Second key point\\n\",\n  \"timestamps\": \"Crucial moments with timestamps format, e.g.: <b>00:00</b> - Intro/Hook\\n<b>02:15</b> - First major topic\\n\",\n  \"takeaway\": \"A clear, actionable 1-2 sentence core takeaway or lesson\"\n}\nDo not include markdown code blocks (```json) in your JSON output. Return ONLY the raw JSON object.\n\nTranscript:",
        qa_system_prompt: "Answer the user's question ONLY using the provided transcript. Respond in a helpful, friendly tone, formatting key items in bold or lists using standard HTML tags. If the answer is not explicitly covered in the transcript, respond exactly: 'This topic is not covered in the video.'\n\nTranscript:"
    },
    hi: {
        welcome: "👋 <b>यूट्यूब समराइज़र बोट में आपका स्वागत है!</b>\n\nमैं जेमिनी एआई की मदद से किसी भी यूट्यूब वीडियो से मुख्य बिंदु, समय-चिह्न (timestamps), और मुख्य सीख तुरंत निकाल सकता हूँ।\n\n👇 <b>उपयोग कैसे करें:</b>\n1. मुझे एक यूट्यूब वीडियो लिंक भेजें।\n2. अनुभागों को देखने के लिए बटनों का उपयोग करें।\n3. वीडियो के बारे में प्रश्न पूछने के लिए चैट में टाइप करें।\n\n🌐 <b>नीचे अपनी भाषा चुनें:</b>",
        invalid_url: "❌ <b>अमान्य YouTube URL।</b> कृपया एक वैध लिंक प्रदान करें।",
        fetching_start: "⚙️ <b>यूट्यूब वीडियो संसाधित किया जा रहा है...</b>\n⏳ चरण 1: वीडियो से जुड़ना और ट्रांसक्रिप्ट डाउनलोड करना...",
        fetching_ai: "⚙️ <b>यूट्यूब वीडियो संसाधित किया जा रहा है...</b>\n✅ चरण 1: ट्रांसक्रिप्ट सफलतापूर्वक प्राप्त हुई।\n⏳ चरण 2: जेमिनी एआई (Gemini AI) के साथ सामग्री का विश्लेषण...",
        no_transcript: "😕 <b>कोई ट्रांसक्रिप्ट नहीं मिली।</b>\nमैं इस वीडियो के लिए ट्रांसक्रिप्ट नहीं ढूंढ सका। कृपया सुनिश्चित करें कि वीडियो में सबटाइटल्स (कैप्शन) सक्षम हैं।",
        error: "⚠️ आपके अनुरोध को संसाधित करते समय <b>एक त्रुटि हुई</b>। कृपया बाद में पुनः प्रयास करें।",
        not_covered: "यह विषय वीडियो में शामिल नहीं है।",
        lang_switched: "🌐 <b>भाषा बदलकर हिंदी कर दी गई है।</b>",
        ask_question: "💬 <b>अब आप वीडियो के बारे में प्रश्न पूछ सकते हैं!</b> बस चैट में अपना प्रश्न भेजें।",
        summary_prompt: "Analyze the following YouTube transcript. Provide a structured summary in Hindi, returned as a valid JSON object matching this schema:\n{\n  \"title\": \"A short, descriptive, clean title of the video in Hindi\",\n  \"summary\": \"A concise, engaging 2-3 sentence overview summarizing the video context in Hindi\",\n  \"keyPoints\": \"5 bulleted key points in Hindi, using HTML format like: • First key point\\n• Second key point\\n\",\n  \"timestamps\": \"Crucial moments with timestamps format in Hindi, e.g.: <b>00:00</b> - परिचय\\n<b>02:15</b> - पहला मुख्य विषय\\n\",\n  \"takeaway\": \"A clear, actionable 1-2 sentence core takeaway or lesson in Hindi\"\n}\nDo not include markdown code blocks (```json) in your JSON output. Return ONLY the raw JSON object.\n\nTranscript:",
        qa_system_prompt: "केवल प्रदान की गई ट्रांसक्रिप्ट का उपयोग करके हिंदी में उपयोगकर्ता के प्रश्न का उत्तर दें। प्रतिक्रिया को एक सहायक और मैत्रीपूर्ण लहजे में लिखें, मुख्य वस्तुओं को बोल्ड या सूचियों में मानक HTML टैग का उपयोग करके प्रारूपित करें। यदि उत्तर ट्रांसक्रिप्ट में स्पष्ट रूप से शामिल नहीं है, तो सटीक उत्तर दें: 'यह विषय वीडियो में शामिल नहीं है।'\n\nTranscript:"
    }
};

const getString = (key, lang = 'en') => {
    return translations[lang]?.[key] || translations['en'][key];
};

module.exports = {
    getString
};
