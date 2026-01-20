// app/candidate/page.tsx
'use client';

import Image from 'next/image';
import { Card, CardContent, ShaplaIcon } from "@/components/ui";
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
  CheckCircle2,
  Vote,
  Users,
  Target,
  Heart,
  MessageCircle,
  Loader2,
} from "lucide-react";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { toBanglaNumber } from "@/lib/utils";

export default function CandidatePage() {
  const { siteInfo, candidateInfo, socialLinks, loading } = useSiteSettings();

  const socialIcons: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
    facebook: { icon: Facebook, color: 'text-white', bg: 'bg-blue-600 hover:bg-blue-700' },
    twitter: { icon: Twitter, color: 'text-white', bg: 'bg-sky-500 hover:bg-sky-600' },
    instagram: { icon: Instagram, color: 'text-white', bg: 'bg-pink-600 hover:bg-pink-700' },
    youtube: { icon: Youtube, color: 'text-white', bg: 'bg-red-600 hover:bg-red-700' },
    linkedin: { icon: Linkedin, color: 'text-white', bg: 'bg-blue-700 hover:bg-blue-800' },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  // Fallback for demo if no data
  const defaultInfo = {
    name: "রাশেল উল আলম",
    symbol: "শাপলা কলি",
    bio: "জনগণের সেবায় নিবেদিত একজন সৎ ও দক্ষ প্রার্থী",
    designation: "স্বতন্ত্র প্রার্থী"
  };

  const info = candidateInfo || defaultInfo;

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Profile Header */}
      <div className="relative bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 overflow-hidden">
        {/* Background Pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto px-4 py-12 md:py-16">
          <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
            {/* Profile Image */}
            <div className="relative group">
              <div className="w-48 h-48 rounded-full bg-white p-2 shadow-2xl transition-transform duration-300 group-hover:scale-105">
                <div className="w-full h-full rounded-full overflow-hidden relative">
                  {candidateInfo?.photo_url ? (
                    <Image
                      src={candidateInfo.photo_url}
                      alt={info.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <span className="text-5xl">👤</span>
                    </div>
                  )}
                </div>
              </div>
              {/* Election Symbol Badge */}
              <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center border-4 border-yellow-400 overflow-hidden">
                {siteInfo?.symbol_url ? (
                  <div className="relative w-10 h-10">
                    <Image
                      src={siteInfo.symbol_url}
                      alt="Symbol"
                      fill
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <ShaplaIcon className="w-10 h-10 text-green-600" />
                )}
              </div>
            </div>

            {/* Profile Info */}
            <div className="text-white flex-1">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm mb-3 border border-white/10">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_10px_#4ade80]" />
                {candidateInfo?.designation || 'প্রার্থী'} - সিলেট ৪
              </div>
              <h1 className="text-3xl md:text-5xl font-bold mb-2 tracking-tight">
                {info.name}
              </h1>
              {candidateInfo?.name_english && (
                <p className="text-lg text-emerald-100 font-medium mb-4">
                  {candidateInfo.name_english}
                </p>
              )}

              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                <span className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur px-4 py-2 rounded-full text-sm transition-colors border border-white/10">
                  <Vote className="w-4 h-4" />
                  প্রতীক: {info.symbol}
                </span>
                <span className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur px-4 py-2 rounded-full text-sm transition-colors border border-white/10">
                  <MapPin className="w-4 h-4" />
                  কোম্পানীগঞ্জ • গোয়াইনঘাট • জৈন্তাপুর
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 -mt-8 relative z-20">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="shadow-lg border-gray-100 text-center hover:shadow-xl transition-shadow bg-white/90 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="text-2xl md:text-3xl font-bold text-green-600">{toBanglaNumber(247)}</div>
              <div className="text-xs md:text-sm text-gray-500 font-medium mt-1">সমস্যা গ্রহণ</div>
            </CardContent>
          </Card>
          <Card className="shadow-lg border-gray-100 text-center hover:shadow-xl transition-shadow bg-white/90 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="text-2xl md:text-3xl font-bold text-blue-600">{toBanglaNumber(89)}</div>
              <div className="text-xs md:text-sm text-gray-500 font-medium mt-1">সমাধান</div>
            </CardContent>
          </Card>
          <Card className="shadow-lg border-gray-100 text-center hover:shadow-xl transition-shadow bg-white/90 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="text-2xl md:text-3xl font-bold text-purple-600">{toBanglaNumber(52)}</div>
              <div className="text-xs md:text-sm text-gray-500 font-medium mt-1">প্রতিশ্রুতি</div>
            </CardContent>
          </Card>
        </div>

        {/* About Section */}
        <Card className="shadow-lg border-gray-100 overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-green-500 to-emerald-500" />
          <CardContent className="p-6 md:p-8">
            <h2 className="font-bold text-xl text-gray-900 mb-6 flex items-center gap-2">
              <Users className="w-6 h-6 text-green-600" />
              প্রার্থী পরিচিতি
            </h2>
            
            {candidateInfo?.bio && (
              <p className="text-gray-600 leading-relaxed mb-8 text-lg">
                {candidateInfo.bio}
              </p>
            )}

            {/* Dynamic Commitments / Vision */}
            {candidateInfo?.vision && (
              <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
                <h3 className="font-bold text-green-800 mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  লক্ষ্য ও উদ্দেশ্য
                </h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {candidateInfo.vision}
                </p>
              </div>
            )}

            {(candidateInfo?.education || candidateInfo?.experience) && (
              <div className="grid md:grid-cols-2 gap-6 mt-8">
                {candidateInfo.education && (
                  <div className="border border-gray-100 rounded-xl p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">শিক্ষাগত যোগ্যতা</h4>
                    <p className="text-gray-600">{candidateInfo.education}</p>
                  </div>
                )}
                {candidateInfo.experience && (
                  <div className="border border-gray-100 rounded-xl p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">অভিজ্ঞতা</h4>
                    <p className="text-gray-600">{candidateInfo.experience}</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Vision & Mission Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <VisionCard 
            icon={Heart} 
            color="blue"
            title="শুনব আপনার কথা" 
            desc="প্রতিটি সমস্যা মনোযোগ দিয়ে শুনে লিখিতভাবে নথিভুক্ত করা হবে" 
          />
          <VisionCard 
            icon={Target} 
            color="purple"
            title="সমাধানে প্রতিশ্রুতি" 
            desc="সম্ভব হলে তাৎক্ষণিক সমাধান, না হলে নির্দিষ্ট সময়সীমা জানানো হবে" 
          />
          <VisionCard 
            icon={CheckCircle2} 
            color="green"
            title="স্বচ্ছ অগ্রগতি" 
            desc="প্রতিটি কাজের অগ্রগতি সবার সামনে স্বচ্ছভাবে প্রকাশ করা হবে, আগে ও পরে অবস্থার স্পষ্ট প্রমাণসহ" 
          />
        </div>

        {/* Contact Section */}
        <Card className="shadow-lg border-gray-100 overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-500" />
          <CardContent className="p-6 md:p-8">
            <h2 className="font-bold text-xl text-gray-900 mb-6 flex items-center gap-2">
              <MessageCircle className="w-6 h-6 text-blue-600" />
              যোগাযোগ
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              {siteInfo?.contact_phone && (
                <a
                  href={`tel:${siteInfo.contact_phone}`}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-green-50 transition-all group border border-transparent hover:border-green-200"
                >
                  <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition-colors">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">ফোন করুন</div>
                    <div className="text-sm text-gray-600">{siteInfo.contact_phone}</div>
                  </div>
                </a>
              )}

              {/* Dynamic Social Links */}
              {socialLinks && Object.entries(socialLinks).map(([key, url]) => {
                if (!url) return null;
                const social = socialIcons[key];
                if (!social) return null;
                const Icon = social.icon;
                
                return (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all group border border-transparent hover:border-gray-200"
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${social.bg}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 capitalize">{key}</div>
                      <div className="text-sm text-gray-600">ফলো করুন</div>
                    </div>
                  </a>
                );
              })}

              {siteInfo?.contact_email && (
                <a
                  href={`mailto:${siteInfo.contact_email}`}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-purple-50 transition-all group border border-transparent hover:border-purple-200"
                >
                  <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">ইমেইল</div>
                    <div className="text-sm text-gray-600">{siteInfo.contact_email}</div>
                  </div>
                </a>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Campaign Message */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl p-8 md:p-12 text-white text-center relative overflow-hidden shadow-xl">
          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-16 -translate-y-16 blur-2xl" />
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/10 rounded-full translate-x-20 translate-y-20 blur-2xl" />
          
          <div className="relative z-10">
            <div className="text-6xl mb-6 animate-bounce">🗳️</div>
            <h3 className="text-3xl font-bold mb-3">আপনার একটি ভোট</h3>
            <p className="text-xl text-green-100 mb-8 max-w-lg mx-auto">
              পরিবর্তন আনতে পারে এই এলাকায়। আমাদের সাথে যোগ দিন।
            </p>
            <div className="inline-flex items-center gap-3 bg-white text-green-700 px-8 py-4 rounded-full shadow-lg hover:scale-105 transition-transform cursor-default">
              {siteInfo?.symbol_url ? (
                <div className="relative w-8 h-8">
                  <Image src={siteInfo.symbol_url} alt="Symbol" fill className="object-contain" />
                </div>
              ) : (
                <ShaplaIcon className="w-8 h-8" />
              )}
              <span className="text-2xl font-bold">{info.symbol}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function VisionCard({ icon: Icon, color, title, desc }: { icon: any, color: string, title: string, desc: string }) {
  const colorClasses = {
    blue: "from-blue-400 to-blue-600",
    purple: "from-purple-400 to-purple-600",
    green: "from-green-400 to-green-600"
  };

  return (
    <Card className="shadow-lg border-gray-100 text-center hover:-translate-y-1 transition-all duration-300">
      <CardContent className="p-6">
        <div className={`w-16 h-16 bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses]} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          {desc}
        </p>
      </CardContent>
    </Card>
  );
}