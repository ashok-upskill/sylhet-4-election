// components/problems/vote-button.tsx
'use client';

import { useState, useEffect } from 'react';
import { ThumbsUp, Loader2, Check } from 'lucide-react';
import { createClient } from '@/lib/supabase';
import { toBanglaNumber, cn } from '@/lib/utils';

interface VoteButtonProps {
  problemId: number;
  currentVotes: number;
}

export function VoteButton({ problemId, currentVotes }: VoteButtonProps) {
  const [votes, setVotes] = useState(currentVotes);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Check if already voted
    const voted = localStorage.getItem(`voted_${problemId}`);
    if (voted === 'true') {
      setHasVoted(true);
    }

    // Subscribe to real-time updates
    const supabase = createClient();
    
    const channel = supabase
      .channel(`votes_${problemId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'problems',
          filter: `id=eq.${problemId}`,
        },
        (payload) => {
          const newData = payload.new as { votes_count?: number };
          if (newData.votes_count !== undefined) {
            setVotes(newData.votes_count);
          }
        }
      )
      .subscribe();

    // Listen for custom vote event from other components
    const handleVoteUpdate = (event: CustomEvent) => {
      if (event.detail.problemId === problemId) {
        setVotes(event.detail.votes);
      }
    };

    window.addEventListener('voteUpdated', handleVoteUpdate as EventListener);

    return () => {
      supabase.removeChannel(channel);
      window.removeEventListener('voteUpdated', handleVoteUpdate as EventListener);
    };
  }, [problemId]);

  // Sync with prop changes
  useEffect(() => {
    setVotes(currentVotes);
  }, [currentVotes]);

  const handleVote = async () => {
    if (hasVoted || loading) return;

    setLoading(true);
    
    // Optimistic update
    const newVoteCount = votes + 1;
    setVotes(newVoteCount);
    setHasVoted(true);
    localStorage.setItem(`voted_${problemId}`, 'true');

    try {
      const supabase = createClient();
      
      const { error } = await supabase
        .from('problems')
        .update({ votes_count: newVoteCount })
        .eq('id', problemId);

      if (error) {
        // Revert on error
        setVotes(votes);
        setHasVoted(false);
        localStorage.removeItem(`voted_${problemId}`);
        console.error('Vote error:', error);
        alert('ভোট দিতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
      } else {
        // Dispatch custom event for other components
        window.dispatchEvent(
          new CustomEvent('voteUpdated', {
            detail: { problemId, votes: newVoteCount }
          })
        );
      }
    } catch (err) {
      // Revert on error
      setVotes(votes);
      setHasVoted(false);
      localStorage.removeItem(`voted_${problemId}`);
      console.error('Vote error:', err);
      alert('ভোট দিতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  // Server-side render
  if (!mounted) {
    return (
      <button
        disabled
        className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-200"
      >
        <ThumbsUp className="w-6 h-6" />
        <span>সমর্থন করুন</span>
        <span className="px-3 py-1 rounded-full text-sm bg-white/20">
          {toBanglaNumber(currentVotes)}
        </span>
      </button>
    );
  }

  return (
    <button
      onClick={handleVote}
      disabled={hasVoted || loading}
      className={cn(
        'w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold transition-all duration-300',
        hasVoted
          ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-2 border-green-300 cursor-default'
          : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 shadow-lg shadow-green-200 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
      )}
    >
      {loading ? (
        <>
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>প্রসেস হচ্ছে...</span>
        </>
      ) : (
        <>
          {hasVoted ? (
            <Check className="w-6 h-6 animate-bounce" />
          ) : (
            <ThumbsUp className="w-6 h-6" />
          )}
          <span className="font-semibold">
            {hasVoted ? '✓ সমর্থন করেছেন' : 'সমর্থন করুন'}
          </span>
          <span className={cn(
            'min-w-[48px] px-3 py-1.5 rounded-full text-sm font-bold transition-all',
            hasVoted 
              ? 'bg-green-200 text-green-800' 
              : 'bg-white/20'
          )}>
            {toBanglaNumber(votes)}
          </span>
        </>
      )}
    </button>
  );
}