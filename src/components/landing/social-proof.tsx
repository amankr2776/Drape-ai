'use client';

import { motion } from 'framer-motion';
import Marquee from '@/components/ui/marquee';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const marqueeItems = [
  '50,000+ Styles Generated',
  'Amazon • Flipkart • Meesho',
  'Trusted by 10,000+ Users',
  '4.9★ Rating',
];

const testimonials = [
  {
    name: 'Priya Sharma',
    city: 'Mumbai',
    avatar: 'https://picsum.photos/seed/avatar1/100/100',
    review: 'DRAPE AI is a game-changer! It found the perfect lehenga for my sister\'s sangeet. The color recommendations were spot on.',
  },
  {
    name: 'Rohan Gupta',
    city: 'Bangalore',
    avatar: 'https://picsum.photos/seed/avatar2/100/100',
    review: 'As someone who struggles with fashion, this app is a lifesaver. I used it for a formal office party and got so many compliments on my outfit.',
  },
  {
    name: 'Ananya Reddy',
    city: 'Hyderabad',
    avatar: 'https://picsum.photos/seed/avatar3/100/100',
    review: 'I love how it finds items from different sites. Found a beautiful kurta set on Myntra that I would have never seen otherwise!',
  },
];

const SocialProof = () => {
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
    <section className="py-20 sm:py-32 bg-background">
      <div className="relative">
        <Marquee>
          {marqueeItems.map((item, index) => (
            <span key={index} className="mx-8 text-xl font-headline text-primary/70">
              {item}
            </span>
          ))}
        </Marquee>
      </div>

      <div className="container mx-auto mt-20 px-4">
        <motion.div
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.1 }}
            transition={{ staggerChildren: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div key={index} variants={cardVariants}>
              <Card className="h-full bg-card border-border">
                <CardContent className="pt-6">
                  <p className="italic text-foreground/80">"{testimonial.review}"</p>
                  <div className="flex items-center mt-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                      <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="ml-4">
                      <p className="font-bold text-ivory">{testimonial.name}</p>
                      <p className="text-sm text-foreground/70">{testimonial.city}</p>
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
};

export default SocialProof;
