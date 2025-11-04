# ReflectionPrompt Component Refactoring

## Overview

Refactored `ReflectionPrompt` component to be fully self-contained by moving generation logic from parent components into the component itself. Added conditional character-by-character rendering, fixed layout issues, and improved user experience.

## Changes Made

### 1. ReflectionPrompt Component Self-Containment

- **File**: `src/components/ReflectionPrompt.tsx`
- Moved `generatePrompt` streaming logic from `ReflectionForm` and `ReflectionLayoutB` into `ReflectionPrompt`
- Added internal state management: `isGenerating`, `generatedPrompt`, `renderedPrompt`
- Added refs: `accumulatedTextRef`, `renderIntervalRef`, `renderedIndexRef`
- Accepts `requestBody` prop (object) instead of `onGenerate` callback
- Added optional `onPromptGenerated` callback for parent components that need the final text for database storage
- Removed `isGenerating`, `generatedPrompt`, `onGenerate` props (now internal)

### 2. Conditional Character-by-Character Rendering

- Character rendering interval (`useEffect` with `setInterval`) only runs when `renderMode === "character"`
- For word and normal modes, text renders directly without interval
- Interval continues running until all characters are rendered, even after generation completes

### 3. Parent Component Updates

- **ReflectionForm.tsx**: Removed `generatePrompt` function, state, and refs. Updated to pass `requestBody` prop and use `onPromptGenerated` callback
- **ReflectionLayoutB.tsx**: Removed `generatePrompt` function, state, and refs. Updated to pass `requestBody` prop and use `onPromptGenerated` callback

### 4. Layout Improvements

- Fixed text wrapping with `break-words` and `whitespace-normal` classes
- Added vertical scrolling with `overflow-y-auto` when content exceeds container
- Fixed vertical shifting during generation by maintaining consistent `min-h-[100px]` for all states
- Simplified container structure with single consistent flex layout

### 5. Height Configuration

- Added `height` prop to `ReflectionPrompt` for customizable fixed heights
- ReflectionForm: 400px fixed height
- ReflectionLayoutB: 300px fixed height

### 6. Visual Feedback

- Initially added slow pulse animation to Sparkles icon during generation (later removed by user)
- Removed "Weaving your card's wisdom..." text message

## Benefits

- **Modularity**: Component can now be placed on any page and work independently
- **Cleaner API**: Single `requestBody` prop instead of multiple parameters
- **Better UX**: Consistent layout, proper text wrapping, and scrolling
- **Conditional Rendering**: Interval-based rendering only when needed (character mode)

## Files Modified

- `src/components/ReflectionPrompt.tsx`
- `src/components/ReflectionForm.tsx`
- `src/components/ReflectionLayoutB.tsx`
- `src/index.css` (added slow-pulse animation, later unused)