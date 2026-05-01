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
 * @fileOverview DrapeHeroCanvas - A cinematic Three.js experience inspired by activetheory.net.
 * Features a glowing gold centerpiece, reactive particle trails, and volumetric light shafts.
 */

export const DrapeHeroCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const composerRef = useRef<EffectComposer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const clockRef = useRef(new THREE.Clock());
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, vX: 0, vY: 0, lastX: 0, lastY: 0 });
  const animIdRef = useRef<number>(0);

  // Scene Objects
  const gemGroup = useRef<THREE.Group | null>(null);
  const innerRing = useRef<THREE.Mesh | null>(null);
  const outerRing = useRef<THREE.Mesh | null>(null);
  const particles = useRef<THREE.Points | null>(null);
  const particleVelocities = useRef<Float32Array | null>(null);
  const streamParticles = useRef<THREE.Points | null>(null);
  const secondaryObjects = useRef<THREE.Mesh[]>([]);
  const lightColumns = useRef<THREE.Mesh[]>([]);
  const starField = useRef<THREE.Points | null>(null);
  const keyLight = useRef<THREE.PointLight | null>(null);

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

    // --- ENVIRONMENT ---
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

    const light1 = new THREE.PointLight(0xC9A84C, 0, 10); // Animated intensity
    light1.position.set(2, 2, 3);
    scene.add(light1);
    keyLight.current = light1;

    const light2 = new THREE.PointLight(0xC4545A, 1.5, 10);
    light2.position.set(-3, -1, 2);
    scene.add(light2);

    const light3 = new THREE.PointLight(0xFFFFFF, 0.5, 15);
    light3.position.set(0, 5, -2);
    scene.add(light3);

    // --- HERO CENTERPIECE ---
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

    // --- RINGS ---
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
    const secondaryMatGold = new THREE.MeshPhysicalMaterial({ color: 0xC9A84C, metalness: 1, roughness: 0, transmission: 0.8 });
    const secondaryMatRose = new THREE.MeshPhysicalMaterial({ color: 0xC4545A, metalness: 0.9, roughness: 0.2 });
    const secondaryMatIvory = new THREE.MeshPhysicalMaterial({ color: 0xF5F0E8, metalness: 0.7, roughness: 0.1 });

    const createSecondary = (geo: THREE.BufferGeometry, mat: THREE.Material, pos: [number, number, number]) => {
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(...pos);
      mesh.visible = false;
      scene.add(mesh);
      secondaryObjects.current.push(mesh);
      return mesh;
    };

    createSecondary(new THREE.OctahedronGeometry(0.25), secondaryMatGold, [-3, 1.5, -2]);
    createSecondary(new THREE.CylinderGeometry(0.08, 0.12, 0.4), secondaryMatRose, [2.5, -1, -1]);
    createSecondary(new THREE.TorusGeometry(0.2, 0.04, 16, 40), secondaryMatGold, [-2, -2, -3]);
    createSecondary(new THREE.TetrahedronGeometry(0.18), secondaryMatIvory, [3, 2, -4]);
    createSecondary(new THREE.IcosahedronGeometry(0.15, 0), new THREE.MeshBasicMaterial({ color: 0xC9A84C, wireframe: true }), [-3.5, -0.5, -2]);
    createSecondary(new THREE.ConeGeometry(0.06, 0.5, 4), secondaryMatGold, [1.5, 2.5, -3]);

    // --- MAIN PARTICLES ---
    const pCount = 30000;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    const pSpeed = new Float32Array(pCount);
    const pOffset = new Float32Array(pCount);
    const pSize = new Float32Array(pCount);
    const pColor = new Float32Array(pCount * 3);
    const pVel = new Float32Array(pCount * 3);

    const gold = new THREE.Color(0xC9A84C);
    const rose = new THREE.Color(0xC4545A);

    for (let i = 0; i < pCount; i++) {
      pPos[i * 3] = (Math.random() - 0.5) * 16;
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 10 - 3;
      pSpeed[i] = Math.random() * 0.5 + 0.2;
      pOffset[i] = Math.random() * Math.PI * 2;
      pSize[i] = Math.random() * 2.5 + 0.5;

      const c = Math.random() > 0.7 ? rose : gold;
      pColor[i * 3] = c.r; pColor[i * 3 + 1] = c.g; pColor[i * 3 + 2] = c.b;
      pVel[i * 3] = 0; pVel[i * 3 + 1] = 0; pVel[i * 3 + 2] = 0;
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
          gl_FragColor = vec4(vColor, alpha);
        }
      `
    });

    const pPoints = new THREE.Points(pGeo, pMat);
    pPoints.visible = false;
    scene.add(pPoints);
    particles.current = pPoints;
    particleVelocities.current = pVel;

    // --- GOLD STREAM ---
    const sCount = 200;
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-6, -4, -2),
      new THREE.Vector3(-2, 0, 1),
      new THREE.Vector3(2, -1, 0),
      new THREE.Vector3(6, 4, -2),
    ]);
    const sGeo = new THREE.BufferGeometry();
    const sPos = new Float32Array(sCount * 3);
    sGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3));
    const sPoints = new THREE.Points(sGeo, new THREE.PointsMaterial({ color: 0xC9A84C, size: 0.05, transparent: true, opacity: 0.8 }));
    scene.add(sPoints);
    streamParticles.current = sPoints;

    // --- LIGHT COLUMNS ---
    const createColumn = (color: number, x: number) => {
      const colGeo = new THREE.CylinderGeometry(0, 0.3, 12, 16);
      const colMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0, blending: THREE.AdditiveBlending });
      const col = new THREE.Mesh(colGeo, colMat);
      col.position.set(x, 0, -5);
      scene.add(col);
      lightColumns.current.push(col);
    };
    createColumn(0xC9A84C, 0);
    createColumn(0xC4545A, -4);
    createColumn(0xC9A84C, 4);

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
    const sField = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xFFFFFF, size: 0.02, transparent: true, opacity: 0 }));
    scene.add(sField);
    starField.current = sField;

    // --- EVENTS ---
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = (e.clientX / width) * 2 - 1;
      mouseRef.current.targetY = -(e.clientY / height) * 2 + 1;
      mouseRef.current.vX = (e.clientX - mouseRef.current.lastX) * 0.01;
      mouseRef.current.lastX = e.clientX;
    };

    const handleClick = () => {
      if (!gemGroup.current) return;
      // Burst
      const pos = particles.current!.geometry.attributes.position.array as Float32Array;
      const vels = particleVelocities.current!;
      for (let i = 0; i < pCount; i++) {
        const dx = pos[i * 3];
        const dy = pos[i * 3 + 1];
        const dist = Math.sqrt(dx * dx + dy * dy);
        vels[i * 3] += (dx / dist) * 0.1;
        vels[i * 3 + 1] += (dy / dist) * 0.1;
      }
      // Bloom spike
      bloomPass.strength = 4.0;
      setTimeout(() => bloomPass.strength = 2.0, 300);
      // Gem pulse
      gemGroup.current.scale.setScalar(1.3);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);

    // --- ANIMATION LOOP ---
    const animate = () => {
      animIdRef.current = requestAnimationFrame(animate);
      const t = clockRef.current.getElapsedTime();

      // Lerp mouse
      mouseRef.current.targetX += (mouseRef.current.targetX - mouseRef.current.targetX) * 0.05;
      mouseRef.current.targetY += (mouseRef.current.targetY - mouseRef.current.targetY) * 0.05;

      // Camera
      camera.position.z = 8 + Math.sin(t * 0.4) * 0.3;
      camera.rotation.y += (mouseRef.current.targetX * 0.12 - camera.rotation.y) * 0.04;
      camera.rotation.x += (mouseRef.current.targetY * -0.08 - camera.rotation.x) * 0.04;

      // Gem
      if (gemGroup.current) {
        gemGroup.current.rotation.y += 0.003 + Math.abs(mouseRef.current.vX) * 0.1;
        gemGroup.current.rotation.x += 0.001;
        gemGroup.current.position.y = Math.sin(t * 0.8) * 0.15;
        gemGroup.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
        if (t < 4) { // Intro
          const s = Math.min(1, Math.max(0, (t - 0.5) / 1));
          gemGroup.current.scale.setScalar(s);
          if (keyLight.current) keyLight.current.intensity = s * 3;
        }
      }

      // Rings Intro & Loop
      if (innerRing.current) {
        if (t > 1.5 && t < 2) {
          const s = (t - 1.5) / 0.5;
          (innerRing.current.material as THREE.MeshBasicMaterial).opacity = s * 0.7;
          innerRing.current.scale.setScalar(s);
        }
        innerRing.current.rotation.x += 0.008 + mouseRef.current.vX * 0.1;
      }
      if (outerRing.current) {
        if (t > 2 && t < 2.5) {
          const s = (t - 2) / 0.5;
          (outerRing.current.material as THREE.MeshBasicMaterial).opacity = s * 0.5;
          outerRing.current.scale.setScalar(s);
        }
        outerRing.current.rotation.z += 0.005;
      }

      // Orbit Light
      if (keyLight.current) {
        keyLight.current.position.x = Math.sin(t * 0.5) * 3;
        keyLight.current.position.z = Math.cos(t * 0.5) * 3;
      }

      // Particles
      if (particles.current) {
        if (t > 2.5 && t < 3) {
          particles.current.visible = true;
          particles.current.renderOrder = 1;
        }
        const posArr = particles.current.geometry.attributes.position.array as Float32Array;
        const vels = particleVelocities.current!;
        for (let i = 0; i < pCount; i++) {
          // Sea effect
          const dx = posArr[i * 3] - mouseRef.current.targetX * 5;
          const dy = posArr[i * 3 + 1] - mouseRef.current.targetY * 5;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 1.5) {
            vels[i * 3] += dx * 0.002;
            vels[i * 3 + 1] += dy * 0.002;
          }
          // Apply velocity
          posArr[i * 3] += vels[i * 3];
          posArr[i * 3 + 1] += vels[i * 3 + 1];
          // Friction
          vels[i * 3] *= 0.95;
          vels[i * 3 + 1] *= 0.95;
        }
        particles.current.geometry.attributes.position.needsUpdate = true;
        (particles.current.material as THREE.ShaderMaterial).uniforms.uTime.value = t;
      }

      // Stream
      if (streamParticles.current) {
        const streamPos = streamParticles.current.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < sCount; i++) {
          const pT = ((i / sCount) + t * 0.1) % 1;
          const point = curve.getPoint(pT);
          streamPos[i * 3] = point.x + Math.sin(t + i) * 0.05;
          streamPos[i * 3 + 1] = point.y + Math.cos(t + i) * 0.05;
          streamPos[i * 3 + 2] = point.z;
        }
        streamParticles.current.geometry.attributes.position.needsUpdate = true;
      }

      // Secondary Objects
      secondaryObjects.current.forEach((obj, i) => {
        if (t > 3 && !obj.visible) obj.visible = true;
        const freq = 0.3 + (i * 0.1);
        const amp = 0.004 + (i * 0.001);
        obj.position.y += Math.sin(t * freq + i) * amp;
        obj.rotation.y += 0.01;
      });

      // Columns
      lightColumns.current.forEach((col, i) => {
        if (t > 3 && t < 3.5) (col.material as THREE.MeshBasicMaterial).opacity = (t - 3) * 0.08;
        col.rotation.y += 0.001;
      });

      // Stars
      if (starField.current) {
        if (t > 3.5 && t < 4) (starField.current.material as THREE.PointsMaterial).opacity = (t - 3.5) * 2;
        starField.current.rotation.y += 0.0001;
        starField.current.position.x = mouseRef.current.targetX * 0.05;
      }

      composer.render();
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

    return () => {
      cancelAnimationFrame(animIdRef.current);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      pmremGenerator.dispose();
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
