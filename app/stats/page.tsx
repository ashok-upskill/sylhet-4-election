import { Card } from '@/components/ui/card';
import { getStats, getProblems } from '@/lib/api';
import { toBanglaNumber } from '@/lib/utils';
import { 
  BarChart3, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  TrendingUp,
  MapPin,
  Users,
  FileText
} from 'lucide-react';

// ক্যাটাগরি তথ্য
const categories = [
  { value: 'road', label: 'রাস্তাঘাট', icon: '🛣️', color: 'bg-orange-500' },
  { value: 'water', label: 'পানি', icon: '🚰', color: 'bg-blue-500' },
  { value: 'electricity', label: 'বিদ্যুৎ', icon: '⚡', color: 'bg-yellow-500' },
  { value: 'education', label: 'শিক্ষা', icon: '🎓', color: 'bg-purple-500' },
  { value: 'health', label: 'স্বাস্থ্য', icon: '🏥', color: 'bg-red-500' },
  { value: 'agriculture', label: 'কৃষি', icon: '🌾', color: 'bg-emerald-500' },
  { value: 'internet', label: 'ইন্টারনেট', icon: '🌐', color: 'bg-indigo-500' },
  { value: 'law_and_order', label: 'আইন-শৃঙ্খলা', icon: '⚖️', color: 'bg-slate-500' },
  { value: 'other', label: 'অন্যান্য', icon: '📝', color: 'bg-gray-500' },
];

// উপজেলা তথ্য
const upazilas = [
  { value: 'গোয়াইনঘাট', label: 'গোয়াইনঘাট', icon: '🏔️' },
  { value: 'জৈন্তাপুর', label: 'জৈন্তাপুর', icon: '🌳' },
  { value: 'কোম্পানীগঞ্জ', label: 'কোম্পানীগঞ্জ', icon: '🏞️' },
];

export default async function StatsPage() {
  // মূল পরিসংখ্যান আনা
  const stats = await getStats();

  // ক্যাটাগরি অনুযায়ী সমস্যার সংখ্যা বের করা
  const categoryStats = await Promise.all(
    categories.map(async (cat) => {
      const { total } = await getProblems({ category: cat.value, limit: 1 });
      return { ...cat, count: total };
    })
  );

  // উপজেলা অনুযায়ী সমস্যার সংখ্যা বের করা
  const upazilaStats = await Promise.all(
    upazilas.map(async (upazila) => {
      const { total } = await getProblems({ upazila: upazila.value, limit: 1 });
      return { ...upazila, count: total };
    })
  );

  // সমাধানের হার হিসাব
  const resolutionRate = stats.total > 0 
    ? Math.round((stats.resolved / stats.total) * 100) 
    : 0;

  // সবচেয়ে বেশি সমস্যার ক্যাটাগরি
  const topCategory = categoryStats.reduce((max, cat) => 
    cat.count > max.count ? cat : max, categoryStats[0]
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">

          {/* Page Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">পরিসংখ্যান</h1>
            <p className="text-gray-600">সিলেট-৪ আসনের সমস্যা সমাধানের হালনাগাদ তথ্য</p>
          </div>

          {/* Main Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {/* Total Problems */}
            <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <FileText className="w-6 h-6" />
                </div>
                <TrendingUp className="w-5 h-5 opacity-70" />
              </div>
              <p className="text-3xl font-bold mb-1">{toBanglaNumber(stats.total)}</p>
              <p className="text-blue-100 text-sm">মোট সমস্যা</p>
            </Card>

            {/* Resolved */}
            <Card className="p-6 bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <span className="text-sm bg-white/20 px-2 py-1 rounded-full">
                  {toBanglaNumber(resolutionRate)}%
                </span>
              </div>
              <p className="text-3xl font-bold mb-1">{toBanglaNumber(stats.resolved)}</p>
              <p className="text-green-100 text-sm">সমাধান হয়েছে</p>
            </Card>

            {/* In Progress */}
            <Card className="p-6 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border-0 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <Clock className="w-6 h-6" />
                </div>
              </div>
              <p className="text-3xl font-bold mb-1">{toBanglaNumber(stats.inProgress)}</p>
              <p className="text-indigo-100 text-sm">চলমান</p>
            </Card>

            {/* Pending */}
            <Card className="p-6 bg-gradient-to-br from-yellow-500 to-orange-500 text-white border-0 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6" />
                </div>
              </div>
              <p className="text-3xl font-bold mb-1">{toBanglaNumber(stats.pending)}</p>
              <p className="text-yellow-100 text-sm">অপেক্ষমান</p>
            </Card>
          </div>

          {/* Category & Upazila Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
            
            {/* Category Breakdown */}
            <Card className="p-6 border-0 shadow-lg">
              <div className="flex items-center gap-2 mb-6">
                <BarChart3 className="w-5 h-5 text-green-600" />
                <h2 className="text-lg font-bold text-gray-900">ক্যাটাগরি অনুযায়ী</h2>
              </div>
              
              <div className="space-y-4">
                {categoryStats.map((cat) => {
                  const percentage = stats.total > 0 
                    ? Math.round((cat.count / stats.total) * 100) 
                    : 0;
                  
                  return (
                    <div key={cat.value}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="flex items-center gap-2 text-sm text-gray-700">
                          <span>{cat.icon}</span>
                          {cat.label}
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {toBanglaNumber(cat.count)} টি
                        </span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${cat.color} rounded-full transition-all duration-500`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Upazila Breakdown */}
            <Card className="p-6 border-0 shadow-lg">
              <div className="flex items-center gap-2 mb-6">
                <MapPin className="w-5 h-5 text-green-600" />
                <h2 className="text-lg font-bold text-gray-900">উপজেলা অনুযায়ী</h2>
              </div>
              
              <div className="space-y-4">
                {upazilaStats.map((upazila) => {
                  const percentage = stats.total > 0 
                    ? Math.round((upazila.count / stats.total) * 100) 
                    : 0;
                  
                  return (
                    <div key={upazila.value} className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="flex items-center gap-2 font-medium text-gray-900">
                          <span className="text-2xl">{upazila.icon}</span>
                          {upazila.label}
                        </span>
                        <span className="text-lg font-bold text-green-600">
                          {toBanglaNumber(upazila.count)}
                        </span>
                      </div>
                      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        মোট সমস্যার {toBanglaNumber(percentage)}%
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* No Data State */}
              {upazilaStats.every(u => u.count === 0) && (
                <div className="text-center py-8 text-gray-500">
                  <MapPin className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>এখনো কোনো সমস্যা জমা পড়েনি</p>
                </div>
              )}
            </Card>
          </div>

          {/* Quick Insights */}
          <Card className="p-6 border-0 shadow-lg bg-gradient-to-r from-green-50 to-emerald-50">
            <h2 className="text-lg font-bold text-gray-900 mb-4">📊 দ্রুত বিশ্লেষণ</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Resolution Rate */}
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{toBanglaNumber(resolutionRate)}%</p>
                    <p className="text-xs text-gray-500">সমাধানের হার</p>
                  </div>
                </div>
              </div>

              {/* Top Category */}
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-xl">
                    {topCategory.icon}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{topCategory.label}</p>
                    <p className="text-xs text-gray-500">সবচেয়ে বেশি সমস্যা</p>
                  </div>
                </div>
              </div>

              {/* Active Users Placeholder */}
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{toBanglaNumber(3)}</p>
                    <p className="text-xs text-gray-500">উপজেলা কভার</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
}