'use client';

import { useState, useEffect } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export const CustomCursor = () => {
  const [mounted, setMounted] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const innerSpringConfig = { damping: 25, stiffness: 200 };
  const outerSpringConfig = { damping: 40, stiffness: 150 };

  const cursorXSpring = useSpring(cursorX, innerSpringConfig);
  const cursorYSpring = useSpring(cursorY, innerSpringConfig);
  const cursorXOuterSpring = useSpring(cursorX, outerSpringConfig);
  const cursorYOuterSpring = useSpring(cursorY, outerSpringConfig);

  useEffect(() => {
    setMounted(true);
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    window.addEventListener('mousemove', moveCursor);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
    };
  }, [cursorX, cursorY]);

  if (!mounted) return null;

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-3 h-3 bg-primary rounded-full pointer-events-none mix-blend-difference"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
          zIndex: 'var(--z-cursor)'
        }}
      />
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 border border-primary/50 rounded-full pointer-events-none"
        style={{
          x: cursorXOuterSpring,
          y: cursorYOuterSpring,
          translateX: '-50%',
          translateY: '-50%',
          zIndex: 'calc(var(--z-cursor) - 1)'
        }}
      />
    </>
  );
};