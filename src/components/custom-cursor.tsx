'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export const CustomCursor = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });

  useEffect(() => {
    const mouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', mouseMove);

    return () => {
      window.removeEventListener('mousemove', mouseMove);
    };
  }, []);

  const variants = {
    default: {
      x: position.x - 8,
      y: position.y - 8,
      backgroundColor: 'hsl(var(--primary))',
      mixBlendMode: 'difference',
    },
  };
  
  return (
    <motion.div
      className="custom-cursor"
      variants={variants}
      animate="default"
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
    />
  );
};
