"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { CATEGORY_CONFIG, type ProblemCategory } from "@/types/design-system";
import { toBanglaNumber } from "@/lib/utils";

interface CategoryData {
  category: ProblemCategory;
  count: number;
}

const categories: CategoryData[] = [
  { category: "road", count: 58 },
  { category: "water", count: 42 },
  { category: "electricity", count: 35 },
  { category: "health", count: 28 },
  { category: "education", count: 21 },
  { category: "agriculture", count: 18 },
  { category: "flood", count: 15 },
  { category: "other", count: 12 },
];

export function CategoryPills() {
  const [activeCategory, setActiveCategory] = useState<ProblemCategory>("road");

  return (
    <section className="py-8 px-4 bg-gray-100">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          সমস্যার <span className="gradient-text">ধরন</span>
        </h2>

        <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
          {categories.map(({ category, count }) => {
            const config = CATEGORY_CONFIG[category];
            const isActive = activeCategory === category;

            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  "flex items-center gap-2 px-5 py-3 rounded-full shadow-md whitespace-nowrap border-2 transition-all duration-300 btn-press",
                  isActive
                    ? "bg-white border-primary scale-105 shadow-lg"
                    : "bg-white border-transparent hover:border-gray-200"
                )}
              >
                <span className="text-2xl">{config.emoji}</span>
                <span className="font-medium text-gray-700">{config.labelBn}</span>
                <span
                  className={cn(
                    "text-xs px-2 py-0.5 rounded-full",
                    isActive
                      ? "bg-primary text-white"
                      : "bg-gray-200 text-gray-600"
                  )}
                >
                  {toBanglaNumber(count)}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}