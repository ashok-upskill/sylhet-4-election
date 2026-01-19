import { HeroSection } from '@/components/home/hero-section';
import { StatsSection } from '@/components/home/stats-section';
import { UpazilaCards } from '@/components/home/upazila-cards';
import { RecentProblems } from '@/components/home/recent-problems';
import { CTASection } from '@/components/home/cta-section';

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      
      <StatsSection />
      
      <UpazilaCards />
      
      {/* RecentProblems নিজেই data fetch করে */}
      <RecentProblems />
      
      <CTASection />
    </main>
  );
}