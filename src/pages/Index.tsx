import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TarotCard } from "@/components/TarotCard";
import { ReflectionForm } from "@/components/ReflectionForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, BookOpen } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { usePreferences } from "@/hooks/usePreferences";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CardTextDisplay } from "@/components/CardTextDisplay";
import { ReflectionLayoutB } from "@/components/ReflectionLayoutB";
import { AccountDropdown } from "@/components/AccountDropdown";

interface CardData {
  id: string;
  name: string;
  description: string;
  keywords: string[];
  shadowKeywords: string[];
  symbolicPair: string;
  element: string;
  planetSign: string;
  imageUrl: string;
  text: {
    essence: string;
    symbolicLanguage: string;
    shadowsChallenges: string;
  };
}

const Index = () => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [cardId, setCardId] = useState<string | null>(null);
  const [cardData, setCardData] = useState<CardData | null>(null);
  const [question, setQuestion] = useState("");
  const [showTextView, setShowTextView] = useState(true);
  const [highlights, setHighlights] = useState<string[]>([]);
  const [imageError, setImageError] = useState(false);
  const { user } = useAuth();
  const { preferredLayout, loading: prefsLoading } = usePreferences();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleReveal = async () => {
    setIsRevealed(true);
    await drawRandomCard();
  };

  const drawRandomCard = async () => {
    try {
      // Fetch all major arcana cards (numbers 0-21)
      const { data: cards, error } = await supabase
        .from("tarot_cards")
        .select("*")
        .gte("number", 0)
        .lte("number", 21);

      if (error) throw error;

      if (!cards || cards.length === 0) {
        toast({
          title: "Error",
          description: "No cards available",
          variant: "destructive",
        });
        return;
      }

      // Randomly select a card
      const randomIndex = Math.floor(Math.random() * cards.length);
      const selectedCard = cards[randomIndex];

      // Map database fields to card data structure
      const card = selectedCard as any; // Type assertion needed until types are regenerated
      const mappedCardData: CardData = {
        id: card.id,
        name: card.name,
        description: card.archetypal_theme || "",
        keywords: Array.isArray(card.keywords)
          ? card.keywords
          : typeof card.keywords === "string"
          ? card.keywords.split(", ").filter(Boolean)
          : [],
        shadowKeywords: Array.isArray(card.shadow_keywords)
          ? card.shadow_keywords
          : typeof card.shadow_keywords === "string"
          ? card.shadow_keywords.split(", ").filter(Boolean)
          : [],
        symbolicPair: card.symbolic_pair || "",
        element: card.element || "",
        planetSign: card.planet_or_sign || "",
        imageUrl: card.img_src || "/placeholder.svg",
        text: {
          essence: card.essence || "",
          symbolicLanguage: card.symbolic_language || "",
          shadowsChallenges: card.shadows_challenges || "",
        },
      };

      setCardData(mappedCardData);
      setCardId(selectedCard.id);
      setImageError(false); // Reset image error when new card is drawn
    } catch (error) {
      console.error("Error drawing card:", error);
      toast({
        title: "Error",
        description: "Failed to draw card",
        variant: "destructive",
      });
    }
  };

  const handleReset = () => {
    setIsRevealed(false);
    setQuestion("");
    setShowTextView(true);
    setHighlights([]);
    setCardData(null);
    setCardId(null);
    setImageError(false);
  };

  const handleContinueFromText = (selectedHighlights: string[]) => {
    setHighlights(selectedHighlights);
    setShowTextView(false);
  };

  if (prefsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Mystical background effects */}
      <div className="fixed inset-0 bg-gradient-to-b from-background via-background to-card/50" />
      <div className="fixed inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-64 h-64 bg-mystic/30 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-20 right-20 w-96 h-96 bg-celestial/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1s" }}
        />
      </div>

      {/* Top navigation */}
      <div className="relative z-20 container mx-auto px-4 py-4 flex justify-between items-center">
        <Button
          variant="ghost"
          onClick={() => navigate("/journal")}
          className="text-foreground hover:text-gold"
        >
          <BookOpen className="mr-2 h-4 w-4" />
          Journal
        </Button>
        <AccountDropdown />
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

        {!isRevealed ? (
          <>
            <div className="w-full max-w-md mb-8 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="question" className="text-foreground">
                  What question do you seek guidance on? (Optional)
                </Label>
                <Input
                  id="question"
                  placeholder="Enter your question or intention..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="border-mystic/30 focus:border-mystic/60"
                />
              </div>
            </div>

            <div className="mb-8">
              <TarotCard
                data={undefined}
                isRevealed={false}
                onReveal={handleReveal}
              />
            </div>
          </>
        ) : cardData ? (
          <div className="w-full max-w-7xl">
            {preferredLayout === "A" ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Left: Card with full image */}
                <div className="lg:col-span-1">
                  <div className="space-y-4">
                    <h2 className="font-serif text-2xl text-foreground text-center">
                      {cardData.name}
                    </h2>
                    <div className="rounded-lg overflow-hidden border border-mystic/30 shadow-lg bg-card/50 min-h-[300px] flex items-center justify-center">
                      {imageError ? (
                        <div className="text-muted-foreground text-center p-8">
                          <p className="text-lg mb-2">{cardData.name}</p>
                          <p className="text-sm">Card image not available</p>
                        </div>
                      ) : (
                        <img
                          src={cardData.imageUrl}
                          alt={cardData.name}
                          className="w-full h-auto"
                          onError={() => setImageError(true)}
                        />
                      )}
                    </div>
                    <p className="text-muted-foreground text-center">
                      {cardData.description}
                    </p>
                  </div>
                </div>

                {/* Right: Reflection components */}
                <div className="lg:col-span-2 space-y-6">
                  {user && cardId ? (
                    <>
                      <ReflectionForm
                        cardId={cardId}
                        question={question}
                        cardData={{
                          name: cardData.name,
                          description: cardData.description,
                          keywords: cardData.keywords,
                          shadowKeywords: cardData.shadowKeywords,
                          element: cardData.element,
                          planetSign: cardData.planetSign,
                        }}
                        onSuccess={() => {
                          toast({
                            title: "Reflection Saved",
                            description:
                              "Your insight has been recorded in your journal",
                          });
                        }}
                      />
                      <div className="flex justify-center">
                        <Button
                          onClick={handleReset}
                          variant="outline"
                          className="border-mystic/50 text-foreground hover:bg-mystic/10 hover:text-gold transition-all"
                        >
                          Draw Another Card
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center space-y-4 p-8 bg-card/50 rounded-lg border border-mystic/20">
                      <p className="text-muted-foreground">
                        Sign in to save your reflections
                      </p>
                      <div className="flex gap-4 justify-center">
                        <Button
                          onClick={() => navigate("/auth")}
                          className="bg-mystic hover:bg-mystic/80"
                        >
                          Sign In
                        </Button>
                        <Button
                          onClick={handleReset}
                          variant="outline"
                          className="border-mystic/50 text-foreground hover:bg-mystic/10 hover:text-gold transition-all"
                        >
                          Draw Another Card
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Left: Card with full image */}
                <div className="lg:col-span-1">
                  <div className="space-y-4">
                    <h2 className="font-serif text-2xl text-foreground text-center">
                      {cardData.name}
                    </h2>
                    <div className="rounded-lg overflow-hidden border border-mystic/30 shadow-lg bg-card/50 min-h-[300px] flex items-center justify-center">
                      {imageError ? (
                        <div className="text-muted-foreground text-center p-8">
                          <p className="text-lg mb-2">{cardData.name}</p>
                          <p className="text-sm">Card image not available</p>
                        </div>
                      ) : (
                        <img
                          src={cardData.imageUrl}
                          alt={cardData.name}
                          className="w-full h-auto"
                          onError={() => setImageError(true)}
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Text view or reflection view */}
                <div className="lg:col-span-2">
                  {user && cardId ? (
                    showTextView ? (
                      <CardTextDisplay
                        cardName={cardData.name}
                        cardText={cardData.text}
                        existingHighlights={highlights}
                        onContinue={handleContinueFromText}
                      />
                    ) : (
                      <>
                        <ReflectionLayoutB
                          cardId={cardId}
                          cardName={cardData.name}
                          highlights={highlights}
                          question={question}
                          user={user}
                          onSuccess={() => {
                            toast({
                              title: "Reflection Saved",
                              description:
                                "Your insight has been recorded in your journal",
                            });
                            handleReset();
                          }}
                          onBack={() => setShowTextView(true)}
                        />
                        <div className="flex justify-center mt-6">
                          <Button
                            onClick={handleReset}
                            variant="outline"
                            className="border-mystic/50 text-foreground hover:bg-mystic/10 hover:text-gold transition-all"
                          >
                            Draw Another Card
                          </Button>
                        </div>
                      </>
                    )
                  ) : (
                    <div className="text-center space-y-4 p-8 bg-card/50 rounded-lg border border-mystic/20">
                      <p className="text-muted-foreground">
                        Sign in to save your reflections
                      </p>
                      <div className="flex gap-4 justify-center">
                        <Button
                          onClick={() => navigate("/auth")}
                          className="bg-mystic hover:bg-mystic/80"
                        >
                          Sign In
                        </Button>
                        <Button
                          onClick={handleReset}
                          variant="outline"
                          className="border-mystic/50 text-foreground hover:bg-mystic/10 hover:text-gold transition-all"
                        >
                          Draw Another Card
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center">
            <p className="text-muted-foreground">Drawing your card...</p>
          </div>
        )}
      </div>

      <div className="mt-16 text-center text-muted-foreground text-sm max-w-lg">
        <p className="italic">
          "The cards reveal not what will be, but what might be—a glimpse into
          the infinite possibilities of your journey."
        </p>
      </div>
    </div>
  );
};

export default Index;
