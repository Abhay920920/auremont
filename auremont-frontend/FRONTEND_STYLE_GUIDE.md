# Frontend Style Guide

## Classes and Formatting
- Always use utility classes in a logical order (e.g., layout, spacing, typography, colors, effects).
- Prefer Next.js `<Image>` component with `priority` for above-the-fold images to optimize LCP.
- Never use inline styles unless absolutely necessary for dynamic layout calculations.

## Accessibility
- All interactive elements MUST have visible `:focus-visible` states using our Champagne Gold color.
- All images must have descriptive `alt` tags.
- Buttons must have `aria-label` if they only contain an icon.
