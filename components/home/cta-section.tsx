import Link from "next/link";
import { Button } from "@/components/ui";
import { Ear, Target, CheckCheck, PlusCircle } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-12 px-4 bg-gradient-to-br from-primary-50 to-white relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            আমাদের প্রতিশ্রুতি
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            আপনার <span className="gradient-text">সমস্যা</span>, আমার{" "}
            <span className="gradient-text">দায়িত্ব</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            প্রতিটি ইউনিয়ন, প্রতিটি গ্রাম, প্রতিটি পরিবারের কথা শুনতে চাই। আপনার
            সমস্যার সমাধানই আমার নির্বাচনী প্রতিশ্রুতি।
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Promise Card 1 */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center card-hover">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Ear className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              শুনব আপনার কথা
            </h3>
            <p className="text-sm text-gray-600">
              প্রতিটি সমস্যা মনোযোগ দিয়ে শুনব এবং রেকর্ড করব
            </p>
          </div>

          {/* Promise Card 2 */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center card-hover">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              সমাধানে প্রতিশ্রুতি
            </h3>
            <p className="text-sm text-gray-600">
              সম্ভব হলে তাৎক্ষণিক, না হলে সুনির্দিষ্ট সময়সীমা
            </p>
          </div>

          {/* Promise Card 3 */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center card-hover">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <CheckCheck className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              স্বচ্ছ অগ্রগতি
            </h3>
            <p className="text-sm text-gray-600">
              সব অগ্রগতি public-এ দেখানো হবে, before/after সহ
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-10 text-center">
          <Link href="/submit">
            <Button variant="primary" size="lg" className="animate-glow">
              <PlusCircle className="w-6 h-6" />
              এখনই আপনার সমস্যা জানান
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}