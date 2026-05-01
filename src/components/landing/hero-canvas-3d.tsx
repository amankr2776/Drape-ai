'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

/**
 * @fileOverview A high-performance Three.js hero background.
 * Features floating fashion geometries, a waving fabric centerpiece,
 * and an interactive particle system.
 */

export function HeroCanvas3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const animationFrameRef = useRef<number>(0);
  const itemsRef = useRef<THREE.Group[]>([]);
  const particlesRef = useRef<THREE.Points | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const scrollRef = useRef(0);
  const orbitingLightRef = useRef<THREE.PointLight | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    // Detect mobile for performance scaling
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // --- RENDERER SETUP ---
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true,
      powerPreference: "high-performance" 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // --- SCENE & CAMERA ---
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    cameraRef.current = camera;

    // --- LIGHTING ---
    const ambientLight = new THREE.AmbientLight(0xC9A84C, 0.3); // Gold ambient
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xF5F0E8, 1.2); // Ivory top-right
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);

    const orbitingLight = new THREE.PointLight(0xC4545A, 0.8, 15); // Rose orbiting
    scene.add(orbitingLight);
    orbitingLightRef.current = orbitingLight;

    const goldPointLight = new THREE.PointLight(0xC9A84C, 0.6, 10); // Gold bottom-right
    goldPointLight.position.set(3, -2, 1);
    scene.add(goldPointLight);

    // Soft fill
    const fillLight = new THREE.RectAreaLight(0xffffff, 0.4, 10, 10);
    fillLight.position.set(0, 0, -5);
    scene.add(fillLight);

    // --- 3D CLOTHING OBJECTS ---
    const itemCount = isMobile ? 4 : 10;
    
    // 1. Dress Silhouette (Lathe)
    const dressPoints = [];
    for (let i = 0; i < 10; i++) {
      dressPoints.push(new THREE.Vector2(Math.sin(i * 0.3) * 0.4 + 0.3, (i - 5) * 0.25));
    }
    const dressGeo = new THREE.LatheGeometry(dressPoints, 32);
    const dressMat = new THREE.MeshPhysicalMaterial({
      color: 0xC4545A,
      metalness: 0.3,
      roughness: 0.2,
      transmission: 0.1,
      thickness: 0.5,
    });
    const dress = new THREE.Group();
    dress.add(new THREE.Mesh(dressGeo, dressMat));
    dress.position.set(-2.5, 1, -1);
    scene.add(dress);
    itemsRef.current.push(dress);

    // 2. Jacket/Blazer
    const jacketGeo = new THREE.BoxGeometry(0.9, 1.3, 0.4);
    const jacketMat = new THREE.MeshPhysicalMaterial({ color: 0xF5F0E8, roughness: 0.4 });
    const jacket = new THREE.Group();
    jacket.add(new THREE.Mesh(jacketGeo, jacketMat));
    const jacketWire = new THREE.Mesh(jacketGeo, new THREE.MeshBasicMaterial({ color: 0xC9A84C, wireframe: true }));
    jacketWire.scale.setScalar(1.02);
    jacket.add(jacketWire);
    jacket.position.set(2.2, -0.8, 0.5);
    scene.add(jacket);
    itemsRef.current.push(jacket);

    // 3. Handbag
    const bagGeo = new THREE.SphereGeometry(0.4, 32, 32);
    const bagMat = new THREE.MeshStandardMaterial({ color: 0xC9A84C, metalness: 0.9, roughness: 0.1 });
    const bag = new THREE.Group();
    const bagMesh = new THREE.Mesh(bagGeo, bagMat);
    bagMesh.scale.set(1.2, 0.7, 0.6);
    bag.add(bagMesh);
    bag.position.set(2.8, 1.5, -2);
    scene.add(bag);
    itemsRef.current.push(bag);

    // 4. Heel Silhouette (Combined)
    const heelGroup = new THREE.Group();
    const sole = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.1, 0.8), new THREE.MeshPhysicalMaterial({ color: 0x0A0A0F }));
    const spike = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.4, 16), new THREE.MeshPhysicalMaterial({ color: 0x0A0A0F }));
    spike.position.set(0, -0.2, 0.3);
    heelGroup.add(sole, spike);
    const heelWire = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.12, 0.82), new THREE.MeshBasicMaterial({ color: 0xC9A84C, wireframe: true }));
    heelGroup.add(heelWire);
    heelGroup.position.set(-1.8, -1.5, 0.8);
    scene.add(heelGroup);
    itemsRef.current.push(heelGroup);

    // 5. Saree / Waving Fabric (Centerpiece)
    const sareeGeo = new THREE.PlaneGeometry(3.5, 5, 40, 40);
    const sareeMat = new THREE.MeshPhysicalMaterial({
      color: 0xC4545A,
      side: THREE.DoubleSide,
      metalness: 0.2,
      roughness: 0.3,
      transparent: true,
      opacity: 0.8,
    });
    const saree = new THREE.Group();
    const sareeMesh = new THREE.Mesh(sareeGeo, sareeMat);
    saree.add(sareeMesh);
    saree.position.set(-3.5, -0.5, -2.5);
    saree.rotation.y = 0.6;
    scene.add(saree);
    itemsRef.current.push(saree);

    // Accessories
    if (!isMobile) {
      const torus = new THREE.Group();
      torus.add(new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.05, 16, 100), bagMat));
      torus.position.set(1.5, 2, -1);
      scene.add(torus);
      itemsRef.current.push(torus);

      const cylinder = new THREE.Group();
      cylinder.add(new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.6, 32), jacketMat));
      cylinder.position.set(-1, 2.2, -1.5);
      scene.add(cylinder);
      itemsRef.current.push(cylinder);

      const gem = new THREE.Group();
      gem.add(new THREE.Mesh(new THREE.OctahedronGeometry(0.25), dressMat));
      gem.position.set(3, 0, -3);
      scene.add(gem);
      itemsRef.current.push(gem);
    }

    // --- PARTICLE SYSTEM ---
    const pCount = isMobile ? 500 : 2000;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount * 3; i++) {
      pPos[i] = (Math.random() - 0.5) * 15;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0xC9A84C,
      size: 0.02,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);
    particlesRef.current = particles;

    // --- EVENTS ---
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    const handleScroll = () => {
      scrollRef.current = window.scrollY / (window.innerHeight * 0.8);
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    // --- ANIMATION LOOP ---
    const clock = new THREE.Clock();

    const animate = () => {
      const t = clock.getElapsedTime();

      // Camera drift & Mouse response
      const driftX = Math.sin(t * 0.4) * 0.15;
      const driftY = Math.cos(t * 0.3) * 0.1;
      const mouseTargetX = mouseRef.current.x * 0.15;
      const mouseTargetY = mouseRef.current.y * 0.08;

      camera.rotation.y += (mouseTargetX - camera.rotation.y + driftX) * 0.05;
      camera.rotation.x += (mouseTargetY - camera.rotation.x + driftY) * 0.05;
      camera.position.z = 5 + scrollRef.current * 4;

      // Orbiting light
      if (orbitingLightRef.current) {
        orbitingLightRef.current.position.x = Math.cos(t * 0.8) * 6;
        orbitingLightRef.current.position.z = Math.sin(t * 0.8) * 6;
        orbitingLightRef.current.position.y = Math.sin(t * 0.5) * 2;
      }

      // Items animation
      itemsRef.current.forEach((item, i) => {
        const speed = 0.001 + (i * 0.0005);
        item.rotation.y += speed;
        item.rotation.x += speed * 0.5;
        item.position.y += Math.sin(t + i) * 0.002;
        
        // Scroll scaling and fade
        const s = Math.max(0, 1 - scrollRef.current);
        item.scale.setScalar(s);
      });

      // Fabric wave displacement (Saree)
      const positions = sareeGeo.attributes.position;
      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const y = positions.getY(i);
        const wave = Math.sin(x * 1.2 + t) * 0.25 + Math.sin(y * 0.8 + t) * 0.15;
        positions.setZ(i, wave);
      }
      positions.needsUpdate = true;

      // Particles drift & Interaction
      const pAttrib = particles.geometry.attributes.position;
      for (let i = 0; i < pCount; i++) {
        let px = pAttrib.getX(i);
        let py = pAttrib.getY(i);
        let pz = pAttrib.getZ(i);

        py += 0.002;
        if (py > 7) py = -7;
        
        // Push away from mouse
        const dx = px - mouseRef.current.x * 5;
        const dy = py - mouseRef.current.y * 5;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 1.5) {
          px += dx * 0.02;
          py += dy * 0.02;
        }

        pAttrib.setX(i, px);
        pAttrib.setY(i, py);
        pAttrib.setZ(i, pz);
      }
      pAttrib.needsUpdate = true;
      particles.material.opacity = (1 - scrollRef.current) * 0.4;

      renderer.render(scene, camera);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameRef.current);
      renderer.dispose();
      dressGeo.dispose();
      dressMat.dispose();
      jacketGeo.dispose();
      jacketMat.dispose();
      bagGeo.dispose();
      bagMat.dispose();
      sareeGeo.dispose();
      sareeMat.dispose();
      pMat.dispose();
      pGeo.dispose();
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [isMobile]);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 z-0 pointer-events-none"
      style={{ transition: 'opacity 0.8s ease' }}
    />
  );
}
