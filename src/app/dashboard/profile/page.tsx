import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ProfilePage() {
  // NOTE: This is a UI demonstration. In a real app, you would use
  // state management and an action to save this data. The data is
  // currently hardcoded in `src/lib/actions.ts`.
  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-primary">Your Style Profile</h1>
          <p className="mt-4 text-lg text-foreground/70">
            Curate your personal aesthetic. The more we know, the better our recommendations become.
          </p>
        </header>

        <form className="space-y-8">
          <div className="space-y-2">
            <Label htmlFor="style" className="text-xl font-headline">Style Preferences</Label>
            <Textarea
              id="style"
              placeholder="e.g., Minimalist, bohemian, traditional Indian, contemporary fusion..."
              className="min-h-[120px]"
              defaultValue="Minimalist with a touch of bohemian, loves handloom fabrics, and modern silhouettes."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="measurements" className="text-xl font-headline">Body Measurements & Figure</Label>
            <Input
              id="measurements"
              placeholder="e.g., Height 5'6\", size M, hourglass figure..."
              defaultValue="Height 5'4\", size S, pear-shaped figure."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="inspiration" className="text-xl font-headline">Inspiration</Label>
            <Textarea
              id="inspiration"
              placeholder="e.g., Vogue India editorials, specific celebrity looks, Sabyasachi campaigns..."
              className="min-h-[120px]"
              defaultValue="Sabyasachi campaigns, old Bollywood glamour, Vogue India editorials."
            />
          </div>
           <div className="space-y-2">
            <Label htmlFor="requirements" className="text-xl font-headline">Occasion Requirements</Label>
            <Textarea
              id="requirements"
              placeholder="e.g., Needs comfortable but elegant options for long events..."
              className="min-h-[120px]"
              defaultValue="Prefers outfits that can be styled for both day and evening events, values comfort and elegance."
            />
          </div>
          <div className="text-right">
             <Button type="submit" disabled className="font-headline text-lg tracking-wider">Save Profile</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
