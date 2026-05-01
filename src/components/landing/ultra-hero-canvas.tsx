'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass.js';
import { AfterimagePass } from 'three/examples/jsm/postprocessing/AfterimagePass.js';
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js';

/**
 * @fileOverview ULTRA CINEMATIC HERO CANVAS
 * Features: Morphing Cloth, 50k Sentient Particles, DNA Strands, 
 * Magnetic Cursor, Click Ripples, and multi-pass Post-Processing.
 */

// --- SHADERS ---

const fabricVertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uMorphProgress;
  uniform float uMorphTarget; // 0: ripple, 1: pleats, 2: spiral, 3: inflate, 4: explode
  uniform float uScroll;
  uniform float uRippleTime;
  uniform vec2 uRippleOrigin;

  void main() {
    vUv = uv;
    vec3 pos = position;
    
    // Base wave
    float wave = sin(pos.x * 2.0 + uTime) * cos(pos.y * 1.5 + uTime * 0.8) * 0.2;
    
    // Mouse Warp
    float dist = distance(pos.xy, uMouse * 3.5);
    float mouseInfluence = smoothstep(2.5, 0.0, dist);
    pos.z += sin(dist * 5.0 - uTime * 4.0) * 0.3 * mouseInfluence;
    pos.z += mouseInfluence * 0.5;

    // Click Ripple
    float rDist = distance(pos.xy, uRippleOrigin * 4.0);
    float rAge = uTime - uRippleTime;
    if(rAge > 0.0 && rAge < 2.0) {
      float ripple = sin(rDist * 10.0 - rAge * 15.0) * 0.5 * (1.0 - rAge / 2.0) * smoothstep(1.5, 0.0, rDist - rAge * 5.0);
      pos.z += ripple;
    }

    // Morph Logic
    float pleats = sin(pos.x * 12.0) * 0.3;
    float spiral = atan(pos.y, pos.x) * 0.2; 
    float inflate = length(pos.xy) < 2.5 ? (1.5 - length(pos.xy) * 0.5) : 0.0;
    
    float targetY = 0.0;
    if(uMorphTarget < 1.0) targetY = mix(0.0, pleats, uMorphProgress);
    else if (uMorphTarget < 2.0) targetY = mix(pleats, spiral, uMorphProgress);
    else if (uMorphTarget < 3.0) targetY = mix(spiral, inflate, uMorphProgress);
    else if (uMorphTarget < 4.0) targetY = mix(inflate, wave, uMorphProgress);
    else targetY = mix(wave, 0.0, uMorphProgress);

    pos.z += targetY;

    // Scroll dissolution
    pos.z -= uScroll * 8.0;
    pos.xy *= (1.0 - uScroll * 0.4);

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    vViewPosition = -mvPosition.xyz;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fabricFragmentShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  uniform float uTime;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uColorPhase;

  void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(vViewPosition);
    
    // Fresnel
    float fresnel = pow(1.0 - dot(viewDir, normal), 3.0);
    
    // Iridescence
    float angle = dot(viewDir, normal);
    vec3 baseColor = mix(uColorA, uColorB, uColorPhase);
    vec3 irid = mix(baseColor, vec3(1.0, 0.9, 0.8), abs(sin(angle * 4.0 + uTime * 0.5)));
    
    // Procedural weave
    float weave = step(0.5, fract(vUv.x * 150.0)) * step(0.5, fract(vUv.y * 150.0));
    vec3 finalColor = mix(irid, vec3(1.0), fresnel * 0.6);
    finalColor += weave * 0.03;

    gl_FragColor = vec4(finalColor, 0.85);
  }
`;

const particleVertexShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uPhase; // 0: Form, 1: Explode, 2: Drift, 3: Implode
  uniform float uScroll;
  attribute float aSize;
  attribute vec3 aTarget;
  attribute float aPhaseOffset;
  varying vec3 vColor;
  varying float vOpacity;

  void main() {
    vec3 pos = position;
    
    // Interaction - Parts the sea
    float dist = distance(pos.xy, uMouse * 5.0);
    if(dist < 2.0) {
      pos += normalize(pos - vec3(uMouse * 5.0, 0.0)) * (2.0 - dist) * 0.8;
    }

    // Phase Logic
    float t = mod(uTime * 0.15 + aPhaseOffset, 1.0);
    vec3 targetPos = mix(pos, aTarget, smoothstep(0.0, 0.3, t));
    targetPos = mix(targetPos, pos + normalize(pos) * 5.0, smoothstep(0.3, 0.6, t));
    targetPos = mix(targetPos, pos, smoothstep(0.6, 1.0, t));

    pos = targetPos;

    // Scroll
    pos.y += uScroll * 15.0;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = aSize * (400.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
    
    vColor = vec3(1.0, 0.84, 0.4); // Gold
    vOpacity = smoothstep(0.0, 0.1, t) * (1.0 - smoothstep(0.9, 1.0, t));
  }
`;

