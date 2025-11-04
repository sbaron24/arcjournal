import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RequestBody {
  cardName?: string;
  question?: string;
  selectedKeywords?: string[];
  selectedShadowKeywords?: string[];
  selectedElement?: string;
  selectedPlanetSign?: string;
  description?: string;
  selectedHighlights?: string[];
}

interface ReflectionPromptProps {
  requestBody: RequestBody;
  renderMode?: "character" | "word" | "normal";
  onPromptGenerated?: (text: string) => void;
  height?: string;
}

export const ReflectionPrompt = ({
  requestBody,
  renderMode = "normal",
  onPromptGenerated,
  height,
}: ReflectionPromptProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [renderedPrompt, setRenderedPrompt] = useState("");
  const accumulatedTextRef = useRef("");
  const renderIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const renderedIndexRef = useRef(0);
  const { toast } = useToast();

  // Character-by-character rendering effect (only for character mode)
  useEffect(() => {
    if (renderMode !== "character") {
      // For word and normal modes, render directly from generatedPrompt
      setRenderedPrompt(generatedPrompt);
      return;
    }

    // Only start interval if we don't have one and we're generating or have text to render
    if (!renderIntervalRef.current && (isGenerating || generatedPrompt)) {
      renderIntervalRef.current = setInterval(() => {
        const targetText = accumulatedTextRef.current;
        if (renderedIndexRef.current < targetText.length) {
          renderedIndexRef.current++;
          setRenderedPrompt(targetText.slice(0, renderedIndexRef.current));
        } else {
          // Stop interval when caught up
          if (renderIntervalRef.current) {
            clearInterval(renderIntervalRef.current);
            renderIntervalRef.current = null;
          }
        }
      }, 35); // 35ms per character for calm, slow feel
    }

    // Clean up only when component unmounts or mode changes
    return () => {
      if (renderIntervalRef.current) {
        clearInterval(renderIntervalRef.current);
        renderIntervalRef.current = null;
      }
    };
  }, [isGenerating, renderMode, generatedPrompt]);

  const generatePrompt = async () => {
    setIsGenerating(true);
    setGeneratedPrompt("");
    setRenderedPrompt("");
    accumulatedTextRef.current = "";
    renderedIndexRef.current = 0;

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
          body: JSON.stringify(requestBody),
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
              setRenderedPrompt(accumulatedTextRef.current);
              // Call callback with final text
              onPromptGenerated?.(accumulatedTextRef.current);
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
              // For word and normal modes, update rendered immediately
              if (renderMode !== "character") {
                setRenderedPrompt(accumulatedTextRef.current);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Error generating prompt:", error);
      toast({
        title: "Error",
        description: "Failed to generate personalized prompt",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
      // Final render of any remaining text
      setRenderedPrompt(accumulatedTextRef.current);
      // Call callback with final text
      onPromptGenerated?.(accumulatedTextRef.current);
    }
  };

  const renderText = () => {
    const textToRender =
      renderMode === "character" ? renderedPrompt : generatedPrompt;

    if (renderMode === "character") {
      return (
        <p className="text-foreground leading-relaxed break-words whitespace-normal">
          {textToRender.split("").map((char, index) => (
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
      const words = textToRender.split(/(\s+)/);
      return (
        <p className="text-foreground leading-relaxed break-words whitespace-normal">
          {words.map((word, index) => (
            <span
              key={index}
              className="fade-in-word inline-block break-words max-w-full"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {word === " " ? "\u00A0" : word.replace(/ /g, "\u00A0")}
            </span>
          ))}
        </p>
      );
    } else {
      return (
        <p className="text-foreground leading-relaxed break-words">
          {textToRender}
        </p>
      );
    }
  };

  return (
    <div
      className="flex flex-col space-y-3 p-6 bg-card/50 rounded-lg border border-mystic/20"
      style={height ? { height } : { minHeight: "200px" }}
    >
      <div className="flex items-center gap-2 mb-2 flex-shrink-0">
        <Sparkles className={`w-5 h-5 text-gold`} />
        <Label className="text-foreground font-serif text-lg">
          AI Reflection Prompt
        </Label>
      </div>
      <p className="text-sm text-muted-foreground mb-3 flex-shrink-0">
        Generate a personalized prompt based on your question and selected
        themes
      </p>
      <div className="flex flex-col flex-1 min-h-[100px] relative">
        {generatedPrompt ? (
          <div className="flex-1 min-h-0 overflow-y-auto">
            <div className="min-h-[100px]">{renderText()}</div>
          </div>
        ) : (
          <div className="flex-1 flex items-end justify-start">
            {!isGenerating && (
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
        )}
      </div>
    </div>
  );
};
