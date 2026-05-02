'use client';

import { useState, useEffect } from 'react';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger,
  SheetClose
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff, Mail, Lock, CheckCircle2, X, ArrowLeft, Loader2, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFirebase } from '@/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  sendPasswordResetEmail,
  updateProfile,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence
} from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { DrapeLogo } from '@/components/drape-logo';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export function AuthDrawer({ children }: { children: React.ReactNode }) {
  const { auth, googleProvider } = useFirebase();
  const { toast } = useToast();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<'auth' | 'forgot-password' | 'success'>('auth');
  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    rememberMe: true,
    agreeTerms: false,
    cookieConsent: null as 'all' | 'essential' | null,
    allowNotifications: false
  });

  // Password Validation
  const passwordValidation = {
    length: formData.password.length >= 8,
    uppercase: /[A-Z]/.test(formData.password),
    number: /[0-9]/.test(formData.password),
    special: /[!@#$%^&*]/.test(formData.password),
  };

  const isSignupValid = 
    formData.fullName && 
    formData.email && 
    passwordValidation.length && 
    passwordValidation.uppercase && 
    passwordValidation.number && 
    passwordValidation.special && 
    formData.password === formData.confirmPassword && 
    formData.agreeTerms && 
    formData.cookieConsent !== null;

  const isLoginValid = formData.email && formData.password;

  const handleAuthError = (err: any) => {
    console.error(err);
    if (err.code === 'auth/wrong-password') {
      setError('Incorrect password. Try again or reset it.');
    } else if (err.code === 'auth/user-not-found') {
      setError('No account found with this email.');
    } else if (err.code === 'auth/email-already-in-use') {
      setError('An account with this email already exists.');
    } else if (err.code === 'auth/popup-blocked') {
      setError('Popup was blocked. Please allow popups for this site.');
    } else {
      setError('Connection issue. Please check your internet and try again.');
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSignupValid) return;
    setIsLoading(true);
    setError(null);

    try {
      await setPersistence(auth, formData.rememberMe ? browserLocalPersistence : browserSessionPersistence);
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      await updateProfile(userCredential.user, { displayName: formData.fullName });
      
      // Save cookie consent
      localStorage.setItem('cookie_consent', formData.cookieConsent!);
      
      setView('success');
      setTimeout(() => {
        setIsOpen(false);
        router.push('/onboarding');
      }, 2500);
    } catch (err) {
      handleAuthError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoginValid) return;
    setIsLoading(true);
    setError(null);

    try {
      await setPersistence(auth, formData.rememberMe ? browserLocalPersistence : browserSessionPersistence);
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      setIsOpen(false);
      router.push('/analyze');
    } catch (err) {
      handleAuthError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      // For Google, we still need terms agreement if new user
      // Simplified for prototype: always close and route
      setIsOpen(false);
      router.push('/onboarding');
    } catch (err) {
      handleAuthError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, formData.email);
      toast({ title: "Reset Link Sent", description: "Check your inbox for password reset instructions." });
      setView('auth');
    } catch (err) {
      handleAuthError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-[420px] bg-background border-l border-primary/20 p-0 overflow-hidden flex flex-col">
        <SheetHeader className="sr-only">
          <SheetTitle>Authentication</SheetTitle>
        </SheetHeader>
        <div className="absolute top-0 left-0 w-1 h-full bg-primary z-50" />
        
        <div className="p-8 flex-grow overflow-y-auto">
          <AnimatePresence mode="wait">
            {view === 'success' && (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center text-center space-y-8"
              >
                <div className="relative">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 12 }}
                    className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center text-primary"
                  >
                    <CheckCircle2 size={48} />
                  </motion.div>
                  <motion.div 
                    animate={{ scale: [1, 1.5], opacity: [1, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="absolute inset-0 bg-primary/20 rounded-full"
                  />
                </div>
                <div className="space-y-2">
                  <h2 className="text-4xl font-headline text-primary">Welcome to the Atelier</h2>
                  <p className="text-foreground/60">Welcome to DRAPE AI, {formData.fullName.split(' ')[0]}!</p>
                </div>
                <Button className="w-full h-14 font-headline text-xl" onClick={() => router.push('/onboarding')}>
                  Let{"'"}s build your style profile {'->'}
                </Button>
              </motion.div>
            )}

            {view === 'forgot-password' && (
              <motion.div 
                key="forgot"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -50, opacity: 0 }}
                className="space-y-8"
              >
                <button onClick={() => setView('auth')} className="flex items-center text-xs uppercase tracking-widest text-foreground/40 hover:text-primary transition-colors">
                  <ArrowLeft size={14} className="mr-2" /> Back to Login
                </button>
                <div className="space-y-2">
                  <h2 className="text-4xl font-headline text-primary">Reset Password</h2>
                  <p className="text-sm text-foreground/60">Enter your email and we{"'"}ll send you a link to reset your password.</p>
                </div>
                <form onSubmit={handleForgotPassword} className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-widest text-foreground/50">Email Address</Label>
                    <Input 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="email@example.com" 
                      className="h-12 bg-card/50 border-primary/10" 
                      required 
                    />
                  </div>
                  <Button disabled={isLoading} className="w-full h-12 font-headline tracking-widest">
                    {isLoading ? <Loader2 className="animate-spin" /> : 'Send Reset Link'}
                  </Button>
                </form>
              </motion.div>
            )}

            {view === 'auth' && (
              <motion.div 
                key="auth"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-8"
              >
                <div className="flex justify-center">
                  <DrapeLogo className="scale-125" />
                </div>

                <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="space-y-8">
                  <TabsList className="grid w-full grid-cols-2 bg-card/30 border border-primary/10">
                    <TabsTrigger value="login" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-headline tracking-widest uppercase text-xs">Login</TabsTrigger>
                    <TabsTrigger value="signup" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-headline tracking-widest uppercase text-xs">Join</TabsTrigger>
                  </TabsList>

                  <div className="space-y-6">
                    <Button 
                      variant="outline" 
                      onClick={handleGoogleAuth}
                      disabled={isLoading}
                      className="w-full h-12 bg-white text-black hover:bg-white/90 border-none gap-3 font-bold"
                    >
                      <svg viewBox="0 0 24 24" className="w-5 h-5">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                      </svg>
                      Continue with Google
                    </Button>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-primary/10" /></div>
                      <div className="relative flex justify-center text-[10px] uppercase tracking-widest"><span className="bg-background px-4 text-foreground/40 font-bold">Or continue with Email</span></div>
                    </div>

                    {error && (
                      <div className="p-3 rounded bg-accent/10 border border-accent/20 text-accent text-xs flex items-center gap-2">
                        <X size={14} /> {error}
                      </div>
                    )}

                    <TabsContent value="login" className="space-y-6 mt-0">
                      <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-xs uppercase tracking-widest text-foreground/50">Email Address</Label>
                          <Input 
                            type="email" 
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            placeholder="email@example.com" 
                            className="h-12 bg-card/50 border-primary/10" 
                            required 
                          />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <Label className="text-xs uppercase tracking-widest text-foreground/50">Password</Label>
                            <button type="button" onClick={() => setView('forgot-password')} className="text-xs text-primary hover:underline font-bold">Forgot?</button>
                          </div>
                          <div className="relative">
                            <Input 
                              type={showPassword ? "text" : "password"} 
                              value={formData.password}
                              onChange={(e) => setFormData({...formData, password: e.target.value})}
                              className="h-12 bg-card/50 border-primary/10 pr-10" 
                              required 
                            />
                            <button 
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-primary/40 hover:text-primary"
                            >
                              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="remember" 
                            checked={formData.rememberMe}
                            onCheckedChange={(v) => setFormData({...formData, rememberMe: !!v})}
                          />
                          <label htmlFor="remember" className="text-xs text-foreground/60 leading-none cursor-pointer">Keep me logged in for 30 days</label>
                        </div>
                        <Button type="submit" disabled={isLoading || !isLoginValid} className="w-full h-14 mt-4 font-headline text-2xl tracking-widest">
                          {isLoading ? <Loader2 className="animate-spin" /> : 'Login to DRAPE AI'}
                        </Button>
                      </form>
                    </TabsContent>

                    <TabsContent value="signup" className="space-y-6 mt-0">
                      <form onSubmit={handleSignup} className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-xs uppercase tracking-widest text-foreground/50">Full Name</Label>
                          <Input 
                            value={formData.fullName}
                            onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                            placeholder="Your Identity" 
                            className="h-12 bg-card/50 border-primary/10" 
                            required 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs uppercase tracking-widest text-foreground/50">Email Address</Label>
                          <Input 
                            type="email" 
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            placeholder="email@example.com" 
                            className="h-12 bg-card/50 border-primary/10" 
                            required 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs uppercase tracking-widest text-foreground/50">Password</Label>
                          <div className="relative">
                            <Input 
                              type={showPassword ? "text" : "password"} 
                              value={formData.password}
                              onChange={(e) => setFormData({...formData, password: e.target.value})}
                              className="h-12 bg-card/50 border-primary/10 pr-10" 
                              required 
                            />
                            <button 
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-primary/40 hover:text-primary"
                            >
                              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                          
                          {/* Validation Checklist */}
                          <div className="grid grid-cols-2 gap-2 mt-4">
                            {[
                              { label: '8+ Characters', met: passwordValidation.length },
                              { label: 'One Uppercase', met: passwordValidation.uppercase },
                              { label: 'One Number', met: passwordValidation.number },
                              { label: 'Special Char', met: passwordValidation.special }
                            ].map((rule, i) => (
                              <div key={i} className="flex items-center gap-2">
                                {rule.met ? <CheckCircle2 size={12} className="text-primary" /> : <X size={12} className="text-foreground/20" />}
                                <span className={cn("text-[10px] uppercase font-bold", rule.met ? "text-primary" : "text-foreground/20")}>{rule.label}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-xs uppercase tracking-widest text-foreground/50">Confirm Password</Label>
                          <Input 
                            type="password" 
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                            className={cn(
                              "h-12 bg-card/50 border-primary/10",
                              formData.confirmPassword && (formData.password === formData.confirmPassword ? "border-green-500/50" : "border-accent/50")
                            )} 
                            required 
                          />
                        </div>

                        <div className="space-y-6 pt-4">
                          <div className="flex items-start space-x-3">
                            <Checkbox 
                              id="terms" 
                              checked={formData.agreeTerms}
                              onCheckedChange={(v) => setFormData({...formData, agreeTerms: !!v})}
                            />
                            <Label htmlFor="terms" className="text-[10px] leading-tight text-foreground/60 cursor-pointer">
                              I have read and agree to the <Link href="/privacy-policy" target="_blank" className="text-primary hover:underline">Privacy Policy</Link> and <Link href="/terms" target="_blank" className="text-primary hover:underline">Terms {'&'} Conditions</Link>
                            </Label>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-start space-x-3">
                              <Checkbox 
                                id="cookies" 
                                checked={formData.cookieConsent !== null}
                                onCheckedChange={() => {}} // Controlled by buttons
                              />
                              <Label htmlFor="cookies" className="text-[10px] leading-tight text-foreground/60">
                                I accept the use of cookies as described in our Cookie Policy
                              </Label>
                            </div>
                            <div className="flex gap-2 pl-7">
                              <button 
                                type="button"
                                onClick={() => setFormData({...formData, cookieConsent: 'all'})}
                                className={cn(
                                  "px-3 py-1.5 rounded-full border text-[9px] font-bold uppercase tracking-widest transition-all",
                                  formData.cookieConsent === 'all' ? "bg-primary text-primary-foreground border-primary" : "border-primary/20 text-primary/60 hover:border-primary/40"
                                )}
                              >
                                Accept All Cookies
                              </button>
                              <button 
                                type="button"
                                onClick={() => setFormData({...formData, cookieConsent: 'essential'})}
                                className={cn(
                                  "px-3 py-1.5 rounded-full border text-[9px] font-bold uppercase tracking-widest transition-all",
                                  formData.cookieConsent === 'essential' ? "bg-primary text-primary-foreground border-primary" : "border-primary/20 text-primary/60 hover:border-primary/40"
                                )}
                              >
                                Essential Only
                              </button>
                            </div>
                          </div>

                          <div className="flex items-start space-x-3">
                            <Checkbox 
                              id="notifications" 
                              checked={formData.allowNotifications}
                              onCheckedChange={(v) => setFormData({...formData, allowNotifications: !!v})}
                            />
                            <Label htmlFor="notifications" className="text-[10px] leading-tight text-foreground/60 cursor-pointer">
                              Allow notifications for price drops and style updates <span className="text-foreground/20 italic ml-1">(Optional)</span>
                            </Label>
                          </div>
                        </div>

                        <Button type="submit" disabled={isLoading || !isSignupValid} className="w-full h-14 mt-4 font-headline text-2xl tracking-widest">
                          {isLoading ? <Loader2 className="animate-spin" /> : 'Create My Style Account'}
                        </Button>
                      </form>
                    </TabsContent>
                  </div>
                </Tabs>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="p-4 border-t border-primary/5 text-center">
          <p className="text-[8px] uppercase tracking-[0.5em] text-foreground/20">DRAPE AI • DESIGNED IN INDIA • DATA PRIVACY CERTIFIED</p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