const particleFragmentShader = `
  varying vec3 vColor;
  varying float vOpacity;
  void main() {
    float d = distance(gl_PointCoord, vec2(0.5));
    if(d > 0.5) discard;
    gl_FragColor = vec4(vColor, vOpacity * (1.0 - d * 2.0));
  }
`;

export const UltraHeroCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>(0);
  const mouse = useRef({ x: 0, y: 0, v: 0 });
  const scroll = useRef(0);
  const ripple = useRef({ time: 0, x: 0, y: 0 });
  const [introFinished, setIntroFinished] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const isMobile = width < 768;

    // --- SETUP ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !isMobile });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    containerRef.current.appendChild(renderer.domElement);

    // --- POST PROCESSING ---
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));

    const bloomPass = new UnrealBloomPass(new THREE.Vector2(width, height), isMobile ? 0.7 : 1.5, 0.6, 0.1);
    composer.addPass(bloomPass);

    if (!isMobile) {
      composer.addPass(new FilmPass(0.15, 0.05, 648, false));
      composer.addPass(new AfterimagePass(0.96));
      const glitch = new GlitchPass();
      glitch.enabled = false;
      composer.addPass(glitch);
      
      // Random glitch trigger
      const glitchInterval = setInterval(() => {
        glitch.enabled = true;
        setTimeout(() => { glitch.enabled = false; }, 300);
      }, 10000);
      
      // Cleanup for interval
      (window as any)._glitchInterval = glitchInterval;
    }

    // --- GEOMETRIES ---

    // 1. Hero Cloth
    const fabricGeo = new THREE.PlaneGeometry(5, 7, isMobile ? 60 : 200, isMobile ? 60 : 200);
    const fabricMat = new THREE.ShaderMaterial({
      vertexShader: fabricVertexShader,
      fragmentShader: fabricFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uMorphProgress: { value: 0 },
        uMorphTarget: { value: 0 },
        uScroll: { value: 0 },
        uRippleTime: { value: 0 },
        uRippleOrigin: { value: new THREE.Vector2(0, 0) },
        uColorA: { value: new THREE.Color('#C4545A') },
        uColorB: { value: new THREE.Color('#C9A84C') },
        uColorPhase: { value: 0 },
      },
      transparent: true,
      side: THREE.DoubleSide,
    });
    const cloth = new THREE.Mesh(fabricGeo, fabricMat);
    cloth.position.set(0, 0, -1);
    scene.add(cloth);

    // 2. DNA Strands
    const helixGroup = new THREE.Group();
    const createStrand = (color: string, offset: number) => {
      const points = [];
      for (let i = 0; i <= 100; i++) {
        const t = i / 100;
        points.push(new THREE.Vector3(Math.sin(t * Math.PI * 8 + offset) * 0.5, (t - 0.5) * 15, Math.cos(t * Math.PI * 8 + offset) * 0.5));
      }
      const curve = new THREE.CatmullRomCurve3(points);
      const geo = new THREE.TubeGeometry(curve, 100, 0.015, 8, false);
      const mat = new THREE.MeshPhysicalMaterial({ color, metalness: 0.8, roughness: 0.2 });
      return new THREE.Mesh(geo, mat);
    };
    const strand1 = createStrand('#C9A84C', 0);
    const strand2 = createStrand('#C4545A', Math.PI);
    helixGroup.add(strand1, strand2);
    helixGroup.position.set(-6, 0, -2);
    const helix2 = helixGroup.clone();
    helix2.position.x = 6;
    scene.add(helixGroup, helix2);

    // 3. Sentient Particles
    const pCount = isMobile ? 8000 : 50000;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    const pTargets = new Float32Array(pCount * 3);
    const pSizes = new Float32Array(pCount);
    const pPhaseOffsets = new Float32Array(pCount);

    for (let i = 0; i < pCount; i++) {
      pPos[i * 3] = (Math.random() - 0.5) * 12;
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 6;
      
      // Target Silhouette (Dress shape formula)
      const t = i / pCount;
      const angle = t * Math.PI * 2;
      const r = 1.0 + Math.sin(angle * 3.0) * 0.2;
      pTargets[i * 3] = Math.cos(angle) * r;
      pTargets[i * 3 + 1] = t * 4.0 - 2.0;
      pTargets[i * 3 + 2] = Math.sin(angle) * r * 0.5;

      pSizes[i] = Math.random() * 0.06 + 0.01;
      pPhaseOffsets[i] = Math.random();
    }

    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    pGeo.setAttribute('aTarget', new THREE.BufferAttribute(pTargets, 3));
    pGeo.setAttribute('aSize', new THREE.BufferAttribute(pSizes, 1));
    pGeo.setAttribute('aPhaseOffset', new THREE.BufferAttribute(pPhaseOffsets, 1));

    const pMat = new THREE.ShaderMaterial({
      vertexShader: particleVertexShader,
      fragmentShader: particleFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uScroll: { value: 0 },
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // --- INTERACTION ---
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / width) * 2 - 1;
      mouse.current.y = -(e.clientY / height) * 2 + 1;
    };
    const handleClick = () => {
      ripple.current = { time: clock.getElapsedTime(), x: mouse.current.x, y: mouse.current.y };
      fabricMat.uniforms.uRippleTime.value = ripple.current.time;
      fabricMat.uniforms.uRippleOrigin.value.set(ripple.current.x, ripple.current.y);
    };
    const handleScroll = () => {
      scroll.current = window.scrollY / (height * 1.5);
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleClick);
    window.addEventListener('scroll', handleScroll);

    // --- ANIMATION ---
    const clock = new THREE.Clock();
    const palettes = [
      { a: '#C9A84C', b: '#C4545A' }, // Gold/Rose
      { a: '#C4545A', b: '#F5F0E8' }, // Rose/Ivory
      { a: '#F5F0E8', b: '#4FC3F7' }, // Ivory/Teal
      { a: '#4FC3F7', b: '#C9A84C' }  // Teal/Gold
    ];

    const animate = () => {
      const elapsed = clock.getElapsedTime();
      
      // Update Uniforms
      fabricMat.uniforms.uTime.value = elapsed;
      fabricMat.uniforms.uMouse.value.lerp(new THREE.Vector2(mouse.current.x, mouse.current.y), 0.05);
      fabricMat.uniforms.uScroll.value = THREE.MathUtils.lerp(fabricMat.uniforms.uScroll.value, scroll.current, 0.1);
      
      // Color Cycle (60s)
      const colorIdx = Math.floor((elapsed % 60) / 15);
      const nextIdx = (colorIdx + 1) % 4;
      const colorProgress = (elapsed % 15) / 15;
      const paletteA = new THREE.Color(palettes[colorIdx].a).lerp(new THREE.Color(palettes[nextIdx].a), colorProgress);
      const paletteB = new THREE.Color(palettes[colorIdx].b).lerp(new THREE.Color(palettes[nextIdx].b), colorProgress);
      fabricMat.uniforms.uColorA.value = paletteA;
      fabricMat.uniforms.uColorB.value = paletteB;
      fabricMat.uniforms.uColorPhase.value = Math.abs(Math.sin(elapsed * 0.2));

      // Morph Targets (10s cycle)
      const morphT = elapsed % 10.0;
      fabricMat.uniforms.uMorphTarget.value = Math.floor(morphT / 2.0);
      fabricMat.uniforms.uMorphProgress.value = (morphT % 2.0) / 2.0;

      pMat.uniforms.uTime.value = elapsed;
      pMat.uniforms.uMouse.value.copy(fabricMat.uniforms.uMouse.value);
      pMat.uniforms.uScroll.value = fabricMat.uniforms.uScroll.value;

      // Camera System
      const lissajousX = Math.sin(elapsed * 0.5) * 0.1;
      const lissajousY = Math.cos(elapsed * 0.3) * 0.08;
      camera.position.z = 5 + Math.sin(elapsed * 0.4) * 0.2 + scroll.current * 4.0;
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, mouse.current.x * 0.4 + lissajousX, 0.03);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, mouse.current.y * 0.3 + lissajousY, 0.03);
      camera.lookAt(0, 0, -2);

      // Intro Logic
      if (!introFinished && elapsed > 4.0) setIntroFinished(true);

      // DNA Helix movement
      helixGroup.rotation.y += 0.01;
      helix2.rotation.y -= 0.01;
      helixGroup.position.y = Math.sin(elapsed * 0.5) * 0.5;
      helix2.position.y = Math.cos(elapsed * 0.5) * 0.5;

      composer.render();
      requestRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleClick);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(requestRef.current);
      if ((window as any)._glitchInterval) clearInterval((window as any)._glitchInterval);
      renderer.dispose();
      fabricGeo.dispose();
      fabricMat.dispose();
      pGeo.dispose();
      pMat.dispose();
      strand1.geometry.dispose();
      strand1.material.dispose();
      if(containerRef.current) containerRef.current.innerHTML = '';
    };
  }, [introFinished]);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 z-0 pointer-events-none bg-[#0A0A0F]"
      style={{ background: 'radial-gradient(circle at center, #0A0A0F 0%, #000000 100%)' }}
    >
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-primary/20 overflow-hidden">
        {!introFinished && (
           <div className="h-full bg-primary animate-loading-bar" style={{ width: '100%' }} />
        )}
      </div>
      <style jsx>{`
        @keyframes loading-bar {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        .animate-loading-bar {
          animation: loading-bar 4s linear forwards;
        }
      `}</style>
    </div>
  );
};
