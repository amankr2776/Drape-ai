'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  ShieldCheck, 
  Bell, 
  CreditCard, 
  Database,
  Globe,
  HelpCircle,
  Link as LinkIcon,
  ChevronRight,
  Lock,
  Zap,
  Smartphone,
  Shield,
  Activity
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

const SETTINGS_TABS = [
  { id: 'account', label: 'Account', icon: User },
  { id: 'security', label: 'Security', icon: ShieldCheck },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'privacy', label: 'Privacy & Data', icon: Database },
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'integrations', label: 'Integrations', icon: LinkIcon },
  { id: 'prefs', label: 'Preferences', icon: Globe },
  { id: 'help', label: 'Help & Support', icon: HelpCircle },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('account');
  const { profile, role } = useAuth();

  return (
    <div className="min-h-screen bg-obsidian pt-32 pb-40 px-6">
      <div className="container mx-auto max-w-6xl">
        <header className="mb-12 space-y-2">
          <h1 className="text-4xl md:text-6xl font-headline text-gold">Atelier Settings</h1>
          <p className="text-ivory-3 text-lg">Manage your identity and synchronize your style experience.</p>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col lg:flex-row gap-12 items-start">
          <TabsList className="bg-transparent flex flex-col items-stretch h-auto gap-2 lg:w-72">
            {SETTINGS_TABS.map((tab) => (
              <TabsTrigger 
                key={tab.id}
                value={tab.id}
                className={cn(
                  "justify-start gap-4 h-14 px-6 bg-obsidian-2/50 border border-transparent data-[state=active]:border-gold/20 data-[state=active]:bg-gold/5 data-[state=active]:text-gold transition-all",
                  "text-ivory-3 font-bold uppercase tracking-widest text-[10px]"
                )}
              >
                <tab.icon size={18} />
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="flex-1 w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-8"
              >
                {/* Account Tab */}
                {activeTab === 'account' && (
                  <div className="space-y-8">
                    <Card className="bg-obsidian-2 border-border shadow-large">
                      <CardHeader>
                        <CardTitle className="text-2xl text-gold">Profile Identity</CardTitle>
                        <CardDescription className="text-ivory-4">Public-facing information for the fashion community.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-2">
                            <Label className="text-[10px] uppercase font-bold text-gold tracking-widest">Full Name</Label>
                            <Input defaultValue={profile?.full_name || 'Ananya Sharma'} className="bg-obsidian-3 border-gold/10" />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[10px] uppercase font-bold text-gold tracking-widest">Username</Label>
                            <Input defaultValue={profile?.username || 'ananya_style'} className="bg-obsidian-3 border-gold/10" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] uppercase font-bold text-gold tracking-widest">Bio (Max 150 chars)</Label>
                          <textarea className="w-full min-h-[100px] bg-obsidian-3 border border-gold/10 rounded-md p-4 text-sm resize-none outline-none focus:border-gold" defaultValue={profile?.bio || 'Minimalist, loves handloom, based in Bangalore.'}></textarea>
                        </div>
                        <Button className="bg-gold text-obsidian font-bold uppercase tracking-widest text-xs h-12 px-8">Save Changes</Button>
                      </CardContent>
                    </Card>

                    <Card className="bg-rose/5 border-rose/20">
                      <CardHeader>
                        <CardTitle className="text-xl text-rose">Danger Zone</CardTitle>
                        <CardDescription className="text-rose/60">Irreversible account actions.</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button variant="outline" className="border-rose/30 text-rose hover:bg-rose/10 uppercase tracking-widest text-[10px] font-bold">
                          Delete Account Permanently
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Security Tab */}
                {activeTab === 'security' && (
                  <div className="space-y-8">
                    <Card className="bg-obsidian-2 border-border">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-2xl text-gold">
                          <Lock size={24} /> Multi-Factor Authentication
                        </CardTitle>
                        <CardDescription className="text-ivory-4">Add an extra layer of protection to your silhouette data.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-8">
                        <div className="flex items-center justify-between p-6 bg-obsidian-3 rounded-xl border border-gold/10">
                          <div className="flex items-center gap-4">
                            <Smartphone className="text-gold" />
                            <div>
                              <p className="font-bold text-ivory">SMS Authentication</p>
                              <p className="text-xs text-ivory-4">Receive codes via text message.</p>
                            </div>
                          </div>
                          <Switch />
                        </div>
                        <div className="flex items-center justify-between p-6 bg-obsidian-3 rounded-xl border border-gold/10">
                          <div className="flex items-center gap-4">
                            <Shield className="text-gold" />
                            <div>
                              <p className="font-bold text-ivory">Authenticator App</p>
                              <p className="text-xs text-ivory-4">Use Google Authenticator or Authy.</p>
                            </div>
                          </div>
                          <Switch defaultChecked />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-obsidian-2 border-border">
                      <CardHeader>
                        <CardTitle className="text-xl text-gold">Active Sessions</CardTitle>
                        <CardDescription className="text-ivory-4">Devices currently logged into your atelier.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {[
                          { device: 'iPhone 15 Pro', location: 'Bangalore, India', status: 'Current Session' },
                          { device: 'MacBook Pro 16"', location: 'Mumbai, India', status: '3 hours ago' },
                        ].map((s, i) => (
                          <div key={i} className="flex items-center justify-between p-4 bg-obsidian-3/50 border border-border rounded-lg">
                            <div>
                              <p className="text-sm font-bold text-ivory">{s.device}</p>
                              <p className="text-[10px] text-ivory-4 uppercase tracking-widest">{s.location} • {s.status}</p>
                            </div>
                            <Button variant="ghost" className="text-rose uppercase text-[10px] font-bold">Revoke</Button>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Notifications Tab */}
                {activeTab === 'notifications' && (
                  <Card className="bg-obsidian-2 border-border">
                    <CardHeader>
                      <CardTitle className="text-2xl text-gold">Communication Flow</CardTitle>
                      <CardDescription className="text-ivory-4">Choose how the atelier reaches you.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                      {[
                        { title: 'Price Drop Alerts', desc: 'Instant push when your favorites drop in price.', icon: Zap },
                        { title: 'New Outfit Matches', desc: 'Weekly roundup of recommendations for your body type.', icon: Shirt },
                        { title: 'Style Journal', desc: 'Monthly editorial trends and expert styling tips.', icon: Globe },
                        { title: 'Account Security', desc: 'Login alerts and critical updates (Always ON).', icon: ShieldCheck, locked: true },
                      ].map((n, i) => (
                        <div key={i} className="flex items-center justify-between group">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-gold/5 border border-gold/10 flex items-center justify-center text-gold">
                              <n.icon size={20} />
                            </div>
                            <div>
                              <p className="font-bold text-ivory">{n.title}</p>
                              <p className="text-xs text-ivory-4">{n.desc}</p>
                            </div>
                          </div>
                          <Switch defaultChecked={!n.locked} disabled={n.locked} />
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* Privacy Tab */}
                {activeTab === 'privacy' && (
                  <Card className="bg-obsidian-2 border-border">
                    <CardHeader>
                      <CardTitle className="text-2xl text-gold">Data Atelier</CardTitle>
                      <CardDescription className="text-ivory-4">Manage your digital silhouette and processing preferences.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                      <div className="space-y-4">
                        <Button variant="outline" className="w-full justify-between h-14 border-gold/10 hover:border-gold/30">
                          <span className="flex items-center gap-3 font-bold uppercase tracking-widest text-[10px]">
                            <Database size={16} className="text-gold" /> Download My Style Data (JSON)
                          </span>
                          <ChevronRight size={16} className="text-gold" />
                        </Button>
                        <Button variant="outline" className="w-full justify-between h-14 border-gold/10 hover:border-gold/30">
                          <span className="flex items-center gap-3 font-bold uppercase tracking-widest text-[10px]">
                            <Activity size={16} className="text-gold" /> Purge Analysis History
                          </span>
                          <ChevronRight size={16} className="text-gold" />
                        </Button>
                      </div>
                      <Separator className="bg-gold/5" />
                      <div className="flex items-center justify-between">
                         <div className="space-y-0.5">
                           <p className="font-bold text-ivory">Allow Anonymous Research</p>
                           <p className="text-xs text-ivory-4 max-w-sm">Help our AI engineers improve Indian silhouette mapping accuracy.</p>
                         </div>
                         <Switch defaultChecked />
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Billing Tab */}
                {activeTab === 'billing' && (
                  <div className="space-y-8">
                    <Card className="bg-gold/5 border-gold/20 relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-8 opacity-5">
                         <Zap size={150} className="text-gold" />
                       </div>
                       <CardHeader>
                         <CardTitle className="text-2xl text-gold">Membership Tier</CardTitle>
                         <CardDescription className="text-gold/60 uppercase tracking-widest text-[10px] font-bold">{role === 'pro' ? 'Elite Pro Member' : 'Free Stylist'}</CardDescription>
                       </CardHeader>
                       <CardContent className="space-y-6">
                         {role === 'pro' ? (
                           <div className="space-y-4">
                             <p className="text-ivory-2">Your next billing cycle is on Feb 12, 2025.</p>
                             <Button className="bg-gold text-obsidian font-bold h-12 px-8">Manage via Razorpay</Button>
                           </div>
                         ) : (
                           <div className="space-y-4">
                             <p className="text-ivory-2 max-w-sm">Unlock unlimited analyses, Meesho results, and real-time price monitoring.</p>
                             <Button className="bg-gold text-obsidian font-bold h-12 px-8">Upgrade to Pro</Button>
                           </div>
                         )}
                       </CardContent>
                    </Card>

                    <Card className="bg-obsidian-2 border-border">
                       <CardHeader><CardTitle className="text-lg">Recent Invoices</CardTitle></CardHeader>
                       <CardContent>
                          <div className="text-center py-12 text-ivory-4">
                            <Activity size={40} className="mx-auto mb-4 opacity-10" />
                            <p className="text-xs uppercase tracking-widest font-bold">No billing history yet.</p>
                          </div>
                       </CardContent>
                    </Card>
                  </div>
                )}
                
                {/* Fallback for other tabs */}
                {['integrations', 'prefs', 'help'].includes(activeTab) && (
                  <Card className="bg-obsidian-2 border-border p-20 text-center space-y-4">
                    <HelpCircle size={48} className="mx-auto text-gold/20" />
                    <h3 className="text-xl font-headline text-gold">Tab Under Construction</h3>
                    <p className="text-ivory-4 text-xs uppercase tracking-widest font-bold">This settings module will be available in v1.1</p>
                  </Card>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </Tabs>
      </div>
    </div>
  );
}