import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Book,
  Video,
  Users,
  Award,
  Brain,
  ChevronRight,
  Lock,
  Star,
  Clock,
  CheckCircle,
} from "lucide-react";

// Dummy data for roadmap
const dummyRoadmap = {
  title: "Web Development Fundamentals",
  steps: [
    {
      id: 1,
      title: "HTML Basics",
      videoId: "qz0aGYrrlhU",
      completed: true,
      duration: "45 min",
      rating: 4.8,
      students: 1250,
      questions: [
        {
          question: "What does HTML stand for?",
          options: [
            "Hyper Text Markup Language",
            "High Tech Modern Language",
            "Hybrid Text Making Language",
            "Home Tool Markup Language",
          ],
          correct: 0,
        },
        {
          question: "Which tag is used for creating a paragraph?",
          options: ["<p>", "<paragraph>", "<para>", "<text>"],
          correct: 0,
        },
      ],
    },
    {
      id: 2,
      title: "CSS Fundamentals",
      videoId: "1PnVor36_40",
      completed: false,
      duration: "60 min",
      rating: 4.9,
      students: 980,
      questions: [
        {
          question: "What does CSS stand for?",
          options: [
            "Cascading Style Sheets",
            "Creative Style Sheets",
            "Computer Style Sheets",
            "Colorful Style Sheets",
          ],
          correct: 0,
        },
        {
          question: "Which property is used to change text color?",
          options: ["color", "text-color", "font-color", "text-style"],
          correct: 0,
        },
      ],
    },
  ],
};

const StudyPlatform = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [coins, setCoins] = useState(100);
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const handleCompleteStep = () => {
    setCoins((prev) => prev + 50);
    setShowQuiz(true);
  };

  const handleAnswerSubmit = () => {
    if (
      selectedAnswer === dummyRoadmap.steps[currentStep].questions[0].correct
    ) {
      if (currentStep < dummyRoadmap.steps.length - 1) {
        setCurrentStep((prev) => prev + 1);
      }
      setShowQuiz(false);
      setSelectedAnswer(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
            radial-gradient(circle at 20px 20px, #60A5FA 2px, transparent 0),
            radial-gradient(circle at 60px 60px, #60A5FA 2px, transparent 0),
            radial-gradient(circle at 100px 40px, #60A5FA 2px, transparent 0)
          `,
            backgroundSize: "100px 100px",
          }}
        />
      </div>

      {/* Header */}
      <header className="relative bg-gray-800/50 backdrop-blur-lg border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3"
          >
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              AI Study Hub
            </h1>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-4"
          >
            <div className="flex items-center space-x-2 bg-gray-700/50 px-4 py-2 rounded-lg">
              <Award className="h-5 w-5 text-yellow-400" />
              <span className="font-medium text-white">{coins} coins</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200"
            >
              Get Certificate (₹200)
            </motion.button>
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Roadmap Progress */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="col-span-3"
          >
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl border border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-white mb-6">
                Your Progress
              </h2>
              <div className="space-y-4">
                {dummyRoadmap.steps.map((step, index) => (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`relative group ${
                      index === currentStep
                        ? "bg-blue-500/10 border border-blue-500/20"
                        : index < currentStep
                        ? "bg-green-500/10 border border-green-500/20"
                        : "bg-gray-700/50 border border-gray-600"
                    } rounded-lg p-4 transition-all duration-200`}
                  >
                    <div className="flex items-center space-x-3">
                      {index < currentStep ? (
                        <div className="p-2 bg-green-500/20 rounded-lg">
                          <CheckCircle className="h-5 w-5 text-green-400" />
                        </div>
                      ) : index === currentStep ? (
                        <div className="p-2 bg-blue-500/20 rounded-lg">
                          <Video className="h-5 w-5 text-blue-400" />
                        </div>
                      ) : (
                        <div className="p-2 bg-gray-600/50 rounded-lg">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3
                          className={`font-medium ${
                            index <= currentStep
                              ? "text-white"
                              : "text-gray-400"
                          }`}
                        >
                          {step.title}
                        </h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-400">
                            {step.duration}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Main Learning Area */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="col-span-9"
          >
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl border border-gray-700 p-8">
              <AnimatePresence mode="wait">
                {!showQuiz ? (
                  <motion.div
                    key="content"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-white">
                        {dummyRoadmap.steps[currentStep].title}
                      </h2>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Star className="h-5 w-5 text-yellow-400" />
                          <span className="text-white">
                            {dummyRoadmap.steps[currentStep].rating}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="h-5 w-5 text-blue-400" />
                          <span className="text-white">
                            {dummyRoadmap.steps[currentStep].students}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="aspect-w-16 aspect-h-9 bg-gray-700/50 rounded-xl mb-6 overflow-hidden">
                      <div className="flex items-center justify-center h-full">
                        <Video className="h-16 w-16 text-gray-400" />
                        <span className="ml-2 text-gray-300">
                          Video Content
                        </span>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleCompleteStep}
                      className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 flex items-center justify-center space-x-2"
                    >
                      <span>Complete Step</span>
                      <ChevronRight className="h-5 w-5" />
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="quiz"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    <h3 className="text-2xl font-semibold text-white">
                      Quick Check
                    </h3>
                    <div className="space-y-6">
                      <p className="text-lg text-gray-300">
                        {dummyRoadmap.steps[currentStep].questions[0].question}
                      </p>
                      <div className="grid grid-cols-1 gap-3">
                        {dummyRoadmap.steps[
                          currentStep
                        ].questions[0].options.map((option, index) => (
                          <motion.button
                            key={index}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedAnswer(index)}
                            className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
                              selectedAnswer === index
                                ? "border-blue-500 bg-blue-500/10 text-white"
                                : "border-gray-700 bg-gray-700/50 text-gray-300 hover:border-blue-500/50"
                            }`}
                          >
                            {option}
                          </motion.button>
                        ))}
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleAnswerSubmit}
                        disabled={selectedAnswer === null}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Submit Answer
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default StudyPlatform;
