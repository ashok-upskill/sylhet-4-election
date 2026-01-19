import { HeroSection } from '@/components/home/hero-section';
import { StatsSection } from '@/components/home/stats-section';
import { UpazilaCards } from '@/components/home/upazila-cards';
import { RecentProblems } from '@/components/home/recent-problems';
import { CTASection } from '@/components/home/cta-section';
import { getRecentProblems } from '@/lib/api'; // ডাটাবেস ফাংশন ইম্পোর্ট

// পেজ কম্পোনেন্ট এখন async হবে কারণ আমরা ডাটা ফেচ করছি
export default async function Home() {
  // ডাটাবেস থেকে সাম্প্রতিক ৬টি সমস্যা নিয়ে আসা
  const problems = await getRecentProblems(6);

  return (
    <main className="min-h-screen">
      <HeroSection />
      
      {/* স্ট্যাটস সেকশন আপাতত স্ট্যাটিক থাকছে, পরে লাইভ করব */}
      <StatsSection />
      
      <UpazilaCards />
      
      {/* রিয়েল ডাটা পাঠাচ্ছি */}
      <RecentProblems problems={problems} />
      
      <CTASection />
    </main>
  );
}