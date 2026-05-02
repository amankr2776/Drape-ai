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
    <div className="page-content py-12 max-w-4xl space-y-12">
      <div className="text-center space-y-6">
        <h1 className="text-5xl md:text-6xl font-headline">How can we assist you?</h1>
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40 w-5 h-5" />
          <Input 
            placeholder="Search documentation, guides, and FAQ..." 
            className="h-14 pl-12 bg-white/5 border-white/10 text-lg rounded-2xl"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-card p-6 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center">
            <MessageSquare size={24} />
          </div>
          <h3 className="font-bold">Live Support</h3>
          <p className="text-xs text-foreground/40">Typical reply time: 2 hours</p>
          <Button variant="outline" className="w-full">Open Chat</Button>
        </Card>
        <Card className="glass-card p-6 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center">
            <FileText size={24} />
          </div>
          <h3 className="font-bold">Guides</h3>
          <p className="text-xs text-foreground/40">Step-by-step video tutorials</p>
          <Button variant="outline" className="w-full">View Guides</Button>
        </Card>
        <Card className="glass-card p-6 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center">
            <Clock size={24} />
          </div>
          <h3 className="font-bold">Ticket Status</h3>
          <p className="text-xs text-foreground/40">Track your open inquiries</p>
          <Button variant="outline" className="w-full">My Tickets</Button>
        </Card>
      </div>

      <section className="space-y-8 pt-12 text-center">
        <h2 className="text-3xl font-headline">Need direct assistance?</h2>
        <p className="text-foreground/60">
          Email us at <a href="mailto:drapeai78000@gmail.com" style={{color:'#C9A84C'}}>drapeai78000@gmail.com</a> and we{"'"}ll get back to you within 24 hours.
        </p>
      </section>

      <section className="space-y-8 pt-12">
        <h2 className="text-3xl font-headline">Frequently Asked</h2>
        <div className="grid grid-cols-1 gap-4">
          {FAQS.map((faq, i) => (
            <Card key={i} className="glass-panel group cursor-pointer overflow-hidden transition-standard hover:border-primary/40">
              <CardContent className="p-0">
                <div className="p-8 flex gap-6">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-primary/60">
                    <faq.icon size={20} />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Badge variant="secondary" className="text-[10px] tracking-widest font-bold uppercase">{faq.category}</Badge>
                    <h4 className="text-lg font-bold group-hover:text-primary transition-colors">{faq.q}</h4>
                    <p className="text-foreground/60 leading-relaxed">{faq.a}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-foreground/20 self-center group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <div className="glass-panel p-10 rounded-3xl text-center space-y-6">
        <HelpCircle className="w-12 h-12 text-primary/40 mx-auto" />
        <h3 className="text-2xl font-headline">Still have questions?</h3>
        <p className="text-foreground/60 max-w-sm mx-auto">Our human curators are available for complex styling or technical inquiries.</p>
        <Button className="px-12 h-12 bg-primary text-obsidian font-bold tracking-widest">SUBMIT A TICKET</Button>
      </div>
    </div>
  );
}
