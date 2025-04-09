import { User, Subscription, Pricing } from "@prisma/client";

/**
 * Type Definitions for the Booking System
 */

/**
 * Maps room IDs to their pricing information
 */
export type PricesMap = {
  [key: number]: Pricing;
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
  room: number;
  date: Date;
  startTime: number;
  endTime: number;
  duration: number;
  price: number;
  loading: boolean;
  subscription: Subscription[];
  subRooms: number[];
  subRoomHours: number[];
  user: User | null;
  engDuration: number;
  engStart: number;
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
  subscriptionId?: number;
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
