// Tinted neutral scale — shared across pages.
//
// There's no committed gray ramp in the design system yet, so these live
// here rather than being reached for from Tailwind's stock (achromatic)
// grays. Every value carries ~0.015-0.02 chroma toward the brand's indigo
// hue (~275), so text and hairlines read as "this brand's neutral."
//
// This was originally defined inline in ProjectPage.tsx. The moment a
// second page (TaskBoard) needed the same ramp, it got promoted here —
// otherwise it's the exact "same fix five times" problem the design
// critique called out. If a third surface needs it, it belongs in the
// Tailwind theme config as real `text-ink-*` / `border-tint-*` utilities
// instead of arbitrary-value strings.

export const ink = "text-[oklch(0.24_0.02_275)] dark:text-[oklch(0.95_0.01_275)]";
export const inkBody = "text-[oklch(0.34_0.018_275)] dark:text-[oklch(0.87_0.012_275)]";
export const inkMuted = "text-[oklch(0.5_0.02_275)] dark:text-[oklch(0.68_0.02_275)]";
export const inkFaint = "text-[oklch(0.64_0.016_275)] dark:text-[oklch(0.52_0.02_275)]";

export const borderTint = "border-[oklch(0.91_0.01_275)] dark:border-[oklch(0.32_0.02_275)]";
export const hoverTint = "hover:bg-[oklch(0.97_0.006_275)] dark:hover:bg-[oklch(0.26_0.015_275)]";
export const trackTint = "bg-[oklch(0.93_0.008_275)] dark:bg-[oklch(0.3_0.015_275)]";

// Dedicated hover/group-hover variants — Tailwind needs full static class
// names, so a variant prefix can't be glued onto a multi-class variable.
export const inkHover = "hover:text-[oklch(0.24_0.02_275)] dark:hover:text-[oklch(0.95_0.01_275)]";
export const inkMutedHover = "hover:text-[oklch(0.5_0.02_275)] dark:hover:text-[oklch(0.68_0.02_275)]";
export const inkMutedGroupHover = "group-hover:text-[oklch(0.5_0.02_275)] dark:group-hover:text-[oklch(0.68_0.02_275)]";

export const surfacePanel = "bg-white dark:bg-gray-800 rounded-2xl shadow-sm";

export const aiAssistBtn =
  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-900 dark:bg-gray-700 text-white text-xs hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors";