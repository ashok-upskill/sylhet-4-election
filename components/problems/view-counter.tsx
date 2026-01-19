// components/problems/view-counter.tsx
'use client';

import { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';
import { createClient } from '@/lib/supabase';
import { toBanglaNumber } from '@/lib/utils';

interface ViewCounterProps {
  problemId: number;
  initialViews: number;
}

export function ViewCounter({ problemId, initialViews }: ViewCounterProps) {
  const [views, setViews] = useState(initialViews);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Check if already viewed in this session
    const viewedKey = `viewed_${problemId}`;
    const hasViewed = sessionStorage.getItem(viewedKey);

    if (!hasViewed) {
      // Increment view count
      incrementView();
      sessionStorage.setItem(viewedKey, 'true');
    }
  }, [problemId]);

  const incrementView = async () => {
    const supabase = createClient();

    try {
      // Get current count
      const { data: problem } = await supabase
        .from('problems')
        .select('views_count')
        .eq('id', problemId)
        .single();

      if (problem) {
        const newCount = (problem.views_count || 0) + 1;
        
        // Update in database
        await supabase
          .from('problems')
          .update({ views_count: newCount })
          .eq('id', problemId);

        // Update local state
        setViews(newCount);
      }
    } catch (error) {
      console.error('View increment error:', error);
    }
  };

  if (!mounted) {
    return (
      <span className="flex items-center gap-1.5">
        <Eye className="w-4 h-4" />
        {toBanglaNumber(initialViews)} বার দেখা হয়েছে
      </span>
    );
  }

  return (
    <span className="flex items-center gap-1.5">
      <Eye className="w-4 h-4" />
      <span className="tabular-nums">{toBanglaNumber(views)}</span> বার দেখা হয়েছে
    </span>
  );
}