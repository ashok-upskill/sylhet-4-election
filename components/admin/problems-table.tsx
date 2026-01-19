// components/admin/problems-table.tsx
'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Eye, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { StatusSelect } from './status-select';
import { DeleteButton } from './delete-button';
import { formatRelativeTime, toBanglaNumber, categoryLabels, statusLabels } from '@/lib/utils';
import type { Problem } from '@/types/database';

interface ProblemsTableProps {
  problems: Problem[];
  total: number;
  currentPage: number;
  status: string;
  search: string;
}

export function ProblemsTable({ 
  problems, 
  total, 
  currentPage,
  status,
  search 
}: ProblemsTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchInput, setSearchInput] = useState(search);

  const totalPages = Math.ceil(total / 10);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchInput) {
      params.set('search', searchInput);
    } else {
      params.delete('search');
    }
    params.set('page', '1');
    router.push(`/admin/problems?${params.toString()}`);
  };

  const handleStatusFilter = (newStatus: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newStatus) {
      params.set('status', newStatus);
    } else {
      params.delete('status');
    }
    params.set('page', '1');
    router.push(`/admin/problems?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`/admin/problems?${params.toString()}`);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Filters */}
      <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="সমস্যা খুঁজুন..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </form>

        {/* Status Filter */}
        <select
          value={status}
          onChange={(e) => handleStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">সব স্ট্যাটাস</option>
          <option value="pending">অপেক্ষমাণ</option>
          <option value="approved">অনুমোদিত</option>
          <option value="in_progress">কাজ চলছে</option>
          <option value="resolved">সমাধান হয়েছে</option>
          <option value="rejected">বাতিল</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">
                সমস্যা
              </th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600 hidden md:table-cell">
                ক্যাটাগরি
              </th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600 hidden lg:table-cell">
                এলাকা
              </th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">
                স্ট্যাটাস
              </th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600 hidden md:table-cell">
                তারিখ
              </th>
              <th className="text-right px-4 py-3 text-sm font-medium text-gray-600">
                অ্যাকশন
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {problems.map((problem) => (
              <tr key={problem.id} className="hover:bg-gray-50">
                {/* Problem Info */}
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    {problem.images?.[0] && (
                      <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={problem.images[0]}
                          alt={problem.title}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 truncate max-w-[200px]">
                        {problem.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        {problem.submitter_name}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Category */}
                <td className="px-4 py-4 hidden md:table-cell">
                  <span className="text-sm text-gray-600">
                    {categoryLabels[problem.category]}
                  </span>
                </td>

                {/* Location */}
                <td className="px-4 py-4 hidden lg:table-cell">
                  <span className="text-sm text-gray-600">
                    {problem.upazila}
                  </span>
                </td>

                {/* Status */}
                <td className="px-4 py-4">
                  <StatusSelect 
                    problemId={problem.id} 
                    currentStatus={problem.status} 
                  />
                </td>

                {/* Date */}
                <td className="px-4 py-4 hidden md:table-cell">
                  <span className="text-sm text-gray-500">
                    {formatRelativeTime(problem.created_at)}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-4 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/problems/${problem.id}`}
                      target="_blank"
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="দেখুন"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <DeleteButton problemId={problem.id} title={problem.title} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Empty State */}
        {problems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">কোনো সমস্যা পাওয়া যায়নি</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            মোট {toBanglaNumber(total)} টি সমস্যা
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm text-gray-600">
              {toBanglaNumber(currentPage)} / {toBanglaNumber(totalPages)}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}