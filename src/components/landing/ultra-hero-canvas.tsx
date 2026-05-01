'use client';

import React, { useEffect, useRef } from 'react';

// --- VISUAL LAWS & CONSTANTS ---
const MORPH_SEQUENCE = [0, 1, 2, 3, 4, 5]; // silk, pleats, spiral, inflate, origami, shatter
const MORPH_DURATION = 3000;
const COLOR_ERA_DURATION = 15000;
const DAMPING = 0.92;
const MOUSE_GRAVITY = 120;
const RIPPLE_SPEED = 0.005;

const PALETTES = [
  { name: 'Gold', primary: [42, 61, 54], accent: [38, 43, 93], glow: '#C9A84C' },
  { name: 'Rose', primary: [357, 58, 55], accent: [38, 43, 93], glow: '#C4545A' },
  { name: 'Silver', primary: [0, 0, 93], accent: [240, 17, 15], glow: '#F5F0E8' },
  { name: 'Teal', primary: [180, 70, 50], accent: [200, 80, 40], glow: '#4FC3F7' },
];

interface Point {
  x: number; y: number;
  px: number; py: number; // previous pos for Verlet
  rx: number; ry: number; // rest pos
  vx: number; vy: number;
}

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  size: number;
  color: string;
  life: number;
  maxLife: number;
  state: 'orbit' | 'cloth' | 'drift' | 'explosion';
  targetIndex?: number;
}

