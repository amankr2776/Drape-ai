'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass.js';
import { AfterimagePass } from 'three/examples/jsm/postprocessing/AfterimagePass.js';
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js';

/**
 * @fileOverview ULTRA HERO CANVAS
 * A master-class WebGL experience featuring morphing cloth, 
 * 50k particle systems, and cinematic post-processing.
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

  void main() {
    vUv = uv;
    vec3 pos = position;
    
    // Base wave
    float wave = sin(pos.x * 2.0 + uTime) * cos(pos.y * 1.5 + uTime * 0.8) * 0.2;
    
    // Mouse Warp
    float dist = distance(pos.xy, uMouse * 3.0);
    float mouseInfluence = smoothstep(2.0, 0.0, dist);
    pos.z += sin(dist * 5.0 - uTime * 4.0) * 0.3 * mouseInfluence;
    pos.z += mouseInfluence * 0.4;

    // Morph Logic
    float pleats = sin(pos.x * 10.0) * 0.2;
    float spiral = pos.z; // Abstracted
    float inflate = length(pos.xy) < 2.0 ? 0.5 : 0.0;
    
    if(uMorphTarget < 1.0) {
      pos.z += mix(0.0, pleats, uMorphProgress);
    } else if (uMorphTarget < 2.0) {
      pos.z += mix(pleats, sin(length(pos.xy)*4.0 - uTime)*0.5, uMorphProgress);
    } else if (uMorphTarget < 3.0) {
      pos.z += mix(0.0, inflate, uMorphProgress);
    } else {
      pos.z += wave;
    }

    // Scroll dissolution
    pos.z -= uScroll * 5.0;
    pos.xy *= (1.0 - uScroll * 0.5);

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

  void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(vViewPosition);
    
    // Fresnel effect for glowy edges
    float fresnel = pow(1.0 - dot(viewDir, normal), 3.0);
    
    // Iridescence
    float angle = dot(viewDir, normal);
    vec3 irid = mix(uColorA, uColorB, abs(sin(angle * 3.0 + uTime * 0.5)));
    
    // Procedural weave
    float weave = step(0.5, fract(vUv.x * 100.0)) * step(0.5, fract(vUv.y * 100.0));
    vec3 finalColor = mix(irid, vec3(1.0), fresnel * 0.5);
    finalColor += weave * 0.05;

    gl_FragColor = vec4(finalColor, 0.9);
  }
`;

const particleVertexShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uPhase; // 0: Form, 1: Explode, 2: Drift, 3: Implode
  uniform float uScroll;
  attribute float aSize;
  attribute vec3 aTarget;
  varying vec3 vColor;

  void main() {
    vec3 pos = position;
    
    // Interaction
    float dist = distance(pos.xy, uMouse * 4.0);
    if(dist < 1.5) {
      pos += normalize(pos - vec3(uMouse * 4.0, 0.0)) * (1.5 - dist) * 0.5;
    }

    // Explode/Implode logic abstracted for brevity
    float t = sin(uTime * 0.2) * 0.5 + 0.5;
    pos = mix(pos, aTarget, t);

    // Scroll
    pos.y += uScroll * 10.0;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = aSize * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
    vColor = vec3(1.0, 0.8, 0.4);
  }
`;

const particleFragmentShader = `
  varying vec3 vColor;
  void main() {
    float d = distance(gl_PointCoord, vec2(0.5));
    if(d > 0.5) discard;
    gl_FragColor = vec4(vColor, 1.0 - d * 2.0);
  }
`;

export const UltraHeroCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>(0);
  const mouse = useRef({ x: 0, y: 0, v: 0 });
  const scroll = useRef(0);

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

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(width, height),
      isMobile ? 0.6 : 1.2, 0.4, 0.1
    );
    composer.addPass(bloomPass);

    if (!isMobile) {
      composer.addPass(new FilmPass(0.1, 0.025, 648, false));
      composer.addPass(new AfterimagePass(0.95));
    }

    // --- OBJECTS ---

    // 1. Hero Cloth
    const fabricGeo = new THREE.PlaneGeometry(4, 6, isMobile ? 60 : 200, isMobile ? 60 : 200);
    const fabricMat = new THREE.ShaderMaterial({
      vertexShader: fabricVertexShader,
      fragmentShader: fabricFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uMorphProgress: { value: 0 },
        uMorphTarget: { value: 0 },
        uScroll: { value: 0 },
        uColorA: { value: new THREE.Color('#C4545A') },
        uColorB: { value: new THREE.Color('#C9A84C') },
      },
      transparent: true,
      side: THREE.DoubleSide,
    });
    const cloth = new THREE.Mesh(fabricGeo, fabricMat);
    cloth.position.set(-1, 0, -1);
    scene.add(cloth);

    // 2. Particle System
    const pCount = isMobile ? 8000 : 50000;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    const pTargets = new Float32Array(pCount * 3);
    const pSizes = new Float32Array(pCount);

    for (let i = 0; i < pCount; i++) {
      pPos[i * 3] = (Math.random() - 0.5) * 10;
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 5;
      
      // Target: a simple dress-like cone for the prototype
      pTargets[i * 3] = (Math.random() - 0.5) * 2.0 * (i / pCount);
      pTargets[i * 3 + 1] = (i / pCount) * 4.0 - 2.0;
      pTargets[i * 3 + 2] = Math.sin(i * 0.1) * 0.5;

      pSizes[i] = Math.random() * 0.05 + 0.01;
    }

    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    pGeo.setAttribute('aTarget', new THREE.BufferAttribute(pTargets, 3));
    pGeo.setAttribute('aSize', new THREE.BufferAttribute(pSizes, 1));

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

    // 3. Liquid Rings
    const rings: THREE.Mesh[] = [];
    const ringMat = new THREE.MeshPhysicalMaterial({ 
      color: 0xC9A84C, metalness: 1, roughness: 0.1, transmission: 0.5 
    });
    for(let i=0; i<5; i++) {
      const r = new THREE.Mesh(new THREE.TorusGeometry(0.5 + i*0.2, 0.02, 16, 100), ringMat);
      r.rotation.x = Math.random() * Math.PI;
      r.position.z = -1;
      scene.add(r);
      rings.push(r);
    }

    // --- LIGHTING ---
    scene.add(new THREE.AmbientLight(0xC9A84C, 0.2));
    const pointLight = new THREE.PointLight(0xF5F0E8, 2);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // --- EVENTS ---
    const handleMouseMove = (e: MouseEvent) => {
      const prevX = mouse.current.x;
      mouse.current.x = (e.clientX / width) * 2 - 1;
      mouse.current.y = -(e.clientY / height) * 2 + 1;
      mouse.current.v = Math.abs(mouse.current.x - prevX);
    };
    const handleScroll = () => {
      scroll.current = window.scrollY / (height * 0.8);
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    // --- ANIMATION LOOP ---
    const clock = new THREE.Clock();
    
    const animate = () => {
      const elapsed = clock.getElapsedTime();
      
      // Update Uniforms
      fabricMat.uniforms.uTime.value = elapsed;
      fabricMat.uniforms.uMouse.value.lerp(new THREE.Vector2(mouse.current.x, mouse.current.y), 0.1);
      fabricMat.uniforms.uScroll.value = THREE.MathUtils.lerp(fabricMat.uniforms.uScroll.value, scroll.current, 0.1);
      
      // Morph Cycle
      const phase = Math.floor(elapsed / 4) % 5;
      fabricMat.uniforms.uMorphTarget.value = phase;
      fabricMat.uniforms.uMorphProgress.value = (elapsed % 4) / 4;

      pMat.uniforms.uTime.value = elapsed;
      pMat.uniforms.uMouse.value.copy(fabricMat.uniforms.uMouse.value);
      pMat.uniforms.uScroll.value = fabricMat.uniforms.uScroll.value;

      // Camera Breathing
      camera.position.z = 5 + Math.sin(elapsed * 0.5) * 0.2 + scroll.current * 3.0;
      camera.rotation.y = THREE.MathUtils.lerp(camera.rotation.y, mouse.current.x * 0.1, 0.05);
      camera.rotation.x = THREE.MathUtils.lerp(camera.rotation.x, mouse.current.y * 0.05, 0.05);

      // Rings
      rings.forEach((r, i) => {
        r.rotation.y += 0.01 * (i + 1);
        r.rotation.z += 0.005;
        r.scale.setScalar(1.0 - scroll.current);
      });

      composer.render();
      requestRef.current = requestAnimationFrame(animate);
    };

    animate();

    // --- CLEANUP ---
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(requestRef.current);
      renderer.dispose();
      fabricGeo.dispose();
      fabricMat.dispose();
      pGeo.dispose();
      pMat.dispose();
      ringMat.dispose();
      rings.forEach(r => r.geometry.dispose());
      if(containerRef.current) containerRef.current.innerHTML = '';
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 z-0 pointer-events-none bg-black"
      style={{ background: 'radial-gradient(circle at center, #0A0A0F 0%, #000000 100%)' }}
    />
  );
};
