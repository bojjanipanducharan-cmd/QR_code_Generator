// WCAG relative luminance and contrast ratio.

function toRgb(hex) {
  const n = parseInt(hex.replace('#', ''), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

export function luminance(hex) {
  const [r, g, b] = toRgb(hex).map((c) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function contrastRatio(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

/** Returns a list of human-readable scanning warnings (empty = looks fine). */
export function getScanWarnings({ fg, bg, margin, size }) {
  const warnings = []
  const ratio = contrastRatio(fg, bg)
  if (ratio < 3) warnings.push(`Contrast is very low (${ratio.toFixed(1)}:1). Most scanners will fail.`)
  else if (ratio < 4.5) warnings.push(`Contrast is low (${ratio.toFixed(1)}:1). Pick a darker foreground or lighter background.`)
  if (luminance(fg) > luminance(bg)) warnings.push('Light-on-dark (inverted) codes are not read by some scanners.')
  if (margin < 4) warnings.push('Quiet zone is under 4 modules. Some scanners need 4 or more.')
  if (size < 200) warnings.push('Small codes are harder to scan. 200px or larger is safer.')
  return warnings
}
