// components/problems/live-stats.tsx
'use client';

import { useState, useEffect } from 'react';
import { Eye, ThumbsUp, Calendar } from 'lucide-react';
import { createClient } from '@/lib/supabase';
import { toBanglaNumber, formatBengaliDate } from '@/lib/utils';

interface LiveStatsProps {
  problemId: number;
  initialViews: number;
  initialVotes: number;
  createdAt: string;
}

export function LiveStats({ 
  problemId, 
  initialViews, 
  initialVotes,
  createdAt 
}: LiveStatsProps) {
  const [views, setViews] = useState(initialViews);
  const [votes, setVotes] = useState(initialVotes);
  const [mounted, setMounted] = useState(false);
  const [justUpdated, setJustUpdated] = useState<'views' | 'votes' | null>(null);

  useEffect(() => {
    setMounted(true);
    
    // Increment view on first visit
    const viewedKey = `viewed_${problemId}`;
    const hasViewed = sessionStorage.getItem(viewedKey);

    if (!hasViewed) {
      incrementView();
      sessionStorage.setItem(viewedKey, 'true');
    }

    // Set up real-time subscription
    const supabase = createClient();
    
    const channel = supabase
      .channel(`problem_stats_${problemId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'problems',
          filter: `id=eq.${problemId}`,
        },
        (payload) => {
          console.log('Real-time update received:', payload);
          const newData = payload.new as { views_count?: number; votes_count?: number };
          
          if (newData.views_count !== undefined && newData.views_count !== views) {
            setViews(newData.views_count);
            setJustUpdated('views');
            setTimeout(() => setJustUpdated(null), 1000);
          }
          
          if (newData.votes_count !== undefined && newData.votes_count !== votes) {
            setVotes(newData.votes_count);
            setJustUpdated('votes');
            setTimeout(() => setJustUpdated(null), 1000);
          }
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });

    // Listen for custom vote event
    const handleVoteUpdate = (event: CustomEvent) => {
      if (event.detail.problemId === problemId) {
        setVotes(event.detail.votes);
        setJustUpdated('votes');
        setTimeout(() => setJustUpdated(null), 1000);
      }
    };

    window.addEventListener('voteUpdated', handleVoteUpdate as EventListener);

    return () => {
      supabase.removeChannel(channel);
      window.removeEventListener('voteUpdated', handleVoteUpdate as EventListener);
    };
  }, [problemId, views, votes]);

  const incrementView = async () => {
    const supabase = createClient();

    try {
      const { data: problem } = await supabase
        .from('problems')
        .select('views_count')
        .eq('id', problemId)
        .single();

      if (problem) {
        const newCount = (problem.views_count || 0) + 1;
        
        await supabase
          .from('problems')
          .update({ views_count: newCount })
          .eq('id', problemId);

        setViews(newCount);
      }
    } catch (error) {
      console.error('View increment error:', error);
    }
  };

  // Server render
  if (!mounted) {
    return (
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-500">
        <span className="flex items-center gap-1.5">
          <Calendar className="w-4 h-4" />
          {formatBengaliDate(createdAt)}
        </span>
        <span className="flex items-center gap-1.5">
          <Eye className="w-4 h-4" />
          {toBanglaNumber(initialViews)} বার দেখা হয়েছে
        </span>
        <span className="flex items-center gap-1.5">
          <ThumbsUp className="w-4 h-4" />
          {toBanglaNumber(initialVotes)} সমর্থন
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
      <span className="flex items-center gap-1.5 text-gray-500">
        <Calendar className="w-4 h-4" />
        {formatBengaliDate(createdAt)}
      </span>
      
      <span className={`flex items-center gap-1.5 transition-all duration-300 ${
        justUpdated === 'views' ? 'scale-110 text-blue-600' : 'text-gray-500'
      }`}>
        <Eye className="w-4 h-4" />
        <span className="font-semibold text-gray-900 tabular-nums">
          {toBanglaNumber(views)}
        </span>
        {' '}বার দেখা হয়েছে
      </span>
      
      <span className={`flex items-center gap-1.5 transition-all duration-300 ${
        justUpdated === 'votes' ? 'scale-110 text-green-600' : 'text-gray-500'
      }`}>
        <ThumbsUp className={`w-4 h-4 ${justUpdated === 'votes' ? 'animate-bounce' : ''}`} />
        <span className="font-semibold text-gray-900 tabular-nums">
          {toBanglaNumber(votes)}
        </span>
        {' '}সমর্থন
      </span>
    </div>
  );
}