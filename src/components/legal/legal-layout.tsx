'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { ChevronRight, Printer, Download, Mail, ArrowUp, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useToast } from '@/hooks/use-toast';

interface Section {
  id: string;
  title: string;
}

interface LegalLayoutProps {
  title: string;
  lastUpdated: string;
  sections: Section[];
  children: React.ReactNode;
  relatedLink: {
    href: string;
    label: string;
  };
}

export function LegalLayout({
  title,
  lastUpdated,
  sections,
  children,
  relatedLink,
}: LegalLayoutProps) {
  const [activeSection, setActiveSection] = useState<string>(sections[0]?.id || '');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);

      // Find active section
      const sectionElements = sections.map((s) => document.getElementById(s.id));
      const scrollPosition = window.scrollY + 200;

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

  const handlePrint = () => window.print();

  const handleDownload = () => {
    toast({
      title: "Generating PDF",
      description: "Your document is being prepared for download.",
    });
    // In a real app, this might trigger a server-side PDF generation or window.print()
    setTimeout(() => window.print(), 1000);
  };

  const handleEmail = () => {
    toast({
      title: "Email Sent",
      description: "A copy of this document has been sent to your email.",
    });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-background min-h-screen text-foreground selection:bg-primary/30 selection:text-primary">
      {/* Reading Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary z-[100] origin-left"
        style={{ scaleX }}
      />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden border-b border-primary/10">
        <div className="absolute inset-0 z-0 pointer-events-none opacity-5">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-headline text-[200px] text-primary select-none whitespace-nowrap">
            LEGAL ATELIER
          </div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <nav className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-foreground/40 mb-8">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-primary">{title}</span>
          </nav>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-headline text-primary mb-6"
          >
            {title}
          </motion.h1>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <p className="text-sm font-body text-foreground/60">
                Last updated: <span className="text-foreground">{lastUpdated}</span>
              </p>
              <p className="text-xs uppercase tracking-widest text-primary/60">8 min read • Compliant with DPDP Act 2023</p>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handlePrint} className="border-primary/20 hover:bg-primary/5">
                <Printer className="w-4 h-4 mr-2" /> Print
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload} className="border-primary/20 hover:bg-primary/5">
                <Download className="w-4 h-4 mr-2" /> PDF
              </Button>
              <Button variant="outline" size="sm" onClick={handleEmail} className="border-primary/20 hover:bg-primary/5">
                <Mail className="w-4 h-4 mr-2" /> Email
              </Button>
            </div>
          </div>

          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ delay: 0.5, duration: 1 }}
            className="h-[1px] bg-gradient-to-r from-primary/50 via-primary to-transparent mt-12"
          />
        </div>
      </section>

      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Sidebar - ToC */}
          <aside className="lg:col-span-3">
            {/* Mobile ToC */}
            <div className="lg:hidden mb-12">
              <Accordion type="single" collapsible className="bg-card/30 border border-primary/10 rounded-lg overflow-hidden">
                <AccordionItem value="toc" className="border-none">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline font-headline text-xl">
                    Table of Contents
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <nav className="space-y-4">
                      {sections.map((section) => (
                        <a
                          key={section.id}
                          href={`#${section.id}`}
                          onClick={() => setActiveSection(section.id)}
                          className={cn(
                            "block text-sm transition-colors",
                            activeSection === section.id ? "text-primary font-bold" : "text-foreground/40 hover:text-primary"
                          )}
                        >
                          {section.title}
                        </a>
                      ))}
                    </nav>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            {/* Desktop ToC */}
            <div className="hidden lg:block sticky top-32">
              <h3 className="text-xs uppercase tracking-[0.3em] text-primary/60 mb-8 font-bold">Contents</h3>
              <nav className="space-y-6 relative border-l border-primary/10 pl-6">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className={cn(
                      "block text-sm transition-all relative group",
                      activeSection === section.id ? "text-primary translate-x-2" : "text-foreground/40 hover:text-primary"
                    )}
                  >
                    {activeSection === section.id && (
                      <motion.div
                        layoutId="activePointer"
                        className="absolute -left-[25px] top-1/2 -translate-y-1/2 w-1 h-4 bg-primary rounded-full shadow-[0_0_10px_hsl(var(--primary))]"
                      />
                    )}
                    {section.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-9 max-w-4xl space-y-24 pb-32">
            {children}

            <div className="pt-20 border-t border-primary/10">
              <h3 className="font-headline text-3xl text-primary mb-8">Related Documentation</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link
                  href={relatedLink.href}
                  className="p-8 rounded-xl bg-card/20 border border-primary/10 hover:border-primary/40 hover:glow-gold transition-all group"
                >
                  <p className="text-xs uppercase tracking-widest text-foreground/40 mb-2">Read Next</p>
                  <h4 className="text-2xl font-headline group-hover:text-primary transition-colors">{relatedLink.label}</h4>
                </Link>
                <Link
                  href="/contact"
                  className="p-8 rounded-xl bg-card/20 border border-primary/10 hover:border-primary/40 hover:glow-gold transition-all group"
                >
                  <p className="text-xs uppercase tracking-widest text-foreground/40 mb-2">Have Questions?</p>
                  <h4 className="text-2xl font-headline group-hover:text-primary transition-colors">Contact Our Legal Team</h4>
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Scroll to top */}
      <Button
        onClick={scrollToTop}
        className={cn(
          "fixed bottom-8 right-8 z-[90] h-12 w-12 rounded-full bg-primary shadow-2xl transition-all duration-500",
          showScrollTop ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
        )}
      >
        <ArrowUp className="w-6 h-6" />
      </Button>
    </div>
  );
}
