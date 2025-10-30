import { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { Sparkles } from 'lucide-react';

interface ReflectionFormProps {
  cardId: string;
  question: string;
  cardData: {
    name: string;
    description: string;
    keywords: string[];
    shadowKeywords: string[];
    element: string;
    planetSign: string;
  };
  onSuccess?: () => void;
}

const reflectionSchema = z.object({
  reflection: z.string()
    .trim()
    .min(1, { message: "Reflection cannot be empty" })
    .max(2000, { message: "Reflection must be less than 2000 characters" }),
});

export const ReflectionForm = ({ cardId, question, cardData, onSuccess }: ReflectionFormProps) => {
  const [reflection, setReflection] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [selectedShadowKeywords, setSelectedShadowKeywords] = useState<string[]>([]);
  const [selectedElement, setSelectedElement] = useState(cardData.element);
  const [selectedPlanetSign, setSelectedPlanetSign] = useState(cardData.planetSign);
  const { toast } = useToast();

  useEffect(() => {
    if (question) {
      generatePrompt();
    }
  }, []);

  const generatePrompt = async () => {
    if (!question.trim()) {
      toast({
        title: "Question Required",
        description: "Please enter a question first",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-tarot-prompt', {
        body: {
          question,
          cardName: cardData.name,
          keywords: cardData.keywords,
          shadowKeywords: cardData.shadowKeywords,
          element: cardData.element,
          planetSign: cardData.planetSign,
          description: cardData.description,
        },
      });

      if (error) throw error;

      setGeneratedPrompt(data.generatedPrompt);
    } catch (error) {
      console.error('Error generating prompt:', error);
      toast({
        title: "Error",
        description: "Failed to generate personalized prompt",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleKeyword = (keyword: string) => {
    setSelectedKeywords(prev =>
      prev.includes(keyword) ? prev.filter(k => k !== keyword) : [...prev, keyword]
    );
  };

  const toggleShadowKeyword = (keyword: string) => {
    setSelectedShadowKeywords(prev =>
      prev.includes(keyword) ? prev.filter(k => k !== keyword) : [...prev, keyword]
    );
  };

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
          question: question,
          generated_prompt: generatedPrompt,
          selected_keywords: selectedKeywords,
          selected_shadow_keywords: selectedShadowKeywords,
          selected_element: selectedElement,
          selected_planet_sign: selectedPlanetSign,
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
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-2xl">
      {/* Generated Prompt Section */}
      <div className="space-y-3 p-6 bg-card/50 rounded-lg border border-mystic/20">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-gold" />
          <Label className="text-foreground font-serif text-lg">Your Personalized Reflection Prompt</Label>
        </div>
        {isGenerating ? (
          <p className="text-muted-foreground italic">Weaving the cards wisdom with your question...</p>
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
            Generate Personalized Prompt
          </Button>
        )}
      </div>

      {/* Card Attribute Selections */}
      <div className="space-y-4">
        <Label className="text-foreground">Select Resonating Themes</Label>
        
        <div className="space-y-3">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Keywords</p>
            <div className="flex flex-wrap gap-2">
              {cardData.keywords.map((keyword) => (
                <Badge
                  key={keyword}
                  variant={selectedKeywords.includes(keyword) ? "default" : "outline"}
                  className="cursor-pointer transition-colors"
                  onClick={() => toggleKeyword(keyword)}
                >
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-2">Shadow Keywords</p>
            <div className="flex flex-wrap gap-2">
              {cardData.shadowKeywords.map((keyword) => (
                <Badge
                  key={keyword}
                  variant={selectedShadowKeywords.includes(keyword) ? "default" : "outline"}
                  className="cursor-pointer transition-colors"
                  onClick={() => toggleShadowKeyword(keyword)}
                >
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Element</p>
              <Badge variant="secondary" className="w-full justify-center">
                {selectedElement}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Planet/Sign</p>
              <Badge variant="secondary" className="w-full justify-center">
                {selectedPlanetSign}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Reflection Input */}
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
