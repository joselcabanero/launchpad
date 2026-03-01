/**
 * Company color schema constants.
 * Mirrors the CSS variables defined in globals.css so that D3/SVG code
 * stays in sync with the rest of the design system.
 */
export const colors = {
  // Backgrounds
  background: '#FFFFFF',
  surface: '#FFF9EE',
  surfaceSecondary: '#F5EACE',
  border: '#F0E8D0',

  // Accent palette
  accentPrimary: '#FFA103',
  accentSecondary: '#DE5533',
  accentDanger: '#BC2D29',
  accentDeep: '#450E14',

  // Text
  textPrimary: '#1E1E1E',
  textMuted: '#6B5C4E',
  textInverse: '#FFFFFF',

  // Sidebar
  sidebarBg: '#1E1E1E',
  sidebarActive: '#FFA103',
  sidebarHover: '#2A2A2A',
  sidebarText: '#F5EACE',
  sidebarTextMuted: '#8A7A6A',
} as const

/** Ordered series palette for charts (donut, funnel, etc.) */
export const chartColors: readonly string[] = [
  colors.accentPrimary,
  colors.accentSecondary,
  colors.accentDanger,
  colors.accentDeep,
  colors.surfaceSecondary,
  colors.textMuted,
]
