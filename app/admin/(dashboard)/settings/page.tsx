// app/admin/settings/page.tsx
import { Suspense } from 'react';
import { Settings, Tag, MapPin, Map } from 'lucide-react';
import { CategoriesManager } from '@/components/admin/settings/categories-manager';
import { UpazilasManager } from '@/components/admin/settings/upazilas-manager';
import { UnionsManager } from '@/components/admin/settings/unions-manager';

export default function AdminSettingsPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2">
          <Settings className="w-6 h-6 text-gray-700" />
          <h1 className="text-2xl font-bold text-gray-900">সেটিংস</h1>
        </div>
        <p className="text-gray-600 mt-1">ড্রপডাউন অপশন পরিচালনা করুন</p>
      </div>

      {/* Categories */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Tag className="w-5 h-5 text-green-600" />
          <h2 className="text-lg font-semibold text-gray-900">ক্যাটাগরি সমূহ</h2>
        </div>
        <Suspense fallback={<div>লোড হচ্ছে...</div>}>
          <CategoriesManager />
        </Suspense>
      </div>

      {/* Upazilas */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-6">
          <MapPin className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">উপজেলা সমূহ</h2>
        </div>
        <Suspense fallback={<div>লোড হচ্ছে...</div>}>
          <UpazilasManager />
        </Suspense>
      </div>

      {/* Unions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Map className="w-5 h-5 text-purple-600" />
          <h2 className="text-lg font-semibold text-gray-900">ইউনিয়ন সমূহ</h2>
        </div>
        <Suspense fallback={<div>লোড হচ্ছে...</div>}>
          <UnionsManager />
        </Suspense>
      </div>
    </div>
  );
}