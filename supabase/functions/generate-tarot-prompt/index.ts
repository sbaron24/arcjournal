import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { question, cardName, selectedKeywords, selectedShadowKeywords, selectedElement, selectedPlanetSign, description } = await req.json();

    console.log('Generating prompt for:', { cardName, question, selectedKeywords, selectedShadowKeywords, selectedElement, selectedPlanetSign });

    const systemPrompt = `You are a mystical tarot guide who creates personalized, meaningful prompts for reflection. 
Based on the tarot card drawn, the user's question, and the specific themes they selected as resonating with them, craft a single thoughtful prompt that:
- Weaves together the selected card themes with their question
- Encourages deep personal reflection based on what resonated with them
- Uses poetic but accessible language
- Is 2-3 sentences long
- Feels personal and insightful

Keep the tone mystical but grounded. Focus specifically on the themes the user selected.`;

    const selectedThemes = [];
    if (selectedKeywords?.length) selectedThemes.push(`Keywords: ${selectedKeywords.join(', ')}`);
    if (selectedShadowKeywords?.length) selectedThemes.push(`Shadow Keywords: ${selectedShadowKeywords.join(', ')}`);
    if (selectedElement) selectedThemes.push(`Element: ${selectedElement}`);
    if (selectedPlanetSign) selectedThemes.push(`Planet/Sign: ${selectedPlanetSign}`);

    const userPrompt = `Card: ${cardName}
Description: ${description}

User's Question: "${question}"

Selected Themes that resonated with the user:
${selectedThemes.length > 0 ? selectedThemes.join('\n') : 'No specific themes selected yet'}

Create a personalized reflection prompt that connects these selected themes to their question.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.8,
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', response.status, errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedPrompt = data.choices[0].message.content;

    console.log('Generated prompt:', generatedPrompt);

    return new Response(JSON.stringify({ generatedPrompt }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-tarot-prompt function:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
