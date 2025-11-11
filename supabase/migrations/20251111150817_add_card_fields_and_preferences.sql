-- Add new text fields to tarot_cards table
ALTER TABLE public.tarot_cards 
ADD COLUMN essence TEXT,
ADD COLUMN symbolic_language TEXT,
ADD COLUMN shadows_challenges TEXT;

-- Convert keywords and shadow_keywords from TEXT to TEXT[] arrays
-- First, create temporary columns
ALTER TABLE public.tarot_cards 
ADD COLUMN keywords_temp TEXT[],
ADD COLUMN shadow_keywords_temp TEXT[];

-- Convert comma-separated strings to arrays (handling existing data)
UPDATE public.tarot_cards 
SET keywords_temp = string_to_array(keywords, ', '),
    shadow_keywords_temp = string_to_array(shadow_keywords, ', ');

-- Drop old columns
ALTER TABLE public.tarot_cards 
DROP COLUMN keywords,
DROP COLUMN shadow_keywords;

-- Rename temporary columns
ALTER TABLE public.tarot_cards 
RENAME COLUMN keywords_temp TO keywords;
ALTER TABLE public.tarot_cards 
RENAME COLUMN shadow_keywords_temp TO shadow_keywords;

-- Make keywords and shadow_keywords NOT NULL (they should have data from migration)
ALTER TABLE public.tarot_cards 
ALTER COLUMN keywords SET NOT NULL,
ALTER COLUMN shadow_keywords SET NOT NULL;

-- Create user_preferences table
CREATE TABLE public.user_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reflection_layout TEXT NOT NULL DEFAULT 'A',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable Row Level Security for user_preferences
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- Create policies for user_preferences
CREATE POLICY "Users can view their own preferences" 
ON public.user_preferences 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own preferences" 
ON public.user_preferences 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences" 
ON public.user_preferences 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Add trigger for automatic timestamp updates on user_preferences
CREATE TRIGGER update_user_preferences_updated_at
BEFORE UPDATE ON public.user_preferences
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add highlights field to reflections table for Layout B
ALTER TABLE public.reflections 
ADD COLUMN highlights TEXT[];

