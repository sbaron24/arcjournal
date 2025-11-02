import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { User } from '@supabase/supabase-js';

interface ReflectionLayoutBProps {
  cardId: string;
  cardName: string;
  highlights: string[];
  question: string;
  user: User;
  onSuccess: () => void;
  onBack: () => void;
}

export const ReflectionLayoutB = ({
  cardId,
  cardName,
  highlights,
  question,
  user,
  onSuccess,
  onBack,
}: ReflectionLayoutBProps) => {
  const [reflection, setReflection] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const generatePrompt = async () => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-tarot-prompt', {
        body: {
          cardName,
          question: question || '',
          selectedHighlights: highlights,
        },
      });

      if (error) throw error;
      setGeneratedPrompt(data.prompt);
    } catch (error) {
      console.error('Error generating prompt:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate prompt',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('reflections').insert([{
        user_id: user.id,
        tarot_card_id: cardId,
        question: question || null,
        reflection,
        generated_prompt: generatedPrompt || null,
      }]);

      if (error) throw error;

      onSuccess();
      setReflection('');
      setGeneratedPrompt('');
    } catch (error) {
      console.error('Error saving reflection:', error);
      toast({
        title: 'Error',
        description: 'Failed to save reflection',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Highlights Display */}
      {highlights.length > 0 && (
        <div className="space-y-3 p-6 bg-card/50 rounded-lg border border-mystic/20">
          <Label className="text-foreground font-serif text-lg">Your Highlights:</Label>
          <div className="flex flex-wrap gap-2">
            {highlights.map((highlight, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gold/20 text-foreground rounded-full text-sm border border-gold/30"
              >
                {highlight}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Optional AI Prompt Generation */}
      <div className="space-y-3 p-6 bg-card/50 rounded-lg border border-mystic/20">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-gold" />
          <Label className="text-foreground font-serif text-lg">AI Reflection Prompt</Label>
        </div>
        <p className="text-sm text-muted-foreground mb-3">
          Generate a personalized prompt based on your question and highlighted text
        </p>
        {isGenerating ? (
          <p className="text-muted-foreground italic">Weaving your highlights with wisdom...</p>
        ) : generatedPrompt ? (
          <p className="text-foreground leading-relaxed">{generatedPrompt}</p>
        ) : (
          <Button
            type="button"
            onClick={generatePrompt}
            variant="outline"
            className="border-mystic/50"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Generate Prompt
          </Button>
        )}
      </div>

      {/* Reflection Input */}
      <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-card/50 rounded-lg border border-mystic/20">
        <div className="space-y-2">
          <Label htmlFor="reflection" className="text-foreground font-serif text-lg">
            Record Your Reflection
          </Label>
          <Textarea
            id="reflection"
            placeholder="How does this card resonate with your current journey?"
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            className="min-h-[150px] border-mystic/30 focus:border-mystic/60 placeholder:text-muted-foreground/60"
            maxLength={2000}
            required
          />
          <p className="text-xs text-muted-foreground">
            {reflection.length}/2000 characters
          </p>
        </div>

        <div className="flex gap-3">
          <Button 
            type="button"
            onClick={onBack}
            variant="outline"
            className="border-mystic/50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting || !reflection.trim()}
            className="flex-1"
          >
            {isSubmitting ? "Saving..." : "Save Reflection"}
          </Button>
        </div>
      </form>
    </div>
  );
};
