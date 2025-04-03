"use client";

import { createContext, useContext, ReactNode, useState, useEffect, useMemo, useCallback } from "react";
import { User, Subscription } from "@prisma/client";
import { PricesMap, BookingOptions } from "./types/booking";

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
  // Add missing derived state properties
  isSubscribed: false,
  activeSubscription: null,
  areSubHoursAvailable: false,
  
  // Add missing helper functions
  onRoomSelect: () => {},
  handleTimePick: () => {},
  clearTimeSelection: () => {},
  submitBooking: async () => {},
  submitSubscriptionBooking: async () => {},
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
    options.subRooms.includes(options.room), 
    [options.subRooms, options.room]
  );
  
  const activeSubscription = useMemo(() => {
    if (!isSubscribed) return null;
    return options.subscription.find(
      (sub) => sub.roomId === options.room
    ) || null;
  }, [isSubscribed, options.subscription, options.room]);
  
  const areSubHoursAvailable = useMemo(() => {
    if (!activeSubscription) return false;
    return activeSubscription.availableHours >= 4;
  }, [activeSubscription]);
  
  // Helper functions - memoized to prevent unnecessary re-renders
  const onRoomSelect = useCallback((id: string) => {
    setOptions((prevOptions) => ({
      ...prevOptions,
      room: parseInt(id),
      date: new Date(),
      startTime: -1,
      endTime: -1,
      engStart: -1,
      engDuration: -1,
    }));
  }, [setOptions]);
  
  const handleTimePick = useCallback((start: number, end: number, duration: number) => {
    setOptions((prevOptions) => ({
      ...prevOptions,
      startTime: start,
      endTime: end,
      duration: duration,
    }));
  }, [setOptions]);
  
  const clearTimeSelection = useCallback(() => {
    setOptions((prevOptions) => ({
      ...prevOptions,
      startTime: -1,
      endTime: -1,
      duration: 0,
    }));
  }, [setOptions]);
  
  const submitBooking = useCallback(async () => {
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
  }, [options, setOptions]);
  
  const submitSubscriptionBooking = useCallback(async () => {
    setOptions((prevOptions) => ({
      ...prevOptions,
      loading: true,
    }));
    
    const startTime = options.startTime * 4;
    const endTime = options.endTime * 4 + 3;
    const duration = (options.endTime - options.startTime + 1) * 4;
    
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
  }, [options, setOptions]);

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
