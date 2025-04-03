/**
 * Common utility functions for date and time handling in the booking system
 */

/**
 * Formats a Date object into a numeric string (YYYYMMDD)
 * @param date - The date to format
 * @returns Formatted date string or empty string if date is undefined
 */
export function formatDateToNumeric(date: Date | undefined): string {
  if (!date) return "";
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return year + month + day;
}

/**
 * Fills an array with sequential numbers from min to max (inclusive)
 * @param arr - The array to fill
 * @param min - The starting number
 * @param max - The ending number
 * @returns The filled array
 */
export function fillArrGaps(arr: number[], min: number, max: number): number[] {
  for (let i = min; i <= max; i++) {
    arr.push(i);
  }
  return arr;
}
