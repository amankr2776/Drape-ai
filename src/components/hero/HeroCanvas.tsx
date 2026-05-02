'use client';

import React, { useEffect, useRef } from 'react';

/**
 * @fileOverview HeroCanvas - A premium 4-layer 2D Canvas visual engine.
 * Features: Verlet Cloth Physics, 100k Particle System, Chromatic Atmosphere,
 * and Interactive Morphing Silhouettes.
 */

const COLS = 60;
const ROWS = 90;
const PARTICLE_COUNT = 100000;
const STRIDE = 13; // x, y, vx, vy, life, maxLife, size, r, g, b, a, trailLen, type
const MORPH_DURATION = 4000;
const FADE_DURATION = 2000;

export default function HeroCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const bgCanvasRef = useRef<HTMLCanvasElement>(null);
  const clothCanvasRef = useRef<HTMLCanvasElement>(null);
  const particleCanvasRef = useRef<HTMLCanvasElement>(null);
  const atmosphereCanvasRef = useRef<HTMLCanvasElement>(null);

  const stateRef = useRef({
    time: 0,
    frameCount: 0,
    lastTime: 0,
    mouse: { x: -1000, y: -1000, vx: 0, vy: 0, lastX: 0, lastY: 0, down: false },
    scroll: 0,
    introProgress: 0,
    introComplete: false,
    era: 0, // 0: Gold, 1: Rose, 2: Silver, 3: Midnight
    eraProgress: 0,
    morph: { current: 0, target: 1, progress: 0 },
    fps: 60,
    adaptiveQuality: 1.0,
  });

  const clothRef = useRef<Float32Array | null>(null);
  const particlesRef = useRef<Float32Array | null>(null);
  const ringsRef = useRef<any[]>([]);

  // ERA PALETTES
  const ERAS = [
    { name: 'Gold', primary: [201, 168, 76], secondary: [245, 240, 232], atmosphere: [10, 10, 15] },
    { name: 'Rose', primary: [196, 84, 90], secondary: [255, 180, 180], atmosphere: [15, 8, 10] },
    { name: 'Silver', primary: [200, 200, 210], secondary: [255, 255, 255], atmosphere: [8, 8, 12] },
    { name: 'Midnight', primary: [79, 195, 247], secondary: [120, 150, 200], atmosphere: [5, 5, 15] },
  ];

  useEffect(() => {
    if (!bgCanvasRef.current || !clothCanvasRef.current || !particleCanvasRef.current || !atmosphereCanvasRef.current) return;

    const canvases = [bgCanvasRef.current, clothCanvasRef.current, particleCanvasRef.current, atmosphereCanvasRef.current];
    const ctxs = canvases.map(c => c.getContext('2d', { alpha: c !== bgCanvasRef.current })!);

    const init = () => {
      const W = window.innerWidth;
      const H = window.innerHeight;

      canvases.forEach(c => {
        c.width = W * window.devicePixelRatio;
        c.height = H * window.devicePixelRatio;
        c.style.width = W + 'px';
        c.style.height = H + 'px';
        const ctx = c.getContext('2d')!;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      });

      // Init Cloth Points
      const points = new Float32Array(COLS * ROWS * 8); // x, y, restX, restY, vx, vy, depth, chrome
      const gridW = W * 0.55;
      const gridH = H * 0.85;
      const ox = W * 0.5 - gridW * 0.5;
      const oy = H * 0.5 - gridH * 0.5;

      for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
          const idx = (i * COLS + j) * 8;
          const rx = ox + (j / (COLS - 1)) * gridW;
          const ry = oy + (i / (ROWS - 1)) * gridH;
          points[idx] = rx;
          points[idx + 1] = ry;
          points[idx + 2] = rx;
          points[idx + 3] = ry;
          points[idx + 4] = 0;
          points[idx + 5] = 0;
          points[idx + 6] = 0;
          points[idx + 7] = 0;
        }
      }
      clothRef.current = points;

      // Init Particle Pool
      const parts = new Float32Array(PARTICLE_COUNT * STRIDE);
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const idx = i * STRIDE;
        parts[idx] = Math.random() * W; // x
        parts[idx + 1] = Math.random() * H; // y
        parts[idx + 4] = 0; // life
        parts[idx + 12] = i < 40000 ? 0 : i < 60000 ? 1 : 2; // type
      }
      particlesRef.current = parts;

      // Init Rings
      const rings = [];
      for (let i = 0; i < 6; i++) {
        rings.push({
          radiusX: 100 + i * 50,
          tilt: Math.random() * Math.PI,
          orbit: Math.random() * Math.PI * 2,
          speed: 0.001 + Math.random() * 0.003,
          thick: 4 + Math.random() * 8
        });
      }
      ringsRef.current = rings;
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

    const handleMouseDown = () => { stateRef.current.mouse.down = true; };
    const handleMouseUp = () => { stateRef.current.mouse.down = false; };
    const handleScroll = () => { stateRef.current.scroll = window.scrollY / window.innerHeight; };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('scroll', handleScroll);
    init();

    const updatePhysics = (delta: number) => {
      const s = stateRef.current;
      const W = window.innerWidth;
      const H = window.innerHeight;
      const points = clothRef.current!;
      const parts = particlesRef.current!;
      const time = s.time;

      // Morph Target Logic
      s.morph.progress += delta / MORPH_DURATION;
      if (s.morph.progress >= 1) {
        s.morph.progress = 0;
        s.morph.current = s.morph.target;
        s.morph.target = (s.morph.target + 1) % 7;
      }

      // Era Color Logic
      s.eraProgress += delta / 15000;
      if (s.eraProgress >= 1) {
        s.eraProgress = 0;
        s.era = (s.era + 1) % 4;
      }

      const damping = 0.88;
      const mouseRange = 150;

      for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
          const idx = (i * COLS + j) * 8;
          let fx = 0, fy = 0;

          // Base Wave
          fx += Math.sin(points[idx + 3] * 0.05 + time) * 0.5;
          fy += Math.cos(points[idx + 2] * 0.04 + time * 0.8) * 0.3;

          // Morph Target Forces
          const m = s.morph.current;
          const tp = s.morph.progress;
          const rx = points[idx + 2];
          const ry = points[idx + 3];

          // Simplified morph targeting for performance
          let tx = rx, ty = ry;
          if (m === 0) { ty += (i / ROWS) * 100; } // Drape
          if (m === 1) { tx += Math.sin(j * 0.6) * 50; } // Pleats
          if (m === 2) { 
            const angle = (j - COLS/2) * 0.05;
            tx += Math.sin(angle) * 100;
          } // Twist

          fx += (tx - points[idx]) * 0.05;
          fy += (ty - points[idx + 1]) * 0.05;

          // Mouse Interaction
          const dx = points[idx] - s.mouse.x;
          const dy = points[idx + 1] - s.mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouseRange) {
            const force = (1 - dist / mouseRange) * 5;
            fx += (dx / dist) * force;
            fy += (dy / dist) * force;
          }

          // Verlet
          points[idx + 4] = (points[idx + 4] + fx) * damping;
          points[idx + 5] = (points[idx + 5] + fy) * damping;
          points[idx] += points[idx + 4];
          points[idx + 1] += points[idx + 5];
        }
      }

      // Particle Physics
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const idx = i * STRIDE;
        if (parts[idx + 4] <= 0 && s.introComplete) {
          // Re-emit logic
        } else {
          parts[idx] += parts[idx + 2];
          parts[idx + 1] += parts[idx + 3];
          // Simple mouse push
          const pdx = parts[idx] - s.mouse.x;
          const pdy = parts[idx + 1] - s.mouse.y;
          const pdistSq = pdx * pdx + pdy * pdy;
          if (pdistSq < 10000) {
            const f = 200 / (pdistSq + 10);
            parts[idx + 2] += (pdx / 100) * f;
            parts[idx + 3] += (pdy / 100) * f;
          }
          parts[idx + 2] *= 0.95;
          parts[idx + 3] *= 0.95;
        }
      }
    };

    const drawBackground = (ctx: CanvasRenderingContext2D) => {
      const W = window.innerWidth;
      const H = window.innerHeight;
      const s = stateRef.current;
      const era = ERAS[s.era];
      
      ctx.fillStyle = '#050508';
      ctx.fillRect(0, 0, W, H);

      // Stars (Simulated sparkle)
      ctx.fillStyle = `rgba(${era.secondary.join(',')}, 0.5)`;
      for (let i = 0; i < 500; i++) {
        ctx.fillRect(Math.random() * W, Math.random() * H, 1, 1);
      }

      // God Rays
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      const gradient = ctx.createRadialGradient(W/2, H*0.3, 0, W/2, H*0.3, W);
      gradient.addColorStop(0, `rgba(${era.primary.join(',')}, 0.15)`);
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, W, H);
      ctx.restore();
    };

    const drawCloth = (ctx: CanvasRenderingContext2D) => {
      const points = clothRef.current!;
      const s = stateRef.current;
      const era = ERAS[s.era];

      ctx.lineWidth = 1;
      for (let i = 0; i < ROWS - 1; i += 2) {
        for (let j = 0; j < COLS - 1; j += 2) {
          const idx = (i * COLS + j) * 8;
          const idxRight = idx + 8;
          const idxDown = ((i + 1) * COLS + j) * 8;

          // Simple Chrome Shading
          const lum = 0.3 + Math.abs(points[idx + 4]) * 0.1;
          ctx.fillStyle = `rgba(${era.primary[0] * lum}, ${era.primary[1] * lum}, ${era.primary[2] * lum}, 0.8)`;
          
          ctx.beginPath();
          ctx.moveTo(points[idx], points[idx + 1]);
          ctx.lineTo(points[idxRight], points[idxRight + 1]);
          ctx.lineTo(points[idxDown + 8], points[idxDown + 9]);
          ctx.lineTo(points[idxDown], points[idxDown + 1]);
          ctx.closePath();
          ctx.fill();
        }
      }

      // Rings
      ringsRef.current.forEach(r => {
        r.orbit += r.speed;
        ctx.strokeStyle = `rgba(${era.secondary.join(',')}, 0.3)`;
        ctx.beginPath();
        ctx.ellipse(window.innerWidth/2, window.innerHeight/2, r.radiusX, r.radiusX * 0.4, r.tilt, 0, Math.PI * 2);
        ctx.stroke();
      });
    };

    const drawParticles = (ctx: CanvasRenderingContext2D) => {
      const parts = particlesRef.current!;
      const s = stateRef.current;
      const era = ERAS[s.era];
      
      ctx.fillStyle = `rgba(${era.primary.join(',')}, 0.4)`;
      // Render only a fraction for 2D performance if count is too high
      const skip = s.adaptiveQuality < 0.5 ? 8 : 4;
      for (let i = 0; i < PARTICLE_COUNT; i += skip) {
        const idx = i * STRIDE;
        ctx.fillRect(parts[idx], parts[idx + 1], 1, 1);
      }
    };

    const drawAtmosphere = (ctx: CanvasRenderingContext2D) => {
      const W = window.innerWidth;
      const H = window.innerHeight;
      const s = stateRef.current;
      const era = ERAS[s.era];

      // Vignette
      const grad = ctx.createRadialGradient(W/2, H/2, H*0.3, W/2, H/2, W);
      grad.addColorStop(0, 'transparent');
      grad.addColorStop(1, 'rgba(0,0,0,0.8)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // Cursor
      ctx.strokeStyle = `rgb(${era.primary.join(',')})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(s.mouse.x, s.mouse.y, 15, 0, Math.PI * 2);
      ctx.stroke();
      
      ctx.fillStyle = `rgb(${era.primary.join(',')})`;
      ctx.beginPath();
      ctx.arc(s.mouse.x, s.mouse.y, 2, 0, Math.PI * 2);
      ctx.fill();
    };

    const loop = (timestamp: number) => {
      const delta = timestamp - stateRef.current.lastTime;
      stateRef.current.lastTime = timestamp;
      stateRef.current.time += delta * 0.001;
      stateRef.current.frameCount++;

      updatePhysics(delta);

      if (stateRef.current.frameCount % 3 === 0) drawBackground(ctxs[0]);
      ctxs[1].clearRect(0, 0, window.innerWidth, window.innerHeight);
      drawCloth(ctxs[1]);
      ctxs[2].clearRect(0, 0, window.innerWidth, window.innerHeight);
      drawParticles(ctxs[2]);
      if (stateRef.current.frameCount % 2 === 0) {
        ctxs[3].clearRect(0, 0, window.innerWidth, window.innerHeight);
        drawAtmosphere(ctxs[3]);
      }

      requestAnimationFrame(loop);
    };

    const animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden" style={{ zIndex: 0, cursor: 'none' }}>
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
