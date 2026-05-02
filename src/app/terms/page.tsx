'use client';

import { LegalLayout } from '@/components/legal/legal-layout';
import { Badge } from '@/components/ui/badge';

const sections = [
  { id: 'acceptance', title: '1. Acceptance of Terms' },
  { id: 'eligibility', title: '2. Eligibility' },
  { id: 'service', title: '3. Description of Service' },
  { id: 'accounts', title: '4. User Accounts' },
  { id: 'use-policy', title: '5. Acceptable Use' },
  { id: 'photos', title: '6. Photo Upload and AI Analysis' },
  { id: 'affiliate', title: '7. Affiliate Disclosure' },
  { id: 'ip', title: '8. Intellectual Property' },
  { id: 'subscription', title: '9. Subscription and Payments' },
  { id: 'disclaimers', title: '10. Disclaimers' },
  { id: 'liability', title: '11. Limitation of Liability' },
  { id: 'law', title: '12. Governing Law' },
  { id: 'dispute', title: '13. Dispute Resolution' },
];

export default function TermsAndConditions() {
  return (
    <LegalLayout
      title="Terms & Conditions"
      lastUpdated="January 20, 2025"
      sections={sections}
      relatedLink={{ href: '/privacy-policy', label: 'Privacy Policy' }}
    >
      <div className="prose prose-invert prose-gold max-w-none">
        <section id="acceptance" className="scroll-mt-32">
          <h2 className="text-3xl font-headline text-gold mb-6 italic">1. Acceptance of Terms</h2>
          <p className="text-lg leading-relaxed text-ivory-2">
            By accessing or using DRAPE AI, you agree to these Terms. These terms form a legally binding agreement between you and DRAPE AI regarding the use of our digital fashion atelier. If you disagree with any part of these terms, you must cease use of the service immediately.
          </p>
        </section>

        <section id="eligibility" className="scroll-mt-32 pt-12">
          <h2 className="text-3xl font-headline text-gold mb-6 italic">2. Eligibility</h2>
          <p className="text-ivory-3 leading-relaxed">
            You must be at least 13 years old to use DRAPE AI. Users aged 13-18 require parental or guardian consent. One account per person is permitted, and you must provide accurate, current, and complete information during registration.
          </p>
        </section>

        <section id="service" className="scroll-mt-32 pt-12">
          <h2 className="text-3xl font-headline text-gold mb-6 italic">3. Description of Service</h2>
          <p className="text-ivory-3 leading-relaxed mb-4">
            DRAPE AI provides AI-powered fashion recommendations based on body shape analysis, skin tone detection, and style preferences. We connect users with products on third-party platforms (Amazon, Flipkart, Meesho) through affiliate links.
          </p>
          <div className="flex flex-wrap gap-4">
            <Badge variant="outline" className="border-gold/20 text-gold uppercase px-4 py-1">We do not sell products directly</Badge>
            <Badge variant="outline" className="border-gold/20 text-gold uppercase px-4 py-1">We do not fulfill orders</Badge>
          </div>
        </section>

        <section id="photos" className="scroll-mt-32 pt-12">
          <h2 className="text-3xl font-headline text-gold mb-6 italic">6. Photo Upload and AI Analysis</h2>
          <div className="space-y-4 text-ivory-3">
            <p>By uploading photos you confirm:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>You own the photo or have explicit rights to use it.</li>
              <li>You are the individual depicted in the photo.</li>
              <li>You consent to AI processing for silhouette mapping.</li>
            </ul>
            <p className="italic text-rose/80">AI recommendations are suggestions only. Results may vary based on photo quality and lighting. We do not guarantee 100% measurement accuracy.</p>
          </div>
        </section>

        <section id="affiliate" className="scroll-mt-32 pt-12">
          <h2 className="text-3xl font-headline text-gold mb-6 italic">7. Affiliate Disclosure</h2>
          <p className="text-ivory-3 leading-relaxed">
            DRAPE AI participates in affiliate marketing programs. We may earn a small commission when you click our links and make purchases on partner platforms. This occurs at no additional cost to you. Our recommendations are driven by <strong className="text-ivory">style-fit logic</strong>, not commission rates.
          </p>
        </section>

        <section id="subscription" className="scroll-mt-32 pt-12">
          <h2 className="text-3xl font-headline text-gold mb-6 italic">9. Subscription and Payments</h2>
          <p className="text-ivory-3 mb-6">Pro subscriptions are billed monthly or annually via Razorpay. All prices shown include applicable Indian taxes.</p>
          <ul className="space-y-4 text-ivory-3">
             <li className="flex gap-4">
               <span className="text-gold font-bold">A.</span>
               <p>Subscriptions auto-renew unless cancelled at least 24 hours before the period ends.</p>
             </li>
             <li className="flex gap-4">
               <span className="text-gold font-bold">B.</span>
               <p>No refunds are provided for partial billing periods or unused features.</p>
             </li>
          </ul>
        </section>

        <section id="dispute" className="scroll-mt-32 pt-12">
          <h2 className="text-3xl font-headline text-gold mb-6 italic">13. Dispute Resolution</h2>
          <p className="text-ivory-3 leading-relaxed">
            In case of any dispute, please contact support at <a href="mailto:drapeai78000@gmail.com" style={{color:'#C9A84C'}}>drapeai78000@gmail.com</a>. If unresolved, disputes are subject to arbitration in Bangalore, Karnataka.
          </p>
        </section>

        <section id="law" className="scroll-mt-32 pt-12">
          <h2 className="text-3xl font-headline text-gold mb-6 italic">12. Governing Law</h2>
          <p className="text-ivory-3 leading-relaxed">
            These terms are governed by the laws of the Republic of India. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts in <strong className="text-ivory">Bangalore, Karnataka</strong>.
          </p>
        </section>
      </div>
    </LegalLayout>
  );
}