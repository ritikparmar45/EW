const axios = require('axios');

/**
 * Fetches transcript from the Python microservice
 */
const fetchTranscript = async (videoId) => {
    try {
        const serviceUrl = process.env.TRANSCRIPT_SERVICE_URL || 'http://localhost:8001';
        console.log(`[TranscriptService] Requesting microservice for video: ${videoId}`);

        const response = await axios.get(`${serviceUrl}/transcript`, {
            params: { videoId }
        });

        if (!response.data || !response.data.transcript) {
            throw new Error('Transcript data is missing in service response');
        }

        console.log(`[TranscriptService] Successfully fetched transcript (${response.data.transcript.length} chars)`);
        return response.data.transcript;

    } catch (error) {
        if (error.response) {
            // Service responded with a status code out of 2xx range
            const message = error.response.data?.detail || 'Microservice error';
            console.error(`[TranscriptService] Microservice Error (${error.response.status}): ${message}`);

            if (error.response.status === 404) {
                throw new Error('Is video par captions/transcripts band hain ya available nahi hain.');
            }
        } else if (error.request) {
            // Request was made but no response received
            console.error('[TranscriptService] No response from microservice. Is it running?');
            throw new Error('Transcript service se sampark nahi ho paa raha. Admin se baat karein.');
        } else {
            console.error('[TranscriptService] Request setup error:', error.message);
        }

        throw new Error('Transcript fetch karne mein dikat aa rahi hai. Kripya link check karein.');
    }
};

/**
 * Chunks transcript if it exceeds token limits (kept for compatibility)
 */
const chunkTranscript = (text, maxLength = 8000) => {
    if (text.length <= maxLength) return [text];
    const chunks = [];
    let currentPos = 0;
    while (currentPos < text.length) {
        chunks.push(text.substring(currentPos, currentPos + maxLength));
        currentPos += maxLength;
    }
    return chunks;
};

module.exports = {
    fetchTranscript,
    chunkTranscript
};
