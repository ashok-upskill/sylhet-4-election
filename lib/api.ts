// lib/api.ts

import { createClient } from './supabase';
import { Problem, ProblemInsert } from '@/types/database';

// ১. নতুন সমস্যা জমা দেওয়া
export async function submitProblem(data: ProblemInsert) {
  const supabase = createClient();
  
  const { data: result, error } = await supabase
    .from('problems')
    .insert([data])
    .select()
    .single();

  if (error) {
    console.error('Error submitting problem:', error);
    throw new Error('সমস্যা জমা দেওয়া সম্ভব হয়নি। আবার চেষ্টা করুন।');
  }

  return result;
}

// ২. সাম্প্রতিক সমস্যা (হোমপেজের জন্য)
export async function getRecentProblems(limit = 6) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('problems')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching recent problems:', error);
    return [];
  }

  return (data || []) as Problem[];
}

// ৩. সব সমস্যা (ফিল্টার ও পেজিনেশনসহ)
export async function getProblems(options: {
  page?: number;
  limit?: number;
  category?: string;
  status?: string;
  upazila?: string;
  search?: string;
} = {}) {
  const supabase = createClient();
  
  const {
    page = 1,
    limit = 9,
    category,
    status,
    upazila,
    search
  } = options;

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from('problems')
    .select('*', { count: 'exact' });

  if (category && category !== 'all') {
    query = query.eq('category', category);
  }
  
  if (status && status !== 'all') {
    query = query.eq('status', status);
  }

  if (upazila && upazila !== 'all') {
    query = query.eq('upazila', upazila);
  }

  if (search && search.trim() !== '') {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
  }

  const { data, error, count } = await query
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    console.error('Error fetching problems:', error);
    return { problems: [], total: 0 };
  }

  return { 
    problems: (data || []) as Problem[], 
    total: count || 0 
  };
}

// ৪. একটি নির্দিষ্ট সমস্যা (ডিটেইল পেজের জন্য)
export async function getProblemById(id: number) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('problems')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching problem:', error);
    return null;
  }

  return data as Problem;
}

// ৫. ভিউ কাউন্ট বাড়ানো
export async function incrementViewCount(id: number) {
  const supabase = createClient();
  
  try {
    const { data: problem } = await supabase
      .from('problems')
      .select('views_count')
      .eq('id', id)
      .single();

    if (problem) {
      await supabase
        .from('problems')
        .update({ views_count: (problem.views_count || 0) + 1 })
        .eq('id', id);
    }
  } catch (error) {
    console.log('View count increment skipped:', error);
  }
}

// ৬. ছবি আপলোড
export async function uploadImage(file: File) {
  const supabase = createClient();
  
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  
  const { data, error } = await supabase.storage
    .from('problem-images')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    console.error('Upload error:', error);
    throw new Error('ছবি আপলোড ব্যর্থ হয়েছে');
  }

  const { data: publicUrlData } = supabase.storage
    .from('problem-images')
    .getPublicUrl(fileName);

  return publicUrlData.publicUrl;
}

// ৭. পরিসংখ্যান (Stats Page এর জন্য)
export async function getStats() {
  const supabase = createClient();
  
  const { count: totalProblems } = await supabase
    .from('problems')
    .select('*', { count: 'exact', head: true });

  const { count: resolvedProblems } = await supabase
    .from('problems')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'resolved');

  const { count: inProgressProblems } = await supabase
    .from('problems')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'in_progress');

  const { count: pendingProblems } = await supabase
    .from('problems')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending');

  return {
    total: totalProblems || 0,
    resolved: resolvedProblems || 0,
    inProgress: inProgressProblems || 0,
    pending: pendingProblems || 0,
  };
}

// ৮. সমস্যার স্ট্যাটাস আপডেট করা (Admin Only)
export async function updateProblemStatus(id: number, status: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('problems')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating status:', error);
    throw new Error('স্ট্যাটাস আপডেট করা যায়নি');
  }

  return data;
}

// ৯. সমস্যা ডিলিট করা (Admin Only)
export async function deleteProblem(id: number) {
  const supabase = createClient();
  
  const { error } = await supabase
    .from('problems')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting problem:', error);
    throw new Error('সমস্যা ডিলিট করা যায়নি');
  }

  return true;
}

