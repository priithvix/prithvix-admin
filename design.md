# PrithviX Design System

This document outlines the core design tokens (colors, typography, spacing, and effects) used in the PrithviX landing page. These tokens serve as the single source of truth and can be applied directly to the admin portal for a consistent brand experience.

## Color Palette

### Greens (Primary)
- **Night Field** (`#0e2419`) — Darkest green. Used for hover text, hard borders, and deep shadows.
- **Field Deep** (`#1b3a2d`) — PRIMARY brand color. Used for CTAs, nav background after scroll, and submit buttons.
- **Field Mid** (`#2d6a4f`) — Used for hover states on green buttons, icon fills, and secondary backgrounds.

### Amber (Accent)
- **Amber Deep** (`#B8923F`) — Strong accent text on light backgrounds.
- **Harvest Amber** (`#D4A853`) — PRIMARY ACCENT. Used for hero highlights and accent borders.
- **Turmeric** (`#E5BB67`) — ON DARK ONLY. Used for bullets, ticks, and links on dark cards.

### Backgrounds
- **Soil Deep** (`#0e1b12`) — Dark forest. Used for hero section, footer, and preloader.
- **Bark** (`#14291c`) — Deep green. Used for AI section and dark card surfaces.
- **Rabi Dust** (`#f5f0e6`) — Main page background (never pure white). Also aliased as **Cream**.
- **Dry Grass** (`#ede7d9`) — Alternate section background (e.g., FAQ, row alternates).

### Text
- **Charcoal Root** (`#140d07`) — All headings on light backgrounds (never pure black).
- **Earth Brown** (`#4a3728`) — All body copy on light backgrounds.
- **Dry Clay** (`#9c8472`) — Captions, labels, placeholders, and footer links.

### Borders & Dividers
- **Field Stone** (`#d6cfc4`) — Card borders on light sections.
- **Sand** (`#e8e0d2`) — Input borders (default), dividers, and thin rules.
- **Dark Glass** (`rgba(245, 240, 230, 0.12)`) — Borders on dark sections.

---

## Typography

### Font Families
- **Display**: `Fraunces, Georgia, serif` — Used for H1 hero ONLY, weight 700.
- **Heading**: `Space Grotesk, sans-serif` — Used for H2/H3, navigation, buttons, and logo.
- **Body**: `Plus Jakarta Sans, sans-serif` — Used for all body copy, subtitles, and inputs.

### Type Scale
- **Hero (H1)**: `clamp(40px, 6vw, 68px)`
- **H2**: `clamp(28px, 4vw, 42px)` — Section headings.
- **H3**: `clamp(18px, 2.5vw, 24px)` — Card titles, sub-headings.
- **Body Large**: `17px` — Section and hero subtitles.
- **Body**: `15px` — Card descriptions, feature items, FAQ answers.
- **Small (sm)**: `13px` — Nav links, button text, marquee, footer.
- **Extra Small (xs)**: `11px` — Uppercase labels, badges.

### Letter Spacing
- **Hero**: `-0.03em`
- **H2**: `-0.02em`
- **H3**: `-0.01em`
- **Body**: `0` (never negative)
- **Label**: `0.06em` (uppercase labels)

---

## Other Design Elements

### Border Radius
- **Small (sm)**: `8px` — Inputs, FAQ rows, small badges.
- **Medium (md)**: `12px` — AI cards, inset images, stat cards, tooltips.
- **Large (lg)**: `20px` — Service, about, who, form cards, mockup frames.
- **Pill**: `100px` — ALL buttons (no exceptions).

### Shadows (Warm Green Tint)
- **Card**: `0 4px 24px rgba(27, 58, 45, 0.06)`
- **Hover**: `0 20px 48px rgba(27, 58, 45, 0.12)`
- **Focus**: `0 0 0 3px rgba(27, 58, 45, 0.15)`

### Motion & Animation
- **Base Easing**: `cubic-bezier(0.16, 1, 0.3, 1)` (soft ease-out)
- **Hero Breathing**: ±20px drift over 12s loop.
- **CTA Pulse**: Subtle outer ring pulse (1 pulse / 3s).
- **Float Effects**: Elements like dashboard mockups float 6px over 3s.
- **Reveal Strategy**: Initial state `opacity: 0, transform: translateY(24px)`, animating to `opacity: 1, transform: none` over 0.5s.
