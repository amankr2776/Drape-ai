'use client';

import { motion } from 'framer-motion';
import { DrapeLogo } from '@/components/drape-logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Linkedin } from 'lucide-react';
import Link from 'next/link';

const story = [
  { year: '2024', title: 'The Idea', desc: 'Frustrated with generic fashion advice that ignored individual body geometry, the concept for DRAPE AI was born.' },
  { year: 'Early 2025', title: 'The Build', desc: 'A dedicated team of 6 engineers and stylists spent months training models on Indian silhouettes.' },
  { year: 'Mid 2025', title: 'The Launch', desc: 'We welcomed our first 1,000 users in week one, proving the need for personalized styling.' },
  { year: 'Now', title: 'The Growth', desc: 'Processing 50,000+ style permutations weekly for a global community.' },
];

const team = [
  { name: 'Arjun Mehta', role: 'CEO / Founder', bio: 'Visionary behind the intersection of AI and Indian luxury.', fact: 'Owns 42 different shades of silk kurtas.' },
  { name: 'Sanya Iyer', role: 'AI Engineer', bio: 'Specialist in computer vision and landmark detection.', fact: 'Once coded an entire app during a flight to Paris.' },
  { name: 'Rohan Das', role: 'Fashion Curator', bio: 'Editorial lead with 10+ years at Vogue India.', fact: 'Can identify a fabric blend just by touch.' },
  { name: 'Priya Verma', role: 'UI/UX Designer', bio: 'Crafting the obsidian aesthetic of the atelier.', fact: 'Collects vintage fashion magazines from the 1920s.' },
  { name: 'Vikram Singh', role: 'Backend Lead', bio: 'Scaling the price radar to 100k+ SKUs.', fact: 'Is an amateur mountaineer in his free time.' },
  { name: 'Anjali Nair', role: 'Frontend Architect', bio: 'Master of 3D animations and interactive fabric.', fact: 'Trained classical dancer (Kathakali).' },
];

const values = [
  { title: 'Body Positive', desc: 'We celebrate every body type. Our AI is designed to empower, not restrict.', icon: '✨' },
  { title: 'Privacy First', desc: 'Your photos are yours. We use ephemeral processing to keep your data private.', icon: '🔒' },
  { title: 'India First', desc: 'Built specifically for Indian fashion sensibilities, skin tones, and budgets.', icon: '🇮🇳' },
];

export default function AboutPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      {/* Hero Section */}
      <section className="container mx-auto px-4 mb-32 text-center">
        <motion.h1 
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.08 } }
          }}
          className="text-6xl md:text-8xl font-headline text-primary mb-8 leading-tight"
        >
          {"We Believe Every Body Deserves Great Style".split(" ").map((word, i) => (
            <motion.span 
              key={i} 
              variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
              className="inline-block mr-[0.2em]"
            >
              {word}
            </motion.span>
          ))}
        </motion.h1>
        <div className="w-full h-[400px] rounded-3xl overflow-hidden relative group">
           <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-background to-accent/20 animate-pulse" />
           <div className="absolute inset-0 flex items-center justify-center">
              <DrapeLogo className="scale-[3] opacity-20" />
           </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="container mx-auto px-4 mb-40">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-6">
            <h2 className="text-[10px] uppercase tracking-[0.5em] text-primary font-bold">Our Mission</h2>
            <blockquote className="text-4xl md:text-6xl font-headline italic text-foreground/80 leading-snug border-l-4 border-primary pl-8">
              "Fashion shouldn't require a stylist. It should understand you."
            </blockquote>
          </div>
          <div className="space-y-6 text-lg text-foreground/60 leading-relaxed font-body">
            <p>
              At DRAPE AI, we’re bridging the gap between high-fashion editorial logic and accessible technology. 
              Our platform was born from the belief that styling is a science of proportions and a poetry of color.
            </p>
            <p>
              By leveraging advanced computer vision, we map the unique geometry of your silhouette, 
              ensuring that every recommendation feels bespoke. We don't just find clothes; we find your aesthetic soul.
            </p>
          </div>
        </div>
      </section>

      {/* Story Timeline */}
      <section className="bg-card/30 border-y border-primary/10 py-32 mb-40">
        <div className="container mx-auto px-4">
           <h2 className="text-4xl font-headline text-center mb-20 text-primary">The Atelier Journey</h2>
           <div className="relative">
              <div className="absolute top-0 bottom-0 left-1/2 w-px bg-primary/20 hidden md:block" />
              <div className="space-y-24">
                {story.map((item, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className={`flex flex-col md:flex-row items-center gap-8 ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                  >
                    <div className="flex-1 text-center md:text-left md:w-1/2 px-8">
                      <span className="text-primary font-bold text-lg mb-2 block">{item.year}</span>
                      <h3 className="text-3xl font-headline mb-4">{item.title}</h3>
                      <p className="text-foreground/40 leading-relaxed">{item.desc}</p>
                    </div>
                    <div className="w-4 h-4 rounded-full bg-primary relative z-10 shadow-[0_0_15px_rgba(201,168,76,0.5)]" />
                    <div className="flex-1 hidden md:block w-1/2" />
                  </motion.div>
                ))}
              </div>
           </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="container mx-auto px-4 mb-40">
        <div className="text-center mb-20 space-y-4">
          <h2 className="text-5xl font-headline text-primary">The Curators</h2>
          <p className="text-foreground/40 uppercase tracking-widest text-[10px]">Architects of the Obsidian Aesthetic</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {team.map((member, i) => (
            <div key={i} className="group perspective-1000 h-[400px]">
              <div className="relative w-full h-full transition-transform duration-700 transform-style-3d group-hover:rotate-y-180">
                {/* Front */}
                <Card className="absolute inset-0 backface-hidden bg-card/40 border-primary/10 flex flex-col items-center justify-center p-8 text-center space-y-6">
                  <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-3xl font-headline text-primary border border-primary/20">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="text-2xl font-headline text-primary">{member.name}</h3>
                    <p className="text-[10px] uppercase tracking-widest text-foreground/40 mt-1">{member.role}</p>
                  </div>
                  <p className="text-sm text-foreground/60 italic">"{member.bio}"</p>
                  <Linkedin className="w-5 h-5 text-foreground/20 group-hover:text-primary transition-colors" />
                </Card>
                {/* Back */}
                <Card className="absolute inset-0 backface-hidden rotate-y-180 bg-primary p-8 flex flex-col items-center justify-center text-center space-y-4">
                  <h4 className="font-headline text-2xl text-primary-foreground underline decoration-2 underline-offset-4">The Fun Fact</h4>
                  <p className="text-primary-foreground/80 text-lg italic leading-relaxed">
                    {member.fact}
                  </p>
                </Card>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Values Section */}
      <section className="container mx-auto px-4 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {values.map((v, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -10 }}
              className="p-10 rounded-3xl bg-primary/5 border border-primary/10 text-center space-y-6"
            >
              <div className="text-6xl">{v.icon}</div>
              <h3 className="text-3xl font-headline text-primary">{v.title}</h3>
              <p className="text-foreground/60 leading-relaxed font-body">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="text-center pt-20">
        <Button asChild size="lg" className="h-16 px-12 font-headline text-xl tracking-widest bg-primary text-primary-foreground hover:glow-gold">
          <Link href="/onboarding">Join the Atelier</Link>
        </Button>
      </div>
    </div>
  );
}
