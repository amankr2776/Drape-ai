'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Shield, 
  Bell, 
  Lock, 
  CreditCard, 
  Link as LinkIcon, 
  Settings, 
  HelpCircle,
  Search,
  CheckCircle2,
  Trash2,
  Download,
  AlertTriangle,
  Smartphone,
  ChevronRight,
  Monitor
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const TABS = [
  { id: 'account', label: 'Account', icon: User },
  { id: 'security', label: 'Security', icon: Lock },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'privacy', label: 'Privacy & Data', icon: Shield },
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'integrations', label: 'Integrations', icon: LinkIcon },
  { id: 'preferences', label: 'App Preferences', icon: Settings },
  { id: 'support', label: 'Help & Support', icon: HelpCircle },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('account');
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Settings Synchronized",
      description: "Your atelier preferences have been updated globally.",
    });
  };

  return (
    <div className="page-wrapper min-h-screen bg-background">
      <div className="page-content py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar */}
          <aside className="lg:w-64 space-y-8">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40 group-focus-within:text-gold transition-colors" />
              <Input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search settings..." 
                className="pl-10 h-10 bg-obsidian-2 border-border text-sm"
              />
            </div>
            
            <nav className="space-y-1">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                    activeTab === tab.id 
                      ? "bg-primary/10 text-primary border border-primary/20 shadow-gold-glow" 
                      : "text-foreground/40 hover:text-foreground hover:bg-obsidian-2"
                  )}
                >
                  <tab.icon size={18} />
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div layoutId="tab-active" className="ml-auto w-1 h-4 bg-primary rounded-full" />
                  )}
                </button>
              ))}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 max-w-3xl space-y-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'account' && (
                  <div className="space-y-8">
                    <header>
                      <h2 className="text-3xl font-headline text-gold">Account Essentials</h2>
                      <p className="text-sm text-foreground/40">Manage your identity and atelier credentials.</p>
                    </header>
                    
                    <Card className="bg-obsidian-2 border-border overflow-hidden">
                      <CardContent className="p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label className="text-xs uppercase tracking-widest text-foreground/50">Full Name</Label>
                            <Input defaultValue="Ananya Sharma" className="bg-obsidian-3" />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs uppercase tracking-widest text-foreground/50">Username</Label>
                            <Input defaultValue="@ananya_style" className="bg-obsidian-3" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs uppercase tracking-widest text-foreground/50">Email Address</Label>
                          <div className="flex gap-2">
                            <Input defaultValue="ananya.s@example.com" disabled className="bg-obsidian-3 opacity-50" />
                            <Badge variant="outline" className="bg-success/10 text-success border-success/20">Verified</Badge>
                          </div>
                        </div>
                        <Button onClick={handleSave} className="w-full bg-primary text-primary-foreground font-headline text-lg h-12">
                          Save Changes
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="bg-obsidian-2 border-border overflow-hidden">
                      <CardHeader className="bg-obsidian-3/50">
                        <CardTitle className="text-lg">Change Password</CardTitle>
                      </CardHeader>
                      <CardContent className="p-8 space-y-4">
                        <div className="space-y-2">
                          <Label className="text-xs uppercase tracking-widest text-foreground/50">Current Password</Label>
                          <Input type="password" underline="false" className="bg-obsidian-3" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs uppercase tracking-widest text-foreground/50">New Password</Label>
                          <Input type="password" underline="false" className="bg-obsidian-3" />
                        </div>
                        <Button variant="outline" className="w-full border-primary/20">Update Password</Button>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {activeTab === 'security' && (
                  <div className="space-y-8">
                    <header>
                      <h2 className="text-3xl font-headline text-gold">Security Shield</h2>
                      <p className="text-sm text-foreground/40">Enhanced protection for your silhouette data.</p>
                    </header>

                    <Card className="bg-obsidian-2 border-border overflow-hidden">
                      <CardContent className="p-8 space-y-6">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <h4 className="font-bold">Two-Factor Authentication</h4>
                            <p className="text-xs text-foreground/40">Protect your account with a secondary verification code.</p>
                          </div>
                          <Switch />
                        </div>
                        <Separator className="bg-border" />
                        <div className="space-y-4">
                          <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-primary">Active Sessions</h4>
                          <div className="space-y-3">
                            {[
                              { device: 'iPhone 15 Pro', location: 'Bangalore, India', active: 'Current Session', icon: Smartphone },
                              { device: 'MacBook Pro 16"', location: 'Mumbai, India', active: 'Last active 2h ago', icon: Monitor }
                            ].map((session, i) => (
                              <div key={i} className="flex items-center gap-4 p-4 bg-obsidian-3 rounded-xl border border-border">
                                <session.icon size={20} className="text-primary" />
                                <div className="flex-1">
                                  <p className="text-sm font-bold">{session.device}</p>
                                  <p className="text-[10px] text-foreground/40 uppercase tracking-widest">{session.location} · {session.active}</p>
                                </div>
                                <Button variant="ghost" size="sm" className="text-rose text-xs h-8">Revoke</Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {activeTab === 'privacy' && (
                  <div className="space-y-8">
                    <header>
                      <h2 className="text-3xl font-headline text-gold">Privacy & Data</h2>
                      <p className="text-sm text-foreground/40">You control your digital silhouette.</p>
                    </header>

                    <Card className="bg-obsidian-2 border-border">
                      <CardContent className="p-8 space-y-6">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <h4 className="font-bold">Anonymized Analysis</h4>
                            <p className="text-xs text-foreground/40">Strip all personal metadata before AI processing.</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <Separator className="bg-border" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Button variant="outline" className="h-12 border-primary/20">
                            <Download className="w-4 h-4 mr-2" /> Export All Data
                          </Button>
                          <Button variant="outline" className="h-12 border-rose/20 text-rose hover:bg-rose/5">
                            <Trash2 className="w-4 h-4 mr-2" /> Delete History
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="p-8 rounded-[24px] bg-rose/5 border-2 border-dashed border-rose/20 space-y-6">
                      <div className="flex items-center gap-4">
                        <AlertTriangle className="text-rose" size={32} />
                        <div className="space-y-1">
                          <h4 className="text-xl font-headline text-rose">Danger Zone</h4>
                          <p className="text-xs text-rose/60 uppercase tracking-widest font-bold">Account Deletion is Permanent</p>
                        </div>
                      </div>
                      <Button className="w-full bg-rose text-white h-12 hover:bg-rose-dim">
                        Delete My Style Identity
                      </Button>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}