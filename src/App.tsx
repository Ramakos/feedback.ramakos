import React, { useState } from 'react';
import { FeedbackForm } from './components/FeedbackForm';
import { SuccessPage } from './components/SuccessPage';
import { FeedbackData } from './types/feedback';
import { ToastProvider } from './components/Toast';

type AppView = 'form' | 'success';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('form');
  const [, setSubmittedData] = useState<FeedbackData | null>(null);

  const handleSubmit = (data: FeedbackData) => {
    console.log('Feedback submitted:', data);
    setSubmittedData(data);
    setCurrentView('success');
  };

  const handleRedirect = () => {
    setCurrentView('form');
    setSubmittedData(null);
  };

  return (
    <ToastProvider>
      <div className="font-sans">
        {currentView === 'form' && (
          <FeedbackForm onSubmit={handleSubmit} />
        )}
        {currentView === 'success' && (
          <SuccessPage onRedirect={handleRedirect} />
        )}
      </div>
    </ToastProvider>
  );
}

export default App;