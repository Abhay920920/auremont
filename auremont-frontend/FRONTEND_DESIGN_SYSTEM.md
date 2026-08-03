# Frontend Design System

## Tailwind Configuration Guidelines
All colors, fonts, and spacing variables MUST be defined in `tailwind.config.ts`. We do not use arbitrary values (`h-[43px]`) unless absolutely necessary for a one-off pixel tweak.

## Elevations & Depth
- **Level 1 (Base)**: `bg-background` (`#0B0B0B`)
- **Level 2 (Surface)**: `bg-secondaryBg` (`#121212`). Used for cards and modals.
- **Level 3 (Overlay)**: Glassmorphism (`bg-black/60 backdrop-blur-md`). Used for sticky headers and slide-out menus.

## Border Radius
We prefer sharp, elegant corners over heavily rounded, playful shapes.
- Buttons: `rounded-none` or very subtle `rounded-sm` (2px).
- Images: `rounded-none` or `rounded-sm`.
- Modals: `rounded-lg` (8px).

## Animation Physics
- **Hover Transitions**: `transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]`
- **Page Transitions**: Smooth fade and slide up, powered by Framer Motion.
