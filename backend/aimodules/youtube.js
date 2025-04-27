const axios = require('axios');

async function searchYouTube(query) {
    const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
    const response = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
        params: {
            part: 'snippet',
            q: query,
            key: YOUTUBE_API_KEY,
            maxResults: 5,
        },
    });

    return response.data.items.map(video => ({
        title: video.snippet.title,
        link: `https://www.youtube.com/watch?v=${video.id.videoId}`
    }));
}
exports = searchYouTube;