'use client';

import React, { useEffect, useRef, useState } from 'react';

/**
 * @fileOverview HeroCanvas - A Cinema-Grade 4-layer 2D Canvas Engine.
 * Features: Perspective Projection, Verlet Liquid Physics, 100k Particle Master,
 * Chromatic Volumetrics, and Multi-Era Color Choreography.
 */

// CONFIGURATION
const COLS = 60;
const ROWS = 90;
const PARTICLE_COUNT = 100000;
const STRIDE = 13; // x, y, vx, vy, life, maxLife, size, r, g, b, a, trailLen, type
const MORPH_DURATION = 4000;
const CROSSFADE_DURATION = 2000;

// COLOR ERAS
const ERAS = [
  { 
    name: 'GOLD_LUXURY', 
    primary: [201, 168, 76], 
    secondary: [245, 240, 232], 
    accent: [255, 255, 255],
    bg: [10, 10, 15] 
  },
  { 
    name: 'ROSE_EDITORIAL', 
    primary: [196, 84, 90], 
    secondary: [255, 180, 180], 
    accent: [255, 220, 220],
    bg: [15, 8, 10] 
  },
  { 
    name: 'SILVER_COUTURE', 
    primary: [200, 200, 210], 
    secondary: [255, 255, 255], 
    accent: [220, 230, 255],
    bg: [8, 8, 12] 
  },
  { 
    name: 'MIDNIGHT_TEAL', 
    primary: [0, 128, 128], 
    secondary: [120, 255, 240], 
    accent: [200, 255, 255],
    bg: [5, 12, 15] 
  }
];

