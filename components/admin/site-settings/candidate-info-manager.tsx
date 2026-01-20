// components/admin/site-settings/candidate-info-manager.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Upload, Loader2, Save, X } from 'lucide-react';
import { getCandidateInfo, updateCandidateInfo, uploadSiteAsset, type CandidateInfo } from '@/lib/api';

export function CandidateInfoManager() {
  const router = useRouter();
  const photoInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState<CandidateInfo>({
    name: '',
    name_english: '',
    photo_url: '',
    designation: '',
    symbol: '',
    bio: '',
    vision: '',
    education: '',
    experience: '',
    quote: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const data = await getCandidateInfo();
    if (data) {
      setFormData(data);
    }
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('শুধুমাত্র ছবি ফাইল আপলোড করা যাবে');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('ফাইল সাইজ ২ MB এর কম হতে হবে');
      return;
    }

    setUploading(true);
    try {
      const url = await uploadSiteAsset(file, 'photos');
      setFormData(prev => ({ ...prev, photo_url: url }));
    } catch (error) {
      console.error('Upload error:', error);
      alert('আপলোড করতে সমস্যা হয়েছে');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const success = await updateCandidateInfo(formData);
      if (success) {
        alert('সফলভাবে সেভ হয়েছে');
        router.refresh();
      } else {
        alert('সেভ করতে সমস্যা হয়েছে');
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('সেভ করতে সমস্যা হয়েছে');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Photo Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          প্রার্থীর ছবি
        </label>
        <div className="flex items-start gap-4">
          {formData.photo_url && (
            <div className="relative w-32 h-32 bg-gray-100 rounded-full overflow-hidden">
              <Image
                src={formData.photo_url}
                alt={formData.name}
                fill
                className="object-cover"
              />
              <button
                onClick={() => setFormData(prev => ({ ...prev, photo_url: '' }))}
                className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          <button
            onClick={() => photoInputRef.current?.click()}
            disabled={uploading}
            className="px-4 py-2 border-2 border-dashed border-gray-300 rounded-xl hover:border-green-400 hover:bg-green-50 transition-colors flex items-center gap-2 text-gray-600"
          >
            {uploading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                আপলোড হচ্ছে...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                ছবি আপলোড করুন
              </>
            )}
          </button>
          <input
            ref={photoInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="hidden"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name Bangla */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            নাম (বাংলা)
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Name English */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            নাম (English)
          </label>
          <input
            type="text"
            name="name_english"
            value={formData.name_english}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Designation */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            পদবী
          </label>
          <input
            type="text"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Symbol */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            প্রতীক
          </label>
          <input
            type="text"
            name="symbol"
            value={formData.symbol}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Education */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            শিক্ষাগত যোগ্যতা
          </label>
          <input
            type="text"
            name="education"
            value={formData.education}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Experience */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            অভিজ্ঞতা
          </label>
          <input
            type="text"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      {/* Bio */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          সংক্ষিপ্ত বিবরণ
        </label>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
        />
      </div>

      {/* Vision */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          লক্ষ্য ও উদ্দেশ্য
        </label>
        <textarea
          name="vision"
          value={formData.vision}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
        />
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-4 border-t border-gray-100">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
        >
          {saving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              সেভ হচ্ছে...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              সেভ করুন
            </>
          )}
        </button>
      </div>
    </div>
  );
}