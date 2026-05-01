'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { AfterimagePass } from 'three/examples/jsm/postprocessing/AfterimagePass';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment';

/**
 * @fileOverview DrapeHeroCanvas - A cinematic Three.js WebGL experience.
 * Replicates the activetheory.net style with glowing objects, gold particles, and volumetric shafts.
 */

export const DrapeHeroCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const composerRef = useRef<EffectComposer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const clockRef = useRef(new THREE.Clock());
  
  // Interaction Refs
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, vX: 0, vY: 0, lastX: 0, lastY: 0 });
  const isClicking = useRef(false);
  const clickStartTime = useRef(0);
  const bloomPassRef = useRef<UnrealBloomPass | null>(null);

  // Object Refs
  const gemGroup = useRef<THREE.Group | null>(null);
  const innerRing = useRef<THREE.Mesh | null>(null);
  const outerRing = useRef<THREE.Mesh | null>(null);
  const secondaryObjects = useRef<THREE.Group[]>([]);
  const lightColumns = useRef<THREE.Mesh[]>([]);
  
  // Particles
  const particlesRef = useRef<THREE.Points | null>(null);
  const particleVelocities = useRef<Float32Array | null>(null);
  const particleOriginals = useRef<Float32Array | null>(null);
  const streamParticles = useRef<THREE.Points | null>(null);
  const streamCurve = useRef<THREE.CatmullRomCurve3 | null>(null);
  const starField = useRef<THREE.Points | null>(null);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    // --- INITIALIZATION ---
    const width = window.innerWidth;
    const height = window.innerHeight;
    const isMob = width < 768;
    setIsMobile(isMob);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000005);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.z = 8;
    cameraRef.current = camera;

    // Environment Map for Chrome Reflections
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;

    // --- POST PROCESSING ---
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));

    const bloomPass = new UnrealBloomPass(new THREE.Vector2(width, height), 2.0, 1.0, 0.1);
    composer.addPass(bloomPass);
    bloomPassRef.current = bloomPass;

    if (!isMob) {
      const afterimagePass = new AfterimagePass(0.94);
      composer.addPass(afterimagePass);
    }

    const filmPass = new FilmPass(0.15, 0.025, 648, 0); 
    composer.addPass(filmPass);
    
    const outputPass = new OutputPass();
    composer.addPass(outputPass);
    composerRef.current = composer;

    // --- LIGHTING ---
    const ambientLight = new THREE.AmbientLight(0xC9A84C, 0.1);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xC9A84C, 3.0, 10);
    pointLight1.position.set(2, 2, 3);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xC4545A, 1.5, 10);
    pointLight2.position.set(-3, -1, 2);
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(0xFFFFFF, 0.5, 15);
    pointLight3.position.set(0, 5, -2);
    scene.add(pointLight3);

    // --- HERO GEM ---
    const gem = new THREE.Group();
    gem.scale.setScalar(0);
    const gemGeo = new THREE.IcosahedronGeometry(0.9, 1);
    const gemMat = new THREE.MeshPhysicalMaterial({
      color: 0xC9A84C,
      metalness: 1.0,
      roughness: 0.0,
      envMapIntensity: 3.0,
      transmission: 0.3,
      thickness: 1.0,
    });
    const gemMesh = new THREE.Mesh(gemGeo, gemMat);
    gem.add(gemMesh);

    const wireMat = new THREE.MeshBasicMaterial({ color: 0xC9A84C, wireframe: true, opacity: 0.15, transparent: true });
    const wireMesh = new THREE.Mesh(gemGeo, wireMat);
    wireMesh.scale.setScalar(1.01);
    gem.add(wireMesh);
    scene.add(gem);
    gemGroup.current = gem;

    // Rings
    const innerRingGeo = new THREE.TorusGeometry(1.1, 0.008, 3, 80);
    const innerRingMat = new THREE.MeshBasicMaterial({ color: 0xC9A84C, opacity: 0, transparent: true });
    const iRing = new THREE.Mesh(innerRingGeo, innerRingMat);
    scene.add(iRing);
    innerRing.current = iRing;

    const outerRingGeo = new THREE.TorusGeometry(1.8, 0.004, 8, 100);
    const outerRingMat = new THREE.MeshBasicMaterial({ color: 0xC4545A, opacity: 0, transparent: true });
    const oRing = new THREE.Mesh(outerRingGeo, outerRingMat);
    oRing.rotation.x = Math.PI / 4;
    scene.add(oRing);
    outerRing.current = oRing;

    // --- SECONDARY OBJECTS ---
    const createObject = (geo: THREE.BufferGeometry, mat: THREE.Material, pos: [number, number, number]) => {
      const g = new THREE.Group();
      const mesh = new THREE.Mesh(geo, mat);
      g.add(mesh);
      g.position.set(...pos);
      g.visible = false;
      scene.add(g);
      secondaryObjects.current.push(g);
      return g;
    };

    const goldMat = new THREE.MeshPhysicalMaterial({ color: 0xC9A84C, metalness: 1, roughness: 0, transmission: 0.8 });
    const roseMat = new THREE.MeshPhysicalMaterial({ color: 0xC4545A, metalness: 0.9, roughness: 0.2 });
    const ivoryMat = new THREE.MeshPhysicalMaterial({ color: 0xF5F0E8, metalness: 0.7, roughness: 0.1 });

    createObject(new THREE.OctahedronGeometry(0.25), goldMat, [-3, 1.5, -2]);
    createObject(new THREE.CylinderGeometry(0.08, 0.12, 0.4), roseMat, [2.5, -1, -1]);
    createObject(new THREE.TorusGeometry(0.2, 0.04, 16, 40), goldMat, [-2, -2, -3]);
    createObject(new THREE.TetrahedronGeometry(0.18), ivoryMat, [3, 2, -4]);
    createObject(new THREE.IcosahedronGeometry(0.15, 0), new THREE.MeshBasicMaterial({ color: 0xC9A84C, wireframe: true }), [-3.5, -0.5, -2]);
    createObject(new THREE.ConeGeometry(0.06, 0.5, 4), goldMat, [1.5, 2.5, -3]);

    // --- PARTICLE SYSTEM ---
    const pCount = isMob ? 8000 : 30000;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    const pVels = new Float32Array(pCount * 3);
    const pOrigs = new Float32Array(pCount * 3);
    const pColors = new Float32Array(pCount * 3);
    const pSpeed = new Float32Array(pCount);
    const pOffset = new Float32Array(pCount);
    const pSize = new Float32Array(pCount);

    const goldColor = new THREE.Color(0xC9A84C);
    const roseColor = new THREE.Color(0xC4545A);

    for (let i = 0; i < pCount; i++) {
      const x = (Math.random() - 0.5) * 16;
      const y = (Math.random() - 0.5) * 10;
      const z = (Math.random() - 0.5) * 10 - 3;
      pPos[i * 3] = x; pPos[i * 3 + 1] = y; pPos[i * 3 + 2] = z;
      pOrigs[i * 3] = x; pOrigs[i * 3 + 1] = y; pOrigs[i * 3 + 2] = z;
      pVels[i * 3] = 0; pVels[i * 3 + 1] = 0; pVels[i * 3 + 2] = 0;
      
      const c = Math.random() > 0.7 ? roseColor : goldColor;
      pColors[i * 3] = c.r; pColors[i * 3 + 1] = c.g; pColors[i * 3 + 2] = c.b;
      
      pSpeed[i] = Math.random() * 0.5 + 0.2;
      pOffset[i] = Math.random() * Math.PI * 2;
      pSize[i] = Math.random() * 2.5 + 0.5;
    }

    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(pColors, 3));
    pGeo.setAttribute('aSpeed', new THREE.BufferAttribute(pSpeed, 1));
    pGeo.setAttribute('aOffset', new THREE.BufferAttribute(pOffset, 1));
    pGeo.setAttribute('aSize', new THREE.BufferAttribute(pSize, 1));

    const pMat = new THREE.ShaderMaterial({
      transparent: true,
      vertexColors: true,
      uniforms: { uTime: { value: 0 } },
      vertexShader: `
        uniform float uTime;
        attribute float aSpeed;
        attribute float aOffset;
        attribute float aSize;
        varying vec3 vColor;
        void main() {
          vColor = color;
          vec3 pos = position;
          pos.x += sin(uTime * aSpeed + aOffset) * 0.002;
          pos.y += cos(uTime * aSpeed * 0.7 + aOffset) * 0.001;
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = aSize * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if(dist > 0.5) discard;
          float alpha = (1.0 - (dist * 2.0)) * 0.6;
          alpha = pow(alpha, 2.0);
          gl_FragColor = vec4(vColor, alpha);
        }
      `
    });

    const particles = new THREE.Points(pGeo, pMat);
    particles.visible = false;
    scene.add(particles);
    particlesRef.current = particles;
    particleVelocities.current = pVels;
    particleOriginals.current = pOrigs;

    // --- GOLD STREAM ---
    const streamCount = 200;
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-6, -4, -2),
      new THREE.Vector3(-2, 0, 1),
      new THREE.Vector3(2, -1, 0),
      new THREE.Vector3(6, 4, -2),
    ]);
    streamCurve.current = curve;
    const sGeo = new THREE.BufferGeometry();
    const sPos = new Float32Array(streamCount * 3);
    sGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3));
    const sPoints = new THREE.Points(sGeo, new THREE.PointsMaterial({ color: 0xC9A84C, size: 0.05, transparent: true, opacity: 0.8 }));
    scene.add(sPoints);
    streamParticles.current = sPoints;

    // --- LIGHT COLUMNS ---
    if (!isMob) {
      const createColumn = (color: number, x: number) => {
        const colGeo = new THREE.CylinderGeometry(0, 0.3, 12, 16);
        const colMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.04, blending: THREE.AdditiveBlending });
        const col = new THREE.Mesh(colGeo, colMat);
        col.position.set(x, 0, -5);
        scene.add(col);
        lightColumns.current.push(col);
      };
      createColumn(0xC9A84C, 0);
      createColumn(0xC4545A, -4);
      createColumn(0xC9A84C, 4);
    }

    // --- STAR FIELD ---
    const starCount = 5000;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 40;
      starPos[i * 3 + 1] = (Math.random() - 0.5) * 40;
      starPos[i * 3 + 2] = -20 + Math.random() * 15;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xFFFFFF, size: 0.02, transparent: true, opacity: 0 }));
    scene.add(stars);
    starField.current = stars;

    // --- EVENTS ---
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = (e.clientX / width) * 2 - 1;
      mouseRef.current.targetY = -(e.clientY / height) * 2 + 1;
      mouseRef.current.vX = (e.clientX - mouseRef.current.lastX) * 0.01;
      mouseRef.current.lastX = e.clientX;
    };

    const handleClick = () => {
      isClicking.current = true;
      clickStartTime.current = clockRef.current.getElapsedTime();
      
      // Explosion burst on click
      const vels = particleVelocities.current!;
      const pos = particlesRef.current!.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < pCount; i++) {
        const dx = pos[i * 3];
        const dy = pos[i * 3 + 1];
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        vels[i * 3] += (dx / dist) * 0.1;
        vels[i * 3 + 1] += (dy / dist) * 0.1;
      }

      if (bloomPassRef.current) {
        bloomPassRef.current.strength = 4.0;
        setTimeout(() => { if (bloomPassRef.current) bloomPassRef.current.strength = 2.0; }, 300);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);

    // --- ANIMATION LOOP ---
    const animate = () => {
      const t = clockRef.current.getElapsedTime();
      
      // Update Uniforms
      if (particlesRef.current) {
        (particlesRef.current.material as THREE.ShaderMaterial).uniforms.uTime.value = t;
      }

      // Mouse Lerp
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      // Camera Breathing & Tilt
      if (cameraRef.current) {
        cameraRef.current.position.z = 8 + Math.sin(t * 0.4) * 0.3;
        cameraRef.current.rotation.y = mouseRef.current.x * 0.12;
        cameraRef.current.rotation.x = mouseRef.current.y * -0.08;
      }

      // Intro Sequence
      if (gemGroup.current && t < 5) {
        const s = Math.min(1, Math.max(0, (t - 0.5) / 1));
        gemGroup.current.scale.setScalar(s);
        if (innerRing.current) {
           (innerRing.current.material as THREE.MeshBasicMaterial).opacity = Math.max(0, (t - 1.5) / 0.5) * 0.7;
           innerRing.current.scale.setScalar(Math.min(1, Math.max(0, (t - 1.5) / 0.5)));
        }
        if (outerRing.current) {
           (outerRing.current.material as THREE.MeshBasicMaterial).opacity = Math.max(0, (t - 2) / 0.5) * 0.5;
           outerRing.current.scale.setScalar(Math.min(1, Math.max(0, (t - 2) / 0.5)));
        }
        if (particlesRef.current) particlesRef.current.visible = t > 2.5;
        if (starField.current) (starField.current.material as THREE.PointsMaterial).opacity = Math.min(0.8, (t - 3.5) / 0.5);
      }

      // Main Gem Loop
      if (gemGroup.current) {
        gemGroup.current.rotation.y += 0.003 + Math.abs(mouseRef.current.vX) * 0.2;
        gemGroup.current.rotation.x += 0.001;
        gemGroup.current.position.y = Math.sin(t * 0.8) * 0.1;
        
        // Key light orbit
        pointLight1.position.x = Math.sin(t * 0.5) * 3;
        pointLight1.position.z = Math.cos(t * 0.5) * 3;

        // Click Response
        if (isClicking.current) {
          const elapsed = t - clickStartTime.current;
          if (elapsed < 0.5) {
            const scale = 1 + Math.sin(elapsed * Math.PI * 2) * 0.3;
            gemGroup.current.scale.setScalar(scale);
          } else {
            gemGroup.current.scale.setScalar(1);
            isClicking.current = false;
          }
        }
      }

      if (innerRing.current) innerRing.current.rotation.x += 0.008;
      if (outerRing.current) {
        outerRing.current.rotation.z += 0.005;
        outerRing.current.rotation.x += mouseRef.current.y * 0.05;
      }

      // Particles Physics (CPU simulation for repulsion)
      if (particlesRef.current) {
        const pos = particlesRef.current.geometry.attributes.position.array as Float32Array;
        const vels = particleVelocities.current!;
        const origs = particleOriginals.current!;
        for (let i = 0; i < pCount; i++) {
          const px = pos[i * 3];
          const py = pos[i * 3 + 1];
          
          // Repulsion from mouse
          const dx = px - mouseRef.current.x * 5;
          const dy = py - mouseRef.current.y * 5;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 1.5) {
            const f = 0.003;
            vels[i * 3] += (dx / dist) * f;
            vels[i * 3 + 1] += (dy / dist) * f;
          }
          
          // Friction & Velocity update
          pos[i * 3] += vels[i * 3];
          pos[i * 3 + 1] += vels[i * 3 + 1];
          vels[i * 3] *= 0.95;
          vels[i * 3 + 1] *= 0.95;
          
          // Return to origin damping
          pos[i * 3] += (origs[i * 3] - pos[i * 3]) * 0.01;
          pos[i * 3 + 1] += (origs[i * 3 + 1] - pos[i * 3 + 1]) * 0.01;
        }
        particlesRef.current.geometry.attributes.position.needsUpdate = true;
      }

      // Gold Stream update
      if (streamParticles.current && streamCurve.current) {
        const sPos = streamParticles.current.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < streamCount; i++) {
          const pt = ((i / streamCount) + t * 0.1) % 1;
          const point = streamCurve.current.getPoint(pt);
          sPos[i * 3] = point.x + Math.sin(t + i) * 0.05;
          sPos[i * 3 + 1] = point.y + Math.cos(t + i) * 0.05;
          sPos[i * 3 + 2] = point.z;
        }
        streamParticles.current.geometry.attributes.position.needsUpdate = true;
      }

      // Secondary Objects animation
      secondaryObjects.current.forEach((g, i) => {
        if (t > 3) g.visible = true;
        const freq = 0.3 + (i * 0.1);
        const amp = 0.006 + (i * 0.001);
        g.position.y += Math.sin(t * freq + i) * amp;
        g.rotation.y += 0.01;
        g.rotation.x += 0.005;
      });

      // Stars Parallax
      if (starField.current) {
        starField.current.rotation.y += 0.0001;
        starField.current.position.x = mouseRef.current.x * 0.05;
      }
      lightColumns.current.forEach(col => {
        col.rotation.y += 0.001;
      });

      if (composerRef.current) composerRef.current.render();
      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h);
      composer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    const handleVisibilityChange = () => {
      if (document.hidden) clockRef.current.stop();
      else clockRef.current.start();
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      
      renderer.dispose();
      scene.traverse(obj => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
          else obj.material.dispose();
        }
      });
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 z-0 pointer-events-none overflow-hidden" 
      style={{ background: '#000005' }}
    />
  );
};
