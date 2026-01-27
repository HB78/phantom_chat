'use client';

import { ComparisonTable } from '@/components/landing/ComparisonTable';
import { FAQSection } from '@/components/landing/FAQSection';
import { FeaturesGrid } from '@/components/landing/FeaturesGrid';
import { FinalCTA } from '@/components/landing/FinalCTA';
import { Footer } from '@/components/landing/Footer';
import { HeroSection } from '@/components/landing/HeroSection';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { SecurityStats } from '@/components/landing/SecurityStats';

export default function LandingPage() {
  return (
    <>
      <main id="main-content" className="min-h-screen bg-zinc-950">
        <HeroSection />
        <FeaturesGrid />
        <HowItWorks />
        <SecurityStats />
        <ComparisonTable />
        <FAQSection />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
