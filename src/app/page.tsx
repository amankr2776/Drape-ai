import Hero from '@/components/landing/hero';
import Features from '@/components/landing/features';
import HowItWorks from '@/components/landing/how-it-works';
import SocialProof from '@/components/landing/social-proof';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background overflow-x-hidden">
      <Hero />
      <main className="flex-grow">
        <Features />
        <HowItWorks />
        <SocialProof />
      </main>
    </div>
  );
}
