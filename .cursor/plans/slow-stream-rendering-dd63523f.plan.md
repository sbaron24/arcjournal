<!-- dd63523f-d812-4657-9754-1e7ef293f486 9c867481-e35d-4f19-8bbc-4aee94465f35 -->
# Slow Stream Rendering Implementation

## Approach

Implement a dual-buffer system where:

1. Stream accumulates all text immediately (no data loss)
2. UI renders progressively with different speeds per component
3. Add CSS fade-in animations for emerging text

## Changes Required

### 1. ReflectionForm.tsx - Character-by-Character Rendering

- Add `renderedText` state separate from `accumulatedText` 
- Accumulate incoming text in `accumulatedText` buffer
- Use `useRef` to store interval ID and accumulated buffer
- Use `setInterval` to render one character at a time (20-50ms delay)
- Wrap each character in a `<span>` with fade-in animation
- Clear interval on completion/unmount

### 2. ReflectionLayoutB.tsx - Word-by-Word Rendering

- Add `renderedText` state separate from `accumulatedText`
- Accumulate incoming text in `accumulatedText` buffer
- Use `useRef` to store interval ID and accumulated buffer
- Use `setInterval` to render one word at a time (100-200ms delay)
- Wrap each word in a `<span>` with fade-in animation
- Clear interval on completion/unmount

### 3. CSS Animations

- Add fade-in keyframe animation for emerging characters/words
- Apply animation class to each character/word span
- Ensure smooth, calm appearance

## Implementation Details

- Use `useRef` for interval management and buffer storage
- Use `useEffect` cleanup to clear intervals on unmount
- Character-by-character: split accumulated text and render progressively
- Word-by-word: split on spaces and render progressively
- Add CSS fade animation classes