"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui";
import { Mountain, Trees, Landmark, ChevronDown, MapPin, Users, Building2 } from "lucide-react";
import { cn, toBanglaNumber } from "@/lib/utils";

interface Union {
  id: string;
  name: string;
  villages: number;
  schools: number;
  markets: number;
  population: number;
}

const upazilaData = {
  companyganj: {
    name: "কোম্পানীগঞ্জ উপজেলা",
    icon: Mountain,
    gradient: "from-primary to-primary-600",
    area: "২৭৬.৮৪",
    population: "২,৫১,৭৮৬",
    unions: 6,
    pourashava: 1,
    famousPlaces: ["ভোলাগঞ্জ পাথর কোয়ারি", "সুরমা নদী", "পাথর ঘাট"],
    unionList: [
      { id: "islampur_uttar", name: "ইসলামপুর উত্তর", villages: 12, schools: 5, markets: 2, population: 25000 },
      { id: "islampur_dakkhin", name: "ইসলামপুর দক্ষিণ", villages: 10, schools: 4, markets: 2, population: 22000 },
      { id: "rustampur", name: "রুস্তমপুর", villages: 15, schools: 6, markets: 3, population: 28000 },
    ],
  },
  gowainghat: {
    name: "গোয়াইনঘাট উপজেলা",
    icon: Trees,
    gradient: "from-accent to-accent-600",
    area: "৩৮৭.১৩",
    population: "২,৮৩,৪৫৬",
    unions: 11,
    pourashava: 1,
    famousPlaces: ["জাফলং", "রাতারগুল জলাবন", "বিছনাকান্দি", "পিয়াইন নদী"],
    unionList: [
      { id: "jaflong", name: "জাফলং", villages: 8, schools: 3, markets: 1, population: 18000 },
      { id: "fatehpur", name: "ফতেহপুর", villages: 14, schools: 5, markets: 2, population: 26000 },
    ],
  },
  jaintapur: {
    name: "জৈন্তাপুর উপজেলা",
    icon: Landmark,
    gradient: "from-amber-500 to-orange-600",
    area: "১৮৪.৪০",
    population: "১,৫০,৮৭৬",
    unions: 6,
    pourashava: 1,
    famousPlaces: ["জৈন্তা রাজবাড়ি", "সংগ্রামপুঞ্জি ঝরনা", "লালাখাল"],
    unionList: [
      { id: "jaintapur_sadar", name: "জৈন্তাপুর সদর", villages: 10, schools: 4, markets: 2, population: 24000 },
      { id: "chiknagul", name: "চিকনাগুল", villages: 12, schools: 5, markets: 1, population: 21000 },
    ],
  },
};

export default function AreasPage() {
  const [expandedUnions, setExpandedUnions] = useState<string[]>([]);

  const toggleUnion = (unionId: string) => {
    setExpandedUnions((prev) =>
      prev.includes(unionId) ? prev.filter((id) => id !== unionId) : [...prev, unionId]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">এলাকা পরিচিতি</h1>
            <p className="text-gray-600">সিলেট-৪ আসনের সকল উপজেলা ও ইউনিয়নের বিস্তারিত তথ্য</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {Object.entries(upazilaData).map(([key, data]) => {
          const Icon = data.icon;
          return (
            <UpazilaCard
              key={key}
              name={data.name}
              icon={<Icon className="w-7 h-7" />}
              gradient={data.gradient}
              area={data.area}
              population={data.population}
              unions={data.unions}
              pourashava={data.pourashava}
              famousPlaces={data.famousPlaces}
              unionList={data.unionList}
              expandedUnions={expandedUnions}
              onToggleUnion={toggleUnion}
            />
          );
        })}
      </div>
    </div>
  );
}

interface UpazilaCardProps {
  name: string;
  icon: React.ReactNode;
  gradient: string;
  area: string;
  population: string;
  unions: number;
  pourashava: number;
  famousPlaces: string[];
  unionList: Union[];
  expandedUnions: string[];
  onToggleUnion: (id: string) => void;
}

function UpazilaCard({
  name,
  icon,
  gradient,
  area,
  population,
  unions,
  pourashava,
  famousPlaces,
  unionList,
  expandedUnions,
  onToggleUnion,
}: UpazilaCardProps) {
  return (
    <Card className="shadow-xl border-gray-100 overflow-hidden">
      <div className={`bg-gradient-to-r ${gradient} p-6 text-white`}>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
            {icon}
          </div>
          <div>
            <h2 className="text-2xl font-bold">{name}</h2>
            <p className="opacity-80">সিলেট জেলা, বাংলাদেশ</p>
          </div>
        </div>
      </div>

      <CardContent className="p-6">
        {/* Quick Facts */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <QuickFact icon={<MapPin />} value={area} label="বর্গ কি.মি." />
          <QuickFact icon={<Users />} value={population} label="জনসংখ্যা" />
          <QuickFact icon={<Building2 />} value={toBanglaNumber(unions)} label="ইউনিয়ন" />
          <QuickFact icon={<Building2 />} value={toBanglaNumber(pourashava)} label="পৌরসভা" />
        </div>

        {/* Famous Places */}
        <div className="mb-6">
          <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
            <Landmark className="w-5 h-5 text-primary" />
            বিখ্যাত স্থান
          </h3>
          <div className="flex flex-wrap gap-2">
            {famousPlaces.map((place) => (
              <span key={place} className="px-3 py-1.5 bg-primary-50 text-primary rounded-full text-sm">
                {place}
              </span>
            ))}
          </div>
        </div>

        {/* Unions List */}
        <div className="border-t border-gray-100 pt-6">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            ইউনিয়নসমূহ
          </h3>

          <div className="space-y-3">
            {unionList.map((union) => {
              const isExpanded = expandedUnions.includes(union.id);
              return (
                <div key={union.id} className="border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => onToggleUnion(union.id)}
                    className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <span className="font-medium text-gray-700">{union.name}</span>
                    <ChevronDown
                      className={cn(
                        "w-5 h-5 text-gray-400 transition-transform",
                        isExpanded && "rotate-180"
                      )}
                    />
                  </button>
                  {isExpanded && (
                    <div className="p-4 border-t border-gray-100 animate-slide-down">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">গ্রাম:</span>
                          <span className="font-medium text-gray-700 ml-2">
                            {toBanglaNumber(union.villages)}টি
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">স্কুল:</span>
                          <span className="font-medium text-gray-700 ml-2">
                            {toBanglaNumber(union.schools)}টি
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">বাজার:</span>
                          <span className="font-medium text-gray-700 ml-2">
                            {toBanglaNumber(union.markets)}টি
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">জনসংখ্যা:</span>
                          <span className="font-medium text-gray-700 ml-2">
                            {toBanglaNumber(union.population)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Source */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-400 flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            তথ্যসূত্র: উপজেলা প্রশাসন, বাংলাদেশ পরিসংখ্যান ব্যুরো
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function QuickFact({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4 text-center">
      <div className="text-gray-400 mb-2 flex justify-center">{icon}</div>
      <div className="text-2xl font-bold text-primary">{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  );
}