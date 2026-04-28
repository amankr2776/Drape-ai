'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScanLine, Palette, Tag } from 'lucide-react';

const featuresData = [
  {
    icon: <ScanLine className="h-10 w-10 text-primary" />,
    title: 'Body Intelligence',
    description: 'Our AI analyzes your body shape and proportions from a single photo to create a unique 3D model for hyper-accurate style recommendations.',
    className: 'md:col-span-1 md:row-span-2',
  },
  {
    icon: <Palette className="h-10 w-10 text-primary" />,
    title: 'Skin Harmony',
    description: 'We analyze your skin\'s undertones to recommend colors that make you glow. Say goodbye to guesswork and hello to your perfect palette.',
    className: 'md:col-span-1',
  },
  {
    icon: <Tag className="h-10 w-10 text-primary" />,
    title: 'Price Radar',
    description: 'Find the best deals. Our AI scans multiple platforms like Amazon, Flipkart, and Meesho to find your recommended items at the best price.',
    className: 'md:col-span-1',
  },
];

const Features = () => {
  const cardVariants = {
    offscreen: {
      y: 50,
      opacity: 0,
    },
    onscreen: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        bounce: 0.4,
        duration: 0.8,
      },
    },
  };

  return (
    <section id="features" className="py-20 sm:py-32 px-4 bg-background">
      <div className="container mx-auto">
        <motion.div
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: true, amount: 0.1 }}
          transition={{ staggerChildren: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {featuresData.map((feature, index) => (
            <motion.div key={index} variants={cardVariants} className={feature.className}>
              <Card className="h-full bg-card border-border hover:border-primary/50 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:glow-gold">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    {feature.icon}
                    <CardTitle className="text-2xl text-primary">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/80">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
