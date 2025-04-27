const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const ConnectsRoutes = require("./routes/ConnectsRoutes");
const postsRoutes = require("./routes/postsRoutes");
const liksRoutes = require("./routes/linksRoutes");
const commentsRoutes = require("./routes/commentsRoutes");
const StudentSkills = require("./models/StudentSkills");
const axios = require("axios");
// const cheerio = require("cheerio");

// const roadmap = require('./aimodules/roadmap');
const { authenticate } = require("./middleware/auth");
const Groq = require("groq-sdk");
const { query } = require("./config/database");
const User = require("./models/User");

// Import other routes here

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/connect", ConnectsRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/likes", liksRoutes);
app.use("/api/comments", commentsRoutes);
// app.use('/api/ai', roadmap.postRoadmap);

const { GROQ_API_KEY } = process.env.GROQ_API_KEY;

// GROQ Setup

// const { Stream } = require('groq-sdk/lib/streaming.mjs');
const groq = new Groq({
  apiKey: GROQ_API_KEY,
});

async function chatWithGroq(userMessage, latestReply, messageHistory) {
  let messages = [
    {
      role: "user",
      content: userMessage,
    },
  ];

  if (messageHistory && latestReply) {
    messages.unshift({
      role: "system",
      content: `Our conversation's summary so far: """${messageHistory}""". 
                     And this is the latest reply from you """${latestReply}"""`,
    });
  }

  console.log("original message", messages);

  const chatCompletion = await groq.chat.completions.create({
    messages: messages,
    // model: "llama3-8b-8192",
    model: "llama3-70b-8192",
  });

  const respond = chatCompletion.choices?.[0]?.message?.content || "";
  return respond;
}
async function summarizeConversation(message, reply, messageSummary) {
  let content = `Summarize this conversation 
                    user: """${message}""",
                    you(AI): """${reply}"""
                  `;

  // For N+1 message
  if (messageSummary != "") {
    content = `Summarize this conversation: """${messageSummary}"""
                    and last conversation: 
                    user: """${message}""",
                    you(AI): """${reply}"""
                `;
  }

  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: content,
      },
    ],
    model: "llama3-8b-8192",
    max_tokens: 150,
  });

  const summary = chatCompletion.choices[0]?.message?.content || "";
  console.log("summary: ", summary);
  return summary;
}

async function getEducationalResources(query) {
  try {
    // Predefined educational resources based on common topics
    const commonResources = {
      programming: [
        {
          title: "MDN Web Docs",
          link: "https://developer.mozilla.org/en-US/",
          description:
            "Comprehensive documentation and learning resources for web development",
          type: "Documentation",
        },
        {
          title: "W3Schools",
          link: "https://www.w3schools.com/",
          description: "Free web development tutorials and references",
          type: "Tutorial",
        },
        {
          title: "GitHub",
          link: "https://github.com/",
          description: "Find open-source projects and code examples",
          type: "Code",
        },
      ],
      "data science": [
        {
          title: "Kaggle",
          link: "https://www.kaggle.com/",
          description: "Data science competitions and datasets",
          type: "Practice",
        },
        {
          title: "DataCamp",
          link: "https://www.datacamp.com/",
          description: "Interactive data science courses",
          type: "Tutorial",
        },
        {
          title: "Towards Data Science",
          link: "https://towardsdatascience.com/",
          description: "Data science articles and tutorials",
          type: "Article",
        },
      ],
      "machine learning": [
        {
          title: "Coursera ML Course",
          link: "https://www.coursera.org/learn/machine-learning",
          description: "Andrew Ng's famous machine learning course",
          type: "Course",
        },
        {
          title: "Fast.ai",
          link: "https://www.fast.ai/",
          description: "Practical deep learning for coders",
          type: "Tutorial",
        },
        {
          title: "Papers With Code",
          link: "https://paperswithcode.com/",
          description: "Latest ML papers with code implementations",
          type: "Research",
        },
      ],
    };

    // Determine the category based on the query
    let category = "programming"; // default category
    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes("data") || lowerQuery.includes("analytics")) {
      category = "data science";
    } else if (
      lowerQuery.includes("machine learning") ||
      lowerQuery.includes("ml") ||
      lowerQuery.includes("ai")
    ) {
      category = "machine learning";
    }

    // Get resources for the category
    let resources = commonResources[category] || commonResources["programming"];

    // Add some general resources
    const generalResources = [
      {
        title: "Stack Overflow",
        link: "https://stackoverflow.com/",
        description: "Q&A platform for programming questions",
        type: "Community",
      },
      {
        title: "Dev.to",
        link: "https://dev.to/",
        description: "Community of software developers",
        type: "Community",
      },
      {
        title: "Medium",
        link: "https://medium.com/",
        description: "Articles and tutorials from the tech community",
        type: "Article",
      },
    ];

    return [...resources, ...generalResources];
  } catch (error) {
    console.error("Error fetching educational resources:", error);
    return [];
  }
}

