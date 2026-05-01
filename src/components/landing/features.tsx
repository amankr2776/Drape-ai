
'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScanLine, Palette, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';

const featuresData = [
  {
    icon: <ScanLine className="h-12 w-12 text-primary" />,
    title: 'Body Intelligence',
    description: 'Our proprietary AI scans 33 anatomical landmarks to define your unique silhouette with pinpoint accuracy.',
    className: 'md:col-span-2 md:row-span-2 min-h-[400px]',
  },
  {
    icon: <Palette className="h-12 w-12 text-primary" />,
    title: 'Skin Harmony',
    description: 'We map your skin undertone to the Monk Scale, ensuring every color recommended enhances your natural glow.',
    className: 'md:col-span-1 min-h-[300px]',
  },
  {
    icon: <Tag className="h-12 w-12 text-primary" />,
    title: 'Price Radar',
    description: 'A dedicated engine that tracks live inventory across India\'s top luxury and daily marketplaces.',
    className: 'md:col-span-1 min-h-[300px]',
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 md:py-40 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20 text-center md:text-left"
        >
          <h2 className="font-headline text-5xl md:text-7xl text-primary mb-4">Precision Aesthetic</h2>
          <p className="font-body text-xl text-foreground/60 max-w-xl">Where advanced computation meets high-fashion sensibility.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuresData.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              className={cn("group", feature.className)}
            >
              <Card className="h-full bg-card/30 border-border hover:border-primary/50 transition-all duration-500 transform hover:-translate-y-4 hover:shadow-[0_0_30px_rgba(201,168,76,0.15)] hover:rotate-1 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-primary transform scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-top"></div>
                <CardHeader className="pt-10">
                  <div className="mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
                    {feature.icon}
                  </div>
                  <CardTitle className="font-headline text-3xl md:text-4xl text-primary mb-4">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-body text-lg text-foreground/70 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
