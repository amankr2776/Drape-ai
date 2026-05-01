'use client';

import { useState, useEffect, useRef } from 'react';
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

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(0); // 1 for right, -1 for left
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    gender: '',
    height: 165,
    heightUnit: 'cm' as 'cm' | 'ft',
    bodySize: '',
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

  const stepVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 500 : -500,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 500 : -500,
      opacity: 0,
    }, { duration: 0.3 }),
  };

  const isStep1Valid = formData.fullName && formData.age && formData.gender;
  const isStep2Valid = formData.height && formData.bodySize;
  const isStep3Valid = formData.occasions.length > 0 && formData.colors.length > 0;

  return (
    <div className="bg-background text-foreground min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px]" />
      </div>

      <ProgressBar currentStep={step} totalSteps={totalSteps} />

      <div className="w-full max-w-2xl mt-20 mb-32">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={step}
            custom={direction}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
          >
            {step === 1 && <StepPersonalDetails formData={formData} updateFormData={updateFormData} />}
            {step === 2 && <StepMeasurements formData={formData} updateFormData={updateFormData} />}
            {step === 3 && <StepStylePreferences formData={formData} updateFormData={updateFormData} />}
            {step === 4 && <StepPhotoUpload formData={formData} updateFormData={updateFormData} />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-8 flex justify-between items-center bg-gradient-to-t from-background via-background/90 to-transparent">
        {step > 1 ? (
          <Button variant="ghost" onClick={() => paginate(-1)} className="font-headline text-xl group">
            <ArrowLeft className="mr-2 transition-transform group-hover:-translate-x-1" /> Back
          </Button>
        ) : <div />}
        
        {step < totalSteps ? (
          <Button 
            onClick={() => paginate(1)} 
            disabled={(step === 1 && !isStep1Valid) || (step === 2 && !isStep2Valid) || (step === 3 && !isStep3Valid)}
            className="font-headline text-xl px-12 h-14 relative overflow-hidden group tracking-widest"
          >
            <span className="relative z-10 flex items-center">
              Continue <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
          </Button>
        ) : (
          <Button 
            onClick={handleFinish} 
            disabled={!formData.photo}
            className="font-headline text-xl px-12 h-14 relative overflow-hidden group tracking-widest bg-primary text-primary-foreground hover:glow-gold"
          >
            <span className="relative z-10 flex items-center">
              Analyze My Style <ArrowRight className="ml-2" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
          </Button>
        )}
      </div>
    </div>
  );
}