app.post("/roadmap", authenticate, async (req, res) => {
  try {
    const { skill } = req.body;
    if (!skill) {
      return res.status(402).send({ message: "skill is required" });
    }
    const data = await User.findSkillsById(req.user.userId);
    let skills = data.map((item) => item.skill_name);
    let message =
      "I know the following technologies " +
      JSON.stringify(skills) +
      " so , give me the road map to learn " +
      skill +
      "  based on my skill level ,what I know skip it in roadmap and roadmap should have only points 1 to 10 with no explaination of points ";
    // request chat completion

    if (data.length === 0) {
      message =
        "give me the road map to learn " +
        skill +
        " roadmap should have only points 1 to 5 with no explaination of points ";
    }
    console.log("technologies " + JSON.stringify(data) + " so");

    const reply = await chatWithGroq(message, "", "");
    const regex = /\d+\.\s?([^\n]+)/g;

    // Use match to get all listed items
    let listedItems = reply.match(regex);
    listedItems = listedItems.map((i) => i.substring(3, i.length));
    console.log(listedItems);
    // return res.send({
    //     "road,map":listedItems,
    //     reply
    // })

    listedItems.map(async (query) => {
      if (!query) {
        return res
          .status(400)
          .json({ error: "Please provide a search query." });
      }

      const youtubeAPIKey = process.env.YOUTUBE_API_KEY;
      const youtubeAPIUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${encodeURIComponent(
        query.substring(2, query.length) + " in English"
      )}&type=video&key=${youtubeAPIKey}`;
      try {
        const response = await axios.get(youtubeAPIUrl);
        const videoLinks = response.data.items.map((item) => {
          const videoId = item.id.videoId;
          const title = item.snippet.title;
          return {
            title,
            link: `https://www.youtube.com/watch?v=${videoId}`,
          };
        });

        console.log(videoLinks);
      } catch (error) {
        console.error("Error fetching YouTube data:", error);
        res.status(500).json({ error: "Failed to fetch YouTube video links." });
      }
    });
    return res.send({
      reply,
      listedItems,
      videoLinks,
    });
  } catch (err) {
    res.send({ err: err.message });
  }
});

app.post("/chat", authenticate, async (req, res) => {
  const { message, latestReply, messageSummary } = req.body;
  if (!message) {
    return res.status(402).send({ message: "Topic is required" });
  }
  const data = await User.findSkillsById(req.user.userId);

  let skills = data.map((item) => item.skill_name);
  let message1 =
    "I know the following technologies " +
    JSON.stringify(skills) +
    " so , give me the road map to learn " +
    message +
    "  based on my skill level ,please skip the skills whick I have in roadmap and roadmap should have only points 1 to 10 with numerical order";

  if (data.length === 0) {
    message1 =
      "give me the road map to learn " +
      message +
      " roadmap should have only points 1 to 10 with numerical order ";
  }

  updatedMessage = message1 + " and answer should be short and concise";
  const reply = await chatWithGroq(updatedMessage, latestReply, messageSummary);

  // Extract steps from the reply
  const regex = /\d+\.\s?([^\n]+)/g;
  const matches = reply.match(regex) || [];

  // Get resources for each step
  const stepsWithResources = await Promise.all(
    matches.map(async (step) => {
      const cleanStep = step.replace(/^\d+\.\s?/, "").trim();
      const resources = await getEducationalResources(cleanStep);
      return {
        step: cleanStep,
        resources,
      };
    })
  );

  const summary = await summarizeConversation(
    updatedMessage,
    reply,
    messageSummary
  );

  res.send({
    reply,
    summary,
    stepsWithResources,
  });
});

app.get("/search", async (req, res) => {
  const query = req.query.q; // Get the search query from request parameters

  if (!query) {
    return res.status(400).json({ error: "Please provide a search query." });
  }

  const youtubeAPIKey = process.env.YOUTUBE_API_KEY;
  const youtubeAPIUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=2&q=${encodeURIComponent(
    query
  )}&type=video&key=${youtubeAPIKey}`;

  try {
    const response = await axios.get(youtubeAPIUrl);
    const videoLinks = response.data.items.map((item) => {
      const videoId = item.id.videoId;
      const title = item.snippet.title;
      return {
        title,
        link: `https://www.youtube.com/watch?v=${videoId}`,
      };
    });

    res.json(videoLinks);
  } catch (error) {
    console.error("Error fetching YouTube data:", error);
    res.status(500).json({ error: "Failed to fetch YouTube video links." });
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});
module.exports = app;
