import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ProblemCard } from '@/components/shared/problem-card';
import { getProblems } from '@/lib/api';
import { toBanglaNumber } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Search, X } from 'lucide-react';

// ক্যাটাগরি অপশন
const categories = [
  { value: 'all', label: 'সব', icon: '📋' },
  { value: 'road', label: 'রাস্তাঘাট', icon: '🛣️' },
  { value: 'water', label: 'পানি', icon: '🚰' },
  { value: 'electricity', label: 'বিদ্যুৎ', icon: '⚡' },
  { value: 'education', label: 'শিক্ষা', icon: '🎓' },
  { value: 'health', label: 'স্বাস্থ্য', icon: '🏥' },
  { value: 'agriculture', label: 'কৃষি', icon: '🌾' },
  { value: 'internet', label: 'ইন্টারনেট', icon: '🌐' },
  { value: 'law_and_order', label: 'আইন-শৃঙ্খলা', icon: '⚖️' },
  { value: 'other', label: 'অন্যান্য', icon: '📝' },
];

// স্ট্যাটাস অপশন
const statuses = [
  { value: 'all', label: 'সব স্ট্যাটাস', color: 'bg-gray-100 text-gray-700' },
  { value: 'pending', label: 'অপেক্ষমান', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'in_progress', label: 'চলমান', color: 'bg-blue-100 text-blue-700' },
  { value: 'resolved', label: 'সমাধান হয়েছে', color: 'bg-green-100 text-green-700' },
];

// উপজেলা অপশন
const upazilas = [
  { value: 'all', label: 'সব উপজেলা' },
  { value: 'গোয়াইনঘাট', label: 'গোয়াইনঘাট' },
  { value: 'জৈন্তাপুর', label: 'জৈন্তাপুর' },
  { value: 'কোম্পানীগঞ্জ', label: 'কোম্পানীগঞ্জ' },
];

interface ProblemsPageProps {
  searchParams: Promise<{
    category?: string;
    status?: string;
    upazila?: string;
    search?: string;
    page?: string;
  }>;
}

