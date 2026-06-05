const { GoogleGenerativeAI } = require("@google/generative-ai");

/**
 * Service to interact with Google Gemini AI
 */
const generateResponse = async (systemPrompt, userPrompt, isJson = false) => {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const modelConfig = {
            model: "gemini-2.5-flash",
            systemInstruction: systemPrompt
        };

        if (isJson) {
            modelConfig.generationConfig = { responseMimeType: "application/json" };
        }

        const model = genAI.getGenerativeModel(modelConfig);

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
