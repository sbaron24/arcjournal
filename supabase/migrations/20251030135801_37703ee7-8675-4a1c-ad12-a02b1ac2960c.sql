-- Create tarot_cards table
CREATE TABLE public.tarot_cards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  number INTEGER NOT NULL,
  name TEXT NOT NULL,
  keywords TEXT NOT NULL,
  shadow_keywords TEXT NOT NULL,
  archetypal_theme TEXT NOT NULL,
  symbolic_pair TEXT NOT NULL,
  element TEXT,
  planet_or_sign TEXT,
  img_src TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create reflections table
CREATE TABLE public.reflections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tarot_card_id UUID NOT NULL REFERENCES public.tarot_cards(id) ON DELETE CASCADE,
  reflection TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.tarot_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reflections ENABLE ROW LEVEL SECURITY;

-- Create policies for tarot_cards (publicly readable)
CREATE POLICY "Tarot cards are viewable by everyone" 
ON public.tarot_cards 
FOR SELECT 
USING (true);

-- Create policies for reflections (user-specific access)
CREATE POLICY "Users can view their own reflections" 
ON public.reflections 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own reflections" 
ON public.reflections 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reflections" 
ON public.reflections 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reflections" 
ON public.reflections 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_reflections_updated_at
BEFORE UPDATE ON public.reflections
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert the 22 Major Arcana cards with data from db.json
INSERT INTO public.tarot_cards (number, name, keywords, shadow_keywords, archetypal_theme, symbolic_pair, element, planet_or_sign, img_src) VALUES
(0, 'The Fool', 'new beginnings, innocence, spontaneity', 'recklessness, naivety, poor judgment', 'The innocent explorer embarking on life''s journey', 'the World (beginning and completion)', 'Air', 'Uranus', '/tarot-images/00-the-fool.jpg'),
(1, 'The Magician', 'manifestation, resourcefulness, power', 'manipulation, untapped talents', 'The skilled creator manifesting reality', 'the High Priestess (conscious and unconscious)', 'Air', 'Mercury', '/tarot-images/01-the-magician.jpg'),
(2, 'The High Priestess', 'intuition, sacred knowledge, divine feminine', 'secrets, disconnection from intuition', 'The keeper of sacred mysteries', 'the Magician (conscious and unconscious)', 'Water', 'Moon', '/tarot-images/02-the-high-priestess.jpg'),
(3, 'The Empress', 'femininity, beauty, nature, abundance', 'creative block, dependence', 'The nurturing mother of creation', 'the Emperor (feminine and masculine)', 'Earth', 'Venus', '/tarot-images/03-the-empress.jpg'),
(4, 'The Emperor', 'authority, establishment, structure', 'domination, excessive control', 'The authoritative father figure', 'the Empress (feminine and masculine)', 'Fire', 'Aries', '/tarot-images/04-the-emperor.jpg'),
(5, 'The Hierophant', 'spiritual wisdom, tradition, conformity', 'rebellion, subversiveness', 'The spiritual teacher and guide', 'the Lovers (tradition and choice)', 'Earth', 'Taurus', '/tarot-images/05-the-hierophant.jpg'),
(6, 'The Lovers', 'love, harmony, relationships, values alignment', 'disharmony, misalignment', 'The union of opposites', 'the Hierophant (tradition and choice)', 'Air', 'Gemini', '/tarot-images/06-the-lovers.jpg'),
(7, 'The Chariot', 'control, willpower, success, determination', 'opposition, lack of direction', 'The victorious warrior', 'Justice (action and consequence)', 'Water', 'Cancer', '/tarot-images/07-the-chariot.jpg'),
(8, 'Strength', 'courage, persuasion, influence, compassion', 'self-doubt, weakness', 'The gentle tamer of beasts', 'the Hermit (external and internal strength)', 'Fire', 'Leo', '/tarot-images/08-strength.jpg'),
(9, 'The Hermit', 'soul searching, introspection, inner guidance', 'isolation, loneliness', 'The wise seeker of truth', 'Strength (external and internal strength)', 'Earth', 'Virgo', '/tarot-images/09-the-hermit.jpg'),
(10, 'Wheel of Fortune', 'cycles, karma, destiny, turning point', 'resistance to change', 'The ever-turning wheel of fate', 'the Hanged Man (fate and surrender)', 'Fire', 'Jupiter', '/tarot-images/10-wheel-of-fortune.jpg'),
(11, 'Justice', 'fairness, truth, cause and effect', 'unfairness, lack of accountability', 'The balanced scales of truth', 'the Chariot (action and consequence)', 'Air', 'Libra', '/tarot-images/11-justice.jpg'),
(12, 'The Hanged Man', 'suspension, letting go, new perspective', 'stalling, needless sacrifice', 'The willing sacrifice', 'the Wheel of Fortune (fate and surrender)', 'Water', 'Neptune', '/tarot-images/12-the-hanged-man.jpg'),
(13, 'Death', 'transformation, endings, change', 'resistance to change, stagnation', 'The inevitable transformation', 'Temperance (death and rebirth)', 'Water', 'Scorpio', '/tarot-images/13-death.jpg'),
(14, 'Temperance', 'balance, moderation, patience, purpose', 'imbalance, excess', 'The alchemist of the soul', 'Death (death and rebirth)', 'Fire', 'Sagittarius', '/tarot-images/14-temperance.jpg'),
(15, 'The Devil', 'bondage, addiction, materialism', 'releasing limiting beliefs', 'The chains we forge ourselves', 'the Tower (bondage and liberation)', 'Earth', 'Capricorn', '/tarot-images/15-the-devil.jpg'),
(16, 'The Tower', 'sudden change, upheaval, revelation', 'fear of change, averting disaster', 'The lightning strike of truth', 'the Devil (bondage and liberation)', 'Fire', 'Mars', '/tarot-images/16-the-tower.jpg'),
(17, 'The Star', 'hope, faith, renewal, healing', 'despair, disconnection', 'The bearer of hope', 'the Moon (clarity and illusion)', 'Air', 'Aquarius', '/tarot-images/17-the-star.jpg'),
(18, 'The Moon', 'illusion, fear, anxiety, intuition', 'release of fear, clarity', 'The realm of dreams and shadows', 'the Star (clarity and illusion)', 'Water', 'Pisces', '/tarot-images/18-the-moon.jpg'),
(19, 'The Sun', 'joy, success, celebration, positivity', 'sadness, lack of enthusiasm', 'The radiant light of consciousness', 'the Moon (light and shadow)', 'Fire', 'Sun', '/tarot-images/19-the-sun.jpg'),
(20, 'Judgement', 'reflection, reckoning, awakening', 'self-doubt, refusal to learn', 'The call to spiritual awakening', 'the World (awakening and completion)', 'Fire', 'Pluto', '/tarot-images/20-judgement.jpg'),
(21, 'The World', 'completion, accomplishment, wholeness', 'lack of closure, emptiness', 'The dance of cosmic completion', 'the Fool (beginning and completion)', 'Earth', 'Saturn', '/tarot-images/21-the-world.jpg')