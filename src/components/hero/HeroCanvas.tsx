'use client';

import React, { useEffect, useRef } from 'react';

/**
 * @fileOverview ATELIER SINGULARITY: The ultimate 3D-perspective hero engine.
 * Features: 100k Particle Swarm, 7-Morph Verlet Cloth, Volumetric God Rays, 
 * and Multi-Era Color Choreography.
 */

// --- CONFIGURATION ---
const DESKTOP_COLS = 60;
const DESKTOP_ROWS = 90;
const MOBILE_COLS = 30;
const MOBILE_ROWS = 45;

const PARTICLE_COUNT = 100000;
const STRIDE = 13; // x, y, vx, vy, life, maxLife, size, r, g, b, a, trailLen, type
const MORPH_DURATION = 4000;
const CROSSFADE_DURATION = 2000;

const ERAS = [
  { name: 'GOLD', primary: [201, 168, 76], secondary: [245, 240, 232], bg: [8, 6, 15] },
  { name: 'ROSE', primary: [196, 84, 90], secondary: [255, 220, 220], bg: [12, 6, 12] },
  { name: 'SILVER', primary: [200, 200, 210], secondary: [255, 255, 255], bg: [6, 6, 10] },
  { name: 'TEAL', primary: [0, 128, 128], secondary: [150, 255, 240], bg: [4, 10, 15] }
];