// ১০. সব সমস্যা আনা (Admin - With Pagination & Filters)
export async function getAllProblemsForAdmin(options: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
} = {}): Promise<{ problems: Problem[]; total: number }> {
  const supabase = createClient();
  
  const {
    page = 1,
    limit = 10,
    status = '',
    search = '',
  } = options;

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from('problems')
    .select('*', { count: 'exact' });

  if (status && status !== '') {
    query = query.eq('status', status);
  }

  if (search && search.trim() !== '') {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,submitter_name.ilike.%${search}%`);
  }

  const { data, error, count } = await query
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    console.error('Error fetching problems for admin:', error);
    return { problems: [], total: 0 };
  }

  return {
    problems: (data || []) as Problem[],
    total: count || 0,
  };
}

// ==================== SETTINGS MANAGEMENT ====================

export interface SettingsOption {
  value: string;
  label: string;
}

export async function getCategories(): Promise<SettingsOption[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('app_settings')
    .select('setting_value')
    .eq('setting_key', 'categories')
    .single();

  if (error || !data) {
    console.error('Error fetching categories:', error);
    return [];
  }

  return data.setting_value as SettingsOption[];
}

export async function getUpazilas(): Promise<SettingsOption[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('app_settings')
    .select('setting_value')
    .eq('setting_key', 'upazilas')
    .single();

  if (error || !data) {
    console.error('Error fetching upazilas:', error);
    return [];
  }

  return data.setting_value as SettingsOption[];
}

export async function getUnions(): Promise<Record<string, SettingsOption[]>> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('app_settings')
    .select('setting_value')
    .eq('setting_key', 'unions')
    .single();

  if (error || !data) {
    console.error('Error fetching unions:', error);
    return {};
  }

  return data.setting_value as Record<string, SettingsOption[]>;
}

export async function updateCategories(categories: SettingsOption[]): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase
    .from('app_settings')
    .update({ 
      setting_value: categories,
      updated_at: new Date().toISOString() 
    })
    .eq('setting_key', 'categories');

  if (error) {
    console.error('Error updating categories:', error);
    return false;
  }

  return true;
}

export async function updateUpazilas(upazilas: SettingsOption[]): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase
    .from('app_settings')
    .update({ 
      setting_value: upazilas,
      updated_at: new Date().toISOString() 
    })
    .eq('setting_key', 'upazilas');

  if (error) {
    console.error('Error updating upazilas:', error);
    return false;
  }

  return true;
}

export async function updateUnions(unions: Record<string, SettingsOption[]>): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase
    .from('app_settings')
    .update({ 
      setting_value: unions,
      updated_at: new Date().toISOString() 
    })
    .eq('setting_key', 'unions');

  if (error) {
    console.error('Error updating unions:', error);
    return false;
  }

  return true;
}

// ==================== SITE SETTINGS ====================

export interface SiteInfo {
  site_name: string;
  tagline: string;
  logo_url: string;
  symbol_url: string;
  contact_phone: string;
  contact_email: string;
  office_address: string;
}

export interface CandidateInfo {
  name: string;
  name_english: string;
  photo_url: string;
  designation: string;
  symbol: string;
  bio: string;
  vision: string;
  education: string;
  experience: string;
}

export interface SocialLinks {
  facebook: string;
  twitter: string;
  instagram: string;
  youtube: string;
  linkedin: string;
}

export async function getSiteInfo(): Promise<SiteInfo | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('site_settings')
    .select('data')
    .eq('setting_type', 'site_info')
    .single();

  if (error || !data) {
    console.error('Error fetching site info:', error);
    return null;
  }

  return data.data as SiteInfo;
}

export async function getCandidateInfo(): Promise<CandidateInfo | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('site_settings')
    .select('data')
    .eq('setting_type', 'candidate_info')
    .single();

  if (error || !data) {
    console.error('Error fetching candidate info:', error);
    return null;
  }

  return data.data as CandidateInfo;
}

export async function getSocialLinks(): Promise<SocialLinks | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('site_settings')
    .select('data')
    .eq('setting_type', 'social_links')
    .single();

  if (error || !data) {
    console.error('Error fetching social links:', error);
    return null;
  }

  return data.data as SocialLinks;
}

export async function updateSiteInfo(siteInfo: SiteInfo): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase
    .from('site_settings')
    .update({ 
      data: siteInfo,
      updated_at: new Date().toISOString() 
    })
    .eq('setting_type', 'site_info');

  if (error) {
    console.error('Error updating site info:', error);
    return false;
  }

  return true;
}

export async function updateCandidateInfo(candidateInfo: CandidateInfo): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase
    .from('site_settings')
    .update({ 
      data: candidateInfo,
      updated_at: new Date().toISOString() 
    })
    .eq('setting_type', 'candidate_info');

  if (error) {
    console.error('Error updating candidate info:', error);
    return false;
  }

  return true;
}

export async function updateSocialLinks(socialLinks: SocialLinks): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase
    .from('site_settings')
    .update({ 
      data: socialLinks,
      updated_at: new Date().toISOString() 
    })
    .eq('setting_type', 'social_links');

  if (error) {
    console.error('Error updating social links:', error);
    return false;
  }

  return true;
}

// Upload image to site-assets bucket
export async function uploadSiteAsset(file: File, folder: 'logos' | 'photos' | 'symbols'): Promise<string> {
  const supabase = createClient();
  
  const fileExt = file.name.split('.').pop();
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  
  const { data, error } = await supabase.storage
    .from('site-assets')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    console.error('Upload error:', error);
    throw new Error('ছবি আপলোড ব্যর্থ হয়েছে');
  }

  const { data: publicUrlData } = supabase.storage
    .from('site-assets')
    .getPublicUrl(fileName);

  return publicUrlData.publicUrl;
}

// ==========================================
// Upazila Statistics (NEW)
// ==========================================

export interface UpazilaStats {
  name: string;
  slug: string;
  unions_count: number;
  problems_count: number;
  solved_count: number;
}

// ==========================================
// Upazila Statistics (FIXED)
// ==========================================

export interface UpazilaStats {
  name: string;
  slug: string;
  unions_count: number;
  problems_count: number;
  solved_count: number;
}

export async function getUpazilaStats(): Promise<UpazilaStats[]> {
  const supabase = createClient();
  
  // Upazila config - Bengali name, English key for unions, and slug
  const upazilaConfig = [
    { name: 'কোম্পানীগঞ্জ', unionKey: 'companiganj', slug: 'companiganj' },
    { name: 'গোয়াইনঘাট', unionKey: 'gowainghat', slug: 'gowainghat' },
    { name: 'জৈন্তাপুর', unionKey: 'jaintapur', slug: 'jaintapur' },
  ];

  try {
    // Get unions settings
    const { data: unionsSettings } = await supabase
      .from('app_settings')
      .select('setting_value')
      .eq('setting_key', 'unions')
      .single();

    const unionsData = (unionsSettings?.setting_value || {}) as Record<string, Array<{ label: string; value: string }>>;

    // Get all problems
    const { data: problems } = await supabase
      .from('problems')
      .select('upazila, status');

    const stats: UpazilaStats[] = upazilaConfig.map((upazila) => {
      // Filter problems for this upazila (using Bengali name)
      const upazilaProblems = problems?.filter((p) => p.upazila === upazila.name) || [];
      const problemsCount = upazilaProblems.length;
      const solvedCount = upazilaProblems.filter((p) => p.status === 'resolved').length;
      
      // Get unions count using English key
      const upazilaUnions = unionsData[upazila.unionKey];
      const unionsCount = Array.isArray(upazilaUnions) ? upazilaUnions.length : 0;

      return {
        name: upazila.name,
        slug: upazila.slug,
        unions_count: unionsCount,
        problems_count: problemsCount,
        solved_count: solvedCount,
      };
    });

    return stats;
  } catch (error) {
    console.error('Error fetching upazila stats:', error);
    return upazilaConfig.map((u) => ({
      name: u.name,
      slug: u.slug,
      unions_count: 0,
      problems_count: 0,
      solved_count: 0,
    }));
  }
}