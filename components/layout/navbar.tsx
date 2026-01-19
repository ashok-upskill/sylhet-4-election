// components/layout/navbar.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Bell, Search, Menu, X, Phone, ChevronRight } from "lucide-react";
import { ShaplaIcon } from "@/components/ui";
import { cn } from "@/lib/utils";
import { useSiteSettings } from "@/hooks/use-site-settings";

export function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  
  const { siteInfo, candidateInfo } = useSiteSettings();
  const upazilaNames = "কোম্পানীগঞ্জ • গোয়াইনঘাট • জৈন্তাপুর";

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "হোম" },
    { href: "/problems", label: "সমস্যা" },
    { href: "/stats", label: "পরিসংখ্যান" },
    { href: "/candidate", label: "প্রার্থী" },
  ];

  return (
    <>
      <header 
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled 
            ? "bg-white/80 backdrop-blur-xl shadow-lg border-b border-white/20" 
            : "bg-white border-b border-gray-100"
        )}
      >
        {/* Top Announcement Bar */}
        <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white py-1.5 overflow-hidden relative z-50">
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10"></div>
          <div className="animate-marquee whitespace-nowrap text-xs md:text-sm font-medium flex gap-8 items-center">
            <span className="inline-flex items-center gap-2">
              🗳️ আপনার এলাকার সমস্যা জানান, সমাধান পান
            </span>
            <span className="inline-flex items-center gap-2">
              📍 {upazilaNames}
            </span>
            <span className="inline-flex items-center gap-2">
              ✨ "{siteInfo?.tagline || 'আপনার সমস্যা, আমার দায়িত্ব'}" - {candidateInfo?.name || 'রাশেল উল আলম'}
            </span>
            {/* Repeat for seamless loop */}
            <span className="inline-flex items-center gap-2">
              🗳️ আপনার এলাকার সমস্যা জানান, সমাধান পান
            </span>
            <span className="inline-flex items-center gap-2">
              📍 {upazilaNames}
            </span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20 transition-all duration-300">
            {/* Logo & Brand */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-xl overflow-hidden shadow-lg ring-2 ring-green-100 transition-transform group-hover:scale-105 duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600 opacity-10"></div>
                <div className="w-full h-full bg-white flex items-center justify-center p-2">
                  {siteInfo?.logo_url ? (
                    <Image
                      src={siteInfo.logo_url}
                      alt={siteInfo.site_name || 'Logo'}
                      width={40}
                      height={40}
                      className="object-contain"
                    />
                  ) : (
                    <ShaplaIcon className="w-full h-full text-green-600" />
                  )}
                </div>
              </div>
              <div className="flex flex-col">
                <h1 className="text-lg md:text-xl font-bold text-gray-900 leading-none tracking-tight group-hover:text-green-700 transition-colors">
                  {siteInfo?.site_name || 'সিলেট-৪'}
                </h1>
                <p className="text-xs text-green-600 font-medium mt-0.5 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                  {candidateInfo?.symbol || 'শাপলা কলি'}
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center bg-gray-100/50 p-1.5 rounded-full border border-gray-200/50 backdrop-blur-sm">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 relative",
                      isActive 
                        ? "text-green-700 bg-white shadow-sm" 
                        : "text-gray-600 hover:text-green-600 hover:bg-white/50"
                    )}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-green-500 rounded-full"></span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {/* Contact Button (Desktop) */}
              {siteInfo?.contact_phone && (
                <a 
                  href={`tel:${siteInfo.contact_phone}`}
                  className="hidden lg:flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium hover:bg-green-100 transition-colors border border-green-100"
                >
                  <Phone className="w-4 h-4" />
                  <span>{siteInfo.contact_phone}</span>
                </a>
              )}

              {/* Search Toggle */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className={cn(
                  "p-2.5 rounded-full transition-all duration-300",
                  isSearchOpen 
                    ? "bg-green-100 text-green-700" 
                    : "hover:bg-gray-100 text-gray-600"
                )}
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Submit Problem Button */}
              <Link
                href="/submit"
                className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full text-sm font-semibold hover:shadow-lg hover:shadow-green-200 hover:-translate-y-0.5 transition-all duration-300"
              >
                <span>সমস্যা জমা দিন</span>
                <ChevronRight className="w-4 h-4" />
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2.5 rounded-full hover:bg-gray-100 text-gray-600 md:hidden transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Search Bar (Expandable) */}
          <div
            className={cn(
              "overflow-hidden transition-all duration-300 ease-in-out border-t border-gray-100",
              isSearchOpen ? "max-h-20 opacity-100 py-3" : "max-h-0 opacity-0 py-0 border-none"
            )}
          >
            <div className="relative max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="কি খুঁজছেন? যেমন: রাস্তা সংস্কার..."
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-sm"
                autoFocus={isSearchOpen}
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-opacity duration-300 md:hidden",
          isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        )}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile Menu Drawer */}
      <div
        className={cn(
          "fixed top-0 right-0 bottom-0 w-[280px] bg-white z-50 shadow-2xl transition-transform duration-300 md:hidden flex flex-col",
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <span className="font-bold text-gray-900 text-lg">মেনু</span>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 hover:bg-white rounded-full transition-colors shadow-sm"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {/* Candidate Profile Card */}
          {candidateInfo && (
            <div className="mb-6 p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100">
              <div className="flex items-center gap-3 mb-3">
                {candidateInfo.photo_url ? (
                  <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-white shadow-md">
                    <Image
                      src={candidateInfo.photo_url}
                      alt={candidateInfo.name}
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-green-200 flex items-center justify-center text-green-700 font-bold">
                    {candidateInfo.name?.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="font-bold text-gray-900">{candidateInfo.name}</p>
                  <p className="text-xs text-green-600 font-medium">{candidateInfo.designation}</p>
                </div>
              </div>
              <Link
                href="/candidate"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full py-2 text-center text-sm font-medium bg-white text-green-700 rounded-lg hover:bg-green-50 transition-colors shadow-sm"
              >
                প্রোফাইল দেখুন
              </Link>
            </div>
          )}

          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                "flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200",
                pathname === link.href
                  ? "bg-green-50 text-green-700 font-medium"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              {link.label}
              <ChevronRight className={cn(
                "w-4 h-4 transition-transform",
                pathname === link.href ? "text-green-600 rotate-90" : "text-gray-400"
              )} />
            </Link>
          ))}

          {/* Mobile Submit Button */}
          <Link
            href="/submit"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center justify-center gap-2 w-full mt-6 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold shadow-lg shadow-green-200"
          >
            সমস্যা জমা দিন
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Footer Info */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50 text-center">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} {siteInfo?.site_name}
          </p>
        </div>
      </div>
    </>
  );
}