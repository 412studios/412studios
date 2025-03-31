import { User, Subscription, Pricing } from "@prisma/client";

export interface TimeSlot {
  id: number;
  displayName: string;
  displayStart: string;
  displayEnd: string;
}

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

export interface PricesMap {
  [key: number]: Pricing;
}

export interface BookingResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface SubscriptionBookingResponse {
  success: boolean;
  message: string;
  data?: {
    subscriptionId: string;
    availableHours: number;
  };
}

export interface BookingValidationError {
  field: string;
  message: string;
} 