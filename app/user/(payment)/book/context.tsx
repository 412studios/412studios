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

  return (
    <DashboardContext.Provider
      value={{
        user: userData,
        subscriptions: subscriptionData,
        prices: pricingData,
        options,
        setOptions,
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
