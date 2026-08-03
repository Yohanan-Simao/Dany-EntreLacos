# Design System Master File

> **LOGIC:** When building a specific page, first check `design-system/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** dany-entrelacos
**Generated:** 2026-08-03
**Category:** Artisan Handmade Goods (Tiaras e Laços Artesanais)

---

## Design Direction

**Style: Nature Distilled** — warm earth tones, handmade warmth, organic materials, artisan quality, soft natural gradients, calming aesthetic.

**Why:** The skill search (`handmade artisan warm terracotta`) confirms Nature Distilled as the top match for artisan goods. The current codebase already implements this direction correctly in `globals.css`. Do NOT pivot to pink bridal neon or Liquid Glass.

### Page Pattern

**Pattern Name:** Hero-Centric + Social Proof

- **CTA Placement:** Above fold
- **Section Order:** Hero > Novidades > Instagram > Sobre > Produtos > Contato

---

## Global Rules

### Color Palette

Live source of truth: `src/app/globals.css` (`@theme inline` block).

| Role | Hex | CSS Variable |
|------|-----|--------------|
| Primary | `#C48880` | `--color-primary` |
| Primary Light | `#D9A8A2` | `--color-primary-light` |
| Primary Dark | `#985B58` | `--color-primary-dark` |
| Primary Deep | `#83524D` | `--color-primary-deep` |
| Accent | `#E8D5C4` | `--color-accent` |
| Accent Light | `#F5F0EA` | `--color-accent-light` |
| Background | `#FAF7F2` | `--color-background` |
| Foreground | `#2D1F1E` | `--color-foreground` |
| Muted | `#6F6360` | `--color-muted` |

**Color Notes:** Warm terracotta + soft cream. High-contrast dark cocoa foreground for text.

### Typography

| Role | Font | CSS Variable | Usage |
|------|------|--------------|-------|
| Sans / Body | Outfit | `--font-sans` | Body, UI, buttons |
| Display | Fraunces (serif) | `--font-display` | Headlines, `font-display` |
| Cursive | Fraunces italic | `--font-cursive` | Brand accent words, eyebrow labels |

**Rules:**
- `font-cursive` → italic, weight 500, `letter-spacing: -0.01em`
- `font-display` → `letter-spacing: -0.02em`, `font-feature-settings: "ss01","ss02"`
- Body text never below 16px; maintain 4.5:1 contrast (use `text-muted` `#6F6360` on `#FAF7F2` only for non-critical text — verify)

### Spacing Variables

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | `4px` / `0.25rem` | Tight gaps |
| `--space-sm` | `8px` / `0.5rem` | Icon gaps, inline spacing |
| `--space-md` | `16px` / `1rem` | Standard padding |
| `--space-lg` | `24px` / `1.5rem` | Section padding |
| `--space-xl` | `32px` / `2rem` | Large gaps |
| `--space-2xl` | `48px` / `3rem` | Section margins |
| `--space-3xl` | `64px` / `4rem` | Hero padding |

### Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| Pill | `9999px` | Buttons, eyebrow badges (`rounded-full`) |
| Card | `rounded-2xl` (16px) | Cards, images |

---

## Component Specs

### Buttons

```css
/* Primary Button */
.btn-primary {
  background: var(--color-primary-dark);  /* #985B58 */
  color: white;
  border-radius: 9999px;
  padding: 14px 32px;
  font-weight: 600;
  transition: all 200ms ease;
  cursor: pointer;
}
.btn-primary:hover {
  filter: brightness(0.95);
  box-shadow: 0 10px 15px rgba(0,0,0,0.1);
}
.btn-primary:active {
  transform: scale(0.98);
}
.btn-primary:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px var(--color-primary-dark), 0 0 0 4px #fff;
}

/* Secondary Button */
.btn-secondary {
  background: transparent;
  color: var(--color-primary-dark);
  border: 2px solid color-mix(in srgb, var(--color-primary) 30%, transparent);
  border-radius: 9999px;
  padding: 14px 32px;
  font-weight: 600;
  transition: all 200ms ease;
  cursor: pointer;
}
.btn-secondary:hover {
  border-color: var(--color-primary-dark);
  background: color-mix(in srgb, var(--color-primary) 5%, transparent);
}
```

### Cards

```css
.card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0,0,0,0.08);
  transition: all 200ms ease;
}
```

### Inputs

```css
.input {
  padding: 12px 16px;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  font-size: 16px;
  background: white;
  transition: border-color 200ms ease, box-shadow 200ms ease;
}
.input:focus {
  border-color: var(--color-primary);
  outline: none;
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary) 20%, transparent);
}
```

---

## Animation Guidelines

- **Duration:** micro-interactions 150–300ms, hero entrance ~800ms with stagger (matches current framer-motion usage).
- **Reduced motion:** always respect `prefers-reduced-motion` — already handled globally in `globals.css` (0.01ms override).
- **Entrances:** `opacity 0→1` + `y: 30→0`; stagger delays 0.2s.
- **Press feedback:** `active:scale-[0.98]` on buttons (no layout shift).
- **Hover:** brightness/opacity/shadow shifts only — never layout-shifting transforms.

---

## Anti-Patterns (Do NOT Use)

- ❌ **Pink neon / bridal-pink palette** (`#EC4899`, `#FDF2F8`) — does not match artisan identity
- ❌ **Great Vibes / Cormorant / Amatic SC** — keep Outfit + Fraunces
- ❌ **Liquid Glass / Glassmorphism heavy** — poor text contrast, wrong mood
- ❌ **Emojis as icons** — use SVG icons (Lucide, already in project)
- ❌ **Missing cursor:pointer** — all clickable elements must have cursor:pointer
- ❌ **Layout-shifting hovers** — avoid scale transforms that shift layout (use `scale-[0.98]` press only)
- ❌ **Low contrast text** — maintain 4.5:1 minimum contrast ratio
- ❌ **Instant state changes** — always use transitions (150-300ms)
- ❌ **Invisible focus states** — focus states must be visible for a11y
- ❌ **Raw `<img>` tags** — use `next/image`

---

## Pre-Delivery Checklist

Before delivering any UI code, verify:

- [ ] No emojis used as icons (use SVG: Lucide)
- [ ] All icons from consistent icon set (Lucide, `lucide-react`)
- [ ] `cursor-pointer` on all clickable elements
- [ ] Hover states with smooth transitions (150-300ms)
- [ ] Light mode: text contrast 4.5:1 minimum
- [ ] Focus states visible for keyboard navigation
- [ ] `prefers-reduced-motion` respected
- [ ] Responsive: 375px, 768px, 1024px, 1440px
- [ ] No content hidden behind fixed navbars
- [ ] No horizontal scroll on mobile
- [ ] All images use `next/image` with `priority` only on LCP hero images
- [ ] OpenGraph image configured
