import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface ReflectionInputProps {
  reflection: string;
  isSubmitting: boolean;
  onReflectionChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const ReflectionInput = ({
  reflection,
  isSubmitting,
  onReflectionChange,
  onSubmit,
}: ReflectionInputProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4 p-6 bg-card/50 rounded-lg border border-mystic/20">
      <div className="space-y-2">
        <Label htmlFor="reflection" className="text-foreground font-serif text-lg">
          Record Your Reflection
        </Label>
        <Textarea
          id="reflection"
          placeholder="How does this card resonate with your current journey?"
          value={reflection}
          onChange={(e) => onReflectionChange(e.target.value)}
          className="min-h-[150px] border-mystic/30 focus:border-mystic/60 placeholder:text-muted-foreground/60"
          maxLength={2000}
          required
        />
        <p className="text-xs text-muted-foreground">
          {reflection.length}/2000 characters
        </p>
      </div>

      <Button 
        type="submit" 
        disabled={isSubmitting || !reflection.trim()}
        className="w-full"
      >
        {isSubmitting ? "Saving..." : "Save Reflection"}
      </Button>
    </form>
  );
};
