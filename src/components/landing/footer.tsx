import { DrapeLogo } from '@/components/drape-logo';
import Link from 'next/link';
import { Button } from '../ui/button';
import { Github, Twitter, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start">
            <DrapeLogo />
            <p className="mt-2 text-sm text-foreground/70">
              Made in India 🇮🇳
            </p>
          </div>
          <nav className="flex gap-4 sm:gap-6 font-body text-foreground/80">
            <Link href="/#features" className="hover:text-primary transition-colors">Features</Link>
            <Link href="/#how-it-works" className="hover:text-primary transition-colors">How It Works</Link>
            <Link href="/pricing" className="hover:text-primary transition-colors">Pricing</Link>
            <Link href="/blog" className="hover:text-primary transition-colors">Blog</Link>
          </nav>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" asChild>
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <Github className="h-5 w-5" />
              </a>
            </Button>
          </div>
        </div>
        <div className="mt-8 text-center text-xs text-foreground/50 border-t border-border pt-6">
          <p>&copy; {new Date().getFullYear()} DRAPE AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
