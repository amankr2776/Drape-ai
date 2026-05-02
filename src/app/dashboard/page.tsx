'use client';

import { motion } from 'framer-motion';
import { 
  Zap, 
  TrendingUp, 
  Tag, 
  Heart, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Shirt
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
  ResponsiveContainer 
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

export default function DashboardPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="page-content py-12 space-y-12">
      {/* Greeting Header */}
      <motion.header 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-8"
      >
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-headline text-foreground">Welcome back, Ananya 👋</h1>
          <p className="text-foreground/40 text-lg">Your curated intelligence is refreshed and ready.</p>
        </div>
        <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-6 py-4 rounded-2xl">
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-widest text-primary font-bold">Style Explorer Level 3</p>
            <p className="text-xs font-bold text-foreground">340 / 500 XP</p>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary flex items-center justify-center text-[10px] font-bold">
            68%
          </div>
        </div>
      </motion.header>

      {/* KPI Row */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {[
          { label: 'Outfits Saved', val: '42', trend: '+12%', icon: Heart },
          { label: 'Analyses Used', val: '1/3', trend: 'Free Plan', icon: Zap },
          { label: 'Price Alerts', val: '8', trend: 'Active', icon: Tag },
          { label: 'Money Saved', val: '₹2,400', trend: 'Lifetime', icon: TrendingUp },
        ].map((m, i) => (
          <motion.div key={i} variants={itemVariants}>
            <Card className="glass-card h-full p-8 space-y-4">
              <div className="flex justify-between items-start">
                <div className="p-3 rounded-xl bg-primary/10 text-primary">
                  <m.icon size={20} />
                </div>
                <Badge variant="outline" className="text-success border-success/20 text-[10px]">{m.trend}</Badge>
              </div>
              <div>
                <h3 className="text-4xl font-headline text-primary">{m.val}</h3>
                <p className="text-[10px] uppercase tracking-widest text-foreground/40 font-bold mt-1">{m.label}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main Feed */}
        <div className="lg:col-span-8 space-y-12">
          {/* Price Tracking Visual */}
          <Card className="glass-panel overflow-hidden">
            <CardHeader className="p-8 border-b border-white/5">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <TrendingUp size={24} className="text-primary" />
                    Market Radar
                  </CardTitle>
                  <CardDescription>Price fluctuations across your wishlist items this week.</CardDescription>
                </div>
                <Badge className="bg-success/10 text-success border-none font-bold">₹2,400 SAVED</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-8 h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={PRICE_HISTORY}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis 
                    dataKey="day" 
                    stroke="rgba(255,255,255,0.2)" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis 
                    stroke="rgba(255,255,255,0.2)" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                    tickFormatter={(v) => `₹${v}`}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(10,10,15,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
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

          {/* Recent Activity */}
          <section className="space-y-6">
            <h2 className="text-2xl font-headline text-foreground flex items-center gap-2">
              <Clock size={24} className="text-primary/60" />
              Recent Activity
            </h2>
            <div className="space-y-4">
              {[
                { type: 'analysis', msg: 'New style analysis completed for "Office Wear"', time: '2 hours ago', icon: Sparkles },
                { type: 'price', msg: 'Price drop alert: Heritage Zari Set is 20% off', time: '5 hours ago', icon: Tag },
                { type: 'save', msg: 'Saved "Midnight Bloom Silk" to your collection', time: 'Yesterday', icon: Heart },
              ].map((act, i) => (
                <div key={i} className="glass-card flex items-center gap-6 p-6 rounded-2xl">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-primary/60">
                    <act.icon size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{act.msg}</p>
                    <p className="text-[10px] uppercase tracking-widest text-foreground/30 font-bold mt-1">{act.time}</p>
                  </div>
                  <Button variant="ghost" size="icon" asChild>
                    <Link href="#"><ArrowRight size={16} /></Link>
                  </Button>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-12">
          {/* Pro Promotion */}
          <Card className="bg-primary/10 border-primary/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:rotate-12 transition-transform">
              <Shirt size={120} />
            </div>
            <CardContent className="p-8 space-y-6">
              <Badge className="bg-primary text-obsidian font-bold">PRO ACCESS</Badge>
              <h3 className="text-3xl font-headline leading-tight">Unlock Your Full Aesthetic Potential</h3>
              <p className="text-sm text-foreground/60 leading-relaxed">Get unlimited analyses, real-time price monitoring, and exclusive access to the Meesho collection.</p>
              <Button className="w-full h-14 bg-primary text-obsidian font-headline text-lg tracking-widest">Upgrade Now</Button>
            </CardContent>
          </Card>

          {/* Quick Tips */}
          <section className="space-y-6">
            <h3 className="text-[10px] uppercase tracking-[0.3em] text-foreground/40 font-bold">Atelier Guidance</h3>
            <div className="space-y-4">
              <div className="p-6 bg-white/5 rounded-2xl border border-white/10 space-y-3">
                <div className="flex items-center gap-2 text-primary">
                  <ShieldCheck size={16} />
                  <span className="text-xs font-bold uppercase tracking-widest">Privacy Tip</span>
                </div>
                <p className="text-xs text-foreground/60 leading-relaxed">Keep your silhouette photo up to date every 6 months for the most accurate fabric-fit mapping.</p>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}