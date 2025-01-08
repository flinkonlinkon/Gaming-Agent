
import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Lottie from "lottie-react";
import gameAnimation from "./Game.json";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Ensure you import Toastify styles

export default function Ai() {
  // const key = "AIzaSyBFeLJqJYk28rjKzERkeqLOUVyZEmro0iE";
  

  const [response, setResponse] = useState([]);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  // Define emojis based on the topic
  const getTopicEmojis = (topic) => {
    if (topic.includes("action")) {
      return "💥🏃‍♂️🎯";
    } else if (topic.includes("RPG")) {
      return "🛡️⚔️🧙‍♂️";
    } else if (topic.includes("strategy")) {
      return "🧠🌍♟️";
    } else {
      return "🎮📝"; // Default emojis
    }
  };

  const handleInputText = async (e) => {
    e.preventDefault();
    const aiText = e.target.aiText.value.trim();

    if (!aiText) {
      toast.error("Please enter a question or topic.");
      return;
    }

    toast.info("Processing your request, please wait...");
    setLoading(true);

    try {
      const genAI = new GoogleGenerativeAI(key);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `
        You are a gaming agent. Answer questions or discuss topics related to gaming.
        Provide the response in the following structured format:

        🎮 **[Title]**
        📝 Overview: [Brief explanation of the topic or question]
        📝 Key Features:
          📝 [Feature 1]
          📝 [Feature 2]
          📝 [Feature 3]
        📝 Example Titles (if applicable): [Optional examples related to the topic]
        📝 Summary: [Concluding statement summarizing the response]

        The question is: ${aiText}.
      `;

      const result = await model.generateContent(prompt);
      const newResponse = {
        title: result.response.text().split("\n")[0], 
        content: result.response.text(),
      };

      
      setResponse([newResponse]);
      setHistory([newResponse, ...history];
    } catch (error) {
      console.error("Error generating content:", error);
      toast.error("An error occurred while generating the content.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-sans bg-gray-100 min-h-screen flex flex-col items-center">
      <ToastContainer />
      <header className="w-full bg-gradient-to-r from-blue-500 to-purple-600 py-6">
        <h1 className="text-white text-4xl font-bold text-center">
          🚀 Gaming Knowledge Hub
        </h1>
        <p className="text-white text-xl text-center mt-2">
          Ask any question or explore gaming topics.
        </p>
      </header>

      <main className="flex-grow w-11/12 max-w-screen-xl mx-auto py-8">
        <div className="flex flex-col sm:flex-row gap-8">
          {/* Main Content Area */}
          <div className="w-full sm:w-3/4">
            <form className="flex flex-col items-center gap-4" onSubmit={handleInputText}>
              <input
                className="w-full sm:w-2/3 p-4 border border-gray-300 rounded-lg shadow-lg bg-white text-lg font-semibold placeholder-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                name="aiText"
                type="text"
                placeholder="Enter your gaming question or topic here..."
              />
              <button className="px-6 py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg shadow-lg font-semibold transition-transform transform hover:scale-105 active:scale-100">
                Submit
              </button>
            </form>

            <div className="mt-8">
              {loading ? (
                <Lottie className="w-1/4 mx-auto" animationData={gameAnimation} loop />
              ) : (
                response.map((item, index) => (
                  <div key={index} className="mb-8 p-6 bg-white shadow-xl rounded-xl">
                    <h2 className="text-3xl font-bold text-blue-800 mb-4">
                      {getTopicEmojis(item.title)} {item.title}
                    </h2>
                    <p className="text-lg text-gray-700 mb-4">{item.content}</p>
                    <div className="text-right text-gray-600 text-sm mt-4">
                    <i>Last updated {new Date().toString()}</i>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="w-full sm:w-1/4">
            <div className="bg-white p-6 rounded-xl shadow-xl">
              <h3 className="text-2xl font-semibold text-blue-800 mb-4">Recent Topics</h3>
              <ul className="list-none space-y-3">
                {history.map((item, index) => (
                  <li key={index}>
                    <a href="#" className="text-blue-600 hover:text-blue-800">
                      {item.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full bg-gradient-to-r from-purple-600 to-blue-500 py-6 mt-8">
        <div className="text-center text-white">
          <p>&copy; 2025 Gaming Knowledge Hub. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}
