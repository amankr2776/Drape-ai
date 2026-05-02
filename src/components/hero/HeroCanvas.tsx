'use client';

import React, { useEffect, useRef } from 'react';

/**
 * @fileOverview ATELIER SINGULARITY: ABSOLUTE ZERO EDITION
 * A high-order physical simulation engine utilizing quad-canvas compositing.
 * Orchestrates 100,000 particles and a 9,600-node Verlet fabric mesh.
 */

const PARTICLE_COUNT = 100000;
const CLOTH_COLS = 80;
const CLOTH_ROWS = 120;
const STRIDE = 13; // x, y, vx, vy, life, maxLife, size, r, g, b, a, trail, type

const ERAS = [
  { name: 'GOLD', primary: [201, 168, 76], secondary: [245, 240, 232], accent: [196, 84, 90], bg: [8, 6, 15] },
  { name: 'ROSE', primary: [196, 84, 90], secondary: [255, 220, 220], accent: [201, 168, 76], bg: [12, 6, 12] },
  { name: 'SILVER', primary: [200, 200, 210], secondary: [255, 255, 255], accent: [150, 150, 180], bg: [6, 6, 10] },
  { name: 'MIDNIGHT', primary: [0, 128, 128], secondary: [150, 255, 240], accent: [201, 168, 76], bg: [4, 10, 15] }
];

