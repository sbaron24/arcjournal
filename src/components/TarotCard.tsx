import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import cardBackImage from "@/assets/card-back.jpg";

interface TarotCardData {
  name: string;
  description: string;
  keywords: string[];
  shadowKeywords: string[];
  symbolicPair: string;
  element: string;
  planetSign: string;
  imageUrl?: string;
}

interface TarotCardProps {
  data?: TarotCardData;
  isRevealed?: boolean;
  onReveal?: () => void;
}

export const TarotCard = ({ data, isRevealed = false, onReveal }: TarotCardProps) => {
  const [flipped, setFlipped] = useState(isRevealed);

  const handleClick = () => {
    if (!flipped && onReveal) {
      setFlipped(true);
      onReveal();
    }
  };

  if (!flipped) {
    return (
      <Card 
        className="relative w-full max-w-sm aspect-[9/16] cursor-pointer group overflow-hidden bg-gradient-to-br from-card to-secondary border-2 border-mystic/30 hover:border-mystic/60 transition-all duration-500 hover:scale-105"
        onClick={handleClick}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-mystic/20 via-transparent to-celestial/20" />
        <div className="relative h-full flex flex-col items-center justify-center p-8 gap-6">
          <div className="w-48 h-48 rounded-full bg-gradient-to-br from-mystic to-celestial/50 flex items-center justify-center animate-float">
            <img 
              src={cardBackImage} 
              alt="Card back" 
              className="w-full h-full object-cover rounded-full opacity-80 group-hover:opacity-100 transition-opacity"
            />
          </div>
          
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-2 text-gold">
              <div className="w-8 h-[2px] bg-gradient-to-r from-transparent to-gold" />
              <span className="text-4xl">✦</span>
              <div className="w-8 h-[2px] bg-gradient-to-l from-transparent to-gold" />
            </div>
            
            <h3 className="font-serif text-2xl text-foreground group-hover:text-gold transition-colors">
              Draw Your Card
            </h3>
            
            <p className="text-muted-foreground text-sm">
              Click to reveal your destiny
            </p>
          </div>
        </div>
      </Card>
    );
  }

  if (!data) return null;

  return (
    <Card className="w-full max-w-sm aspect-[9/16] overflow-hidden bg-card border-2 border-mystic/30 animate-reveal">
      <div className="h-full flex flex-col">
        {data.imageUrl && (
          <div className="relative h-2/5 overflow-hidden border-b border-border">
            <img 
              src={data.imageUrl} 
              alt={data.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <div className="flex-1 p-6 space-y-4 overflow-y-auto">
          <div className="space-y-2">
            <h2 className="font-serif text-3xl text-foreground">{data.name}</h2>
            <p className="text-muted-foreground italic text-sm leading-relaxed">
              {data.description}
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-semibold mb-2 text-foreground">Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {data.keywords.map((keyword, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary"
                    className="bg-celestial/20 text-celestial border-celestial/30"
                  >
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>

            {data.shadowKeywords.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-2 text-foreground">Shadow Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {data.shadowKeywords.map((keyword, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary"
                      className="bg-shadow/20 text-shadow border-shadow/30"
                    >
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-2 space-y-2 border-t border-border">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Symbolic Pair</span>
                <span className="font-medium text-foreground">{data.symbolicPair}</span>
              </div>
              
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <span className="text-xs text-muted-foreground block mb-1">Element</span>
                  <Badge 
                    variant="secondary"
                    className="w-full justify-center bg-accent/20 text-accent-foreground border-accent/30"
                  >
                    {data.element}
                  </Badge>
                </div>
                
                <div className="flex-1">
                  <span className="text-xs text-muted-foreground block mb-1">Planet/Sign</span>
                  <Badge 
                    variant="secondary"
                    className="w-full justify-center bg-mystic/20 text-mystic border-mystic/30"
                  >
                    {data.planetSign}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
