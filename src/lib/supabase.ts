import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      feedback: {
        Row: {
          id: string;
          type: 'complaint' | 'suggestion';
          message: string;
          rating: number;
          image_url: string | null;
          contact_number: string | null;
          status: 'new' | 'seen' | 'resolved';
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          type: 'complaint' | 'suggestion';
          message: string;
          rating: number;
          image_url?: string | null;
          contact_number?: string | null;
          status?: 'new' | 'seen' | 'resolved';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          type?: 'complaint' | 'suggestion';
          message?: string;
          rating?: number;
          image_url?: string | null;
          contact_number?: string | null;
          status?: 'new' | 'seen' | 'resolved';
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};