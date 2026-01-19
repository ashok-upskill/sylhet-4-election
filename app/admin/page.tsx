// app/admin/page.tsx
import Link from 'next/link';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { getStats } from '@/lib/api';
import { toBanglaNumber } from '@/lib/utils';

export default async function AdminDashboard() {
  const stats = await getStats();

  const statCards = [
    {
      title: 'মোট সমস্যা',
      value: stats.total,
      icon: FileText,
      color: 'blue',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      title: 'অপেক্ষমাণ',
      value: stats.pending,
      icon: Clock,
      color: 'yellow',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600',
    },
    {
      title: 'সমাধান হয়েছে',
      value: stats.resolved,
      icon: CheckCircle,
      color: 'green',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
    },
    {
      title: 'কাজ চলছে',
      value: stats.inProgress,
      icon: AlertCircle,
      color: 'purple',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">ড্যাশবোর্ড</h1>
        <p className="text-gray-600 mt-1">সিলেট-৪ এডমিন প্যানেলে স্বাগতম</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div
            key={stat.title}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {toBanglaNumber(stat.value)}
                </p>
              </div>
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Problems */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              অপেক্ষমাণ সমস্যা
            </h2>
            <Link
              href="/admin/problems?status=pending"
              className="text-sm text-green-600 hover:text-green-700 flex items-center gap-1"
            >
              সব দেখুন
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {toBanglaNumber(stats.pending)}
              </p>
              <p className="text-gray-600 mt-1">টি সমস্যা পর্যালোচনার অপেক্ষায়</p>
            </div>
          </div>
        </div>

        {/* Resolution Rate */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              সমাধানের হার
            </h2>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {toBanglaNumber(stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0)}%
              </p>
              <p className="text-gray-600 mt-1">সমস্যা সমাধান হয়েছে</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">দ্রুত লিংক</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/admin/problems"
            className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors"
          >
            <FileText className="w-5 h-5 text-green-600" />
            <span className="font-medium text-gray-900">সমস্যা ম্যানেজ করুন</span>
          </Link>
          <Link
            href="/admin/problems?status=pending"
            className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-yellow-300 hover:bg-yellow-50 transition-colors"
          >
            <Clock className="w-5 h-5 text-yellow-600" />
            <span className="font-medium text-gray-900">পেন্ডিং রিভিউ</span>
          </Link>
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-gray-900">সাইট দেখুন</span>
          </Link>
        </div>
      </div>
    </div>
  );
}