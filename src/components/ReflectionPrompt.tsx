import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Sparkles } from "lucide-react";

interface ReflectionPromptProps {
  isGenerating: boolean;
  generatedPrompt: string;
  onGenerate: () => void;
  renderMode?: "character" | "word" | "normal";
}

export const ReflectionPrompt = ({
  isGenerating,
  generatedPrompt,
  onGenerate,
  renderMode = "normal",
}: ReflectionPromptProps) => {
  const renderText = () => {
    if (renderMode === "character") {
      return (
        <p className="text-foreground leading-relaxed">
          {generatedPrompt.split("").map((char, index) => (
            <span
              key={index}
              className="fade-in-character"
              style={{ animationDelay: `${index * 0.035}s` }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </p>
      );
    } else if (renderMode === "word") {
      const words = generatedPrompt.split(/(\s+)/);
      return (
        <p className="text-foreground leading-relaxed">
          {words.map((word, index) => (
            <span
              key={index}
              className="fade-in-word inline-block"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {word}
            </span>
          ))}
        </p>
      );
    } else {
      return (
        <p className="text-foreground leading-relaxed">{generatedPrompt}</p>
      );
    }
  };
  return (
    <div className="space-y-3 p-6 bg-card/50 rounded-lg border border-mystic/20 h-full">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="w-5 h-5 text-gold" />
        <Label className="text-foreground font-serif text-lg">
          AI Reflection Prompt
        </Label>
      </div>
      <p className="text-sm text-muted-foreground mb-3">
        Generate a personalized prompt based on your question and selected
        themes
      </p>
      {generatedPrompt ? (
        <div className="space-y-2">
          {renderText()}
          {isGenerating && (
            <p className="text-muted-foreground italic text-sm">
              Weaving the card's wisdom...
            </p>
          )}
        </div>
      ) : isGenerating ? (
        <p className="text-muted-foreground italic">
          Weaving the card's wisdom with your question...
        </p>
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
