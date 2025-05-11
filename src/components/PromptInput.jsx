import React, { useState } from "react";

const PromptInput = ({ onSend, loading }) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !loading) {
      onSend(input.trim());
      setInput("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask me anything about development..."
        className="w-full px-4 py-3 pr-24 rounded-xl border border-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 placeholder-gray-400 bg-white transition-all duration-300"
        disabled={loading}
      />
      <button
        type="submit"
        disabled={!input.trim() || loading}
        className={`absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-lg font-medium transition-all duration-300 ${
          !input.trim() || loading
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:shadow-lg hover:scale-105 transform active:scale-95"
        }`}
      >
        {loading ? (
          <div className="flex items-center gap-1">
            <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse"></div>
            <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse delay-100"></div>
            <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse delay-200"></div>
          </div>
        ) : (
          "Send"
        )}
      </button>
    </form>
  );
};

export default PromptInput; 