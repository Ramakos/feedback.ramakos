import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  error?: string;
}

export const StarRating: React.FC<StarRatingProps> = ({ rating, onRatingChange, error }) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        How would you rate your experience?
      </label>
      <div className="flex justify-center space-x-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRatingChange(star)}
            className="p-2 rounded-full hover:bg-amber-50 transition-colors duration-200"
          >
            <Star
              size={32}
              className={`transition-all duration-200 ${
                star <= rating
                  ? 'fill-amber-400 text-amber-400'
                  : 'text-gray-300 hover:text-amber-300'
              }`}
            />
          </button>
        ))}
      </div>
      {error && (
        <p className="text-sm text-red-600 text-center">{error}</p>
      )}
    </div>
  );
};