"use client";

import { createContext, useContext, ReactNode, useState, useEffect, useMemo } from "react";
import { User, Subscription, Pricing } from "@prisma/client";

// Define a type for pricing data format
export type PricesMap = {
  [key: number]: Pricing;
};

// Define options type
export type BookingOptions = {
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
};

// Context type with Prisma-generated types
type DashboardContextType = {
  user: User | null;
  subscriptions: Subscription[];
  prices: PricesMap;
  options: BookingOptions;
  setOptions: React.Dispatch<React.SetStateAction<BookingOptions>>;
  
  // Derived state
  isSubscribed: boolean;
  activeSubscription: Subscription | null;
  areSubHoursAvailable: boolean;
  
  // Helper functions
  onRoomSelect: (id: string) => void;
  handleTimePick: (start: number, end: number, duration: number) => void;
  clearTimeSelection: () => void;
  submitBooking: () => Promise<void>;
  submitSubscriptionBooking: () => Promise<void>;
};

// Create and export context with default values
export const DashboardContext = createContext<DashboardContextType>({
  user: null,
  subscriptions: [],
  prices: {},
  options: {
    room: 0,
    date: new Date(),
    startTime: -1,
    endTime: -1,
    duration: 0,
    price: 0,
    loading: false,
    subscription: [],
    subRooms: [],
    subRoomHours: [],
    user: null,
    engDuration: -1,
    engStart: -1,
  },
  setOptions: () => {},
});

// Provider component
export function DashboardProvider({
  children,
  userData,
  subscriptionData,
  pricingData,
}: {
  children: ReactNode;
  userData: User;
  subscriptionData: Subscription[];
  pricingData: PricesMap;
}) {
  // Create arrays of subscription room IDs and hours
  const subRooms = useMemo(
    () => subscriptionData.map((element) => element.roomId),
    [subscriptionData]
  );
  
  const subRoomHours = useMemo(
    () => subscriptionData.map((element) => element.availableHours),
    [subscriptionData]
  );

  // Set default option values
  const defaultOptions = useMemo(
    () => ({
      room: 0,
      date: new Date(),
      startTime: -1,
      endTime: -1,
      duration: 0,
      price: 0,
      loading: false,
      subscription: subscriptionData,
      subRooms,
      subRoomHours,
      user: userData,
      engDuration: -1,
      engStart: -1,
    }),
    [subscriptionData, subRooms, subRoomHours, userData]
  );

  const [options, setOptions] = useState<BookingOptions>(defaultOptions);

  // Reset options when dependencies change
  useEffect(() => {
    setOptions(defaultOptions);
  }, [defaultOptions]);
  
  // Derived state
  const isSubscribed = useMemo(() => 
    options.subRooms.includes(parseInt(options.room.toString())), 
    [options.subRooms, options.room]
  );
  
  const activeSubscription = useMemo(() => {
    if (!isSubscribed) return null;
    return options.subscription.find(
      (sub) => sub.roomId === parseInt(options.room.toString())
    ) || null;
  }, [isSubscribed, options.subscription, options.room]);
  
  const areSubHoursAvailable = useMemo(() => {
    if (!activeSubscription) return false;
    return activeSubscription.availableHours >= 4;
  }, [activeSubscription]);
  
  // Helper functions
  const onRoomSelect = (id: string) => {
    setOptions((prevOptions) => ({
      ...prevOptions,
      room: parseInt(id),
      date: new Date(),
      startTime: -1,
      endTime: -1,
      engStart: -1,
      engDuration: -1,
    }));
  };
  
  const handleTimePick = (start: number, end: number, duration: number) => {
    setOptions((prevOptions) => ({
      ...prevOptions,
      startTime: start,
      endTime: end,
      duration: duration,
    }));
  };
  
  const clearTimeSelection = () => {
    setOptions((prevOptions) => ({
      ...prevOptions,
      startTime: -1,
      endTime: -1,
      duration: 0,
    }));
  };
  
  const submitBooking = async () => {
    setOptions((prevOptions) => ({
      ...prevOptions,
      loading: true,
    }));
    
    try {
      // Import dynamically to avoid circular dependencies
      const { PostBooking } = await import('@/app/lib/booking');
      await PostBooking(options);
    } catch (error) {
      console.error("Failed to post booking:", error);
      setOptions((prevOptions) => ({
        ...prevOptions,
        loading: false,
      }));
    }
  };
  
  const submitSubscriptionBooking = async () => {
    setOptions((prevOptions) => ({
      ...prevOptions,
      loading: true,
    }));
    
    const startTime = options.startTime * 4;
    const endTime = options.endTime * 4 + 3;
    const duration = options.endTime - options.startTime + 1 * 4;
    
    try {
      // Import dynamically to avoid circular dependencies
      const { PostSubscriptionBooking } = await import('@/app/lib/booking');
      await PostSubscriptionBooking(options, startTime, endTime, duration);
    } catch (error) {
      console.error("Failed to post subscription booking:", error);
      setOptions((prevOptions) => ({
        ...prevOptions,
        loading: false,
      }));
    }
  };

  return (
    <DashboardContext.Provider
      value={{
        user: userData,
        subscriptions: subscriptionData,
        prices: pricingData,
        options,
        setOptions,
        isSubscribed,
        activeSubscription,
        areSubHoursAvailable,
        onRoomSelect,
        handleTimePick,
        clearTimeSelection,
        submitBooking,
        submitSubscriptionBooking
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

// Hook for consuming context
export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context.user) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
}