export default function HeroCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasesRef = useRef<HTMLCanvasElement[]>([]);
  
  // High-perf memory
  const clothPointsRef = useRef<Float32Array | null>(null);
  const particlesRef = useRef<Float32Array | null>(null);
  const stateRef = useRef({
    time: 0,
    lastTime: 0,
    frameCount: 0,
    mouse: { x: -1000, y: -1000, lastX: 0, lastY: 0, vx: 0, vy: 0, down: false },
    scroll: 0,
    intro: 0, // 0 to 1
    eraIndex: 0,
    eraLerp: 0,
    morph: { current: 0, target: 1, progress: 0 },
    dimensions: { w: 0, h: 0 },
    isMobile: false,
    rings: [] as any[]
  });

  useEffect(() => {
    if (!containerRef.current) return;
    
    const s = stateRef.current;
    s.isMobile = window.innerWidth < 768;
    const COLS = s.isMobile ? MOBILE_COLS : DESKTOP_COLS;
    const ROWS = s.isMobile ? MOBILE_ROWS : DESKTOP_ROWS;
    
    const init = () => {
      const W = window.innerWidth;
      const H = window.innerHeight;
      s.dimensions = { w: W, h: H };

      canvasesRef.current.forEach((c, i) => {
        if (!c) return;
        c.width = W * window.devicePixelRatio;
        c.height = H * window.devicePixelRatio;
        c.style.width = W + 'px';
        c.style.height = H + 'px';
        const ctx = c.getContext('2d')!;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      });

      // Cloth: x, y, z, restX, restY, restZ, vx, vy, vz, nx, ny, nz, chrome
      clothPointsRef.current = new Float32Array(COLS * ROWS * 13);
      const gridW = W * 0.55;
      const gridH = H * 0.85;
      const ox = W * 0.5 - gridW * 0.5;
      const oy = H * 0.5 - gridH * 0.5;

      for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
          const idx = (i * COLS + j) * 13;
          const rx = ox + (j / (COLS - 1)) * gridW;
          const ry = oy + (i / (ROWS - 1)) * gridH;
          clothPointsRef.current[idx] = rx;
          clothPointsRef.current[idx+1] = ry;
          clothPointsRef.current[idx+2] = 0;
          clothPointsRef.current[idx+3] = rx;
          clothPointsRef.current[idx+4] = ry;
          clothPointsRef.current[idx+5] = 0;
          clothPointsRef.current[idx+11] = 1; // Normal Z
        }
      }

      // Particles
      const pCount = s.isMobile ? 20000 : PARTICLE_COUNT;
      particlesRef.current = new Float32Array(pCount * STRIDE);
      for (let i = 0; i < pCount; i++) {
        const idx = i * STRIDE;
        particlesRef.current[idx] = Math.random() * W;
        particlesRef.current[idx+1] = Math.random() * H;
        particlesRef.current[idx+4] = 0; // life
        particlesRef.current[idx+12] = i % 4; // type
      }

      // Rings
      s.rings = Array.from({ length: 6 }, (_, i) => ({
        radiusX: 100 + i * 50,
        radiusY: (100 + i * 50) * 0.5,
        tilt: Math.random() * Math.PI,
        orbit: Math.random() * Math.PI * 2,
        speed: 0.002 + Math.random() * 0.004,
        thick: 4 + i
      }));
    };

    const project = (x: number, y: number, z: number) => {
      const focal = 1000;
      const scale = focal / (focal + z);
      const px = (x - s.dimensions.w / 2) * scale + s.dimensions.w / 2;
      const py = (y - s.dimensions.h / 2) * scale + s.dimensions.h / 2;
      return { x: px, y: py, scale };
    };

    const update = (delta: number) => {
      const { w: W, h: H } = s.dimensions;
      const points = clothPointsRef.current!;
      const parts = particlesRef.current!;
      const time = s.time;

      // Era Cycle
      s.eraLerp += delta / 15000;
      if (s.eraLerp >= 1) { s.eraLerp = 0; s.eraIndex = (s.eraIndex + 1) % ERAS.length; }

      // Morph Cycle
      s.morph.progress += delta / MORPH_DURATION;
      if (s.morph.progress >= 1) {
        s.morph.progress = 0;
        s.morph.current = s.morph.target;
        s.morph.target = (s.morph.target + 1) % 7;
      }

      // Intro Logic
      if (s.intro < 1) s.intro = Math.min(1, s.intro + delta / 5000);

      const damping = 0.88;
      const COLS = s.isMobile ? MOBILE_COLS : DESKTOP_COLS;
      const ROWS = s.isMobile ? MOBILE_ROWS : DESKTOP_ROWS;

      // Physics: Cloth
      for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
          const idx = (i * COLS + j) * 13;
          let fx = 0, fy = 0, fz = 0;
          const rx = points[idx+3], ry = points[idx+4];

          // Basic Waves
          fz += Math.sin(rx * 0.02 + time * 0.7) * Math.cos(ry * 0.03 + time * 1.1) * 30;

          // Morph Targets
          const m = s.morph.current;
          const p = s.morph.progress;
          if (m === 0) fz += Math.sin(j * 0.3 + time) * (i/ROWS) * 100; // Drape
          if (m === 1) fx += Math.sin(j * 0.6) * 60; // Pleats
          if (m === 2) { // Vortex
            const dx = rx - W/2, dy = ry - H/2;
            const dist = Math.sqrt(dx*dx + dy*dy);
            const ang = dist * 0.01 * Math.sin(time);
            fx += Math.sin(ang) * 50; fz += Math.cos(ang) * 50;
          }
          if (m === 3) fz += Math.sin((j/COLS)*Math.PI) * Math.sin((i/ROWS)*Math.PI) * 150; // Puffer

          // Mouse Gravity
          const mdx = points[idx] - s.mouse.x, mdy = points[idx+1] - s.mouse.y;
          const mdist = Math.sqrt(mdx*mdx + mdy*mdy);
          if (mdist < 200) {
            const force = (1 - mdist / 200) * 10;
            points[idx+6] += (s.mouse.vx * force * 0.1);
            points[idx+7] += (s.mouse.vy * force * 0.1);
            fz -= 100 * force;
          }

          points[idx+6] = (points[idx+6] + fx * 0.1) * damping;
          points[idx+7] = (points[idx+7] + fy * 0.1) * damping;
          points[idx+8] = (points[idx+8] + fz * 0.1) * damping;

          points[idx] += points[idx+6];
          points[idx+1] += points[idx+7];
          points[idx+2] += points[idx+8];

          // Restore
          points[idx] += (rx - points[idx]) * 0.05;
          points[idx+1] += (ry - points[idx+1]) * 0.05;
          points[idx+2] += (0 - points[idx+2]) * 0.05;
        }
      }

      // Physics: Particles
      const pCount = s.isMobile ? 20000 : PARTICLE_COUNT;
      for (let i = 0; i < pCount; i++) {
        const idx = i * STRIDE;
        parts[idx] += parts[idx+2];
        parts[idx+1] += parts[idx+3];

        if (parts[idx] < 0) parts[idx] = W;
        if (parts[idx] > W) parts[idx] = 0;
        if (parts[idx+1] < 0) parts[idx+1] = H;
        if (parts[idx+1] > H) parts[idx+1] = 0;

        parts[idx+2] *= 0.95; parts[idx+3] *= 0.95;
      }
    };

    const render = () => {
      const { w: W, h: H } = s.dimensions;
      const ctxs = canvasesRef.current.map(c => c?.getContext('2d')!);
      const era = ERAS[s.eraIndex];
      const nextEra = ERAS[(s.eraIndex + 1) % ERAS.length];
      const lerpColor = (c1: number[], c2: number[], t: number) => c1.map((v, i) => v + (c2[i] - v) * t);
      const curColor = lerpColor(era.primary, nextEra.primary, s.eraLerp);

      // Layer 1: Background
      if (s.frameCount % 3 === 0) {
        const bg = ctxs[0];
        bg.fillStyle = `rgb(${era.bg.join(',')})`;
        bg.fillRect(0, 0, W, H);
        
        // God Rays
        bg.save();
        bg.globalCompositeOperation = 'lighter';
        for (let i = 0; i < 8; i++) {
          const ang = (i/8)*Math.PI*2 + s.time * 0.2;
          const grad = bg.createRadialGradient(W/2, H/3, 0, W/2, H/3, W*0.8);
          grad.addColorStop(0, `rgba(${curColor.join(',')}, 0.1)`);
          grad.addColorStop(1, 'transparent');
          bg.fillStyle = grad;
          bg.beginPath();
          bg.moveTo(W/2, H/3);
          bg.lineTo(W/2 + Math.cos(ang-0.2)*W, H/3 + Math.sin(ang-0.2)*W);
          bg.lineTo(W/2 + Math.cos(ang+0.2)*W, H/3 + Math.sin(ang+0.2)*W);
          bg.fill();
        }
        bg.restore();
      }

      // Layer 2: Cloth
      const clothCtx = ctxs[1];
      clothCtx.clearRect(0, 0, W, H);
      const points = clothPointsRef.current!;
      const COLS = s.isMobile ? MOBILE_COLS : DESKTOP_COLS;
      const ROWS = s.isMobile ? MOBILE_ROWS : DESKTOP_ROWS;

      for (let i = 0; i < ROWS - 1; i += 2) {
        for (let j = 0; j < COLS - 1; j += 2) {
          const idx = (i * COLS + j) * 13;
          const p1 = project(points[idx], points[idx+1], points[idx+2]);
          const p2 = project(points[idx+26], points[idx+27], points[idx+28]); // step 2
          
          const lum = 0.5 + (points[idx+2]/150) * 0.5;
          clothCtx.fillStyle = `rgba(${curColor[0]*lum}, ${curColor[1]*lum}, ${curColor[2]*lum}, 0.8)`;
          clothCtx.fillRect(p1.x, p1.y, 4 * p1.scale, 4 * p1.scale);
        }
      }

      // Layer 3: Particles
      const partCtx = ctxs[2];
      partCtx.clearRect(0, 0, W, H);
      partCtx.fillStyle = `rgba(${curColor.join(',')}, 0.5)`;
      const pCount = s.isMobile ? 20000 : PARTICLE_COUNT;
      const step = s.isMobile ? 10 : 5;
      for (let i = 0; i < pCount; i += step) {
        const idx = i * STRIDE;
        partCtx.fillRect(particlesRef.current![idx], particlesRef.current![idx+1], 1, 1);
      }

      // Layer 4: Atmosphere & Cursor
      const atmCtx = ctxs[3];
      atmCtx.clearRect(0, 0, W, H);
      
      // Cinematic Cursor
      const mx = s.mouse.x, my = s.mouse.y;
      atmCtx.strokeStyle = `rgb(${curColor.join(',')})`;
      atmCtx.beginPath();
      atmCtx.arc(mx, my, 12, 0, Math.PI * 2);
      atmCtx.stroke();
      
      atmCtx.beginPath();
      atmCtx.arc(mx, my, 2, 0, Math.PI * 2);
      atmCtx.fillStyle = `rgb(${curColor.join(',')})`;
      atmCtx.fill();

      // Vignette
      const vGrad = atmCtx.createRadialGradient(W/2, H/2, H*0.2, W/2, H/2, W);
      vGrad.addColorStop(0, 'transparent');
      vGrad.addColorStop(1, 'rgba(0,0,0,0.8)');
      atmCtx.fillStyle = vGrad;
      atmCtx.fillRect(0, 0, W, H);
    };

    const loop = (timestamp: number) => {
      const delta = Math.min(33, timestamp - s.lastTime);
      s.lastTime = timestamp;
      s.time += delta * 0.001;
      s.frameCount++;

      update(delta);
      render();
      
      requestAnimationFrame(loop);
    };

    const handleMouseMove = (e: MouseEvent) => {
      s.mouse.vx = e.clientX - s.mouse.lastX;
      s.mouse.vy = e.clientY - s.mouse.lastY;
      s.mouse.x = e.clientX;
      s.mouse.y = e.clientY;
      s.mouse.lastX = e.clientX;
      s.mouse.lastY = e.clientY;
    };

    const handleResize = () => init();

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    init();
    requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
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
      <style jsx global>{`
        body { cursor: none !important; }
        .page-content { cursor: auto; }
      `}</style>
    </div>
  );
}