export const UltraHeroCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Refs for simulation state
  const state = useRef({
    time: 0,
    lastTime: 0,
    introProgress: 0,
    scrollProgress: 0,
    morphProgress: 0,
    currentMorph: 0,
    nextMorph: 1,
    colorEra: 0,
    mouse: { x: -1000, y: -1000, px: 0, py: 0, vx: 0, vy: 0, down: false },
    ripples: [] as { x: number; y: number; t: number }[],
    points: [] as Point[],
    particles: [] as Particle[],
    offscreen: {
      stars: null as HTMLCanvasElement | null,
      rays: null as HTMLCanvasElement | null,
    },
    fps: 60,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId: number;
    const width = window.innerWidth;
    const height = window.innerHeight;
    const dpr = window.devicePixelRatio || 1;
    const isMobile = width < 768;

    const gridCols = isMobile ? 40 : 80;
    const gridRows = isMobile ? 60 : 120;

    // --- INITIALIZATION ---
    const init = () => {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      // Initialize points (Grid)
      const points: Point[] = [];
      const cellW = (width * 0.6) / gridCols;
      const cellH = (height * 0.8) / gridRows;
      const offsetX = width * 0.2;
      const offsetY = height * 0.1;

      for (let j = 0; j <= gridRows; j++) {
        for (let i = 0; i <= gridCols; i++) {
          const x = offsetX + i * cellW;
          const y = offsetY + j * cellH;
          points.push({ x, y, px: x, py: y, rx: x, ry: y, vx: 0, vy: 0 });
        }
      }
      state.current.points = points;

      // Initialize particles
      const particles: Particle[] = [];
      const pCount = isMobile ? 800 : 3000;
      for (let i = 0; i < pCount; i++) {
        particles.push(createParticle(i < pCount * 0.2 ? 'orbit' : 'drift', width, height));
      }
      state.current.particles = particles;

      // Pre-render Stars
      state.current.offscreen.stars = createStarField(width, height);
    };

    const createParticle = (type: any, w: number, h: number): Particle => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      size: Math.random() * 1.5 + 0.5,
      color: PALETTES[0].glow,
      life: 0,
      maxLife: 100 + Math.random() * 200,
      state: type,
    });

    const createStarField = (w: number, h: number) => {
      const c = document.createElement('canvas');
      c.width = w; c.height = h;
      const x = c.getContext('2d')!;
      const img = x.createImageData(w, h);
      const sCount = isMobile ? 2000 : 8000;
      for (let i = 0; i < sCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.pow(Math.random(), 0.5) * Math.max(w, h) * 0.8;
        const px = Math.floor(w / 2 + Math.cos(angle) * radius);
        const py = Math.floor(h / 2 + Math.sin(angle) * radius);
        if (px >= 0 && px < w && py >= 0 && py < h) {
          const idx = (py * w + px) * 4;
          const bright = Math.random() * 255;
          img.data[idx] = 200; img.data[idx+1] = 180; img.data[idx+2] = 150; img.data[idx+3] = bright;
        }
      }
      x.putImageData(img, 0, 0);
      return c;
    };

    // --- PHYSICS & LOGIC ---
    const update = (t: number) => {
      const dt = t - state.current.lastTime;
      state.current.lastTime = t;
      state.current.time = t;

      // Era Logic
      state.current.colorEra = Math.floor((t / COLOR_ERA_DURATION) % 4);
      
      // Morph Logic
      const morphT = (t % MORPH_DURATION) / MORPH_DURATION;
      state.current.morphProgress = morphT;
      state.current.currentMorph = Math.floor((t / MORPH_DURATION) % 6);
      state.current.nextMorph = (state.current.currentMorph + 1) % 6;

      // Physics update
      const { points, particles, mouse, ripples, scrollProgress } = state.current;
      const palette = PALETTES[state.current.colorEra];

      // Update Points (Cloth)
      points.forEach((p, idx) => {
        const i = idx % (gridCols + 1);
        const j = Math.floor(idx / (gridCols + 1));
        const ni = i / gridCols;
        const nj = j / gridRows;

        // Apply Forces (Waves)
        const wave = Math.sin(ni * 4 + t * 0.001) * Math.cos(nj * 3 + t * 0.0007) * 40;
        let tx = p.rx, ty = p.ry + wave;

        // Morph Targets
        if (state.current.currentMorph === 1) { // Pleats
          tx += Math.sin(nj * 12 + t * 0.001) * 30;
        } else if (state.current.currentMorph === 2) { // Spiral
          const dx = p.rx - width / 2, dy = p.ry - height / 2;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const angle = dist * 0.01 * Math.sin(t * 0.0003);
          tx = width / 2 + dx * Math.cos(angle) - dy * Math.sin(angle);
          ty = height / 2 + dx * Math.sin(angle) + dy * Math.cos(angle);
        }

        // Mouse Gravity
        const mdx = p.x - mouse.x, mdy = p.y - mouse.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < 150) {
          const force = (150 - mdist) * 0.1;
          p.vx -= (mdx / mdist) * force;
          p.vy -= (mdy / mdist) * force;
        }

        // Scroll Dispersal
        if (scrollProgress > 0.1) {
          p.vy -= scrollProgress * 5;
        }

        // Verlet Integration
        const vx = (p.x - p.px) * DAMPING + p.vx;
        const vy = (p.y - p.py) * DAMPING + p.vy;
        p.px = p.x; p.py = p.y;
        p.x += vx + (tx - p.x) * 0.05;
        p.y += vy + (ty - p.y) * 0.05;
        p.vx = p.vy = 0;
      });

      // Update Particles
      particles.forEach(p => {
        const dx = p.x - mouse.x, dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const f = 800 / (dist * dist + 10);
          p.vx += (dx / dist) * f;
          p.vy += (dy / dist) * f;
        }
        p.x += p.vx; p.y += p.vy;
        p.vx *= 0.98; p.vy *= 0.98;
        if (p.x < 0) p.x = width; if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height; if (p.y > height) p.y = 0;
        p.color = palette.glow;
      });
    };

    // --- DRAWING ---
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const era = PALETTES[state.current.colorEra];
      const scrollScale = 1 + state.current.scrollProgress * 0.15;
      const opacity = 1 - state.current.scrollProgress;

      ctx.globalAlpha = opacity;
      ctx.save();
      ctx.translate(width / 2, height / 2);
      ctx.scale(scrollScale, scrollScale);
      ctx.translate(-width / 2, -height / 2);

      // Starfield
      if (state.current.offscreen.stars) {
        ctx.drawImage(state.current.offscreen.stars, state.current.mouse.vx * -0.05, state.current.mouse.vy * -0.05);
      }

      // God Rays (Atmosphere)
      drawGodRays(ctx, width, height, era.glow);

      // Cloth Mesh
      ctx.lineWidth = 0.5;
      for (let j = 0; j < gridRows; j++) {
        for (let i = 0; i < gridCols; i++) {
          const idx = j * (gridCols + 1) + i;
          const p1 = state.current.points[idx];
          const p2 = state.current.points[idx + 1];
          const p3 = state.current.points[idx + gridCols + 2];
          const p4 = state.current.points[idx + gridCols + 1];

          // Compute fake normal / iridescent color
          const depth = Math.abs(p1.y - p1.ry) / 50;
          ctx.fillStyle = `hsla(${era.primary[0]}, ${era.primary[1]}%, ${40 + depth * 20}%, 0.4)`;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.lineTo(p3.x, p3.y);
          ctx.lineTo(p4.x, p4.y);
          ctx.closePath();
          ctx.fill();
          
          if (i % 4 === 0 && j % 4 === 0) {
            ctx.strokeStyle = `rgba(255,255,255,${0.1 + depth})`;
            ctx.stroke();
          }
        }
      }

      // Particles
      state.current.particles.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.restore();

      // Custom Cursor
      drawCursor(ctx, state.current.mouse, era.glow);

      animId = requestAnimationFrame(draw);
    };

    const drawGodRays = (ctx: CanvasRenderingContext2D, w: number, h: number, color: string) => {
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 6; i++) {
        const angle = state.current.time * 0.0001 + (i * Math.PI / 3);
        const x = w / 2 + Math.cos(angle) * w;
        const y = -100;
        const grad = ctx.createRadialGradient(x, y, 0, x, y, w * 1.5);
        grad.addColorStop(0, color + '22');
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(w / 2 - 200 + i * 100, h);
        ctx.lineTo(w / 2 + 200 + i * 100, h);
        ctx.fill();
      }
      ctx.restore();
    };

    const drawCursor = (ctx: CanvasRenderingContext2D, m: any, color: string) => {
      ctx.save();
      const s = Math.min(2, 1 + Math.abs(m.vx + m.vy) * 0.05);
      ctx.translate(m.x, m.y);
      ctx.scale(s, 1/s);
      
      // Ring 1
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(0, 0, 12, 0, Math.PI * 2);
      ctx.setLineDash([4, 8]);
      ctx.lineDashOffset = -state.current.time * 0.01;
      ctx.stroke();

      // Core
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(0, 0, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const handleMouseMove = (e: MouseEvent) => {
      const m = state.current.mouse;
      m.vx = e.clientX - m.x;
      m.vy = e.clientY - m.y;
      m.x = e.clientX;
      m.y = e.clientY;
    };

    const handleScroll = () => {
      state.current.scrollProgress = Math.min(1, window.scrollY / window.innerHeight);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    init();
    update(0);
    draw();

    const simInterval = setInterval(() => update(performance.now()), 16);

    return () => {
      cancelAnimationFrame(animId);
      clearInterval(simInterval);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 overflow-hidden bg-[#0A0A0F]">
      <canvas 
        ref={canvasRef} 
        className="block w-full h-full"
        style={{ cursor: 'none' }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/10 to-background pointer-events-none" />
    </div>
  );
};
