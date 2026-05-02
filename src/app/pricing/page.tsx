'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, 
  X, 
  Zap, 
  ShieldCheck, 
  Clock, 
  HelpCircle,
  Star,
  ChevronDown,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useSubscription } from '@/hooks/use-subscription';
import { PaymentModal } from '@/components/subscription/payment-modal';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const PLANS = [
  {
    name: 'Free',
    badge: 'Style Enthusiast',
    price: 0,
    description: 'Perfect for exploring your silhouette and discovering the DRAPE AI magic.',
    features: [
      { text: '3 outfit analyses per month', included: true },
      { text: 'Basic body shape detection', included: true },
      { text: 'Amazon & Flipkart results', included: true },
      { text: 'Save up to 10 outfits', included: true },
      { text: 'Basic price comparison', included: true },
      { text: 'Skin tone matching', included: false },
      { text: 'Meesho integration', included: false },
      { text: 'Price drop alerts', included: false },
      { text: 'Wardrobe builder', included: false },
      { text: 'Priority support', included: false },
    ],
    cta: 'Current Plan',
    popular: false,
  },
  {
    name: 'Pro',
    badge: 'Elite Stylist',
    price: { monthly: 99, yearly: 699 },
    description: 'The ultimate fashion arsenal. Unlimited intelligence for your wardrobe.',
    features: [
      { text: 'Unlimited outfit analyses', included: true },
      { text: 'Advanced AI body analysis', included: true },
      { text: 'All platforms including Meesho', included: true },
      { text: 'Unlimited wardrobe saves', included: true },
      { text: 'Real-time price drop alerts', included: true },
      { text: 'Skin tone color matching', included: true },
      { text: 'Outfit combination builder', included: true },
      { text: 'Priority email support', included: true },
      { text: 'Early access features', included: true },
      { text: 'Ad-free experience', included: true },
    ],
    cta: 'Start 7-Day Free Trial',
    popular: true,
  },
  {
    name: 'Teams',
    badge: 'Corporate Chic',
    price: 'Contact Us',
    description: 'Shared styling intelligence for agencies, boutiques, and large groups.',
    features: [
      { text: 'Everything in Pro', included: true },
      { text: 'Shared wardrobe history', included: true },
      { text: 'Team style profiles', included: true },
      { text: 'Bulk analysis API', included: true },
      { text: 'Dedicated account manager', included: true },
    ],
    cta: 'Join Waitlist',
    popular: false,
  }
];

