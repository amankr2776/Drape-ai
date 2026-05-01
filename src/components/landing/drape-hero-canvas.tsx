'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { AfterimagePass } from 'three/examples/jsm/postprocessing/AfterimagePass';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment';

/**
 * @fileOverview DrapeHeroCanvas - A cinematic Three.js WebGL experience.
 * Inspired by activetheory.net, featuring floating glowing objects, 
 * particle trails, and intense golden bloom.
 */

export const DrapeHeroCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const composerRef = useRef<EffectComposer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, vx: 0, vy: 0, lastX: 0, lastY: 0 });
  const clockRef = useRef(new THREE.Clock());
  const requestRef = useRef<number>(0);

  // Scene Objects
  const gemRef = useRef<THREE.Group | null>(null);
  const innerRingRef = useRef<THREE.Mesh | null>(null);
  const outerRingRef = useRef<THREE.Mesh | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const ribbonRef = useRef<THREE.Points | null>(null);
  const secondaryObjects = useRef<THREE.Mesh[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    // --- RENDERER SETUP ---
    const width = window.innerWidth;
    const height = window.innerHeight;
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // --- SCENE & CAMERA ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000005);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.z = 8;
    cameraRef.current = camera;

    // --- ENVIRONMENT MAP ---
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;

    // --- POST PROCESSING ---
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));

    const bloomPass = new UnrealBloomPass(new THREE.Vector2(width, height), 2.0, 1.0, 0.1);
    composer.addPass(bloomPass);

    const afterimagePass = new AfterimagePass(0.94);
    composer.addPass(afterimagePass);

    const filmPass = new FilmPass(0.15, 0.025, 648, 0); // Noise only
    composer.addPass(filmPass);
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

    const backlight = new THREE.PointLight(0xFFFFFF, 0.5, 15);
    backlight.position.set(0, 5, -2);
    scene.add(backlight);

    // --- HERO CENTERPIECE (GEM) ---
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

    const gemWire = new THREE.Mesh(
      gemGeo,
      new THREE.MeshBasicMaterial({ color: 0xC9A84C, wireframe: true, opacity: 0.15, transparent: true })
    );
    gemWire.scale.setScalar(1.01);
    gemGroup.add(gemWire);
    scene.add(gemGroup);
    gemRef.current = gemGroup;

    // --- RINGS ---
    const innerRingGeo = new THREE.TorusGeometry(1.1, 0.008, 3, 80);
    const innerRingMat = new THREE.MeshBasicMaterial({ color: 0xC9A84C, opacity: 0.7, transparent: true });
    const innerRing = new THREE.Mesh(innerRingGeo, innerRingMat);
    scene.add(innerRing);
    innerRingRef.current = innerRing;

    const outerRingGeo = new THREE.TorusGeometry(1.8, 0.004, 8, 100);
    const outerRingMat = new THREE.MeshBasicMaterial({ color: 0xC4545A, opacity: 0.5, transparent: true });
    const outerRing = new THREE.Mesh(outerRingGeo, outerRingMat);
    outerRing.rotation.x = Math.PI / 4;
    scene.add(outerRing);
    outerRingRef.current = outerRing;

    // --- SECONDARY OBJECTS ---
    const createSecondary = (geo: THREE.BufferGeometry, mat: THREE.Material, pos: [number, number, number]) => {
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(...pos);
      scene.add(mesh);
      secondaryObjects.current.push(mesh);
      return mesh;
    };

    const goldMat = new THREE.MeshPhysicalMaterial({ color: 0xC9A84C, metalness: 1, roughness: 0, transmission: 0.8 });
    const roseMat = new THREE.MeshPhysicalMaterial({ color: 0xC4545A, metalness: 0.9, roughness: 0.2 });
    const ivoryMat = new THREE.MeshPhysicalMaterial({ color: 0xF5F0E8, metalness: 0.7, roughness: 0.1 });

    createSecondary(new THREE.OctahedronGeometry(0.25), goldMat, [-3, 1.5, -2]);
    createSecondary(new THREE.CylinderGeometry(0.08, 0.12, 0.4), roseMat, [2.5, -1, -1]);
    createSecondary(new THREE.TorusGeometry(0.2, 0.04, 16, 40), goldMat, [-2, -2, -3]);
    createSecondary(new THREE.TetrahedronGeometry(0.18), ivoryMat, [3, 2, -4]);
    createSecondary(new THREE.IcosahedronGeometry(0.15, 0), new THREE.MeshBasicMaterial({ color: 0xC9A84C, wireframe: true }), [-3.5, -0.5, -2]);
    createSecondary(new THREE.ConeGeometry(0.06, 0.5, 4), goldMat, [1.5, 2.5, -3]);

    // --- MAIN PARTICLES ---
    const particleCount = window.innerWidth < 768 ? 8000 : 30000;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(particleCount * 3);
    const pSpeed = new Float32Array(particleCount);
    const pOffset = new Float32Array(particleCount);
    const pSize = new Float32Array(particleCount);
    const pColor = new Float32Array(particleCount * 3);

    const colorGold = new THREE.Color(0xC9A84C);
    const colorRose = new THREE.Color(0xC4545A);

    for (let i = 0; i < particleCount; i++) {
      pPos[i * 3] = (Math.random() - 0.5) * 16;
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 10 - 3;
      pSpeed[i] = Math.random() * 0.5 + 0.2;
      pOffset[i] = Math.random() * Math.PI * 2;
      pSize[i] = Math.random() * 2.5 + 0.5;

      const mix = Math.random() > 0.7 ? colorRose : colorGold;
      pColor[i * 3] = mix.r;
      pColor[i * 3 + 1] = mix.g;
      pColor[i * 3 + 2] = mix.b;
    }

    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    pGeo.setAttribute('aSpeed', new THREE.BufferAttribute(pSpeed, 1));
    pGeo.setAttribute('aOffset', new THREE.BufferAttribute(pOffset, 1));
    pGeo.setAttribute('aSize', new THREE.BufferAttribute(pSize, 1));
    pGeo.setAttribute('color', new THREE.BufferAttribute(pColor, 3));

    const pMat = new THREE.ShaderMaterial({
      transparent: true,
      vertexColors: true,
      uniforms: { uTime: { value: 0 }, uMouse: { value: new THREE.Vector2(0, 0) } },
      vertexShader: `
        uniform float uTime;
        attribute float aSpeed;
        attribute float aOffset;
        attribute float aSize;
        varying vec3 vColor;
        void main() {
          vColor = color;
          vec3 pos = position;
          pos.x += sin(uTime * aSpeed + aOffset) * 0.1;
          pos.y += cos(uTime * aSpeed * 0.7 + aOffset) * 0.05;
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
          float alpha = 1.0 - (dist * 2.0);
          alpha = pow(alpha, 2.0) * 0.6;
          gl_FragColor = vec4(vColor, alpha);
        }
      `
    });

    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);
    particlesRef.current = particles;

    // --- RIBBON TRAIL ---
    const ribbonCount = 200;
    const rGeo = new THREE.BufferGeometry();
    const rPos = new Float32Array(ribbonCount * 3);
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-6, -4, -2),
      new THREE.Vector3(-2, 0, 1),
      new THREE.Vector3(2, -1, 0),
      new THREE.Vector3(6, 4, -2),
    ]);
    const ribbonPoints = curve.getPoints(ribbonCount - 1);
    ribbonPoints.forEach((p, i) => {
      rPos[i * 3] = p.x; rPos[i * 3 + 1] = p.y; rPos[i * 3 + 2] = p.z;
    });
    rGeo.setAttribute('position', new THREE.BufferAttribute(rPos, 3));
    const ribbon = new THREE.Points(rGeo, new THREE.PointsMaterial({ color: 0xC9A84C, size: 0.05, transparent: true, opacity: 0.8 }));
    scene.add(ribbon);
    ribbonRef.current = ribbon;

    // --- STARS ---
    const starCount = 5000;
    const sGeo = new THREE.BufferGeometry();
    const sPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      sPos[i * 3] = (Math.random() - 0.5) * 40;
      sPos[i * 3 + 1] = (Math.random() - 0.5) * 40;
      sPos[i * 3 + 2] = -20 + Math.random() * 15;
    }
    sGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3));
    const stars = new THREE.Points(sGeo, new THREE.PointsMaterial({ color: 0xFFFFFF, size: 0.02, transparent: true, opacity: 0.5 }));
    scene.add(stars);

    // --- VOLUMETRIC LIGHT COLUMNS ---
    if (window.innerWidth >= 768) {
      const createColumn = (color: number, x: number) => {
        const colGeo = new THREE.CylinderGeometry(0, 0.3, 12, 16);
        const colMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.04, side: THREE.DoubleSide, blending: THREE.AdditiveBlending });
        const col = new THREE.Mesh(colGeo, colMat);
        col.position.set(x, 0, -5);
        scene.add(col);
        return col;
      };
      createColumn(0xC9A84C, 0);
      createColumn(0xC4545A, -4);
      createColumn(0xC9A84C, 4);
    }

    // --- EVENTS ---
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = (e.clientX / width) * 2 - 1;
      mouseRef.current.targetY = -(e.clientY / height) * 2 + 1;
      mouseRef.current.vx = e.clientX - mouseRef.current.lastX;
      mouseRef.current.vy = e.clientY - mouseRef.current.lastY;
      mouseRef.current.lastX = e.clientX;
      mouseRef.current.lastY = e.clientY;
    };

    const handleClick = () => {
      if (bloomPass) {
        bloomPass.strength = 4.0;
        setTimeout(() => bloomPass.strength = 2.0, 300);
      }
      if (gemRef.current) {
        gemRef.current.scale.set(1.3, 1.3, 1.3);
      }
    };

    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h);
      composer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);
    window.addEventListener('resize', handleResize);

    // --- ANIMATION LOOP ---
    const animate = () => {
      requestRef.current = requestAnimationFrame(animate);
      const t = clockRef.current.getElapsedTime();

      // Lerp mouse
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      // Camera drift & Breathe
      camera.position.z = 8 + Math.sin(t * 0.4) * 0.3;
      camera.rotation.y = mouseRef.current.x * 0.12;
      camera.rotation.x = mouseRef.current.y * -0.08;

      // Gem
      if (gemRef.current) {
        gemRef.current.rotation.y += 0.003 + Math.abs(mouseRef.current.vx) * 0.0005;
        gemRef.current.rotation.x += 0.001;
        gemRef.current.position.y = Math.sin(t * 0.8) * 0.15;
        gemRef.current.scale.x += (1.0 - gemRef.current.scale.x) * 0.1;
        gemRef.current.scale.y += (1.0 - gemRef.current.scale.y) * 0.1;
        gemRef.current.scale.z += (1.0 - gemRef.current.scale.z) * 0.1;
      }

      // Orbit Lights
      pointLight1.position.x = Math.sin(t * 0.5) * 3;
      pointLight1.position.z = Math.cos(t * 0.5) * 3;

      // Rings
      if (innerRingRef.current) {
        innerRingRef.current.rotation.x += 0.008;
        innerRingRef.current.rotation.y += mouseRef.current.y * 0.01;
      }
      if (outerRingRef.current) {
        outerRingRef.current.rotation.z += 0.005;
        outerRingRef.current.rotation.x += mouseRef.current.x * 0.01;
      }

      // Secondary Objects
      secondaryObjects.current.forEach((obj, i) => {
        obj.rotation.y += 0.005 + (i * 0.001);
        obj.rotation.z += 0.002;
        obj.position.y += Math.sin(t * (0.3 + i * 0.1) + i) * 0.005;
      });

      // Particles
      if (particlesRef.current) {
        const mat = particlesRef.current.material as THREE.ShaderMaterial;
        mat.uniforms.uTime.value = t;
        mat.uniforms.uMouse.value.set(mouseRef.current.x, mouseRef.current.y);
      }

      // Stars slow drift
      stars.rotation.y += 0.0001;

      // Ribbon motion
      if (ribbonRef.current) {
        const pos = ribbonRef.current.geometry.attributes.position as THREE.BufferAttribute;
        for (let i = 0; i < ribbonCount; i++) {
          const pt = curve.getPoint(( (i + t * 5) % ribbonCount ) / ribbonCount);
          pos.setXYZ(i, pt.x + Math.sin(t + i) * 0.02, pt.y + Math.cos(t + i) * 0.02, pt.z);
        }
        pos.needsUpdate = true;
      }

      composer.render();
    };

    animate();

    return () => {
      cancelAnimationFrame(requestRef.current);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      pmremGenerator.dispose();
      // Dispose geometries & materials
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.Points) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
          else obj.material.dispose();
        }
      });
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
