
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { DrapeLogo } from './drape-logo';
import * as THREE from 'three';

export function AppLoader() {
  const [loading, setLoading] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  // Three.js Logo Burst
  useEffect(() => {
    if (!canvasRef.current || !loading) return;

    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);

    const particles: THREE.Mesh[] = [];
    const geometry = new THREE.BoxGeometry(0.05, 0.05, 0.05);
    const material = new THREE.MeshBasicMaterial({ color: 0xC9A84C, transparent: true });

    for (let i = 0; i < 150; i++) {
      const particle = new THREE.Mesh(geometry, material.clone());
      particle.position.set(0, 0, 0);
      particle.userData.velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 0.2,
        (Math.random() - 0.5) * 0.2,
        (Math.random() - 0.5) * 0.2
      );
      scene.add(particle);
      particles.push(particle);
    }

    camera.position.z = 5;

    const animate = () => {
      particles.forEach(p => {
        p.position.add(p.userData.velocity);
        (p.material as THREE.MeshBasicMaterial).opacity -= 0.005;
        p.rotation.x += 0.02;
        p.rotation.y += 0.02;
      });
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      renderer.dispose();
      scene.clear();
    };
  }, [loading]);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center overflow-hidden"
        >
          <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="relative z-10"
          >
            <DrapeLogo className="scale-[2]" />
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="absolute -bottom-16 left-0 right-0 text-center text-[10px] tracking-[0.5em] text-primary/50 uppercase"
            >
              Curating Your Identity
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
