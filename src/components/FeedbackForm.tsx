import React, { useState } from 'react';
import { Upload, AlertCircle } from 'lucide-react';
import { StarRating } from './StarRating';
import { FeedbackData, FormErrors } from '../types/feedback';
import { validateForm, isValidForm } from '../utils/validation';
import { submitFeedback } from '../services/feedbackService';

interface FeedbackFormProps {
  onSubmit: (data: FeedbackData) => void;
}

export const FeedbackForm: React.FC<FeedbackFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<Partial<FeedbackData>>({
    type: undefined,
    message: '',
    rating: 0,
    contact_number: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileName, setFileName] = useState<string>('');
  const [submitError, setSubmitError] = useState<string>('');

  const handleTypeChange = (type: 'complaint' | 'suggestion') => {
    setFormData(prev => ({ ...prev, type }));
    if (errors.type) {
      setErrors(prev => ({ ...prev, type: undefined }));
    }
  };

  const handleMessageChange = (message: string) => {
    setFormData(prev => ({ ...prev, message }));
    if (errors.message) {
      setErrors(prev => ({ ...prev, message: undefined }));
    }
  };

  const handleRatingChange = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
    if (errors.rating) {
      setErrors(prev => ({ ...prev, rating: undefined }));
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, file }));
      setFileName(file.name);
    }
  };

  const handleContactChange = (contact_number: string) => {
    setFormData(prev => ({ ...prev, contact_number }));
    if (errors.contact_number) {
      setErrors(prev => ({ ...prev, contact_number: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    const validationErrors = validateForm(formData);
    
    if (!isValidForm(validationErrors)) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    // Submit to Supabase
    const result = await submitFeedback(formData as FeedbackData);
    
    if (result.success) {
      onSubmit(formData as FeedbackData);
    } else {
      setSubmitError(result.error || 'Failed to submit feedback');
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50/40 via-white to-neutral-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-red-100/60 max-w-md w-full p-6">
        {/* Header with Ramakos Logo */}
        <div className="text-center mb-6">
          <img
            src="/src/assets/ramakos-logo.png"
            alt="Ramakos Logo"
            className="w-16 h-16 mx-auto mb-2 object-contain"
            onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
          />
          <span className="inline-block text-xs uppercase tracking-wider font-semibold text-[#CA251F] bg-red-50 px-3 py-1 rounded-full mb-2">
            Ramakos Catering Service
          </span>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            We'd love your feedback!
          </h1>
          <p className="text-sm text-gray-500">
            Good Food, Good Taste — help us serve you better
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Feedback Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              What type of feedback do you have?
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleTypeChange('complaint')}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  formData.type === 'complaint'
                    ? 'border-red-300 bg-red-50 text-red-700'
                    : 'border-gray-200 hover:border-red-200 hover:bg-red-50'
                }`}
              >
                <div className="text-lg mb-1">😞</div>
                <div className="font-medium">Complaint</div>
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange('suggestion')}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  formData.type === 'suggestion'
                    ? 'border-blue-300 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50'
                }`}
              >
                <div className="text-lg mb-1">💡</div>
                <div className="font-medium">Suggestion</div>
              </button>
            </div>
            {errors.type && (
              <p className="text-sm text-red-600 mt-2">{errors.type}</p>
            )}
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
              Tell us what's on your mind...
            </label>
            <textarea
              id="message"
              rows={4}
              value={formData.message}
              onChange={(e) => handleMessageChange(e.target.value)}
              placeholder="Share your thoughts with us..."
              className={`w-full p-4 border rounded-xl resize-none focus:ring-2 focus:ring-[#CA251F] focus:border-transparent transition-all duration-200 ${
                errors.message ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.message && (
              <p className="text-sm text-red-600 mt-2">{errors.message}</p>
            )}
          </div>

          {/* Star Rating */}
          <StarRating
            rating={formData.rating || 0}
            onRatingChange={handleRatingChange}
            error={errors.rating}
          />

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload a photo (optional)
            </label>
            <label className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-[#CA251F] hover:bg-red-50/50 transition-all duration-200 cursor-pointer">
              <div className="text-center">
                <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                <span className="text-sm text-gray-600">
                  {fileName || 'Tap to add photo'}
                </span>
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
            </label>
          </div>

          {/* Contact */}
          <div>
            <label htmlFor="contact_number" className="block text-sm font-medium text-gray-700 mb-2">
              Phone number (only if you want us to follow up)
            </label>
            <input
              id="contact_number"
              type="tel"
              value={formData.contact_number}
              onChange={(e) => handleContactChange(e.target.value)}
              placeholder="024 123 4567"
              className={`w-full p-4 border rounded-xl focus:ring-2 focus:ring-[#CA251F] focus:border-transparent transition-all duration-200 ${
                errors.contact_number ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.contact_number && (
              <p className="text-sm text-red-600 mt-2">{errors.contact_number}</p>
            )}
          </div>

          {/* Submit Error */}
          {submitError && (
            <div className="flex items-center space-x-2 p-4 bg-red-50 border border-red-200 rounded-xl">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-700">{submitError}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-[#CA251F] to-[#9B1C17] text-white font-semibold py-4 px-6 rounded-xl hover:from-[#B01F1A] hover:to-[#821410] focus:ring-4 focus:ring-red-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-red-500/20"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Sending...</span>
              </div>
            ) : (
              'Submit Feedback'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-6 text-xs text-gray-500 space-y-1">
          <div>Ramakos Catering Service — Kumasi Branch</div>
          <div className="text-gray-400">Stadium (Opposite Unity Oil) • +233 32 249 6812</div>
        </div>
      </div>
    </div>
  );
};