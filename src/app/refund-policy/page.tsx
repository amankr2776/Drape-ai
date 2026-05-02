'use client';

import { LegalPageLayout } from '@/components/legal/legal-page-layout';

const sections = [
  { id: 'pro', title: 'Pro Subscription Refunds' },
  { id: 'request', title: 'How to Request' },
  { id: 'purchases', title: 'Product Purchases' },
];

export default function RefundPolicyPage() {
  return (
    <LegalPageLayout
      title="Refund Policy"
      lastUpdated="January 1, 2025"
      readTime="3 min"
      sections={sections}
    >
      <section id="pro" className="scroll-mt-32">
        <h2 className="text-3xl font-headline text-gold mb-6">Pro Subscription Refunds</h2>
        <div className="space-y-6 text-foreground/70">
          <p>We offer a 7-day free trial for all new Pro members. During this period, you will not be charged and can cancel anytime.</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong className="text-ivory">Monthly Plan:</strong> No refunds are provided for partial months once the billing cycle has processed.</li>
            <li><strong className="text-ivory">Annual Plan:</strong> A pro-rated refund may be requested within 7 days of purchase, provided you have used fewer than 10 AI analyses during that period.</li>
          </ul>
        </div>
      </section>

      <section id="request" className="scroll-mt-32 mt-12">
        <h2 className="text-3xl font-headline text-gold mb-6">How to Request</h2>
        <p className="text-foreground/70 mb-4">
          To initiate a refund request, please email our support team at <span className="text-gold">drapeai78000@gmail.com</span> with the subject line "Refund Request".
        </p>
        <p className="text-foreground/70">
          Include your registered email and a brief description of the reason for your request. Processing typically takes 5-7 business days via Razorpay.
        </p>
      </section>

      <section id="purchases" className="scroll-mt-32 mt-12">
        <h2 className="text-3xl font-headline text-gold mb-6">Product Purchases</h2>
        <p className="text-foreground/70">
          DRAPE AI does not sell or fulfill physical products. Any disputes regarding physical goods purchased on Amazon, Flipkart, or Meesho must be handled directly with the respective platform's customer service department.
        </p>
      </section>
    </LegalPageLayout>
  );
}