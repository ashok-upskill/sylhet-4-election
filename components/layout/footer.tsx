// components/layout/footer.tsx
'use client';

import Link from "next/link";
import Image from "next/image";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  Linkedin,
  Heart,
  ArrowRight,
  ExternalLink
} from "lucide-react";
import { ShaplaIcon } from "@/components/ui";
import { useSiteSettings } from "@/hooks/use-site-settings";

export function Footer() {
  const { siteInfo, candidateInfo, socialLinks } = useSiteSettings();

  const socialIcons: Record<string, React.ElementType> = {
    facebook: Facebook,
    twitter: Twitter,
    instagram: Instagram,
    youtube: Youtube,
    linkedin: Linkedin,
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gray-900 text-gray-300 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Main Footer Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Brand & Candidate Profile (Col-span-5) */}
          <div className="lg:col-span-5 space-y-8">
            {/* Logo */}
            <div className="flex items-center gap-3 group">
              <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 p-0.5 shadow-lg shadow-green-900/20 group-hover:scale-105 transition-transform duration-300">
                <div className="w-full h-full bg-gray-900 rounded-[10px] flex items-center justify-center overflow-hidden">
                  {siteInfo?.logo_url ? (
                    <Image
                      src={siteInfo.logo_url}
                      alt={siteInfo.site_name || 'Logo'}
                      width={36}
                      height={36}
                      className="object-contain brightness-0 invert"
                    />
                  ) : (
                    <ShaplaIcon className="w-7 h-7 text-green-400" />
                  )}
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white tracking-tight">
                  {siteInfo?.site_name || 'সিলেট-৪'}
                </h3>
                <p className="text-sm text-green-400 font-medium">
                  {candidateInfo?.symbol || 'শাপলা কলি'}
                </p>
              </div>
            </div>
            
            {candidateInfo?.bio && (
              <p className="text-gray-400 leading-relaxed max-w-md">
                {candidateInfo.bio}
              </p>
            )}

            {/* Candidate Card */}
            {candidateInfo && (
              <Link 
                href="/candidate"
                className="inline-flex items-center gap-4 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-green-500/30 rounded-2xl p-4 transition-all duration-300 group max-w-sm"
              >
                {candidateInfo.photo_url ? (
                  <div className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-green-500/20 group-hover:ring-green-500 transition-all">
                    <Image
                      src={candidateInfo.photo_url}
                      alt={candidateInfo.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-xl">
                      {candidateInfo.name?.charAt(0)}
                    </span>
                  </div>
                )}
                <div>
                  <p className="font-bold text-white group-hover:text-green-400 transition-colors">
                    {candidateInfo.name}
                  </p>
                  <p className="text-sm text-gray-400 group-hover:text-gray-300">
                    {candidateInfo.designation}
                  </p>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-600 group-hover:text-green-400 transition-colors ml-auto" />
              </Link>
            )}
          </div>

          {/* Quick Links (Col-span-3) */}
          <div className="lg:col-span-3 lg:pl-8">
            <h4 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-green-500 rounded-full"></span>
              দ্রুত লিংক
            </h4>
            <ul className="space-y-3">
              {[
                { href: '/', label: 'হোম' },
                { href: '/submit', label: 'সমস্যা জমা দিন' },
                { href: '/problems', label: 'সমস্যাসমূহ' },
                { href: '/stats', label: 'পরিসংখ্যান' },
                { href: '/candidate', label: 'প্রার্থী পরিচিতি' },
              ].map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="group flex items-center gap-2 text-gray-400 hover:text-green-400 transition-all duration-200"
                  >
                    <ArrowRight className="w-4 h-4 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 text-green-500" />
                    <span className="group-hover:translate-x-1 transition-transform duration-200">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Social (Col-span-4) */}
          <div className="lg:col-span-4">
            <h4 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-green-500 rounded-full"></span>
              যোগাযোগ
            </h4>
            
            <ul className="space-y-4 mb-8">
              {siteInfo?.office_address && (
                <li className="flex items-start gap-3 group">
                  <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center flex-shrink-0 group-hover:bg-green-500/10 transition-colors">
                    <MapPin className="w-5 h-5 text-gray-400 group-hover:text-green-400 transition-colors" />
                  </div>
                  <span className="text-sm leading-relaxed text-gray-400 group-hover:text-gray-300 pt-2">
                    {siteInfo.office_address}
                  </span>
                </li>
              )}
              {siteInfo?.contact_phone && (
                <li>
                  <a 
                    href={`tel:${siteInfo.contact_phone}`}
                    className="flex items-center gap-3 group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center flex-shrink-0 group-hover:bg-green-500/10 transition-colors">
                      <Phone className="w-5 h-5 text-gray-400 group-hover:text-green-400 transition-colors" />
                    </div>
                    <span className="text-sm text-gray-400 group-hover:text-green-400 transition-colors font-medium">
                      {siteInfo.contact_phone}
                    </span>
                  </a>
                </li>
              )}
              {siteInfo?.contact_email && (
                <li>
                  <a 
                    href={`mailto:${siteInfo.contact_email}`}
                    className="flex items-center gap-3 group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center flex-shrink-0 group-hover:bg-green-500/10 transition-colors">
                      <Mail className="w-5 h-5 text-gray-400 group-hover:text-green-400 transition-colors" />
                    </div>
                    <span className="text-sm text-gray-400 group-hover:text-green-400 transition-colors font-medium">
                      {siteInfo.contact_email}
                    </span>
                  </a>
                </li>
              )}
            </ul>

            {/* Social Links */}
            {socialLinks && Object.values(socialLinks).some(v => v) && (
              <div>
                <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                  সোশ্যাল মিডিয়া
                </h5>
                <div className="flex items-center gap-3">
                  {Object.entries(socialLinks).map(([key, url]) => {
                    if (!url) return null;
                    const Icon = socialIcons[key];
                    return (
                      <a
                        key={key}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-lg bg-gray-800 hover:bg-green-600 flex items-center justify-center transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-green-900/50 group"
                      >
                        <Icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 bg-gray-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
            <p>
              © {currentYear} <span className="text-gray-300 font-medium">{siteInfo?.site_name}</span>. সর্বস্বত্ব সংরক্ষিত।
            </p>
            <div className="flex items-center gap-6">
              <Link href="#" className="hover:text-green-400 transition-colors">গোপনীয়তা নীতি</Link>
              <Link href="#" className="hover:text-green-400 transition-colors">শর্তাবলী</Link>
              <span className="flex items-center gap-1.5 px-3 py-1 bg-gray-800 rounded-full text-xs">
                Developed by UpSkill Bangladesh 
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}