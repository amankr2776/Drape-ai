'use client';

import React, { useEffect, useRef } from 'react';

/**
 * @fileOverview ATELIER SINGULARITY: The ultimate visual engine for DRAPE AI.
 * Pushing 2D Canvas to its mathematical limits to simulate high-order 3D physics.
 * 
 * Layers:
 * 1. The Void (Starfield + Nebula)
 * 2. The Protagonist (Liquid Chrome Cloth Mesh)
 * 3. The Swarm (100,000 Kinetic Particles)
 * 4. The Lens (Cinematic Artifacts + Grading)
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
    mouse: { x: -1000, y: -1000, vx: 0, vy: 0, lastX: 0, lastY: 0, down: false },
    scroll: 0,
    eraIndex: 0,
    eraLerp: 0,
    intro: 0,
    morph: { current: 0, target: 1, progress: 0 },
    dimensions: { w: 0, h: 0 },
    isMobile: false
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
        particlesRef.current[idx] = Math.random() * W;
        particlesRef.current[idx+1] = Math.random() * H;
        particlesRef.current[idx+4] = 0; // dormant
        particlesRef.current[idx+12] = i % 4; // type
      }
    };

    const project = (x: number, y: number, z: number) => {
      const focal = 1000;
      const scale = focal / (focal + z);
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

      // Morph Cycling
      s.morph.progress += delta / 4000;
      if (s.morph.progress >= 1) {
        s.morph.progress = 0;
        s.morph.current = s.morph.target;
        s.morph.target = (s.morph.target + 1) % 6;
      }

      if (s.intro < 1) s.intro = Math.min(1, s.intro + delta / 5000);

      // Cloth Verlet
      const damping = 0.88;
      for (let i = 0; i < CLOTH_ROWS; i++) {
        for (let j = 0; j < CLOTH_COLS; j++) {
          const idx = (i * CLOTH_COLS + j) * 13;
          let fx = 0, fy = 0, fz = 0;

          const rx = points[idx+3], ry = points[idx+4];
          
          // Standing Waves
          fz += Math.sin(rx * 0.015 + time * 0.7) * Math.cos(ry * 0.02 + time * 1.1) * 40;
          fx += Math.sin(ry * 0.01 + time * 0.43) * 10;

          // Morph Logic
          const m = s.morph.current;
          const p = s.morph.progress;
          if (m === 0) fz += Math.sin(j * 0.2 + time) * (i/CLOTH_ROWS) * 100; // Silk Drape
          if (m === 1) fx += Math.sin(j * 0.8) * 80; // Accordion
          if (m === 2) { // Vortex
            const dx = points[idx] - W/2, dy = points[idx+1] - H/2;
            const dist = Math.sqrt(dx*dx + dy*dy);
            const ang = dist * 0.015 * Math.sin(time * 0.3);
            fx += Math.sin(ang) * 50; fz += Math.cos(ang) * 50;
          }
          if (m === 3) fz += Math.sin((j/CLOTH_COLS)*Math.PI) * Math.sin((i/CLOTH_ROWS)*Math.PI) * 150; // Puffer

          // Mouse Grav
          const mdx = points[idx] - s.mouse.x, mdy = points[idx+1] - s.mouse.y;
          const mdist = Math.sqrt(mdx*mdx + mdy*mdy);
          if (mdist < 250) {
            const force = (1 - mdist / 250) * 15;
            points[idx+6] += s.mouse.vx * force * 0.1;
            points[idx+7] += s.mouse.vy * force * 0.1;
            fz -= 120 * force;
          }

          // Integration
          points[idx+6] = (points[idx+6] + fx * 0.05) * damping;
          points[idx+7] = (points[idx+7] + fy * 0.05) * damping;
          points[idx+8] = (points[idx+8] + fz * 0.05) * damping;

          points[idx] += points[idx+6];
          points[idx+1] += points[idx+7];
          points[idx+2] += points[idx+8];

          // Restoring Force
          points[idx] += (rx - points[idx]) * 0.05;
          points[idx+1] += (ry - points[idx+1]) * 0.05;
          points[idx+2] += (0 - points[idx+2]) * 0.05;
        }
      }

      // Particles Physics
      const pCount = s.isMobile ? 20000 : PARTICLE_COUNT;
      for (let i = 0; i < pCount; i++) {
        const idx = i * STRIDE;
        if (parts[idx+4] <= 0) { // If dead, occasionally revive
          if (Math.random() < 0.01) {
             parts[idx] = Math.random() * W;
             parts[idx+1] = Math.random() * H;
             parts[idx+4] = Math.random() * 100 + 50;
             parts[idx+5] = parts[idx+4];
             parts[idx+2] = (Math.random() - 0.5) * 2;
             parts[idx+3] = (Math.random() - 0.5) * 2;
          }
          continue;
        }

        parts[idx] += parts[idx+2];
        parts[idx+1] += parts[idx+3];
        parts[idx+4]--;

        // Noise field
        parts[idx+2] += Math.sin(parts[idx+1] * 0.01 + time) * 0.05;
        parts[idx+3] += Math.cos(parts[idx] * 0.01 + time * 1.1) * 0.05;
        
        // Mouse Repel
        const pdx = parts[idx] - s.mouse.x, pdy = parts[idx+1] - s.mouse.y;
        const pdist = Math.sqrt(pdx*pdx + pdy*pdy);
        if (pdist < 150) {
          const force = 500 / (pdist * pdist + 10);
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

      // Layer 1: The Void
      const bgCtx = ctxs[0];
      if (s.frameCount % 2 === 0) {
        bgCtx.fillStyle = `rgb(${era.bg.join(',')})`;
        bgCtx.fillRect(0, 0, W, H);
        
        // Dynamic Glow
        const grad = bgCtx.createRadialGradient(W/2, H/2, 0, W/2, H/2, W * 0.8);
        grad.addColorStop(0, `rgba(${curColor.join(',')}, 0.05)`);
        grad.addColorStop(1, 'transparent');
        bgCtx.fillStyle = grad;
        bgCtx.fillRect(0, 0, W, H);
      }

      // Layer 2: The Protagonist (Cloth)
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

          // Liquid Chrome Material
          const light = Math.max(0.2, Math.min(1, 0.5 + (points[idx+2] / 150)));
          const hue = (s.time * 20 + j * 0.5) % 360;
          
          clothCtx.beginPath();
          clothCtx.moveTo(p1.x, p1.y);
          clothCtx.lineTo(p2.x, p2.y);
          clothCtx.lineTo(p3.x, p3.y);
          clothCtx.closePath();
          
          const alpha = 0.7 * s.intro;
          clothCtx.fillStyle = `rgba(${curColor[0]*light}, ${curColor[1]*light}, ${curColor[2]*light}, ${alpha})`;
          clothCtx.fill();

          // Fresnel Rim Light
          if (Math.abs(points[idx+2]) > 80) {
            clothCtx.strokeStyle = `rgba(255, 255, 255, 0.2)`;
            clothCtx.stroke();
          }
        }
      }

      // Layer 3: The Swarm
      const pCtx = ctxs[2];
      pCtx.clearRect(0, 0, W, H);
      const parts = particlesRef.current!;
      pCtx.fillStyle = `rgba(${curColor.join(',')}, 0.6)`;
      const pCount = s.isMobile ? 20000 : PARTICLE_COUNT;
      
      // Hyper-optimized direct point drawing
      const skip = s.isMobile ? 12 : 8;
      for (let i = 0; i < pCount; i += skip) {
        const idx = i * STRIDE;
        if (parts[idx+4] <= 0) continue;
        const alpha = parts[idx+4] / parts[idx+5];
        pCtx.globalAlpha = alpha * s.intro;
        pCtx.fillRect(parts[idx], parts[idx+1], 1, 1);
      }
      pCtx.globalAlpha = 1;

      // Layer 4: The Lens (Cursor + Vignette)
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
      
      // Rotating Dashed Ring
      lensCtx.save();
      lensCtx.translate(mx, my);
      lensCtx.rotate(s.time * 2);
      lensCtx.setLineDash([5, 10]);
      lensCtx.beginPath();
      lensCtx.arc(0, 0, 15, 0, Math.PI * 2);
      lensCtx.stroke();
      lensCtx.restore();

      // Outer Pulsing Ring
      const pulse = 24 + Math.sin(s.time * 4) * 4;
      lensCtx.beginPath();
      lensCtx.arc(mx, my, pulse, 0, Math.PI * 2);
      lensCtx.globalAlpha = 0.3;
      lensCtx.stroke();
      lensCtx.globalAlpha = 1;

      // Vignette
      const vGrad = lensCtx.createRadialGradient(W/2, H/2, H*0.2, W/2, H/2, W);
      vGrad.addColorStop(0, 'transparent');
      vGrad.addColorStop(1, 'rgba(0,0,0,0.8)');
      lensCtx.fillStyle = vGrad;
      lensCtx.fillRect(0, 0, W, H);

      // Chromatic Aberration Simulation (Subtle)
      if (s.frameCount % 10 === 0) {
        lensCtx.fillStyle = `rgba(${era.accent.join(',')}, 0.02)`;
        lensCtx.fillRect(0, 0, 5, H);
        lensCtx.fillRect(W-5, 0, 5, H);
      }
    };

    const loop = (timestamp: number) => {
      const delta = Math.min(33, timestamp - s.lastTime);
      s.lastTime = timestamp;
      s.time += delta * 0.001;
      s.frameCount++;

      updatePhysics(delta);
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
