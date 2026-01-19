// components/admin/settings/unions-manager.tsx
'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Save, Loader2 } from 'lucide-react';
import { getUnions, updateUnions, getUpazilas, type SettingsOption } from '@/lib/api';
import { useRouter } from 'next/navigation';

export function UnionsManager() {
  const [unions, setUnions] = useState<Record<string, SettingsOption[]>>({});
  const [upazilas, setUpazilas] = useState<SettingsOption[]>([]);
  const [selectedUpazila, setSelectedUpazila] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [tempValue, setTempValue] = useState({ value: '', label: '' });
  const router = useRouter();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [unionsData, upazilasData] = await Promise.all([
      getUnions(),
      getUpazilas(),
    ]);
    setUnions(unionsData);
    setUpazilas(upazilasData);
    if (upazilasData.length > 0) {
      setSelectedUpazila(upazilasData[0].value);
    }
    setLoading(false);
  };

  const currentUnions = unions[selectedUpazila] || [];

  const handleAdd = () => {
    const updated = { ...unions };
    if (!updated[selectedUpazila]) {
      updated[selectedUpazila] = [];
    }
    updated[selectedUpazila] = [...updated[selectedUpazila], { value: '', label: '' }];
    setUnions(updated);
    setEditingIndex(currentUnions.length);
    setTempValue({ value: '', label: '' });
  };

  const handleSave = async (index: number) => {
    const updated = { ...unions };
    updated[selectedUpazila][index] = tempValue;
    
    setSaving(true);
    const success = await updateUnions(updated);
    if (success) {
      setUnions(updated);
      setEditingIndex(null);
      router.refresh();
    } else {
      alert('সেভ করতে সমস্যা হয়েছে');
    }
    setSaving(false);
  };

  const handleDelete = async (index: number) => {
    if (!confirm(`আপনি কি "${currentUnions[index].label}" ডিলিট করতে চান?`)) return;

    const updated = { ...unions };
    updated[selectedUpazila] = updated[selectedUpazila].filter((_, i) => i !== index);
    
    setSaving(true);
    const success = await updateUnions(updated);
    if (success) {
      setUnions(updated);
      router.refresh();
    } else {
      alert('ডিলিট করতে সমস্যা হয়েছে');
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <select
          value={selectedUpazila}
          onChange={(e) => {
            setSelectedUpazila(e.target.value);
            setEditingIndex(null);
          }}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          {upazilas.map((upazila) => (
            <option key={upazila.value} value={upazila.value}>
              {upazila.label}
            </option>
          ))}
        </select>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          নতুন ইউনিয়ন
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {currentUnions.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
          >
            {editingIndex === index ? (
              <>
                <input
                  type="text"
                  value={tempValue.value}
                  onChange={(e) => setTempValue({ ...tempValue, value: e.target.value })}
                  placeholder="English value"
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                />
                <input
                  type="text"
                  value={tempValue.label}
                  onChange={(e) => setTempValue({ ...tempValue, label: e.target.value })}
                  placeholder="বাংলা নাম"
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                />
                <button
                  onClick={() => handleSave(index)}
                  disabled={saving}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                >
                  <Save className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setEditingIndex(null)}
                  className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{item.label}</p>
                  <p className="text-sm text-gray-500">{item.value}</p>
                </div>
                <button
                  onClick={() => {
                    setEditingIndex(index);
                    setTempValue({ ...item });
                  }}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        ))}

        {currentUnions.length === 0 && (
          <p className="col-span-2 text-center py-8 text-gray-500">
            এই উপজেলায় কোনো ইউনিয়ন নেই
          </p>
        )}
      </div>
    </div>
  );
}