// components/ui/badge.tsx
import { cn } from '@/lib/utils';

export type ProblemStatus = 'all' | 'pending' | 'approved' | 'in_progress' | 'resolved' | 'rejected';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: ProblemStatus | 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

const variantStyles: Record<string, string> = {
  default: 'bg-gray-100 text-gray-800 border-gray-200',
  all: 'bg-gray-100 text-gray-800 border-gray-200',
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  approved: 'bg-blue-100 text-blue-800 border-blue-200',
  in_progress: 'bg-purple-100 text-purple-800 border-purple-200',
  resolved: 'bg-green-100 text-green-800 border-green-200',
  rejected: 'bg-red-100 text-red-800 border-red-200',
  success: 'bg-green-100 text-green-800 border-green-200',
  warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  error: 'bg-red-100 text-red-800 border-red-200',
  info: 'bg-blue-100 text-blue-800 border-blue-200',
};

const sizeStyles: Record<string, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
};

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  className,
  onClick,
}: BadgeProps) {
  const Component = onClick ? 'button' : 'span';
  
  return (
    <Component
      onClick={onClick}
      className={cn(
        'inline-flex items-center font-medium rounded-full border transition-colors',
        variantStyles[variant] || variantStyles.default,
        sizeStyles[size],
        onClick && 'cursor-pointer hover:opacity-80',
        className
      )}
    >
      {children}
    </Component>
  );
}