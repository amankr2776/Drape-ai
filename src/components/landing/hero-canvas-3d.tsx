'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

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
  const lightRef = useRef<THREE.PointLight | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    // Detection
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Renderer Setup
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true,
      powerPreference: "high-performance" 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    cameraRef.current = camera;

    // Procedural Env Map (Dark with Gold reflections)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const renderTarget = pmremGenerator.fromScene(new THREE.Scene());
    scene.environment = renderTarget.texture;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xC9A84C, 0.4);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xF5F0E8, 1.2);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);

    const orbitLight = new THREE.PointLight(0xC4545A, 1.5, 10);
    scene.add(orbitLight);
    lightRef.current = orbitLight;

    const goldLight = new THREE.PointLight(0xC9A84C, 0.8, 10);
    goldLight.position.set(3, -2, 1);
    scene.add(goldLight);

    // --- 3D FASHION ITEMS ---
    const itemCount = isMobile ? 4 : 10;
    
    // 1. Dress Silhouette (Lathe)
    const dressPoints = [];
    for (let i = 0; i < 10; i++) {
      dressPoints.push(new THREE.Vector2(Math.sin(i * 0.4) * 0.5 + 0.3, (i - 5) * 0.2));
    }
    const dressGeo = new THREE.LatheGeometry(dressPoints, 20);
    const dressMat = new THREE.MeshPhysicalMaterial({
      color: 0xC4545A,
      metalness: 0.3,
      roughness: 0.2,
      transmission: 0.2,
      thickness: 0.5,
    });
    const dress = new THREE.Group();
    dress.add(new THREE.Mesh(dressGeo, dressMat));
    dress.position.set(-2, 1, -1);
    scene.add(dress);
    itemsRef.current.push(dress);

    // 2. Jacket/Blazer (Box with Wireframe)
    const jacketGeo = new THREE.BoxGeometry(0.8, 1.2, 0.4);
    const jacketMat = new THREE.MeshPhysicalMaterial({ color: 0xF5F0E8, roughness: 0.5 });
    const jacket = new THREE.Group();
    jacket.add(new THREE.Mesh(jacketGeo, jacketMat));
    const jacketWire = new THREE.Mesh(jacketGeo, new THREE.MeshBasicMaterial({ color: 0xC9A84C, wireframe: true }));
    jacketWire.scale.setScalar(1.01);
    jacket.add(jacketWire);
    jacket.position.set(2, -1, 0.5);
    scene.add(jacket);
    itemsRef.current.push(jacket);

    // 3. Handbag (Squished Sphere)
    const bagGeo = new THREE.SphereGeometry(0.4, 32, 32);
    const bagMat = new THREE.MeshStandardMaterial({ color: 0xC9A84C, metalness: 0.9, roughness: 0.1 });
    const bag = new THREE.Group();
    const bagMesh = new THREE.Mesh(bagGeo, bagMat);
    bagMesh.scale.set(1.2, 0.7, 0.6);
    bag.add(bagMesh);
    bag.position.set(2.5, 1.5, -2);
    scene.add(bag);
    itemsRef.current.push(bag);

    // 4. Saree / Waving Fabric (Centerpiece)
    const sareeGeo = new THREE.PlaneGeometry(3, 4, 30, 30);
    const sareeMat = new THREE.MeshPhysicalMaterial({
      color: 0xC4545A,
      side: THREE.DoubleSide,
      metalness: 0.1,
      roughness: 0.3,
      flatShading: false,
    });
    const saree = new THREE.Group();
    const sareeMesh = new THREE.Mesh(sareeGeo, sareeMat);
    saree.add(sareeMesh);
    saree.position.set(-3, -1, -2);
    saree.rotation.y = 0.5;
    scene.add(saree);
    itemsRef.current.push(saree);

    // Accessories
    const bangleGeo = new THREE.TorusGeometry(0.3, 0.05, 16, 100);
    const bangle = new THREE.Group();
    bangle.add(new THREE.Mesh(bangleGeo, bagMat));
    bangle.position.set(-1.5, -2, 1);
    scene.add(bangle);
    itemsRef.current.push(bangle);

    // --- PARTICLE SYSTEM ---
    const pCount = isMobile ? 500 : 2000;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    const pInitPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount * 3; i++) {
      const val = (Math.random() - 0.5) * 15;
      pPos[i] = val;
      pInitPos[i] = val;
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

    // Events
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    const handleScroll = () => {
      scrollRef.current = window.scrollY / window.innerHeight;
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    // --- ANIMATION LOOP ---
    const clock = new THREE.Clock();

    const animate = () => {
      const t = clock.getElapsedTime();
      const delta = clock.getDelta();

      // Camera figure-8 and mouse drift
      const targetX = mouseRef.current.x * 0.15;
      const targetY = mouseRef.current.y * 0.08;
      camera.rotation.y += (targetX - camera.rotation.y) * 0.05;
      camera.rotation.x += (targetY - camera.rotation.x) * 0.05;
      
      camera.position.x = Math.sin(t * 0.5) * 0.2;
      camera.position.y = Math.sin(t * 0.25) * 0.1;
      camera.position.z = 5 + scrollRef.current * 3;

      // Orbiting light
      if (lightRef.current) {
        lightRef.current.position.x = Math.cos(t * 0.8) * 5;
        lightRef.current.position.z = Math.sin(t * 0.8) * 5;
      }

      // Items animation
      itemsRef.current.forEach((item, i) => {
        item.rotation.y += 0.005 + (i * 0.001);
        item.rotation.x += 0.002;
        item.position.y += Math.sin(t + i) * 0.002;
        
        // Scroll scaling and fade
        const scale = Math.max(0, 1 - scrollRef.current * 1.5);
        item.scale.setScalar(scale);
      });

      // Fabric wave (SareeMesh)
      const positions = sareeGeo.attributes.position;
      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const y = positions.getY(i);
        const wave = Math.sin(x * 1.5 + t) * 0.2 + Math.sin(y * 1.0 + t) * 0.1;
        positions.setZ(i, wave);
      }
      positions.needsUpdate = true;

      // Particles drift and reset
      const pAttrib = particles.geometry.attributes.position;
      for (let i = 0; i < pCount; i++) {
        let py = pAttrib.getY(i);
        let px = pAttrib.getX(i);
        let pz = pAttrib.getZ(i);

        py += 0.005;
        if (py > 7) py = -7;
        
        // Repel from mouse
        const dx = px - mouseRef.current.x * 5;
        const dy = py - mouseRef.current.y * 5;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 1) {
          px += dx * 0.01;
          py += dy * 0.01;
        }

        pAttrib.setX(i, px);
        pAttrib.setY(i, py);
      }
      pAttrib.needsUpdate = true;
      particles.visible = scrollRef.current < 0.8;

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
      bangleGeo.dispose();
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
