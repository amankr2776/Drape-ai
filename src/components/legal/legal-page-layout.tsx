'use client';

import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { 
  Printer, 
  Download, 
  ChevronRight, 
  ArrowUp,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface LegalPageLayoutProps {
  title: string;
  lastUpdated: string;
  readTime: string;
  sections: { id: string; title: string }[];
  children: React.ReactNode;
}

export function LegalPageLayout({
  title,
  lastUpdated,
  readTime,
  sections,
  children
}: LegalPageLayoutProps) {
  const [activeSection, setActiveSection] = useState(sections[0]?.id || '');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
      const sectionElements = sections.map(s => document.getElementById(s.id));
      const scrollPosition = window.scrollY + 100;

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const el = sectionElements[i];
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Reading Progress */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary z-[var(--z-toast)] origin-left"
        style={{ scaleX }}
      />

      {/* Hero Section */}
      <header className="page-header border-b border-border relative overflow-hidden bg-obsidian-2/50 pt-32">
        <div className="absolute inset-0 z-0 pointer-events-none opacity-5 flex items-center justify-center">
          <FileText size={400} className="text-primary rotate-12" />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <div className="space-y-4">
              <h1 className="text-display md:text-[56px] text-primary">{title}</h1>
              <p className="text-sm font-body text-foreground/40 uppercase tracking-widest">
                Last Updated: {lastUpdated} · {readTime} read
              </p>
            </div>
            <div className="flex gap-4">
              <Button variant="outline" size="sm" onClick={() => window.print()} className="border-primary/20">
                <Printer className="w-4 h-4 mr-2" /> Print
              </Button>
              <Button variant="outline" size="sm" onClick={() => toast({ title: "PDF Preparation", description: "Generating high-fidelity legal document..." })} className="border-primary/20">
                <Download className="w-4 h-4 mr-2" /> Download PDF
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Sidebar TOC */}
          <aside className="lg:col-span-3 hidden lg:block">
            <div className="sticky top-32 space-y-8">
              <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-primary">Table of Contents</h3>
              <nav className="flex flex-col gap-4 border-l border-border pl-6">
                {sections.map(s => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className={cn(
                      "text-sm transition-all duration-300",
                      activeSection === s.id ? "text-primary font-bold translate-x-2" : "text-foreground/40 hover:text-primary"
                    )}
                  >
                    {s.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-9 max-w-[720px] prose prose-invert prose-gold">
            {children}
          </main>
        </div>
      </div>

      {/* Back to Top */}
      <Button
        onClick={scrollToTop}
        className={cn(
          "fixed bottom-8 right-8 z-[var(--z-sticky)] h-12 w-12 rounded-full bg-primary shadow-2xl transition-all duration-500",
          showScrollTop ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
        )}
      >
        <ArrowUp className="w-6 h-6" />
      </Button>
    </div>
  );
}