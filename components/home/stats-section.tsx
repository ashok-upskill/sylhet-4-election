import { Card } from '@/components/ui/card';
import { getStats } from '@/lib/api';
import { toBanglaNumber } from '@/lib/utils';
import { FileText, CheckCircle2, Clock, MapPin } from 'lucide-react';

export async function StatsSection() {
  // ডাটাবেস থেকে লাইভ স্ট্যাটস আনা
  const stats = await getStats();

  // সমাধানের হার
  const resolutionRate = stats.total > 0 
    ? Math.round((stats.resolved / stats.total) * 100) 
    : 0;

  const statItems = [
    {
      label: 'মোট সমস্যা',
      value: stats.total,
      icon: FileText,
      gradient: 'from-blue-500 to-blue-600',
      shadowColor: 'shadow-blue-200',
    },
    {
      label: 'সমাধান হয়েছে',
      value: stats.resolved,
      icon: CheckCircle2,
      gradient: 'from-green-500 to-emerald-600',
      shadowColor: 'shadow-green-200',
      badge: `${toBanglaNumber(resolutionRate)}%`,
    },
    {
      label: 'চলমান',
      value: stats.inProgress,
      icon: Clock,
      gradient: 'from-indigo-500 to-purple-600',
      shadowColor: 'shadow-indigo-200',
    },
    {
      label: 'উপজেলা কভারেজ',
      value: 3,
      icon: MapPin,
      gradient: 'from-orange-500 to-red-500',
      shadowColor: 'shadow-orange-200',
      suffix: 'টি',
    },
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          
          {/* Section Header */}
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">লাইভ পরিসংখ্যান</h2>
            <p className="text-gray-600">সিলেট-৪ আসনের সমস্যা সমাধানের বর্তমান অবস্থা</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {statItems.map((item, index) => (
              <Card 
                key={index} 
                className={`relative overflow-hidden border-0 shadow-lg ${item.shadowColor} hover:scale-105 transition-transform duration-300`}
              >
                <div className={`p-6 bg-gradient-to-br ${item.gradient} text-white`}>
                  {/* Badge */}
                  {item.badge && (
                    <span className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-full">
                      {item.badge}
                    </span>
                  )}

                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6" />
                  </div>

                  {/* Value */}
                  <h3 className="text-3xl md:text-4xl font-bold mb-1">
                    {toBanglaNumber(item.value)}
                    {item.suffix && <span className="text-lg ml-1 opacity-80">{item.suffix}</span>}
                  </h3>

                  {/* Label */}
                  <p className="text-white/80 font-medium">{item.label}</p>
                </div>
              </Card>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}