const ProgressBar = ({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) => (
  <div className="fixed top-12 left-0 right-0 flex justify-center z-50 px-8">
    <div className="w-full max-w-2xl">
      <div className="flex items-center justify-between mb-4 px-2">
        {Array.from({ length: totalSteps }).map((_, i) => {
          const s = i + 1;
          const isActive = currentStep === s;
          const isCompleted = currentStep > s;
          return (
            <div key={s} className="relative flex flex-col items-center">
              <motion.div
                initial={false}
                animate={{
                  backgroundColor: isCompleted || isActive ? 'hsl(var(--primary))' : 'transparent',
                  scale: isActive ? 1.4 : 1,
                  borderColor: isCompleted || isActive ? 'hsl(var(--primary))' : 'hsl(var(--border))',
                }}
                className={cn(
                  "w-3 h-3 rounded-full border-2 transition-all duration-500",
                  isActive && "shadow-[0_0_15px_hsl(var(--primary))]"
                )}
              >
                {isActive && (
                  <motion.div
                    animate={{ scale: [1, 1.8, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute inset-[-4px] rounded-full border border-primary/50"
                  />
                )}
              </motion.div>
            </div>
          );
        })}
      </div>
      <div className="h-[2px] w-full bg-border relative rounded-full overflow-hidden">
        <motion.div
          className="absolute left-0 top-0 h-full bg-primary shadow-[0_0_10px_hsl(var(--primary))]"
          initial={{ width: '0%' }}
          animate={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
      </div>
    </div>
  </div>
);

type StepProps = {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

const StepPersonalDetails = ({ formData, updateFormData }: StepProps) => (
  <div className="space-y-12 relative">
    <div className="absolute -top-24 left-1/2 -translate-x-1/2 font-headline text-[180px] text-primary/5 select-none pointer-events-none -z-10">01</div>
    <div className="text-center space-y-4">
      <h2 className="text-5xl md:text-6xl font-headline text-primary">Let's Know You</h2>
      <p className="text-foreground/60 text-lg">Curating your identity is the first step toward perfect styling.</p>
    </div>
    
    <div className="space-y-8 max-w-md mx-auto">
      <div className="space-y-3">
        <Label htmlFor="fullName" className="text-xl font-headline tracking-wide">Full Name</Label>
        <Input 
          id="fullName" 
          value={formData.fullName} 
          onChange={(e) => updateFormData('fullName', e.target.value)} 
          placeholder="Enter your name" 
          className="h-14 bg-card/50 border-primary/20 focus:border-primary text-lg"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-3">
          <Label htmlFor="age" className="text-xl font-headline tracking-wide">Age</Label>
          <Select value={formData.age} onValueChange={(v) => updateFormData('age', v)}>
            <SelectTrigger className="h-14 bg-card/50 border-primary/20">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 48 }, (_, i) => i + 13).map(age => (
                <SelectItem key={age} value={String(age)}>{age}</SelectItem>
              ))}
              <SelectItem value="60+">60+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label className="text-xl font-headline tracking-wide">Gender</Label>
          <div className="flex flex-wrap gap-2">
            {['Male', 'Female', 'Non-binary'].map((g) => (
              <button
                key={g}
                onClick={() => updateFormData('gender', g)}
                className={cn(
                  "flex-1 px-4 py-3 rounded-full border transition-all duration-300 text-sm font-medium",
                  formData.gender === g 
                    ? "bg-primary text-primary-foreground border-primary shadow-lg scale-105" 
                    : "bg-card/30 border-primary/20 hover:border-primary/50"
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

const StepMeasurements = ({ formData, updateFormData }: StepProps) => {
  const [isMeasurementsOpen, setIsMeasurementsOpen] = useState(false);
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  return (
    <div className="space-y-12 relative">
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 font-headline text-[180px] text-primary/5 select-none pointer-events-none -z-10">02</div>
      <div className="text-center space-y-4">
        <h2 className="text-5xl md:text-6xl font-headline text-primary">Your Geometry</h2>
        <p className="text-foreground/60 text-lg">Precise measurements for an editorial fit.</p>
      </div>

      <div className="space-y-12 max-w-xl mx-auto">
        <div className="space-y-6">
          <div className="flex justify-between items-end">
            <Label className="text-2xl font-headline">Height</Label>
            <div className="flex items-center gap-2 bg-card/30 rounded-full p-1 border border-primary/20">
              <button 
                onClick={() => updateFormData('heightUnit', 'cm')}
                className={cn("px-3 py-1 rounded-full text-xs transition-colors", formData.heightUnit === 'cm' ? "bg-primary text-primary-foreground" : "text-foreground/50")}
              >CM</button>
              <button 
                onClick={() => updateFormData('heightUnit', 'ft')}
                className={cn("px-3 py-1 rounded-full text-xs transition-colors", formData.heightUnit === 'ft' ? "bg-primary text-primary-foreground" : "text-foreground/50")}
              >FT</button>
            </div>
          </div>
          <div className="flex items-center gap-8">
            <Slider 
              min={120} 
              max={220} 
              step={1} 
              value={[formData.height]} 
              onValueChange={([v]) => updateFormData('height', v)}
              className="flex-grow"
            />
            <div className="text-3xl font-headline text-primary w-24 text-right">
              {formData.height} <span className="text-sm">cm</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <Label className="text-2xl font-headline">Body Size</Label>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {sizes.map((size, idx) => (
              <button
                key={size}
                onClick={() => updateFormData('bodySize', size)}
                className={cn(
                  "relative group flex flex-col items-center gap-3 p-4 rounded-xl border transition-all duration-500 overflow-hidden",
                  formData.bodySize === size 
                    ? "border-primary bg-primary/10 shadow-[0_0_20px_rgba(201,168,76,0.2)]" 
                    : "border-primary/10 bg-card/20 hover:border-primary/40"
                )}
              >
                <div className="relative">
                  <User className={cn(
                    "w-8 h-8 transition-transform duration-500",
                    formData.bodySize === size ? "scale-110 text-primary" : "text-foreground/40",
                    `scale-${0.8 + idx * 0.1}`
                  )} />
                </div>
                <span className={cn("font-headline text-lg", formData.bodySize === size ? "text-primary" : "text-foreground/60")}>
                  {size}
                </span>
                {formData.bodySize === size && (
                  <motion.div layoutId="size-active" className="absolute inset-0 border-2 border-primary rounded-xl" />
                )}
              </button>
            ))}
          </div>
        </div>

        <Collapsible open={isMeasurementsOpen} onOpenChange={setIsMeasurementsOpen} className="bg-card/20 rounded-xl border border-primary/10 overflow-hidden">
          <CollapsibleTrigger asChild>
            <button className="w-full flex justify-between items-center p-6 hover:bg-primary/5 transition-colors">
              <span className="font-headline text-xl flex items-center gap-3">
                <Ruler className="w-5 h-5 text-primary" /> Optional Specifics
              </span>
              {isMeasurementsOpen ? <ChevronUp /> : <ChevronDown />}
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className="p-6 pt-0 grid grid-cols-3 gap-4">
            {['Chest', 'Waist', 'Hips'].map((field) => (
              <div key={field} className="space-y-2">
                <Label className="text-xs uppercase tracking-widest text-foreground/50">{field}</Label>
                <Input 
                  placeholder="Inches" 
                  className="bg-background/50 border-primary/10 focus:border-primary h-10"
                  value={(formData.measurements as any)[field.toLowerCase()]}
                  onChange={(e) => updateFormData('measurements', { ...formData.measurements, [field.toLowerCase()]: e.target.value })}
                />
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};

const StepStylePreferences = ({ formData, updateFormData }: StepProps) => {
  const occasions = ['Casual', 'Formal', 'Party', 'Traditional', 'Office', 'Date Night', 'Gym'];
  const colors = [
    '#000000', '#FFFFFF', '#C9A84C', '#C4545A', '#1A2A6C', '#B21F1F', '#FDBB2D', '#7B4397', 
    '#DC2424', '#4A569D', '#00416A', '#348F50', '#5691C8', '#D39D38', '#A044FF', '#2F80ED'
  ];
  const brands = ['Zara', 'H&M', 'Fabindia', 'W', 'Biba', 'Roadster', 'Sabyasachi', 'Uniqlo', 'Mango', 'Levis'];

  const toggleItem = (list: string, item: string) => {
    const current = formData[list] as string[];
    const next = current.includes(item) 
      ? current.filter(i => i !== item) 
      : [...current, item];
    updateFormData(list, next);
  };

  return (
    <div className="space-y-12 relative">
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 font-headline text-[180px] text-primary/5 select-none pointer-events-none -z-10">03</div>
      <div className="text-center space-y-4">
        <h2 className="text-5xl md:text-6xl font-headline text-primary">Your Vibe</h2>
        <p className="text-foreground/60 text-lg">What aesthetic speaks to your personality?</p>
      </div>

      <div className="space-y-12 max-w-2xl mx-auto">
        <div className="space-y-6">
          <Label className="text-2xl font-headline">Occasions</Label>
          <div className="flex flex-wrap gap-3">
            {occasions.map(occ => (
              <button
                key={occ}
                onClick={() => toggleItem('occasions', occ)}
                className={cn(
                  "px-6 py-3 rounded-full border transition-all duration-300 font-medium",
                  formData.occasions.includes(occ) 
                    ? "bg-primary text-primary-foreground border-primary shadow-lg" 
                    : "bg-card/30 border-primary/20 hover:border-primary/50"
                )}
              >
                {occ}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <div className="flex justify-between items-end">
            <Label className="text-2xl font-headline">Budget Palette</Label>
            <div className="text-primary font-headline text-2xl">
              ₹{formData.budget[0]} - ₹{formData.budget[1]}
            </div>
          </div>
          <Slider 
            min={200} 
            max={20000} 
            step={500} 
            value={formData.budget} 
            onValueChange={(v) => updateFormData('budget', v)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <Label className="text-2xl font-headline">Color Spectrum</Label>
            <div className="grid grid-cols-4 gap-3">
              {colors.map(color => (
                <button
                  key={color}
                  onClick={() => toggleItem('colors', color)}
                  className={cn(
                    "w-full aspect-square rounded-lg border-2 transition-all duration-300 relative group",
                    formData.colors.includes(color) ? "border-primary scale-110 shadow-lg" : "border-transparent"
                  )}
                  style={{ backgroundColor: color }}
                >
                  {formData.colors.includes(color) && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <Label className="text-2xl font-headline">Aspirational Brands</Label>
            <div className="flex flex-wrap gap-2">
              {brands.map(brand => (
                <Badge
                  key={brand}
                  variant={formData.brands.includes(brand) ? "default" : "outline"}
                  onClick={() => toggleItem('brands', brand)}
                  className={cn(
                    "cursor-pointer px-4 py-2 text-sm font-body transition-all",
                    formData.brands.includes(brand) ? "bg-primary text-primary-foreground" : "hover:border-primary"
                  )}
                >
                  {brand}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StepPhotoUpload = ({ formData, updateFormData }: StepProps) => {
  const [preview, setPreview] = useState<string | null>(formData.photo);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result);
        updateFormData('photo', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Camera Access Denied",
        description: "Please enable camera permissions to use this feature."
      });
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(videoRef.current, 0, 0);
      const dataUri = canvas.toDataURL('image/jpeg');
      setPreview(dataUri);
      updateFormData('photo', dataUri);
      
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      setIsCameraActive(false);
    }
  };

  return (
    <div className="space-y-12 relative">
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 font-headline text-[180px] text-primary/5 select-none pointer-events-none -z-10">04</div>
      <div className="text-center space-y-4">
        <h2 className="text-5xl md:text-6xl font-headline text-primary">Show Us You</h2>
        <p className="text-foreground/60 text-lg">A visual reference allows our AI to map your unique silhouette.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-4xl mx-auto">
        <div className="space-y-8">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 to-accent/50 rounded-2xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            
            <div className="relative h-[400px] w-full rounded-2xl bg-card/40 border-2 border-dashed border-primary/20 overflow-hidden flex flex-col items-center justify-center text-center p-8 transition-all group-hover:border-primary/50">
              
              {isCameraActive ? (
                <div className="absolute inset-0 z-20 bg-black">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                  <Button 
                    onClick={capturePhoto} 
                    className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full w-16 h-16 bg-white hover:bg-white/90 p-0 flex items-center justify-center border-4 border-primary"
                  >
                    <div className="w-10 h-10 rounded-full border-2 border-black" />
                  </Button>
                </div>
              ) : preview ? (
                <div className="absolute inset-0 z-10 group/preview">
                  <img src={preview} alt="Profile" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => setPreview(null)} className="rounded-full bg-background/20 backdrop-blur-md border-white/20 hover:bg-red-500/50">
                      <ArrowLeft className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mb-6 relative">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
                    <Upload className="w-16 h-16 text-primary relative z-10" />
                  </div>
                  <h3 className="font-headline text-2xl mb-2">Upload Visual</h3>
                  <p className="text-foreground/50 text-sm mb-8">Drag & drop or select from library</p>
                  
                  <div className="flex gap-4">
                    <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="border-primary/20 hover:border-primary">
                      <Sparkles className="mr-2 w-4 h-4" /> Upload
                    </Button>
                    <Button onClick={startCamera} variant="outline" className="border-primary/20 hover:border-primary">
                      <Camera className="mr-2 w-4 h-4" /> Camera
                    </Button>
                  </div>
                </>
              )}

              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*" 
              />
              
              {/* Rotating dashes animation */}
              <div className="absolute inset-0 pointer-events-none">
                <svg className="w-full h-full">
                  <rect 
                    width="100%" 
                    height="100%" 
                    fill="none" 
                    rx="16" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeDasharray="20 10" 
                    className="text-primary/10 animate-[spin_60s_linear_infinite]" 
                    style={{ transformOrigin: 'center' }}
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="space-y-6">
            <h3 className="font-headline text-3xl text-primary">Capture Guidelines</h3>
            <div className="space-y-4">
              {[
                { text: "Stand straight with natural posture", delay: 0.1 },
                { text: "Ensure full body visibility (Head to Toe)", delay: 0.2 },
                { text: "Use bright, natural front-facing light", delay: 0.3 },
                { text: "A clean, solid background works best", delay: 0.4 },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: item.delay }}
                  className="flex items-center gap-4 bg-card/30 p-4 rounded-xl border border-primary/5 hover:border-primary/20 transition-all group"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Check className="w-4 h-4" />
                  </div>
                  <span className="text-foreground/80 font-body">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
