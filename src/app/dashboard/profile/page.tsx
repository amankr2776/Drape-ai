'use client';

import Link from 'next/link';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Settings, 
  History, 
  Sparkles, 
  Camera, 
  Share2, 
  ShieldCheck, 
  TrendingUp, 
  LogOut,
  ChevronRight,
  Pin
} from 'lucide-react';
import { ProBadge } from '@/components/subscription/pro-badge';
import { Separator } from '@/components/ui/separator';

export default function ProfilePage() {
  const { profile, styleProfile, role, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { label: 'Analyses', val: '12' },
    { label: 'Saved Looks', val: '42' },
    { label: 'Brands', val: '8' },
    { label: 'Active Days', val: '128' },
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-obsidian">
        {/* Profile Header */}
        <section className="relative h-64 md:h-80 w-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-gold/20 to-obsidian" />
          <div 
            className="absolute inset-0 opacity-20 grayscale bg-cover bg-center" 
            style={{ backgroundImage: `url(${profile?.cover_url || 'https://picsum.photos/seed/fashion-bg/1200/400'})` }}
          />
          <div className="container mx-auto px-6 h-full flex flex-col justify-end pb-12 relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
                <div className="relative group">
                  <Avatar className="w-32 h-32 md:w-44 md:h-44 border-[6px] border-obsidian shadow-2xl relative overflow-hidden bg-obsidian-2">
                    <AvatarImage src={profile?.avatar_url || ''} className="object-cover" />
                    <AvatarFallback className="text-4xl font-headline bg-gold/10 text-gold">
                      {profile?.full_name?.split(' ').map(n => n[0]).join('') || 'AS'}
                    </AvatarFallback>
                  </Avatar>
                  <button className="absolute bottom-2 right-2 p-3 bg-gold rounded-full text-obsidian shadow-xl hover:scale-110 transition-transform border-4 border-obsidian">
                    <Camera size={20} />
                  </button>
                </div>
                
                <div className="text-center md:text-left space-y-2 pb-2">
                  <div className="flex items-center justify-center md:justify-start gap-3">
                    <h1 className="text-4xl md:text-6xl font-headline text-ivory">{profile?.full_name}</h1>
                    {role === 'pro' && <ProBadge size="md" />}
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-4 text-xs font-bold uppercase tracking-widest text-gold">
                    <span>@{profile?.username || 'user'}</span>
                    <span className="text-ivory-4">•</span>
                    <span className="flex items-center gap-1 text-ivory-4"><Pin size={12} /> {profile?.location || 'India'}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 justify-center md:pb-2">
                <Button variant="primary" className="h-12 px-8 font-headline tracking-widest uppercase text-sm">Edit Profile</Button>
                <Button variant="outline" className="h-12 w-12 p-0 border-gold/20"><Share2 size={18} /></Button>
              </div>
            </div>
          </div>
        </section>

        {/* Profile Tabs */}
        <div className="container mx-auto px-6 mt-12 pb-32">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="sticky top-16 z-20 bg-obsidian/95 backdrop-blur-xl border-b border-gold/5 flex justify-center mb-12">
              <TabsList className="bg-transparent h-14 gap-8 md:gap-16">
                {[
                  { id: 'overview', label: 'Overview', icon: User },
                  { id: 'style', label: 'Style Profile', icon: Sparkles },
                  { id: 'activity', label: 'Activity', icon: History },
                  { id: 'settings', label: 'Settings', icon: Settings }
                ].map((t) => (
                  <TabsTrigger 
                    key={t.id}
                    value={t.id} 
                    className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-gold data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-gold rounded-none px-0 h-14 uppercase tracking-[0.2em] text-[10px] font-bold transition-all"
                  >
                    <t.icon size={14} className="mr-2 hidden sm:inline" />
                    {t.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <AnimatePresence mode="wait">
              <TabsContent value="overview" className="space-y-12 mt-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Stats Card */}
                  <Card className="bg-obsidian-2/50 border-gold/10 p-8 flex flex-col justify-center text-center space-y-8">
                    <div className="flex justify-around items-center">
                      {stats.map((s, i) => (
                        <div key={i}>
                          <p className="text-3xl font-headline text-gold">{s.val}</p>
                          <p className="text-[10px] uppercase tracking-widest text-ivory-4 font-bold">{s.label}</p>
                        </div>
                      ))}
                    </div>
                    <Separator className="bg-gold/5" />
                    <div className="space-y-2">
                       <p className="text-[10px] uppercase tracking-widest text-gold font-bold">Bio</p>
                       <p className="text-xs italic text-ivory-3 leading-relaxed">"{profile?.bio || 'No bio yet.'}"</p>
                    </div>
                  </Card>

                  {/* Identity Snapshot */}
                  <Card className="md:col-span-2 bg-obsidian-2/50 border-gold/10 overflow-hidden relative">
                     <div className="absolute top-0 left-0 w-1.5 h-full bg-gold" />
                     <CardHeader className="p-8 pb-4">
                        <CardTitle className="text-2xl text-gold">Aesthetic DNA</CardTitle>
                        <CardDescription className="text-ivory-4 uppercase tracking-widest text-[10px]">Your current style parameters across the atelier.</CardDescription>
                     </CardHeader>
                     <CardContent className="p-8 grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                          { label: 'Body Shape', val: styleProfile?.body_shape || 'Pending' },
                          { label: 'Skin Tone', val: styleProfile?.skin_tone || 'Pending' },
                          { label: 'Height', val: `${styleProfile?.height_cm || '-'} cm` },
                          { label: 'Style Vibe', val: styleProfile?.style_vibes[0] || 'Unset' }
                        ].map((item, i) => (
                          <div key={i} className="space-y-2">
                            <p className="text-[10px] uppercase tracking-[0.2em] text-ivory-4 font-bold">{item.label}</p>
                            <span className="font-headline text-xl text-ivory">{item.val}</span>
                          </div>
                        ))}
                     </CardContent>
                     <div className="px-8 pb-8 flex justify-end">
                        <Button asChild variant="ghost" className="text-gold uppercase tracking-widest text-[10px] p-0 h-auto font-bold group">
                          <Link href="/analyze" className="flex items-center gap-2">Update Analysis <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" /></Link>
                        </Button>
                     </div>
                  </Card>
                </div>

                {/* Recent Activity Mini-Feed */}
                <div className="space-y-8">
                   <h3 className="text-xl font-headline text-gold italic border-l-2 border-gold pl-4">Recent Explorations</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="p-4 bg-obsidian-2 border border-gold/5 rounded-xl flex items-center gap-4 group hover:border-gold/20 transition-colors">
                           <div className="w-12 h-16 rounded bg-obsidian-3 overflow-hidden border border-gold/10">
                              <img src={`https://picsum.photos/seed/hist-${i}/100/150`} className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all" />
                           </div>
                           <div className="flex-1">
                              <p className="text-sm font-medium">Saved "Heritage Silk Zari"</p>
                              <p className="text-[9px] uppercase tracking-widest text-ivory-4">2 hours ago • Myntra</p>
                           </div>
                           <Button variant="ghost" size="icon" className="text-gold/20 group-hover:text-gold"><ChevronRight size={18} /></Button>
                        </div>
                      ))}
                   </div>
                </div>
              </TabsContent>
              
              <TabsContent value="settings" className="max-w-3xl mx-auto space-y-12 mt-0">
                <Card className="bg-obsidian-2 border-gold/10 overflow-hidden">
                   <CardHeader className="bg-obsidian-3/50 border-b border-gold/5 p-6">
                     <CardTitle className="text-lg flex items-center gap-3"><ShieldCheck size={20} className="text-gold" /> Account Atelier</CardTitle>
                   </CardHeader>
                   <CardContent className="p-8 space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div className="space-y-2">
                            <label className="text-[10px] uppercase font-bold text-gold tracking-widest">Full Name</label>
                            <p className="text-lg text-ivory">{profile?.full_name}</p>
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] uppercase font-bold text-gold tracking-widest">Email Identity</label>
                            <p className="text-lg text-ivory">{profile?.email}</p>
                         </div>
                      </div>
                      <Separator className="bg-gold/5" />
                      <div className="flex justify-between items-center">
                         <div>
                            <p className="text-sm font-bold text-ivory">Membership Tier</p>
                            <p className="text-xs text-ivory-4 uppercase tracking-widest">{role === 'pro' ? 'Elite Pro Member' : 'Free Stylist'}</p>
                         </div>
                         <Button variant="outline" className="border-gold/20 text-gold uppercase text-[10px] font-bold h-10 px-6">Manage Billing</Button>
                      </div>
                   </CardContent>
                </Card>

                <div className="pt-12">
                   <Button 
                    onClick={signOut}
                    variant="outline" 
                    className="w-full h-14 border-rose/30 text-rose hover:bg-rose/5 uppercase tracking-[0.3em] font-bold text-xs gap-3"
                   >
                     <LogOut size={18} /> Exit the Atelier
                   </Button>
                </div>
              </TabsContent>
            </AnimatePresence>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  );
}
