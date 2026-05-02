'use client';

import { LegalPageLayout } from '@/components/legal/legal-page-layout';

const sections = [
  { id: 'intro', title: '1. Introduction' },
  { id: 'collect', title: '2. Data We Collect' },
  { id: 'usage', title: '3. How We Use Your Data' },
  { id: 'security', title: '4. Data Storage and Security' },
  { id: 'sharing', title: '5. Data Sharing' },
  { id: 'retention', title: '6. Data Retention' },
  { id: 'rights', title: '7. Your Rights' },
  { id: 'children', title: '8. Children\'s Privacy' },
  { id: 'transfers', title: '9. International Transfers' },
  { id: 'contact', title: '10. Contact Us' },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout
      title="Privacy Policy"
      lastUpdated="January 1, 2025"
      readTime="8 min"
      sections={sections}
    >
      <section id="intro" className="scroll-mt-32">
        <h2 className="text-3xl font-headline text-gold mb-6">1. Introduction</h2>
        <p className="text-lg leading-relaxed text-foreground/70">
          DRAPE AI ({"we, our, us"}) operates the fashion AI platform at <a href="https://drapeai.in" style={{color:'#C9A84C'}}>drapeai.in</a>. This Privacy Policy explains how we collect, use, store, and protect your personal information in compliance with India's Digital Personal Data Protection Act 2023 (DPDP Act), and applicable international standards including GDPR principles.
        </p>
        <p className="text-foreground/70 mt-4">
          Effective Date: January 1, 2025.<br />
          Contact: <a href="mailto:privacy@drapeai.in" style={{color:'#C9A84C'}}>privacy@drapeai.in</a> | <a href="mailto:drapeai78000@gmail.com" style={{color:'#C9A84C'}}>drapeai78000@gmail.com</a>
        </p>
      </section>

      <section id="collect" className="scroll-mt-32 mt-12">
        <h2 className="text-3xl font-headline text-gold mb-6">2. Data We Collect</h2>
        <div className="space-y-6 text-foreground/70">
          <div>
            <h4 className="font-bold text-ivory mb-2">2.1 Personal Information You Provide:</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li>Identity data: full name, username, date of birth, gender identity.</li>
              <li>Contact data: email address, phone number, city.</li>
              <li>Authentication data: encrypted password hash.</li>
              <li>Profile photo: optional, stored securely.</li>
              <li>Body data: height, weight range, body size, measurements.</li>
              <li>Style data: occasions, budget, color preferences, style vibe.</li>
              <li>Uploaded photos: full-body photos for AI analysis.</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-ivory mb-2">2.2 Usage Data Collected Automatically:</h4>
            <p>We track interaction data such as pages visited, features used, time spent per page, and scroll depth. This also includes device data like OS version, browser type, and approximate location from IP address.</p>
          </div>
        </div>
      </section>

      <section id="usage" className="scroll-mt-32 mt-12">
        <h2 className="text-3xl font-headline text-gold mb-6">3. How We Use Your Data</h2>
        <p className="text-foreground/70">
          We use your data to generate AI outfit recommendations, perform body analysis, and compare prices across platforms. We also use anonymized data for platform analytics to understand usage patterns and improve our precision aesthetic engine.
        </p>
        <div className="p-6 bg-gold/5 border-l-4 border-gold mt-6 italic">
          We NEVER sell personal data. We NEVER share photos with any third party.
        </div>
      </section>

      <section id="security" className="scroll-mt-32 mt-12">
        <h2 className="text-3xl font-headline text-gold mb-6">4. Data Storage and Security</h2>
        <p className="text-foreground/70">
          Data is stored on SOC2 compliant servers in India and the EU. We use SSL/TLS 1.3 for all connections and AES-256 for database encryption. Quarterly penetration testing is conducted to maintain our high-security standards.
        </p>
      </section>

      <section id="sharing" className="scroll-mt-32 mt-12">
        <h2 className="text-3xl font-headline text-gold mb-6">5. Data Sharing</h2>
        <p className="text-foreground/70">
          We share data only with essential processors like Firebase (Auth), Supabase (DB), Groq AI (Anonymized requests), and Razorpay (Payments). All processors are bound by strict data processing agreements.
        </p>
      </section>

      <section id="rights" className="scroll-mt-32 mt-12">
        <h2 className="text-3xl font-headline text-gold mb-6">7. Your Rights</h2>
        <p className="text-foreground/70 mb-4">
          Under the DPDP Act 2023, you have the right to access, correction, erasure, and portability of your data. You may also nominate someone to manage your data rights.
        </p>
        <p className="text-foreground/70">
          To exercise your rights, visit Settings {'>'} Privacy {'>'} Manage My Data or email <a href="mailto:privacy@drapeai.in" style={{color:'#C9A84C'}}>privacy@drapeai.in</a>.
        </p>
      </section>

      <section id="contact" className="scroll-mt-32 mt-20">
        <div className="p-8 rounded-2xl bg-obsidian-2 border border-border text-center space-y-6">
          <h2 className="text-2xl font-headline text-gold">Still have questions?</h2>
          <p className="text-foreground/40 max-w-sm mx-auto">Our Data Protection Officer is standing by to assist with any privacy inquiries.</p>
          <a href="mailto:privacy@drapeai.in" className="inline-block px-10 h-12 bg-primary text-primary-foreground font-headline text-lg rounded-md hover:glow-gold transition-all flex items-center justify-center mx-auto">
            Dispatch Inquiry
          </a>
        </div>
      </section>
    </LegalPageLayout>
  );
}
