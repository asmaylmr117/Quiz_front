import React from 'react';

const LoadingSpinner = ({ message = 'Loading data...', color = 'blue' }) => {
  const colorMap = {
    blue: { primary: 'bg-blue-400', secondary: 'bg-purple-400', border: 'border-b-blue-400' },
    green: { primary: 'bg-green-400', secondary: 'bg-blue-400', border: 'border-b-green-400' },
  };

  const colors = colorMap[color] || colorMap.blue;

  return (
    <div className="flex flex-col items-center justify-center py-32">
      <div className="relative">
        <div className="h-16 w-16 rounded-full border-4 border-white border-opacity-20 border-t-white animate-spin"></div>
        <div
          className={`absolute inset-0 h-16 w-16 rounded-full border-4 border-transparent ${colors.border} animate-spin`}
          style={{ animationDuration: '1.5s', animationDirection: 'reverse' }}
        ></div>
      </div>
      <p className="text-white text-lg mt-6 font-medium animate-pulse">{message}</p>
      <div className="flex gap-1.5 mt-3">
        <div className={`h-2 w-2 rounded-full ${colors.primary} animate-bounce`} style={{ animationDelay: '0ms' }}></div>
        <div className={`h-2 w-2 rounded-full ${colors.secondary} animate-bounce`} style={{ animationDelay: '150ms' }}></div>
        <div className={`h-2 w-2 rounded-full ${colors.primary} animate-bounce`} style={{ animationDelay: '300ms' }}></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