export default async function ProblemsPage({ searchParams }: ProblemsPageProps) {
  const params = await searchParams;
  
  const currentPage = Number(params?.page) || 1;
  const category = params?.category || 'all';
  const status = params?.status || 'all';
  const upazila = params?.upazila || 'all';
  const searchQuery = params?.search || '';

  const { problems, total } = await getProblems({
    page: currentPage,
    limit: 9,
    category: category === 'all' ? undefined : category,
    status: status === 'all' ? undefined : status,
    upazila: upazila === 'all' ? undefined : upazila,
    search: searchQuery,
  });

  const totalPages = Math.ceil(total / 9);

  // URL বিল্ড করার হেল্পার
  const buildUrl = (newParams: Record<string, string>) => {
    const urlParams = new URLSearchParams();
    
    const finalCategory = newParams.category ?? category;
    const finalStatus = newParams.status ?? status;
    const finalUpazila = newParams.upazila ?? upazila;
    const finalSearch = newParams.search ?? searchQuery;
    const finalPage = newParams.page ?? '1';

    if (finalCategory !== 'all') urlParams.set('category', finalCategory);
    if (finalStatus !== 'all') urlParams.set('status', finalStatus);
    if (finalUpazila !== 'all') urlParams.set('upazila', finalUpazila);
    if (finalSearch) urlParams.set('search', finalSearch);
    if (finalPage !== '1') urlParams.set('page', finalPage);

    const queryString = urlParams.toString();
    return queryString ? `/problems?${queryString}` : '/problems';
  };

  const hasActiveFilters = category !== 'all' || status !== 'all' || upazila !== 'all' || searchQuery;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">এলাকার সমস্যাসমূহ</h1>
            <p className="text-gray-600">
              সিলেট-৪ আসনের নাগরিকদের জানানো সমস্যাগুলো
            </p>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
            <form action="/problems" method="GET">
              <input type="hidden" name="category" value={category} />
              <input type="hidden" name="status" value={status} />
              <input type="hidden" name="upazila" value={upazila} />
              <div className="relative">
                <input
                  type="text"
                  name="search"
                  placeholder="সমস্যা খুঁজুন... (যেমন: রাস্তা, পানি, বিদ্যুৎ)"
                  defaultValue={searchQuery}
                  className="w-full pl-12 pr-4 py-4 text-lg border-0 bg-gray-50 rounded-xl focus:ring-2 focus:ring-green-500 focus:bg-white transition-all"
                />
                <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                {searchQuery && (
                  <Link 
                    href={buildUrl({ search: '' })} 
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </Link>
                )}
              </div>
            </form>
          </div>

          {/* Filter Tabs */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 space-y-6">
            
            {/* Category Filter */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-3">ক্যাটাগরি</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <Link key={cat.value} href={buildUrl({ category: cat.value, page: '1' })}>
                    <button className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      category === cat.value 
                        ? 'bg-green-600 text-white shadow-md shadow-green-200' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}>
                      <span>{cat.icon}</span>
                      <span>{cat.label}</span>
                    </button>
                  </Link>
                ))}
              </div>
            </div>

            {/* Status & Upazila Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
              
              {/* Status Filter */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-3">স্ট্যাটাস</h3>
                <div className="flex flex-wrap gap-2">
                  {statuses.map((s) => (
                    <Link key={s.value} href={buildUrl({ status: s.value, page: '1' })}>
                      <button className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        status === s.value 
                          ? 'bg-green-600 text-white shadow-md shadow-green-200' 
                          : `${s.color} hover:opacity-80`
                      }`}>
                        {s.label}
                      </button>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Upazila Filter */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-3">উপজেলা</h3>
                <div className="flex flex-wrap gap-2">
                  {upazilas.map((u) => (
                    <Link key={u.value} href={buildUrl({ upazila: u.value, page: '1' })}>
                      <button className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        upazila === u.value 
                          ? 'bg-green-600 text-white shadow-md shadow-green-200' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}>
                        {u.label}
                      </button>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Active Filters Summary */}
            {hasActiveFilters && (
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>ফলাফল:</span>
                  <span className="font-semibold text-green-600">{toBanglaNumber(total)} টি সমস্যা</span>
                </div>
                <Link href="/problems">
                  <button className="inline-flex items-center gap-1 text-sm text-red-600 hover:text-red-700 font-medium">
                    <X className="w-4 h-4" />
                    ফিল্টার মুছুন
                  </button>
                </Link>
              </div>
            )}
          </div>

          {/* Results Count (when no filters) */}
          {!hasActiveFilters && (
            <div className="mb-6 text-gray-600">
              সর্বমোট <span className="font-semibold text-green-600">{toBanglaNumber(total)}</span> টি সমস্যা
            </div>
          )}

          {/* Problems Grid */}
          {problems.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                কোনো সমস্যা পাওয়া যায়নি
              </h3>
              <p className="text-gray-500 mb-6">
                অন্য কোনো ফিল্টার ব্যবহার করে দেখুন অথবা নতুন সমস্যা জানান
              </p>
              <div className="flex items-center justify-center gap-4">
                <Link href="/problems">
                  <Button variant="outline">ফিল্টার মুছুন</Button>
                </Link>
                <Link href="/submit">
                  <Button className="bg-green-600 hover:bg-green-700">
                    সমস্যা জানান
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {problems.map((problem) => (
                  <ProblemCard key={problem.id} problem={problem} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex justify-center items-center gap-2">
                  {currentPage > 1 ? (
                    <Link href={buildUrl({ page: String(currentPage - 1) })}>
                      <Button variant="outline" size="sm" className="gap-1">
                        <ChevronLeft className="w-4 h-4" />
                        আগে
                      </Button>
                    </Link>
                  ) : (
                    <Button variant="outline" size="sm" disabled className="gap-1">
                      <ChevronLeft className="w-4 h-4" />
                      আগে
                    </Button>
                  )}

                  <div className="flex items-center gap-1 mx-4">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <Link key={pageNum} href={buildUrl({ page: String(pageNum) })}>
                          <span className={`inline-flex items-center justify-center w-10 h-10 rounded-xl text-sm font-medium transition-all ${
                            currentPage === pageNum
                              ? 'bg-green-600 text-white shadow-md shadow-green-200'
                              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                          }`}>
                            {toBanglaNumber(pageNum)}
                          </span>
                        </Link>
                      );
                    })}
                  </div>

                  {currentPage < totalPages ? (
                    <Link href={buildUrl({ page: String(currentPage + 1) })}>
                      <Button variant="outline" size="sm" className="gap-1">
                        পরে
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  ) : (
                    <Button variant="outline" size="sm" disabled className="gap-1">
                      পরে
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
}