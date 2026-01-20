// components/home/hero-section.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button, ShaplaIcon } from "@/components/ui";
import { 
  PlusCircle, 
  List, 
  Vote, 
  MapPin,
  ArrowRight,
  Phone,
  Sparkles
} from "lucide-react";
import { useSiteSettings } from "@/hooks/use-site-settings";

export function HeroSection() {
  const [mounted, setMounted] = useState(false);
  const { siteInfo, candidateInfo, loading } = useSiteSettings();

  useEffect(() => {
    setMounted(true);
  }, []);

  const candidate = {
    name: candidateInfo?.name || "রাশেল উল আলম",
    name_english: candidateInfo?.name_english || "Rashel Ul Alam",
    designation: candidateInfo?.designation || "স্বতন্ত্র প্রার্থী",
    symbol: candidateInfo?.symbol || "শাপলা কলি",
    photo_url: candidateInfo?.photo_url || null,
    quote: candidateInfo?.quote || "আপনার সমস্যার সমাধানই আমার দায়িত্ব"
  };

  const site = {
    symbol_url: siteInfo?.symbol_url || null,
    contact_phone: siteInfo?.contact_phone || null
  };

  return (
    <section className="relative min-h-[580px] md:min-h-[620px] overflow-hidden">
      
      {/* Rich Background */}
      <div className="absolute inset-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1f15] via-[#0d2818] to-[#071a10]" />
        
        {/* Colored orbs */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-emerald-500/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-green-600/15 rounded-full blur-[100px] translate-x-1/3" />
        <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-[80px] translate-y-1/2" />
        <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-yellow-500/5 rounded-full blur-[60px]" />
        
        {/* Mesh gradient overlay */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              radial-gradient(at 20% 30%, rgba(16, 185, 129, 0.15) 0px, transparent 50%),
              radial-gradient(at 80% 20%, rgba(5, 150, 105, 0.1) 0px, transparent 50%),
              radial-gradient(at 70% 80%, rgba(20, 184, 166, 0.1) 0px, transparent 50%),
              radial-gradient(at 30% 70%, rgba(4, 120, 87, 0.15) 0px, transparent 50%)
            `
          }}
        />
        
        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />
        
        {/* Floating decorative elements */}
        <div className="absolute top-20 left-[15%] w-2 h-2 bg-green-400/30 rounded-full animate-pulse" />
        <div className="absolute top-32 right-[20%] w-1.5 h-1.5 bg-yellow-400/40 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-40 left-[25%] w-1 h-1 bg-emerald-400/30 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
        <div className="absolute top-1/2 left-[10%] w-1.5 h-1.5 bg-teal-400/20 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }} />
        
        {/* Gradient lines */}
        <div className="absolute top-0 left-1/4 w-px h-40 bg-gradient-to-b from-green-500/20 to-transparent" />
        <div className="absolute top-0 right-1/3 w-px h-32 bg-gradient-to-b from-emerald-500/10 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 pt-14 pb-20 md:pt-16 md:pb-24 lg:pt-20 lg:pb-28">
        
        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-10 items-center">
          
          {/* Left - Text Content */}
          <div className="order-2 lg:order-1 text-center lg:text-left">
            
            {/* Election Badge */}
            <div className="flex justify-center lg:justify-start mb-8">
              <div className="inline-flex items-center gap-2.5 bg-white/[0.06] backdrop-blur-md rounded-full pl-2.5 pr-4 py-2 border border-white/[0.08] shadow-lg shadow-black/5">
                <div className="flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-yellow-400/20 to-orange-500/20 border border-yellow-500/20">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                </div>
                <span className="text-white/70 text-sm">নির্বাচন ২০২৬</span>
                <span className="w-px h-4 bg-white/20" />
                <span className="text-yellow-400 text-sm font-semibold">সিলেট-৪</span>
              </div>
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] xl:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
              <span className="text-white">আমি শুনতে চাই</span>
              <br />
              <span className="bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-400 bg-clip-text text-transparent">
                আপনার কথা
              </span>
            </h1>

            {/* Description */}
            <p className="text-base md:text-lg text-white/55 leading-relaxed mb-8 max-w-md mx-auto lg:mx-0">
              কোম্পানীগঞ্জ, গোয়াইনঘাট ও জৈন্তাপুর — আপনার এলাকার যেকোনো সমস্যা 
              সরাসরি আমাকে জানান। প্রতিটি সমস্যা আমি ব্যক্তিগতভাবে দেখব।
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-8">
              <Link href="/submit">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto h-13 px-7 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-gray-900 font-bold rounded-xl shadow-lg shadow-yellow-500/25 hover:shadow-yellow-500/40 hover:scale-[1.02] transition-all duration-300 group"
                >
                  <PlusCircle className="w-5 h-5" />
                  সমস্যা জানান
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/problems">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full sm:w-auto h-13 px-7 bg-white/[0.03] border-2 border-white/15 text-white hover:bg-white/[0.08] hover:border-white/25 font-semibold rounded-xl backdrop-blur-sm transition-all duration-300"
                >
                  <List className="w-5 h-5" />
                  সব সমস্যা দেখুন
                </Button>
              </Link>
            </div>

            {/* Upazila Tags */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-2">
              {['কোম্পানীগঞ্জ', 'গোয়াইনঘাট', 'জৈন্তাপুর'].map((upazila, i) => (
                <div 
                  key={upazila}
                  className="flex items-center gap-2 bg-white/[0.04] hover:bg-white/[0.07] px-3.5 py-2 rounded-full border border-white/[0.06] transition-colors cursor-default"
                >
                  <MapPin className="w-3.5 h-3.5 text-green-400/80" />
                  <span className="text-sm text-white/50">{upazila}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Candidate Card */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
            <div className="relative">
              
              {/* Card glow */}
              <div className="absolute -inset-4 bg-gradient-to-br from-green-500/10 via-transparent to-yellow-500/5 rounded-[40px] blur-2xl" />
              
              {/* Card */}
              <div className="relative w-[290px] sm:w-[320px] bg-gradient-to-b from-white/[0.08] to-white/[0.03] backdrop-blur-xl rounded-3xl p-7 border border-white/[0.08] shadow-2xl shadow-black/20">
                
                {/* Symbol badge */}
                <div className="absolute -top-4 -right-4 z-20">
                  <div className="relative">
                    <div className="absolute inset-0 bg-yellow-400/30 rounded-2xl blur-lg" />
                    <div className="relative w-14 h-14 bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 rounded-xl rotate-12 shadow-lg flex items-center justify-center">
                      <div className="-rotate-12">
                        {site.symbol_url ? (
                          <Image
                            src={site.symbol_url}
                            alt="Symbol"
                            width={32}
                            height={32}
                            className="object-contain"
                          />
                        ) : (
                          <ShaplaIcon className="w-8 h-8 text-white" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Photo */}
                <div className="relative w-32 h-32 mx-auto mb-5">
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-green-500/20 rounded-full blur-xl" />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-400 via-green-400 to-green-500 p-[2.5px]">
                    <div className="w-full h-full rounded-full bg-[#0d2818]" />
                  </div>
                  <div className="absolute inset-1.5 rounded-full overflow-hidden">
                    {candidate.photo_url ? (
                      <Image
                        src={candidate.photo_url}
                        alt={candidate.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-800 to-emerald-900">
                        <span className="text-4xl opacity-50">👤</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Name & Info */}
                <div className="text-center">
                  <h2 className="text-xl font-bold text-white mb-1">
                    {candidate.name}
                  </h2>
                  <p className="text-white/35 text-xs mb-2.5">
                    {candidate.name_english}
                  </p>
                  <p className="text-yellow-400/90 text-sm font-medium">
                    {candidate.designation}
                  </p>
                </div>
                
                {/* Divider */}
                <div className="my-5 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                {/* Symbol */}
                <div className="flex justify-center mb-4">
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/15 rounded-xl px-4 py-2.5">
                    <Vote className="w-4 h-4 text-yellow-400" />
                    <span className="text-white/50 text-sm">প্রতীক:</span>
                    <span className="text-yellow-400 font-bold text-sm">{candidate.symbol}</span>
                  </div>
                </div>

                {/* Quote */}
                <p className="text-center text-white/35 text-sm italic leading-relaxed">
                  "{candidate.quote}"
                </p>

                {/* Contact */}
                {site.contact_phone && (
                  <a 
                    href={`tel:${site.contact_phone}`}
                    className="mt-5 flex items-center justify-center gap-2 w-full py-3 bg-green-500/10 hover:bg-green-500/20 border border-green-500/15 hover:border-green-500/25 rounded-xl text-green-400 text-sm font-medium transition-all group"
                  >
                    <Phone className="w-4 h-4 group-hover:animate-pulse" />
                    যোগাযোগ করুন
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute -bottom-px left-0 right-0">
        <svg
          viewBox="0 0 1440 70"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto block"
          preserveAspectRatio="none"
        >
          <path
            d="M0 70V35C240 10 480 50 720 45C960 40 1200 15 1440 25V70H0Z"
            fill="#f9fafb"
          />
        </svg>
      </div>
    </section>
  );
}