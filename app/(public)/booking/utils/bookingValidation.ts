import { BookingOptions, BookingValidation } from "../types/booking";

/**
 * Common validation for all booking types
 * @param options - The booking options to validate
 * @returns Validation result with base validation or errors
 */
function validateBaseBooking(options: BookingOptions): BookingValidation {
  if (options.startTime === -1 || options.endTime === -1) {
    return {
      isValid: false,
      message: "Please select a time slot",
    };
  }

  return { isValid: true };
}

/**
 * Validates a standard (non-membership) booking
 * @param options - The booking options to validate
 * @returns Validation result with success status and optional error message
 */
export function validateStandardBooking(
  options: BookingOptions
): BookingValidation {
  const baseValidation = validateBaseBooking(options);
  if (!baseValidation.isValid) {
    return baseValidation;
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
 * Validates a membership-based booking
 * @param options - The booking options to validate
 * @returns Validation result with success status and optional error message
 */
export function validateMembershipBooking(
  options: BookingOptions
): BookingValidation {
  const baseValidation = validateBaseBooking(options);
  if (!baseValidation.isValid) {
    return baseValidation;
  }

  const duration = (options.endTime - options.startTime + 1) * 4;

  if (duration > 4) {
    return {
      isValid: false,
      message: "Please select one 4 Hour session",
    };
  }

  const foundmembership = options.membership.find(
    (membership) => membership.roomId === parseInt(options.room)
  );
  if (!foundmembership || foundmembership.availableHours < 4) {
    return {
      isValid: false,
      message: "Hours are not available",
    };
  }

  return { isValid: true };
}
