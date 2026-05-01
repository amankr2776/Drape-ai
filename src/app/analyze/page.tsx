
'use client';

import { useState, useEffect, useRef, createElement } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, ScanLine, Bot, Palette, ShoppingCart, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import * as THREE from 'three';

const analysisSteps = [
  { text: 'Scanning your photo...', icon: ScanLine },
  { text: 'Detecting body shape...', icon: User },
  { text: 'Reading your skin tone...', icon: Palette },
  { text: 'Consulting style database...', icon: Bot },
  { text: 'Fetching live prices...', icon: ShoppingCart },
  { text: 'Generating your report...', icon: CheckCircle },
];

const TOTAL_DURATION = 12000;
const STEP_DURATION = TOTAL_DURATION / analysisSteps.length;

export default function AnalyzePage() {
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (currentStep < analysisSteps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, STEP_DURATION);
      return () => clearTimeout(timer);
    } else {
      const finalTimer = setTimeout(() => {
        router.push('/results');
      }, STEP_DURATION);
      return () => clearTimeout(finalTimer);
    }
  }, [currentStep, router]);

  // Three.js Neural Network Animation
  useEffect(() => {
    if (!canvasRef.current || currentStep !== 3) return;

    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    
    // Nodes
    const geometry = new THREE.SphereGeometry(0.1, 16, 16);
    const material = new THREE.MeshBasicMaterial({ color: 0xC9A84C });
    const nodes: THREE.Mesh[] = [];
    
    for (let i = 0; i < 40; i++) {
      const node = new THREE.Mesh(geometry, material);
      node.position.set(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 5
      );
      scene.add(node);
      nodes.push(node);
    }

    // Lines
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xC9A84C, transparent: true, opacity: 0.2 });
    const linesGroup = new THREE.Group();
    scene.add(linesGroup);

    camera.position.z = 8;

    const animate = () => {
      nodes.forEach((node, i) => {
        node.position.y += Math.sin(Date.now() * 0.001 + i) * 0.01;
        node.position.x += Math.cos(Date.now() * 0.001 + i) * 0.005;
      });

      // Simple connection lines
      linesGroup.clear();
      for (let i = 0; i < nodes.length; i += 2) {
        if (nodes[i+1]) {
           const points = [nodes[i].position, nodes[i+1].position];
           const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
           const line = new THREE.Line(lineGeometry, lineMaterial);
           linesGroup.add(line);
        }
      }

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      renderer.dispose();
      scene.clear();
    };
  }, [currentStep]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 overflow-hidden pt-24">
      <div className="w-full max-w-2xl relative">
        {/* User Photo with Scanner */}
        <div className="relative w-full aspect-[3/4] mb-8 rounded-lg overflow-hidden border-2 border-primary/30 shadow-2xl">
          <Image
            src="https://picsum.photos/seed/user-photo/800/1000"
            alt="User for analysis"
            fill
            className="object-cover"
            priority
          />
          
          {/* Scanning Sweep */}
          <AnimatePresence>
            {currentStep === 0 && (
              <motion.div
                className="absolute top-0 left-0 w-full h-1 bg-primary shadow-[0_0_20px_theme(colors.primary)] z-20"
                initial={{ y: -10 }}
                animate={{ y: '1000%' }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              />
            )}
          </AnimatePresence>

          {/* Body Landmark Dots */}
          {currentStep >= 1 && (
             <div className="absolute inset-0 z-10">
                {[
                  { t: '20%', l: '50%' }, { t: '35%', l: '35%' }, { t: '35%', l: '65%' },
                  { t: '50%', l: '50%' }, { t: '65%', l: '42%' }, { t: '65%', l: '58%' }
                ].map((pos, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: i * 0.15 }}
                    style={{ top: pos.t, left: pos.l }}
                    className="absolute w-3 h-3 bg-primary rounded-full shadow-[0_0_10px_theme(colors.primary)]"
                  />
                ))}
             </div>
          )}

          {/* Neural Network Overlay for Phase 4 */}
          <AnimatePresence>
            {currentStep === 3 && (
              <motion.canvas
                ref={canvasRef}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-30 pointer-events-none"
              />
            )}
          </AnimatePresence>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-border h-1 rounded-full mb-8 overflow-hidden">
          <motion.div
            className="bg-primary h-1 shadow-[0_0_10px_theme(colors.primary)]"
            initial={{ width: '0%' }}
            animate={{ width: `${((currentStep + 1) / analysisSteps.length) * 100}%` }}
            transition={{ duration: STEP_DURATION / 1000, ease: 'linear' }}
          />
        </div>
        
        {/* Status Text */}
        <div className="text-center">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex flex-col items-center gap-4"
                >
                    <div className="p-4 rounded-full bg-primary/10 text-primary">
                        {createElement(analysisSteps[currentStep].icon, { className: "w-8 h-8 animate-pulse" })}
                    </div>
                    <h2 className="text-3xl font-headline tracking-wide">{analysisSteps[currentStep].text}</h2>
                </motion.div>
            </AnimatePresence>
        </div>

        {/* Live Counter for Phase 4 */}
        <div className="h-12 mt-4 flex justify-center items-center">
            {currentStep === 3 && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-primary font-body tracking-[0.2em] text-sm"
              >
                ANALYZING 50,000+ COMBINATIONS
              </motion.p>
            )}
            {currentStep === 4 && (
              <div className="flex gap-8">
                {['AMAZON', 'FLIPKART', 'MEESHO'].map((p, i) => (
                   <motion.div 
                    key={p}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.2 }}
                    className="flex flex-col items-center gap-2"
                   >
                     <span className="text-[10px] tracking-widest text-foreground/40">{p}</span>
                     <div className="w-12 h-0.5 bg-primary/20 overflow-hidden">
                        <motion.div 
                          className="h-full bg-primary"
                          initial={{ x: '-100%' }}
                          animate={{ x: '100%' }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                     </div>
                   </motion.div>
                ))}
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
