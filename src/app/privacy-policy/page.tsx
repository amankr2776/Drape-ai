'use client';

import { LegalLayout } from '@/components/legal/legal-layout';
import Link from 'next/link';

const sections = [
  { id: 'introduction', title: '1. Introduction' },
  { id: 'collection', title: '2. Information We Collect' },
  { id: 'usage', title: '3. How We Use Your Information' },
  { id: 'biometric', title: '4. Photo & Biometric Data Policy' },
  { id: 'third-party', title: '5. Third Party Services' },
  { id: 'cookies', title: '6. Cookies & Tracking' },
  { id: 'security', title: '7. Data Security' },
  { id: 'rights', title: '8. Your Rights (DPDP Act)' },
  { id: 'children', title: "9. Children's Privacy" },
  { id: 'changes', title: '10. Changes To This Policy' },
  { id: 'contact', title: '11. Contact Us' },
];

export default function PrivacyPolicy() {
  return (
    <LegalLayout
      title="Privacy Policy"
      lastUpdated="June 20, 2025"
      sections={sections}
      relatedLink={{ href: '/terms', label: 'Terms & Conditions' }}
    >
      <div className="prose prose-invert prose-gold max-w-none">
        <section id="introduction" className="scroll-mt-32">
          <h2 className="text-4xl font-headline text-primary mb-6">1. Introduction</h2>
          <p className="text-lg leading-relaxed text-foreground/80 mb-4">
            Welcome to DRAPE AI. We value your privacy as much as your style. This Privacy Policy describes how DRAPE AI ("we", "us", or "our") collects, uses, and shares your personal information when you use our website, mobile application, and AI styling services (collectively, the "Services").
          </p>
          <p className="text-lg leading-relaxed text-foreground/80">
            By accessing or using our Services, you agree to the practices described in this policy. If you have any concerns regarding your privacy, please contact our Data Protection Officer at <span className="text-primary underline">privacy@drapeai.in</span>.
          </p>
        </section>

        <section id="collection" className="scroll-mt-32">
          <h2 className="text-4xl font-headline text-primary mb-6">2. Information We Collect</h2>
          <p className="text-lg leading-relaxed text-foreground/80 mb-6">
            To provide a bespoke styling experience, we collect information that allows us to understand your unique physique and aesthetic preferences.
          </p>
          <ul className="space-y-4 list-none p-0">
            <li className="flex gap-4">
              <span className="text-primary font-bold">01.</span>
              <div>
                <strong className="text-foreground">Personal Profile:</strong>
                <p className="text-foreground/60">Name, email address, age range, and gender identity.</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="text-primary font-bold">02.</span>
              <div>
                <strong className="text-foreground">Style Geometry:</strong>
                <p className="text-foreground/60">Body measurements (height, weight range, waist/chest/hips) and body shape classification.</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="text-primary font-bold">03.</span>
              <div>
                <strong className="text-foreground">Visual Data:</strong>
                <p className="text-foreground/60">Photos uploaded for AI silhouette mapping and skin tone analysis.</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="text-primary font-bold">04.</span>
              <div>
                <strong className="text-foreground">Technical Usage:</strong>
                <p className="text-foreground/60">Device information, IP address, browser type, and interaction data (outfits clicked, time spent).</p>
              </div>
            </li>
          </ul>
        </section>

        <section id="usage" className="scroll-mt-32">
          <h2 className="text-4xl font-headline text-primary mb-6">3. How We Use Your Information</h2>
          <div className="bg-card/20 p-8 rounded-2xl border border-primary/10 border-l-4 border-l-primary">
            <p className="text-lg leading-relaxed text-foreground/80">
              We use your data exclusively to craft your digital fashion experience. This includes generating personalized outfit recommendations, mapping skin-tone harmonies, and tracking inventory across marketplaces like Amazon, Flipkart, and Meesho.
            </p>
          </div>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 bg-accent/5 rounded-xl border border-accent/10">
              <h4 className="font-bold text-accent mb-2">We NEVER sell your data</h4>
              <p className="text-sm text-foreground/60">Your personal details and measurements are never sold to third-party brokers or aggregators.</p>
            </div>
            <div className="p-6 bg-primary/5 rounded-xl border border-primary/10">
              <h4 className="font-bold text-primary mb-2">Private Visual Analysis</h4>
              <p className="text-sm text-foreground/60">Uploaded photos are used only for analysis and are never shared with advertisers or third parties.</p>
            </div>
          </div>
        </section>

        <section id="biometric" className="scroll-mt-32">
          <h2 className="text-4xl font-headline text-primary mb-6">4. Photo & Biometric Data Policy</h2>
          <p className="text-lg leading-relaxed text-foreground/80 mb-4">
            In compliance with India's Digital Personal Data Protection Act 2023, we handle your visual and physical data with the highest level of security.
          </p>
          <div className="space-y-4">
            <p className="text-foreground/80">
              <strong className="text-primary">Ephemeral Processing:</strong> Photos are processed in real-time by our AI models to extract 33 anatomical landmarks. Original photos are not stored permanently on our servers unless you explicitly save them to your Wardrobe.
            </p>
            <p className="text-foreground/80">
              <strong className="text-primary">Encryption:</strong> All biometric-adjacent data (measurements) is encrypted at rest using AES-256 standards.
            </p>
          </div>
        </section>

        <section id="third-party" className="scroll-mt-32">
          <h2 className="text-4xl font-headline text-primary mb-6">5. Third Party Services</h2>
          <p className="text-lg leading-relaxed text-foreground/80 mb-6">
            We partner with several technology providers to deliver our services:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {['Firebase (Auth)', 'Groq AI', 'Amazon/Flipkart (API)', 'Razorpay', 'Mixpanel'].map(s => (
              <div key={s} className="px-4 py-2 bg-card/40 border border-primary/5 rounded-full text-sm text-center">
                {s}
              </div>
            ))}
          </div>
        </section>

        <section id="cookies" className="scroll-mt-32">
          <h2 className="text-4xl font-headline text-primary mb-6">6. Cookies & Tracking</h2>
          <p className="text-lg leading-relaxed text-foreground/80">
            We use essential cookies to maintain your session and preferences. We also use anonymous analytics cookies to help us improve the platform. We do not use advertising or cross-site tracking cookies. You can manage your preferences at any time in the <Link href="/settings" className="text-primary underline">Settings</Link> menu.
          </p>
        </section>

        <section id="rights" className="scroll-mt-32">
          <h2 className="text-4xl font-headline text-primary mb-6">8. Your Rights (DPDP Act 2023)</h2>
          <p className="text-lg leading-relaxed text-foreground/80 mb-6">
            As a user in India, you have the following rights under the Digital Personal Data Protection Act:
          </p>
          <ul className="space-y-2 text-foreground/70">
            <li>• Right to access a summary of your personal data being processed.</li>
            <li>• Right to correct or update inaccurate or incomplete data.</li>
            <li>• Right to erasure of your account and all associated data.</li>
            <li>• Right to withdraw consent at any time.</li>
            <li>• Right to nominate another individual to exercise your rights in event of death or incapacity.</li>
          </ul>
        </section>

        <section id="contact" className="scroll-mt-32">
          <h2 className="text-4xl font-headline text-primary mb-6">11. Contact Us</h2>
          <div className="bg-card/30 p-8 rounded-2xl border border-primary/10">
            <p className="font-bold text-xl mb-4">DRAPE AI Legal Department</p>
            <p className="text-foreground/60 mb-1">Email: privacy@drapeai.in</p>
            <p className="text-foreground/60 mb-1">Registered Office: MG Road, Bangalore, Karnataka, 560001</p>
            <p className="text-foreground/60">Standard Response Time: 72 Hours</p>
          </div>
        </section>
      </div>
    </LegalLayout>
  );
}
