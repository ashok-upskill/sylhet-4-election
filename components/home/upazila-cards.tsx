'use client';

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { Mountain, Trees, Landmark, ArrowRight, ChevronRight } from "lucide-react";
import { toBanglaNumber } from "@/lib/utils";
import { getUpazilaStats, type UpazilaStats } from "@/lib/api";

interface UpazilaConfig {
  slug: string;
  icon: ReactNode;
  gradient: string;
  famousPlace: string;
}

const upazilaConfigs: Record<string, UpazilaConfig> = {
  "কোম্পানীগঞ্জ": {
    slug: "companyganj",
    icon: <Mountain className="w-6 h-6" />,
    gradient: "bg-gradient-to-br from-primary to-primary-600",
    famousPlace: "বিছানাকান্দি",
  },
  "গোয়াইনঘাট": {
    slug: "gowainghat",
    icon: <Trees className="w-6 h-6" />,
    gradient: "bg-gradient-to-br from-accent to-accent-600",
    famousPlace: "রাতারগুল",
  },
  "জৈন্তাপুর": {
    slug: "jaintapur",
    icon: <Landmark className="w-6 h-6" />,
    gradient: "bg-gradient-to-br from-amber-500 to-orange-600",
    famousPlace: "লালাখাল",
  },
};

interface UpazilaCardProps {
  name: string;
  icon: ReactNode;
  gradient: string;
  unions: number;
  problems: number;
  solved: number;
  famousPlace: string;
  href: string;
}

function UpazilaCard({
  name,
  icon,
  gradient,
  unions,
  problems,
  solved,
  famousPlace,
  href,
}: UpazilaCardProps) {
  const cardClassName =
    "group relative " +
    gradient +
    " rounded-2xl p-6 text-white cursor-pointer card-hover overflow-hidden block";

  return (
    <Link href={href} className={cardClassName}>
      {/* Decorative Circles */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            {icon}
          </div>
          <div>
            <h3 className="text-xl font-bold">{name}</h3>
            <p className="text-sm opacity-80">উপজেলা</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center text-sm">
          <div className="bg-white/10 rounded-lg py-2">
            <div className="font-bold">{toBanglaNumber(unions)}</div>
            <div className="text-xs opacity-80">ইউনিয়ন</div>
          </div>
          <div className="bg-white/10 rounded-lg py-2">
            <div className="font-bold">{toBanglaNumber(problems)}</div>
            <div className="text-xs opacity-80">সমস্যা</div>
          </div>
          <div className="bg-white/10 rounded-lg py-2">
            <div className="font-bold">{toBanglaNumber(solved)}</div>
            <div className="text-xs opacity-80">সমাধান</div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm opacity-80">{famousPlace}</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
        </div>
      </div>
    </Link>
  );
}

function UpazilaCardSkeleton() {
  return (
    <div className="bg-gray-200 animate-pulse rounded-2xl p-6 h-[180px]">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-gray-300 rounded-xl" />
        <div>
          <div className="h-5 w-24 bg-gray-300 rounded mb-1" />
          <div className="h-3 w-16 bg-gray-300 rounded" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-gray-300 rounded-lg h-12" />
        <div className="bg-gray-300 rounded-lg h-12" />
        <div className="bg-gray-300 rounded-lg h-12" />
      </div>
    </div>
  );
}

export function UpazilaCards() {
  const [stats, setStats] = useState<UpazilaStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await getUpazilaStats();
        setStats(data);
      } catch (error) {
        console.error("Error loading upazila stats:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            <span className="gradient-text">উপজেলা</span> নির্বাচন করুন
          </h2>
          <Link
            href="/areas"
            className="text-primary text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all"
          >
            সব দেখুন
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <UpazilaCardSkeleton />
            <UpazilaCardSkeleton />
            <UpazilaCardSkeleton />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.map((upazila) => {
              const config = upazilaConfigs[upazila.name];
              if (!config) return null;

              return (
                <UpazilaCard
                  key={upazila.name}
                  name={upazila.name}
                  icon={config.icon}
                  gradient={config.gradient}
                  unions={upazila.unions_count}
                  problems={upazila.problems_count}
                  solved={upazila.solved_count}
                  famousPlace={config.famousPlace}
                  // চাইলে এখানে name এর বদলে slug ব্যবহার করতে পারো:
                  // href={`/problems?upazila=${config.slug}`}
                  href={`/problems?upazila=${encodeURIComponent(upazila.name)}`}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
