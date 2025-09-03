/**
 * Centralized brand palette and helpers
 * Luminr brand colors:
 * - red: #C43039
 * - purple: #731B4F
 * - dark purple: #281535
 * - lighter purple: #841E5A
 * - orange: #F5784B
 * - light grey: #EDEDED
 */
export const brand = {
  red: '#C43039',
  purple: '#731B4F',
  darkPurple: '#281535',
  lightPurple: '#841E5A',
  orange: '#F5784B',
  lightGrey: '#EDEDED',
  white: '#FFFFFF',
  black: '#000000'
};

// Palette to color providers/charts consistently
export const providerPalette: string[] = [
  brand.purple,
  brand.lightPurple,
  brand.orange,
  brand.red
];

// Utility to convert hex like #RRGGBB to rgba string
export function hexToRgba(hex: string, alpha = 1): string {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!m) return hex;
  const r = parseInt(m[1], 16);
  const g = parseInt(m[2], 16);
  const b = parseInt(m[3], 16);
  return `rgba(${r},${g},${b},${alpha})`;
}
