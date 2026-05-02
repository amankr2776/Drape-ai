'use client';

import { DrapeLogo } from '@/components/drape-logo';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Twitter, Instagram, Linkedin, Sun, Moon } from 'lucide-react';
import Marquee from '@/components/ui/marquee';
import { useState, useEffect } from 'react';

const Footer = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const saved = localStorage.getItem('drape_theme') as 'dark' | 'light';
    if (saved) {
      setTheme(saved);
      document.documentElement.setAttribute('data-theme', saved);
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('drape_theme', next);
    document.documentElement.setAttribute('data-theme', next);
  };

  return (
    <footer className="bg-obsidian-2 border-t border-border mt-auto relative overflow-hidden">
      <div className="bg-gold/5 border-b border-border py-6 overflow-hidden">
        <Marquee pauseOnHover className="[--duration:60s]">
          {[
            "Priya K., Mumbai — The AI suggested palazzo pants for my pear shape. Got so many compliments!",
            "Rahul M., Delhi — Saved ₹2,400 using price alerts. Found same kurta cheaper on Meesho than Amazon!",
            "Ananya S., Bangalore — Finally an app that understands Indian skin tones. Color tips are spot on!",
            "Vikram S., Pune — 50,000+ Outfits Generated · 10,000+ Happy Users · ₹40L+ Saved"
          ].map((text, i) => (
            <span key={i} className="mx-12 text-[10px] uppercase font-bold tracking-[0.2em] text-gold/60 whitespace-nowrap">
              {text}
            </span>
          ))}
        </Marquee>
      </div>

      <div className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          <div className="md:col-span-2 space-y-8 flex flex-col items-center md:items-start text-center md:text-left">
            <DrapeLogo className="scale-110" />
            <p className="text-sm text-foreground/60 max-w-sm leading-relaxed">
              DRAPE AI is India{"'"}s premier intelligent fashion styling platform. We map the geometry of your silhouette to the soul of your style.
            </p>
            <div className="flex gap-4">
              <Button variant="outline" size="icon" className="h-12 w-12 border-primary/20 rounded-xl" onClick={toggleTheme}>
                {theme === 'dark' ? <Sun size={18} className="text-gold" /> : <Moon size={18} className="text-gold" />}
              </Button>
              <div className="flex gap-2">
                {[Instagram, Twitter, Linkedin].map((Icon, i) => (
                  <Button key={i} variant="outline" size="icon" className="h-12 w-12 border-primary/10 rounded-xl hover:text-gold hover:border-gold/30">
                    <Icon size={18} />
                  </Button>
                ))}
              </div>
            </div>
            <p className="text-[10px] text-foreground/30 font-bold uppercase tracking-[0.4em]">Made in India 🇮🇳 with ❤️</p>
          </div>
          
          <div className="flex flex-col gap-6">
            <h4 className="text-xs font-bold uppercase tracking-[0.3em] text-primary">Atelier</h4>
            <nav className="flex flex-col gap-4 text-sm text-foreground/40">
              <Link href="/how-it-works" className="hover:text-primary transition-colors">Process</Link>
              <Link href="/discover" className="hover:text-primary transition-colors">Discover Outfits</Link>
              <Link href="/analyze" className="hover:text-primary transition-colors">Analyze My Style</Link>
              <Link href="/pricing" className="hover:text-primary transition-colors">Atelier Access</Link>
              <Link href="/blog" className="hover:text-primary transition-colors">Style Journal</Link>
            </nav>
          </div>

          <div className="flex flex-col gap-6">
            <h4 className="text-xs font-bold uppercase tracking-[0.3em] text-primary">Legal {'&'} Security</h4>
            <nav className="flex flex-col gap-4 text-sm text-foreground/40">
              <Link href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-primary transition-colors">Terms {'&'} Conditions</Link>
              <Link href="/cookies" className="hover:text-primary transition-colors">Cookie Policy</Link>
              <Link href="/disclaimer" className="hover:text-primary transition-colors">Legal Disclaimer</Link>
              <Link href="/refund-policy" className="hover:text-primary transition-colors">Refund Policy</Link>
              <Link href="/contact" className="hover:text-primary transition-colors">Contact Support</Link>
            </nav>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-12 border-t border-primary/10">
          <p className="text-[10px] uppercase tracking-[0.2em] text-foreground/20">
            &copy; {new Date().getFullYear()} DRAPE AI. All rights reserved. Registered in India.
          </p>
          <div className="flex items-center gap-8 text-[10px] uppercase tracking-widest font-bold text-foreground/20">
            <Link href="/privacy-policy" className="hover:text-gold">Privacy</Link>
            <Link href="/terms" className="hover:text-gold">Terms</Link>
            <Link href="/cookies" className="hover:text-gold">Cookies</Link>
            <span className="text-primary/20">v1.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;