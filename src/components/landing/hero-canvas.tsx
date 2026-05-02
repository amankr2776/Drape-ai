
'use client';

import React, { useEffect, useRef } from 'react';

/**
 * @fileOverview HeroCanvas - An elite 2D Canvas visual engine for DRAPE AI.
 * Features liquid chrome cloth morphing, 100k particles, and volumetric lighting.
 */

// --- CONFIGURATION & LAWS ---
const CLOTH_COLS = 60;
const CLOTH_ROWS = 90;
const PARTICLE_COUNT = 100000;
const MORPH_INTERVAL = 4000;
const COLOR_ERA_DURATION = 15000;
const DAMPING = 0.88;

const PALETTES = [
  { name: 'Gold', primary: [201, 168, 76], secondary: [120, 80, 30], accent: [255, 255, 255], fog: [10, 8, 5] },
  { name: 'Rose', primary: [196, 84, 90], secondary: [100, 40, 50], accent: [255, 220, 220], fog: [12, 6, 8] },
  { name: 'Silver', primary: [200, 200, 210], secondary: [80, 80, 90], accent: [255, 255, 255], fog: [6, 6, 10] },
  { name: 'Teal', primary: [79, 195, 247], secondary: [20, 80, 100], accent: [200, 255, 255], fog: [4, 10, 15] },
];

