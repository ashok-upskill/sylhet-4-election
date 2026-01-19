// components/admin/status-select.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { updateProblemStatus } from '@/lib/api';
import { cn } from '@/lib/utils';

interface StatusSelectProps {
  problemId: number;
  currentStatus: string;
}

const statusOptions = [
  { value: 'pending', label: 'অপেক্ষমাণ', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'approved', label: 'অনুমোদিত', color: 'bg-blue-100 text-blue-700' },
  { value: 'in_progress', label: 'কাজ চলছে', color: 'bg-purple-100 text-purple-700' },
  { value: 'resolved', label: 'সমাধান হয়েছে', color: 'bg-green-100 text-green-700' },
  { value: 'rejected', label: 'বাতিল', color: 'bg-red-100 text-red-700' },
];

export function StatusSelect({ problemId, currentStatus }: StatusSelectProps) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = async (newStatus: string) => {
    if (newStatus === status) return;

    setLoading(true);
    try {
      await updateProblemStatus(problemId, newStatus);
      setStatus(newStatus);
      router.refresh();
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  const currentOption = statusOptions.find((opt) => opt.value === status);

  return (
    <div className="relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded">
          <Loader2 className="w-4 h-4 animate-spin text-green-600" />
        </div>
      )}
      <select
        value={status}
        onChange={(e) => handleChange(e.target.value)}
        disabled={loading}
        className={cn(
          'px-3 py-1.5 rounded-full text-xs font-medium border-0 cursor-pointer focus:ring-2 focus:ring-green-500',
          currentOption?.color || 'bg-gray-100 text-gray-700'
        )}
      >
        {statusOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}