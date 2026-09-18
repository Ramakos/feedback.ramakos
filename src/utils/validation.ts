import { FeedbackData, FormErrors } from '../types/feedback';

export const validateForm = (data: Partial<FeedbackData>): FormErrors => {
  const errors: FormErrors = {};

  if (!data.type) {
    errors.type = 'Please select feedback type';
  }

  if (!data.message || data.message.trim().length === 0) {
    errors.message = 'Please share your feedback';
  }

  if (!data.rating || data.rating === 0) {
    errors.rating = 'Please give us a rating';
  }

  if (data.rating && (data.rating < 1 || data.rating > 5)) {
    errors.rating = 'Rating must be between 1 and 5 stars';
  }

  if (data.contact_number && data.contact_number.trim().length > 0) {
    const phoneRegex = /^[+]?[\s\d\-()]{10,}$/;
    if (!phoneRegex.test(data.contact_number.trim())) {
      errors.contact_number = 'Please enter a valid phone number';
    }
  }

  return errors;
};

export const isValidForm = (errors: FormErrors): boolean => {
  return Object.keys(errors).length === 0;
};