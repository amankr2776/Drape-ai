'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Shield, 
  Bell, 
  CreditCard, 
  Database,
  Globe,
  HelpCircle,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Zap,
  Lock
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const SETTINGS_TABS = [
  { id: 'account', label: 'Account', icon: User },
  { id: 'security', label: 'Security', icon: ShieldCheck },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'privacy', label: 'Data Privacy', icon: Database },
  { id: 'prefs', label: 'Preferences', icon: Globe },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('account');

  return (
    <div className="page-content py-12 max-w-5xl">
      <header className="mb-12 space-y-2">
        <h1 className="text-4xl md:text-5xl font-headline">Atelier Settings</h1>
        <p className="text-foreground/40">Manage your identity and synchronize your style experience.</p>
      </header>

      <Tabs defaultValue="account" onValueChange={setActiveTab} className="flex flex-col lg:flex-row gap-12 items-start">
        <TabsList className="bg-transparent flex flex-col items-stretch h-auto gap-1 lg:w-64">
          {SETTINGS_TABS.map((tab) => (
            <TabsTrigger 
              key={tab.id}
              value={tab.id}
              className={cn(
                "justify-start gap-3 h-12 px-4 bg-transparent data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-standard",
                "text-foreground/40 font-medium"
              )}
            >
              <tab.icon size={18} />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="flex-1 w-full space-y-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <TabsContent value="account" className="mt-0 space-y-8">
                <Card className="glass-panel">
                  <CardHeader>
                    <CardTitle>Profile Details</CardTitle>
                    <CardDescription>Standard identity information for your style profile.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <Label className="text-xs uppercase tracking-widest text-foreground/40 font-bold">Full Name</Label>
                        <p className="text-lg font-medium">Ananya Sharma</p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs uppercase tracking-widest text-foreground/40 font-bold">Username</Label>
                        <p className="text-lg font-medium">@ananya_style</p>
                      </div>
                    </div>
                    <Separator className="bg-white/5" />
                    <Button variant="secondary">Edit Profile Information</Button>
                  </CardContent>
                </Card>

                <Card className="glass-panel border-rose/20 bg-rose/5">
                  <CardHeader>
                    <CardTitle className="text-rose">Danger Zone</CardTitle>
                    <CardDescription className="text-rose/60">Irreversible account actions.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="danger" className="w-full sm:w-auto">Delete Account Permanently</Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="mt-0 space-y-8">
                <Card className="glass-panel">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lock size={20} className="text-primary" />
                      Security Layer
                    </CardTitle>
                    <CardDescription>Protect your silhouette data and saved preferences.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Two-Factor Authentication</Label>
                        <p className="text-sm text-foreground/40">Secure your account with an extra verification code.</p>
                      </div>
                      <Switch />
                    </div>
                    <Separator className="bg-white/5" />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Login Alerts</Label>
                        <p className="text-sm text-foreground/40">Notify me via email when a new device accesses my atelier.</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <Button variant="secondary" className="w-full">Update Password</Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notifications" className="mt-0 space-y-8">
                <Card className="glass-panel">
                  <CardHeader>
                    <CardTitle>Communication Preferences</CardTitle>
                    <CardDescription>Manage how we notify you of price drops and style matches.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    {[
                      { label: 'Price Drop Alerts', desc: 'Notify when items in your plan decrease in price.' },
                      { label: 'Style Match Updates', desc: 'Weekly roundup of new outfits matching your body type.' },
                      { label: 'Editorial Digest', desc: 'Curated fashion news and trend reports.' }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>{item.label}</Label>
                          <p className="text-sm text-foreground/40">{item.desc}</p>
                        </div>
                        <Switch defaultChecked={i < 2} />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="billing" className="mt-0 space-y-8">
                <Card className="glass-panel border-primary/20 bg-primary/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap size={20} className="text-primary" />
                      Subscription Plan
                    </CardTitle>
                    <CardDescription>You are currently on the Free Tier.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <ul className="space-y-2 text-sm text-foreground/60">
                      <li className="flex items-center gap-2">✓ 3 analyses per month</li>
                      <li className="flex items-center gap-2">✓ Amazon & Flipkart integration</li>
                    </ul>
                    <Button className="w-full h-12 bg-primary text-obsidian font-bold">Upgrade to Elite Pro</Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="privacy" className="mt-0">
                <Card className="glass-panel">
                  <CardHeader>
                    <CardTitle>Data Management</CardTitle>
                    <CardDescription>Control your digital silhouette and preferences.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <Button variant="outline" className="w-full justify-between group">
                      Download My Data (JSON)
                      <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <Button variant="outline" className="w-full justify-between group">
                      Purge Analysis History
                      <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </div>
      </Tabs>
    </div>
  );
}