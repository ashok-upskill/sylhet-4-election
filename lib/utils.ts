// lib/utils.ts

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind CSS classes with proper precedence
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Convert English numbers to Bengali
 */
export function toBanglaNumber(num: number | string): string {
  const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return num
    .toString()
    .split("")
    .map((d) => banglaDigits[parseInt(d)] || d)
    .join("");
}

// Alias for consistency (some components use this name)
export const toBengaliNumber = toBanglaNumber;

/**
 * Format relative time in Bengali
 */
export function formatRelativeTime(dateInput: string | Date | null | undefined): string {
  // যদি ইনপুট না থাকে
  if (!dateInput) {
    return "অজানা সময়";
  }

  // যদি ইনপুট স্ট্রিং হয়, তবে সেটিকে Date অবজেক্টে কনভার্ট করা
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  
  // যদি ভ্যালিড Date না হয়
  if (isNaN(date.getTime())) {
    return "অজানা সময়";
  }

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "এইমাত্র";
  }

  const minutes = Math.floor(diffInSeconds / 60);
  if (minutes < 60) {
    return `${toBanglaNumber(minutes)} মিনিট আগে`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${toBanglaNumber(hours)} ঘণ্টা আগে`;
  }

  const days = Math.floor(hours / 24);
  if (days < 7) {
    return `${toBanglaNumber(days)} দিন আগে`;
  }

  const weeks = Math.floor(days / 7);
  if (weeks < 4) {
    return `${toBanglaNumber(weeks)} সপ্তাহ আগে`;
  }

  const months = Math.floor(days / 30);
  if (months < 12) {
    return `${toBanglaNumber(months)} মাস আগে`;
  }

  const years = Math.floor(days / 365);
  return `${toBanglaNumber(years)} বছর আগে`;
}

/**
 * Format number with Bengali numerals
 */
export function formatNumber(num: number): string {
  return toBanglaNumber(num.toLocaleString("en-IN"));
}

/**
 * Format large numbers with Bengali (কোটি, লক্ষ, হাজার)
 */
export function formatBengaliNumber(num: number): string {
  if (num >= 10000000) {
    return toBanglaNumber(Math.floor(num / 10000000)) + ' কোটি';
  }
  if (num >= 100000) {
    return toBanglaNumber(Math.floor(num / 100000)) + ' লক্ষ';
  }
  if (num >= 1000) {
    return toBanglaNumber(Math.floor(num / 1000)) + ' হাজার';
  }
  return toBanglaNumber(num);
}

/**
 * Format date in Bengali
 */
export function formatBengaliDate(date: string | Date): string {
  const d = new Date(date);
  const months = [
    'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
    'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
  ];
  
  const day = toBanglaNumber(d.getDate());
  const month = months[d.getMonth()];
  const year = toBanglaNumber(d.getFullYear());
  
  return `${day} ${month}, ${year}`;
}

/**
 * Truncate text with ellipsis
 */
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

/**
 * Validate phone number (Bangladesh)
 */
export function isValidBangladeshiPhone(phone: string): boolean {
  const phoneRegex = /^(?:\+?88)?01[3-9]\d{8}$/;
  return phoneRegex.test(phone.replace(/\s|-/g, ''));
}

/**
 * Format phone number
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('88')) {
    return '+' + cleaned;
  }
  if (cleaned.startsWith('01')) {
    return '+88' + cleaned;
  }
  return phone;
}

/**
 * Generate unique ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

// Category labels
export const categoryLabels: Record<string, string> = {
  roads: 'রাস্তা',
  water: 'পানি',
  electricity: 'বিদ্যুৎ',
  education: 'শিক্ষা',
  health: 'স্বাস্থ্য',
  agriculture: 'কৃষি',
  environment: 'পরিবেশ',
  other: 'অন্যান্য',
};

// Status labels
export const statusLabels: Record<string, string> = {
  pending: 'অপেক্ষমাণ',
  approved: 'অনুমোদিত',
  in_progress: 'কাজ চলছে',
  resolved: 'সমাধান হয়েছে',
  rejected: 'বাতিল',
};

// Upazila labels
export const upazilaLabels: Record<string, string> = {
  balaganj: 'বালাগঞ্জ',
  bishwanath: 'বিশ্বনাথ',
  dakshin_surma: 'দক্ষিণ সুরমা',
  fenchuganj: 'ফেঞ্চুগঞ্জ',
  golapganj: 'গোলাপগঞ্জ',
  osmaninagar: 'ওসমানীনগর',
};