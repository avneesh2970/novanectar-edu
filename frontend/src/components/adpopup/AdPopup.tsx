import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AdPopup = ({ imageSrc, onClose }:any) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show popup after a small delay for better UX
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300); // Wait for animation to complete
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleBackdropClick = (e:any) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isVisible) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm transition-all duration-300"
      onClick={handleBackdropClick}
    >
      <div 
        className={`relative max-w-lg w-full mx-4 transform transition-all duration-300 ${
          isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute -top-4 -right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors duration-200 group"
        >
          <X className="w-5 h-5 text-gray-600 group-hover:text-gray-800" />
        </button>

        {/* Image container with beautiful styling */}
        <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-white">
          {/* Decorative border */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-1 rounded-2xl">
            <div className="w-full h-full bg-white rounded-xl"></div>
          </div>
          
          {/* Main image */}
          <div className="relative z-10 p-4">
            <img
              src={imageSrc}
              alt="Advertisement"
              className="w-full h-auto rounded-lg shadow-lg object-cover"
              style={{ maxHeight: '74vh' }}
            />
          </div>
        </div>

        {/* Optional: Add a subtle glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-20 blur-xl -z-10 rounded-2xl"></div>
      </div>
    </div>
  );
};

export default AdPopup;