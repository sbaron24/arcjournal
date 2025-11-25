import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface CardTextDisplayProps {
  cardName: string;
  cardText: {
    essence: string;
    symbolicLanguage: string;
    shadowsChallenges: string;
  };
  existingHighlights?: string[];
  onContinue: (highlights: string[]) => void;
}

export const CardTextDisplay = ({
  cardName,
  cardText,
  existingHighlights = [],
  onContinue,
}: CardTextDisplayProps) => {
  const [highlights, setHighlights] = useState<string[]>(existingHighlights);

  const handleTextSelection = () => {
    const selection = window.getSelection();
    const selectedText = selection?.toString().trim();

    if (selectedText && selectedText.length > 0) {
      if (!highlights.includes(selectedText)) {
        setHighlights([...highlights, selectedText]);
      }
      // Clear the selection after adding to highlights
      selection?.removeAllRanges();
    }
  };

  const removeHighlight = (highlight: string) => {
    setHighlights(highlights.filter((h) => h !== highlight));
  };

  const renderTextWithHighlights = (text: string) => {
    // Convert literal \n to actual newlines for display
    const normalizedText = text.replace(/\\n/g, "\n");

    if (highlights.length === 0) return normalizedText;

    let result = normalizedText;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    highlights.forEach((highlight) => {
      const index = result.indexOf(highlight, lastIndex);
      if (index !== -1) {
        if (index > lastIndex) {
          parts.push(result.substring(lastIndex, index));
        }
        parts.push(
          <mark
            key={`${highlight}-${index}`}
            className="bg-gold/30 text-foreground cursor-pointer hover:bg-gold/40 rounded px-1"
            onClick={() => removeHighlight(highlight)}
            title="Click to remove highlight"
          >
            {highlight}
          </mark>
        );
        lastIndex = index + highlight.length;
      }
    });

    if (lastIndex < result.length) {
      parts.push(result.substring(lastIndex));
    }

    return parts.length > 0 ? parts : normalizedText;
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4 p-6 bg-card/50 rounded-lg border border-mystic/20">
        <h2 className="font-serif text-2xl text-foreground">{cardName}</h2>

        {highlights.length > 0 && (
          <p className="text-sm text-muted-foreground italic">
            Click on any highlighted text to remove it
          </p>
        )}

        <div
          className="space-y-6 text-foreground select-text"
          onMouseUp={handleTextSelection}
        >
          <div>
            <h3 className="font-serif text-lg text-gold mb-2">Essence</h3>
            <p className="leading-relaxed whitespace-pre-line">
              {renderTextWithHighlights(cardText.essence)}
            </p>
          </div>

          <div>
            <h3 className="font-serif text-lg text-gold mb-2">
              Symbolic Language
            </h3>
            <p className="leading-relaxed whitespace-pre-line">
              {renderTextWithHighlights(cardText.symbolicLanguage)}
            </p>
          </div>

          <div>
            <h3 className="font-serif text-lg text-gold mb-2">
              Shadows & Challenges
            </h3>
            <p className="leading-relaxed whitespace-pre-line">
              {renderTextWithHighlights(cardText.shadowsChallenges)}
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <Button
          onClick={() => onContinue(highlights)}
          className="bg-mystic hover:bg-mystic/80"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};
