"use client";

import { createContext, useContext, ReactNode } from "react";
import { User, Subscription, Pricing } from "@prisma/client";

// Define a type for pricing data format
export type PricesMap = {
  [key: number]: Pricing;
};

// Context type with Prisma-generated types
type DashboardContextType = {
  user: User | null;
  subscriptions: Subscription[];
  prices: PricesMap;
};

// Create and export context with default values
export const DashboardContext = createContext<DashboardContextType>({
  user: null,
  subscriptions: [],
  prices: {},
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
  return (
    <DashboardContext.Provider
      value={{
        user: userData,
        subscriptions: subscriptionData,
        prices: pricingData,
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
