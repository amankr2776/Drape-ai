'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const geometry = new THREE.PlaneGeometry(15, 15, 64, 64);
    const material = new THREE.MeshStandardMaterial({
      color: 0xC9A84C,
      metalness: 0.9,
      roughness: 0.2,
      wireframe: false,
      side: THREE.DoubleSide,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI / 3;
    scene.add(mesh);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1.5);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    camera.position.z = 8;

    const mouse = new THREE.Vector2();
    const handleMouseMove = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      const time = Date.now() * 0.001;
      const positions = geometry.attributes.position;

      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const y = positions.getY(i);
        const waveX = Math.sin(x * 0.5 + time) * 0.5;
        const waveY = Math.cos(y * 0.5 + time) * 0.5;
        const mouseInteraction = Math.exp(-Math.pow(x - mouse.x * 5, 2) - Math.pow(y - mouse.y * 5, 2)) * 1.5;
        positions.setZ(i, waveX + waveY + mouseInteraction);
      }
      positions.needsUpdate = true;

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      scene.clear();
    };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.5 },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 z-0" style={{ pointerEvents: 'none', cursor: 'auto' }} />
      <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/60 to-background z-1"></div>

      <motion.div
        className="relative z-10 text-center px-4 max-w-6xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-pulse"
        >
          <span className="w-2 h-2 rounded-full bg-primary"></span>
          <span className="text-sm font-body tracking-widest text-primary/80 uppercase">Powered by Groq AI</span>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="font-headline text-6xl md:text-8xl lg:text-9xl text-foreground leading-[0.9] mb-6"
        >
          Dress Like You Were
          <br />
          Designed For It
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="font-body text-xl md:text-2xl text-primary/70 mb-12 max-w-2xl mx-auto"
        >
          AI that reads your body. Styles your soul.
        </motion.p>

        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-6 justify-center">
          <Button asChild size="lg" className="h-14 px-10 rounded-none font-headline text-xl tracking-widest transition-transform hover:scale-105">
            <Link href="/onboarding">Analyze My Style</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="h-14 px-10 rounded-none border-primary text-primary font-headline text-xl tracking-widest hover:bg-primary/10 transition-transform hover:scale-105">
            <Link href="/how-it-works">See How It Works</Link>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
