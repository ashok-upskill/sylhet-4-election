// components/shared/problem-card.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MapPin, ThumbsUp, Eye, Clock } from 'lucide-react';
import { Badge } from '@/components/ui';
import { TimeAgo } from '@/components/ui/time-ago';
import { toBengaliNumber } from '@/lib/utils';
import type { Problem } from '@/types/database';

interface ProblemCardProps {
  problem: Problem;
}

const categoryLabels: Record<string, string> = {
  roads: 'রাস্তা',
  water: 'পানি',
  electricity: 'বিদ্যুৎ',
  education: 'শিক্ষা',
  health: 'স্বাস্থ্য',
  agriculture: 'কৃষি',
  environment: 'পরিবেশ',
  other: 'অন্যান্য',
};

const statusLabels: Record<string, string> = {
  pending: 'অপেক্ষমাণ',
  approved: 'অনুমোদিত',
  in_progress: 'কাজ চলছে',
  resolved: 'সমাধান হয়েছে',
  rejected: 'বাতিল',
};

const statusVariants: Record<string, 'default' | 'success' | 'warning' | 'destructive'> = {
  pending: 'warning',
  approved: 'default',
  in_progress: 'default',
  resolved: 'success',
  rejected: 'destructive',
};

export function ProblemCard({ problem }: ProblemCardProps) {
  const imageUrl = problem.images?.[0] || '/placeholder-problem.jpg';

  return (
    <Link href={`/problems/${problem.id}`}>
      <article className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:border-green-200 transition-all duration-300">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <Image
            src={imageUrl}
            alt={problem.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 left-3">
            <Badge variant={statusVariants[problem.status]}>
              {statusLabels[problem.status]}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Category & Location */}
          <div className="flex items-center justify-between mb-2">
            <Badge variant="outline" className="text-xs">
              {categoryLabels[problem.category]}
            </Badge>
            <span className="flex items-center text-xs text-gray-500">
              <MapPin className="w-3 h-3 mr-1" />
              {problem.upazila}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-700 transition-colors">
            {problem.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {problem.description}
          </p>

          {/* Stats */}
          <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <span className="flex items-center">
                <ThumbsUp className="w-3 h-3 mr-1" />
                {toBengaliNumber(problem.votes_count || 0)}
              </span>
              <span className="flex items-center">
                <Eye className="w-3 h-3 mr-1" />
                {toBengaliNumber(problem.views_count || 0)}
              </span>
            </div>
            <span className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {/* Use TimeAgo component for hydration-safe time */}
              <TimeAgo date={problem.created_at} />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}