// app/admin/stats/page.tsx
import { getStats, getProblems } from '@/lib/api';
import { 
  BarChart3, 
  TrendingUp, 
  CheckCircle, 
  Clock,
  AlertCircle,
  FileText
} from 'lucide-react';
import { toBanglaNumber, categoryLabels, upazilaLabels } from '@/lib/utils';

export default async function AdminStatsPage() {
  const stats = await getStats();
  
  // Fetch all problems for detailed analysis
  const { problems } = await getProblems({ limit: 1000 });

  // Category-wise breakdown
  const categoryStats = Object.keys(categoryLabels).map((key) => {
    const count = problems.filter((p) => p.category === key).length;
    return {
      category: categoryLabels[key],
      count,
      percentage: stats.total > 0 ? Math.round((count / stats.total) * 100) : 0,
    };
  }).sort((a, b) => b.count - a.count);

  // Upazila-wise breakdown
  const upazilaStats = Object.keys(upazilaLabels).map((key) => {
    const count = problems.filter((p) => p.upazila === key).length;
    return {
      upazila: upazilaLabels[key],
      count,
      percentage: stats.total > 0 ? Math.round((count / stats.total) * 100) : 0,
    };
  }).sort((a, b) => b.count - a.count);

  // Status breakdown with colors
  const statusBreakdown = [
    {
      label: 'অপেক্ষমাণ',
      count: stats.pending,
      percentage: stats.total > 0 ? Math.round((stats.pending / stats.total) * 100) : 0,
      color: 'bg-yellow-500',
      icon: Clock,
    },
    {
      label: 'কাজ চলছে',
      count: stats.inProgress,
      percentage: stats.total > 0 ? Math.round((stats.inProgress / stats.total) * 100) : 0,
      color: 'bg-blue-500',
      icon: AlertCircle,
    },
    {
      label: 'সমাধান হয়েছে',
      count: stats.resolved,
      percentage: stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0,
      color: 'bg-green-500',
      icon: CheckCircle,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">পরিসংখ্যান</h1>
        <p className="text-gray-600 mt-1">সমস্যার বিস্তারিত তথ্য ও বিশ্লেষণ</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">মোট সমস্যা</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {toBanglaNumber(stats.total)}
              </p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">অপেক্ষমাণ</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {toBanglaNumber(stats.pending)}
              </p>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">সমাধান হয়েছে</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {toBanglaNumber(stats.resolved)}
              </p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">সমাধানের হার</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {toBanglaNumber(
                  stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0
                )}%
              </p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Status Breakdown */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-6">
          <BarChart3 className="w-5 h-5 text-gray-700" />
          <h2 className="text-lg font-semibold text-gray-900">স্ট্যাটাস অনুযায়ী</h2>
        </div>
        <div className="space-y-4">
          {statusBreakdown.map((item) => (
            <div key={item.label}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <item.icon className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">
                    {item.label}
                  </span>
                </div>
                <span className="text-sm text-gray-600">
                  {toBanglaNumber(item.count)} ({toBanglaNumber(item.percentage)}%)
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3">
                <div
                  className={`${item.color} h-3 rounded-full transition-all`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            ক্যাটাগরি অনুযায়ী
          </h2>
          <div className="space-y-4">
            {categoryStats.slice(0, 8).map((item) => (
              <div key={item.category}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    {item.category}
                  </span>
                  <span className="text-sm text-gray-600">
                    {toBanglaNumber(item.count)}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upazila Breakdown */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            উপজেলা অনুযায়ী
          </h2>
          <div className="space-y-4">
            {upazilaStats.map((item) => (
              <div key={item.upazila}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    {item.upazila}
                  </span>
                  <span className="text-sm text-gray-600">
                    {toBanglaNumber(item.count)}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
          <h3 className="text-sm font-semibold text-green-900 mb-2">
            সবচেয়ে বেশি সমস্যা
          </h3>
          <p className="text-2xl font-bold text-green-700">
            {categoryStats[0]?.category || 'N/A'}
          </p>
          <p className="text-sm text-green-600 mt-1">
            {toBanglaNumber(categoryStats[0]?.count || 0)} টি সমস্যা
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">
            সবচেয়ে সক্রিয় এলাকা
          </h3>
          <p className="text-2xl font-bold text-blue-700">
            {upazilaStats[0]?.upazila || 'N/A'}
          </p>
          <p className="text-sm text-blue-600 mt-1">
            {toBanglaNumber(upazilaStats[0]?.count || 0)} টি সমস্যা
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
          <h3 className="text-sm font-semibold text-purple-900 mb-2">
            গড় সমাধানের হার
          </h3>
          <p className="text-2xl font-bold text-purple-700">
            {toBanglaNumber(
              stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0
            )}%
          </p>
          <p className="text-sm text-purple-600 mt-1">
            {toBanglaNumber(stats.resolved)} টি সমাধান
          </p>
        </div>
      </div>
    </div>
  );
}