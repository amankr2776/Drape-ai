'use client';

import { useState, useRef, useEffect, createElement } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  ScanLine, 
  Palette, 
  ShoppingBag, 
  CheckCircle, 
  Camera, 
  Ruler, 
  CloudSun,
  Shirt,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  X,
  Upload,
  Loader2,
  Info
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { performFullAnalysis } from '@/lib/actions';
import { DrapeLogo } from '@/components/drape-logo';

const STEPS = [
  { id: 'dimensions', title: 'Body Dimensions', icon: Ruler },
  { id: 'climate', title: 'Your Climate', icon: CloudSun },
  { id: 'occasion', title: 'Occasion', icon: Shirt },
  { id: 'style', title: 'Style Vibe', icon: Sparkles },
  { id: 'photo', title: 'Style Photo', icon: Camera },
];

export default function AnalyzePage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    height: 165,
    unit: 'cm' as 'cm' | 'ft',
    weight: '',
    size: '',
    chest: '',
    waist: '',
    hips: '',
    season: '',
    climate: '',
    city: '',
    occasions: [] as string[],
    vibe: '',
    colors: [] as string[],
    budget: [1000, 5000],
    photo: null as string | null
  });

  const validateStep = () => {
    const newErrors: Record<string, string> = {};
    
    if (currentStep === 0) {
      if (!formData.height) newErrors.height = "Height is required";
      if (!formData.size) newErrors.size = "Size is required";
    } else if (currentStep === 1) {
      if (!formData.season) newErrors.season = "Season is required";
      if (!formData.climate) newErrors.climate = "Climate type is required";
    } else if (currentStep === 2) {
      if (formData.occasions.length === 0) newErrors.occasions = "Select at least one occasion";
    } else if (currentStep === 3) {
      if (!formData.vibe) newErrors.vibe = "Style vibe is required";
      if (formData.colors.length < 3) newErrors.colors = "Select at least 3 colors";
    } else if (currentStep === 4) {
      if (!formData.photo) newErrors.photo = "Full-body photo is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (currentStep < STEPS.length - 1) setCurrentStep(currentStep + 1);
      else startAnalysis();
    } else {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in all required fields to proceed."
      });
    }
  };

  const startAnalysis = async () => {
    setIsAnalyzing(true);
    // Simulate real analysis process
    try {
      const result = await performFullAnalysis(formData.photo!, formData.occasions[0], formData.budget[1]);
      if (result.error) throw new Error(result.error);
      
      setTimeout(() => {
        router.push('/results');
      }, 4000);
    } catch (e) {
      setIsAnalyzing(false);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "Something went wrong during processing. Please try again."
      });
    }
  };

  const toggleSelection = (key: 'occasions' | 'colors', val: string) => {
    setFormData(prev => {
      const current = prev[key] as string[];
      const next = current.includes(val) 
        ? current.filter(x => x !== val) 
        : [...current, val];
      return { ...prev, [key]: next };
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({ variant: "destructive", title: "File too large", description: "Max photo size is 10MB" });
        return;
      }
      const reader = new FileReader();
      reader.onload = (loadEvent) => setFormData({ ...formData, photo: loadEvent.target?.result as string });
      reader.readAsDataURL(file);
    }
  };

  if (isAnalyzing) {
    return <AnalysisLoadingOverlay />;
  }

  return (
    <div className="min-h-screen bg-obsidian flex flex-col items-center pt-24 pb-32 px-6">
      {/* Progress Bar */}
      <div className="fixed top-[64px] left-0 right-0 h-1 bg-border z-[100]">
        <motion.div 
          className="h-full bg-gold shadow-gold-glow"
          initial={{ width: 0 }}
          animate={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
        />
      </div>

      <div className="w-full max-w-2xl space-y-12">
        <header className="text-center space-y-4">
          <div className="flex justify-center gap-2 mb-4">
            {STEPS.map((_, i) => (
              <div key={i} className={cn(
                "w-2.5 h-2.5 rounded-full transition-all duration-500",
                i === currentStep ? "bg-gold scale-125 shadow-gold-glow" : i < currentStep ? "bg-gold/40" : "bg-border"
              )} />
            ))}
          </div>
          <h1 className="text-4xl md:text-5xl font-headline text-gold">{STEPS[currentStep].title}</h1>
          <p className="text-ivory-3">Complete all fields for the most accurate style report.</p>
        </header>

        <Card className="bg-obsidian-2 border-border p-8 md:p-10 rounded-[24px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              {currentStep === 0 && (
                <div className="space-y-8">
                  <div className="space-y-4">
                    <Label className="text-xs uppercase tracking-widest text-gold">Height ({formData.unit})</Label>
                    <div className="flex gap-4">
                      <Input 
                        type="number" 
                        value={formData.height}
                        onChange={(e) => setFormData({...formData, height: parseInt(e.target.value)})}
                        className={cn("h-14 bg-obsidian-3", errors.height && "border-rose")}
                      />
                      <Button 
                        variant="outline" 
                        onClick={() => setFormData({...formData, unit: formData.unit === 'cm' ? 'ft' : 'cm'})}
                        className="h-14 px-6 border-gold/20"
                      >
                        {formData.unit.toUpperCase()}
                      </Button>
                    </div>
                    {errors.height && <p className="text-rose text-[10px] uppercase font-bold">{errors.height}</p>}
                  </div>

                  <div className="space-y-4">
                    <Label className="text-xs uppercase tracking-widest text-gold">Standard Body Size</Label>
                    <div className="grid grid-cols-6 gap-2">
                      {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(s => (
                        <button
                          key={s}
                          onClick={() => setFormData({...formData, size: s})}
                          className={cn(
                            "h-12 rounded border text-xs font-bold transition-all",
                            formData.size === s ? "bg-gold text-obsidian border-gold" : "border-border text-ivory-3 hover:border-gold/30"
                          )}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                    {errors.size && <p className="text-rose text-[10px] uppercase font-bold">{errors.size}</p>}
                  </div>

                  <div className="pt-4 space-y-4">
                    <button className="text-gold text-xs uppercase tracking-widest font-bold underline underline-offset-4">
                      + Add exact measurements (optional)
                    </button>
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-8">
                  <div className="space-y-4">
                    <Label className="text-xs uppercase tracking-widest text-gold">Current Season</Label>
                    <div className="grid grid-cols-2 gap-4">
                      {['Summer', 'Monsoon', 'Winter', 'Spring'].map(s => (
                        <button
                          key={s}
                          onClick={() => setFormData({...formData, season: s})}
                          className={cn(
                            "p-6 rounded-xl border text-left space-y-2 transition-all",
                            formData.season === s ? "bg-gold/10 border-gold" : "border-border text-ivory-3 hover:border-gold/30"
                          )}
                        >
                          <CloudSun className={cn("w-6 h-6", formData.season === s ? "text-gold" : "text-ivory-4")} />
                          <p className={cn("text-sm font-bold", formData.season === s ? "text-gold" : "text-ivory-2")}>{s}</p>
                        </button>
                      ))}
                    </div>
                    {errors.season && <p className="text-rose text-[10px] uppercase font-bold">{errors.season}</p>}
                  </div>

                  <div className="space-y-4">
                    <Label className="text-xs uppercase tracking-widest text-gold">Climate Type</Label>
                    <div className="flex flex-wrap gap-3">
                      {['Hot & Humid', 'Hot & Dry', 'Moderate', 'Cold'].map(c => (
                        <Badge
                          key={c}
                          onClick={() => setFormData({...formData, climate: c})}
                          className={cn(
                            "px-4 py-2 cursor-pointer transition-all",
                            formData.climate === c ? "bg-gold text-obsidian" : "bg-obsidian-3 text-ivory-3 border-border hover:border-gold/30"
                          )}
                        >
                          {c}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-8">
                  <div className="space-y-4">
                    <Label className="text-xs uppercase tracking-widest text-gold">Select Occasions (Min 1)</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        'Everyday Casual', 'Work & Office', 'Festive & Wedding',
                        'Party Night', 'Date Night', 'Travel', 'Traditional'
                      ].map(o => (
                        <button
                          key={o}
                          onClick={() => toggleSelection('occasions', o)}
                          className={cn(
                            "p-4 rounded-lg border text-left text-xs font-bold transition-all",
                            formData.occasions.includes(o) ? "bg-gold/10 border-gold text-gold" : "border-border text-ivory-3 hover:border-gold/30"
                          )}
                        >
                          {o}
                        </button>
                      ))}
                    </div>
                    {errors.occasions && <p className="text-rose text-[10px] uppercase font-bold">{errors.occasions}</p>}
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-8">
                  <div className="space-y-4">
                    <Label className="text-xs uppercase tracking-widest text-gold">Style Vibe</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {['Minimal', 'Streetwear', 'Fusion', 'Corporate'].map(v => (
                        <button
                          key={v}
                          onClick={() => setFormData({...formData, vibe: v})}
                          className={cn(
                            "aspect-square rounded-xl border flex flex-col items-center justify-center gap-2 transition-all p-2",
                            formData.vibe === v ? "bg-gold/10 border-gold" : "border-border text-ivory-3 hover:border-gold/30"
                          )}
                        >
                          <Image 
                            src={`https://picsum.photos/seed/${v}/200/200`} 
                            width={100} height={100} alt={v} 
                            className="rounded-lg object-cover grayscale" 
                          />
                          <span className="text-[10px] uppercase font-bold">{v}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-xs uppercase tracking-widest text-gold">Favorite Colors (Min 3)</Label>
                    <div className="flex flex-wrap gap-2">
                      {['#000000', '#FFFFFF', '#C9A84C', '#C4545A', '#1A2A6C', '#3D3D3D', '#8B0000', '#FFD700'].map(c => (
                        <button
                          key={c}
                          onClick={() => toggleSelection('colors', c)}
                          className={cn(
                            "w-10 h-10 rounded-full border-2 transition-all",
                            formData.colors.includes(c) ? "border-gold scale-110" : "border-transparent"
                          )}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <Label className="text-xs uppercase tracking-widest text-gold">Budget Range</Label>
                      <span className="text-gold font-bold">₹{formData.budget[0]} - ₹{formData.budget[1]}</span>
                    </div>
                    <Slider 
                      value={formData.budget}
                      min={200} max={10000} step={200}
                      onValueChange={(v) => setFormData({...formData, budget: v})}
                      className="py-4"
                    />
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-8">
                  <div className="p-6 bg-gold/5 rounded-xl border border-dashed border-gold/30 space-y-4">
                    <h4 className="text-sm font-bold text-gold flex items-center gap-2">
                      <Info size={16} /> Photo Requirements
                    </h4>
                    <ul className="text-[10px] uppercase tracking-widest space-y-2 text-ivory-3">
                      <li>• Full body visible head to toe</li>
                      <li>• Natural lighting (avoid backlighting)</li>
                      <li>• Stand against a plain wall</li>
                      <li>• Fitted clothing for better accuracy</li>
                    </ul>
                  </div>

                  {!formData.photo ? (
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full aspect-[4/5] border-2 border-dashed border-border rounded-[24px] bg-obsidian-3 flex flex-col items-center justify-center cursor-pointer hover:border-gold/30 transition-all group"
                    >
                      <div className="p-8 rounded-full bg-gold/10 text-gold mb-6 group-hover:scale-110 transition-transform">
                        <Upload size={40} />
                      </div>
                      <p className="text-gold font-headline text-2xl">Upload Silhouette</p>
                      <p className="text-xs text-ivory-4 mt-2">JPG, PNG, WEBP (Max 10MB)</p>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handlePhotoUpload} 
                        className="hidden" 
                        accept="image/*"
                      />
                    </div>
                  ) : (
                    <div className="relative w-full aspect-[4/5] rounded-[24px] overflow-hidden border border-gold/20 shadow-2xl">
                      <Image src={formData.photo} fill className="object-cover" alt="Silhouette" />
                      <button 
                        onClick={() => setFormData({...formData, photo: null})}
                        className="absolute top-4 right-4 p-3 bg-obsidian/60 backdrop-blur-md rounded-full text-ivory hover:bg-rose transition-colors"
                      >
                        <X size={20} />
                      </button>
                      <div className="absolute bottom-6 left-0 right-0 flex justify-center">
                         <Badge className="bg-gold text-obsidian px-4 py-2 font-bold uppercase tracking-widest text-[10px]">Photo Locked</Badge>
                      </div>
                    </div>
                  )}
                  {errors.photo && <p className="text-rose text-[10px] uppercase font-bold text-center">{errors.photo}</p>}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </Card>

        <div className="flex gap-4">
          <Button 
            variant="outline" 
            onClick={() => setCurrentStep(currentStep - 1)}
            disabled={currentStep === 0}
            className="flex-1 h-14 font-headline text-lg border-gold/20 disabled:opacity-0"
          >
            <ArrowLeft className="mr-2 w-5 h-5" /> Back
          </Button>
          <Button 
            onClick={handleNext}
            className="flex-[2] h-14 font-headline text-2xl tracking-widest bg-gold text-obsidian hover:glow-gold"
          >
            {currentStep === STEPS.length - 1 ? 'Begin Analysis' : 'Continue'} 
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function AnalysisLoadingOverlay() {
  const [step, setStep] = useState(0);
  const steps = [
    { icon: ScanLine, text: 'Mapping Anatomical Landmarks...' },
    { icon: Palette, text: 'Decoding Skin Undertone Harmony...' },
    { icon: User, text: 'Defining Geometric Silhouette...' },
    { icon: ShoppingBag, text: 'Synthesizing Marketplace Inventory...' },
    { icon: Sparkles, text: 'Curating Bespoke Editorial Report...' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setStep(prev => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-[200] bg-obsidian flex flex-col items-center justify-center p-8 text-center">
      <div className="w-full max-w-md relative">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2">
           <DrapeLogo className="scale-150 animate-pulse" />
        </div>

        <div className="aspect-[4/5] bg-obsidian-2 rounded-[32px] border border-gold/20 flex flex-col items-center justify-center p-12 space-y-12 relative overflow-hidden shadow-2xl">
           <div className="absolute inset-0 bg-gradient-to-b from-gold/5 to-transparent pointer-events-none" />
           
           <motion.div 
            key={step}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-24 h-24 rounded-full bg-gold/10 flex items-center justify-center text-gold mb-4"
           >
             {createElement(steps[step].icon, { className: "w-10 h-10 animate-pulse" })}
           </motion.div>

           <AnimatePresence mode="wait">
             <motion.h3 
              key={step}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="text-2xl font-headline text-gold"
             >
               {steps[step].text}
             </motion.h3>
           </AnimatePresence>

           <div className="w-full h-1 bg-border rounded-full overflow-hidden mt-8">
              <motion.div 
                className="h-full bg-gold shadow-gold-glow"
                initial={{ width: 0 }}
                animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
                transition={{ duration: 1.5 }}
              />
           </div>

           <p className="text-[10px] uppercase tracking-[0.4em] text-ivory-4 font-bold mt-12 animate-pulse">
             ATELIER INTELLIGENCE ACTIVE
           </p>
        </div>
      </div>
    </div>
  );
}