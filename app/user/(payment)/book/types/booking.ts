import { User, Memberships, Pricing } from "@prisma/client";

/**
 * Type Definitions for the Booking System
 */

/**
 * Maps room IDs to their pricing information
 */
export type PricesMap = {
  [key: string]: Pricing;
};

/**
 * Represents a time slot for booking
 */
export interface TimeSlot {
  id: number;
  startTime: string;
  displayStart: string;
  displayEnd: string;
  displayName: string;
}

/**
 * Main booking options state interface
 */
export interface BookingOptions {
  room: string;
  date: Date;
  startTime: number;
  endTime: number;
  duration: number;
  price: number;
  loading: boolean;
  membership: Memberships[];
  membershipRooms: number[];
  membershipRoomHours: number[];
  user: User | null;
  engDuration: number;
  engStart: number;
  offerCode?: string;
  offerCodeId?: string;
  discountType?: string;
  discountValue?: number;
  discountAmount?: number;
}

/**
 * Represents a booking record returned from the API
 */
export interface BookingRecord {
  id: number;
  userId: string;
  roomId: number;
  startTime: number;
  endTime: number;
  date: number;
  engineerStart?: number;
  engineerDuration?: number;
  price: number;
  membershipId?: number;
  type?: string;
}

/**
 * Represents a booking record specifically as returned by the getBooking API
 */
export interface BookingApiRecord {
  roomId: number;
  date: number;
  type: string;
  startTime: number;
  endTime: number;
}

/**
 * Represents booking validation results
 */
export interface BookingValidation {
  isValid: boolean;
  message?: string;
}