export default function HeroCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const bgCanvasRef = useRef<HTMLCanvasElement>(null);
  const clothCanvasRef = useRef<HTMLCanvasElement>(null);
  const particleCanvasRef = useRef<HTMLCanvasElement>(null);
  const atmosphereCanvasRef = useRef<HTMLCanvasElement>(null);

  // Core Simulation State
  const stateRef = useRef({
    time: 0,
    frameCount: 0,
    lastTime: 0,
    mouse: { x: -1000, y: -1000, lastX: 0, lastY: 0, vx: 0, vy: 0, down: false },
    scroll: 0,
    introProgress: 0,
    introComplete: false,
    eraIndex: 0,
    eraLerp: 0,
    morph: { current: 0, target: 1, progress: 0 },
    adaptiveQuality: 1.0,
    dimensions: { w: 0, h: 0 }
  });

  const clothPointsRef = useRef<Float32Array | null>(null); // x, y, z, restX, restY, restZ, vx, vy, vz, nx, ny, nz, chrome
  const particlesRef = useRef<Float32Array | null>(null);
  const ringsRef = useRef<any[]>([]);

  useEffect(() => {
    if (!bgCanvasRef.current || !clothCanvasRef.current || !particleCanvasRef.current || !atmosphereCanvasRef.current) return;

    const canvases = [bgCanvasRef.current, clothCanvasRef.current, particleCanvasRef.current, atmosphereCanvasRef.current];
    const ctxs = canvases.map(c => c.getContext('2d', { alpha: c !== bgCanvasRef.current })!);

    const init = () => {
      const W = window.innerWidth;
      const H = window.innerHeight;
      stateRef.current.dimensions = { w: W, h: H };

      canvases.forEach(c => {
        c.width = W * window.devicePixelRatio;
        c.height = H * window.devicePixelRatio;
        c.style.width = W + 'px';
        c.style.height = H + 'px';
        const ctx = c.getContext('2d')!;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      });

      // Cloth Data Structure: 13 floats per point
      const points = new Float32Array(COLS * ROWS * 13);
      const gridW = W * 0.55;
      const gridH = H * 0.85;
      const ox = W * 0.5 - gridW * 0.5;
      const oy = H * 0.5 - gridH * 0.5;

      for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
          const idx = (i * COLS + j) * 13;
          const rx = ox + (j / (COLS - 1)) * gridW;
          const ry = oy + (i / (ROWS - 1)) * gridH;
          points[idx] = rx; points[idx+1] = ry; points[idx+2] = 0; // x,y,z
          points[idx+3] = rx; points[idx+4] = ry; points[idx+5] = 0; // restX,Y,Z
          points[idx+6] = 0; points[idx+7] = 0; points[idx+8] = 0; // vx,vy,vz
          points[idx+9] = 0; points[idx+10] = 0; points[idx+11] = 1; // normal x,y,z
          points[idx+12] = 0; // chromeFactor
        }
      }
      clothPointsRef.current = points;

      // Particles: 100k pool
      const parts = new Float32Array(PARTICLE_COUNT * STRIDE);
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const idx = i * STRIDE;
        parts[idx] = Math.random() * W;
        parts[idx+1] = Math.random() * H;
        parts[idx+4] = 0; // life
        parts[idx+12] = i < 40000 ? 0 : i < 60000 ? 1 : i < 85000 ? 2 : 3;
      }
      particlesRef.current = parts;

      // Rings
      ringsRef.current = Array.from({ length: 6 }, (_, i) => ({
        radiusX: 100 + i * 60,
        radiusY: (100 + i * 60) * (0.3 + Math.random() * 0.5),
        tilt: Math.random() * Math.PI,
        orbit: Math.random() * Math.PI * 2,
        speed: 0.001 + Math.random() * 0.003,
        thick: 3 + Math.random() * 5
      }));
    };

    const handleMouseMove = (e: MouseEvent) => {
      const s = stateRef.current;
      s.mouse.vx = e.clientX - s.mouse.lastX;
      s.mouse.vy = e.clientY - s.mouse.lastY;
      s.mouse.x = e.clientX;
      s.mouse.y = e.clientY;
      s.mouse.lastX = e.clientX;
      s.mouse.lastY = e.clientY;
    };

    const handleScroll = () => {
      stateRef.current.scroll = window.scrollY / window.innerHeight;
    };

    const handleClick = () => {
      stateRef.current.mouse.down = true;
      setTimeout(() => stateRef.current.mouse.down = false, 150);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('click', handleClick);

    init();

    // PERSPECTIVE PROJECTION HELPER
    const project = (x: number, y: number, z: number) => {
      const focalLength = 1000;
      const W = stateRef.current.dimensions.w;
      const H = stateRef.current.dimensions.h;
      const scale = focalLength / (focalLength + z);
      const px = (x - W / 2) * scale + W / 2;
      const py = (y - H / 2) * scale + H / 2;
      return { x: px, y: py, scale };
    };

    const update = (delta: number) => {
      const s = stateRef.current;
      const W = s.dimensions.w;
      const H = s.dimensions.h;
      const points = clothPointsRef.current!;
      const parts = particlesRef.current!;
      const time = s.time;

      // Color Era Cycling
      s.eraLerp += delta / 15000;
      if (s.eraLerp >= 1) {
        s.eraLerp = 0;
        s.eraIndex = (s.eraIndex + 1) % ERAS.length;
      }

      // Morph Target Blending
      s.morph.progress += delta / MORPH_DURATION;
      if (s.morph.progress >= 1) {
        s.morph.progress = 0;
        s.morph.current = s.morph.target;
        s.morph.target = (s.morph.target + 1) % 7;
      }

      const damping = 0.88;
      const mousePower = 200;

      // Physics Pass: Cloth
      for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
          const idx = (i * COLS + j) * 13;
          let fx = 0, fy = 0, fz = 0;

          const rx = points[idx+3], ry = points[idx+4], rz = points[idx+5];

          // BASE IRREATIONAL SINE WAVES (Visual Law 5)
          fx += Math.sin(ry * 0.05 + time * 0.7) * 0.5;
          fy += Math.cos(rx * 0.04 + time * 1.1) * 0.3;
          fz += Math.sin(rx * 0.03 + ry * 0.03 + time * 0.43) * 5;

          // MORPH FORCES
          const m = s.morph.current;
          const progress = s.morph.progress;
          
          if (m === 0) { // Rippling Silk
            fz += Math.sin(rx * 0.02 + time) * Math.cos(ry * 0.02 + time * 0.618) * 30;
          } else if (m === 1) { // Pleats
            fx += Math.sin(j * 0.6 + time * 0.1) * 40;
          } else if (m === 2) { // Vortex
            const dx = rx - W/2, dy = ry - H/2;
            const dist = Math.sqrt(dx*dx + dy*dy);
            const angle = dist * 0.015 * Math.sin(time * 1.73);
            fx += Math.sin(angle) * 20;
            fz += Math.cos(angle) * 20;
          } else if (m === 3) { // Inflate
            const nx = (j / COLS - 0.5) * 2;
            const ny = (i / ROWS - 0.5) * 2;
            const bulge = Math.sin(nx * Math.PI) * Math.sin(ny * Math.PI);
            fz += bulge * 100;
          }

          // MOUSE GRAVITY
          const dx = points[idx] - s.mouse.x;
          const dy = points[idx+1] - s.mouse.y;
          const distSq = dx*dx + dy*dy;
          if (distSq < 40000) {
            const force = (1 - Math.sqrt(distSq) / 200) * 8;
            fx += dx / 200 * force;
            fy += dy / 200 * force;
            fz -= 100 * force * (s.mouse.down ? 2 : 1);
          }

          // VERLET
          points[idx+6] = (points[idx+6] + fx) * damping;
          points[idx+7] = (points[idx+7] + fy) * damping;
          points[idx+8] = (points[idx+8] + fz) * damping;

          points[idx] += points[idx+6];
          points[idx+1] += points[idx+7];
          points[idx+2] += points[idx+8];

          // Damping back to rest
          points[idx] += (rx - points[idx]) * 0.02;
          points[idx+1] += (ry - points[idx+1]) * 0.02;
          points[idx+2] += (rz - points[idx+2]) * 0.02;
        }
      }

      // Physics Pass: Particles
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const idx = i * STRIDE;
        const type = parts[idx+12];

        if (type === 2) { // Free Drift
          parts[idx+2] += Math.sin(parts[idx+1] * 0.01 + time * 0.7) * 0.1;
          parts[idx+3] += Math.cos(parts[idx] * 0.01 + time * 1.1) * 0.1 - 0.05; // Upward bias
        }

        parts[idx] += parts[idx+2];
        parts[idx+1] += parts[idx+3];

        // Screen Wrap
        if (parts[idx] < 0) parts[idx] = W;
        if (parts[idx] > W) parts[idx] = 0;
        if (parts[idx+1] < 0) parts[idx+1] = H;
        if (parts[idx+1] > H) parts[idx+1] = 0;

        parts[idx+2] *= 0.98;
        parts[idx+3] *= 0.98;
      }
    };

    const render = () => {
      const s = stateRef.current;
      const W = s.dimensions.w;
      const H = s.dimensions.h;
      const points = clothPointsRef.current!;
      const parts = particlesRef.current!;
      const era = ERAS[s.eraIndex];
      const nextEra = ERAS[(s.eraIndex + 1) % ERAS.length];
      
      const lerpColor = (c1: number[], c2: number[], t: number) => 
        c1.map((v, i) => Math.round(v + (c2[i] - v) * t));
      
      const currentPrimary = lerpColor(era.primary, nextEra.primary, s.eraLerp);
      const currentSecondary = lerpColor(era.secondary, nextEra.secondary, s.eraLerp);

      // LAYER 1: BACKGROUND (GALAXY & STARS)
      if (s.frameCount % 3 === 0) {
        const ctx = ctxs[0];
        ctx.fillStyle = `rgb(${era.bg.join(',')})`;
        ctx.fillRect(0, 0, W, H);
        
        // Dynamic God Rays
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        for (let i = 0; i < 8; i++) {
          const angle = timeRef.current * 0.2 + (i / 8) * Math.PI * 2;
          const lx = W/2 + Math.cos(angle) * 100;
          const ly = H/3 + Math.sin(angle) * 50;
          const grad = ctx.createRadialGradient(lx, ly, 0, lx, ly, W * 0.8);
          const alpha = (Math.sin(timeRef.current * 0.5 + i) * 0.5 + 0.5) * 0.15;
          grad.addColorStop(0, `rgba(${currentPrimary.join(',')}, ${alpha})`);
          grad.addColorStop(1, 'transparent');
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, W, H);
        }
        ctx.restore();
      }

      // LAYER 2: CLOTH MESH
      const clothCtx = ctxs[1];
      clothCtx.clearRect(0, 0, W, H);
      
      for (let i = 0; i < ROWS - 1; i += 2) {
        for (let j = 0; j < COLS - 1; j += 2) {
          const idx = (i * COLS + j) * 13;
          const idxR = idx + 13;
          const idxD = ((i + 1) * COLS + j) * 13;
          const idxDR = idxD + 13;

          const p1 = project(points[idx], points[idx+1], points[idx+2]);
          const p2 = project(points[idxR], points[idxR+1], points[idxR+2]);
          const p3 = project(points[idxDR], points[idxDR+1], points[idxDR+2]);
          const p4 = project(points[idxD], points[idxD+1], points[idxD+2]);

          // Liquid Chrome Shading
          const lum = 0.3 + Math.max(0, points[idx+11]) * 0.7; // Using NZ for lighting
          const sheen = Math.pow(lum, 4) * 0.4;
          
          clothCtx.fillStyle = `rgba(${currentPrimary[0] * lum}, ${currentPrimary[1] * lum}, ${currentPrimary[2] * lum}, 0.9)`;
          
          clothCtx.beginPath();
          clothCtx.moveTo(p1.x, p1.y);
          clothCtx.lineTo(p2.x, p2.y);
          clothCtx.lineTo(p3.x, p3.y);
          clothCtx.lineTo(p4.x, p4.y);
          clothCtx.closePath();
          clothCtx.fill();

          if (sheen > 0.1) {
            clothCtx.fillStyle = `rgba(255, 255, 255, ${sheen})`;
            clothCtx.fill();
          }
        }
      }

      // LAYER 3: PARTICLES
      const partCtx = ctxs[2];
      partCtx.clearRect(0, 0, W, H);
      partCtx.fillStyle = `rgba(${currentSecondary.join(',')}, 0.6)`;
      
      const skip = s.dimensions.w < 768 ? 8 : 4;
      for (let i = 0; i < PARTICLE_COUNT; i += skip) {
        const idx = i * STRIDE;
        if (parts[idx+10] > 0 || Math.random() > 0.5) { // alpha check
          partCtx.fillRect(parts[idx], parts[idx+1], 1.5, 1.5);
        }
      }

      // LAYER 4: ATMOSPHERE & CURSOR
      if (s.frameCount % 2 === 0) {
        const atmCtx = ctxs[3];
        atmCtx.clearRect(0, 0, W, H);
        
        // Custom Cinematic Cursor
        const mx = s.mouse.x, my = s.mouse.y;
        atmCtx.strokeStyle = `rgb(${currentPrimary.join(',')})`;
        atmCtx.lineWidth = 1;
        
        // Core Dot
        atmCtx.beginPath();
        atmCtx.arc(mx, my, 3, 0, Math.PI * 2);
        atmCtx.fillStyle = `rgb(${currentPrimary.join(',')})`;
        atmCtx.fill();

        // Inner Rotating Ring
        atmCtx.save();
        atmCtx.translate(mx, my);
        atmCtx.rotate(timeRef.current);
        atmCtx.beginPath();
        atmCtx.arc(0, 0, 14, 0, Math.PI * 1.5);
        atmCtx.stroke();
        atmCtx.restore();

        // Outer Pulsing Ring
        const pulse = 24 + Math.sin(timeRef.current * 4) * 4;
        atmCtx.beginPath();
        atmCtx.arc(mx, my, pulse, 0, Math.PI * 2);
        atmCtx.strokeStyle = `rgba(${currentPrimary.join(',')}, 0.3)`;
        atmCtx.stroke();

        // Vignette
        const grad = atmCtx.createRadialGradient(W/2, H/2, H*0.2, W/2, H/2, W*0.8);
        grad.addColorStop(0, 'transparent');
        grad.addColorStop(1, 'rgba(0,0,0,0.6)');
        atmCtx.fillStyle = grad;
        atmCtx.fillRect(0, 0, W, H);
      }
    };

    const timeRef = { current: 0 };
    const loop = (timestamp: number) => {
      const delta = timestamp - stateRef.current.lastTime;
      stateRef.current.lastTime = timestamp;
      stateRef.current.time += delta * 0.001;
      timeRef.current = stateRef.current.time;
      stateRef.current.frameCount++;

      if (delta < 100) {
        update(delta);
        render();
      }

      animIdRef.current = requestAnimationFrame(loop);
    };

    const animIdRef = { current: requestAnimationFrame(loop) };

    const handleResize = () => {
      init();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animIdRef.current);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      <canvas ref={bgCanvasRef} className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }} />
      <canvas ref={clothCanvasRef} className="absolute inset-0 w-full h-full pointer-events-auto" style={{ zIndex: 2 }} />
      <canvas ref={particleCanvasRef} className="absolute inset-0 w-full h-full" style={{ zIndex: 3 }} />
      <canvas ref={atmosphereCanvasRef} className="absolute inset-0 w-full h-full" style={{ zIndex: 4 }} />
      
      <style jsx global>{`
        body { cursor: none !important; }
        .page-content { cursor: auto; }
      `}</style>
    </div>
  );
}
