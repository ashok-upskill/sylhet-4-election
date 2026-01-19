// components/problems/status-badge.tsx
import { Clock, CheckCircle, AlertCircle, XCircle, Loader } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md' | 'lg';
}

const statusConfig: Record<string, {
  label: string;
  icon: React.ElementType;
  className: string;
}> = {
  pending: {
    label: 'অপেক্ষমাণ',
    icon: Clock,
    className: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  },
  approved: {
    label: 'অনুমোদিত',
    icon: CheckCircle,
    className: 'bg-blue-100 text-blue-700 border-blue-200',
  },
  in_progress: {
    label: 'কাজ চলছে',
    icon: Loader,
    className: 'bg-purple-100 text-purple-700 border-purple-200',
  },
  resolved: {
    label: 'সমাধান হয়েছে',
    icon: CheckCircle,
    className: 'bg-green-100 text-green-700 border-green-200',
  },
  rejected: {
    label: 'বাতিল',
    icon: XCircle,
    className: 'bg-red-100 text-red-700 border-red-200',
  },
};

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-3 py-1.5 text-sm gap-1.5',
    lg: 'px-4 py-2 text-base gap-2',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <span className={cn(
      'inline-flex items-center font-medium rounded-full border',
      config.className,
      sizeClasses[size]
    )}>
      <Icon className={cn(iconSizes[size], status === 'in_progress' && 'animate-spin')} />
      {config.label}
    </span>
  );
}