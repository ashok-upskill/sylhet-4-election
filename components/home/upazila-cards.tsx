import Link from "next/link";
import { Mountain, Trees, Landmark, ArrowRight, ChevronRight } from "lucide-react";
import { toBanglaNumber } from "@/lib/utils";

interface UpazilaCardProps {
  name: string;
  icon: React.ReactNode;
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
  return (
    <Link
      href={href}
      className={`group relative ${gradient} rounded-2xl p-6 text-white cursor-pointer card-hover overflow-hidden block`}
    >
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

export function UpazilaCards() {
  return (
    <section className="py-8 px-4">
      <div className="max-w-6xl mx-auto">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <UpazilaCard
            name="কোম্পানীগঞ্জ"
            icon={<Mountain className="w-6 h-6" />}
            gradient="bg-gradient-to-br from-primary to-primary-600"
            unions={7}
            problems={85}
            solved={32}
            famousPlace="ভোলাগঞ্জ পাথর কোয়ারি"
            href="/problems?upazila=companyganj"
          />

          <UpazilaCard
            name="গোয়াইনঘাট"
            icon={<Trees className="w-6 h-6" />}
            gradient="bg-gradient-to-br from-accent to-accent-600"
            unions={11}
            problems={112}
            solved={41}
            famousPlace="জাফলং, রাতারগুল"
            href="/problems?upazila=gowainghat"
          />

          <UpazilaCard
            name="জৈন্তাপুর"
            icon={<Landmark className="w-6 h-6" />}
            gradient="bg-gradient-to-br from-amber-500 to-orange-600"
            unions={6}
            problems={50}
            solved={16}
            famousPlace="লালাখাল"
            href="/problems?upazila=jaintapur"
          />
        </div>
      </div>
    </section>
  );
}