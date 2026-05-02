'use client';

import { useState } from 'react';
import { 
  Search, 
  HelpCircle, 
  ChevronRight, 
  MessageSquare, 
  FileText, 
  Clock,
  ShieldCheck,
  Zap,
  Tag
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const FAQS = [
  {
    category: 'Analysis',
    q: 'How accurate is the AI silhouette mapping?',
    a: 'Our models achieve 92% precision when following our "plain background" guidelines. We analyze 33 key landmark points.',
    icon: Zap
  },
  {
    category: 'Billing',
    q: 'Can I cancel my Pro subscription anytime?',
    a: 'Yes. You can cancel with one click in your settings. You will retain Pro access until the end of your billing cycle.',
    icon: Tag
  },
  {
    category: 'Privacy',
    q: 'Who can see my uploaded silhouette photo?',
    a: 'Your photos are encrypted and processed ephemerally. They are linked only to your account and never shared with third parties.',
    icon: ShieldCheck
  }
];

export default function HelpPage() {
  const [search, setSearch] = useState('');

  return (
    <div className="page-wrapper">
      <div className="page-content py-48 max-w-4xl space-y-32">
        <div className="text-center space-y-12">
          <h1 className="text-5xl md:text-display font-headline text-gold">How can we assist you?</h1>
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-16 top-1/2 -translate-y-1/2 text-foreground/40 w-5 h-5" />
            <Input 
              placeholder="Search documentation, guides, and FAQ..." 
              className="h-14 pl-48 bg-white/5 border-white/10 text-lg rounded-2xl"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card variant="glass" className="p-24 text-center space-y-6">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center">
              <MessageSquare size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg">Live Support</h3>
              <p className="text-xs text-foreground/40 mt-1">Typical reply time: 2 hours</p>
            </div>
            <Button variant="outline" className="w-full">Open Chat</Button>
          </Card>
          <Card variant="glass" className="p-24 text-center space-y-6">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center">
              <FileText size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg">Guides</h3>
              <p className="text-xs text-foreground/40 mt-1">Step-by-step video tutorials</p>
            </div>
            <Button variant="outline" className="w-full">View Guides</Button>
          </Card>
          <Card variant="glass" className="p-24 text-center space-y-6">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center">
              <Clock size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg">Ticket Status</h3>
              <p className="text-xs text-foreground/40 mt-1">Track your open inquiries</p>
            </div>
            <Button variant="outline" className="w-full">My Tickets</Button>
          </Card>
        </div>

        <section className="space-y-12 pt-32 text-center">
          <h2 className="text-3xl md:text-5xl font-headline text-gold">Need direct assistance?</h2>
          <p className="text-foreground/60 text-lg">
            Email us at <a href="mailto:drapeai78000@gmail.com" style={{color:'#C9A84C'}}>drapeai78000@gmail.com</a> and we{"'"}ll get back to you within 24 hours.
          </p>
        </section>

        <section className="space-y-12 pt-32">
          <h2 className="text-3xl font-headline text-gold">Frequently Asked</h2>
          <div className="grid grid-cols-1 gap-8">
            {FAQS.map((faq, i) => (
              <Card key={i} variant="interactive" className="group overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-24 flex gap-8">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-primary/60 shrink-0">
                      <faq.icon size={20} />
                    </div>
                    <div className="flex-1 space-y-4">
                      <Badge variant="secondary" className="text-[10px] tracking-widest font-bold uppercase">{faq.category}</Badge>
                      <h4 className="text-xl font-bold group-hover:text-primary transition-colors">{faq.q}</h4>
                      <p className="text-foreground/60 leading-relaxed">{faq.a}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-foreground/20 self-center group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <div className="glass-panel p-32 rounded-3xl text-center space-y-8 border-gold/20">
          <HelpCircle className="w-12 h-12 text-primary/40 mx-auto" />
          <div className="space-y-2">
            <h3 className="text-3xl font-headline text-gold">Still have questions?</h3>
            <p className="text-foreground/60 max-w-sm mx-auto">Our human curators are available for complex styling or technical inquiries.</p>
          </div>
          <Button className="px-16 h-14 bg-primary text-obsidian font-bold tracking-widest text-lg">SUBMIT A TICKET</Button>
        </div>
      </div>
    </div>
  );
}