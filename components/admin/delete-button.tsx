// components/admin/delete-button.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Loader2, X } from 'lucide-react';
import { deleteProblem } from '@/lib/api';

interface DeleteButtonProps {
  problemId: number;
  title: string;
}

export function DeleteButton({ problemId, title }: DeleteButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteProblem(problemId);
      setShowConfirm(false);
      router.refresh();
    } catch (error) {
      console.error('Failed to delete:', error);
      alert('ডিলিট করতে সমস্যা হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        title="ডিলিট"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      {/* Confirm Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                নিশ্চিত করুন
              </h3>
              <button
                onClick={() => setShowConfirm(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-gray-600 mb-2">
              আপনি কি নিশ্চিত এই সমস্যাটি ডিলিট করতে চান?
            </p>
            <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg mb-6">
              "{title}"
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={loading}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                বাতিল
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    ডিলিট হচ্ছে...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    ডিলিট করুন
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}