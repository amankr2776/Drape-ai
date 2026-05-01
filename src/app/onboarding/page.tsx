
'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Camera, Check, Upload, User, Ruler, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import * as THREE from 'three';

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(0);
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    gender: '',
    height: 165,
    heightUnit: 'cm' as 'cm' | 'ft',
    bodySize: 'M',
    occasions: [] as string[],
    budget: [2000, 8000],
    colors: [] as string[],
    brands: [] as string[],
    photo: null as string | null,
    measurements: {
      chest: '',
      waist: '',
      hips: '',
    }
  });

  const totalSteps = 4;
  const router = useRouter();
  const { toast } = useToast();

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setStep((prev) => prev + newDirection);
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFinish = () => {
    toast({
      title: "Profile Curated",
      description: "Our AI is now ready to analyze your style.",
    });
    router.push('/analyze');
  };

  return (
    <div className="bg-background text-foreground min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden pt-20">
      <ProgressBar currentStep={step} totalSteps={totalSteps} />

      <div className="w-full max-w-3xl mt-12 mb-32">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={step}
            custom={direction}
            initial={{ x: direction > 0 ? 300 : -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction < 0 ? 300 : -300, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {step === 1 && <StepPersonalDetails formData={formData} updateFormData={updateFormData} />}
            {step === 2 && <StepMeasurements formData={formData} updateFormData={updateFormData} />}
            {step === 3 && <StepStylePreferences formData={formData} updateFormData={updateFormData} />}
            {step === 4 && <StepPhotoUpload formData={formData} updateFormData={updateFormData} />}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-8 flex justify-between items-center bg-gradient-to-t from-background via-background/90 to-transparent">
        <Button variant="ghost" onClick={() => step > 1 && paginate(-1)} disabled={step === 1} className="font-headline text-xl">
          <ArrowLeft className="mr-2" /> Back
        </Button>
        
        {step < totalSteps ? (
          <Button onClick={() => paginate(1)} className="font-headline text-xl px-12 h-14 bg-primary text-primary-foreground hover:glow-gold">
            Continue <ArrowRight className="ml-2" />
          </Button>
        ) : (
          <Button onClick={handleFinish} disabled={!formData.photo} className="font-headline text-xl px-12 h-14 bg-primary text-primary-foreground hover:glow-gold">
            Analyze My Style <ArrowRight className="ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}

const ProgressBar = ({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) => (
  <div className="fixed top-12 left-0 right-0 flex justify-center z-50 px-8">
    <div className="w-full max-w-2xl">
      <div className="h-[2px] w-full bg-border relative rounded-full overflow-hidden mb-4">
        <motion.div
          className="absolute left-0 top-0 h-full bg-primary shadow-[0_0_10px_hsl(var(--primary))]"
          initial={{ width: '0%' }}
          animate={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
          transition={{ duration: 0.8 }}
        />
      </div>
      <div className="flex justify-between px-1">
        {[1, 2, 3, 4].map(s => (
          <motion.div
            key={s}
            animate={{
              scale: currentStep === s ? 1.4 : 1,
              backgroundColor: currentStep >= s ? 'hsl(var(--primary))' : 'hsl(var(--border))'
            }}
            className="w-2 h-2 rounded-full"
          />
        ))}
      </div>
    </div>
  </div>
);

const StepPersonalDetails = ({ formData, updateFormData }: any) => (
  <div className="space-y-12">
    <div className="text-center space-y-4">
      <h2 className="text-5xl md:text-6xl font-headline text-primary">Let's Know You</h2>
      <p className="text-foreground/60 text-lg">Curating your identity is the first step toward perfect styling.</p>
    </div>
    
    <div className="space-y-8 max-w-md mx-auto">
      <div className="space-y-3">
        <Label className="text-xl font-headline tracking-wide">Full Name</Label>
        <Input 
          value={formData.fullName} 
          onChange={(e) => updateFormData('fullName', e.target.value)} 
          placeholder="Enter your name" 
          className="h-14 bg-card/50 border-primary/10 focus:border-primary text-lg"
        />
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-3">
          <Label className="text-xl font-headline">Age</Label>
          <Select value={formData.age} onValueChange={(v) => updateFormData('age', v)}>
            <SelectTrigger className="h-14 bg-card/50 border-primary/10">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {['18-24', '25-34', '35-44', '45-54', '55+'].map(age => (
                <SelectItem key={age} value={age}>{age}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-3">
          <Label className="text-xl font-headline">Gender</Label>
          <div className="flex gap-2">
            {['Male', 'Female'].map(g => (
              <button
                key={g}
                onClick={() => updateFormData('gender', g)}
                className={cn(
                  "flex-1 h-14 rounded-md border transition-all text-xs uppercase tracking-widest",
                  formData.gender === g ? "bg-primary text-primary-foreground border-primary" : "bg-card/30 border-primary/10"
                )}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

const StepMeasurements = ({ formData, updateFormData }: any) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    // Simple 3D Body Representation (Abstract)
    const torsoGeo = new THREE.CapsuleGeometry(0.8, 2, 16, 32);
    const torsoMat = new THREE.MeshStandardMaterial({ 
      color: 0xC9A84C, 
      wireframe: true, 
      transparent: true, 
      opacity: 0.4 
    });
    const torso = new THREE.Mesh(torsoGeo, torsoMat);
    scene.add(torso);

    const light = new THREE.PointLight(0xffffff, 1);
    light.position.set(5, 5, 5);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    camera.position.z = 5;

    const animate = () => {
      torso.rotation.y += 0.01;
      // Adjust scale based on size selection
      const sizeScale = formData.bodySize === 'XS' ? 0.8 : formData.bodySize === 'XXL' ? 1.4 : 1.1;
      torso.scale.lerp(new THREE.Vector3(sizeScale, 1, sizeScale), 0.1);
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    return () => {
      renderer.dispose();
      scene.clear();
    };
  }, [formData.bodySize]);

  return (
    <div className="space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-5xl md:text-6xl font-headline text-primary">Your Geometry</h2>
        <p className="text-foreground/60 text-lg">Precise measurements for an editorial fit.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="bg-card/20 rounded-2xl border border-primary/10 p-8 h-[400px] flex items-center justify-center relative">
          <canvas ref={canvasRef} className="w-full h-full" />
          <div className="absolute bottom-8 left-8 bg-background/50 backdrop-blur px-4 py-2 rounded-full border border-primary/20 text-xs tracking-widest text-primary">
            3D SILHOUETTE PREVIEW
          </div>
        </div>

        <div className="space-y-12">
          <div className="space-y-6">
            <Label className="text-2xl font-headline">Height ({formData.height} cm)</Label>
            <Slider 
              min={140} max={210} step={1} 
              value={[formData.height]} 
              onValueChange={([v]) => updateFormData('height', v)}
            />
          </div>

          <div className="space-y-6">
            <Label className="text-2xl font-headline">Size Selection</Label>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => (
                <button
                  key={size}
                  onClick={() => updateFormData('bodySize', size)}
                  className={cn(
                    "h-16 rounded-xl border-2 transition-all font-headline text-xl",
                    formData.bodySize === size ? "border-primary bg-primary/10 text-primary glow-gold" : "border-primary/10 bg-card/30 hover:border-primary/40"
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StepStylePreferences = ({ formData, updateFormData }: any) => {
  const toggleItem = (list: string, item: string) => {
    const current = formData[list] as string[];
    const next = current.includes(item) ? current.filter(i => i !== item) : [...current, item];
    updateFormData(list, next);
  };

  return (
    <div className="space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-5xl md:text-6xl font-headline text-primary">Your Vibe</h2>
        <p className="text-foreground/60 text-lg">What aesthetic speaks to your personality?</p>
      </div>

      <div className="space-y-12 max-w-2xl mx-auto">
        <div className="space-y-6">
          <Label className="text-2xl font-headline">Favorite Colors</Label>
          <div className="grid grid-cols-8 gap-4">
            {['#000', '#FFF', '#C9A84C', '#C4545A', '#1A2A6C', '#3D3D3D', '#F5F0E8', '#8B0000'].map(c => (
              <button
                key={c}
                onClick={() => toggleItem('colors', c)}
                className={cn(
                  "w-full aspect-square rounded-full border-2 transition-all relative",
                  formData.colors.includes(c) ? "border-primary scale-125 shadow-lg" : "border-transparent"
                )}
                style={{ backgroundColor: c }}
              >
                {formData.colors.includes(c) && <Check className="w-3 h-3 text-white absolute inset-0 m-auto" />}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <Label className="text-2xl font-headline">Budget (₹{formData.budget[0]} - ₹{formData.budget[1]})</Label>
            </div>
            <Slider 
              min={500} max={20000} step={500} 
              value={formData.budget} 
              onValueChange={(v) => updateFormData('budget', v)}
            />
        </div>
      </div>
    </div>
  );
};

const StepPhotoUpload = ({ formData, updateFormData }: any) => {
  const fileRef = useRef<HTMLInputElement>(null);
  return (
    <div className="space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-5xl md:text-6xl font-headline text-primary">Show Us You</h2>
        <p className="text-foreground/60 text-lg">A visual reference allows our AI to map your unique silhouette.</p>
      </div>

      <div className="max-w-xl mx-auto">
        <div 
          onClick={() => fileRef.current?.click()}
          className="relative h-[450px] rounded-2xl border-2 border-dashed border-primary/20 bg-card/20 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-all group overflow-hidden"
        >
          {formData.photo ? (
            <div className="absolute inset-0 p-4">
                <img src={formData.photo} alt="Upload" className="w-full h-full object-cover rounded-xl border-4 border-primary" />
            </div>
          ) : (
            <>
              <div className="p-8 rounded-full bg-primary/10 mb-6 group-hover:scale-110 transition-transform">
                <Upload className="w-12 h-12 text-primary" />
              </div>
              <h3 className="font-headline text-3xl mb-2">Upload or Take Photo</h3>
              <p className="text-foreground/40 text-sm">Drag & drop or click to open gallery</p>
            </>
          )}
          <input 
            type="file" 
            ref={fileRef} 
            className="hidden" 
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => updateFormData('photo', reader.result as string);
                reader.readAsDataURL(file);
              }
            }}
          />
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4">
          {[
            "Stand straight naturally", "Full body visibility",
            "Natural front lighting", "Plain background best"
          ].map((g, i) => (
            <div key={i} className="flex items-center gap-3 text-sm text-foreground/60">
              <Check className="w-4 h-4 text-primary" /> {g}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
