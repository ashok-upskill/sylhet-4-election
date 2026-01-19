"use client";

import { useState } from "react";
import { Badge } from "@/components/ui";
import { SlidersHorizontal, X } from "lucide-react";
import type { ProblemStatus } from "@/types/design-system";

interface FilterBarProps {
  onFilterChange?: (filters: FilterState) => void;
}

export interface FilterState {
  status: ProblemStatus | "all";
  upazila: string;
  category: string;
}

const statusFilters = [
  { value: "all" as const, label: "সব", count: 247 },
  { value: "pending" as const, label: "অপেক্ষায়", count: 106 },
  { value: "seen" as const, label: "দেখা হয়েছে", count: 89 },
  { value: "promised" as const, label: "প্রতিশ্রুতি", count: 52 },
  { value: "solved" as const, label: "সমাধান", count: 89 },
];

export function FilterBar({ onFilterChange }: FilterBarProps) {
  const [activeStatus, setActiveStatus] = useState<ProblemStatus | "all">("all");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const handleStatusChange = (status: ProblemStatus | "all") => {
    setActiveStatus(status);
    onFilterChange?.({
      status,
      upazila: "",
      category: "",
    });
  };

  return (
    <div className="space-y-4">
      {/* Desktop Filters */}
      <div className="hidden md:flex items-center gap-2">
        {statusFilters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => handleStatusChange(filter.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all btn-press ${
              activeStatus === filter.value
                ? "bg-primary text-white shadow-md"
                : "bg-white text-gray-700 border border-gray-200 hover:border-primary"
            }`}
          >
            {filter.label}
            {filter.count > 0 && (
              <span className="ml-2 text-xs opacity-75">({filter.count})</span>
            )}
          </button>
        ))}
      </div>

      {/* Mobile Filter Toggle */}
      <div className="md:hidden">
        <button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium"
        >
          <span className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4" />
            ফিল্টার
          </span>
          <Badge variant={activeStatus !== "all" ? "pending" : "default"}>
            {statusFilters.find((f) => f.value === activeStatus)?.label || "সব"}
          </Badge>
        </button>

        {/* Mobile Filter Menu */}
        {showMobileFilters && (
          <div className="mt-2 p-4 bg-white border border-gray-200 rounded-xl space-y-2 animate-slide-down">
            {statusFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => {
                  handleStatusChange(filter.value);
                  setShowMobileFilters(false);
                }}
                className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeStatus === filter.value
                    ? "bg-primary text-white"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                }`}
              >
                {filter.label} ({filter.count})
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Active Filters Display */}
      {activeStatus !== "all" && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">সক্রিয় ফিল্টার:</span>
          <Badge
            variant={activeStatus}
            className="flex items-center gap-1 cursor-pointer"
            onClick={() => handleStatusChange("all")}
          >
            {statusFilters.find((f) => f.value === activeStatus)?.label}
            <X className="w-3 h-3" />
          </Badge>
        </div>
      )}
    </div>
  );
}