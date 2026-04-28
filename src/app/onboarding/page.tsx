'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Camera, Check, Upload, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

// Main component
export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    gender: '',
    height: 160,
    bodySize: '',
    occasions: [] as string[],
    budget: [200, 10000],
    colors: [] as string[],
    photo: null as File | null,
  });

  const totalSteps = 4;
  const router = useRouter();

  const nextStep = () => setStep((prev) => (prev < totalSteps ? prev + 1 : prev));
  const prevStep = () => setStep((prev) => (prev > 1 ? prev - 1 : prev));


  const handleFinish = () => {
    // Here you would typically save the user's profile
    console.log('Onboarding complete:', formData);
    router.push('/analyze');
  };

  const updateFormData = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const steps = [
    {
      id: 1,
      component: <StepPersonalDetails formData={formData} updateFormData={updateFormData} />,
    },
    {
      id: 2,
      component: <StepMeasurements formData={formData} updateFormData={updateFormData} />,
    },
    {
      id: 3,
      component: <StepStylePreferences formData={formData} updateFormData={updateFormData} />,
    },
    {
      id: 4,
      component: <StepPhotoUpload formData={formData} updateFormData={updateFormData} />,
    },
  ];

  const isStep1Valid = formData.fullName && formData.age && formData.gender;

  return (
    <div className="bg-background text-foreground min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <ProgressBar currentStep={step} totalSteps={totalSteps} />
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="w-full max-w-2xl"
        >
          {steps.find(s => s.id === step)?.component}
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-8 left-0 right-0 px-8 flex justify-between items-center">
        {step > 1 ? (
          <Button variant="ghost" onClick={prevStep} className="font-headline text-lg">
            <ArrowLeft className="mr-2" /> Back
          </Button>
        ) : <div />}
        {step < totalSteps ? (
          <Button onClick={nextStep} className="font-headline text-lg tracking-wider" disabled={step === 1 && !isStep1Valid}>
            Continue <ArrowRight className="ml-2" />
          </Button>
        ) : (
          <Button onClick={handleFinish} className="font-headline text-lg tracking-wider">
            Analyze My Style <ArrowRight className="ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}

// Progress Bar
const ProgressBar = ({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) => (
  <div className="absolute top-8 w-full max-w-2xl px-4">
    <div className="flex items-center justify-between mb-2">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
        <div key={step} className="flex flex-col items-center">
          <div
            className={cn(
              'w-3 h-3 rounded-full border-2 border-primary transition-all duration-300',
              currentStep > step && 'bg-primary',
              currentStep === step && 'bg-primary scale-150 animate-pulse',
            )}
          />
        </div>
      ))}
    </div>
    <div className="w-full bg-border h-1 rounded-full">
      <motion.div
        className="bg-primary h-1 rounded-full"
        animate={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      />
    </div>
  </div>
);

type StepProps = {
    formData: any;
    updateFormData: (field: any, value: any) => void;
}

// Step 1: Personal Details
const StepPersonalDetails = ({ formData, updateFormData }: StepProps) => (
  <div className="relative text-center space-y-8 pt-16">
    <span className="absolute top-0 left-1/2 -translate-x-1/2 font-headline text-[120px] text-primary/5 opacity-50 select-none z-0">01</span>
    <div className="relative z-10">
      <h2 className="text-4xl md:text-5xl font-headline text-primary mb-2">Let's Know You</h2>
      <p className="text-lg text-foreground/70">Start by telling us a bit about yourself.</p>
    </div>
    <div className="space-y-6 text-left">
      <div className="space-y-2">
        <Label htmlFor="fullName" className="text-xl font-headline">Full Name</Label>
        <Input id="fullName" value={formData.fullName} onChange={(e) => updateFormData('fullName', e.target.value)} placeholder="Your name" className="py-6" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="age" className="text-xl font-headline">Age</Label>
        <Select value={formData.age} onValueChange={(value) => updateFormData('age', value)}>
          <SelectTrigger className="py-6"><SelectValue placeholder="Select your age" /></SelectTrigger>
          <SelectContent>
            {Array.from({ length: 48 }, (_, i) => i + 13).map(age => (
              <SelectItem key={age} value={String(age)}>{age}</SelectItem>
            ))}
            <SelectItem value="60+">60+</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label className="text-xl font-headline">Gender</Label>
        <RadioGroup value={formData.gender} onValueChange={(value) => updateFormData('gender', value)} className="flex flex-col sm:flex-row gap-4 pt-2">
          {['Male', 'Female', 'Non-binary', 'Prefer not to say'].map(gender => (
            <Label key={gender} className={cn("flex-1 cursor-pointer rounded-md border-2 border-input bg-transparent p-3 text-center transition-all hover:border-primary", formData.gender === gender && "border-primary bg-primary/10")}>
              <RadioGroupItem value={gender} className="sr-only" />
              {gender}
            </Label>
          ))}
        </RadioGroup>
      </div>
    </div>
  </div>
);

// Step 2: Measurements
const StepMeasurements = ({ formData, updateFormData }: StepProps) => (
  <div className="relative text-center space-y-8 pt-16">
    <span className="absolute top-0 left-1/2 -translate-x-1/2 font-headline text-[120px] text-primary/5 opacity-50 select-none z-0">02</span>
    <div className="relative z-10">
      <h2 className="text-4xl md:text-5xl font-headline text-primary mb-2">Your Measurements</h2>
      <p className="text-lg text-foreground/70">This helps us find the perfect fit.</p>
    </div>
    <div className="space-y-8 text-left">
        <div className="space-y-4">
            <Label htmlFor="height" className="text-xl font-headline flex justify-between">
                <span>Height</span>
                <span>{formData.height} cm</span>
            </Label>
            <Slider id="height" min={120} max={220} step={1} value={[formData.height]} onValueChange={([val]) => updateFormData('height', val)} />
        </div>
        <div className="space-y-2">
            <Label className="text-xl font-headline">Body Size (approx.)</Label>
             <RadioGroup value={formData.bodySize} onValueChange={(value) => updateFormData('bodySize', value)} className="grid grid-cols-3 md:grid-cols-6 gap-4 pt-2">
                {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => (
                    <Label key={size} className={cn("cursor-pointer rounded-md border-2 border-input bg-transparent p-3 aspect-square flex items-center justify-center text-center transition-all hover:border-primary", formData.bodySize === size && "border-primary bg-primary/10")}>
                        <RadioGroupItem value={size} className="sr-only" />
                        <div className="flex flex-col items-center">
                            <User className="w-8 h-8 mb-2" />
                            <span className="font-headline text-lg">{size}</span>
                        </div>
                    </Label>
                ))}
            </RadioGroup>
        </div>
    </div>
  </div>
);

// Step 3: Style Preferences
const StepStylePreferences = ({ formData, updateFormData }: StepProps) => {
  const occasions = ['Casual', 'Formal', 'Party', 'Traditional', 'Office', 'Date Night', 'Gym'];
  const colors = ['#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#808080', '#D2B48C', '#A52A2A', '#5F9EA0', '#FFC0CB', '#E6E6FA', '#F5DEB3', '#90EE90'];

  const toggleSelection = (list: 'occasions' | 'colors', item: string) => {
    const currentList = formData[list] as string[];
    const newList = currentList.includes(item)
      ? currentList.filter(i => i !== item)
      : [...currentList, item];
    updateFormData(list, newList);
  };
    
  return (
    <div className="relative text-center space-y-8 pt-16">
        <span className="absolute top-0 left-1/2 -translate-x-1/2 font-headline text-[120px] text-primary/5 opacity-50 select-none z-0">03</span>
        <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-headline text-primary mb-2">Your Vibe</h2>
            <p className="text-lg text-foreground/70">What styles are you drawn to?</p>
        </div>
        <div className="space-y-8 text-left">
            <div className="space-y-2">
                <Label className="text-xl font-headline">Occasions</Label>
                <div className="flex flex-wrap gap-2 pt-2">
                    {occasions.map(occasion => (
                        <Button key={occasion} variant={formData.occasions.includes(occasion) ? 'default' : 'outline'} onClick={() => toggleSelection('occasions', occasion)}>{occasion}</Button>
                    ))}
                </div>
            </div>
             <div className="space-y-2">
                <Label className="text-xl font-headline">Favorite Colors</Label>
                <div className="grid grid-cols-8 gap-2 pt-2">
                    {colors.map(color => (
                         <button key={color} style={{ backgroundColor: color }} onClick={() => toggleSelection('colors', color)} className={cn('w-10 h-10 rounded-md border-2 border-transparent transition-all', formData.colors.includes(color) && 'border-primary ring-2 ring-primary')}>
                             <span className="sr-only">{color}</span>
                         </button>
                    ))}
                </div>
            </div>
             <div className="space-y-4">
                <Label htmlFor="budget" className="text-xl font-headline flex justify-between">
                    <span>Budget (Max)</span>
                    <span>₹{formData.budget[1]}</span>
                </Label>
                <Slider id="budget" min={200} max={10000} step={100} value={[formData.budget[1]]} onValueChange={([val]) => updateFormData('budget', [formData.budget[0], val])} />
            </div>
        </div>
    </div>
  );
};

// Step 4: Photo Upload
const StepPhotoUpload = ({ formData, updateFormData }: StepProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  
  useEffect(() => {
    const getCameraPermission = async () => {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({video: true});
          setHasCameraPermission(true);

          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (error) {
          console.error('Error accessing camera:', error);
          setHasCameraPermission(false);
        }
      } else {
        setHasCameraPermission(false);
      }
    };

    getCameraPermission();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateFormData('photo', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTakePhoto = () => {
     if (!hasCameraPermission) {
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings.',
        });
        return;
    }
    // Placeholder for taking photo
    alert('Take Photo functionality is not fully implemented in this prototype.');
  }

  return (
    <div className="relative text-center space-y-8 pt-16">
        <span className="absolute top-0 left-1/2 -translate-x-1/2 font-headline text-[120px] text-primary/5 opacity-50 select-none z-0">04</span>
        <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-headline text-primary mb-2">Show Us You</h2>
            <p className="text-lg text-foreground/70">A photo helps our AI create the most accurate recommendations.</p>
        </div>
        <div className="space-y-6 text-left">
            {!preview ? (
                <div className="relative border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center justify-center text-center h-96 hover:border-primary transition-all">
                    <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                    <div className='flex flex-col items-center'>
                      <Upload className="w-12 h-12 text-foreground/50 mb-4" />
                      <p className="font-headline text-xl">Upload a Photo</p>
                      <p className="text-foreground/70">or drag and drop</p>
                    </div>
                    <div className="my-4 text-foreground/50">OR</div>
                    <Button variant="ghost" className="z-20" onClick={handleTakePhoto}>
                        <Camera className="mr-2" /> Take Photo
                    </Button>
                </div>
            ) : (
                <div className="relative w-full aspect-[3/4] max-w-sm mx-auto rounded-lg overflow-hidden border-4 border-primary glow-gold">
                    <img src={preview} alt="User preview" className="w-full h-full object-cover" />
                     <Button variant="destructive" size="sm" className="absolute top-2 right-2 z-10" onClick={() => { setPreview(null); updateFormData('photo', null)}}>
                        Remove
                    </Button>
                </div>
            )}
            <ul className="space-y-2 text-foreground/70 pt-4">
                {["Stand straight", "Full body visible", "Good lighting", "Plain background preferred"].map(guideline => (
                    <li key={guideline} className="flex items-center gap-2">
                        <Check className="w-5 h-5 text-primary" /> {guideline}
                    </li>
                ))}
            </ul>
        </div>
    </div>
  );
};
