import { cn } from "@/lib/utils";

export interface BadgeProps {
  variant?: "default" | "pending" | "seen" | "promised" | "solved" | "category";
  size?: "sm" | "md";
  pulse?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function Badge({
  variant = "default",
  size = "md",
  pulse = false,
  children,
  className,
}: BadgeProps) {
  const variants = {
    default: "bg-gray-100 text-gray-700",
    pending: "status-pending text-white",
    seen: "status-seen text-white",
    promised: "status-promised text-white",
    solved: "status-solved text-white",
    category: "bg-white/90 backdrop-blur text-gray-700 shadow-sm",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-xs",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-medium rounded-full",
        variants[variant],
        sizes[size],
        className
      )}
    >
      {pulse && (
        <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
      )}
      {children}
    </span>
  );
}