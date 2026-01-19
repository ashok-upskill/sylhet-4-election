"use client";

import { Home, List, Plus, BarChart3, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", icon: Home, label: "হোম" },
  { href: "/problems", icon: List, label: "সমস্যা" },
  { href: "/submit", icon: Plus, label: "", isCenter: true },
  { href: "/stats", icon: BarChart3, label: "পরিসংখ্যান" },
  { href: "/candidate", icon: User, label: "প্রার্থী" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="bg-white border-t border-gray-200 shadow-2xl pb-safe">
        <div className="grid grid-cols-5 gap-1 px-2 py-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            // Center FAB Button (Submit Problem)
            if (item.isCenter) {
              return (
                <div
                  key={item.href}
                  className="relative flex items-center justify-center"
                >
                  <Link
                    href={item.href}
                    className="absolute -top-6 w-14 h-14 bg-gradient-to-r from-accent to-accent-600 rounded-full shadow-lg flex items-center justify-center text-white btn-press animate-glow"
                  >
                    <Plus className="w-7 h-7" />
                  </Link>
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center py-2 px-1 rounded-xl transition-all duration-200",
                  isActive
                    ? "text-primary bg-primary-50"
                    : "text-gray-500 hover:bg-gray-50"
                )}
              >
                <Icon
                  className={cn("w-5 h-5", isActive && "scale-110")}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span
                  className={cn(
                    "text-xs mt-1",
                    isActive ? "font-bold" : "font-medium"
                  )}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}