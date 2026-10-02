// Serbian number formatting: decimal comma, no thousands separator ("1000 g").

export function formatFixed(value: number, decimals: number): string {
  return value.toFixed(decimals).replace('.', ',');
}

/** Up to 2 decimals with trailing zeros trimmed: 65, 0,1, 0,38. */
export function formatPercentValue(value: number): string {
  return String(Number(value.toFixed(2))).replace('.', ',');
}

export function formatPercent(value: number): string {
  return `${formatPercentValue(value)}%`;
}

export function formatGrams(value: number, decimals = 0): string {
  return `${formatFixed(value, decimals)} g`;
}

/** Parses user input, accepting a decimal comma or dot and ignoring a unit. */
export function parseDecimal(text: string): number | null {
  const cleaned = text.replace(/[%g\s]/gi, '').replace(',', '.');
  if (!/^\d*\.?\d+$|^\d+\.$/.test(cleaned)) return null;
  return Number(cleaned);
}
