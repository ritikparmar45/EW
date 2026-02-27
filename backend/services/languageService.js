const translations = {
    en: {
        welcome: "👋 Welcome! Send me a YouTube link to get started.",
        invalid_url: "❌ Invalid YouTube URL. Please provide a valid link.",
        fetching: "⏳ Fetching transcript and generating summary...",
        no_transcript: "😕 Sorry, I couldn't find a transcript for this video.",
        error: "⚠️ An error occurred while processing your request.",
        not_covered: "This topic is not covered in the video.",
        lang_switched: "🌐 Language switched to English.",
        ask_question: "Now you can ask questions about the video!",
        summary_prompt: "Provide a structured summary of the following transcript. Return strictly in this format:\n🎥 Video Title\n📌 5 Key Points\n⏱ Important Timestamps\n🧠 Core Takeaway\n\nTranscript:",
        qa_system_prompt: "Answer ONLY using the provided transcript. If the answer is not explicitly mentioned, respond: 'This topic is not covered in the video.'\n\nTranscript:"
    },
    hi: {
        welcome: "👋 स्वागत है! शुरू करने के लिए मुझे एक YouTube लिंक भेजें।",
        invalid_url: "❌ अमान्य YouTube URL। कृपया एक वैध लिंक प्रदान करें।",
        fetching: "⏳ ट्रांसक्रिप्ट प्राप्त की जा रही है और सारांश बनाया जा रहा है...",
        no_transcript: "😕 क्षमा करें, मुझे इस वीडियो के लिए ट्रांसक्रिप्ट नहीं मिली।",
        error: "⚠️ आपके अनुरोध को संसाधित करते समय एक त्रुटि हुई।",
        not_covered: "यह विषय वीडियो में शामिल नहीं है।",
        lang_switched: "🌐 भाषा हिंदी में बदल दी गई है।",
        ask_question: "अब आप वीडियो के बारे में प्रश्न पूछ सकते हैं!",
        summary_prompt: "निम्नलिखित ट्रांसक्रिप्ट का एक संरचित सारांश प्रदान करें। इस प्रारूप में सख्ती से वापस लौटें:\n🎥 वीडियो शीर्षक\n📌 5 मुख्य बिंदु\n⏱ महत्वपूर्ण टाइमस्टैम्प\n🧠 मुख्य सीख\n\nट्रांसक्रिप्ट:",
        qa_system_prompt: "केवल प्रदान की गई ट्रांसक्रिप्ट का उपयोग करके उत्तर दें। यदि उत्तर स्पष्ट रूप से उल्लेखित नहीं है, तो प्रतिक्रिया दें: 'यह विषय वीडियो में शामिल नहीं है।'\n\nट्रांसक्रिप्ट:"
    }
};

const getString = (key, lang = 'en') => {
    return translations[lang]?.[key] || translations['en'][key];
};

module.exports = {
    getString
};
