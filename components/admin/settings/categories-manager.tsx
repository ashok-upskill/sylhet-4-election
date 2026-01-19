// components/admin/settings/categories-manager.tsx
'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Save, Loader2 } from 'lucide-react';
import { getCategories, updateCategories, type SettingsOption } from '@/lib/api';
import { useRouter } from 'next/navigation';

export function CategoriesManager() {
  const [categories, setCategories] = useState<SettingsOption[]>([]);
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
    const data = await getCategories();
    setCategories(data);
    setLoading(false);
  };

  const handleAdd = () => {
    setCategories([...categories, { value: '', label: '' }]);
    setEditingIndex(categories.length);
    setTempValue({ value: '', label: '' });
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setTempValue({ ...categories[index] });
  };

  const handleSave = async (index: number) => {
    const updated = [...categories];
    updated[index] = tempValue;
    
    setSaving(true);
    const success = await updateCategories(updated);
    if (success) {
      setCategories(updated);
      setEditingIndex(null);
      router.refresh();
    } else {
      alert('সেভ করতে সমস্যা হয়েছে');
    }
    setSaving(false);
  };

  const handleCancel = (index: number) => {
    if (categories[index].value === '' && categories[index].label === '') {
      // New item, remove it
      setCategories(categories.filter((_, i) => i !== index));
    }
    setEditingIndex(null);
  };

  const handleDelete = async (index: number) => {
    if (!confirm(`আপনি কি "${categories[index].label}" ডিলিট করতে চান?`)) return;

    const updated = categories.filter((_, i) => i !== index);
    setSaving(true);
    const success = await updateCategories(updated);
    if (success) {
      setCategories(updated);
      router.refresh();
    } else {
      alert('ডিলিট করতে সমস্যা হয়েছে');
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          নতুন যোগ করুন
        </button>
      </div>

      <div className="space-y-3">
        {categories.map((item, index) => (
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
                  placeholder="English value (e.g., roads)"
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <input
                  type="text"
                  value={tempValue.label}
                  onChange={(e) => setTempValue({ ...tempValue, label: e.target.value })}
                  placeholder="বাংলা লেবেল"
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                  onClick={() => handleSave(index)}
                  disabled={saving}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                >
                  <Save className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleCancel(index)}
                  disabled={saving}
                  className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </>
            ) : (
              <>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{item.label}</p>
                  <p className="text-sm text-gray-500">{item.value}</p>
                </div>
                <button
                  onClick={() => handleEdit(index)}
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

        {categories.length === 0 && (
          <p className="text-center py-8 text-gray-500">কোনো ক্যাটাগরি নেই</p>
        )}
      </div>
    </div>
  );
}