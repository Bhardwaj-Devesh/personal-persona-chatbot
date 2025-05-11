import React, { useCallback } from "react";
import ReactMarkdown from "react-markdown";

// Message component to handle individual messages
const Message = ({ msg }) => {
  // Custom link renderer specific to this message
  const CustomLink = ({ href, children }) => {
    const linkName = getLinkName(href, children);
    
    return (
      <a 
        href={href}
        onClick={(e) => {
          e.preventDefault();
          window.open(href, '_blank', 'noopener,noreferrer');
        }}
        className={`
          font-medium
          relative
          cursor-pointer
          ${msg.role === "user" 
            ? "text-blue-100 hover:text-blue-200 visited:text-blue-300"
            : "text-blue-500 hover:text-blue-600 visited:text-purple-500"}
        `}
      >
        {linkName}
      </a>
    );
  };

  return (
    <div className={`prose prose-sm max-w-none ${
      msg.role === "user" ? "text-white prose-invert" : "text-gray-700"
    }`}>
      <ReactMarkdown
        components={{
          a: CustomLink
        }}
      >
        {msg.text}
      </ReactMarkdown>
    </div>
  );
};

// Function to extract meaningful names from links
const getLinkName = (href, children) => {
  // If children exist and are not the URL, use them
  if (children && children.toString() !== href) {
    return children;
  }

  // Extract name from URL
  try {
    const url = new URL(href);
    
    // Handle social media links
    if (url.hostname.includes('linkedin')) return 'LinkedIn Profile';
    if (url.hostname.includes('github')) return 'GitHub Profile';
    if (url.hostname.includes('instagram')) return 'Instagram Profile';
    if (url.hostname.includes('twitter') || url.hostname.includes('x.com')) return 'Twitter Profile';
    if (url.hostname.includes('youtube')) return 'YouTube Channel';
    if (url.hostname.includes('codechef')) return 'CodeChef Profile';
    if (url.hostname.includes('leetcode')) return 'LeetCode Profile';
    if (url.hostname.includes('codeforces')) return 'CodeForces Profile';
    if (url.hostname.includes('drive.google')) return 'View Document';
    if (url.hostname.includes('huggingface')) return 'HuggingFace Demo';
    if (url.hostname.includes('notion')) return 'Project Details';
    if (url.hostname.includes('netlify')) return 'Live Demo';
    
    // For other links, use the pathname
    const pathName = url.pathname.split('/').filter(Boolean).pop();
    return pathName ? pathName.replace(/-/g, ' ').replace(/\.[^/.]+$/, '') : 'Visit Link';
  } catch {
    return 'Visit Link';
  }
};

const ChatWindow = ({ messages, loading }) => {
  return (
    <div className="h-full overflow-y-auto p-4 space-y-4 scroll-smooth">
      {messages.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-gray-400">
          <div className="text-center p-6 max-w-md">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4 animate-bounce overflow-hidden">
              <img 
                src="/Images/profile.png" 
                alt="Devesh Bhardwaj"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-semibold mb-2 bg-gradient-to-r from-blue-600 to-blue-400 text-transparent bg-clip-text">
              Ask Devesh
            </h3>
            <p className="text-sm text-gray-500">
              Start chatting with Devesh Bhardwaj!
            </p>
          </div>
        </div>
      ) : (
        messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fadeIn`}
          >
            <div
              className={`max-w-[85%] px-4 py-3 rounded-2xl shadow-md hover:shadow-lg transition-shadow ${
                msg.role === "user"
                  ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white"
                  : "bg-gradient-to-br from-gray-50 to-white border border-blue-100"
              }`}
            >
              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-blue-100/30">
                <span className={`text-xs font-medium ${
                  msg.role === "user"
                    ? "text-blue-100"
                    : "text-blue-600"
                }`}>
                  {msg.role === "user" ? "You" : "Devesh Bhardwaj"}
                </span>
              </div>
              <Message msg={msg} />
            </div>
          </div>
        ))
      )}
      {loading && (
        <div className="flex justify-start animate-fadeIn">
          <div className="max-w-[85%] px-4 py-3 rounded-2xl bg-gradient-to-br from-gray-50 to-white shadow-md border border-blue-100">
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-blue-100/30">
              <span className="text-xs font-medium text-blue-600">
                Devesh Bhardwaj
              </span>
            </div>
            <div className="flex items-center gap-1 py-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWindow; 