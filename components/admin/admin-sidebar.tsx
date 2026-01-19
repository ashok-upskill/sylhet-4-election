// components/admin/admin-sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  BarChart3, 
  Settings,
  Home
} from 'lucide-react';
import { cn } from '@/lib/utils';

// components/admin/admin-sidebar.tsx - Add new menu item

const menuItems = [
  {
    title: 'ড্যাশবোর্ড',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'সমস্যাসমূহ',
    href: '/admin/problems',
    icon: FileText,
  },
  {
    title: 'পরিসংখ্যান',
    href: '/admin/stats',
    icon: BarChart3,
  },
  {
    title: 'ড্রপডাউন সেটিংস',
    href: '/admin/settings',
    icon: Settings,
  },
  {
    title: 'সাইট সেটিংস', // 🆕 Add this
    href: '/admin/site-settings',
    icon: Settings, // You can use a different icon like Image
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-64px)]">
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-green-50 text-green-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.title}
            </Link>
          );
        })}
      </nav>

      {/* Back to Site */}
      <div className="p-4 border-t border-gray-200">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <Home className="w-5 h-5" />
          সাইটে ফিরে যান
        </Link>
      </div>
    </aside>
  );
}