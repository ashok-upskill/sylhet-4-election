// components/home/category-section.tsx
'use client';

import { useState } from 'react';
import { cn, toBengaliNumber } from '@/lib/utils';

// আগের ফাইল থেকে categoryLabels এর কি (key) গুলো ব্যবহার করা হয়েছে
// সাথে আপনার দেওয়া HTML এর ইমোজিগুলো যুক্ত করা হয়েছে
const CATEGORIES = [
  { id: 'all', label: 'সব', icon: '📋' },
  { id: 'roads', label: 'রাস্তাঘাট', icon: '🛣️' },
  { id: 'water', label: 'পানি', icon: '💧' },
  { id: 'electricity', label: 'বিদ্যুৎ', icon: '⚡' },
  { id: 'health', label: 'স্বাস্থ্য', icon: '🏥' },
  { id: 'education', label: 'শিক্ষা', icon: '📚' },
  { id: 'agriculture', label: 'কৃষি', icon: '🌾' },
  { id: 'environment', label: 'পরিবেশ/বন্যা', icon: '🌊' },
  { id: 'other', label: 'অন্যান্য', icon: '⋯' },
];

// এই ডাটাগুলো সাধারণত ডাটাবেস থেকে আসবে (props হিসেবে পাস করা যেতে পারে)
const MOCK_COUNTS: Record<string, number> = {
  all: 250,
  roads: 58,
  water: 42,
  electricity: 35,
  health: 28,
  education: 21,
  agriculture: 18,
  environment: 15,
  other: 33,
};

interface CategorySectionProps {
  initialCategory?: string;
  onCategoryChange?: (category: string) => void;
}

export function CategorySection({ 
  initialCategory = 'all', 
  onCategoryChange 
}: CategorySectionProps) {
  const [activeCategory, setActiveCategory] = useState(initialCategory);

  const handleCategoryClick = (id: string) => {
    setActiveCategory(id);
    if (onCategoryChange) {
      onCategoryChange(id);
    }
  };

  return (
    <section className="py-8 px-4 bg-gray-100">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          সমস্যার <span className="text-green-600">ধরন</span>
        </h2>

        <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar touch-pan-x">
          {CATEGORIES.map((category) => {
            const isActive = activeCategory === category.id;
            const count = MOCK_COUNTS[category.id] || 0;

            return (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={cn(
                  "flex items-center gap-2 px-5 py-3 rounded-full shadow-sm whitespace-nowrap border-2 transition-all duration-200",
                  isActive
                    ? "bg-white border-green-600 shadow-md"
                    : "bg-white border-transparent hover:border-gray-200 hover:shadow-md"
                )}
              >
                <span className="text-2xl">{category.icon}</span>
                
                <span className={cn(
                  "font-medium",
                  isActive ? "text-gray-900" : "text-gray-700"
                )}>
                  {category.label}
                </span>

                <span className={cn(
                  "text-xs px-2 py-0.5 rounded-full ml-1 font-medium transition-colors",
                  isActive
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
                )}>
                  {toBengaliNumber(count)}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}