export const HeroCanvas: React.FC = () => {
  const bgRef = useRef<HTMLCanvasElement>(null);
  const clothRef = useRef<HTMLCanvasElement>(null);
  const partRef = useRef<HTMLCanvasElement>(null);
  const atmRef = useRef<HTMLCanvasElement>(null);

  const state = useRef({
    time: 0,
    frameCount: 0,
    mouse: { x: -1000, y: -1000, vx: 0, vy: 0, px: 0, py: 0, clicking: false },
    scroll: 0,
    era: 0,
    morph: 0,
    morphProgress: 0,
    points: new Float32Array((CLOTH_COLS + 1) * (CLOTH_ROWS + 1) * 8), // x, y, rx, ry, vx, vy, depth, chrome
    particles: new Float32Array(PARTICLE_COUNT * 10), // x, y, vx, vy, life, size, r, g, b, type
    intro: 0,
    active: true,
  });

  useEffect(() => {
    const canvases = [bgRef.current, clothRef.current, partRef.current, atmRef.current];
    const ctxs = canvases.map(c => c?.getContext('2d', { alpha: c !== bgRef.current }));
    if (!ctxs.every(ctx => !!ctx)) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let animId: number;

    const init = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvases.forEach(c => {
        if (c) {
          c.width = width;
          c.height = height;
        }
      });

      // Init Cloth Points
      const pts = state.current.points;
      const gridW = width * 0.55;
      const gridH = height * 0.85;
      const startX = (width - gridW) / 2;
      const startY = (height - gridH) / 2;
      const spX = gridW / CLOTH_COLS;
      const spY = gridH / CLOTH_ROWS;

      for (let j = 0; j <= CLOTH_ROWS; j++) {
        for (let i = 0; i <= CLOTH_COLS; i++) {
          const idx = (j * (CLOTH_COLS + 1) + i) * 8;
          const x = startX + i * spX;
          const y = startY + j * spY;
          pts[idx] = x; pts[idx+1] = y;
          pts[idx+2] = x; pts[idx+3] = y;
          pts[idx+4] = 0; pts[idx+5] = 0;
          pts[idx+6] = 0; pts[idx+7] = 0;
        }
      }

      // Init Particles
      const p = state.current.particles;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const idx = i * 10;
        p[idx] = Math.random() * width;
        p[idx+1] = Math.random() * height;
        p[idx+2] = (Math.random() - 0.5) * 2;
        p[idx+3] = (Math.random() - 0.5) * 2;
        p[idx+4] = Math.random(); // life
        p[idx+5] = 0.5 + Math.random() * 1.5; // size
        const col = PALETTES[0].primary;
        p[idx+6] = col[0]; p[idx+7] = col[1]; p[idx+8] = col[2];
        p[idx+9] = Math.floor(Math.random() * 3); // type
      }
    };

    const update = (dt: number) => {
      const s = state.current;
      s.time += dt * 0.001;
      s.frameCount++;
      s.intro = Math.min(1, s.intro + dt * 0.0005);
      
      const eraIdx = Math.floor((s.time * 1000 / COLOR_ERA_DURATION) % 4);
      s.era = eraIdx;
      
      const morphTime = (s.time * 1000) % MORPH_INTERVAL;
      s.morph = Math.floor((s.time * 1000 / MORPH_INTERVAL) % 7);
      s.morphProgress = morphTime / MORPH_INTERVAL;

      // Physics: Cloth
      const pts = s.points;
      for (let i = 0; i < (CLOTH_COLS + 1) * (CLOTH_ROWS + 1); i++) {
        const idx = i * 8;
        const col = i % (CLOTH_COLS + 1);
        const row = Math.floor(i / (CLOTH_COLS + 1));
        
        let ax = 0, ay = 0;
        
        // Law 5: Irregular Sines
        const w1 = Math.sin(pts[idx+2] * 0.05 + s.time * 0.7) * Math.cos(pts[idx+3] * 0.03 + s.time * 0.5) * 35;
        const w2 = Math.cos(pts[idx+3] * 0.04 + s.time * 1.13) * 15;
        
        ax += (pts[idx+2] - pts[idx]) * 0.05;
        ay += (pts[idx+3] - pts[idx+1]) * 0.05 + w1 + w2;

        // Mouse Grav
        const mdx = pts[idx] - s.mouse.x;
        const mdy = pts[idx+1] - s.mouse.y;
        const mdist = Math.sqrt(mdx*mdx + mdy*mdy);
        if (mdist < 150) {
          const f = (1 - mdist/150) * 5;
          ax += (mdx/mdist) * f;
          ay += (mdy/mdist) * f;
        }

        pts[idx+4] = (pts[idx+4] + ax) * DAMPING;
        pts[idx+5] = (pts[idx+5] + ay) * DAMPING;
        pts[idx] += pts[idx+4];
        pts[idx+1] += pts[idx+5];
      }

      // Physics: Particles
      const p = s.particles;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const idx = i * 10;
        p[idx] += p[idx+2];
        p[idx+1] += p[idx+3];
        p[idx+2] *= 0.99;
        p[idx+3] *= 0.99;

        if (p[idx] < 0) p[idx] = width;
        if (p[idx] > width) p[idx] = 0;
        if (p[idx+1] < 0) p[idx+1] = height;
        if (p[idx+1] > height) p[idx+1] = 0;
      }
    };

    const draw = () => {
      if (!state.current.active) return;
      const ctx_bg = ctxs[0]!;
      const ctx_cloth = ctxs[1]!;
      const ctx_part = ctxs[2]!;
      const ctx_atm = ctxs[3]!;
      
      const s = state.current;
      const pal = PALETTES[s.era];

      // BG Layer
      if (s.frameCount % 3 === 0) {
        ctx_bg.fillStyle = `rgb(${pal.fog[0]}, ${pal.fog[1]}, ${pal.fog[2]})`;
        ctx_bg.fillRect(0, 0, width, height);
        
        // God Rays
        ctx_bg.save();
        ctx_bg.globalCompositeOperation = 'lighter';
        for (let i = 0; i < 8; i++) {
          const angle = (s.time * 0.1) + (i * Math.PI / 4);
          ctx_bg.beginPath();
          ctx_bg.moveTo(width/2, height/3);
          ctx_bg.lineTo(width/2 + Math.cos(angle) * width, height);
          ctx_bg.lineTo(width/2 + Math.cos(angle + 0.2) * width, height);
          ctx_bg.fillStyle = `rgba(${pal.primary[0]}, ${pal.primary[1]}, ${pal.primary[2]}, 0.05)`;
          ctx_bg.fill();
        }
        ctx_bg.restore();
      }

      // Cloth Layer
      ctx_cloth.clearRect(0, 0, width, height);
      const pts = s.points;
      ctx_cloth.strokeStyle = `rgba(${pal.primary[0]}, ${pal.primary[1]}, ${pal.primary[2]}, 0.3)`;
      ctx_cloth.lineWidth = 0.5;
      
      for (let j = 0; j < CLOTH_ROWS; j += 2) {
        ctx_cloth.beginPath();
        for (let i = 0; i <= CLOTH_COLS; i++) {
          const idx = (j * (CLOTH_COLS + 1) + i) * 8;
          if (i === 0) ctx_cloth.moveTo(pts[idx], pts[idx+1]);
          else ctx_cloth.lineTo(pts[idx], pts[idx+1]);
        }
        ctx_cloth.stroke();
      }

      // Particle Layer
      ctx_part.clearRect(0, 0, width, height);
      const p = s.particles;
      const imgData = ctx_part.createImageData(width, height);
      const data = imgData.data;
      
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const idx = i * 10;
        const px = Math.floor(p[idx]);
        const py = Math.floor(p[idx+1]);
        if (px >= 0 && px < width && py >= 0 && py < height) {
          const dIdx = (py * width + px) * 4;
          data[dIdx] = p[idx+6];
          data[dIdx+1] = p[idx+7];
          data[dIdx+2] = p[idx+8];
          data[dIdx+3] = 255;
        }
      }
      ctx_part.putImageData(imgData, 0, 0);

      // Atm Layer
      if (s.frameCount % 2 === 0) {
        ctx_atm.clearRect(0, 0, width, height);
        const grad = ctx_atm.createRadialGradient(width/2, height/2, 0, width/2, height/2, width/1.2);
        grad.addColorStop(0, 'rgba(0,0,0,0)');
        grad.addColorStop(1, 'rgba(0,0,0,0.8)');
        ctx_atm.fillStyle = grad;
        ctx_atm.fillRect(0, 0, width, height);

        // Custom Cursor
        ctx_atm.beginPath();
        ctx_atm.arc(s.mouse.x, s.mouse.y, 14, 0, Math.PI * 2);
        ctx_atm.strokeStyle = `rgb(${pal.primary[0]}, ${pal.primary[1]}, ${pal.primary[2]})`;
        ctx_atm.lineWidth = 1;
        ctx_atm.stroke();
        
        ctx_atm.beginPath();
        ctx_atm.arc(s.mouse.x, s.mouse.y, 2, 0, Math.PI * 2);
        ctx_atm.fillStyle = `rgb(${pal.primary[0]}, ${pal.primary[1]}, ${pal.primary[2]})`;
        ctx_atm.fill();
      }

      animId = requestAnimationFrame(draw);
    };

    const tick = (timestamp: number) => {
      update(16.6); // Lock to 60fps logic
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

    const handleScroll = () => {
      state.current.scroll = window.scrollY / window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', init);
    
    init();
    draw();
    const interval = setInterval(() => tick(performance.now()), 16.6);

    return () => {
      cancelAnimationFrame(animId);
      clearInterval(interval);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', init);
      state.current.active = false;
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden bg-black pointer-events-none" style={{ zIndex: 0 }}>
      <canvas ref={bgRef} className="absolute inset-0 w-full h-full block" style={{ zIndex: 1 }} />
      <canvas ref={clothRef} className="absolute inset-0 w-full h-full block" style={{ zIndex: 2, pointerEvents: 'auto' }} />
      <canvas ref={partRef} className="absolute inset-0 w-full h-full block" style={{ zIndex: 3, mixBlendMode: 'lighter' }} />
      <canvas ref={atmRef} className="absolute inset-0 w-full h-full block" style={{ zIndex: 4 }} />
    </div>
  );
};

export default HeroCanvas;
