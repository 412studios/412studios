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

/**
 * Checks if a time slot is available based on the 2-hour advance booking requirement
 * @param date - The selected date
 * @param slotStartHour - The hour (0-23) of the time slot to check
 * @returns true if the slot is available, false if it's less than 2 hours in advance
 */
export function isTimeSlotAvailable(date: Date, slotStartHour: number): boolean {
  const now = new Date();
  const selectedDate = new Date(date);
  
  // Set the selected date to the specified hour
  selectedDate.setHours(slotStartHour, 0, 0, 0);
  
  // Calculate the difference in milliseconds
  const differenceInMs = selectedDate.getTime() - now.getTime();
  const differenceInHours = differenceInMs / (1000 * 60 * 60);
  
  // Return true if the slot is at least 2 hours in the future
  return differenceInHours >= 2;
}
