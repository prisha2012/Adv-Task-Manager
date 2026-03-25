import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

interface FloatingActionButtonProps {
  onClick: () => void;
  isOpen?: boolean;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ 
  onClick, 
  isOpen = false 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <button
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          relative w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 
          text-white rounded-full shadow-2xl hover:shadow-3xl
          transform transition-all duration-300 ease-out
          ${isHovered ? 'scale-110 rotate-3' : 'scale-100 rotate-0'}
          ${isOpen ? 'rotate-45' : 'rotate-0'}
          group overflow-hidden
        `}
      >
        {/* Ripple effect */}
        <div className={`
          absolute inset-0 bg-white rounded-full opacity-0 
          transform scale-0 transition-all duration-500
          ${isHovered ? 'opacity-20 scale-100' : 'opacity-0 scale-0'}
        `} />
        
        {/* Glow effect */}
        <div className={`
          absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 
          rounded-full blur-xl opacity-0 transition-opacity duration-300
          ${isHovered ? 'opacity-60' : 'opacity-0'}
        `} />
        
        {/* Icon */}
        <div className="relative z-10 flex items-center justify-center h-full">
          {isOpen ? (
            <X size={24} className="transform transition-transform duration-200" />
          ) : (
            <Plus size={24} className="transform transition-transform duration-200" />
          )}
        </div>
        
        {/* Pulse animation */}
        <div className={`
          absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 
          rounded-full animate-ping opacity-20
          ${!isOpen ? 'block' : 'hidden'}
        `} />
      </button>
    </div>
  );
};