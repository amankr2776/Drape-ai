
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  cover_url: string | null;
  bio: string | null;
  phone: string | null;
  location: string | null;
  website: string | null;
  date_of_birth: string | null;
  gender: string | null;
  role: 'user' | 'pro' | 'admin' | 'moderator';
  is_verified: boolean;
  is_onboarded: boolean;
  theme: 'dark' | 'light' | 'system';
  accent_color: string;
  created_at: string;
  updated_at: string;
};

export type StyleProfile = {
  id: string;
  user_id: string;
  body_shape: string | null;
  skin_tone: string | null;
  skin_tone_hex: string | null;
  height_cm: number | null;
  weight_range: string | null;
  size: string | null;
  occasions: string[];
  budget_min: number;
  budget_max: number;
  favorite_colors: string[];
  style_vibes: string[];
  photo_url: string | null;
  analyzed_at: string | null;
};
