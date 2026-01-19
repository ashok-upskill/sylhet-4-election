// types/database.ts

export interface Problem {
  id: number;
  created_at: string;
  title: string;
  description: string;
  category: string;
  upazila: string;
  union_name: string;
  ward?: string | null;
  address_details?: string | null;
  submitter_name: string;
  submitter_phone: string;
  status: 'pending' | 'approved' | 'in_progress' | 'resolved' | 'rejected';
  images: string[];
  votes_count: number;
  views_count: number;
}

// Insert করার সময় এই fields optional বা auto-generated
export interface ProblemInsert {
  title: string;
  description: string;
  category: string;
  upazila: string;
  union_name: string;
  ward?: string | null;
  address_details?: string | null;
  submitter_name: string;
  submitter_phone: string;
  images?: string[];
  status?: 'pending' | 'approved' | 'in_progress' | 'resolved' | 'rejected';
  votes_count?: number;
  views_count?: number;
}

// Update করার সময় সব fields optional
export interface ProblemUpdate {
  title?: string;
  description?: string;
  category?: string;
  upazila?: string;
  union_name?: string;
  ward?: string | null;
  address_details?: string | null;
  submitter_name?: string;
  submitter_phone?: string;
  status?: 'pending' | 'approved' | 'in_progress' | 'resolved' | 'rejected';
  images?: string[];
  votes_count?: number;
  views_count?: number;
}

export interface AppSettings {
  id: number;
  setting_key: string;
  setting_value: any;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
}

export interface Upazila {
  id: string;
  name: string;
}

export interface Union {
  id: string;
  name: string;
  upazila_id: string;
}

// Database response types
export interface Database {
  public: {
    Tables: {
      problems: {
        Row: Problem;
        Insert: ProblemInsert;
        Update: ProblemUpdate;
      };
      app_settings: {
        Row: AppSettings;
        Insert: Omit<AppSettings, 'id' | 'updated_at'>;
        Update: Partial<Omit<AppSettings, 'id'>>;
      };
    };
  };
}