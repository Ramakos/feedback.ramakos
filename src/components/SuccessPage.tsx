import React, { useEffect } from 'react';
import ramakosLogoFull from '../assets/ramakos-logo-full.png';

interface SuccessPageProps {
  onRedirect: () => void;
}

export const SuccessPage: React.FC<SuccessPageProps> = ({ onRedirect }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRedirect();
    }, 8000);

    return () => clearTimeout(timer);
  }, [onRedirect]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50/40 via-white to-neutral-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-red-100/60 p-8 max-w-sm w-full text-center">
        <div className="mb-6">
          <img
            src={ramakosLogoFull}
            alt="Ramakos Catering Service"
            className="h-14 w-auto mx-auto mb-4 object-contain"
          />
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100">
            <div className="text-[#CA251F] text-2xl font-bold">✓</div>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Thanks for sharing! 🙏
          </h1>
          
          <p className="text-gray-600 text-sm mb-4">
            We are listening and we truly care about your experience.
          </p>
          
          <div className="bg-red-50/70 border border-red-100 rounded-xl p-4 mb-6">
            <p className="text-xs text-[#CA251F] font-medium leading-relaxed">
              Your feedback has been received and directly sent to our management team to improve our service.
            </p>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-center space-x-2 text-xs text-gray-400">
            <div className="w-2 h-2 bg-[#CA251F] rounded-full animate-pulse"></div>
            <span>Returning to form shortly...</span>
          </div>
          
          <button
            onClick={onRedirect}
            className="text-sm text-[#CA251F] hover:text-[#B01F1A] font-medium transition-colors duration-200 underline"
          >
            Go back now
          </button>
        </div>
      </div>
    </div>
  );
};