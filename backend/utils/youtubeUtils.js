/**
 * Extracts Video ID from a YouTube URL
 * Supports standard, shortened, and embed URLs
 */
const extractVideoId = (url) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
};

const isValidYoutubeUrl = (url) => {
    return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/.test(url);
};

module.exports = {
    extractVideoId,
    isValidYoutubeUrl
};
