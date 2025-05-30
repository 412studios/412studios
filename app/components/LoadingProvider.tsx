"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Logo } from "@/public/icons/logo";

// Loading Screen Component
interface LoadingScreenProps {
  excludedPaths?: string[];
  excludedPatterns?: RegExp[];
}

function LoadingScreen({
  excludedPaths = [],
  excludedPatterns = [],
}: LoadingScreenProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [shouldShow, setShouldShow] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const [opacity, setOpacity] = useState(1);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const pathname = usePathname();

  // Check if current path should be excluded
  const isExcluded = () => {
    // Check exact path matches
    if (excludedPaths.includes(pathname)) return true;

    // Check pattern matches
    return excludedPatterns.some((pattern) => pattern.test(pathname));
  };

  useEffect(() => {
    // Check if this page should show loading screen
    if (isExcluded()) {
      setShouldShow(false);
      setIsLoading(false);
      setIsVisible(false);
      return;
    }

    setShouldShow(true);
    setIsLoading(true);
    setIsVisible(true);
    setOpacity(1);
    setLoadingProgress(0);

    // Animate progress from 0 to 100 with easing
    let startTime = Date.now();
    const duration = 1000; // 1 second

    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-in-out cubic function for natural feel
      const eased =
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      const newProgress = eased * 100;
      setLoadingProgress(newProgress);

      if (progress >= 1) {
        clearInterval(progressInterval);
        setLoadingProgress(100);
      }
    }, 16); // ~60fps

    let fadeOutTimer: NodeJS.Timeout;

    // Minimum loading time of 1 second
    const minTimer = setTimeout(() => {
      // Start fade out animation
      setOpacity(0);

      // Remove from DOM after fade animation completes
      fadeOutTimer = setTimeout(() => {
        setIsLoading(false);
        setIsVisible(false);
      }, 500); // 500ms for fade animation
    }, 1000); // 1 second minimum

    return () => {
      clearTimeout(minTimer);
      clearInterval(progressInterval);
      if (fadeOutTimer) clearTimeout(fadeOutTimer);
    };
  }, [pathname, excludedPaths, excludedPatterns]);

  // Reset loading state when pathname changes
  useEffect(() => {
    if (!isExcluded()) {
      setIsLoading(true);
      setShouldShow(true);
      setIsVisible(true);
      setOpacity(1);
      setLoadingProgress(0);
    }
  }, [pathname, excludedPaths, excludedPatterns]);

  if (!shouldShow || !isVisible) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-background transition-opacity duration-3000 ease-out"
      style={{
        opacity: opacity,
        zIndex: 99999,
      }}
    >
      <div className="flex flex-col items-center space-y-1">
        <Logo className="h-auto w-24 text-primary animate-pulse brightness-125 hover:brightness-150 transition-all duration-[1500ms]" />
        <div className="text-primary text-sm font-light">
          {Math.round(loadingProgress)}%
        </div>
      </div>
    </div>
  );
}

// Navigation Loader Component
interface NavigationLoaderProps {
  excludedPaths?: string[];
  excludedPatterns?: RegExp[];
  children: React.ReactNode;
}

function NavigationLoader({
  excludedPaths = [],
  excludedPatterns = [],
  children,
}: NavigationLoaderProps) {
  const [isNavigating, setIsNavigating] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Check if current path should be excluded
  const isExcluded = () => {
    if (excludedPaths.includes(pathname)) return true;
    return excludedPatterns.some((pattern) => pattern.test(pathname));
  };

  useEffect(() => {
    if (isExcluded()) return;

    setIsNavigating(true);

    const timer = setTimeout(() => {
      setIsNavigating(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [pathname, searchParams, excludedPaths, excludedPatterns]); // Added dependencies

  return <>{children}</>;
}

// Context Type
interface LoadingContextType {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  excludePage: (path: string) => void;
  includePage: (path: string) => void;
}

// Create Context
const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

// Provider Props
interface LoadingProviderProps {
  children: React.ReactNode;
  defaultExcludedPaths?: string[];
  defaultExcludedPatterns?: string[]; // Changed from RegExp[] to string[]
}

// Main Provider Component
export function LoadingProvider({
  children,
  defaultExcludedPaths = [],
  defaultExcludedPatterns = [],
}: LoadingProviderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [excludedPaths, setExcludedPaths] =
    useState<string[]>(defaultExcludedPaths);
  // Convert string patterns to RegExp objects on the client side
  const [excludedPatterns] = useState<RegExp[]>(
    defaultExcludedPatterns.map((pattern) => new RegExp(pattern))
  );

  const setLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  const excludePage = (path: string) => {
    setExcludedPaths((prev) => [...prev, path]);
  };

  const includePage = (path: string) => {
    setExcludedPaths((prev) => prev.filter((p) => p !== path));
  };

  const contextValue = {
    isLoading,
    setLoading,
    excludePage,
    includePage,
  };

  return (
    <LoadingContext.Provider value={contextValue}>
      <LoadingScreen
        excludedPaths={excludedPaths}
        excludedPatterns={excludedPatterns}
      />
      <NavigationLoader
        excludedPaths={excludedPaths}
        excludedPatterns={excludedPatterns}
      >
        {children}
      </NavigationLoader>
    </LoadingContext.Provider>
  );
}

// Custom Hook
export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
}

// Hook for pages to control their loading state
export function usePageLoading() {
  const { setLoading } = useLoading();

  useEffect(() => {
    // Page is mounted, stop loading
    setLoading(false);

    return () => {
      // Page is unmounting, start loading for next page
      setLoading(true);
    };
  }, [setLoading]);
}
