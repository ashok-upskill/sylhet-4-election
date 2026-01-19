// app/admin/site-settings/page.tsx
import { Suspense } from 'react';
import { Settings, Image, User, Link as LinkIcon } from 'lucide-react';
import { SiteInfoManager } from '@/components/admin/site-settings/site-info-manager';
import { CandidateInfoManager } from '@/components/admin/site-settings/candidate-info-manager';
import { SocialLinksManager } from '@/components/admin/site-settings/social-links-manager';

export default function AdminSiteSettingsPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2">
          <Settings className="w-6 h-6 text-gray-700" />
          <h1 className="text-2xl font-bold text-gray-900">সাইট সেটিংস</h1>
        </div>
        <p className="text-gray-600 mt-1">লোগো, প্রোফাইল এবং সোশ্যাল লিংক পরিচালনা করুন</p>
      </div>

      {/* Site Info */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Image className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">সাইট তথ্য ও লোগো</h2>
        </div>
        <Suspense fallback={<div>লোড হচ্ছে...</div>}>
          <SiteInfoManager />
        </Suspense>
      </div>

      {/* Candidate Info */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-6">
          <User className="w-5 h-5 text-green-600" />
          <h2 className="text-lg font-semibold text-gray-900">প্রার্থীর তথ্য</h2>
        </div>
        <Suspense fallback={<div>লোড হচ্ছে...</div>}>
          <CandidateInfoManager />
        </Suspense>
      </div>

      {/* Social Links */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-6">
          <LinkIcon className="w-5 h-5 text-purple-600" />
          <h2 className="text-lg font-semibold text-gray-900">সোশ্যাল মিডিয়া</h2>
        </div>
        <Suspense fallback={<div>লোড হচ্ছে...</div>}>
          <SocialLinksManager />
        </Suspense>
      </div>
    </div>
  );
}