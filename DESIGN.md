---
name: Sidekick
description: A warm, native-feeling daily task driver with an embedded AI coach.
colors:
  primary: "oklch(0.585 0.217 277)"
  primary-soft: "oklch(0.93 0.04 277)"
  shell-bg: "oklch(0.967 0.003 264)"
  shell-bg-dark: "oklch(0.21 0.015 264)"
  surface: "oklch(1 0 0)"
  surface-dark: "oklch(0.278 0.015 264)"
  ink: "oklch(0.24 0.02 275)"
  ink-body: "oklch(0.34 0.018 275)"
  ink-muted: "oklch(0.5 0.02 275)"
  ink-faint: "oklch(0.64 0.016 275)"
  border-tint: "oklch(0.91 0.01 275)"
  track-tint: "oklch(0.93 0.008 275)"
typography:
  display:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.025em"
  title:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.4
  body:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.05em"
rounded:
  sm: "6px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  button-primary-hover:
    backgroundColor: "oklch(0.511 0.231 277)"
    textColor: "{colors.surface}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink-muted}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  nav-item-active:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.primary}"
    rounded: "{rounded.md}"
    padding: "8px 10px"
  surface-panel:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.xl}"
    padding: "24px"
  input-field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "8px 12px"
---

# Design System: Sidekick

## 1. Overview

**Creative North Star: "The Supportive Workbench"**

Sidekick is a daily task driver that should feel like polished native software with a warm coach sitting beside it — Arc/Raycast craft applied to personal productivity. Surfaces are calm and legible: white panels on a soft gray shell, indigo as the single confident accent, and typography that carries encouragement through hierarchy rather than decoration. The AI sidekick lives inside the workflow (Today, projects, planning), not as a bolt-on marketing widget.

This system explicitly rejects generic SaaS slop, AI gimmick chrome, overbusy productivity dashboards, and corporate admin clutter — the same anti-references captured in PRODUCT.md. Warmth comes from copy, spacing, and considered micro-interactions, not from gradient cards or metric hero templates.

**Key Characteristics:**
- Restrained color strategy: tinted indigo neutrals + one accent used deliberately
- Rounded floating panels (`16px`) on a padded shell — not nested card grids
- Flat metadata rows and dividers instead of identical stat boxes
- Indigo reserved for primary actions, active nav, checkboxes, and AI affordances
- Light and dark themes with matched surface hierarchy
- OKLCH tinted neutrals (hue ~275) for text and hairlines — not stock achromatic grays

## 2. Colors: The Indigo-Tinted Workbench

A restrained product palette: soft shell, white surfaces, indigo accent, and a dedicated OKLCH neutral ramp for readable text.

### Primary
- **Coach Indigo** (oklch(0.585 0.217 277) / `#6366f1`): Primary buttons, active checkboxes, AI panel header icon, progress bars, "Add Task" emphasis, and user-message bubbles in the sidekick chat. The accent earns its place through action and state — not decoration.

### Neutral
- **Shell Mist** (oklch(0.967 0.003 264) / `#f3f4f6`): Outer app background in light mode; frames the sidebar and main panel with breathing room (`p-4` shell padding).
- **Shell Night** (oklch(0.21 0.015 264) / `#111827`): Outer app background in dark mode.
- **Surface White** (oklch(1 0 0) / `#ffffff`): Sidebar, main content panel, modals, and AI assistant panel backgrounds in light mode.
- **Surface Slate** (oklch(0.278 0.015 264) / `#1f2937`): Panel backgrounds in dark mode.
- **Ink** (oklch(0.24 0.02 275)): Primary headings and high-emphasis text — tinted toward indigo, not pure black.
- **Ink Body** (oklch(0.34 0.018 275)): Prose, task labels, and secondary headings.
- **Ink Muted** (oklch(0.5 0.02 275)): Metadata, captions, nav inactive labels, placeholder-adjacent copy.
- **Ink Faint** (oklch(0.64 0.016 275)): Empty states, dividers-as-text, tertiary hints.
- **Border Tint** (oklch(0.91 0.01 275)): Hairline dividers, ghost button borders, metadata row separators.
- **Track Tint** (oklch(0.93 0.008 275)): Progress track backgrounds and vertical dividers in metadata rows.
- **Primary Soft** (oklch(0.93 0.04 277)): Active nav item backgrounds, subtle AI callout tints.

