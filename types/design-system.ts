/* ================================================
   Design System Type Definitions
   ================================================ */

// Status Types
// সব সম্ভাব্য status values
export type ProblemStatus = 
  | 'pending' 
  | 'seen' 
  | 'promised' 
  | 'solved'
  | 'approved' 
  | 'in_progress' 
  | 'resolved' 
  | 'rejected';
  
// Category Types
export type ProblemCategory =
  | "road"
  | "water"
  | "electricity"
  | "health"
  | "education"
  | "agriculture"
  | "flood"
  | "other";

// Upazila Types
export type Upazila = "companyganj" | "gowainghat" | "jaintapur";

// Status Configuration
export const STATUS_CONFIG: Record<
  ProblemStatus,
  {
    labelBn: string;
    bgColor: string;
    textColor: string;
  }
> = {
  pending: {
    labelBn: "অপেক্ষায়",
    bgColor: "bg-amber-500",
    textColor: "text-amber-700",
  },
  seen: {
    labelBn: "দেখা হয়েছে",
    bgColor: "bg-blue-500",
    textColor: "text-blue-700",
  },
  promised: {
    labelBn: "প্রতিশ্রুতি",
    bgColor: "bg-purple-500",
    textColor: "text-purple-700",
  },
  solved: {
    labelBn: "সমাধান",
    bgColor: "bg-green-500",
    textColor: "text-green-700",
  },
};

// Category Configuration
export const CATEGORY_CONFIG: Record<
  ProblemCategory,
  {
    labelBn: string;
    emoji: string;
    color: string;
  }
> = {
  road: { labelBn: "রাস্তাঘাট", emoji: "🛣️", color: "bg-blue-500" },
  water: { labelBn: "পানি", emoji: "💧", color: "bg-cyan-500" },
  electricity: { labelBn: "বিদ্যুৎ", emoji: "⚡", color: "bg-yellow-500" },
  health: { labelBn: "স্বাস্থ্য", emoji: "🏥", color: "bg-red-500" },
  education: { labelBn: "শিক্ষা", emoji: "📚", color: "bg-purple-500" },
  agriculture: { labelBn: "কৃষি", emoji: "🌾", color: "bg-green-500" },
  flood: { labelBn: "বন্যা", emoji: "🌊", color: "bg-sky-500" },
  other: { labelBn: "অন্যান্য", emoji: "📝", color: "bg-gray-500" },
};

// Upazila Configuration
export const UPAZILA_CONFIG: Record<
  Upazila,
  {
    nameBn: string;
    nameEn: string;
    unions: number;
    gradient: string;
  }
> = {
  companyganj: {
    nameBn: "কোম্পানীগঞ্জ",
    nameEn: "Companyganj",
    unions: 7,
    gradient: "from-primary to-primary-600",
  },
  gowainghat: {
    nameBn: "গোয়াইনঘাট",
    nameEn: "Gowainghat",
    unions: 11,
    gradient: "from-accent to-accent-600",
  },
  jaintapur: {
    nameBn: "জৈন্তাপুর",
    nameEn: "Jaintapur",
    unions: 6,
    gradient: "from-amber-500 to-orange-600",
  },
};