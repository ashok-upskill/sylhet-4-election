export type ProblemCategory = 
  | 'road'
  | 'water'
  | 'electricity'
  | 'education'
  | 'health'
  | 'agriculture'
  | 'internet'
  | 'law_and_order'
  | 'other';

export type ProblemStatus = 
  | 'pending'
  | 'approved'
  | 'in_progress'
  | 'resolved'
  | 'rejected';

export interface Problem {
  id: number;
  created_at: string;
  title: string;
  description: string;
  category: ProblemCategory;
  upazila: string;
  union_name: string;
  ward?: string;
  address_details?: string;
  submitter_name: string;
  submitter_phone: string;
  status: ProblemStatus;
  images: string[];
  votes_count: number;
  views_count: number;
}

// সমস্যা সাবমিট করার সময় যেসব তথ্য লাগবে
export interface ProblemInsert {
  title: string;
  description: string;
  category: ProblemCategory;
  upazila: string;
  union_name: string;
  ward?: string;
  address_details?: string;
  submitter_name: string;
  submitter_phone: string;
  images?: string[];
}