const FAQS = [
  { q: "Can I cancel my subscription anytime?", a: "Absolutely. You can cancel your subscription with a single click in your settings. Your Pro benefits will remain active until the end of your current billing period." },
  { q: "What happens to my data if I downgrade?", a: "Your style profile and measurements are safe. However, you will only be able to see your last 10 saved outfits, and unlimited analysis will be restricted." },
  { q: "Is there a student discount available?", a: "Yes! We offer a 50% discount for students with a valid .edu or university email. Contact our support team to verify your status." },
  { q: "How does the 7-day free trial work?", a: "You get full access to all Pro features for 7 days. We do not require a credit card for the trial. If you love it, you can subscribe afterwards." },
  { q: "What payment methods are accepted?", a: "We process all payments securely via Razorpay, supporting UPI, Credit/Debit cards, Net Banking, and major Indian wallets." }
];

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const { plan, isPro } = useSubscription();

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 overflow-hidden">
      {/* --- HERO SECTION --- */}
      <section className="container mx-auto px-4 text-center mb-20 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 blur-[120px] rounded-full -z-10" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <Badge variant="outline" className="py-1 px-4 border-primary/20 text-primary tracking-[0.2em] uppercase text-[10px]">
            Pricing Atelier
          </Badge>
          <h1 className="text-6xl md:text-8xl font-headline text-foreground leading-tight">
            Dress Better. <br />
            <span className="text-primary italic">Pay Less Than A Coffee.</span>
          </h1>
          <p className="text-foreground/40 text-lg max-w-2xl mx-auto font-body">
            Sophisticated styling doesn{"'"}t have to be expensive. Upgrade when you{"'"}re ready. Cancel anytime. No questions asked.
          </p>

          <div className="flex items-center justify-center gap-6 pt-8">
            <span className={cn("text-sm uppercase tracking-widest transition-colors", billingCycle === 'monthly' ? "text-primary" : "text-foreground/40")}>Monthly</span>
            <Switch 
              checked={billingCycle === 'yearly'}
              onCheckedChange={(val) => setBillingCycle(val ? 'yearly' : 'monthly')}
              className="data-[state=checked]:bg-primary"
            />
            <div className="flex items-center gap-2">
              <span className={cn("text-sm uppercase tracking-widest transition-colors", billingCycle === 'yearly' ? "text-primary" : "text-foreground/40")}>Yearly</span>
              <Badge className="bg-primary/20 text-primary border-primary/20 text-[10px] py-0 px-2">SAVE 40%</Badge>
            </div>
          </div>
        </motion.div>
      </section>

      {/* --- PRICING CARDS --- */}
      <section className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
        {PLANS.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className={cn(
              "h-full relative overflow-hidden flex flex-col transition-all duration-500",
              p.popular ? "border-primary border-2 scale-105 bg-primary/[0.02] shadow-[0_0_40px_rgba(201,168,76,0.1)]" : "bg-card/40 border-primary/10",
              "group"
            )}>
              {p.popular && (
                <div className="absolute top-0 right-0">
                  <div className="bg-primary text-primary-foreground text-[8px] font-bold px-8 py-1 rotate-45 translate-x-4 translate-y-2 uppercase tracking-widest">
                    Best Value
                  </div>
                </div>
              )}

              <CardHeader className="p-8">
                <Badge variant="outline" className="w-fit mb-4 text-[10px] tracking-widest border-primary/20 text-primary uppercase">{p.badge}</Badge>
                <CardTitle className="text-4xl font-headline mb-2">{p.name}</CardTitle>
                <div className="flex items-baseline gap-1 mt-4">
                  <span className="text-5xl font-bold text-primary">
                    {typeof p.price === 'number' ? `₹${p.price}` : (typeof p.price === 'object' ? `₹${p.price[billingCycle]}` : p.price)}
                  </span>
                  {typeof p.price === 'object' && (
                    <span className="text-foreground/40 text-sm uppercase tracking-widest">
                      / {billingCycle === 'monthly' ? 'mo' : 'yr'}
                    </span>
                  )}
                </div>
                {p.name === 'Pro' && billingCycle === 'yearly' && (
                  <p className="text-[10px] text-primary font-bold mt-2 animate-pulse">YOU SAVE ₹489 / YEAR</p>
                )}
                <CardDescription className="mt-4 text-foreground/60 leading-relaxed">{p.description}</CardDescription>
              </CardHeader>

              <CardContent className="p-8 pt-0 flex-grow">
                <ul className="space-y-4">
                  {p.features.map((f, idx) => (
                    <li key={idx} className={cn("flex items-start gap-3 text-sm", f.included ? "text-foreground" : "text-foreground/20")}>
                      {f.included ? (
                        <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      ) : (
                        <X className="w-4 h-4 text-foreground/20 shrink-0 mt-0.5" />
                      )}
                      <span>{f.text}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="p-8 border-t border-primary/5">
                <Button 
                  onClick={() => p.name === 'Pro' ? setIsPaymentModalOpen(true) : null}
                  disabled={p.name === 'Free' && plan === 'FREE'}
                  className={cn(
                    "w-full h-14 font-headline text-lg tracking-widest transition-all",
                    p.popular ? "bg-primary text-primary-foreground hover:glow-gold" : "bg-card border-primary/20 border hover:bg-primary/10"
                  )}
                >
                  {p.name === 'Free' && plan === 'FREE' ? 'Active Plan' : p.cta}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </section>

      {/* --- COMPARISON TABLE --- */}
      <section className="container mx-auto px-4 mb-40">
        <h2 className="text-4xl font-headline text-center mb-16">Feature Comparison</h2>
        <Card className="max-w-4xl mx-auto bg-card/20 border-primary/10 overflow-hidden">
          <Table>
            <TableHeader className="bg-primary/5">
              <TableRow>
                <TableHead className="w-[300px]">Atelier Feature</TableHead>
                <TableHead className="text-center">Free</TableHead>
                <TableHead className="text-center text-primary font-bold">Elite Pro</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { name: 'Monthly Analysis', free: '3 Per Month', pro: 'Unlimited' },
                { name: 'Body Detection', free: 'Standard (Pose)', pro: 'Advanced (Landmarks)' },
                { name: 'Skin Tone Mapping', free: 'Basic', pro: 'Monk Scale (HD)' },
                { name: 'Marketplaces', free: 'AMZ / FLP', pro: 'All + Meesho' },
                { name: 'Price Alerts', free: 'None', pro: 'Unlimited Push' },
                { name: 'Wardrobe Builder', free: 'Locked', pro: 'Included' },
                { name: 'Ad Experience', free: 'Standard', pro: 'Ad-Free' },
                { name: 'Support', free: 'Community', pro: 'Priority Email' },
              ].map((row, i) => (
                <TableRow key={row.name} className="border-primary/5">
                  <TableCell className="font-medium text-foreground/60">{row.name}</TableCell>
                  <TableCell className="text-center text-sm">{row.free}</TableCell>
                  <TableCell className="text-center font-bold text-primary">{row.pro}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </section>

      {/* --- FAQS --- */}
      <section className="container mx-auto px-4 max-w-3xl mb-40">
        <div className="text-center mb-12">
          <HelpCircle className="mx-auto w-10 h-10 text-primary mb-4" />
          <h2 className="text-4xl font-headline">Frequently Asked</h2>
        </div>
        <Accordion type="single" collapsible className="w-full space-y-4">
          {FAQS.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="border border-primary/10 rounded-xl bg-card/20 px-6">
              <AccordionTrigger className="text-lg font-headline hover:no-underline hover:text-primary py-6">{faq.q}</AccordionTrigger>
              <AccordionContent className="text-foreground/60 leading-relaxed pb-6">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* --- SOCIAL PROOF --- */}
      <section className="container mx-auto px-4 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: "Priya V.", city: "Mumbai", text: "I saved ₹3,200 on my last shopping trip using Pro price alerts. It paid for itself in one day." },
            { name: "Arjun K.", city: "Bangalore", text: "The wardrobe builder is a game changer for my work outfits. Worth every rupee." },
            { name: "Sneha M.", city: "Delhi", text: "Skin tone matching is actual magic. I finally know which shades of red work for me." }
          ].map((t, i) => (
            <Card key={i} className="bg-primary/5 border-primary/10 p-8 text-center space-y-4">
              <div className="flex justify-center gap-1">
                {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} className="fill-primary text-primary" />)}
              </div>
              <p className="italic text-foreground/80 font-body">{'"'}{t.text}{'"'}</p>
              <div>
                <p className="font-bold text-primary">{t.name}</p>
                <p className="text-[10px] uppercase tracking-widest text-foreground/40">{t.city}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <PaymentModal 
        isOpen={isPaymentModalOpen} 
        onClose={() => setIsPaymentModalOpen(false)} 
        planType={billingCycle}
      />
    </div>
  );
}
