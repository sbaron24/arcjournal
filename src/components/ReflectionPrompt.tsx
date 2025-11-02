import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Sparkles } from 'lucide-react';

interface ReflectionPromptProps {
  isGenerating: boolean;
  generatedPrompt: string;
  onGenerate: () => void;
}

export const ReflectionPrompt = ({
  isGenerating,
  generatedPrompt,
  onGenerate,
}: ReflectionPromptProps) => {
  return (
    <div className="space-y-3 p-6 bg-card/50 rounded-lg border border-mystic/20 h-full">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="w-5 h-5 text-gold" />
        <Label className="text-foreground font-serif text-lg">AI Reflection Prompt</Label>
      </div>
      <p className="text-sm text-muted-foreground mb-3">
        Generate a personalized prompt based on your question and selected themes
      </p>
      {isGenerating ? (
        <p className="text-muted-foreground italic">Weaving the card's wisdom with your question...</p>
      ) : generatedPrompt ? (
        <p className="text-foreground leading-relaxed">{generatedPrompt}</p>
      ) : (
        <Button
          type="button"
          onClick={onGenerate}
          variant="outline"
          className="border-mystic/50"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Generate Prompt
        </Button>
      )}
    </div>
  );
};
