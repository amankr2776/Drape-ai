import { DrapeLogo } from '@/components/drape-logo';
import Link from 'next/link';
import { Button } from '../ui/button';
import { Github, Twitter, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2 flex flex-col items-center md:items-start">
            <DrapeLogo />
            <p className="mt-4 text-sm text-foreground/60 max-w-sm text-center md:text-left leading-relaxed">
              DRAPE AI is India's premier intelligent fashion styling platform. We map the geometry of your silhouette to the soul of your style.
            </p>
            <p className="mt-4 text-xs text-foreground/40 font-bold uppercase tracking-widest">
              Made in India 🇮🇳
            </p>
          </div>
          
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.3em] text-primary">Atelier</h4>
            <nav className="flex flex-col gap-3 text-sm text-foreground/60">
              <Link href="/how-it-works" className="hover:text-primary transition-colors">Process</Link>
              <Link href="/pricing" className="hover:text-primary transition-colors">Atelier Access</Link>
              <Link href="/blog" className="hover:text-primary transition-colors">Style Journal</Link>
              <Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
            </nav>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.3em] text-primary">Legal</h4>
            <nav className="flex flex-col gap-3 text-sm text-foreground/60">
              <Link href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-primary transition-colors">Terms & Conditions</Link>
              <Link href="/contact" className="hover:text-primary transition-colors">Contact Support</Link>
            </nav>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-12 border-t border-primary/10">
          <div className="flex gap-4">
            <Button variant="ghost" size="icon" asChild className="hover:text-primary">
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild className="hover:text-primary">
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild className="hover:text-primary">
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <Github className="h-5 w-5" />
              </a>
            </Button>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-[10px] uppercase tracking-[0.2em] text-foreground/30">
              &copy; {new Date().getFullYear()} DRAPE AI. All rights reserved. Registered in India.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
