import React, { useState } from 'react';
import { Book, Video, Users, Award, Brain, ChevronRight, Lock } from 'lucide-react';

// Dummy data for roadmap
const dummyRoadmap = {
  title: "Web Development Fundamentals",
  steps: [
    {
      id: 1,
      title: "HTML Basics",
      videoId: "qz0aGYrrlhU",
      completed: true,
      questions: [
        {
          question: "What does HTML stand for?",
          options: ["Hyper Text Markup Language", "High Tech Modern Language", "Hybrid Text Making Language", "Home Tool Markup Language"],
          correct: 0
        },
        {
          question: "Which tag is used for creating a paragraph?",
          options: ["<p>", "<paragraph>", "<para>", "<text>"],
          correct: 0
        }
      ]
    },
    {
      id: 2,
      title: "CSS Fundamentals",
      videoId: "1PnVor36_40",
      completed: false,
      questions: [
        {
          question: "What does CSS stand for?",
          options: ["Cascading Style Sheets", "Creative Style Sheets", "Computer Style Sheets", "Colorful Style Sheets"],
          correct: 0
        },
        {
          question: "Which property is used to change text color?",
          options: ["color", "text-color", "font-color", "text-style"],
          correct: 0
        }
      ]
    }
  ]
};

const StudyPlatform = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [coins, setCoins] = useState(100);
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const handleCompleteStep = () => {
    setCoins(prev => prev + 50);
    setShowQuiz(true);
  };

  const handleAnswerSubmit = () => {
    if (selectedAnswer === dummyRoadmap.steps[currentStep].questions[0].correct) {
      if (currentStep < dummyRoadmap.steps.length - 1) {
        setCurrentStep(prev => prev + 1);
      }
      setShowQuiz(false);
      setSelectedAnswer(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" 
    style={{
      backgroundImage: `
        radial-gradient(circle at 20px 20px, #8b4513 2px, transparent 0),
        radial-gradient(circle at 60px 60px, #8b4513 2px, transparent 0),
        radial-gradient(circle at 100px 40px, #8b4513 2px, transparent 0)
      `,
      backgroundSize: '100px 100px'
    }}>
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">AI Study Hub</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <Award className="h-5 w-5 text-yellow-500" />
              <span className="font-medium">{coins} coins</span>
            </span>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
              Get Certificate (₹200)
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Roadmap Progress */}
          <div className="col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="text-lg font-semibold mb-4">Your Progress</h2>
              <div className="space-y-4">
                {dummyRoadmap.steps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`flex items-center space-x-3 p-3 rounded-lg ${
                      index === currentStep
                        ? 'bg-blue-50 border border-blue-200'
                        : index < currentStep
                        ? 'bg-green-50'
                        : 'bg-gray-50'
                    }`}
                  >
                    {index < currentStep ? (
                      <Award className="h-5 w-5 text-green-500" />
                    ) : index === currentStep ? (
                      <Video className="h-5 w-5 text-blue-500" />
                    ) : (
                      <Lock className="h-5 w-5 text-gray-400" />
                    )}
                    <span className={index <= currentStep ? 'font-medium' : 'text-gray-500'}>
                      {step.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Learning Area */}
          <div className="col-span-9">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {!showQuiz ? (
                <>
                  <h2 className="text-2xl font-bold mb-4">{dummyRoadmap.steps[currentStep].title}</h2>
                  <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg mb-6">
                    {/* This would be your YouTube video component */}
                    <div className="flex items-center justify-center h-full">
                      <Video className="h-16 w-16 text-gray-400" />
                      <span className="ml-2 text-gray-500">Video Content</span>
                    </div>
                  </div>
                  <button
                    onClick={handleCompleteStep}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition flex items-center"
                  >
                    Complete Step
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </button>
                </>
              ) : (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold">Quick Check</h3>
                  <div className="space-y-4">
                    <p className="text-lg">{dummyRoadmap.steps[currentStep].questions[0].question}</p>
                    <div className="space-y-3">
                      {dummyRoadmap.steps[currentStep].questions[0].options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedAnswer(index)}
                          className={`w-full text-left p-4 rounded-lg border ${
                            selectedAnswer === index
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-blue-200'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={handleAnswerSubmit}
                      disabled={selectedAnswer === null}
                      className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                    >
                      Submit Answer
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudyPlatform;