import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get("OPENAI_API_KEY");
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      question,
      cardName,
      selectedKeywords,
      selectedShadowKeywords,
      selectedElement,
      selectedPlanetSign,
      description,
      selectedHighlights,
    } = await req.json();

    console.log("Generating prompt for:", {
      cardName,
      question,
      selectedKeywords,
      selectedShadowKeywords,
      selectedElement,
      selectedPlanetSign,
      selectedHighlights,
    });

    const systemPrompt = `You are a mystical tarot guide who creates personalized, meaningful prompts for reflection. 
Based on the tarot card drawn, the user's question, and the specific themes or highlighted text they selected as resonating with them, craft a single thoughtful prompt that:
- Weaves together the selected themes or highlighted passages with their question
- Encourages deep personal reflection based on what resonated with them
- Uses poetic but accessible language
- Is 2-3 sentences long
- Feels personal and insightful

Keep the tone mystical but grounded. Focus specifically on what the user selected.`;

    let selectedContent = "";

    // Handle themes from Layout A
    if (
      selectedKeywords ||
      selectedShadowKeywords ||
      selectedElement ||
      selectedPlanetSign
    ) {
      const selectedThemes: string[] = [];
      if (selectedKeywords?.length)
        selectedThemes.push(`Keywords: ${selectedKeywords.join(", ")}`);
      if (selectedShadowKeywords?.length)
        selectedThemes.push(
          `Shadow Keywords: ${selectedShadowKeywords.join(", ")}`
        );
      if (selectedElement) selectedThemes.push(`Element: ${selectedElement}`);
      if (selectedPlanetSign)
        selectedThemes.push(`Planet/Sign: ${selectedPlanetSign}`);
      selectedContent =
        selectedThemes.length > 0
          ? selectedThemes.join("\n")
          : "No specific themes selected yet";
    }

    // Handle highlights from Layout B
    if (selectedHighlights && selectedHighlights.length > 0) {
      selectedContent = `Highlighted passages that resonated with the user:\n${selectedHighlights
        .map((h: string, i: number) => `${i + 1}. "${h}"`)
        .join("\n")}`;
    }

    const userPrompt = `Card: ${cardName}
${description ? `Description: ${description}` : ""}

User's Question: "${
      question || "No specific question, seeking general guidance"
    }"

${selectedContent || "No specific content selected yet"}

Create a personalized reflection prompt that connects what resonated with the user to their question or general journey.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openAIApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.8,
        max_tokens: 200,
        stream: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    // Create a readable stream that forwards chunks from OpenAI incrementally
    // This ensures proper streaming behavior in Deno/Supabase Edge Functions
    const readableStream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();

        if (!reader) {
          controller.close();
          return;
        }

        try {
          while (true) {
            const { done, value } = await reader.read();

            if (done) {
              controller.close();
              break;
            }

            // Forward the raw chunk immediately without encoding/decoding overhead
            controller.enqueue(value);
          }
        } catch (error) {
          console.error("Error reading stream:", error);
          controller.error(error);
        } finally {
          reader.releaseLock();
        }
      },
    });

    // Return the stream with proper headers for SSE
    return new Response(readableStream, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no", // Disable nginx buffering if present
      },
    });
  } catch (error) {
    console.error("Error in generate-tarot-prompt function:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
