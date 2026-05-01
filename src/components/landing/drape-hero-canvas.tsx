'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { AfterimagePass } from 'three/examples/jsm/postprocessing/AfterimagePass';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment';

/**
 * @fileOverview DrapeHeroCanvas - A cinematic Three.js WebGL hero experience.
 * Replicates the activetheory.net style with glowing objects, particle trails, and volumetric shafts.
 */

export const DrapeHeroCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    const isMobile = width < 768;

    // --- RENDERER ---
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    containerRef.current.appendChild(renderer.domElement);

    // --- SCENE & CAMERA ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000005);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.z = 8;

    // Environment Map
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;

    // --- POST PROCESSING ---
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));

    const bloomPass = new UnrealBloomPass(new THREE.Vector2(width, height), 2.0, 1.0, 0.1);
    composer.addPass(bloomPass);

    let afterimagePass: AfterimagePass | null = null;
    if (!isMobile) {
      afterimagePass = new AfterimagePass(0.94);
      composer.addPass(afterimagePass);
    }

    const filmPass = new FilmPass(0.15, 0.025, 648, 0); 
    composer.addPass(filmPass);
    
    const outputPass = new OutputPass();
    composer.addPass(outputPass);

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

    // --- HERO CENTERPIECE (DRAPE GEM) ---
    const gemGroup = new THREE.Group();
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
    gemGroup.add(gemMesh);

    const wireMat = new THREE.MeshBasicMaterial({ color: 0xC9A84C, wireframe: true, opacity: 0.15, transparent: true });
    const wireMesh = new THREE.Mesh(gemGeo, wireMat);
    wireMesh.scale.setScalar(1.01);
    gemGroup.add(wireMesh);
    
    gemGroup.scale.setScalar(0.001); // Start hidden for intro
    scene.add(gemGroup);

    // Core Ring
    const innerRingGeo = new THREE.TorusGeometry(1.1, 0.008, 3, 80);
    const innerRingMat = new THREE.MeshBasicMaterial({ color: 0xC9A84C, opacity: 0, transparent: true });
    const innerRing = new THREE.Mesh(innerRingGeo, innerRingMat);
    scene.add(innerRing);

    // Outer Orbit
    const outerRingGeo = new THREE.TorusGeometry(1.8, 0.004, 8, 100);
    const outerRingMat = new THREE.MeshBasicMaterial({ color: 0xC4545A, opacity: 0, transparent: true });
    const outerRing = new THREE.Mesh(outerRingGeo, outerRingMat);
    outerRing.rotation.x = Math.PI / 4;
    scene.add(outerRing);

    // --- SECONDARY OBJECTS ---
    const secondaryObjects: THREE.Group[] = [];
    const goldMat = new THREE.MeshPhysicalMaterial({ color: 0xC9A84C, metalness: 1, roughness: 0, transmission: 0.8 });
    const roseMat = new THREE.MeshPhysicalMaterial({ color: 0xC4545A, metalness: 0.9, roughness: 0.2 });
    const ivoryMat = new THREE.MeshPhysicalMaterial({ color: 0xF5F0E8, metalness: 0.7, roughness: 0.1 });

    const createObject = (geo: THREE.BufferGeometry, mat: THREE.Material, pos: [number, number, number], name: string) => {
      const g = new THREE.Group();
      const mesh = new THREE.Mesh(geo, mat);
      g.add(mesh);
      g.position.set(...pos);
      g.visible = false;
      g.userData = { 
        baseY: pos[1], 
        freq: 0.3 + Math.random() * 0.6, 
        amp: 0.004 + Math.random() * 0.008,
        phase: Math.random() * Math.PI * 2
      };
      scene.add(g);
      secondaryObjects.push(g);
    };

    createObject(new THREE.OctahedronGeometry(0.25), goldMat, [-3, 1.5, -2], 'diamond');
    createObject(new THREE.CylinderGeometry(0.08, 0.12, 0.4, 16), roseMat, [2.5, -1, -1], 'bottle');
    createObject(new THREE.TorusGeometry(0.2, 0.04, 16, 40), goldMat, [-2, -2, -3], 'ring');
    createObject(new THREE.TetrahedronGeometry(0.18), ivoryMat, [3, 2, -4], 'shard');
    createObject(new THREE.IcosahedronGeometry(0.15, 0), new THREE.MeshBasicMaterial({ color: 0xC9A84C, wireframe: true }), [-3.5, -0.5, -2], 'mini');
    createObject(new THREE.ConeGeometry(0.06, 0.5, 4), goldMat, [1.5, 2.5, -3], 'needle');

    // --- MAIN PARTICLE SYSTEM ---
    const pCount = isMobile ? 8000 : 30000;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    const pVel = new Float32Array(pCount * 3);
    const pOrig = new Float32Array(pCount * 3);
    const pColor = new Float32Array(pCount * 3);
    const pSpeed = new Float32Array(pCount);
    const pOffset = new Float32Array(pCount);
    const pSize = new Float32Array(pCount);

    const colorGold = new THREE.Color(0xC9A84C);
    const colorRose = new THREE.Color(0xC4545A);

    for (let i = 0; i < pCount; i++) {
      const x = (Math.random() - 0.5) * 16;
      const y = (Math.random() - 0.5) * 10;
      const z = (Math.random() - 0.5) * 10 - 3;
      pPos[i * 3] = x; pPos[i * 3 + 1] = y; pPos[i * 3 + 2] = z;
      pOrig[i * 3] = x; pOrig[i * 3 + 1] = y; pOrig[i * 3 + 2] = z;
      pVel[i * 3] = 0; pVel[i * 3 + 1] = 0; pVel[i * 3 + 2] = 0;

      const c = Math.random() > 0.7 ? colorRose : colorGold;
      pColor[i * 3] = c.r; pColor[i * 3 + 1] = c.g; pColor[i * 3 + 2] = c.b;
      
      pSpeed[i] = Math.random() * 0.5 + 0.2;
      pOffset[i] = Math.random() * Math.PI * 2;
      pSize[i] = Math.random() * 2.5 + 0.5;
    }

    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(pColor, 3));
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
    particles.visible = false; // Fade in intro
    scene.add(particles);

    // --- GOLD PARTICLE STREAM ---
    const streamCount = 200;
    const streamCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-6, -4, -2),
      new THREE.Vector3(-3, -1, 1),
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(3, 1, 1),
      new THREE.Vector3(6, 4, -2),
    ]);
    const sGeo = new THREE.BufferGeometry();
    const sPos = new Float32Array(streamCount * 3);
    sGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3));
    const sPoints = new THREE.Points(sGeo, new THREE.PointsMaterial({ color: 0xC9A84C, size: 0.05, transparent: true, opacity: 0.8 }));
    scene.add(sPoints);

    // --- VOLUMETRIC LIGHT COLUMNS ---
    const lightColumns: THREE.Mesh[] = [];
    if (!isMobile) {
      const createColumn = (color: number, x: number) => {
        const colGeo = new THREE.CylinderGeometry(0, 0.3, 12, 16);
        const colMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.04, blending: THREE.AdditiveBlending });
        const col = new THREE.Mesh(colGeo, colMat);
        col.position.set(x, 0, -5);
        col.visible = false;
        scene.add(col);
        lightColumns.push(col);
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
    const starMat = new THREE.PointsMaterial({ color: 0xFFFFFF, size: 0.02, transparent: true, opacity: 0 });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // --- MOUSE TRACKING ---
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0, vX: 0, vY: 0, lastX: 0, lastY: 0 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = (e.clientX / width) * 2 - 1;
      mouse.targetY = -(e.clientY / height) * 2 + 1;
      mouse.vX = (e.clientX - mouse.lastX) * 0.01;
      mouse.lastX = e.clientX;
    };

    // --- INTERACTION: CLICK ---
    let clickAnim = { active: false, start: 0 };
    const handleClick = () => {
      clickAnim.active = true;
      clickAnim.start = performance.now();
      
      // Outward burst
      const pos = particles.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < pCount; i++) {
        const dx = pos[i * 3];
        const dy = pos[i * 3 + 1];
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        pVel[i * 3] += (dx / dist) * 0.1;
        pVel[i * 3 + 1] += (dy / dist) * 0.1;
      }

      bloomPass.strength = 4.0;
      setTimeout(() => { bloomPass.strength = 2.0; }, 300);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);

    // --- ANIMATION LOOP ---
    const clock = new THREE.Clock();
    let animFrame: number;

    const animate = () => {
      const t = clock.getElapsedTime();
      pMat.uniforms.uTime.value = t;

      // Mouse Lerp
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Camera Breathing & Motion
      camera.position.z = 8 + Math.sin(t * 0.4) * 0.3;
      camera.rotation.y = mouse.x * 0.12;
      camera.rotation.x = mouse.y * -0.08;

      // Intro Sequence Logic
      if (t < 5) {
        const gemS = Math.min(1, Math.max(0.001, (t - 0.5) / 1.0));
        gemGroup.scale.setScalar(gemS);
        
        innerRingMat.opacity = Math.max(0, (t - 1.5) / 0.5) * 0.7;
        outerRingMat.opacity = Math.max(0, (t - 2.0) / 0.5) * 0.5;
        
        if (t > 2.5) particles.visible = true;
        lightColumns.forEach(c => { if (t > 3.0) c.visible = true; });
        starMat.opacity = Math.min(0.8, (t - 3.5) / 0.5);
      }

      // Hero Gem Animation
      gemGroup.rotation.y += 0.003 + Math.abs(mouse.vX) * 0.2;
      gemGroup.rotation.x += 0.001;
      gemGroup.position.y = Math.sin(t * 0.8) * 0.1;

      // Orbiting Key Light
      pointLight1.position.x = Math.sin(t * 0.5) * 3;
      pointLight1.position.z = Math.cos(t * 0.5) * 3;

      // Rings Animation
      innerRing.rotation.x += 0.008;
      outerRing.rotation.z += 0.005;
      outerRing.rotation.x = (Math.PI / 4) + mouse.y * 0.1;

      // Click Response
      if (clickAnim.active) {
        const elapsed = (performance.now() - clickAnim.start) / 500;
        if (elapsed < 1) {
          const scale = 1 + Math.sin(elapsed * Math.PI) * 0.3;
          gemGroup.scale.setScalar(scale);
        } else {
          clickAnim.active = false;
          gemGroup.scale.setScalar(1);
        }
      }

      // Particles Physics (CPU simulation for mouse interaction & decay)
      const pos = particles.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < pCount; i++) {
        const idx = i * 3;
        // Repulsion from mouse (screen coords mapping to worldish coords)
        const dx = pos[idx] - mouse.x * 5;
        const dy = pos[idx + 1] - mouse.y * 5;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 1.5) {
          const force = 0.003;
          pVel[idx] += (dx / dist) * force;
          pVel[idx + 1] += (dy / dist) * force;
        }
        
        // Velocity update & Friction
        pos[idx] += pVel[idx];
        pos[idx + 1] += pVel[idx + 1];
        pVel[idx] *= 0.95;
        pVel[idx + 1] *= 0.95;

        // Return to origin (drift back)
        pos[idx] += (pOrig[idx] - pos[idx]) * 0.01;
        pos[idx + 1] += (pOrig[idx + 1] - pos[idx + 1]) * 0.01;
      }
      particles.geometry.attributes.position.needsUpdate = true;

      // Gold Stream Ribbon
      const sPosArr = sPoints.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < streamCount; i++) {
        const progress = ((i / streamCount) + t * 0.2) % 1;
        const p = streamCurve.getPoint(progress);
        sPosArr[i * 3] = p.x + Math.sin(t + i) * 0.05;
        sPosArr[i * 3 + 1] = p.y + Math.cos(t + i) * 0.05;
        sPosArr[i * 3 + 2] = p.z;
      }
      sPoints.geometry.attributes.position.needsUpdate = true;

      // Secondary Objects float logic
      secondaryObjects.forEach((g, i) => {
        if (t > 4) g.visible = true;
        const ud = g.userData;
        g.position.y = ud.baseY + Math.sin(t * ud.freq + ud.phase) * ud.amp * 50; // Amp scaling
        g.rotation.y += 0.01;
        g.rotation.x += 0.005;
      });

      // Stars Parallax
      starField.rotation.y += 0.0001;
      starField.position.x = mouse.x * 0.05;
      
      lightColumns.forEach(col => { col.rotation.y += 0.001; });

      composer.render();
      animFrame = requestAnimationFrame(animate);
    };

    animate();

    // --- LIFECYCLE ---
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      renderer.setSize(width, height);
      composer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    const handleVisibility = () => {
      if (document.hidden) clock.stop();
      else clock.start();
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibility);
      cancelAnimationFrame(animFrame);
      renderer.dispose();
      gemGeo.dispose();
      gemMat.dispose();
      wireMat.dispose();
      innerRingGeo.dispose();
      innerRingMat.dispose();
      outerRingGeo.dispose();
      outerRingMat.dispose();
      pMat.dispose();
      pGeo.dispose();
      starGeo.dispose();
      starMat.dispose();
      if (containerRef.current) containerRef.current.innerHTML = '';
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
