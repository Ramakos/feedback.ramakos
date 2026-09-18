export interface FeedbackData {
  type: 'complaint' | 'suggestion';
  message: string;
  rating: number;
  file?: File;
  contact_number?: string;
}

export interface FormErrors {
  type?: string;
  message?: string;
  rating?: string;
  contact_number?: string;
}