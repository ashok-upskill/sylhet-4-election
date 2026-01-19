// components/admin/site-settings/social-links-manager.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Facebook, Twitter, Instagram, Youtube, Linkedin, Loader2, Save } from 'lucide-react';
import { getSocialLinks, updateSocialLinks, type SocialLinks } from '@/lib/api';

export function SocialLinksManager() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState<SocialLinks>({
    facebook: '',
    twitter: '',
    instagram: '',
    youtube: '',
    linkedin: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const data = await getSocialLinks();
    if (data) {
      setFormData(data);
    }
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const success = await updateSocialLinks(formData);
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
        <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
      </div>
    );
  }

  const socialItems = [
    { name: 'facebook', label: 'Facebook', icon: Facebook, color: 'text-blue-600', bg: 'bg-blue-50' },
    { name: 'twitter', label: 'Twitter', icon: Twitter, color: 'text-sky-500', bg: 'bg-sky-50' },
    { name: 'instagram', label: 'Instagram', icon: Instagram, color: 'text-pink-600', bg: 'bg-pink-50' },
    { name: 'youtube', label: 'YouTube', icon: Youtube, color: 'text-red-600', bg: 'bg-red-50' },
    { name: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: 'text-blue-700', bg: 'bg-blue-50' },
  ];

  return (
    <div className="space-y-4">
      {socialItems.map((item) => (
        <div key={item.name} className="flex items-center gap-4">
          <div className={`w-12 h-12 ${item.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
            <item.icon className={`w-6 h-6 ${item.color}`} />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {item.label} লিংক
            </label>
            <input
              type="url"
              name={item.name}
              value={formData[item.name as keyof SocialLinks]}
              onChange={handleChange}
              placeholder={`https://${item.name}.com/your-profile`}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
      ))}

      {/* Save Button */}
      <div className="flex justify-end pt-4 border-t border-gray-100">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
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