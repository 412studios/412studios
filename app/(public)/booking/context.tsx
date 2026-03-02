"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { User, Memberships } from "@prisma/client";
import { PricesMap, BookingOptions } from "./types/booking";

// Context type with Prisma-generated types
type DashboardContextType = {
  user: User | null;
  isAdmin: Boolean | null;
  membership: Memberships[];
  prices: PricesMap;
  options: BookingOptions;
  setOptions: React.Dispatch<React.SetStateAction<BookingOptions>>;

  // Derived state
  isMembership: boolean;
  activeMembership: Memberships | null;
  areMembershipHoursAvailable: boolean;

  // Helper functions
  onRoomSelect: (id: string) => void;
  handleTimePick: (start: number, end: number, duration: number) => void;
  clearTimeSelection: () => void;
  submitBooking: () => Promise<void>;
  submitMembershipBooking: () => Promise<void>;
  submitAdminBooking: () => Promise<void>;
};

// Create and export context with default values
export const DashboardContext = createContext<DashboardContextType>({
  user: null,
  isAdmin: false,
  membership: [],
  prices: {},
  options: {
    room: "0",
    date: new Date(),
    startTime: -1,
    endTime: -1,
    duration: 0,
    price: 0,
    loading: false,
    membership: [],
    membershipRooms: [],
    membershipRoomHours: [],
    user: null,
    engDuration: -1,
    engStart: -1,
  },
  setOptions: () => {},
  // Add missing derived state properties
  isMembership: false,
  activeMembership: null,
  areMembershipHoursAvailable: false,

  // Add missing helper functions
  onRoomSelect: () => {},
  handleTimePick: () => {},
  clearTimeSelection: () => {},
  submitBooking: async () => {},
  submitMembershipBooking: async () => {},
  submitAdminBooking: async () => {},
});

// Provider component
export function DashboardProvider({
  children,
  userData,
  membershipData,
  pricingData,
}: {
  children: ReactNode;
  userData: User | null;
  membershipData: Memberships[];
  pricingData: PricesMap;
}) {
  // Create arrays of membership room IDs and hours
  const membershipRooms = useMemo(
    () => membershipData.map((element) => element.roomId),
    [membershipData]
  );

  const membershipRoomHours = useMemo(
    () => membershipData.map((element) => element.availableHours),
    [membershipData]
  );

  // Set default option values - use first available studio ID
  const firstStudioId = useMemo(() => {
    const studioIds = Object.keys(pricingData);
    return studioIds.length > 0 ? studioIds[0] : "0";
  }, [pricingData]);

  const defaultOptions = useMemo(
    () => ({
      room: firstStudioId,
      date: new Date(),
      startTime: -1,
      endTime: -1,
      duration: 0,
      price: 0,
      loading: false,
      membership: membershipData,
      membershipRooms,
      membershipRoomHours,
      user: userData,
      engDuration: -1,
      engStart: -1,
    }),
    [membershipData, membershipRooms, membershipRoomHours, userData, firstStudioId]
  );

  const [options, setOptions] = useState<BookingOptions>(defaultOptions);

  // Reset options when dependencies change
  useEffect(() => {
    setOptions(defaultOptions);
  }, [defaultOptions]);

  // Derived state
  const isMembership = useMemo(
    () => options.membershipRooms.includes(parseInt(options.room)),
    [options.membershipRooms, options.room]
  );

  const activeMembership = useMemo(() => {
    if (!isMembership) return null;
    return (
      options.membership.find((membership) => membership.roomId === parseInt(options.room)) || null
    );
  }, [isMembership, options.membership, options.room]);

  const areMembershipHoursAvailable = useMemo(() => {
    if (!activeMembership) return false;
    return activeMembership.availableHours >= 4;
  }, [activeMembership]);

  // Helper functions - memoized to prevent unnecessary re-renders
  const onRoomSelect = useCallback(
    (id: string) => {
      setOptions((prevOptions) => ({
        ...prevOptions,
        room: id,
        date: new Date(),
        startTime: -1,
        endTime: -1,
        engStart: -1,
        engDuration: -1,
      }));
    },
    [setOptions]
  );

  const handleTimePick = useCallback(
    (start: number, end: number, duration: number) => {
      setOptions((prevOptions) => ({
        ...prevOptions,
        startTime: start,
        endTime: end,
        duration: duration,
      }));
    },
    [setOptions]
  );

  const clearTimeSelection = useCallback(() => {
    setOptions((prevOptions) => ({
      ...prevOptions,
      startTime: -1,
      endTime: -1,
      duration: 0,
    }));
  }, [setOptions]);

  const submitBooking = useCallback(async () => {
    // Check if user is authenticated
    if (!userData) {
      // Redirect to login
      window.location.href = "/api/auth/login?post_login_redirect_url=/booking";
      return;
    }

    setOptions((prevOptions) => ({
      ...prevOptions,
      loading: true,
    }));

    try {
      // Import dynamically to avoid circular dependencies
      const { PostBooking } = await import("@/lib/booking");
      await PostBooking(options);
    } catch (error) {
      console.error("Failed to post booking:", error);
      setOptions((prevOptions) => ({
        ...prevOptions,
        loading: false,
      }));
    }
  }, [options, setOptions, userData]);

  const submitMembershipBooking = useCallback(async () => {
    // Check if user is authenticated
    if (!userData) {
      // Redirect to login
      window.location.href = "/api/auth/login?post_login_redirect_url=/booking";
      return;
    }

    setOptions((prevOptions) => ({
      ...prevOptions,
      loading: true,
    }));

    const startTime = options.startTime * 4;
    const endTime = options.endTime * 4 + 3;
    const duration = (options.endTime - options.startTime + 1) * 4;

    try {
      // Import dynamically to avoid circular dependencies
      const { PostMembershipBooking } = await import("@/lib/booking");
      await PostMembershipBooking(options, startTime, endTime, duration);
    } catch (error) {
      console.error("Failed to post membership booking:", error);
      setOptions((prevOptions) => ({
        ...prevOptions,
        loading: false,
      }));
    }
  }, [options, setOptions, userData]);

  const isAdmin = userData?.role === "admin";

  const submitAdminBooking = useCallback(async () => {
    // Check if user is authenticated and is admin
    if (!userData || !isAdmin) {
      return;
    }

    try {
      // Import dynamically to avoid circular dependencies
      const { PostAdminBooking } = await import("@/lib/booking");
      await PostAdminBooking(options);
      // Don't reset loading state on success - let the redirect handle the page change
    } catch (error) {
      console.error("Failed to post booking:", error);
      setOptions((prevOptions) => ({
        ...prevOptions,
        loading: false,
      }));
    }
  }, [options, setOptions, userData, isAdmin]);

  return (
    <DashboardContext.Provider
      value={{
        user: userData,
        isAdmin: isAdmin,
        membership: membershipData,
        prices: pricingData,
        options,
        setOptions,
        isMembership,
        activeMembership,
        areMembershipHoursAvailable,
        onRoomSelect,
        handleTimePick,
        clearTimeSelection,
        submitBooking,
        submitMembershipBooking,
        submitAdminBooking,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

// Hook for consuming context - updated to allow null user
export function useDashboard() {
  const context = useContext(DashboardContext);
  // Don't throw error if user is null - allow viewing without login
  return context;
}
