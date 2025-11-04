import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { ThemeSelector } from "./ThemeSelector";
import { ReflectionPrompt } from "./ReflectionPrompt";
import { ReflectionInput } from "./ReflectionInput";

interface ReflectionFormProps {
  cardId: string;
  question: string;
  cardData: {
    name: string;
    description: string;
    keywords: string[];
    shadowKeywords: string[];
    element: string;
    planetSign: string;
  };
  onSuccess?: () => void;
}

const reflectionSchema = z.object({
  reflection: z
    .string()
    .trim()
    .min(1, { message: "Reflection cannot be empty" })
    .max(2000, { message: "Reflection must be less than 2000 characters" }),
});

export const ReflectionForm = ({
  cardId,
  question,
  cardData,
  onSuccess,
}: ReflectionFormProps) => {
  const [reflection, setReflection] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [selectedShadowKeywords, setSelectedShadowKeywords] = useState<
    string[]
  >([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [selectedPlanetSign, setSelectedPlanetSign] = useState<string | null>(
    null
  );
  const { toast } = useToast();

  const toggleKeyword = (keyword: string) => {
    setSelectedKeywords((prev) =>
      prev.includes(keyword)
        ? prev.filter((k) => k !== keyword)
        : [...prev, keyword]
    );
  };

  const toggleShadowKeyword = (keyword: string) => {
    setSelectedShadowKeywords((prev) =>
      prev.includes(keyword)
        ? prev.filter((k) => k !== keyword)
        : [...prev, keyword]
    );
  };

  const toggleElement = () => {
    setSelectedElement((prev) =>
      prev === cardData.element ? null : cardData.element
    );
  };

  const togglePlanetSign = () => {
    setSelectedPlanetSign((prev) =>
      prev === cardData.planetSign ? null : cardData.planetSign
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const validated = reflectionSchema.parse({ reflection });
      setIsSubmitting(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to save reflections",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.from("reflections").insert({
        user_id: user.id,
        tarot_card_id: cardId,
        reflection: validated.reflection,
        question: question,
        generated_prompt: generatedPrompt || null,
        selected_keywords: selectedKeywords,
        selected_shadow_keywords: selectedShadowKeywords,
        selected_element: selectedElement,
        selected_planet_sign: selectedPlanetSign,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your reflection has been saved",
      });

      setReflection("");
      onSuccess?.();
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0].message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to save reflection",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
      <ThemeSelector
        cardData={cardData}
        selectedKeywords={selectedKeywords}
        selectedShadowKeywords={selectedShadowKeywords}
        selectedElement={selectedElement}
        selectedPlanetSign={selectedPlanetSign}
        onToggleKeyword={toggleKeyword}
        onToggleShadowKeyword={toggleShadowKeyword}
        onToggleElement={toggleElement}
        onTogglePlanetSign={togglePlanetSign}
      />

      <ReflectionPrompt
        requestBody={{
          question,
          cardName: cardData.name,
          selectedKeywords,
          selectedShadowKeywords,
          selectedElement,
          selectedPlanetSign,
          description: cardData.description,
        }}
        renderMode="character"
        onPromptGenerated={setGeneratedPrompt}
        height="400px"
      />

      <div className="lg:col-span-2">
        <ReflectionInput
          reflection={reflection}
          isSubmitting={isSubmitting}
          onReflectionChange={setReflection}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};
