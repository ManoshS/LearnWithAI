// const OpenAI = require('@langchain/openai');
// const PromptTemplate =require('@langchain/core')


// const openai = new OpenAI({
//     openAIApiKey: process.env.OPENAI_API_KEY,
//     temperature: 0.7,  // Adjust the creativity level as needed
// });

// async function generateTopics(skillLevel, mainTopic) {
//     const promptTemplate = new PromptTemplate({
//         template: `Create a learning roadmap for {skillLevel} learners in {mainTopic}. Include related topics.`,
//         inputVariables: ["skillLevel", "mainTopic"]
//     });

//     const prompt = await promptTemplate.format({
//         skillLevel: skillLevel,
//         mainTopic: mainTopic
//     });

//     const completion = await openai.call(prompt);
//     return completion;
// }

// exports = generateTopics;