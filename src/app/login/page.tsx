'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  Check, 
  X, 
  ArrowRight, 
  ChevronLeft,
  Loader2,
  Camera,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { DrapeLogo } from '@/components/drape-logo';
import HeroCanvas from '@/components/hero/HeroCanvas';
import { 
  signInWithEmail, 
  signUpWithEmail, 
  signInSocial, 
  sendPasswordReset, 
  mapAuthError 
} from '@/lib/auth';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { cn } from '@/lib/utils';

type AuthView = 'signin' | 'signup' | 'forgot' | 'success';

function LoginPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const redirect = searchParams.get('redirect') || '/analyze';

  const [view, setView] = useState<AuthView>('signin');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [countdown, setCountdown] = useState(4);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    rememberMe: true,
    terms: false,
    cookies: null as 'essential' | 'all' | null,
    marketing: false
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !loading && view !== 'success') {
      router.push(redirect);
    }
  }, [isAuthenticated, loading, router, redirect, view]);

  // Success Countdown
  useEffect(() => {
    if (view === 'success' && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (view === 'success' && countdown === 0) {
      router.push('/onboarding');
    }
  }, [view, countdown, router]);

  const validatePassword = (pass: string) => {
    return {
      length: pass.length >= 8,
      upper: /[A-Z]/.test(pass),
      number: /[0-9]/.test(pass),
      special: /[!@#$%^&*]/.test(pass)
    };
  };

  const passRules = validatePassword(formData.password);
  const isPassValid = Object.values(passRules).every(Boolean);
  const isSignupValid = formData.fullName && formData.email && isPassValid && formData.password === formData.confirmPassword && formData.terms && formData.cookies;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await signInWithEmail(formData.email, formData.password);
      router.push(redirect);
    } catch (err: any) {
      setError(mapAuthError(err.code));
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSignupValid) return;
    setLoading(true);
    setError(null);
    try {
      await signUpWithEmail(formData.email, formData.password, formData.fullName);
      setView('success');
    } catch (err: any) {
      setError(mapAuthError(err.code));
      setLoading(false);
    }
  };

  const handleSocial = async (provider: 'google' | 'apple') => {
    setLoading(true);
    setError(null);
    try {
      await signInSocial(provider);
      router.push(redirect);
    } catch (err: any) {
      setError(mapAuthError(err.code));
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-obsidian flex flex-col items-center justify-center">
        <DrapeLogo className="scale-150 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-obsidian overflow-hidden">
      {/* Left Column - Visual Engine */}
      <div className="hidden md:flex flex-[0.55] relative bg-black items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <HeroCanvas />
        </div>
        <div className="relative z-10 text-center space-y-6 px-12 max-w-xl pointer-events-none">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl font-headline text-ivory leading-tight"
          >
            Your Style. <br />
            <span className="italic text-gold">Elevated.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gold/60 text-lg tracking-wide"
          >
            Join 50,000+ Indians discovering their perfect silhouette with Atelier Intelligence.
          </motion.p>
        </div>

        {/* Testimonial Card */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="absolute bottom-12 left-12 p-8 bg-obsidian/40 backdrop-blur-xl border border-gold/10 rounded-2xl max-w-sm"
        >
          <div className="flex gap-1 mb-4 text-gold">
            {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
          </div>
          <p className="text-ivory-2 italic text-sm leading-relaxed mb-6">
            "The AI understood my pear shape better than any stylist I{"'"}ve ever visited. The results are truly high-fashion."
          </p>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold text-xs font-bold">PK</div>
            <div>
              <p className="text-xs font-bold text-ivory uppercase tracking-widest">Priya K.</p>
              <p className="text-[10px] text-ivory-4 uppercase">Mumbai, India</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Column - Auth Form */}
      <div className="flex-1 md:flex-[0.45] bg-[#0D0D14] border-l border-gold/5 flex flex-col justify-center p-8 md:p-24 relative overflow-y-auto">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
        
        {/* Mobile Header */}
        <div className="md:hidden flex justify-center mb-12">
          <DrapeLogo className="scale-125" />
        </div>

        <div className="max-w-md w-full mx-auto space-y-10">
          <AnimatePresence mode="wait">
            {view === 'success' ? (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-8"
              >
                <div className="relative w-24 h-24 mx-auto">
                   <motion.div 
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    className="w-full h-full rounded-full border-4 border-gold/20 flex items-center justify-center text-gold"
                   >
                     <Check size={48} strokeWidth={3} />
                   </motion.div>
                   <motion.div 
                    animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute inset-0 bg-gold/10 rounded-full"
                   />
                </div>
                <div className="space-y-2">
                  <h2 className="text-4xl font-headline text-gold">Welcome to DRAPE AI!</h2>
                  <p className="text-ivory-3">Your account is ready, {formData.fullName.split(' ')[0]}.</p>
                </div>

                <div className="p-8 bg-obsidian-2 rounded-2xl border border-gold/5 space-y-4">
                  <div className="w-20 h-20 rounded-full bg-gold/10 mx-auto flex items-center justify-center text-gold border-2 border-dashed border-gold/30 cursor-pointer hover:bg-gold/20 transition-all">
                    <Camera size={32} />
                  </div>
                  <p className="text-xs font-bold text-gold uppercase tracking-widest">Add photo (optional)</p>
                </div>

                <div className="space-y-4">
                  <Button asChild className="w-full h-14 bg-gold text-obsidian font-bold tracking-widest text-lg shadow-gold">
                    <Link href="/onboarding">Build My Style Profile</Link>
                  </Button>
                  <p className="text-xs text-ivory-4 font-bold uppercase tracking-widest">Redirecting in {countdown}...</p>
                </div>
              </motion.div>
            ) : view === 'forgot' ? (
              <motion.div 
                key="forgot"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="space-y-8"
              >
                <button onClick={() => setView('signin')} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-ivory-4 hover:text-gold transition-colors">
                  <ChevronLeft size={16} /> Back to Sign In
                </button>
                <div className="space-y-2">
                  <h2 className="text-4xl font-headline text-gold">Reset Password</h2>
                  <p className="text-sm text-ivory-3 leading-relaxed">Enter your email and we{"'"}ll send you a link to restore access to your atelier.</p>
                </div>
                <form className="space-y-6">
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/40 group-focus-within:text-gold transition-colors" size={18} />
                    <input 
                      type="email" 
                      placeholder="Email Identity"
                      className="w-full h-14 bg-white/5 border border-gold/15 rounded-xl pl-12 pr-4 text-ivory outline-none focus:border-gold transition-all"
                    />
                  </div>
                  <Button className="w-full h-14 bg-gold text-obsidian font-bold tracking-widest uppercase">Send Reset Link</Button>
                </form>
              </motion.div>
            ) : (
              <motion.div 
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-10"
              >
                <div className="text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                    <span className="text-3xl font-headline text-gold font-bold tracking-widest">DRAPE</span>
                    <span className="text-xs font-bold text-ivory uppercase tracking-widest border border-ivory/20 px-2 rounded mt-1">AI</span>
                  </div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-ivory-4">AI Personal Stylist</p>
                </div>

                {/* Tab Switcher */}
                <div className="p-1 bg-obsidian-2 border border-gold/10 rounded-full flex relative overflow-hidden">
                   <motion.div 
                    layoutId="tab-indicator"
                    className="absolute inset-y-1 w-1/2 bg-gold rounded-full"
                    animate={{ x: view === 'signin' ? 0 : '100%' }}
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                   />
                   <button 
                    onClick={() => setView('signin')}
                    className={cn("flex-1 h-10 rounded-full text-xs font-bold uppercase tracking-widest relative z-10 transition-colors", view === 'signin' ? "text-obsidian" : "text-ivory-4")}
                   >
                     Sign In
                   </button>
                   <button 
                    onClick={() => setView('signup')}
                    className={cn("flex-1 h-10 rounded-full text-xs font-bold uppercase tracking-widest relative z-10 transition-colors", view === 'signup' ? "text-obsidian" : "text-ivory-4")}
                   >
                     Join
                   </button>
                </div>

                <div className="space-y-6">
                  {/* Social Buttons */}
                  <div className="grid grid-cols-1 gap-4">
                    <button 
                      onClick={() => handleSocial('google')}
                      className="h-12 flex items-center justify-center gap-3 bg-white/5 border border-white/10 rounded-xl text-ivory font-medium hover:bg-white/10 transition-all active:scale-[0.98]"
                    >
                      <svg viewBox="0 0 24 24" className="w-5 h-5">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                      </svg>
                      Continue with Google
                    </button>
                    <button 
                      onClick={() => handleSocial('apple')}
                      className="h-12 flex items-center justify-center gap-3 bg-white/5 border border-white/10 rounded-xl text-ivory font-medium hover:bg-white/10 transition-all active:scale-[0.98]"
                    >
                      <svg viewBox="0 0 256 315" className="w-5 h-5 fill-current">
                        <path d="M213.803 167.03c.442 47.58 41.74 63.413 42.147 63.615-.35 1.116-6.599 22.563-22.181 45.317-13.46 19.666-27.428 39.232-49.333 39.632-21.524.397-28.46-12.753-53.04-12.753-24.582 0-32.224 12.355-52.646 13.152-20.023.793-36.216-21.547-49.803-41.222-27.783-40.237-49.034-113.732-20.354-163.454 14.24-24.7 39.633-40.357 67.228-40.754 21.134-.397 41.05 14.237 54.004 14.237 12.955 0 37.19-17.518 62.77-15.02 10.724.444 40.89 4.316 60.25 32.65-1.564 1.01-35.918 20.88-35.918 62.062zM176.24 74.28c11.391-13.801 19.066-32.99 16.966-52.128-16.42.664-36.31 10.936-48.083 24.71-10.562 12.28-19.82 31.76-17.33 50.533 18.312 1.417 37.056-9.313 48.447-23.115z" />
                      </svg>
                      Continue with Apple
                    </button>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-px bg-gold/10" />
                    <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-ivory-4">Or with Email</span>
                    <div className="flex-1 h-px bg-gold/10" />
                  </div>

                  <form onSubmit={view === 'signin' ? handleSignIn : handleSignUp} className="space-y-4">
                    <AnimatePresence mode="wait">
                      {view === 'signup' && (
                        <motion.div 
                          key="signup-fields"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="space-y-4 overflow-hidden"
                        >
                          <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/40 group-focus-within:text-gold transition-colors" size={18} />
                            <input 
                              type="text" 
                              required
                              placeholder="Full Name"
                              value={formData.fullName}
                              onChange={e => setFormData({...formData, fullName: e.target.value})}
                              className="w-full h-14 bg-white/5 border border-gold/15 rounded-xl pl-12 pr-4 text-ivory outline-none focus:border-gold transition-all"
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/40 group-focus-within:text-gold transition-colors" size={18} />
                      <input 
                        type="email" 
                        required
                        placeholder="Email Identity"
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        className="w-full h-14 bg-white/5 border border-gold/15 rounded-xl pl-12 pr-4 text-ivory outline-none focus:border-gold transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/40 group-focus-within:text-gold transition-colors" size={18} />
                        <input 
                          type={showPassword ? "text" : "password"} 
                          required
                          placeholder="Secret Phrase"
                          value={formData.password}
                          onChange={e => setFormData({...formData, password: e.target.value})}
                          className="w-full h-14 bg-white/5 border border-gold/15 rounded-xl pl-12 pr-12 text-ivory outline-none focus:border-gold transition-all"
                        />
                        <button 
                          type="button" 
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-ivory-4 hover:text-gold transition-colors"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>

                      {view === 'signup' && formData.password && (
                        <div className="space-y-4 pt-2">
                          <div className="flex gap-1 h-1.5">
                            {[...Array(4)].map((_, i) => (
                              <div 
                                key={i} 
                                className={cn(
                                  "flex-1 rounded-full transition-all duration-500",
                                  i === 0 && passRules.length ? "bg-red-500" :
                                  i === 1 && passRules.upper ? "bg-orange-500" :
                                  i === 2 && passRules.number ? "bg-yellow-500" :
                                  i === 3 && passRules.special ? "bg-gold" : "bg-white/5"
                                )}
                              />
                            ))}
                          </div>
                          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                            {[
                              { label: '8+ chars', met: passRules.length },
                              { label: 'Uppercase', met: passRules.upper },
                              { label: 'Number', met: passRules.number },
                              { label: 'Symbol', met: passRules.special }
                            ].map((r, i) => (
                              <div key={i} className="flex items-center gap-2">
                                <div className={cn("w-3.5 h-3.5 rounded-full flex items-center justify-center border transition-colors", r.met ? "bg-gold border-gold" : "border-white/10")}>
                                  {r.met && <Check size={8} className="text-obsidian" strokeWidth={4} />}
                                </div>
                                <span className={cn("text-[10px] uppercase font-bold", r.met ? "text-ivory" : "text-ivory-4")}>{r.label}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between py-2">
                      {view === 'signin' ? (
                        <>
                          <div className="flex items-center gap-2">
                            <Checkbox id="remember" checked={formData.rememberMe} onCheckedChange={v => setFormData({...formData, rememberMe: !!v})} className="border-gold/20 data-[state=checked]:bg-gold" />
                            <label htmlFor="remember" className="text-xs text-ivory-3 cursor-pointer">Remember me</label>
                          </div>
                          <button type="button" onClick={() => setView('forgot')} className="text-xs font-bold text-gold hover:underline">Forgot phrase?</button>
                        </>
                      ) : (
                        <div className="relative group w-full">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/40 group-focus-within:text-gold transition-colors" size={18} />
                          <input 
                            type="password" 
                            required
                            placeholder="Confirm Phrase"
                            value={formData.confirmPassword}
                            onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                            className={cn(
                              "w-full h-14 bg-white/5 border rounded-xl pl-12 pr-4 text-ivory outline-none transition-all",
                              formData.confirmPassword ? (formData.password === formData.confirmPassword ? "border-green-500/50" : "border-red-500/50") : "border-gold/15"
                            )}
                          />
                        </div>
                      )}
                    </div>

                    {view === 'signup' && (
                      <div className="space-y-4 pt-4 border-t border-gold/5">
                        <div className="flex items-start gap-3">
                          <Checkbox id="terms" checked={formData.terms} onCheckedChange={v => setFormData({...formData, terms: !!v})} className="mt-0.5" />
                          <label htmlFor="terms" className="text-[11px] text-ivory-3 leading-tight">
                            I agree to the <Link href="/privacy-policy" target="_blank" className="text-gold underline">Privacy Policy</Link> and <Link href="/terms" target="_blank" className="text-gold underline">Terms of Service</Link>
                          </label>
                        </div>
                        <div className="space-y-3">
                           <p className="text-[10px] font-bold uppercase tracking-widest text-ivory-4">Cookie Consent</p>
                           <div className="flex gap-2">
                              {['essential', 'all'].map((type) => (
                                <button 
                                  key={type}
                                  type="button"
                                  onClick={() => setFormData({...formData, cookies: type as any})}
                                  className={cn(
                                    "flex-1 py-2 rounded-full border text-[10px] font-bold uppercase tracking-widest transition-all",
                                    formData.cookies === type ? "bg-gold/10 border-gold text-gold" : "border-white/10 text-ivory-4 hover:border-gold/30"
                                  )}
                                >
                                  {type === 'essential' ? 'Essential Only' : 'Accept All'}
                                </button>
                              ))}
                           </div>
                        </div>
                      </div>
                    )}

                    {error && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                        className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-500 text-xs font-medium"
                      >
                        <X size={14} /> {error}
                      </motion.div>
                    )}

                    <Button 
                      disabled={loading || (view === 'signup' && !isSignupValid)}
                      className="w-full h-14 mt-6 bg-gradient-to-r from-gold to-gold-light text-obsidian font-bold tracking-[0.1em] text-sm hover:glow-gold transition-all active:scale-[0.99]"
                    >
                      {loading ? <Loader2 className="animate-spin" /> : view === 'signin' ? 'Sign In to DRAPE AI' : 'Create My Style Account'}
                    </Button>
                  </form>
                </div>

                <div className="text-center">
                  <button 
                    onClick={() => setView(view === 'signin' ? 'signup' : 'signin')}
                    className="text-xs text-ivory-3"
                  >
                    {view === 'signin' ? "Don't have an account?" : "Already have an account?"} <span className="text-gold font-bold hover:underline">{view === 'signin' ? "Create one free →" : "Sign in →"}</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-auto pt-12 text-center">
           <p className="text-[8px] uppercase tracking-[0.5em] text-ivory-4">DRAPE AI • DATA PRIVACY CERTIFIED • ISO 27001</p>
        </div>
      </div>
    </div>
  );
}

import{Suspense}from'react';
export default function LoginPage(){
return(<Suspense fallback={<div style={{minHeight:'100vh',background:'#0A0A0F'}}/>}><LoginPageInner/></Suspense>);
}