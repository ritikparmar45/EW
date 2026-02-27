const { GoogleGenerativeAI } = require("@google/generative-ai");

/**
 * Service to interact with Google Gemini AI
 */
const generateResponse = async (systemPrompt, userPrompt) => {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            systemInstruction: systemPrompt
        });

        const result = await model.generateContent(userPrompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error(`Gemini Service Error: ${error.message}`);
        throw new Error('Failed to generate response from Gemini AI');
    }
};

module.exports = {
    generateResponse
};
