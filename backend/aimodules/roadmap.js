// const generateTopics = require('./chatGPT')
// const searchYouTube  = require("./youtube")

// exports.post('/roadmap', async (req, res) => {
//     const { skillLevel, mainTopic } = req.body;

//     try {
//         // 1. Generate roadmap topics using LangChain and OpenAI
//         const roadmapResponse = await generateTopics(skillLevel, mainTopic);

//         // Assuming the response is a list of topics, split them into individual topics
//         const topics = roadmapResponse.split('\n').filter(topic => topic.trim() !== '');

//         // 2. Fetch YouTube videos for each topic
//         const roadmapWithVideos = await Promise.all(
//             topics.map(async (topic) => ({
//                 topic,
//                 videos: await searchYouTube(topic)
//             }))
//         );

//         // 3. Send the roadmap with video links as response
//         res.json({ roadmap: roadmapWithVideos });
//     } catch (error) {
//         console.error("Error generating roadmap:", error);
//         res.status(500).send("An error occurred while generating the roadmap.");
//     }
// });
// const Groq = require('groq-sdk');

// const groq = new Groq();
// async function main() {
//   const chatCompletion = await groq.chat.completions.create({
//     "messages": [
//       {
//         "role": "user",
//         "content": "create  a roadmap to a student to learn MERN stack"
//       }
//     ],
//     "model": "llama3-groq-70b-8192-tool-use-preview",
//     "temperature": 0.5,
//     "max_tokens": 1024,
//     "top_p": 0.65,
//     "stream": true,
//     "stop": null   
//   });

//   for await (const chunk of chatCompletion) {
//     process.stdout.write(chunk.choices[0]?.delta?.content || '');
//   }
// }

// main();
// Importing modules  API Key  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
const  {OpenAI}  = require('langchain/llms/openai');
const { PromptTemplate } = require('langchain/prompts');
require('dotenv').config();

// Initialize OpenAI instance
const openai = new OpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    temperature: 0.7,
    model: 'gpt-3.5-turbo' // Adjust the creativity level as needed
});

// Function to generate learning roadmap topics
exports.generateTopics = async (skillLevel, mainTopic) => {
    const promptTemplate = new PromptTemplate({
        template: `Create a learning roadmap for {skillLevel} learners in {mainTopic}. Include related topics.`,
        inputVariables: ["skillLevel", "mainTopic"]
    });

    const prompt = await promptTemplate.format({
        skillLevel: skillLevel,
        mainTopic: mainTopic
    });

    try {
        // Call the OpenAI model using the langchain call() method
        const completion = await openai.call(prompt);
        return completion;  // This returns the full response; you can handle it as needed
    } catch (error) {
        console.error("Error generating roadmap:", error);
        throw error;
    }
}


// Function to search YouTube for videos on a specific topic
exports.searchYouTube = async (query) => {
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

// Route handler to generate a roadmap and fetch related YouTube videos
exports.postRoadmap = async (req, res) => {
    const { skillLevel, mainTopic } = req.body;

    try {
        // 1. Generate roadmap topics using LangChain and OpenAI
        const roadmapResponse = await this.generateTopics(skillLevel, mainTopic);
        console.log(roadmapResponse);
        // Assuming the response is a list of topics, split them into individual topics
        const topics = roadmapResponse.split('\n').filter(topic => topic.trim() !== '');

        // 2. Fetch YouTube videos for each topic
        const roadmapWithVideos = await Promise.all(
            topics.map(async (topic) => ({
                topic,
                videos: await this.searchYouTube(topic)
            }))
        );

        // 3. Send the roadmap with video links as response
        res.json({ roadmap: roadmapWithVideos });
    } catch (error) {
        console.error("Error generating roadmap:", error);
        res.status(500).send("An error occurred while generating the roadmap.");
    }
}

