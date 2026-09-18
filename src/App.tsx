import React, { useState } from 'react';
import { FeedbackForm } from './components/FeedbackForm';
import { SuccessPage } from './components/SuccessPage';
import { FeedbackData } from './types/feedback';

type AppView = 'form' | 'success';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('form');
  const [, setSubmittedData] = useState<FeedbackData | null>(null);

  const handleSubmit = (data: FeedbackData) => {
    // Here you would typically send the data to your backend/database
    console.log('Feedback submitted:', data);
    setSubmittedData(data);
    setCurrentView('success');
  };

  const handleRedirect = () => {
    // Reset the form and go back to the beginning
    setCurrentView('form');
    setSubmittedData(null);
  };

  return (
    <div className="font-sans">
      {currentView === 'form' && (
        <FeedbackForm onSubmit={handleSubmit} />
      )}
      {currentView === 'success' && (
        <SuccessPage onRedirect={handleRedirect} />
      )}
    </div>
  );
}

export default App;