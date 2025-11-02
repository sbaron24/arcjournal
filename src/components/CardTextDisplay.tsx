import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface CardTextDisplayProps {
  cardName: string;
  cardText: {
    essence: string;
    symbolicLanguage: string;
    shadowsChallenges: string;
  };
  onContinue: (highlights: string[]) => void;
}

export const CardTextDisplay = ({ cardName, cardText, onContinue }: CardTextDisplayProps) => {
  const [highlights, setHighlights] = useState<string[]>([]);

  const handleTextSelection = () => {
    const selection = window.getSelection();
    const selectedText = selection?.toString().trim();
    
    if (selectedText && selectedText.length > 0) {
      if (!highlights.includes(selectedText)) {
        setHighlights([...highlights, selectedText]);
      }
    }
  };

  const removeHighlight = (highlight: string) => {
    setHighlights(highlights.filter(h => h !== highlight));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4 p-6 bg-card/50 rounded-lg border border-mystic/20">
        <h2 className="font-serif text-2xl text-foreground">{cardName}</h2>
        
        <div 
          className="space-y-6 text-foreground select-text"
          onMouseUp={handleTextSelection}
        >
          <div>
            <h3 className="font-serif text-lg text-gold mb-2">Essence</h3>
            <p className="leading-relaxed">{cardText.essence}</p>
          </div>

          <div>
            <h3 className="font-serif text-lg text-gold mb-2">Symbolic Language</h3>
            <p className="leading-relaxed whitespace-pre-line">{cardText.symbolicLanguage}</p>
          </div>

          <div>
            <h3 className="font-serif text-lg text-gold mb-2">Shadows & Challenges</h3>
            <p className="leading-relaxed">{cardText.shadowsChallenges}</p>
          </div>
        </div>

        {highlights.length > 0 && (
          <div className="mt-6 space-y-3">
            <Label className="text-foreground font-serif">Your Highlights:</Label>
            <div className="space-y-2">
              {highlights.map((highlight, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 p-3 bg-gold/10 rounded border border-gold/30"
                >
                  <span className="flex-1 text-sm text-foreground">{highlight}</span>
                  <button
                    onClick={() => removeHighlight(highlight)}
                    className="text-muted-foreground hover:text-foreground text-xs"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
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
