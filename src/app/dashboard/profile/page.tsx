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
  Sparkles,
  Loader2,
  X
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
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useSubscription } from '@/hooks/use-subscription';
import { ProBadge } from '@/components/subscription/pro-badge';

export default function ProfilePage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { plan, isPro, cancelSubscription } = useSubscription();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile State
  const [profile, setProfile] = useState({
    name: 'Ananya Sharma',
    handle: '@ananya_style',
    email: 'ananya.sharma@example.com',
    memberSince: 'March 2025',
    bio: 'Fashion enthusiast exploring the intersection of traditional handloom and AI precision.',
    city: 'Indiranagar, Bangalore',
    stats: { saved: 42, created: 12, explored: 128 },
    body: { shape: 'Pear', height: 164, size: 'M' },
    skin: { monk: 6, hex: '#A67A5B', tone: 'Medium Warm' },
    budget: [2000, 8000],
    occasions: ['Wedding', 'Date Night', 'Traditional'],
    vibe: 'Ethnic Fusion',
    photo: 'https://picsum.photos/seed/ananya/400/400'
  });

  const handlePhotoClick = () => fileInputRef.current?.click();

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      // Simulate upload process
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        setProfile(prev => ({ ...prev, photo: loadEvent.target?.result as string }));
        setIsUploading(false);
        toast({ title: "Avatar Updated", description: "Your profile identity has been refreshed." });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
    setIsEditing(false);
    toast({ title: "Changes Dispatched", description: "Your atelier profile has been updated successfully." });
  };

  return (
    <div className="min-h-screen bg-obsidian pb-32">
      {/* Header Banner */}
      <section className="relative h-64 md:h-80 w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gold/15 to-obsidian" />
        <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/fashion-bg/1200/400')] opacity-10 bg-cover bg-center grayscale" />
        <div className="container mx-auto px-6 h-full flex flex-col justify-end pb-12 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-10">
              <div className="relative group">
                <Avatar className="w-32 h-32 md:w-44 md:h-44 border-[6px] border-obsidian shadow-2xl relative overflow-hidden bg-obsidian-3">
                  <AvatarImage src={profile.photo} className="object-cover" />
                  <AvatarFallback className="text-4xl font-headline bg-gold/10 text-gold">AS</AvatarFallback>
                  {isUploading && (
                    <div className="absolute inset-0 bg-obsidian/60 flex items-center justify-center">
                      <Loader2 className="animate-spin text-gold" size={32} />
                    </div>
                  )}
                </Avatar>
                <button 
                  onClick={handlePhotoClick}
                  className="absolute bottom-2 right-2 p-3 bg-gold rounded-full text-obsidian shadow-xl hover:scale-110 transition-transform z-20 border-4 border-obsidian"
                >
                  <Camera size={20} />
                </button>
                <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} className="hidden" accept="image/*" />
                {isPro && <div className="absolute -top-2 -left-2"><ProBadge size="lg" /></div>}
              </div>
              
              <div className="text-center md:text-left space-y-2 pb-2">
                <div className="flex items-center justify-center md:justify-start gap-3">
                  <h1 className="text-4xl md:text-6xl font-headline text-ivory">{profile.name}</h1>
                  {isPro && <ProBadge size="md" className="hidden md:flex" />}
                </div>
                <p className="text-gold font-body tracking-[0.3em] uppercase text-sm">{profile.handle}</p>
                <p className="text-ivory-4 text-xs">Member since {profile.memberSince} • {profile.city}</p>
              </div>
            </div>

            <div className="flex gap-4 justify-center md:pb-2">
              <Button onClick={() => setIsEditing(!isEditing)} variant={isEditing ? "outline" : "primary"} className="h-12 px-8 font-headline tracking-widest uppercase text-sm">
                {isEditing ? 'Cancel Edit' : <><Edit3 size={16} className="mr-2" /> Edit Profile</>}
              </Button>
              <Button variant="outline" className="h-12 w-12 p-0 border-gold/20 hover:border-gold">
                <Share2 size={18} />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Layout */}
      <div className="container mx-auto px-6 mt-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="sticky top-[64px] z-[100] bg-obsidian/95 backdrop-blur-xl border-b border-border flex justify-center mb-12">
            <TabsList className="bg-transparent h-14 gap-8 md:gap-16">
              {['Overview', 'Style Profile', 'Activity', 'Settings'].map((tab) => (
                <TabsTrigger 
                  key={tab}
                  value={tab.toLowerCase()} 
                  className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-gold data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-gold rounded-none px-0 h-14 uppercase tracking-[0.2em] text-[10px] font-bold transition-all"
                >
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Overview Panel */}
          <TabsContent value="overview" className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Stats Card */}
              <Card className="bg-obsidian-2/50 border-gold/10 p-8 flex flex-col justify-center text-center space-y-6">
                <div className="flex justify-around items-center">
                  {[
                    { val: profile.stats.saved, label: 'Saved' },
                    { val: profile.stats.created, label: 'Outfits' },
                    { val: profile.stats.explored, label: 'Views' }
                  ].map((s, i) => (
                    <div key={i}>
                      <p className="text-3xl font-headline text-gold">{s.val}</p>
                      <p className="text-[10px] uppercase tracking-widest text-ivory-4 font-bold">{s.label}</p>
                    </div>
                  ))}
                </div>
                <Separator className="bg-gold/5" />
                <p className="text-xs italic text-ivory-3 leading-relaxed">"{profile.bio}"</p>
              </Card>

              {/* Identity Snapshot */}
              <Card className="md:col-span-2 bg-obsidian-2/50 border-gold/10 overflow-hidden relative">
                 <div className="absolute top-0 left-0 w-1.5 h-full bg-gold" />
                 <CardHeader className="p-8 pb-4">
                    <CardTitle className="text-2xl text-gold">Aesthetic Identity</CardTitle>
                    <CardDescription className="text-ivory-4">Your current style DNA across the atelier.</CardDescription>
                 </CardHeader>
                 <CardContent className="p-8 grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                      { icon: User, label: 'Body Shape', val: profile.body.shape },
                      { icon: Ruler, label: 'Height', val: `${profile.body.height} cm` },
                      { icon: Palette, label: 'Skin Tone', val: profile.skin.tone },
                      { icon: Sparkles, label: 'Style Vibe', val: profile.vibe }
                    ].map((item, i) => (
                      <div key={i} className="space-y-2">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-ivory-4 font-bold">{item.label}</p>
                        <div className="flex items-center gap-3">
                          <item.icon size={18} className="text-gold/60" />
                          <span className="font-headline text-xl text-ivory">{item.val}</span>
                        </div>
                      </div>
                    ))}
                 </CardContent>
                 <div className="px-8 pb-8 flex justify-end">
                    <Button asChild variant="link" className="text-gold uppercase tracking-widest text-[10px] p-0 h-auto font-bold">
                      <Link href="/analyze">Update DNA →</Link>
                    </Button>
                 </div>
              </Card>
            </div>

            {/* History Strip */}
            <div className="space-y-6">
              <h3 className="text-2xl font-headline text-gold flex items-center gap-3">
                <History className="w-6 h-6" /> Recently Viewed
              </h3>
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="min-w-[180px] aspect-[3/4] rounded-xl overflow-hidden relative group cursor-pointer border border-border">
                    <img src={`https://picsum.photos/seed/history-${i}/400/600`} className="w-full h-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0" />
                    <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent opacity-60" />
                    <div className="absolute bottom-4 left-4">
                      <p className="text-[10px] uppercase font-bold text-gold">Festive Look</p>
                      <p className="text-[8px] text-ivory-4">Viewed 2h ago</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Settings Panel */}
          <TabsContent value="settings" className="max-w-4xl mx-auto space-y-12">
            {/* Account Essentials */}
            <Card className="bg-obsidian-2 border-border overflow-hidden">
               <CardHeader className="bg-obsidian-3/50 border-b border-border p-6">
                 <CardTitle className="text-lg flex items-center gap-3"><User size={20} className="text-gold" /> Account Essentials</CardTitle>
               </CardHeader>
               <CardContent className="p-8 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase tracking-widest text-ivory-4 font-bold">Full Name</Label>
                      <Input 
                        disabled={!isEditing} 
                        defaultValue={profile.name} 
                        onChange={(e) => setProfile({...profile, name: e.target.value})}
                        className="h-12 bg-obsidian-3 border-border focus:border-gold" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase tracking-widest text-ivory-4 font-bold">Username</Label>
                      <Input 
                        disabled={!isEditing} 
                        defaultValue={profile.handle} 
                        onChange={(e) => setProfile({...profile, handle: e.target.value})}
                        className="h-12 bg-obsidian-3 border-border focus:border-gold" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-widest text-ivory-4 font-bold">Bio</Label>
                    <Textarea 
                      disabled={!isEditing} 
                      defaultValue={profile.bio}
                      onChange={(e) => setProfile({...profile, bio: e.target.value})}
                      className="min-h-[100px] bg-obsidian-3 border-border focus:border-gold resize-none"
                    />
                  </div>
                  {isEditing && (
                    <div className="flex justify-end pt-4">
                       <Button loading={isSaving} onClick={handleSaveProfile} className="h-12 px-12 bg-gold text-obsidian tracking-widest font-headline text-lg">
                         Dispatch Changes
                       </Button>
                    </div>
                  )}
               </CardContent>
            </Card>

            {/* Notifications */}
            <Card className="bg-obsidian-2 border-border">
               <CardHeader className="bg-obsidian-3/50 border-b border-border p-6">
                 <CardTitle className="text-lg flex items-center gap-3"><Bell size={20} className="text-gold" /> Communication Atelier</CardTitle>
               </CardHeader>
               <CardContent className="p-8 space-y-6">
                  {[
                    { id: 'price', label: 'Price Drop Alerts', desc: 'Real-time notify when favorites hit target price' },
                    { id: 'matches', label: 'New Style Matches', desc: 'Alert when we find outfits for your body type' },
                    { id: 'digest', label: 'Weekly Style Journal', desc: 'Monday morning roundup of trends' }
                  ].map((item) => (
                    <div key={item.id} className="flex items-center justify-between py-2">
                      <div className="space-y-0.5">
                         <p className="text-sm font-bold text-ivory">{item.label}</p>
                         <p className="text-[10px] text-ivory-4 uppercase tracking-widest">{item.desc}</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  ))}
               </CardContent>
            </Card>

            {/* Danger Zone */}
            <div className="pt-8">
               <div className="p-8 rounded-[24px] bg-rose/5 border-2 border-dashed border-rose/20 space-y-8">
                  <div className="flex items-center gap-6">
                    <div className="p-4 rounded-full bg-rose/10 text-rose">
                      <AlertTriangle size={32} />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-2xl font-headline text-rose">Danger Zone</h3>
                      <p className="text-xs text-rose/60 uppercase tracking-widest font-bold">These actions are irreversible</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button variant="outline" className="h-14 border-rose/20 text-rose hover:bg-rose/5 uppercase tracking-widest text-[10px] font-bold">
                       Reset AI Analysis Profile
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="danger" className="h-14 bg-rose text-white uppercase tracking-widest text-[10px] font-bold">
                          Delete Style Identity
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-obsidian-2 border-rose/20">
                         <DialogHeader>
                            <DialogTitle className="text-rose font-headline text-3xl">Final Departure</DialogTitle>
                            <DialogDescription className="text-ivory-3">
                              This will permanently purge your silhouette data, analysis history, and saved outfits within 30 days.
                            </DialogDescription>
                         </DialogHeader>
                         <div className="py-6 space-y-4">
                            <Label className="text-[10px] uppercase font-bold text-ivory-4">Type <span className="text-rose">DELETE</span> to confirm</Label>
                            <Input className="h-12 bg-obsidian-3 border-rose/30 focus:border-rose" />
                         </div>
                         <DialogFooter>
                            <Button variant="outline" className="h-12 flex-1">Cancel</Button>
                            <Button variant="danger" className="h-12 flex-1">Purge Account</Button>
                         </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
               </div>
            </div>

            <div className="text-center pt-12">
               <p className="text-[10px] uppercase tracking-[0.5em] text-ivory-4 font-bold">DRAPE AI • DATA PRIVACY CERTIFIED • ISO 27001</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
