import { useState, useRef, useEffect, Fragment } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@supabase/supabase-js";

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
  const [reflection, setReflection] = useState("");
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [renderedPrompt, setRenderedPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const accumulatedTextRef = useRef("");
  const renderIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const renderedWordIndexRef = useRef(0);
  const { toast } = useToast();

  // Word-by-word rendering effect
  useEffect(() => {
    if (!isGenerating && renderIntervalRef.current) {
      // Clean up when done generating
      if (renderIntervalRef.current) {
        clearInterval(renderIntervalRef.current);
        renderIntervalRef.current = null;
      }
      return;
    }

    if (isGenerating) {
      renderIntervalRef.current = setInterval(() => {
        const targetText = accumulatedTextRef.current;
        const words = targetText.split(/(\s+)/);

        if (renderedWordIndexRef.current < words.length) {
          renderedWordIndexRef.current++;
          const renderedWords = words.slice(0, renderedWordIndexRef.current);
          setRenderedPrompt(renderedWords.join(""));
        } else if (!isGenerating) {
          // Stop interval when caught up and not generating
          if (renderIntervalRef.current) {
            clearInterval(renderIntervalRef.current);
            renderIntervalRef.current = null;
          }
        }
      }, 150); // 150ms per word for calm, slow feel
    }

    return () => {
      if (renderIntervalRef.current) {
        clearInterval(renderIntervalRef.current);
        renderIntervalRef.current = null;
      }
    };
  }, [isGenerating]);

  const generatePrompt = async () => {
    setIsGenerating(true);
    setGeneratedPrompt("");
    setRenderedPrompt("");
    accumulatedTextRef.current = "";
    renderedWordIndexRef.current = 0;

    // Clear any existing interval
    if (renderIntervalRef.current) {
      clearInterval(renderIntervalRef.current);
      renderIntervalRef.current = null;
    }

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_SUPABASE_URL
        }/functions/v1/generate-tarot-prompt`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
            }`,
          },
          body: JSON.stringify({
            cardName,
            question: question || "",
            selectedHighlights: highlights,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to generate prompt");

      const reader = response.body?.getReader();
      if (!reader) throw new Error("Response body is not readable");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // SSE data may come in multiple "data: ...\n\n" blocks; split on double newline
        const parts = buffer.split("\n\n");
        // keep last partial chunk in buffer
        buffer = parts.pop() || "";

        for (const part of parts) {
          // each part can contain lines; find lines that start with "data: "
          for (const line of part.split("\n")) {
            if (!line.startsWith("data:")) continue;
            const data = line.replace(/^data:\s*/, "");

            if (data === "[DONE]") {
              // Ensure final text is rendered
              setGeneratedPrompt(accumulatedTextRef.current);
              const words = accumulatedTextRef.current.split(/(\s+)/);
              setRenderedPrompt(words.join(""));
              return;
            }

            // parse the JSON payload
            let json;
            try {
              json = JSON.parse(data);
            } catch (e) {
              console.warn("could not parse json chunk", e, data);
              continue;
            }

            // extract the delta text (chat completions streaming)
            const delta = json.choices?.[0]?.delta;
            const text = delta?.content ?? ""; // sometimes empty for role-only chunk

            if (text) {
              accumulatedTextRef.current += text;
              setGeneratedPrompt(accumulatedTextRef.current);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error generating prompt:", error);
      toast({
        title: "Error",
        description: "Failed to generate prompt",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
      // Final render of any remaining text
      const words = accumulatedTextRef.current.split(/(\s+)/);
      setRenderedPrompt(words.join(""));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("reflections").insert([
        {
          user_id: user.id,
          tarot_card_id: cardId,
          question: question || null,
          reflection,
          generated_prompt: accumulatedTextRef.current || null,
        },
      ]);

      if (error) throw error;

      onSuccess();
      setReflection("");
      setGeneratedPrompt("");
    } catch (error) {
      console.error("Error saving reflection:", error);
      toast({
        title: "Error",
        description: "Failed to save reflection",
        variant: "destructive",
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
          <Label className="text-foreground font-serif text-lg">
            Your Highlights:
          </Label>
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
          <Label className="text-foreground font-serif text-lg">
            AI Reflection Prompt
          </Label>
        </div>
        <p className="text-sm text-muted-foreground mb-3">
          Generate a personalized prompt based on your question and highlighted
          text
        </p>
        {renderedPrompt ? (
          <div className="space-y-2">
            <p className="text-foreground leading-relaxed">
              {renderedPrompt.split(/(\s+)/).map((word, index) => {
                // If it's whitespace, render it directly without span wrapper
                if (/^\s+$/.test(word)) {
                  return <Fragment key={index}>{word}</Fragment>;
                }
                // For non-whitespace chunks, wrap in animated span
                return (
                  <span
                    key={index}
                    className="fade-in-word inline-block"
                    style={{ animationDelay: `${index * 0.15}s` }}
                  >
                    {word}
                  </span>
                );
              })}
            </p>
            {isGenerating && (
              <p className="text-muted-foreground italic text-sm">
                Weaving your highlights with wisdom...
              </p>
            )}
          </div>
        ) : isGenerating ? (
          <p className="text-muted-foreground italic">
            Weaving your highlights with wisdom...
          </p>
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
      <form
        onSubmit={handleSubmit}
        className="space-y-4 p-6 bg-card/50 rounded-lg border border-mystic/20"
      >
        <div className="space-y-2">
          <Label
            htmlFor="reflection"
            className="text-foreground font-serif text-lg"
          >
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
