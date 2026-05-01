'use client';

import React, { useEffect, useRef } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

/**
 * @fileOverview UltraHeroCanvas - The "Living Atmosphere" of DRAPE AI.
 * An elite WebGL-inspired 2D Canvas simulation featuring kinetic physics,
 * iridescent fabric, volumetric light, and interactive gravity.
 */

// --- VISUAL LAWS & CONSTANTS ---
const MORPH_DURATION = 3000;
const COLOR_ERA_DURATION = 15000;
const DAMPING = 0.92;
const MOUSE_RADIUS = 150;
const PARTICLE_COUNT = 3000;
const CLOTH_COLS = 80;
const CLOTH_ROWS = 120;

const PALETTES = [
  { name: 'Gold', primary: '#C9A84C', secondary: '#8B6E2E', accent: '#F5F0E8', rays: ['#C9A84C', '#F5F0E8'] },
  { name: 'Rose', primary: '#C4545A', secondary: '#7A3338', accent: '#F5F0E8', rays: ['#C4545A', '#F5F0E8'] },
  { name: 'Silver', primary: '#F5F0E8', secondary: '#C8C0B0', accent: '#C9A84C', rays: ['#F5F0E8', '#C9A84C'] },
  { name: 'Teal', primary: '#4FC3F7', secondary: '#007086', accent: '#F5F0E8', rays: ['#4FC3F7', '#F5F0E8'] },
];

interface Point {
  x: number; y: number;
  px: number; py: number; // previous pos
  rx: number; ry: number; // rest pos
  vx: number; vy: number;
}

