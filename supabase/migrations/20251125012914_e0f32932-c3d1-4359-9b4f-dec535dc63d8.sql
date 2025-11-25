-- Add new text fields to tarot_cards table
ALTER TABLE public.tarot_cards 
ADD COLUMN IF NOT EXISTS essence TEXT,
ADD COLUMN IF NOT EXISTS symbolic_language TEXT,
ADD COLUMN IF NOT EXISTS shadows_challenges TEXT;

-- Create user_preferences table
CREATE TABLE IF NOT EXISTS public.user_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reflection_layout TEXT NOT NULL DEFAULT 'A',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable Row Level Security for user_preferences
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- Create policies for user_preferences (will skip if they exist)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'user_preferences' AND policyname = 'Users can view their own preferences'
  ) THEN
    CREATE POLICY "Users can view their own preferences" 
    ON public.user_preferences 
    FOR SELECT 
    USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'user_preferences' AND policyname = 'Users can create their own preferences'
  ) THEN
    CREATE POLICY "Users can create their own preferences" 
    ON public.user_preferences 
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'user_preferences' AND policyname = 'Users can update their own preferences'
  ) THEN
    CREATE POLICY "Users can update their own preferences" 
    ON public.user_preferences 
    FOR UPDATE 
    USING (auth.uid() = user_id);
  END IF;
END $$;

-- Add trigger for automatic timestamp updates on user_preferences
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_user_preferences_updated_at'
  ) THEN
    CREATE TRIGGER update_user_preferences_updated_at
    BEFORE UPDATE ON public.user_preferences
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

-- Add highlights field to reflections table for Layout B
ALTER TABLE public.reflections 
ADD COLUMN IF NOT EXISTS highlights TEXT[];