// components/ui/time-ago.tsx
'use client';

import { useHydrated } from '@/hooks/use-hydrated';
import { formatRelativeTime } from '@/lib/utils';

interface TimeAgoProps {
  date: string | Date;
  className?: string;
}

export function TimeAgo({ date, className }: TimeAgoProps) {
  const hydrated = useHydrated();

  if (!hydrated) {
    // Server-side: show static text
    return <span className={className}>সম্প্রতি</span>;
  }

  // Client-side: show actual relative time
  return (
    <span className={className} suppressHydrationWarning>
      {formatRelativeTime(date)}
    </span>
  );
}