import { useState } from "react";
import { TarotCard } from "@/components/TarotCard";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import temperanceImage from "@/assets/temperance-card.jpg";

const temperanceData = {
  name: "Temperance",
  description: "Alchemy and integration of opposites; divine flow.",
  keywords: ["balance", "moderation", "healing"],
  shadowKeywords: ["excess", "imbalance"],
  symbolicPair: "The Devil",
  element: "Fire",
  planetSign: "Sagittarius",
  imageUrl: temperanceImage,
};

const Index = () => {
  const [isRevealed, setIsRevealed] = useState(false);

  const handleReset = () => {
    setIsRevealed(false);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Mystical background effects */}
      <div className="fixed inset-0 bg-gradient-to-b from-background via-background to-card/50" />
      <div className="fixed inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-64 h-64 bg-mystic/30 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-celestial/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12 min-h-screen flex flex-col items-center justify-center">
        <div className="text-center mb-12 space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-[2px] bg-gradient-to-r from-transparent via-gold to-gold" />
            <Sparkles className="w-8 h-8 text-gold" />
            <div className="w-12 h-[2px] bg-gradient-to-l from-transparent via-gold to-gold" />
          </div>
          
          <h1 className="font-serif text-5xl md:text-6xl text-foreground mb-2">
            Mystic Tarot
          </h1>
          
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            Discover divine guidance through the ancient art of tarot reading
          </p>
        </div>

        <div className="mb-8">
          <TarotCard 
            data={isRevealed ? temperanceData : undefined}
            isRevealed={isRevealed}
            onReveal={() => setIsRevealed(true)}
          />
        </div>

        {isRevealed && (
          <Button 
            onClick={handleReset}
            variant="outline"
            className="border-mystic/50 text-foreground hover:bg-mystic/10 hover:text-gold transition-all"
          >
            Draw Another Card
          </Button>
        )}

        <div className="mt-16 text-center text-muted-foreground text-sm max-w-lg">
          <p className="italic">
            "The cards reveal not what will be, but what might be—a glimpse into the infinite possibilities of your journey."
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