export default function HeroCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasesRef = useRef<HTMLCanvasElement[]>([]);
  const stateRef = useRef({
    time: 0,
    lastTime: 0,
    frameCount: 0,
    mouse: { x: -1000, y: -1000, vx: 0, vy: 0, lastX: 0, lastY: 0, clicking: 0 },
    scroll: 0,
    eraIndex: 0,
    eraLerp: 0,
    intro: 0, // 0 to 5 seconds
    morph: { current: 0, target: 1, progress: 0 },
    dimensions: { w: 0, h: 0 },
    isMobile: false,
    active: true
  });

  const clothRef = useRef<Float32Array | null>(null);
  const particlesRef = useRef<Float32Array | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const s = stateRef.current;
    
    const init = () => {
      s.isMobile = window.innerWidth < 768;
      const W = window.innerWidth;
      const H = window.innerHeight;
      s.dimensions = { w: W, h: H };

      canvasesRef.current.forEach((canvas, i) => {
        if (!canvas) return;
        canvas.width = W * window.devicePixelRatio;
        canvas.height = H * window.devicePixelRatio;
        canvas.style.width = W + 'px';
        canvas.style.height = H + 'px';
        const ctx = canvas.getContext('2d')!;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      });

      // Cloth: x, y, z, restX, restY, restZ, vx, vy, vz, nx, ny, nz, temp
      const nodes = CLOTH_COLS * CLOTH_ROWS;
      clothRef.current = new Float32Array(nodes * 13);
      const gridW = W * 0.55;
      const gridH = H * 0.85;
      for (let i = 0; i < CLOTH_ROWS; i++) {
        for (let j = 0; j < CLOTH_COLS; j++) {
          const idx = (i * CLOTH_COLS + j) * 13;
          const rx = W/2 - gridW/2 + (j / (CLOTH_COLS-1)) * gridW;
          const ry = H/2 - gridH/2 + (i / (CLOTH_ROWS-1)) * gridH;
          clothRef.current[idx] = rx;
          clothRef.current[idx+1] = ry;
          clothRef.current[idx+2] = 0;
          clothRef.current[idx+3] = rx;
          clothRef.current[idx+4] = ry;
          clothRef.current[idx+5] = 0;
        }
      }

      // Particles
      const pCount = s.isMobile ? 20000 : PARTICLE_COUNT;
      particlesRef.current = new Float32Array(pCount * STRIDE);
      for (let i = 0; i < pCount; i++) {
        const idx = i * STRIDE;
        particlesRef.current[idx] = W/2;
        particlesRef.current[idx+1] = H/2;
        particlesRef.current[idx+4] = 0; // dormant until big bang
        particlesRef.current[idx+12] = i % 4; // type
      }
    };

    const project = (x: number, y: number, z: number) => {
      const focal = 1000;
      const scrollScale = 1 + s.scroll * 0.5;
      const scale = (focal / (focal + z)) * scrollScale;
      const px = (x - s.dimensions.w / 2) * scale + s.dimensions.w / 2;
      const py = (y - s.dimensions.h / 2) * scale + s.dimensions.h / 2;
      return { x: px, y: py, scale };
    };

    const updatePhysics = (delta: number) => {
      const time = s.time;
      const points = clothRef.current!;
      const parts = particlesRef.current!;
      const { w: W, h: H } = s.dimensions;

      // Era Lerping
      s.eraLerp += delta / 15000;
      if (s.eraLerp >= 1) {
        s.eraLerp = 0;
        s.eraIndex = (s.eraIndex + 1) % ERAS.length;
      }

      // Morph Cycling (4 seconds per morph)
      s.morph.progress += delta / 4000;
      if (s.morph.progress >= 1) {
        s.morph.progress = 0;
        s.morph.current = s.morph.target;
        s.morph.target = (s.morph.target + 1) % 6;
      }

      if (s.intro < 5) s.intro += delta;

      // Cloth Verlet Simulation
      const damping = 0.92;

      for (let i = 0; i < CLOTH_ROWS; i++) {
        for (let j = 0; j < CLOTH_COLS; j++) {
          const idx = (i * CLOTH_COLS + j) * 13;
          let fx = 0, fy = 0, fz = 0;

          const rx = points[idx+3], ry = points[idx+4];
          
          // Constant Ripple Forces
          fz += Math.sin(rx * 0.005 + time * 0.7) * Math.cos(ry * 0.008 + time * 1.1) * 30;
          fx += Math.sin(ry * 0.01 + time * 0.43) * 10;

          // Morph Logic
          const morphId = s.morph.current;
          if (morphId === 0) fz += Math.sin(j * 0.2 + time) * 60; // Silk Ripple
          if (morphId === 1) fx += Math.sin(j * 0.8) * 40; // Accordion
          if (morphId === 2) { // Vortex
             const dx = points[idx] - W/2, dy = points[idx+1] - H/2;
             const dist = Math.sqrt(dx*dx + dy*dy);
             const ang = dist * 0.005 * Math.sin(time * 0.5);
             fx += Math.sin(ang) * 100;
          }
          if (morphId === 3) fz += Math.sin((j/CLOTH_COLS)*Math.PI) * Math.sin((i/CLOTH_ROWS)*Math.PI) * 120; // Puffer

          // Mouse Gravitational Mass
          const mdx = points[idx] - s.mouse.x, mdy = points[idx+1] - s.mouse.y;
          const mdist = Math.sqrt(mdx*mdx + mdy*mdy);
          if (mdist < 250) {
            const force = (1 - mdist / 250) * 20;
            points[idx+6] += s.mouse.vx * force * 0.1;
            points[idx+7] += s.mouse.vy * force * 0.1;
            fz -= 150 * force;
          }

          // Intro materialization (Reverse Swarm)
          if (s.intro < 3) {
             const introScale = Math.max(0, (s.intro - 1.5) / 1.5);
             points[idx] = W/2 + (rx - W/2) * introScale;
             points[idx+1] = H/2 + (ry - H/2) * introScale;
          } else {
             // Standard Integration
             points[idx+6] = (points[idx+6] + fx * 0.05) * damping;
             points[idx+7] = (points[idx+7] + fy * 0.05) * damping;
             points[idx+8] = (points[idx+8] + fz * 0.05) * damping;

             points[idx] += points[idx+6];
             points[idx+1] += points[idx+7];
             points[idx+2] += points[idx+8];

             // Restoring spring
             points[idx] += (rx - points[idx]) * 0.05;
             points[idx+1] += (ry - points[idx+1]) * 0.05;
             points[idx+2] += (0 - points[idx+2]) * 0.05;
          }
        }
      }

      // Particle Physics
      const pCount = s.isMobile ? 20000 : PARTICLE_COUNT;
      for (let i = 0; i < pCount; i++) {
        const idx = i * STRIDE;
        
        if (s.intro < 0.5) continue; // Waiting for initial pixel burst

        if (parts[idx+4] <= 0) {
          // Respawn logic based on intro phase
          if (s.intro < 2) {
             parts[idx] = W/2; parts[idx+1] = H/2;
             const ang = Math.random() * Math.PI * 2;
             const mag = Math.random() * 20 + 5;
             parts[idx+2] = Math.cos(ang) * mag;
             parts[idx+3] = Math.sin(ang) * mag;
             parts[idx+4] = 100; parts[idx+5] = 100;
          } else if (Math.random() < 0.01) {
             parts[idx] = Math.random() * W;
             parts[idx+1] = Math.random() * H;
             parts[idx+4] = Math.random() * 200 + 50;
             parts[idx+5] = parts[idx+4];
          }
          continue;
        }

        parts[idx] += parts[idx+2];
        parts[idx+1] += parts[idx+3];
        parts[idx+4]--;

        // Brownian Drift + Upward Bias
        parts[idx+2] += (Math.random() - 0.5) * 0.1;
        parts[idx+3] += (Math.random() - 0.5) * 0.1 - 0.01;

        // Mouse Parting-Sea Repulsion
        const pdx = parts[idx] - s.mouse.x, pdy = parts[idx+1] - s.mouse.y;
        const pdist = Math.sqrt(pdx*pdx + pdy*pdy);
        if (pdist < 150) {
          const force = 1000 / (pdist * pdist + 20);
          parts[idx+2] += (pdx / pdist) * force;
          parts[idx+3] += (pdy / pdist) * force;
        }

        parts[idx+2] *= 0.98;
        parts[idx+3] *= 0.98;
      }
    };

    const render = () => {
      const { w: W, h: H } = s.dimensions;
      const ctxs = canvasesRef.current.map(c => c?.getContext('2d')!);
      const era = ERAS[s.eraIndex];
      const nextEra = ERAS[(s.eraIndex + 1) % ERAS.length];
      const lerpColor = (c1: number[], c2: number[], t: number) => c1.map((v, i) => v + (c2[i] - v) * t);
      const curColor = lerpColor(era.primary, nextEra.primary, s.eraLerp);

      // --- Layer 1: Background Universe ---
      const bgCtx = ctxs[0];
      if (s.frameCount % 3 === 0) {
        bgCtx.fillStyle = `rgb(${era.bg.join(',')})`;
        bgCtx.fillRect(0, 0, W, H);
        
        // Volumetric God Rays
        for (let i = 0; i < 8; i++) {
          const angle = (s.time * 0.1 + (i / 8) * Math.PI * 2);
          const intensity = (Math.sin(s.time * 0.5 + i) * 0.3 + 0.7) * 0.1;
          const grad = bgCtx.createRadialGradient(W/2, H/3, 0, W/2, H/3, W);
          grad.addColorStop(0, `rgba(${curColor.join(',')}, ${intensity})`);
          grad.addColorStop(1, 'transparent');
          bgCtx.save();
          bgCtx.translate(W/2, H/3);
          bgCtx.rotate(angle);
          bgCtx.fillStyle = grad;
          bgCtx.beginPath();
          bgCtx.moveTo(0, 0);
          bgCtx.lineTo(W, -100);
          bgCtx.lineTo(W, 100);
          bgCtx.fill();
          bgCtx.restore();
        }
      }

      // --- Layer 2: The Protagonist (Cloth) ---
      const clothCtx = ctxs[1];
      clothCtx.clearRect(0, 0, W, H);
      const points = clothRef.current!;
      
      const stepX = s.isMobile ? 3 : 2;
      const stepY = s.isMobile ? 3 : 2;

      for (let i = 0; i < CLOTH_ROWS - stepY; i += stepY) {
        for (let j = 0; j < CLOTH_COLS - stepX; j += stepX) {
          const idx = (i * CLOTH_COLS + j) * 13;
          const p1 = project(points[idx], points[idx+1], points[idx+2]);
          const p2 = project(points[idx + stepX * 13], points[idx + stepX * 13 + 1], points[idx + stepX * 13 + 2]);
          const p3 = project(points[idx + stepY * CLOTH_COLS * 13], points[idx + stepY * CLOTH_COLS * 13 + 1], points[idx + stepY * CLOTH_COLS * 13 + 2]);

          // Liquid Chrome Shading
          const light = Math.max(0.1, Math.min(1, 0.5 + (points[idx+2] / 100)));
          clothCtx.beginPath();
          clothCtx.moveTo(p1.x, p1.y);
          clothCtx.lineTo(p2.x, p2.y);
          clothCtx.lineTo(p3.x, p3.y);
          clothCtx.closePath();
          
          clothCtx.fillStyle = `rgba(${curColor[0]*light}, ${curColor[1]*light}, ${curColor[2]*light}, ${0.8 * Math.min(1, s.intro/3)})`;
          clothCtx.fill();

          // Rim Light / Fresnel
          if (points[idx+2] > 50) {
            clothCtx.strokeStyle = `rgba(255, 255, 255, 0.1)`;
            clothCtx.stroke();
          }
        }
      }

      // --- Layer 3: Particle Swarm ---
      const pCtx = ctxs[2];
      pCtx.clearRect(0, 0, W, H);
      const parts = particlesRef.current!;
      pCtx.fillStyle = `rgba(${curColor.join(',')}, 0.6)`;
      const pCount = s.isMobile ? 20000 : PARTICLE_COUNT;
      
      for (let i = 0; i < pCount; i += (s.isMobile ? 10 : 6)) {
        const idx = i * STRIDE;
        if (parts[idx+4] <= 0) continue;
        const alpha = (parts[idx+4] / parts[idx+5]) * 0.8;
        pCtx.globalAlpha = alpha;
        pCtx.fillRect(parts[idx], parts[idx+1], parts[idx+6] || 1, parts[idx+6] || 1);
      }
      pCtx.globalAlpha = 1;

      // --- Layer 4: Atmosphere & Lens ---
      const lensCtx = ctxs[3];
      lensCtx.clearRect(0, 0, W, H);
      
      // Custom Cursor Universe
      const mx = s.mouse.x, my = s.mouse.y;
      lensCtx.strokeStyle = `rgb(${curColor.join(',')})`;
      lensCtx.lineWidth = 1;
      
      // Core Dot
      lensCtx.beginPath();
      lensCtx.arc(mx, my, 3, 0, Math.PI * 2);
      lensCtx.fillStyle = `rgb(${curColor.join(',')})`;
      lensCtx.fill();
      
      // Rotating Rings
      lensCtx.beginPath();
      lensCtx.arc(mx, my, 12, s.time * 2, s.time * 2 + Math.PI * 1.5);
      lensCtx.stroke();
      
      lensCtx.beginPath();
      const pulse = 24 + Math.sin(s.time * 4) * 4;
      lensCtx.arc(mx, my, pulse, -s.time, -s.time + Math.PI);
      lensCtx.globalAlpha = 0.3;
      lensCtx.stroke();
      lensCtx.globalAlpha = 1;

      // Vignette
      const vGrad = lensCtx.createRadialGradient(W/2, H/2, H*0.3, W/2, H/2, W);
      vGrad.addColorStop(0, 'transparent');
      vGrad.addColorStop(1, 'rgba(0,0,0,0.8)');
      lensCtx.fillStyle = vGrad;
      lensCtx.fillRect(0, 0, W, H);

      // Horizontal Anamorphic Flare
      if (s.frameCount % 60 === 0 && Math.random() < 0.3) {
         const fy = Math.random() * H;
         const fGrad = lensCtx.createLinearGradient(0, fy, W, fy);
         fGrad.addColorStop(0, 'transparent');
         fGrad.addColorStop(0.5, `rgba(${curColor.join(',')}, 0.1)`);
         fGrad.addColorStop(1, 'transparent');
         lensCtx.fillStyle = fGrad;
         lensCtx.fillRect(0, fy - 1, W, 2);
      }
    };

    let animId: number;
    const loop = (timestamp: number) => {
      if (!s.active) return;
      const delta = Math.min(33, timestamp - s.lastTime);
      s.lastTime = timestamp;
      s.time += delta * 0.001;
      s.frameCount++;

      updatePhysics(delta);
      render();
      
      animId = requestAnimationFrame(loop);
    };

    const handleMouseMove = (e: MouseEvent) => {
      s.mouse.vx = e.clientX - s.mouse.lastX;
      s.mouse.vy = e.clientY - s.mouse.lastY;
      s.mouse.x = e.clientX;
      s.mouse.y = e.clientY;
      s.mouse.lastX = e.clientX;
      s.mouse.lastY = e.clientY;
    };

    const handleScroll = () => {
      s.scroll = window.scrollY / window.innerHeight;
    };

    const handleResize = () => init();

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    
    init();
    requestAnimationFrame(loop);

    return () => {
      s.active = false;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {Array.from({ length: 4 }).map((_, i) => (
        <canvas
          key={i}
          ref={el => { if (el) canvasesRef.current[i] = el; }}
          className="absolute inset-0 w-full h-full"
          style={{ zIndex: i + 1, pointerEvents: i === 1 ? 'auto' : 'none' }}
        />
      ))}
    </div>
  );
}
