import { BookingOptions, BookingValidation } from "../types/booking";

/**
 * Validates a standard (non-subscription) booking
 * @param options - The booking options to validate
 * @returns Validation result with success status and optional error message
 */
export function validateStandardBooking(
  options: BookingOptions
): BookingValidation {
  if (options.startTime === -1 || options.endTime === -1) {
    return {
      isValid: false,
      message: "Please select a time slot",
    };
  }

  const duration = options.endTime - options.startTime + 1;

  if (duration <= 1) {
    return {
      isValid: false,
      message: "Please select a minimum of 2 hours",
    };
  }

  return { isValid: true };
}

/**
 * Validates a subscription-based booking
 * @param options - The booking options to validate
 * @returns Validation result with success status and optional error message
 */
export function validateSubscriptionBooking(
  options: BookingOptions
): BookingValidation {
  if (options.startTime === -1 || options.endTime === -1) {
    return {
      isValid: false,
      message: "Please select a time slot",
    };
  }

  const duration = (options.endTime - options.startTime + 1) * 4;

  if (duration > 4) {
    return {
      isValid: false,
      message: "Please select one 4 Hour session",
    };
  }

  const foundSub = options.subscription.find(
    (sub) => sub.roomId === options.room
  );
  if (!foundSub || foundSub.availableHours < 4) {
    return {
      isValid: false,
      message: "Hours are not available",
    };
  }

  return { isValid: true };
}
