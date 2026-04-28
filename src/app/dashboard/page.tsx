'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { getOutfitRecommendation } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { OutfitDisplay } from '@/components/outfit-display';
import { OutfitDisplaySkeleton } from '@/components/loading-skeletons';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Wand2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full font-headline text-lg tracking-wider">
      {pending ? (
        <>
          <span className="animate-spin mr-2">
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </span>
          Generating...
        </>
      ) : (
        <>
          <Wand2 className="mr-2 h-5 w-5" />
          Generate Outfit
        </>
      )}
    </Button>
  );
}

export default function DashboardPage() {
  const initialState = { recommendation: null, error: null };
  const [state, formAction] = useFormState(getOutfitRecommendation, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.error) {
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: state.error,
      });
    }
  }, [state.error, toast]);

  return (
    <div className="container mx-auto p-4 md:p-8">
      {!state.recommendation && !useFormStatus().pending && (
        <div className="max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
          <Card className="w-full bg-card border-border">
            <CardHeader className="text-center">
              <CardTitle className="text-4xl text-primary">Style Atelier</CardTitle>
              <CardDescription className="text-lg">
                Describe the occasion and weather, and let our AI craft the perfect look for you.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form action={formAction} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="occasion" className="text-md font-headline">Occasion</Label>
                  <Input
                    id="occasion"
                    name="occasion"
                    placeholder="e.g., 'A friend's sangeet', 'Beachside brunch'"
                    required
                    className="py-6"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weather" className="text-md font-headline">Weather</Label>
                  <Input
                    id="weather"
                    name="weather"
                    placeholder="e.g., 'Warm and humid, 28°C', 'Cool evening, 18°C'"
                    required
                    className="py-6"
                  />
                </div>
                <SubmitButton />
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {useFormStatus().pending && <OutfitDisplaySkeleton />}
      
      {state.recommendation && <OutfitDisplay recommendation={state.recommendation} />}
    </div>
  );
}
