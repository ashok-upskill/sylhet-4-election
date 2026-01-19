// app/problems/[id]/page.tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  MapPin, 
  User, 
  Phone,
  Flag,
  Clock,
  CheckCircle,
  AlertCircle,
  Building,
  Home,
  FileText,
  ChevronRight,
} from 'lucide-react';
import { getProblemById, getCategories, getUpazilas, getUnions } from '@/lib/api';
import { formatRelativeTime, formatBengaliDate } from '@/lib/utils';
import { ImageGallery } from '@/components/problems/image-gallery';
import { StatusBadge } from '@/components/problems/status-badge';
import { ShareButton } from '@/components/problems/share-button';
import { VoteButton } from '@/components/problems/vote-button';
import { LiveStats } from '@/components/problems/live-stats';

interface PageProps {
  params: Promise<{ id: string }>;
}

// Category Icons
const categoryIcons: Record<string, string> = {
  roads: '🛣️',
  water: '💧',
  electricity: '⚡',
  education: '📚',
  health: '🏥',
  agriculture: '🌾',
  environment: '🌳',
  other: '📋',
};

export default async function ProblemDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const problemId = parseInt(id);

  if (isNaN(problemId)) {
    notFound();
  }

  const problem = await getProblemById(problemId);

  if (!problem) {
    notFound();
  }

  // Get dynamic labels
  const [categories, upazilas, unions] = await Promise.all([
    getCategories(),
    getUpazilas(),
    getUnions(),
  ]);

  const categoryLabel = categories.find(c => c.value === problem.category)?.label || problem.category;
  const upazilaLabel = upazilas.find(u => u.value === problem.upazila)?.label || problem.upazila;
  const unionLabel = unions[problem.upazila]?.find(u => u.value === problem.union_name)?.label || problem.union_name;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14 md:h-16">
            <Link
              href="/problems"
              className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">ফিরে যান</span>
            </Link>
            
            <ShareButton title={problem.title} />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-green-600">হোম</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/problems" className="hover:text-green-600">সমস্যাসমূহ</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 truncate max-w-[200px]">{problem.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            {/* Main Content - Left */}
            <div className="lg:col-span-8 space-y-6">
              {/* Image Gallery */}
              {problem.images && problem.images.length > 0 && (
                <ImageGallery images={problem.images} title={problem.title} />
              )}

              {/* Problem Details Card */}
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                {/* Header Section */}
                <div className="p-6 md:p-8">
                  {/* Badges */}
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <StatusBadge status={problem.status} />
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full text-sm font-medium text-gray-700">
                      <span>{categoryIcons[problem.category] || '📋'}</span>
                      {categoryLabel}
                    </span>
                  </div>

                  {/* Title */}
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-4">
                    {problem.title}
                  </h1>

                  {/* Live Stats - View & Vote counts update in real-time */}
                  <LiveStats 
                    problemId={problem.id}
                    initialViews={problem.views_count || 0}
                    initialVotes={problem.votes_count || 0}
                    createdAt={problem.created_at}
                  />
                </div>

                {/* Description */}
                <div className="px-6 md:px-8 pb-6 md:pb-8 border-t border-gray-100 pt-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-green-600" />
                    বিস্তারিত বিবরণ
                  </h2>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-base">
                    {problem.description}
                  </p>
                </div>

                {/* Location */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 md:px-8 py-6 border-t border-blue-100">
                  <h2 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    সমস্যার অবস্থান
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <Building className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">উপজেলা</p>
                        <p className="font-semibold text-gray-900">{upazilaLabel}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                        <Home className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">ইউনিয়ন</p>
                        <p className="font-semibold text-gray-900">{unionLabel}</p>
                      </div>
                    </div>
                    {problem.ward && (
                      <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm">
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                          <Flag className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">ওয়ার্ড</p>
                          <p className="font-semibold text-gray-900">{problem.ward} নং</p>
                        </div>
                      </div>
                    )}
                    {problem.address_details && (
                      <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm sm:col-span-2">
                        <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                          <MapPin className="w-6 h-6 text-amber-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-500">বিস্তারিত ঠিকানা</p>
                          <p className="font-semibold text-gray-900">{problem.address_details}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Mobile Action Buttons */}
              <div className="lg:hidden bg-white rounded-2xl shadow-sm p-4 space-y-3">
                <VoteButton 
                  problemId={problem.id} 
                  currentVotes={problem.votes_count || 0} 
                />
              </div>
            </div>

            {/* Sidebar - Right */}
            <div className="lg:col-span-4 space-y-6">
              {/* Action Card - Desktop Only */}
              <div className="hidden lg:block bg-white rounded-2xl shadow-sm p-6">
                <h3 className="font-bold text-gray-900 mb-4 text-lg">আপনার মতামত দিন</h3>
                
                <VoteButton 
                  problemId={problem.id} 
                  currentVotes={problem.votes_count || 0} 
                />

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-500 text-center">
                    সমস্যাটি গুরুত্বপূর্ণ মনে হলে সমর্থন দিন
                  </p>
                </div>
              </div>

              {/* Submitter Card */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="font-bold text-gray-900 mb-5 flex items-center gap-2 text-lg">
                  <User className="w-5 h-5 text-green-600" />
                  জমাদানকারীর তথ্য
                </h3>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-green-200">
                    <span className="text-2xl font-bold text-white">
                      {problem.submitter_name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-lg">{problem.submitter_name}</p>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                      <Clock className="w-4 h-4" />
                      {formatRelativeTime(problem.created_at)}
                    </p>
                  </div>
                </div>
                
                {problem.submitter_phone && (
                  <a 
                    href={`tel:${problem.submitter_phone}`}
                    className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Phone className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">মোবাইল নম্বর</p>
                      <p className="font-semibold text-gray-900">{problem.submitter_phone}</p>
                    </div>
                  </a>
                )}
              </div>

              {/* Status Timeline */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="font-bold text-gray-900 mb-5 flex items-center gap-2 text-lg">
                  <Clock className="w-5 h-5 text-purple-600" />
                  অগ্রগতি
                </h3>
                
                <div className="relative">
                  <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gray-200" />
                  
                  <div className="space-y-6">
                    <TimelineItem 
                      label="সমস্যা জমা দেওয়া হয়েছে"
                      date={problem.created_at}
                      isComplete={true}
                    />
                    <TimelineItem 
                      label="পর্যালোচনার অপেক্ষায়"
                      isActive={problem.status === 'pending'}
                      isComplete={['approved', 'in_progress', 'resolved'].includes(problem.status)}
                    />
                    <TimelineItem 
                      label="কাজ চলছে"
                      isActive={problem.status === 'in_progress'}
                      isComplete={problem.status === 'resolved'}
                    />
                    <TimelineItem 
                      label="সমাধান সম্পন্ন"
                      isActive={problem.status === 'resolved'}
                      isComplete={problem.status === 'resolved'}
                      isLast={true}
                    />
                  </div>
                </div>
              </div>

              {/* Report */}
              <button className="w-full flex items-center justify-center gap-2 px-4 py-3 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors border border-gray-200">
                <Flag className="w-4 h-4" />
                সমস্যা রিপোর্ট করুন
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Timeline Item Component
function TimelineItem({ 
  label, 
  date,
  isActive = false, 
  isComplete = false,
  isLast = false,
}: { 
  label: string;
  date?: string;
  isActive?: boolean;
  isComplete?: boolean;
  isLast?: boolean;
}) {
  return (
    <div className="flex items-start gap-4 relative">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 flex-shrink-0 transition-all ${
        isComplete 
          ? 'bg-green-500 text-white' 
          : isActive 
          ? 'bg-yellow-500 text-white animate-pulse' 
          : 'bg-gray-200 text-gray-400'
      }`}>
        {isComplete ? (
          <CheckCircle className="w-5 h-5" />
        ) : isActive ? (
          <AlertCircle className="w-5 h-5" />
        ) : (
          <Clock className="w-4 h-4" />
        )}
      </div>
      <div className={`flex-1 ${!isLast ? 'pb-2' : ''}`}>
        <p className={`font-medium ${
          isActive || isComplete ? 'text-gray-900' : 'text-gray-400'
        }`}>
          {label}
        </p>
        {date && (
          <p className="text-sm text-gray-500 mt-0.5">
            {formatRelativeTime(date)}
          </p>
        )}
      </div>
    </div>
  );
}