### Semantic (functional, not brand)
- **Priority High** (red-400/50 family): Overdue badges, high-priority dots — urgency only.
- **Priority Medium** (amber-400/50 family): Due-soon signals.
- **Priority Low** (green-400/50 family): Completed/success hints.
- **Streak Warmth** (orange-500 family): Streak flame icon — the one motivational color outside indigo.

### Named Rules
**The One Accent Rule.** Indigo is the brand voice. It appears on primary actions, active navigation, completed checkboxes, AI affordances, and progress fills. It does not appear on every icon, every section header, or every background tint. If a screen feels purple, you've overspent the accent.

**The Tinted Neutral Rule.** Text and borders use the OKLCH ramp in `src/lib/ui/tint.ts` (hue ~275, chroma 0.01–0.02). Do not reach for Tailwind's achromatic `gray-*` for body copy on new surfaces — it reads generic and breaks brand cohesion.

## 3. Typography

**Display Font:** System UI stack (target: Geist Sans — currently inconsistent with `globals.css`)
**Body Font:** System UI stack (same)
**Label/Mono Font:** Geist Mono (`--font-geist-mono`) for code or numeric emphasis when needed

**Character:** Clean, friendly, and efficient — semibold headings with tight tracking, relaxed body copy, and small caps only for true section labels in the sidebar (not as a page-wide scaffold pattern).

### Hierarchy
- **Display** (600, 1.5rem / 24px, 1.25): Page greetings — "Good morning, Pristia!" on Today view.
- **Headline** (600, 1.125rem / 18px, 1.3): Section titles — "Today's plan", "Today's Tasks".
- **Title** (600, 1rem / 16px, 1.4): Modal headers, sidebar app name.
- **Body** (400, 0.875rem / 14px, 1.5): Task labels, plan prose, AI messages. Cap line length at 65–75ch on long prose blocks (`max-w-prose`).
- **Label** (500, 0.75rem / 12px, wide tracking on sidebar section headers): "Main Menu", "Projects" — functional wayfinding, not decorative eyebrows on every content section.

### Named Rules
**The Honest Weight Rule.** One number on a screen may earn display emphasis (e.g., streak count). Secondary metadata stays at label weight in a flat row — never four identical stat boxes competing for attention.

## 4. Elevation

Sidekick uses **tonal layering with minimal shadow** — depth comes from the shell/panel contrast and rounded containers, not dramatic drop shadows.

The outer shell (`gray-100` / `gray-900`) sits behind floating white/`gray-800` panels with `rounded-2xl`. Modals add `shadow-lg` over a `bg-black/40` scrim. Interactive rows use hover background tints (`hover:bg-gray-50`, `hoverTint`) rather than lifting with shadow. Active theme toggle segments get a subtle `shadow-sm` to indicate selection within a segmented control.

### Shadow Vocabulary
- **Panel rest** (`box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05)`): `shadow-sm` on sidebar and main content panels.
- **Modal lift** (`box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1)`): `shadow-lg` on dialog surfaces only.

### Named Rules
**The Flat-By-Default Rule.** Surfaces are flat at rest. Shadows appear only on modals and segmented-control selection — never as default card decoration. Nested cards are prohibited.

## 5. Components

