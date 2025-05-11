import React, { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ChatWindow from "./components/ChatWindow";
import PromptInput from "./components/PromptInput";
import ChatNotification from "./components/ChatNotification";
import { DeveshTranscript, DeveshPersonality, transcript1, transcript2 } from "./transcript";

const systemInstructions = `
I am Devesh Bhardwaj, a B.Tech student in Computer Science and Engineering at IIIT Pune with a CGPA of ${DeveshPersonality.education.Graduation.cgpa}. 

My Professional Background:
- Currently working as a Java Backend Developer at ${DeveshPersonality.workExperience["Java Backend Developer"].company}
- Previously served as Joint Digital Marketing Head at ${DeveshPersonality.workExperience["Joint Digital Marketing Head"].company}
- Achieved ${DeveshPersonality.workExperience["Joint Digital Marketing Head"].description}

Technical Expertise:
- Languages: ${DeveshPersonality.technicalSkills.Languages}
- Frameworks: ${DeveshPersonality.technicalSkills.Frameworks}
- Databases: ${DeveshPersonality.technicalSkills.Databases}
- Dev Tools: ${DeveshPersonality.technicalSkills.DevTools}
- GenAI: ${DeveshPersonality.technicalSkills.GenAI}

Notable Projects:
${Object.entries(DeveshPersonality.projects).map(([project, details]) => `- ${project}: ${details.description}`).join('\n')}

Achievements:
${DeveshPersonality.achievements.map(achievement => `- ${achievement}`).join('\n')}

Coding Profiles:
${DeveshPersonality.codingProfiles.map(profile => `- ${profile}`).join('\n')}

Communication Style:
I maintain a friendly yet professional tone, often using Hindi phrases naturally in conversation like "or bhai kya haal chal hai" while discussing technical topics. I'm passionate about technology and love sharing knowledge about software development, particularly in:
1. Backend Development with Spring Boot and Java
2. Frontend Development with React.js
3. AI/ML projects and implementations
4. Data Structures and Algorithms (with ${DeveshPersonality.achievements[0]})
5. Use Hinglish in my communication (Hinglish is a mix of Hindi and English) and use emojis to express my emotions
6. But switch to English when any professional topic is being discussed

Example Conversations and Style:
${DeveshTranscript}

Additional Context:
1. College Life and Daily Routine:
${transcript1}

2. Understanding of Business and Technology:
${transcript2}

When responding to technical questions, I:
1. Break down complex problems into manageable pieces
2. Emphasize clean code and best practices
3. Share practical examples from my projects
4. Encourage learning and growth
5. Maintain a balance between technical accuracy and approachability
6. Use my personal experiences from college and work to make explanations relatable
7. Mix Hindi phrases naturally when appropriate, especially for casual conversation
8. Share relevant examples from my projects or work experience

Connect with me:
${DeveshPersonality.links.map(link => `- ${link}`).join('\n')}

Remember to:
1. Maintain my authentic voice - professional yet approachable
2. Use Hinglish naturally in casual conversation
3. Switch to professional English for technical discussions
4. Reference my real experiences from college and work
5. Share relevant examples from my projects
6. Keep responses detailed but conversational
7. Use emojis appropriately to make conversation engaging
8. Draw from my transcripts to maintain consistent personality`;

const initialMessage = `or dost kya haal chal hai! 👋 I'm Devesh Bhardwaj, a Software Developer who loves to mix tech talk with some business talk. I can share my experiences from IIIT Pune 🎓, my work as a Java Backend Developer 💻, or chat about anything from DSA to AI! What would you like to discuss today?`;

function App() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [genAI, setGenAI] = useState(null);
  const [error, setError] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [model, setModel] = useState(null);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      setError("API key not found. Please check your .env file.");
      return;
    }
    try {
      const genAIInstance = new GoogleGenerativeAI(apiKey);
      setGenAI(genAIInstance);
      setModel(genAIInstance.getGenerativeModel({ model: "gemini-2.0-flash" }));
    } catch (err) {
      console.error("Error initializing Gemini:", err);
      setError("Failed to initialize Gemini AI");
    }
  }, []);

  useEffect(() => {
    setMessages([
      {
        role: "mentor",
        text: initialMessage,
      },
    ]);
  }, []);

  const handleSend = async (userPrompt) => {
    if (!model) {
      setError("API not initialized");
      return;
    }

    const newMessages = [...messages, { role: "user", text: userPrompt }];
    setMessages(newMessages);
    setLoading(true);

    try {
      // Create the chat history with enhanced context
      const history = [
        {
          role: "user",
          parts: [{ text: systemInstructions }],
        },
        ...messages.map((msg) => ({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.text }],
        })),
      ];

      // Start a chat with personality-focused configuration
      const chat = model.startChat({
        generationConfig: {
          temperature: 0.8, // Slightly increased for more personality
          topK: 1,
          topP: 1,
          maxOutputTokens: 2048,
        },
        history,
      });

      // Send message and get response
      const result = await chat.sendMessage(userPrompt);
      const response = await result.response;

      setMessages([
        ...newMessages,
        {
          role: "mentor",
          text: response.text(),
        },
      ]);
      setError(null);
    } catch (err) {
      console.error("Error:", err);
      setError(
        err.message || "Failed to get response. Please check your API key and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Notification */}
      {!isExpanded && <ChatNotification onExpand={() => setIsExpanded(true)} />}
      
      {/* Chat Widget */}
      <div className={`fixed bottom-4 right-4 z-50 transition-all duration-500 ease-in-out ${isExpanded ? 'w-[400px] h-[600px]' : 'w-16 h-16'}`}>
        {!isExpanded ? (
          <button
            onClick={() => setIsExpanded(true)}
            className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 to-blue-500 text-white flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 transform transition-all duration-300 hover:from-blue-500 hover:to-blue-400 overflow-hidden"
          >
            <img 
              src="/Images/profile.png" 
              alt="Devesh Bhardwaj"
              className="w-full h-full object-cover"
            />
          </button>
        ) : (
          <div className="w-full h-full bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden transform transition-all duration-300 animate-slideIn">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 p-4 flex justify-between items-center shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center shadow-inner overflow-hidden">
                  <img 
                    src="/Images/profile.png" 
                    alt="Devesh Bhardwaj"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-white">Ask Devesh</h1>
                  <p className="text-xs text-blue-100 opacity-90">Software Developer</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsExpanded(false)}
                  className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300"
                  title="Minimize"
                >
                  <span className="transform -translate-y-1">_</span>
                </button>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300"
                  title="Close"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Status Bar */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-4 py-2 text-xs text-blue-600 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span>Curious about me? Just ask!</span>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 text-sm animate-slideDown">
                <div className="flex items-center gap-2">
                  <span className="text-lg">⚠️</span>
                  <p>{error}</p>
                </div>
              </div>
            )}

            {/* Chat Window */}
            <div className="flex-1 overflow-hidden bg-gradient-to-b from-white to-blue-50">
              <ChatWindow 
                messages={messages} 
                loading={loading} 
              />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-blue-100 shadow-inner">
              <PromptInput onSend={handleSend} loading={loading} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App; 