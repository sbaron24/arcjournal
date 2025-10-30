import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';

interface ReflectionFormProps {
  cardId: string;
  onSuccess?: () => void;
}

const reflectionSchema = z.object({
  reflection: z.string()
    .trim()
    .min(1, { message: "Reflection cannot be empty" })
    .max(2000, { message: "Reflection must be less than 2000 characters" }),
});

export const ReflectionForm = ({ cardId, onSuccess }: ReflectionFormProps) => {
  const [reflection, setReflection] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const validated = reflectionSchema.parse({ reflection });
      setIsSubmitting(true);

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to save reflections",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('reflections')
        .insert({
          user_id: user.id,
          tarot_card_id: cardId,
          reflection: validated.reflection,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your reflection has been saved",
      });
      
      setReflection('');
      onSuccess?.();
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0].message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to save reflection",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-2xl">
      <div className="space-y-2">
        <Label htmlFor="reflection" className="text-foreground">
          Record Your Reflection
        </Label>
        <Textarea
          id="reflection"
          placeholder="What insights does this card bring to you? How does it resonate with your current journey?"
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          className="min-h-[150px] border-mystic/30 focus:border-mystic/60"
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
