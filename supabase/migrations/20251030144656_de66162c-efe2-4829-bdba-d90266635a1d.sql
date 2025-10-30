-- Add new columns to reflections table for question, generated prompt, and selections
ALTER TABLE public.reflections 
ADD COLUMN question text,
ADD COLUMN generated_prompt text,
ADD COLUMN selected_keywords text[],
ADD COLUMN selected_shadow_keywords text[],
ADD COLUMN selected_element text,
ADD COLUMN selected_planet_sign text;