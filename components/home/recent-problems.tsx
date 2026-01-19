// components/home/recent-problems.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { ProblemCard } from '@/components/shared/problem-card';
import { getRecentProblems } from '@/lib/api';
import type { Problem } from '@/types/database';

export function RecentProblems() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProblems() {
      try {
        const data = await getRecentProblems(6);
        setProblems(data);
      } catch (error) {
        console.error('Failed to fetch recent problems:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProblems();
  }, []);

  return (
    <section className="py-16 md:py-24 bg-gray-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] bg-center" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-end justify-between gap-4 mb-12">
          <div className="w-full md:w-auto text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-3">
              <Sparkles className="w-4 h-4" />
              <span>সাম্প্রতিক আপডেট</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              সাম্প্রতিক সমস্যাসমূহ
            </h2>
            <p className="text-gray-600 mt-2 max-w-lg">
              এলাকাবাসীর জমা দেওয়া সর্বশেষ সমস্যাগুলো এবং তাদের বর্তমান অবস্থা। 
              আপনার এলাকার সমস্যাটিও আমাদের জানান।
            </p>
          </div>
          
          <Link
            href="/problems"
            className="hidden md:flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold group transition-all px-4 py-2 hover:bg-green-50 rounded-lg"
          >
            সব সমস্যা দেখুন
            <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-green-600 mb-4" />
            <p className="text-gray-500 font-medium">সমস্যাগুলো লোড হচ্ছে...</p>
          </div>
        )}

        {/* Problems Grid */}
        {!loading && problems.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {problems.map((problem) => (
              <div key={problem.id} className="h-full">
                <ProblemCard problem={problem} />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && problems.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">কোনো সমস্যা পাওয়া যায়নি</h3>
            <p className="text-gray-500 mb-6">এখনো কোনো সমস্যা জমা দেওয়া হয়নি। আপনি প্রথম জমা দিন!</p>
            <Link
              href="/submit"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors shadow-lg shadow-green-200"
            >
              সমস্যা জমা দিন
            </Link>
          </div>
        )}

        {/* Mobile Link */}
        <div className="mt-10 text-center md:hidden">
          <Link
            href="/problems"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors shadow-sm w-full justify-center"
          >
            সব সমস্যা দেখুন
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}