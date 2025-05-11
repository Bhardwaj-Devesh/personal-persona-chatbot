import React, { useState, useEffect } from 'react';

const ChatNotification = ({ onExpand }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState(0);
  const [isLeaving, setIsLeaving] = useState(false);

  const messages = [
    "Want to know about me? Let's chat! 👋",
    "Curious about my journey? Tap to chat!🚀",
    "Want to see cool projects I've built? Let's talk!✨",
    "Let's discuss software development or AI!🤖"
  ];

  const showNotification = () => {
    setIsLeaving(false);
    setIsVisible(true);
    // Start fade out after 4 seconds
    setTimeout(() => {
      setIsLeaving(true);
      // Actually hide after fade out animation (0.5s)
      setTimeout(() => setIsVisible(false), 500);
    }, 8000);
  };

  useEffect(() => {
    // Show first notification immediately
    showNotification();

    // Show notification every 45 seconds
    const interval = setInterval(() => {
      setMessage((prev) => (prev + 1) % messages.length);
      showNotification();
    }, 45000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div 
      className={`
        fixed bottom-24 right-4 max-w-sm 
        bg-white rounded-lg shadow-lg border border-blue-100 p-4 
        cursor-pointer transform hover:scale-105 
        transition-all duration-500 ease-in-out
        ${isLeaving ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}
        animate-slideInUp
      `}
      onClick={() => {
        setIsVisible(false);
        onExpand();
      }}
    >
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-blue-100 overflow-hidden">
            <img 
              src="/Images/profile.png" 
              alt="Devesh Bhardwaj"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Animated online indicator */}
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-gray-900 flex items-center gap-2">
            Devesh Bhardwaj
            <span className="text-xs text-green-500">Online</span>
          </h4>
          <p className="text-sm text-gray-600 mt-1 animate-fadeIn">
            {messages[message]}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatNotification; 