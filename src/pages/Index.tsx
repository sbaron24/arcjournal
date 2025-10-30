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
  const [cardId, setCardId] = useState<string | null>(null);
  const [question, setQuestion] = useState("");
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Fetch the Temperance card ID
    const fetchCardId = async () => {
      const { data } = await supabase
        .from('tarot_cards')
        .select('id')
        .eq('name', 'Temperance')
        .single();
      
      if (data) {
        setCardId(data.id);
      }
    };
    
    fetchCardId();
  }, []);

  const handleReset = () => {
    setIsRevealed(false);
    setQuestion("");
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
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-celestial/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
      </div>

      {/* Top navigation */}
      <div className="relative z-20 container mx-auto px-4 py-4 flex justify-end gap-2">
        {user ? (
          <>
            <Button
              variant="ghost"
              onClick={() => navigate('/journal')}
              className="text-foreground hover:text-gold"
            >
              <BookOpen className="mr-2 h-4 w-4" />
              Journal
            </Button>
            <Button
              variant="ghost"
              onClick={handleSignOut}
              className="text-foreground hover:text-gold"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </>
        ) : (
          <Button
            variant="ghost"
            onClick={() => navigate('/auth')}
            className="text-foreground hover:text-gold"
          >
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
          
          <h1 className="font-serif text-5xl md:text-6xl text-foreground mb-2">
            Mystic Tarot
          </h1>
          
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            Discover divine guidance through the ancient art of tarot reading
          </p>
        </div>

        {!isRevealed && (
          <div className="w-full max-w-md mb-8 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="question" className="text-foreground">
                What question brings you here today?
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
        )}

        <div className="mb-8">
          <TarotCard 
            data={isRevealed ? temperanceData : undefined}
            isRevealed={isRevealed}
            onReveal={() => setIsRevealed(true)}
          />
        </div>

        {isRevealed && user && cardId && (
          <div className="mt-8 w-full flex flex-col items-center gap-6">
            <ReflectionForm 
              cardId={cardId}
              question={question}
              cardData={temperanceData}
              onSuccess={() => {
                toast({
                  title: "Reflection Saved",
                  description: "Your insight has been recorded in your journal",
                });
              }}
            />
            <Button 
              onClick={handleReset}
              variant="outline"
              className="border-mystic/50 text-foreground hover:bg-mystic/10 hover:text-gold transition-all"
            >
              Draw Another Card
            </Button>
          </div>
        )}

        {isRevealed && !user && (
          <div className="mt-8 text-center space-y-4">
            <p className="text-muted-foreground">
              Sign in to save your reflections
            </p>
            <div className="flex gap-4 justify-center">
              <Button 
                onClick={() => navigate('/auth')}
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
