-- Fix literal \n characters to actual newlines in all text fields
-- Replace literal \n with actual newline characters (CHR(10))
-- Using CHR(92) for backslash and CHR(10) for newline

UPDATE public.tarot_cards 
SET 
  essence = REPLACE(essence, CHR(92) || 'n', CHR(10)),
  symbolic_language = REPLACE(symbolic_language, CHR(92) || 'n', CHR(10)),
  shadows_challenges = REPLACE(shadows_challenges, CHR(92) || 'n', CHR(10))
WHERE 
  essence LIKE '%' || CHR(92) || 'n%' 
  OR symbolic_language LIKE '%' || CHR(92) || 'n%' 
  OR shadows_challenges LIKE '%' || CHR(92) || 'n%';

