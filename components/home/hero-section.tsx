import Link from "next/link";
import { Button, ShaplaIcon } from "@/components/ui";
import { PlusCircle, List, Vote, MapPin } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 gradient-hero" />

      {/* Subtle Pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Floating Decorative Shapes */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-float" />
      <div
        className="absolute bottom-20 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-float"
        style={{ animationDelay: "-3s" }}
      />
      <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-yellow-400/20 rounded-full blur-lg animate-pulse" />

      {/* Red Accent - Subtle bottom corner */}
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-tl from-red-600/20 to-transparent rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12 md:py-20">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left Content */}
          <div className="text-white text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur rounded-full px-4 py-1.5 text-sm mb-6 animate-fade-in">
              <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
              জাতীয় সংসদ নির্বাচন ২০২৬
            </div>

            <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight animate-slide-up">
              আপনার কথা
              <br />
              <span className="text-yellow-300">আমরা শুনতে চাই</span>
            </h1>

            <p className="text-lg md:text-xl opacity-90 mb-8 leading-relaxed animate-slide-up">
              সিলেট-৪ আসনের <strong>কোম্পানীগঞ্জ</strong>,{" "}
              <strong>গোয়াইনঘাট</strong> ও <strong>জৈন্তাপুর</strong> এর প্রতিটি
              মানুষের সমস্যা সমাধানে আমরা প্রতিশ্রুতিবদ্ধ।
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start animate-slide-up">
              <Link href="/submit">
                <Button variant="accent" size="lg" className="w-full sm:w-auto">
                  <PlusCircle className="w-5 h-5" />
                  সমস্যা জানান
                </Button>
              </Link>
              <Link href="/problems">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  <List className="w-5 h-5" />
                  সমস্যা দেখুন
                </Button>
              </Link>
            </div>
          </div>

          {/* Right - Candidate Card */}
          <div className="flex justify-center animate-fade-in">
            <div className="relative">
              {/* Decorative Ring */}
              <div className="absolute -inset-4 bg-gradient-to-r from-yellow-400 via-white/50 to-yellow-400 rounded-3xl blur-xl opacity-30 animate-pulse" />

              <div className="relative bg-white/15 backdrop-blur-lg rounded-3xl p-6 max-w-sm border border-white/20">
                {/* Candidate Image Placeholder */}
                <div className="relative w-48 h-48 mx-auto mb-4">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-400/30 to-yellow-400/30 rounded-full animate-spin-slow opacity-50" />
                  <div className="relative w-full h-full bg-gradient-to-br from-white/90 to-gray-100 rounded-full flex items-center justify-center overflow-hidden border-4 border-white shadow-xl">
                    {/* Replace with actual image */}
                    <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-4xl">👤</span>
                    </div>
                  </div>
                  {/* Election Symbol Badge */}
                  <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center border-4 border-yellow-400">
                    <ShaplaIcon className="w-10 h-10" />
                  </div>
                </div>

                <div className="text-center text-white">
                  <h2 className="text-2xl font-bold mb-1">রাশেল উল আলম</h2>
                  <p className="text-yellow-300 font-medium mb-3">
                    প্রার্থী - সিলেট ৪
                  </p>
                  <div className="flex items-center justify-center gap-2 text-sm opacity-90">
                    <Vote className="w-4 h-4" />
                    <span>প্রতীক: শাপলা কলি</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-white/20">
                  <p className="text-center text-white/80 text-sm italic">
                    "প্রতিটি সমস্যা সমাধানে আমার প্রতিশ্রুতি"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave Bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
        >
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="#f9fafb"
          />
        </svg>
      </div>
    </section>
  );
}