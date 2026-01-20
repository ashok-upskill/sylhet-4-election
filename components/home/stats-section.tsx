// components/home/stats-section.tsx
import { getStats } from '@/lib/api';
import { toBanglaNumber } from '@/lib/utils';
import { 
  MessageSquareWarning, 
  CheckCircle2, 
  HandHeart, 
  MapPin, 
  TrendingUp, 
  Percent, 
  Clock, 
  Users 
} from 'lucide-react';

export async function StatsSection() {
  const stats = await getStats();

  const resolutionRate = stats.total > 0 
    ? Math.round((stats.resolved / stats.total) * 100) 
    : 0;

  const statItems = [
    {
      label: 'মোট সমস্যা',
      value: stats.total,
      icon: MessageSquareWarning,
      gradient: 'from-orange-400 to-orange-600',
      badge: { text: 'Live', className: 'bg-orange-100 text-orange-600' },
      footer: {
        icon: TrendingUp,
        text: '+১২ আজকে',
        color: 'text-green-600',
      },
    },
    {
      label: 'সমাধান হয়েছে',
      value: stats.resolved,
      icon: CheckCircle2,
      gradient: 'from-green-400 to-green-600',
      badge: { text: '✓', className: 'bg-green-100 text-green-600 animate-pulse' },
      footer: {
        icon: Percent,
        text: `${toBanglaNumber(resolutionRate)}% সমাধান`,
        color: 'text-green-600',
      },
    },
    {
      label: 'প্রতিশ্রুতি দেওয়া',
      value: stats.inProgress,
      icon: HandHeart,
      gradient: 'from-purple-400 to-purple-600',
      footer: {
        icon: Clock,
        text: 'কাজ চলছে',
        color: 'text-purple-600',
      },
    },
    {
      label: 'ইউনিয়ন সক্রিয়',
      value: stats.activeUnions || 23,
      icon: MapPin,
      gradient: 'from-blue-400 to-blue-600',
      footer: {
        icon: Users,
        text: '৩ উপজেলা',
        color: 'text-blue-600',
      },
    },
  ];

  return (
    <section className="py-8 -mt-6 relative z-10">
      {/* ✅ Changed: max-w-6xl → max-w-7xl, added responsive padding */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statItems.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100 
                         hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              {/* Header with Icon & Badge */}
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-12 h-12 bg-gradient-to-br ${item.gradient} 
                              rounded-xl flex items-center justify-center shadow-lg`}
                >
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                {item.badge && (
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${item.badge.className}`}
                  >
                    {item.badge.text}
                  </span>
                )}
              </div>

              {/* Value */}
              <div className="text-3xl font-bold text-gray-800">
                {toBanglaNumber(item.value)}
              </div>

              {/* Label */}
              <p className="text-sm text-gray-500 mt-1">{item.label}</p>

              {/* Footer Info */}
              <div className={`mt-2 flex items-center text-xs ${item.footer.color}`}>
                <item.footer.icon className="w-3 h-3 mr-1" />
                <span>{item.footer.text}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}