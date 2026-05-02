'use client';

import { LegalPageLayout } from '@/components/legal/legal-page-layout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const sections = [
  { id: 'what', title: '1. What Are Cookies' },
  { id: 'categories', title: '2. Cookie Categories' },
  { id: 'third-party', title: '3. Third-Party Cookies' },
  { id: 'consent', title: '4. Consent Mechanism' },
  { id: 'withdraw', title: '5. Withdrawing Consent' },
  { id: 'legal', title: '6. Legal Basis' },
];

export default function CookiePolicyPage() {
  return (
    <LegalPageLayout
      title="Cookie Policy"
      lastUpdated="January 1, 2025"
      readTime="4 min"
      sections={sections}
    >
      <section id="what" className="scroll-mt-32">
        <h2 className="text-3xl font-headline text-gold mb-6">1. What Are Cookies</h2>
        <p className="text-foreground/70 leading-relaxed">
          Cookies are small text files that are stored on your device when you visit our website. They help us remember your preferences, keep you logged in, and understand how you interact with our styling tools. We also use localStorage and sessionStorage for similar purposes.
        </p>
      </section>

      <section id="categories" className="scroll-mt-32 mt-12">
        <h2 className="text-3xl font-headline text-gold mb-6">2. Cookie Categories</h2>
        
        <div className="space-y-8">
          <div>
            <h4 className="font-bold text-ivory mb-4 uppercase tracking-widest text-xs">Strictly Necessary</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cookie</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Duration</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-mono text-xs">drapeai_session</TableCell>
                  <TableCell>Maintains login state</TableCell>
                  <TableCell>Session</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono text-xs">drapeai_consent</TableCell>
                  <TableCell>Stores your cookie choices</TableCell>
                  <TableCell>1 Year</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div>
            <h4 className="font-bold text-ivory mb-4 uppercase tracking-widest text-xs">Functional & Analytics</h4>
            <p className="text-sm text-foreground/60 mb-4">These require your explicit consent via our banner.</p>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-mono text-xs">drapeai_history</TableCell>
                  <TableCell>Recent viewed outfits</TableCell>
                  <TableCell>90 Days</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono text-xs">mp_mixpanel</TableCell>
                  <TableCell>Anonymized usage tracking</TableCell>
                  <TableCell>1 Year</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </section>

      <section id="consent" className="scroll-mt-32 mt-12">
        <h2 className="text-3xl font-headline text-gold mb-6">4. Consent Mechanism</h2>
        <p className="text-foreground/70">
          On your first visit, a consent banner appears. We do not set any non-essential cookies until you click {'"'}Accept All{'"'} or configure them in {'"'}Manage Preferences{'"'}. Strictly necessary cookies are set by default as they are essential for service performance.
        </p>
      </section>

      <section id="withdraw" className="scroll-mt-32 mt-12">
        <h2 className="text-3xl font-headline text-gold mb-6">5. Withdrawing Consent</h2>
        <p className="text-foreground/70">
          You can withdraw consent anytime in your Settings {'>'} Privacy panel. This will immediately delete non-essential cookies from your browser.
        </p>
      </section>
    </LegalPageLayout>
  );
}
