# Design Brief

## Direction

Professional Commerce — a clean, product-focused e-commerce interface that prioritizes trust, clarity, and frictionless product discovery for electronics retailers.

## Tone

Refined minimalism with intentional blue hierarchy — not generic Amazon clone. Cool, professional, calming aesthetic that reduces eye strain during product browsing while maintaining high-contrast interactive elements for action clarity.

## Differentiation

Disciplined color palette with strategic accent usage: vivid deep blue for primary CTAs and category navigation, teal accents sparingly for secondary actions and rating badges, creating visual hierarchy without visual chaos.

## Color Palette

| Token      | OKLCH         | Role                                      |
|------------|---------------|-------------------------------------------|
| background | 0.98 0.008 230 | Cool off-white — reduces eye strain       |
| foreground | 0.18 0.015 230 | Deep cool grey — high contrast            |
| primary    | 0.42 0.14 240 | Deep ocean blue — trust, CTAs, primary nav |
| accent     | 0.6 0.15 170  | Cool teal — ratings, secondary CTAs, badges |
| muted      | 0.94 0.008 230 | Very light grey — filter backgrounds      |

## Typography

- Display: Space Grotesk — geometric sans-serif, modern, great for category headers and hero text
- Body: Figtree — highly legible sans-serif, warm enough for approachability
- Mono: Geist Mono — prices, SKUs, product specifications
- Scale: hero 5xl bold tight tracking, h2 3xl bold, labels sm semibold uppercase, body base

## Elevation & Depth

Subtle card elevation with minimal shadows — boxes distinguished through background color and thin borders rather than heavy drop shadows. Hover states increase shadow depth to signal interactivity.

## Structural Zones

| Zone    | Background        | Border          | Notes                          |
|---------|-------------------|-----------------|--------------------------------|
| Header  | card (1.0)        | thin border-b   | White with sticky positioning  |
| Hero    | background        | —               | Cool off-white with blue CTA   |
| Content | background        | —               | Alternating card sections      |
| Sidebar | secondary (0.95)  | thin border-r   | Filters on light muted bg      |
| Footer  | muted (0.94)      | thin border-t   | Light cool grey with text link |

## Spacing & Rhythm

Mobile-first vertical stacking with 1rem gaps between sections, expanding to 2rem on desktop. Product grid: 1 col mobile, 2 col tablet, 3-4 col desktop. Generous whitespace around CTAs, compact labeling on filters.

## Component Patterns

- Buttons: primary blue bg with white text, rounded 6px, shadow-sm on hover; secondary blue outlined; destructive red for removals
- Cards: white bg, subtle border, card-elevation shadow, card-hover on interaction
- Badges: teal accent with rounded full styling for ratings/promo tags
- Filter inputs: light muted bg, blue ring on focus
- Product prices: mono font, dark foreground for emphasis

## Motion

Entrance: staggered fade-in on product cards (100ms intervals). Hover: smooth 0.2s elevation transition on cards. Button: 0.15s fill color transition. No decorative animations — all motion serves usability.

## Constraints

- Never use arbitrary color values; all colors from CSS tokens only
- No heavy drop shadows; use elevation sparingly for focus states
- Maintain AA+ contrast on all interactive elements
- Mobile-first approach: design 375px first, scale to desktop
- No external fonts; use bundled Space Grotesk + Figtree + Geist Mono only

## Signature Detail

Product card hover effect that lifts cards with a subtle shadow increase paired with a light background tint — creates a clear product interaction zone without aggressive motion or decoration.
