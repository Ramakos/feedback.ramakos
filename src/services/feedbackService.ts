import { supabase } from '../lib/supabase';
import { FeedbackData } from '../types/feedback';

export interface SubmitFeedbackData {
  type: 'complaint' | 'suggestion';
  message: string;
  rating: number;
  image_url?: string | null;
  contact_number?: string | null;
}

const uploadImage = async (file: File): Promise<{ success: boolean; url?: string; error?: string }> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('report-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Upload error:', error);
      return { success: false, error: 'Failed to upload image' };
    }

    // Get public URL for the uploaded file
    const { data: { publicUrl } } = supabase.storage
      .from('report-images')
      .getPublicUrl(data.path);

    return { success: true, url: publicUrl };
  } catch (error) {
    console.error('Upload error:', error);
    return { success: false, error: 'Failed to upload image' };
  }
};

export const submitFeedback = async (data: FeedbackData): Promise<{ success: boolean; error?: string }> => {
  try {
    let imageUrl: string | null = null;

    // Upload image if provided
    if (data.file) {
      const uploadResult = await uploadImage(data.file);
      if (!uploadResult.success) {
        return { success: false, error: uploadResult.error };
      }
      imageUrl = uploadResult.url || null;
    }

    const feedbackData: SubmitFeedbackData = {
      type: data.type,
      message: data.message,
      rating: data.rating,
      image_url: imageUrl,
      contact_number: data.contact_number?.trim() || null,
    };

    const { error } = await supabase
      .from('feedback')
      .insert([feedbackData]);

    if (error) {
      console.error('Supabase error:', error);
      return { success: false, error: 'Failed to submit feedback. Please try again.' };
    }

    return { success: true };
  } catch (error) {
    console.error('Submission error:', error);
    return { success: false, error: 'Something went wrong. Please try again.' };
  }
};