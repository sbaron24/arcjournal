import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { usePreferences } from "@/hooks/usePreferences";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Settings, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AccountDropdown } from "@/components/AccountDropdown";

const Preferences = () => {
  const { user, loading: authLoading } = useAuth();
  const { preferredLayout, updateLayout, loading: prefsLoading } = usePreferences();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  const handleLayoutChange = async (layout: "A" | "B") => {
    const { error } = await updateLayout(layout);
    if (error) {
      toast({
        title: "Error",
        description: "Failed to save preference",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Preference Saved",
        description: `Reflection Layout ${layout} has been set as your default`,
      });
    }
  };

  if (authLoading || prefsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading preferences...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="fixed inset-0 bg-gradient-to-b from-background via-background to-card/50" />
      <div className="fixed inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-64 h-64 bg-mystic/30 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-20 right-20 w-96 h-96 bg-celestial/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Top navigation */}
        <div className="relative z-20 mb-8 flex justify-end">
          <AccountDropdown />
        </div>

        <div className="max-w-2xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-4 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Draw
          </Button>

          <div className="text-center space-y-4 mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-[2px] bg-gradient-to-r from-transparent via-gold to-gold" />
              <Settings className="w-8 h-8 text-gold" />
              <div className="w-12 h-[2px] bg-gradient-to-l from-transparent via-gold to-gold" />
            </div>

            <h1 className="font-serif text-5xl md:text-6xl text-foreground mb-2">
              Preferences
            </h1>

            <p className="text-muted-foreground text-lg max-w-md mx-auto">
              Customize your tarot reading experience
            </p>
          </div>

          <Card className="border-mystic/30">
            <CardHeader>
              <CardTitle className="font-serif text-2xl">Reflection Layout</CardTitle>
              <CardDescription>
                Choose how you want to interact with your card readings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={preferredLayout}
                onValueChange={(value) => handleLayoutChange(value as "A" | "B")}
                className="space-y-4"
              >
                <div className="flex items-start space-x-3 p-4 rounded-lg border border-mystic/20 hover:bg-card/50 transition-colors">
                  <RadioGroupItem value="A" id="layout-a" className="mt-1" />
                  <div className="flex-1">
                    <Label
                      htmlFor="layout-a"
                      className="text-base font-semibold cursor-pointer"
                    >
                      Reflection Layout A
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Select keywords and themes, then write your reflection with AI-generated prompts
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 rounded-lg border border-mystic/20 hover:bg-card/50 transition-colors">
                  <RadioGroupItem value="B" id="layout-b" className="mt-1" />
                  <div className="flex-1">
                    <Label
                      htmlFor="layout-b"
                      className="text-base font-semibold cursor-pointer"
                    >
                      Reflection Layout B
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Highlight text passages from the card, then write your reflection
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Preferences;

