import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TarotCard } from "@/components/TarotCard";
import { ReflectionForm } from "@/components/ReflectionForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, BookOpen, User, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import hangedManImage from "@/assets/hanged-man-card.jpg";
import { CardTextDisplay } from "@/components/CardTextDisplay";
import { ReflectionLayoutB } from "@/components/ReflectionLayoutB";

const hangedManData = {
  name: "The Hanged Man",
  description: "Surrender, new perspective, letting go.",
  keywords: ["stillness", "mistake surrender for defeat", "masquerade as spiritual detachment"],
  shadowKeywords: ["control", "avoidance"],
  symbolicPair: "The Fool",
  element: "Water",
  planetSign: "Neptune",
  imageUrl: hangedManImage,
  text: {
    essence:
      "Suspended between worlds, the Hanged Man embodies the paradox of release as progress. He teaches that true movement often begins in stillness — that growth is not always forward, but inward. Through voluntary surrender, a new vantage emerges: the ability to see life not as something to master, but to meet with openness. This archetype asks you to pause long enough for wisdom to turn itself right-side up within you.",
    symbolicLanguage:
      "The inverted figure reflects the reorientation of perception.\nThe halo of light symbolizes illumination born from surrender.\nThe tree of life represents the axis between heaven and earth — the living cross of experience.\nThe serene face reminds us that acceptance, not struggle, reveals peace.\nEvery detail of the card whispers: what you resist binds you; what you yield to transforms you.",
    shadowsChallenges:
      'When this energy turns shadowed, we cling to control or mistake surrender for defeat. Inaction can disguise itself as patience; victimhood can masquerade as spiritual detachment. The challenge is discerning when to let go — and when "letting go" has become avoidance. The Hanged Man calls you to surrender consciously, not passively — to participate in your own unbinding.',
  },
};

const Index = () => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [cardId, setCardId] = useState<string | null>(null);
  const [question, setQuestion] = useState("");
  const [layoutType, setLayoutType] = useState<"A" | "B">("A");
  const [showTextView, setShowTextView] = useState(true);
  const [highlights, setHighlights] = useState<string[]>([]);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Fetch the Hanged Man card ID
    const fetchCardId = async () => {
      const { data } = await supabase.from("tarot_cards").select("id").eq("name", "The Hanged Man").single();

      if (data) {
        setCardId(data.id);
      }
    };

    fetchCardId();
  }, []);

  const handleReset = () => {
    setIsRevealed(false);
    setQuestion("");
    setShowTextView(true);
    setHighlights([]);
  };

  const handleContinueFromText = (selectedHighlights: string[]) => {
    setHighlights(selectedHighlights);
    setShowTextView(false);
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    }
  };

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
      <div className="relative z-20 container mx-auto px-4 py-4 flex justify-end gap-2">
        {user ? (
          <>
            <Button variant="ghost" onClick={() => navigate("/journal")} className="text-foreground hover:text-gold">
              <BookOpen className="mr-2 h-4 w-4" />
              Journal
            </Button>
            <Button variant="ghost" onClick={handleSignOut} className="text-foreground hover:text-gold">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </>
        ) : (
          <Button variant="ghost" onClick={() => navigate("/auth")} className="text-foreground hover:text-gold">
            <User className="mr-2 h-4 w-4" />
            Sign In
          </Button>
        )}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12 min-h-screen flex flex-col items-center justify-center">
        <div className="text-center mb-12 space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-[2px] bg-gradient-to-r from-transparent via-gold to-gold" />
            <Sparkles className="w-8 h-8 text-gold" />
            <div className="w-12 h-[2px] bg-gradient-to-l from-transparent via-gold to-gold" />
          </div>

          <h1 className="font-serif text-5xl md:text-6xl text-foreground mb-2">Mystic Tarot</h1>

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
                <p className="text-sm text-muted-foreground">You may draw a card with or without a question</p>
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
              <TarotCard data={undefined} isRevealed={false} onReveal={() => setIsRevealed(true)} />
            </div>
          </>
        ) : (
          <div className="w-full max-w-7xl">
            {/* Layout Toggle */}
            <div className="flex justify-center gap-2 mb-8">
              <Button
                variant={layoutType === "A" ? "default" : "outline"}
                onClick={() => setLayoutType("A")}
                className={layoutType === "A" ? "bg-mystic hover:bg-mystic/80" : "border-mystic/50"}
              >
                Reflection Layout A
              </Button>
              <Button
                variant={layoutType === "B" ? "default" : "outline"}
                onClick={() => setLayoutType("B")}
                className={layoutType === "B" ? "bg-mystic hover:bg-mystic/80" : "border-mystic/50"}
              >
                Reflection Layout B
              </Button>
            </div>

            {layoutType === "A" ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Left: Card with full image */}
                <div className="lg:col-span-1">
                  <div className="space-y-4">
                    <h2 className="font-serif text-2xl text-foreground text-center">{hangedManData.name}</h2>
                    <div className="rounded-lg overflow-hidden border border-mystic/30 shadow-lg">
                      <img src={hangedManData.imageUrl} alt={hangedManData.name} className="w-full h-auto" />
                    </div>
                    <p className="text-muted-foreground text-center">{hangedManData.description}</p>
                  </div>
                </div>

                {/* Right: Reflection components */}
                <div className="lg:col-span-2 space-y-6">
                  {user && cardId ? (
                    <>
                      <ReflectionForm
                        cardId={cardId}
                        question={question}
                        cardData={hangedManData}
                        onSuccess={() => {
                          toast({
                            title: "Reflection Saved",
                            description: "Your insight has been recorded in your journal",
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
                      <p className="text-muted-foreground">Sign in to save your reflections</p>
                      <div className="flex gap-4 justify-center">
                        <Button onClick={() => navigate("/auth")} className="bg-mystic hover:bg-mystic/80">
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
                    <h2 className="font-serif text-2xl text-foreground text-center">{hangedManData.name}</h2>
                    <div className="rounded-lg overflow-hidden border border-mystic/30 shadow-lg">
                      <img src={hangedManData.imageUrl} alt={hangedManData.name} className="w-full h-auto" />
                    </div>
                  </div>
                </div>

                {/* Right: Text view or reflection view */}
                <div className="lg:col-span-2">
                  {user && cardId ? (
                    showTextView ? (
                      <CardTextDisplay
                        cardName={hangedManData.name}
                        cardText={hangedManData.text}
                        onContinue={handleContinueFromText}
                      />
                    ) : (
                      <>
                        <ReflectionLayoutB
                          cardId={cardId}
                          cardName={hangedManData.name}
                          highlights={highlights}
                          question={question}
                          user={user}
                          onSuccess={() => {
                            toast({
                              title: "Reflection Saved",
                              description: "Your insight has been recorded in your journal",
                            });
                          }}
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
                      <p className="text-muted-foreground">Sign in to save your reflections</p>
                      <div className="flex gap-4 justify-center">
                        <Button onClick={() => navigate("/auth")} className="bg-mystic hover:bg-mystic/80">
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
        )}

        <div className="mt-16 text-center text-muted-foreground text-sm max-w-lg">
          <p className="italic">
            "The cards reveal not what will be, but what might be—a glimpse into the infinite possibilities of your
            journey."
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
