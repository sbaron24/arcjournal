<!-- 569791de-8c17-4541-afb0-990a037ca576 7ccd775f-c21a-480e-bc52-61eb72bff7ad -->
# Account Dropdown, Preferences, and Major Arcana Database Implementation

## Overview

Implement user account dropdown with preferences management, extend database schema for card text fields, add all 22 Major Arcana cards with complete data, and update card drawing to randomly select from database.

## Implementation Steps

### 1. Database Schema Updates

- **File**: Create new migration file in `supabase/migrations/`
- Add columns to `tarot_cards` table:
- `essence` (TEXT)
- `symbolic_language` (TEXT) 
- `shadows_challenges` (TEXT)
- Change `keywords` and `shadow_keywords` from TEXT to TEXT[] (array type) to store 5 phrases per card
- Create `user_preferences` table:
- `id` (UUID, primary key)
- `user_id` (UUID, foreign key to auth.users)
- `reflection_layout` (TEXT, default 'A')
- `created_at`, `updated_at` timestamps
- Add RLS policies for `user_preferences` (users can only access their own preferences)

### 2. Account Dropdown Component

- **File**: `src/components/AccountDropdown.tsx` (new)
- Use `DropdownMenu` from `@/components/ui/dropdown-menu`
- Show user email/avatar as trigger
- Menu items:
- "Preferences" (navigates to `/preferences`)
- "Sign Out" (when authenticated) or "Sign In" (when not authenticated)
- Replace current Sign In/Out buttons in `Index.tsx` navigation

### 3. Preferences Page

- **File**: `src/pages/Preferences.tsx` (new)
- Fetch user preferences from database (default to 'A' if none exists)
- Radio group or select to choose between Layout A and Layout B
- Save preference to `user_preferences` table on change
- Add route in `App.tsx`: `/preferences`

### 4. Update Index.tsx

- **File**: `src/pages/Index.tsx`
- Replace hardcoded `hangedManData` with database fetch
- Remove local `layoutType` state, fetch from user preferences instead
- Implement random card selection:
- Query all major arcana cards (number 0-21) from database
- Randomly select one card
- Fetch full card data including new text fields
- Update card data structure to match database schema:
- Parse `keywords` and `shadow_keywords` arrays from database
- Map `symbolic_language` to `symbolicLanguage` (camelCase)
- Map `shadows_challenges` to `shadowsChallenges`
- Remove layout toggle buttons (now managed in Preferences)
- Use user's preferred layout from database

### 5. Add 22 Major Arcana Cards to Database

- **File**: Create migration or seed script
- Insert all 22 cards with:
- Existing fields from current schema
- New `essence`, `symbolic_language`, `shadows_challenges` text fields
- `keywords` and `shadow_keywords` as arrays with 5 phrases each (1-4 words per phrase)
- Use data from `src/data/tarot-cards.json` as base, extend with new fields
- Generate keywords based on essence/symbolicLanguage/shadowsChallenges content

### 6. Update Type Definitions

- **File**: `src/integrations/supabase/types.ts` (regenerate after migration)
- Update `tarot_cards` table types to include new fields
- Add `user_preferences` table types

### 7. Helper Functions

- **File**: `src/hooks/usePreferences.tsx` (new, optional)
- Custom hook to fetch and update user preferences
- Cache preferences in React state
- Provide `preferredLayout` and `updateLayout` functions

### 8. Journal Resonance Display

- **File**: `src/pages/Journal.tsx`
- Update database query to fetch `selected_keywords`, `selected_shadow_keywords`, and `highlights` from reflections table
- Add `highlights` field to reflections table (TEXT[] array) in migration to store Layout B highlights
- Update `ReflectionLayoutB.tsx` to save highlights array when saving reflection
- Display selected keywords/highlights under "Resonance" heading in journal cards:
- For Layout A: Show `selected_keywords` and `selected_shadow_keywords` as badges
- For Layout B: Show `highlights` as badges
- Add "Resonance" section between card info and reflection text in journal card layout
- Removed "Keywords" section from journal reflection cards
- Unified Resonance formatting: all items (keywords, shadow keywords, highlights) use the same gold badge styling

### 9. Additional Fixes and Improvements

- **File**: `supabase/migrations/20251111150819_update_image_paths.sql`
- Update all card image paths from `/tarot-images/` to `/tarot-cards/sm_RWSa-T-XX.webp` format to match JSON file structure

- **File**: `supabase/migrations/20251111150820_fix_newline_characters.sql`
- Fix literal `\n` characters in database to actual newline characters for proper text rendering
- Update all `essence`, `symbolic_language`, and `shadows_challenges` fields

- **File**: `src/components/CardTextDisplay.tsx`
- Add newline normalization to convert literal `\n` to actual newlines for display
- Add `whitespace-pre-line` class to all three text fields (Essence, Symbolic Language, Shadows & Challenges) for proper newline rendering

- **File**: `src/pages/Index.tsx`
- Add image error handling with fallback UI when images fail to load
- Reset image error state when drawing new cards

- **File**: `.env.local` (new)
- Create local development environment configuration
- Point to local Supabase instance for testing before pushing to production

## Key Files to Modify

- `src/pages/Index.tsx` - Replace hardcoded data, add random selection, use preferences
- `src/App.tsx` - Add `/preferences` route
- `supabase/migrations/` - New migration for schema changes and card data
- `src/components/AccountDropdown.tsx` - New component
- `src/pages/Preferences.tsx` - New page

## Notes

- Default layout preference is 'A' (Layout A)
- Keywords and shadowKeywords will be stored as PostgreSQL arrays (TEXT[])
- Card drawing happens on reveal, not on page load
- Preferences are user-specific and persist across sessions

### To-dos

- [x] Create database migration: add essence, symbolic_language, shadows_challenges to tarot_cards, change keywords/shadow_keywords to arrays, create user_preferences table
- [x] Create AccountDropdown component with Preferences and Sign Out/In menu items
- [x] Create Preferences page with layout selection (A/B) and save to database
- [x] Add /preferences route to App.tsx
- [x] Update Index.tsx: replace AccountDropdown, fetch user preferences, implement random card selection from database
- [x] Add 22 Major Arcana cards to database with essence, symbolic_language, shadows_challenges, and 5 keywords/shadowKeywords each
- [x] Update card data mapping in Index.tsx to use database fields and parse arrays correctly
- [x] Create usePreferences hook to fetch and update user preferences with caching
- [x] Update ReflectionLayoutB to save highlights array to database
- [x] Update Journal page to display Resonance section with selected keywords/highlights
- [x] Fix image paths in database migration
- [x] Fix newline characters in card text fields
- [x] Remove Keywords section from journal reflection cards
- [x] Unify Resonance formatting across all item types