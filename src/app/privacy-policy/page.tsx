'use client';

import { LegalLayout } from '@/components/legal/legal-layout';
import Link from 'next/link';

const sections = [
  { id: 'introduction', title: '1. Introduction and Who We Are' },
  { id: 'collection', title: '2. Information We Collect' },
  { id: 'usage', title: '3. How We Use Your Information' },
  { id: 'biometric', title: '4. Photo and Biometric Data Policy' },
  { id: 'sharing', title: '5. Data Sharing and Third Parties' },
  { id: 'cookies', title: '6. Cookies Policy' },
  { id: 'security', title: '7. Data Security' },
  { id: 'rights', title: '8. Your Rights Under DPDP Act 2023' },
  { id: 'retention', title: '9. Data Retention' },
  { id: 'children', title: "10. Children's Privacy" },
  { id: 'changes', title: '11. Changes to This Policy' },
  { id: 'contact', title: '12. Contact Us' },
];

export default function PrivacyPolicy() {
  return (
    <LegalLayout
      title="Privacy Policy"
      lastUpdated="January 20, 2025"
      sections={sections}
      relatedLink={{ href: '/terms', label: 'Terms & Conditions' }}
    >
      <div className="prose prose-invert prose-gold max-w-none">
        <section id="introduction" className="scroll-mt-32">
          <h2 className="text-3xl font-headline text-gold mb-6 italic">1. Introduction and Who We Are</h2>
          <p className="text-lg leading-relaxed text-ivory-2 mb-4">
            DRAPE AI is an AI-powered fashion recommendation platform operated in India. This policy explains how we collect, use, and protect your personal information when you use our services at <span className="text-gold">drapeai.in</span> and our associated mobile applications.
          </p>
          <p className="text-lg leading-relaxed text-ivory-2">
            Your silhouette and style identity are personal. We are committed to transparency and compliance with India's Digital Personal Data Protection Act 2023.
          </p>
        </section>

        <section id="collection" className="scroll-mt-32 pt-12">
          <h2 className="text-3xl font-headline text-gold mb-6 italic">2. Information We Collect</h2>
          <div className="space-y-8">
            <div>
              <h4 className="text-gold font-bold uppercase tracking-widest text-xs mb-3">2.1 Information you provide directly:</h4>
              <ul className="list-disc pl-6 space-y-2 text-ivory-3">
                <li><strong className="text-ivory">Account information:</strong> name, email, password, phone number, date of birth, gender, city.</li>
                <li><strong className="text-ivory">Body measurements:</strong> height, weight range, body size, chest/waist/hip measurements.</li>
                <li><strong className="text-ivory">Style preferences:</strong> occasions, budget, color preferences, style vibe, favorite brands.</li>
                <li><strong className="text-ivory">Photos:</strong> full-body photos uploaded for AI style analysis.</li>
              </ul>
            </div>
            <div>
              <h4 className="text-gold font-bold uppercase tracking-widest text-xs mb-3">2.2 Information collected automatically:</h4>
              <p className="text-ivory-3 mb-2">Usage data including pages visited, features used, time spent, outfits clicked, products saved, and searches performed.</p>
              <p className="text-ivory-3">Device information: device type, operating system, IP address, and browser type.</p>
            </div>
          </div>
        </section>

        <section id="usage" className="scroll-mt-32 pt-12">
          <h2 className="text-3xl font-headline text-gold mb-6 italic">3. How We Use Your Information</h2>
          <div className="bg-obsidian-2 p-8 rounded-xl border-l-4 border-gold text-ivory-2 space-y-4">
            <p>• To provide personalized outfit recommendations using high-order AI.</p>
            <p>• To analyze body shape and skin tone from uploaded photos.</p>
            <p>• To compare prices across e-commerce platforms (Amazon, Flipkart, Meesho).</p>
            <p>• To send price drop alerts for items in your wishlist.</p>
            <p>• To process subscription payments securely via Razorpay.</p>
          </div>
          <p className="mt-6 text-gold font-bold uppercase tracking-widest text-[10px]">We never sell your personal data to third parties.</p>
        </section>

        <section id="biometric" className="scroll-mt-32 pt-12">
          <h2 className="text-3xl font-headline text-gold mb-6 italic">4. Photo and Biometric Data Policy</h2>
          <p className="text-ivory-3 leading-relaxed mb-6">
            Photos uploaded are processed by our AI system temporarily to extract 33 anatomical landmarks. These photos are stored securely in <span className="text-ivory">Firebase Storage</span> with AES-256 encryption. They are linked strictly to your account and are never shared with advertisers or third parties.
          </p>
          <div className="p-6 rounded-xl bg-gold/5 border border-gold/10 italic text-gold/80 text-sm">
            Note: You can delete all your photos anytime from Settings. We do not use your photos to train public AI models without your explicit, separate consent.
          </div>
        </section>

        <section id="sharing" className="scroll-mt-32 pt-12">
          <h2 className="text-3xl font-headline text-gold mb-6 italic">5. Data Sharing and Third Parties</h2>
          <p className="text-ivory-3 mb-6">We partner with essential technology providers to deliver our service:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: 'Firebase (Google)', use: 'Auth & Image Storage' },
              { name: 'Supabase', use: 'Secure User Database' },
              { name: 'Groq AI', use: 'Anonymized Recommendation Logic' },
              { name: 'Razorpay', use: 'PCI-DSS Payment Processing' }
            ].map((p, i) => (
              <div key={i} className="p-4 bg-obsidian-3 rounded-lg border border-border flex justify-between items-center">
                <span className="text-gold font-bold text-xs uppercase">{p.name}</span>
                <span className="text-ivory-4 text-[10px] uppercase">{p.use}</span>
              </div>
            ))}
          </div>
        </section>

        <section id="contact" className="scroll-mt-32 pt-20">
          <div className="p-10 rounded-[24px] bg-obsidian-2 border border-gold/20 text-center space-y-6">
            <h2 className="text-3xl font-headline text-gold italic">Still seeking clarity?</h2>
            <p className="text-ivory-3 max-w-md mx-auto">Our Data Protection Officer is standing by to assist with any privacy inquiries.</p>
            <div className="pt-4">
              <Button asChild className="bg-gold text-obsidian px-12 h-14 font-headline text-xl tracking-widest">
                <a href="mailto:privacy@drapeai.in">Dispatch Inquiry</a>
              </Button>
            </div>
            <p className="text-[10px] text-ivory-4 uppercase tracking-widest">Typical response time: 72 hours</p>
          </div>
        </section>
      </div>
    </LegalLayout>
  );
}
