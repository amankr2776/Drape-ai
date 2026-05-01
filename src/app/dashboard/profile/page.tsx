'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, 
  Share2, 
  Edit3, 
  User, 
  Ruler, 
  Palette, 
  ShoppingBag, 
  History, 
  Settings, 
  LogOut, 
  Shield, 
  Bell, 
  Trash2, 
  Plus, 
  Check, 
  ExternalLink, 
  Lock,
  ChevronRight,
  Monitor,
  Smartphone,
  CreditCard,
  Download,
  AlertTriangle,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useSubscription } from '@/hooks/use-subscription';
import { ProBadge } from '@/components/subscription/pro-badge';

export default function ProfilePage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const { plan, isPro, cancelSubscription } = useSubscription();

  // Mock Data
  const [profile, setProfile] = useState({
    name: 'Ananya Sharma',
    handle: '@ananya_style',
    email: 'ananya.sharma@example.com',
    memberSince: 'March 2025',
    stats: { saved: 42, created: 12, explored: 128 },
    body: { shape: 'Pear', height: 164, size: 'M' },
    skin: { monk: 6, hex: '#A67A5B', tone: 'Medium Warm' },
    budget: [2000, 8000],
    occasions: ['Wedding', 'Date Night', 'Traditional'],
    vibe: 'Ethnic Fusion'
  });

  const handleShare = () => {
    navigator.clipboard.writeText(`https://drape.ai/${profile.handle}`);
    toast({
      title: "Link Copied",
      description: "Your style profile link is now in your clipboard.",
    });
  };

  const handleUpdate = () => {
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your changes have been saved to the atelier.",
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* --- HEADER SECTION --- */}
      <section className="relative pt-12">
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-primary/10 to-background z-0" />
        
        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center">
          {/* Profile Image */}
          <div className="relative group mb-6">
            <motion.div 
              animate={{ boxShadow: isPro ? ["0 0 0 0px rgba(201,168,76,0.3)", "0 0 0 10px rgba(201,168,76,0)"] : "none" }}
              transition={{ repeat: Infinity, duration: 2 }}
              className={cn("rounded-full p-1", isPro ? "bg-primary/20" : "bg-muted")}
            >
              <Avatar className="w-32 h-32 border-4 border-background">
                <AvatarImage src="https://picsum.photos/seed/ananya/200/200" alt={profile.name} />
                <AvatarFallback className="text-4xl font-headline bg-primary/10 text-primary">AS</AvatarFallback>
              </Avatar>
            </motion.div>
            <button className="absolute bottom-0 right-0 p-2 bg-primary rounded-full text-primary-foreground shadow-lg hover:scale-110 transition-transform">
              <Camera size={18} />
            </button>
            {isPro && (
              <div className="absolute -top-2 -right-2">
                <ProBadge size="lg" />
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <h1 className="text-4xl md:text-5xl font-headline font-bold text-foreground mb-1">{profile.name}</h1>
            {isPro && <ProBadge size="md" />}
          </div>
          <p className="text-primary font-body tracking-[0.2em] uppercase text-sm mb-2">{profile.handle}</p>
          <p className="text-foreground/40 text-xs mb-8">Style Member since {profile.memberSince}</p>

          <div className="flex gap-12 md:gap-24 mb-10">
            {[
              { val: profile.stats.saved, label: 'Saved' },
              { val: profile.stats.created, label: 'Looks' },
              { val: profile.stats.explored, label: 'Explored' }
            ].map((s, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl font-headline font-bold text-primary">{s.val}</p>
                <p className="text-[10px] uppercase tracking-widest text-foreground/40">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            <Button onClick={() => setIsEditing(!isEditing)} variant="outline" className="border-primary/20">
              <Edit3 size={16} className="mr-2" /> {isEditing ? 'Cancel Edit' : 'Edit Profile'}
            </Button>
            <Button onClick={handleShare} variant="outline" className="border-primary/20">
              <Share2 size={16} className="mr-2" /> Share Profile
            </Button>
          </div>
        </div>
      </section>

      {/* --- TABS NAVIGATION --- */}
      <div className="container mx-auto px-4 mt-16">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-center border-b border-primary/10 mb-12">
            <TabsList className="bg-transparent h-12 gap-8 md:gap-16">
              {['Overview', 'Style Profile', 'Activity', 'Settings'].map((tab) => (
                <TabsTrigger 
                  key={tab}
                  value={tab.toLowerCase()} 
                  className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary rounded-none px-0 h-12 uppercase tracking-[0.2em] text-[10px] font-bold"
                >
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* --- TAB 1: OVERVIEW --- */}
          <TabsContent value="overview" className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Snapshot Card */}
              <Card className="bg-card/40 border-primary/10 lg:col-span-2 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                <CardHeader>
                  <CardTitle className="text-2xl text-primary">Style Snapshot</CardTitle>
                  <CardDescription>A visual summary of your fashion identity.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  <div className="space-y-2">
                    <p className="text-[10px] uppercase tracking-widest text-foreground/40">Body Shape</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center text-primary">
                        <User size={20} />
                      </div>
                      <span className="font-headline text-lg">{profile.body.shape}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] uppercase tracking-widest text-foreground/40">Skin Tone</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded shadow-inner" style={{ backgroundColor: profile.skin.hex }} />
                      <span className="font-headline text-lg">{profile.skin.tone}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] uppercase tracking-widest text-foreground/40">Height</p>
                    <div className="flex items-center gap-3">
                       <Ruler size={20} className="text-primary" />
                       <span className="font-headline text-lg">{profile.body.height} cm</span>
                    </div>
                  </div>
                   <div className="space-y-2">
                    <p className="text-[10px] uppercase tracking-widest text-foreground/40">Vibe</p>
                    <div className="flex items-center gap-3">
                       <Palette size={20} className="text-primary" />
                       <span className="font-headline text-lg">{profile.vibe}</span>
                    </div>
                  </div>
                </CardContent>
                <div className="px-6 pb-6">
                   <Button asChild variant="link" className="text-primary p-0 h-auto text-xs uppercase tracking-widest">
                     <Link href="/onboarding">Update Style Profile →</Link>
                   </Button>
                </div>
              </Card>

              {/* Fav Brands */}
              <Card className="bg-card/40 border-primary/10">
                 <CardHeader>
                  <CardTitle className="text-xl">Preferred Brands</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {['Zara', 'Fabindia', 'H&M', 'Biba', 'Sabyasachi'].map(b => (
                      <Badge key={b} variant="secondary" className="bg-primary/5 text-primary border-primary/10 py-1 px-3">
                        {b}
                      </Badge>
                    ))}
                    <Button variant="ghost" size="sm" className="h-7 text-xs border border-dashed border-primary/20">
                      <Plus size={12} className="mr-1" /> Add
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <h3 className="font-headline text-3xl text-primary">Recent Looks Viewed</h3>
              <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="min-w-[200px] aspect-[3/4] rounded-xl overflow-hidden relative group">
                    <img 
                      src={`https://picsum.photos/seed/history-${i}/400/600`} 
                      alt="History" 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <p className="text-xs text-primary font-bold uppercase">Wedding Look</p>
                      <p className="text-[10px] text-foreground/40 italic">Viewed 2 days ago</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* --- TAB 2: STYLE PROFILE --- */}
          <TabsContent value="style profile" className="space-y-12 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
               {/* Body Stats */}
               <div className="space-y-8">
                 <h3 className="text-2xl font-headline text-primary border-l-4 border-primary pl-4">Physique Details</h3>
                 <div className="space-y-6">
                    <div className="space-y-3">
                      <Label className="text-xs uppercase tracking-widest text-foreground/50">Height (cm)</Label>
                      <Slider 
                        defaultValue={[profile.body.height]} 
                        max={210} min={130} step={1} 
                        className="py-4"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-xs uppercase tracking-widest text-foreground/50">Body Size</Label>
                      <div className="grid grid-cols-6 gap-2">
                        {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => (
                          <button 
                            key={size}
                            className={cn(
                              "h-10 border rounded transition-all text-xs font-bold",
                              profile.body.size === size ? "bg-primary text-primary-foreground border-primary" : "border-primary/10 hover:border-primary/40"
                            )}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                 </div>
               </div>

               {/* Skin Harmony */}
               <div className="space-y-8">
                 <h3 className="text-2xl font-headline text-primary border-l-4 border-primary pl-4">Skin Harmony</h3>
                 <div className="bg-card/30 p-6 rounded-2xl border border-primary/10 space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-lg font-headline">{profile.skin.tone}</p>
                        <p className="text-[10px] text-foreground/40 uppercase tracking-widest">Monk Scale: 0{profile.skin.monk}</p>
                      </div>
                      <div className="w-16 h-16 rounded-full border-4 border-background shadow-lg" style={{ backgroundColor: profile.skin.hex }} />
                    </div>
                    <div className="space-y-3">
                       <p className="text-[10px] uppercase tracking-widest text-foreground/50">Complementary Palette</p>
                       <div className="flex gap-2">
                          {['#C9A84C', '#C4545A', '#F5F0E8', '#1A2A6C', '#3D3D3D', '#8B0000'].map(c => (
                            <div key={c} className="w-8 h-8 rounded-full border border-background shadow-sm" style={{ backgroundColor: c }} />
                          ))}
                       </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full h-10 text-xs border-primary/20">
                      Re-analyze Skin Tone
                    </Button>
                 </div>
               </div>
            </div>

            <Separator className="bg-primary/10" />

            {/* Preferences */}
            <div className="space-y-8">
              <h3 className="text-2xl font-headline text-primary border-l-4 border-primary pl-4">Style Vibe & Budget</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-4">
                  <Label className="text-xs uppercase tracking-widest text-foreground/50">Favorite Vibe</Label>
                  <div className="flex flex-wrap gap-2">
                    {['Minimalist', 'Ethnic Fusion', 'Bohemian', 'Contemporary', 'Streetwear'].map(v => (
                      <Badge 
                        key={v} 
                        className={cn(
                          "cursor-pointer px-4 py-2", 
                          profile.vibe === v ? "bg-primary text-primary-foreground" : "bg-primary/5 text-primary border-primary/10"
                        )}
                      >
                        {v}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                   <div className="flex justify-between items-end">
                      <Label className="text-xs uppercase tracking-widest text-foreground/50">Budget Range</Label>
                      <span className="text-primary font-bold">₹{profile.budget[0]} - ₹{profile.budget[1]}</span>
                   </div>
                   <Slider defaultValue={profile.budget} max={20000} min={500} step={500} className="py-4" />
                </div>
              </div>
            </div>

            <div className="text-right pt-8">
              <Button onClick={handleUpdate} size="lg" className="px-12 font-headline text-lg tracking-widest bg-primary text-primary-foreground">
                Save Style Profile
              </Button>
            </div>
          </TabsContent>

          {/* --- TAB 3: ACTIVITY --- */}
          <TabsContent value="activity" className="space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-headline text-primary">Outfit Recommendation History</h3>
                  <Button variant="ghost" size="sm" className="text-xs uppercase tracking-widest">Clear History</Button>
                </div>
                <div className="space-y-4">
                  {[
                    { id: 1, name: 'Regal Silk Bandhgala', occ: 'Wedding', date: 'Oct 12, 2024', price: '₹12,499' },
                    { id: 2, name: 'Minimal Linen Set', occ: 'Casual', date: 'Oct 10, 2024', price: '₹4,200' },
                    { id: 3, name: 'Midnight Bloom Sari', occ: 'Festive', date: 'Oct 08, 2024', price: '₹8,900' },
                  ].map(item => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-card/20 border border-primary/5 rounded-xl hover:border-primary/30 transition-all group">
                       <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted">
                            <img src={`https://picsum.photos/seed/item-${item.id}/200/200`} className="w-full h-full object-cover" alt="item" />
                          </div>
                          <div>
                            <p className="font-headline text-lg group-hover:text-primary transition-colors">{item.name}</p>
                            <p className="text-[10px] uppercase tracking-widest text-foreground/40">{item.occ} • {item.date}</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="font-bold text-primary">{item.price}</p>
                          <Button variant="link" className="h-auto p-0 text-[10px] uppercase text-foreground/40 hover:text-primary">View Look →</Button>
                       </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-8">
                <h3 className="text-2xl font-headline text-primary">Active Price Alerts</h3>
                <div className="space-y-4">
                  {[
                    { name: 'Kalamkari Handblock Sari', current: '₹5,800', target: '₹4,500', off: '22%' },
                    { name: 'Pure Leather Juttis', current: '₹2,400', target: '₹1,900', off: '20%' },
                  ].map(alert => (
                    <Card key={alert.name} className="bg-primary/5 border-primary/10 overflow-hidden">
                       <CardContent className="p-4 flex justify-between items-center">
                          <div className="space-y-1">
                             <p className="text-sm font-bold truncate max-w-[150px]">{alert.name}</p>
                             <div className="flex items-center gap-2">
                                <span className="text-xs line-through text-foreground/30">{alert.current}</span>
                                <span className="text-xs font-bold text-primary">Target: {alert.target}</span>
                             </div>
                          </div>
                          <Switch defaultChecked />
                       </CardContent>
                    </Card>
                  ))}
                </div>
                <Button variant="ghost" className="w-full border-primary/10 h-12 text-xs uppercase tracking-widest">
                  View All Alerts
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* --- TAB 4: SETTINGS --- */}
          <TabsContent value="settings" className="space-y-12 max-w-4xl mx-auto">
            {/* Account Settings */}
            <div className="space-y-8">
              <h3 className="text-2xl font-headline text-primary border-l-4 border-primary pl-4">Account Essentials</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-widest text-foreground/40">Full Name</Label>
                    <Input defaultValue={profile.name} className="h-12 bg-card/20 border-primary/10" />
                 </div>
                 <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-widest text-foreground/40">Email Address</Label>
                    <div className="relative">
                      <Input defaultValue={profile.email} className="h-12 bg-card/20 border-primary/10 pr-24" />
                      <Badge className="absolute right-3 top-1/2 -translate-y-1/2 bg-green-500/20 text-green-500 text-[8px] uppercase">Verified</Badge>
                    </div>
                 </div>
              </div>
            </div>

            <Separator className="bg-primary/10" />

            {/* Notifications */}
            <div className="space-y-8">
              <h3 className="text-2xl font-headline text-primary border-l-4 border-primary pl-4">Notification Atelier</h3>
              <div className="space-y-4">
                {[
                  { title: 'Price Drop Alerts', desc: 'Notify me when saved items hit my target price.', icon: Bell },
                  { title: 'Style Digest', desc: 'Weekly roundup of trends personalized for your shape.', icon: Palette },
                  { title: 'New Recommendations', desc: 'Real-time alerts when we find a match for you.', icon: ShoppingBag },
                  { title: 'Connected Service Updates', desc: 'Maintenance and new platform arrivals.', icon: Monitor },
                ].map(n => (
                  <div key={n.title} className="flex items-center justify-between p-4 bg-card/20 rounded-xl border border-primary/5">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-full bg-primary/5 text-primary">
                        <n.icon size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-sm">{n.title}</p>
                        <p className="text-xs text-foreground/40">{n.desc}</p>
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                ))}
              </div>
            </div>

            <Separator className="bg-primary/10" />

            {/* Security */}
            <div className="space-y-8">
              <h3 className="text-2xl font-headline text-primary border-l-4 border-primary pl-4">Security & Authentication</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="bg-card/20 border-primary/10">
                   <CardHeader>
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Lock size={16} className="text-primary" /> Two-Factor Authentication
                      </CardTitle>
                   </CardHeader>
                   <CardContent className="space-y-4">
                      <p className="text-xs text-foreground/40 leading-relaxed">Secure your style profile with an additional layer of biometric or OTP protection.</p>
                      <Button variant="outline" className="w-full text-xs uppercase tracking-widest border-primary/20">Enable 2FA</Button>
                   </CardContent>
                </Card>
                <Card className="bg-card/20 border-primary/10">
                   <CardHeader>
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Monitor size={16} className="text-primary" /> Active Sessions
                      </CardTitle>
                   </CardHeader>
                   <CardContent className="space-y-4">
                      <div className="flex items-center gap-3">
                         <Smartphone size={16} className="text-primary/60" />
                         <div>
                            <p className="text-xs font-bold">iPhone 15 Pro • Mumbai, IN</p>
                            <p className="text-[10px] text-foreground/30 uppercase">Current Session</p>
                         </div>
                      </div>
                      <Button variant="ghost" className="w-full text-xs uppercase tracking-widest text-accent">Sign Out All Devices</Button>
                   </CardContent>
                </Card>
              </div>
            </div>

            {/* Subscription */}
            <div className="space-y-8">
              <h3 className="text-2xl font-headline text-primary border-l-4 border-primary pl-4">Atelier Membership</h3>
              <Card className="bg-primary/5 border-primary/20 relative overflow-hidden p-8">
                 <div className="absolute top-0 right-0 p-4">
                    {isPro ? <ProBadge size="lg" /> : <Badge variant="secondary">FREE</Badge>}
                 </div>
                 <div className="space-y-6">
                    <div>
                      <h4 className="text-3xl font-headline mb-2">{isPro ? 'The Elite Atelier Plan' : 'Free Style Enthusiast'}</h4>
                      <p className="text-sm text-foreground/60">
                        {isPro 
                          ? 'Unlimited style analysis, priority price alerts, and exclusive access.' 
                          : 'Basic silhouette analysis and standard marketplace results.'}
                      </p>
                    </div>
                    {isPro ? (
                      <div className="flex items-center gap-8">
                        <div>
                            <p className="text-[10px] uppercase tracking-widest text-foreground/40">Renewal Date</p>
                            <p className="text-lg font-bold">May 12, 2026</p>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase tracking-widest text-foreground/40">Billing cycle</p>
                            <p className="text-lg font-bold">Annual</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <p className="text-xs text-primary font-bold">Upgrade to Pro for unlimited AI intelligence.</p>
                        <Button asChild className="bg-primary text-primary-foreground font-headline tracking-widest">
                          <Link href="/pricing">Upgrade Now</Link>
                        </Button>
                      </div>
                    )}
                    {isPro && (
                      <div className="flex gap-4">
                        <Button variant="outline" className="border-primary/20 font-headline tracking-widest">Manage Billing</Button>
                        <Button variant="ghost" onClick={cancelSubscription} className="text-foreground/40 hover:text-accent">Cancel Membership</Button>
                      </div>
                    )}
                 </div>
              </Card>
            </div>

            {/* Danger Zone */}
            <div className="space-y-8 pt-12">
               <div className="p-8 border-2 border-accent/20 rounded-2xl bg-accent/5 space-y-8">
                  <div className="flex items-center gap-4 text-accent">
                    <AlertTriangle size={32} />
                    <div>
                      <h3 className="text-2xl font-headline">Danger Zone</h3>
                      <p className="text-sm">Careful. These actions are irreversible and will purge your history.</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <Button variant="outline" className="border-accent/20 text-accent hover:bg-accent/10">Delete Style History</Button>
                     <Button variant="outline" className="border-accent/20 text-accent hover:bg-accent/10">Reset AI Profile</Button>
                     
                     <Dialog>
                       <DialogTrigger asChild>
                         <Button variant="destructive">Delete My Account</Button>
                       </DialogTrigger>
                       <DialogContent className="bg-background border-accent/20">
                          <DialogHeader>
                            <DialogTitle className="text-3xl font-headline text-accent">Final Departure</DialogTitle>
                            <DialogDescription>
                              This will permanently delete your style profile, saved items, and history. This action cannot be undone.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-6">
                             <Label className="text-xs uppercase tracking-widest text-foreground/40">Type <span className="text-accent font-bold">DELETE</span> to confirm</Label>
                             <Input 
                                value={deleteConfirm} 
                                onChange={(e) => setDeleteConfirm(e.target.value)}
                                className="h-12 border-accent/20 bg-accent/5 focus-visible:ring-accent" 
                             />
                          </div>
                          <DialogFooter>
                             <Button variant="ghost" onClick={() => setDeleteConfirm('')}>Cancel</Button>
                             <Button 
                                variant="destructive" 
                                disabled={deleteConfirm !== 'DELETE'}
                                className="px-8 font-headline tracking-widest"
                             >
                                Delete Forever
                             </Button>
                          </DialogFooter>
                       </DialogContent>
                     </Dialog>
                  </div>
               </div>
            </div>
            
            <div className="text-center pt-12">
               <p className="text-[10px] uppercase tracking-[0.5em] text-foreground/20">DRAPE AI • DESIGNED IN INDIA • DATA PRIVACY CERTIFIED</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
