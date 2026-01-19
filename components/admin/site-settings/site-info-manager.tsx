// components/admin/site-settings/site-info-manager.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Upload, Loader2, Save, X } from 'lucide-react';
import { getSiteInfo, updateSiteInfo, uploadSiteAsset, type SiteInfo } from '@/lib/api';

export function SiteInfoManager() {
  const router = useRouter();
  const logoInputRef = useRef<HTMLInputElement>(null);
  const symbolInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<'logo' | 'symbol' | null>(null);
  
  const [formData, setFormData] = useState<SiteInfo>({
    site_name: '',
    tagline: '',
    logo_url: '',
    symbol_url: '',
    contact_phone: '',
    contact_email: '',
    office_address: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const data = await getSiteInfo();
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

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'logo' | 'symbol'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('শুধুমাত্র ছবি ফাইল আপলোড করা যাবে');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('ফাইল সাইজ ২ MB এর কম হতে হবে');
      return;
    }

    setUploading(type);
    try {
      const folder = type === 'logo' ? 'logos' : 'symbols';
      const url = await uploadSiteAsset(file, folder);
      
      setFormData(prev => ({
        ...prev,
        [type === 'logo' ? 'logo_url' : 'symbol_url']: url
      }));
    } catch (error) {
      console.error('Upload error:', error);
      alert('আপলোড করতে সমস্যা হয়েছে');
    } finally {
      setUploading(null);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const success = await updateSiteInfo(formData);
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
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Logo Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          সাইট লোগো
        </label>
        <div className="flex items-start gap-4">
          {formData.logo_url && (
            <div className="relative w-32 h-32 bg-gray-100 rounded-xl overflow-hidden">
              <Image
                src={formData.logo_url}
                alt="Logo"
                fill
                className="object-contain p-2"
              />
              <button
                onClick={() => setFormData(prev => ({ ...prev, logo_url: '' }))}
                className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          <button
            onClick={() => logoInputRef.current?.click()}
            disabled={uploading === 'logo'}
            className="px-4 py-2 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-colors flex items-center gap-2 text-gray-600"
          >
            {uploading === 'logo' ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                আপলোড হচ্ছে...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                লোগো আপলোড করুন
              </>
            )}
          </button>
          <input
            ref={logoInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e, 'logo')}
            className="hidden"
          />
        </div>
      </div>

      {/* Symbol Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          নির্বাচনী প্রতীক
        </label>
        <div className="flex items-start gap-4">
          {formData.symbol_url && (
            <div className="relative w-32 h-32 bg-gray-100 rounded-xl overflow-hidden">
              <Image
                src={formData.symbol_url}
                alt="Symbol"
                fill
                className="object-contain p-2"
              />
              <button
                onClick={() => setFormData(prev => ({ ...prev, symbol_url: '' }))}
                className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          <button
            onClick={() => symbolInputRef.current?.click()}
            disabled={uploading === 'symbol'}
            className="px-4 py-2 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-colors flex items-center gap-2 text-gray-600"
          >
            {uploading === 'symbol' ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                আপলোড হচ্ছে...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                প্রতীক আপলোড করুন
              </>
            )}
          </button>
          <input
            ref={symbolInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e, 'symbol')}
            className="hidden"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Site Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            সাইট নাম
          </label>
          <input
            type="text"
            name="site_name"
            value={formData.site_name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Tagline */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            স্লোগান
          </label>
          <input
            type="text"
            name="tagline"
            value={formData.tagline}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Contact Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            যোগাযোগ ফোন
          </label>
          <input
            type="text"
            name="contact_phone"
            value={formData.contact_phone}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Contact Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ইমেইল
          </label>
          <input
            type="email"
            name="contact_email"
            value={formData.contact_email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Office Address */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          অফিস ঠিকানা
        </label>
        <textarea
          name="office_address"
          value={formData.office_address}
          onChange={handleChange}
          rows={2}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-4 border-t border-gray-100">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
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