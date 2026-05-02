'use client';

import { motion } from 'framer-motion';
import { 
  Zap, 
  TrendingUp, 
  Tag, 
  Heart, 
  Sparkles, 
  ArrowRight,
  Crown,
  Trophy,
  History,
  ShoppingBag
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';

const PRICE_HISTORY = [
  { day: 'Mon', price: 4200 },
  { day: 'Tue', price: 4100 },
  { day: 'Wed', price: 3800 },
  { day: 'Thu', price: 3800 },
  { day: 'Fri', price: 3500 },
  { day: 'Sat', price: 3900 },
  { day: 'Sun', price: 3400 },
];

const METRICS = [
  { label: 'Outfits Saved', val: '42', trend: '+12%', icon: Heart },
  { label: 'Analyses Used', val: '1/3', trend: 'Free Plan', icon: Zap },
  { label: 'Price Alerts', val: '8', trend: 'Active', icon: Tag },
  { label: 'Money Saved', val: '₹2,400', trend: 'Lifetime', icon: TrendingUp },
];

const BADGES = [
  { name: 'First Analysis', icon: '🎯', unlocked: true },
  { name: 'Style Starter', icon: '👗', unlocked: true },
  { name: 'Price Hunter', icon: '💰', unlocked: true },
  { name: 'Trendsetter', icon: '🔥', unlocked: false },
  { name: 'Pro Member', icon: '👑', unlocked: false },
];

export default function DashboardPage() {
  return (
    <div className="page-wrapper bg-background">
      <div className="page-content py-12 space-y-12">
        {/* Greeting Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-2">
            <h1 className="text-h1 lg:text-[56px] text-ivory">Welcome back, Ananya 👋</h1>
            <p className="text-lg text-foreground/40">The atelier is ready for your next transformation.</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-[0.3em] text-gold font-bold">Style Explorer Level 3</p>
            <div className="flex items-center gap-4 mt-2">
              <Progress value={68} className="w-48 h-2" />
              <span className="text-xs font-bold text-ivory">340/500 XP</span>
            </div>
          </div>
        </header>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {METRICS.map((m, i) => (
            <Card key={i} className="bg-obsidian-2 border-border group hover:border-gold/30 transition-all">
              <CardContent className="p-8 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="p-3 rounded-xl bg-gold/10 text-gold group-hover:scale-110 transition-transform">
                    <m.icon size={24} />
                  </div>
                  <span className="text-[10px] font-bold text-success uppercase tracking-widest">{m.trend}</span>
                </div>
                <div>
                  <h3 className="text-4xl font-headline text-gold">{m.val}</h3>
                  <p className="text-xs text-foreground/40 uppercase tracking-widest font-bold mt-1">{m.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Feed */}
          <div className="lg:col-span-8 space-y-12">
            {/* Gamification Strip */}
            <section className="space-y-6">
              <h2 className="text-2xl font-headline text-gold italic border-l-4 border-gold pl-6">Atelier Achievements</h2>
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {BADGES.map((b, i) => (
                  <div 
                    key={i} 
                    className={cn(
                      "min-w-[140px] p-6 rounded-2xl bg-obsidian-2 border border-border text-center space-y-4 transition-all",
                      !b.unlocked && "opacity-40 grayscale blur-[1px] hover:blur-0 hover:grayscale-0 hover:opacity-100"
                    )}
                  >
                    <div className="text-4xl">{b.icon}</div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-ivory">{b.name}</p>
                    {!b.unlocked && <Lock size={12} className="mx-auto text-foreground/20" />}
                  </div>
                ))}
              </div>
            </section>

            {/* Price Tracker Chart */}
            <Card className="bg-obsidian-2 border-border overflow-hidden">
              <CardHeader className="bg-obsidian-3/50 p-6 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <TrendingUp size={20} className="text-gold" />
                    Market Radar (Weekly)
                  </CardTitle>
                  <CardDescription className="text-xs">Aggregate price tracking across your saved items.</CardDescription>
                </div>
                <Badge variant="outline" className="border-success/20 text-success">Saved ₹2,400</Badge>
              </CardHeader>
              <CardContent className="p-8 h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={PRICE_HISTORY}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(201,168,76,0.05)" vertical={false} />
                    <XAxis 
                      dataKey="day" 
                      stroke="rgba(245,240,232,0.2)" 
                      fontSize={10} 
                      tickLine={false} 
                      axisLine={false} 
                    />
                    <YAxis 
                      stroke="rgba(245,240,232,0.2)" 
                      fontSize={10} 
                      tickLine={false} 
                      axisLine={false}
                      tickFormatter={(v) => `₹${v}`}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0A0A0F', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '8px' }}
                      itemStyle={{ color: '#C9A84C' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="price" 
                      stroke="#C9A84C" 
                      strokeWidth={3} 
                      dot={{ r: 4, fill: '#C9A84C', strokeWidth: 0 }}
                      activeDot={{ r: 6, shadow: '0 0 10px rgba(201,168,76,0.5)' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Recommendations Teaser */}
            <section className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-headline text-gold italic border-l-4 border-gold pl-6">Curated Intelligence</h2>
                <Button asChild variant="link" className="text-gold uppercase tracking-[0.2em] text-[10px]">
                  <Link href="/results">View All Styles →</Link>
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[1, 2].map(i => (
                  <Card key={i} className="bg-obsidian-2 border-border group overflow-hidden cursor-pointer">
                    <div className="aspect-product relative">
                      <img src={`https://picsum.photos/seed/dash-${i}/400/600`} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="Rec" />
                      <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent opacity-60" />
                      <div className="absolute bottom-6 left-6 right-6 space-y-2">
                        <Badge className="bg-gold/90 text-obsidian font-bold">92% Match</Badge>
                        <h4 className="text-xl font-headline text-ivory">Midnight Bloom Silk</h4>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-8">
            {/* Daily Challenge */}
            <Card className="bg-gold/5 border border-gold/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
                <Trophy size={80} className="text-gold" />
              </div>
              <CardContent className="p-8 space-y-6">
                <h3 className="text-xl font-headline text-gold">Daily Curation Goal</h3>
                <p className="text-sm text-ivory-2 leading-relaxed">Save 3 outfits matching the <span className="text-gold font-bold">Monsoon Silk</span> aesthetic.</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] uppercase font-bold text-ivory-4">
                    <span>Progress</span>
                    <span>1/3 Done</span>
                  </div>
                  <Progress value={33} className="h-1.5" />
                </div>
                <Button className="w-full bg-gold text-obsidian font-headline tracking-widest text-lg">Accept Challenge</Button>
              </CardContent>
            </Card>

            {/* Referral Program */}
            <Card className="bg-obsidian-2 border-border overflow-hidden">
               <CardHeader className="bg-obsidian-3/50 p-6">
                 <CardTitle className="text-lg flex items-center gap-2"><Crown size={20} className="text-gold" /> VIP Referrals</CardTitle>
               </CardHeader>
               <CardContent className="p-8 space-y-6">
                 <p className="text-xs text-foreground/60">Invite 3 friends to get <span className="text-gold font-bold">1 Month Pro</span> for free.</p>
                 <div className="p-4 bg-obsidian-3 border border-dashed border-border rounded-lg text-center font-mono text-sm text-gold">
                   DRAPE-ANANYA7
                 </div>
                 <Button variant="outline" className="w-full border-gold/20 text-gold uppercase tracking-widest text-[10px] font-bold">Copy Link</Button>
               </CardContent>
            </Card>

            {/* History Strip */}
            <Card className="bg-obsidian-2 border-border">
               <CardHeader className="p-6 pb-0">
                  <CardTitle className="text-sm uppercase tracking-widest font-bold text-foreground/40 flex items-center gap-2">
                    <History size={14} /> Recently Explored
                  </CardTitle>
               </CardHeader>
               <CardContent className="p-6 space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex gap-4 items-center group cursor-pointer">
                      <div className="w-12 h-16 rounded bg-obsidian-3 overflow-hidden border border-border group-hover:border-gold/30">
                        <img src={`https://picsum.photos/seed/hist-${i}/100/150`} className="w-full h-full object-cover grayscale group-hover:grayscale-0" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-ivory group-hover:text-gold transition-colors">Festive Sangeet Look</p>
                        <p className="text-[10px] text-foreground/40 uppercase">2 hours ago</p>
                      </div>
                    </div>
                  ))}
               </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}