export const UltraHeroCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mainCanvasRef = useRef<HTMLCanvasElement>(null);
  const isMobile = useIsMobile();
  
  // Simulation State Refs
  const state = useRef({
    time: 0,
    startTime: 0,
    lastFrame: 0,
    mouse: { x: -1000, y: -1000, vx: 0, vy: 0, px: 0, py: 0 },
    scroll: 0,
    era: 0,
    morph: 0,
    points: [] as Point[],
    particles: new Float32Array(PARTICLE_COUNT * 8), // x, y, vx, vy, life, maxLife, size, state
    offscreen: {
      stars: null as HTMLCanvasElement | null,
      rays: null as HTMLCanvasElement | null,
    },
    fps: 60,
    introProgress: 0,
    clickPulse: 0,
  });

  useEffect(() => {
    const canvas = mainCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;
    const dpr = window.devicePixelRatio || 1;

    // --- INITIALIZATION ---
    const init = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      // 1. Initialize Cloth Points
      const points: Point[] = [];
      const clothGridCols = isMobile ? 40 : CLOTH_COLS;
      const clothGridRows = isMobile ? 60 : CLOTH_ROWS;
      const gridW = width * 0.6;
      const gridH = height * 0.8;
      const spacingX = gridW / clothGridCols;
      const spacingY = gridH / clothGridRows;
      const startX = (width - gridW) / 2;
      const startY = (height - gridH) / 2;

      for (let j = 0; j <= clothGridRows; j++) {
        for (let i = 0; i <= clothGridCols; i++) {
          const x = startX + i * spacingX;
          const y = startY + j * spacingY;
          points.push({ x, y, px: x, py: y, rx: x, ry: y, vx: 0, vy: 0 });
        }
      }
      state.current.points = points;

      // 2. Initialize Particles
      const p = state.current.particles;
      const pCount = isMobile ? 800 : PARTICLE_COUNT;
      for (let i = 0; i < pCount; i++) {
        const idx = i * 8;
        p[idx] = Math.random() * width;     // x
        p[idx+1] = Math.random() * height; // y
        p[idx+2] = (Math.random() - 0.5) * 2; // vx
        p[idx+3] = (Math.random() - 0.5) * 2; // vy
        p[idx+4] = 0; // life
        p[idx+5] = 100 + Math.random() * 200; // maxLife
        p[idx+6] = 0.5 + Math.random() * 1.5; // size
        p[idx+7] = Math.floor(Math.random() * 3); // state (0:orbit, 1:surface, 2:drift)
      }

      // 3. Pre-render Stars
      createStarField();
      state.current.startTime = performance.now();
    };

    const createStarField = () => {
      const c = document.createElement('canvas');
      c.width = width;
      c.height = height;
      const x = c.getContext('2d')!;
      const count = isMobile ? 2000 : 8000;
      const img = x.createImageData(width, height);
      
      for (let i = 0; i < count; i++) {
        const radius = Math.sqrt(Math.random()) * Math.max(width, height) * 0.8;
        const angle = Math.random() * Math.PI * 2;
        const px = Math.floor(width/2 + Math.cos(angle) * radius);
        const py = Math.floor(height/2 + Math.sin(angle) * radius);
        
        if (px >= 0 && px < width && py >= 0 && py < height) {
          const idx = (py * width + px) * 4;
          const bright = 100 + Math.random() * 155;
          img.data[idx] = 200;
          img.data[idx+1] = 200;
          img.data[idx+2] = 255;
          img.data[idx+3] = bright;
        }
      }
      x.putImageData(img, 0, 0);
      state.current.offscreen.stars = c;
    };

    // --- CORE SIMULATION ---
    const update = (now: number) => {
      const dt = now - state.current.lastFrame;
      state.current.lastFrame = now;
      const t = now - state.current.startTime;
      state.current.time = t;

      const { points, mouse, scroll, particles } = state.current;
      const eraIdx = Math.floor((t / COLOR_ERA_DURATION) % 4);
      state.current.era = eraIdx;
      const morphIdx = Math.floor((t / MORPH_DURATION) % 6);
      state.current.morph = morphIdx;
      
      // Update Intro
      state.current.introProgress = Math.min(1, t / 5000);

      const clothGridCols = isMobile ? 40 : CLOTH_COLS;
      const clothGridRows = isMobile ? 60 : CLOTH_ROWS;

      // Physics Loop: Cloth
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        const col = i % (clothGridCols + 1);
        const row = Math.floor(i / (clothGridCols + 1));
        const ni = col / clothGridCols;
        const nj = row / clothGridRows;

        // ACCELERATION FORCES
        let ax = 0, ay = 0;

        // Law 5: Irregular Sine Waves (Fabric protagonist)
        const wave1 = Math.sin(ni * 4 + t * 0.001) * Math.cos(nj * 3 + t * 0.0007) * 40;
        const wave2 = Math.cos(ni * 2 + t * 0.0013) * Math.sin(nj * 5 + t * 0.0009) * 20;
        let targetX = p.rx, targetY = p.ry + wave1 + wave2;

        // Morph Targets
        if (morphIdx === 1) { // Pleats
          targetX += Math.sin(nj * 8 + t * 0.0001) * 60;
        } else if (morphIdx === 2) { // Twist
          const dx = p.rx - width/2, dy = p.ry - height/2;
          const dist = Math.sqrt(dx*dx + dy*dy);
          const angle = dist * 0.02 * Math.sin(t * 0.0003);
          targetX = width/2 + dx * Math.cos(angle) - dy * Math.sin(angle);
          targetY = height/2 + dx * Math.sin(angle) + dy * Math.cos(angle);
        } else if (morphIdx === 3) { // Inflate
          const bulge = Math.sin(ni * Math.PI) * Math.sin(nj * Math.PI) * 80;
          targetY -= bulge;
        } else if (morphIdx === 5) { // Shatter
          targetX += (Math.random() - 0.5) * 100 * state.current.introProgress;
        }

        // Law 3: Mouse is God
        const mdx = p.x - mouse.x;
        const mdy = p.y - mouse.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < MOUSE_RADIUS) {
          const force = (1 - mdist / MOUSE_RADIUS) * 2;
          ax -= (mdx / mdist) * force;
          ay -= (mdy / mdist) * force;
        }

        // Supernova shockwave
        if (state.current.clickPulse > 0) {
            const cdx = p.x - mouse.x;
            const cdy = p.y - mouse.y;
            const cdist = Math.sqrt(cdx * cdx + cdy * cdy);
            const wavePos = (1 - state.current.clickPulse) * width;
            if (Math.abs(cdist - wavePos) < 100) {
                ax += (cdx / cdist) * 20;
                ay += (cdy / cdist) * 20;
            }
        }

        // Scroll Choreography
        if (scroll > 0.15) {
          const sForce = (scroll - 0.15) * 5;
          ay -= sForce;
        }

        // Verlet integration
        const vx = (p.x - p.px) * DAMPING + ax;
        const vy = (p.y - p.py) * DAMPING + ay;
        p.px = p.x;
        p.py = p.y;
        p.x += vx + (targetX - p.x) * 0.05;
        p.y += vy + (targetY - p.y) * 0.05;
      }

      // Physics Loop: Particles
      const pCount = isMobile ? 800 : PARTICLE_COUNT;
      for (let i = 0; i < pCount; i++) {
        const idx = i * 8;
        const pState = particles[idx+7];
        
        // Repulsion
        const pdx = particles[idx] - mouse.x;
        const pdy = particles[idx+1] - mouse.y;
        const pdist = Math.sqrt(pdx*pdx + pdy*pdy);
        if (pdist < 120) {
          const pf = 800 / (pdist * pdist + 10);
          particles[idx+2] += (pdx / pdist) * pf;
          particles[idx+3] += (pdy / pdist) * pf;
        }

        // State behavior
        if (pState === 0) { // Orbit
          const odx = particles[idx] - width/2;
          const ody = particles[idx+1] - height/2;
          const odist = Math.sqrt(odx*odx + ody*ody);
          const force = 0.01;
          particles[idx+2] -= (ody / odist) * force * 20;
          particles[idx+3] += (odx / odist) * force * 20;
        }

        particles[idx] += particles[idx+2];
        particles[idx+1] += particles[idx+3];
        particles[idx+2] *= 0.98;
        particles[idx+3] *= 0.98;

        // Wrap
        if (particles[idx] < 0) particles[idx] = width;
        if (particles[idx] > width) particles[idx] = 0;
        if (particles[idx+1] < 0) particles[idx+1] = height;
        if (particles[idx+1] > height) particles[idx+1] = 0;
      }

      if (state.current.clickPulse > 0) {
        state.current.clickPulse -= 0.02;
      }
    };

    // --- RENDERING ---
    const draw = () => {
      ctx.fillStyle = '#0A0A0F';
      ctx.fillRect(0, 0, width, height);

      const palette = PALETTES[state.current.era];
      const intro = state.current.introProgress;
      const scroll = state.current.scroll;

      // Layer 1: Stars
      if (state.current.offscreen.stars) {
        ctx.globalAlpha = 0.5 * (1 - scroll);
        ctx.drawImage(state.current.offscreen.stars, state.current.mouse.vx * -0.05, state.current.mouse.vy * -0.05);
      }

      // Layer 2: God Rays
      drawGodRays(ctx, palette.primary);

      // Layer 3: Living Cloth
      drawCloth(ctx, palette);

      // Layer 6: Particles
      drawParticles(ctx, palette.primary);

      // Layer 7: Custom Cursor
      if (!isMobile) {
        drawCursor(ctx, palette.primary);
      }

      // Atmospheric Fog
      const grad = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, width);
      grad.addColorStop(0, 'transparent');
      grad.addColorStop(1, 'rgba(0,0,0,0.6)');
      ctx.globalAlpha = 1;
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      animId = requestAnimationFrame(draw);
    };

    const drawGodRays = (ctx: CanvasRenderingContext2D, color: string) => {
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = 0.1 * state.current.introProgress;
      const rayCount = isMobile ? 4 : 8;
      for (let i = 0; i < rayCount; i++) {
        const angle = state.current.time * 0.0001 + (i * Math.PI / 4);
        const x = width / 2 + Math.cos(angle) * width;
        const y = -100;
        const beam = ctx.createLinearGradient(x, y, width/2, height);
        beam.addColorStop(0, color);
        beam.addColorStop(1, 'transparent');
        ctx.fillStyle = beam;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(width/2 - 200 + i * 100, height);
        ctx.lineTo(width/2 + 200 + i * 100, height);
        ctx.fill();
      }
      ctx.restore();
    };

    const drawCloth = (ctx: CanvasRenderingContext2D, pal: any) => {
      const pts = state.current.points;
      if (!pts.length) return;
      ctx.save();
      ctx.globalAlpha = 0.6 * state.current.introProgress * (1 - state.current.scroll);
      
      const clothGridCols = isMobile ? 40 : CLOTH_COLS;
      const clothGridRows = isMobile ? 60 : CLOTH_ROWS;

      for (let j = 0; j < clothGridRows; j++) {
        for (let i = 0; i < clothGridCols; i++) {
          const idx = j * (clothGridCols + 1) + i;
          const p1 = pts[idx];
          const p2 = pts[idx + 1];
          const p3 = pts[idx + clothGridCols + 2];
          const p4 = pts[idx + clothGridCols + 1];

          if (!p1 || !p2 || !p3 || !p4) continue;

          // Iridescent shading approximation
          const dist = Math.abs(p1.y - p1.ry);
          const sheen = Math.min(1, dist / 40);
          ctx.fillStyle = sheen > 0.5 ? pal.primary : pal.secondary;
          
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.lineTo(p3.x, p3.y);
          ctx.lineTo(p4.x, p4.y);
          ctx.closePath();
          ctx.fill();

          if (i % 8 === 0 && j % 8 === 0) {
            ctx.strokeStyle = pal.accent;
            ctx.lineWidth = 0.3;
            ctx.stroke();
          }
        }
      }
      ctx.restore();
    };

    const drawParticles = (ctx: CanvasRenderingContext2D, color: string) => {
      const p = state.current.particles;
      const pCount = isMobile ? 800 : PARTICLE_COUNT;
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.8;
      for (let i = 0; i < pCount; i++) {
        const idx = i * 8;
        ctx.beginPath();
        ctx.arc(p[idx], p[idx+1], p[idx+6], 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const drawCursor = (ctx: CanvasRenderingContext2D, color: string) => {
      const { mouse, time } = state.current;
      ctx.save();
      ctx.translate(mouse.x, mouse.y);
      
      // Concentric rings
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      
      // Ring 1 (Dash)
      ctx.setLineDash([4, 8]);
      ctx.beginPath();
      ctx.arc(0, 0, 12, 0, Math.PI * 2);
      ctx.stroke();
      
      // Ring 2 (Pulse)
      const pulse = 24 + Math.sin(time * 0.005) * 4;
      ctx.setLineDash([]);
      ctx.globalAlpha = 0.4;
      ctx.beginPath();
      ctx.arc(0, 0, pulse, 0, Math.PI * 2);
      ctx.stroke();

      // Core
      ctx.globalAlpha = 1;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(0, 0, 3, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
    };

    const handleMouseMove = (e: MouseEvent) => {
      const m = state.current.mouse;
      m.vx = e.clientX - m.px;
      m.vy = e.clientY - m.py;
      m.px = e.clientX;
      m.py = e.clientY;
      m.x = e.clientX;
      m.y = e.clientY;
    };

    const handleClick = () => {
        state.current.clickPulse = 1.0;
    };

    const handleScroll = () => {
      state.current.scroll = Math.min(1, window.scrollY / window.innerHeight);
    };

    const handleResize = () => {
      init();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);

    init();
    draw();
    const simInterval = setInterval(() => update(performance.now()), 16);

    return () => {
      cancelAnimationFrame(animId);
      clearInterval(simInterval);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [isMobile]);

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 overflow-hidden bg-[#0A0A0F]">
      <canvas 
        ref={mainCanvasRef} 
        className="block w-full h-full"
        style={{ cursor: isMobile ? 'auto' : 'none' }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background pointer-events-none" />
    </div>
  );
};