### Buttons
- **Shape:** Gently rounded (8px / `rounded-lg`)
- **Primary:** Coach Indigo background, white text, `font-medium`, `px-4 py-2`. Used for "Add task", send in AI panel, form submission.
- **Hover / Focus:** Darken to indigo-600; inputs use `focus:ring-2 focus:ring-indigo-300` (light) or `indigo-500` (dark).
- **Ghost / Secondary:** Transparent or gray hover background, muted text — Cancel buttons, Focus Mode outline buttons.
- **AI Assist:** Inverted dark (`bg-gray-900` / `gray-700`) with white text and Sparkles icon — secondary to primary indigo actions.

### Chips / Badges
- **Priority pills:** `rounded-full`, colored dot + label, soft tinted background (red/amber/green at 50-level). Muted gray when task is done.
- **Due date badges:** `rounded-full`, semantic color by urgency (red overdue, indigo today, amber soon).
- **Suggestion chips (AI):** Bordered `rounded-xl` rows that tint indigo on hover — not gradient pills.

### Cards / Containers
- **Corner Style:** 16px (`rounded-2xl`) for app panels; 12px (`rounded-xl`) for list rows and insight blocks
- **Background:** White / gray-800 surfaces on shell background
- **Shadow Strategy:** `shadow-sm` at panel level only
- **Border:** Hairline `border-gray-100` / `borderTint` on sidebar edge; avoid nested bordered cards
- **Internal Padding:** 24px (`p-6`) for main panels, 12px (`p-3`) for list rows

### Inputs / Fields
- **Style:** 1px border (`border-gray-200`), 8px radius, 14px text, white/gray-700 fill
- **Focus:** Indigo ring (`ring-2 ring-indigo-300`) — no glow gradients
- **Labels:** 12px muted text above field

### Navigation
- **Sidebar:** 224px expanded / 80px collapsed, white panel, indigo logo mark (24px square, 6px radius)
- **Active item:** `bg-indigo-50` + indigo text + medium weight
- **Inactive:** Gray-500 text, hover gray-50 background
- **Add Task:** Bold indigo text row at top of nav — primary creation affordance

### AI Sidekick Panel
- **Width:** 320px fixed (`w-80`), same panel treatment as main content
- **Header:** Indigo icon tile + "AI Sidekick" title + close/reset controls
- **Messages:** User bubbles indigo-500 right-aligned; assistant bubbles gray-100 left-aligned, `rounded-2xl` with one corner squared
- **Input bar:** Gray-50 inset field, indigo send button — embedded coach, not floating chatbot widget

### Task Item
- **Row:** Full-width `rounded-xl` hover tint, checkbox + label + metadata
- **Checkbox:** 20px, 6px radius, indigo fill when done
- **Delete:** Opacity-0 until row hover — quiet destructive action

## 6. Do's and Don'ts

### Do:
- **Do** use the OKLCH tinted neutral ramp from `tint.ts` for new text and borders on primary surfaces.
- **Do** keep the shell → panel → content hierarchy: padded gray shell, floating white panels, flat lists inside.
- **Do** embed AI coaching in context (Today insights, project phases, inline plan copy) before opening the side panel.
- **Do** use indigo sparingly for actions and state — one accent, many tinted neutrals.
- **Do** show only verified data; placeholder stats must be labeled or removed.
- **Do** honor `prefers-reduced-motion` on any new animations.

### Don't:
- **Don't** use generic SaaS landing-page slop: gradient heroes, big metric cards, eyebrow kickers on every section.
- **Don't** ship AI gimmick UI: bolt-on chatbot chrome, purple gradients, sparkle overload divorced from the task workflow.
- **Don't** build overbusy productivity dashboards: dashboard sprawl, fake stats, gamification theater.
- **Don't** default to corporate admin UI: dense gray tables and enterprise clutter as the daily surface.
- **Don't** use side-stripe borders (`border-left` > 1px) as colored accents on cards or list items.
- **Don't** nest cards inside cards — one panel depth is enough.
- **Don't** use gradient text (`background-clip: text`) for headings or labels.
- **Don't** add identical icon + heading + text card grids for features or insights.
- **Don't** reach for cream/sand/beige warm-neutral body backgrounds — warmth lives in accent, copy, and craft.
