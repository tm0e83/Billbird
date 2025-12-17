/**
 * Truncates a number to two decimal places without rounding.
 */
export function trimDecimals(num: number): number {
  return Math.trunc(num * 100) / 100;
}