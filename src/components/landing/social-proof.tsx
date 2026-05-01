
'use client';

import { motion } from 'framer-motion';
import Marquee from '@/components/ui/marquee';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Quote } from 'lucide-react';

const marqueeItems = [
  '50,000+ Styles Generated',
  'Amazon • Flipkart • Meesho',
  'Trusted by 10,000+ Users',
  '4.9★ Style Rating',
  'Indian Luxury Standards',
];

const testimonials = [
  {
    name: 'Ananya Iyer',
    city: 'Mumbai',
    avatar: 'https://picsum.photos/seed/avatar1/100/100',
    review: 'DRAPE AI found me the perfect Raw Silk Sari for my sister\'s sangeet. The skin tone mapping is actual magic — I\'ve never looked better.',
  },
  {
    name: 'Kabir Malhotra',
    city: 'Delhi',
    avatar: 'https://picsum.photos/seed/avatar2/100/100',
    review: 'Found a designer-look Bandhgala on Amazon for half the price I expected. This is the only stylist I trust now.',
  },
  {
    name: 'Meera Reddy',
    city: 'Bangalore',
    avatar: 'https://picsum.photos/seed/avatar3/100/100',
    review: 'I used to struggle with silhouettes for my pear-shaped frame. Drape analyzed my photo and the suggestions were spot on.',
  },
];

export default function SocialProof() {
  return (
    <section className="py-24 md:py-40 bg-background overflow-hidden">
      <div className="border-y border-primary/20 py-10 mb-24">
        <Marquee pauseOnHover className="[--duration:40s]">
          {marqueeItems.map((item, index) => (
            <span key={index} className="mx-12 font-headline text-3xl md:text-5xl text-primary/40 uppercase tracking-widest whitespace-nowrap">
              {item}
            </span>
          ))}
        </Marquee>
      </div>

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-12"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full bg-card/20 border-border relative pt-12">
                <div className="absolute top-0 left-8 -translate-y-1/2 w-12 h-12 bg-primary flex items-center justify-center text-background">
                  <Quote size={24} fill="currentColor" />
                </div>
                <CardContent className="space-y-6">
                  <p className="font-body text-lg italic text-foreground/80 leading-relaxed">"{testimonial.review}"</p>
                  <div className="flex items-center gap-4 border-t border-border pt-6">
                    <Avatar className="h-14 w-14 ring-2 ring-primary/20">
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                      <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-headline text-xl text-primary">{testimonial.name}</p>
                      <p className="font-body text-sm text-foreground/50 uppercase tracking-widest">{testimonial.city}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
