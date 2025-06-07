import React from 'react';
import { XCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import { AppMessage } from '@/types';

interface AppMessageDisplayProps {
  message: AppMessage;
  onClearMessage: () => void;
}

const AppMessageDisplay: React.FC<AppMessageDisplayProps> = ({ message, onClearMessage }) => {
  if (!message.text) {
    return null;
  }

  const bgColor = message.type === 'success' ? 'bg-green-500/90' : message.type === 'error' ? 'bg-red-500/90' : 'bg-yellow-500/90';
  const Icon = message.type === 'success' ? CheckCircle : message.type === 'error' ? XCircle : AlertTriangle;

  return (
    <div className={`fixed top-4 right-4 z-[100] p-4 rounded-md shadow-lg text-white ${bgColor} flex items-center transition-all duration-300 ease-in-out animate-fadeIn`}>
      <Icon className="mr-3 h-6 w-6 flex-shrink-0" />
      <span className="flex-grow mr-2">{message.text}</span>
      <button 
        onClick={onClearMessage} 
        className="ml-auto p-1 rounded-full hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white"
        aria-label="Close message"
      >
        <XCircle className="h-5 w-5" />
      </button>
    </div>
  );
};

export default AppMessageDisplay;

// Add this to your index.css or a global stylesheet for the animation:
/*
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}
*/
