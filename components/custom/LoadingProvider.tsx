"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Logo } from "@/public/icons/logo";

// =====================
// Loading Screen Component
// =====================

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

  const isExcluded = () => {
    if (excludedPaths.includes(pathname)) return true;
    return excludedPatterns.some((pattern) => pattern.test(pathname));
  };

  useEffect(() => {
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

    const startTime = Date.now();
    const duration = 1000;

    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Easing: smoother start and end, less overshoot
      const eased = progress * progress * (3 - 2 * progress);
      setLoadingProgress(eased * 100);

      if (progress >= 1) {
        clearInterval(progressInterval);
        setLoadingProgress(100);
      }
    }, 16);

    const minTimer = setTimeout(() => {
      setOpacity(0);
      const fadeOutTimer = setTimeout(() => {
        setIsLoading(false);
        setIsVisible(false);
      }, 500); // Match fade duration
      return () => clearTimeout(fadeOutTimer);
    }, 1000);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(minTimer);
    };
  }, [pathname, excludedPaths, excludedPatterns]);

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
      className="fixed inset-0 flex items-center justify-center bg-background transition-opacity duration-500 ease-out pointer-events-none"
      style={{
        opacity: opacity,
        zIndex: 99999,
      }}
      aria-hidden="true"
    >
      <div className="flex flex-col items-center space-y-2">
        <div className="relative h-auto w-48">
          <Logo className="h-auto w-48 text-gray-300" />
          <div
            className="absolute inset-0 overflow-hidden"
            style={{
              clipPath: `inset(${100 - loadingProgress}% 0 0 0)`,
            }}
          >
            <Logo className="h-auto w-48 text-primary" />
          </div>
        </div>
      </div>
    </div>
  );
}

// =====================
// Navigation Loader Component
// =====================

interface NavigationLoaderProps {
  excludedPaths?: string[];
  excludedPatterns?: RegExp[];
  children: ReactNode;
}

function NavigationLoader({
  excludedPaths = [],
  excludedPatterns = [],
  children,
}: NavigationLoaderProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isExcluded = () => {
    if (excludedPaths.includes(pathname)) return true;
    return excludedPatterns.some((pattern) => pattern.test(pathname));
  };

  useEffect(() => {
    if (isExcluded()) return;
    // Potentially extend logic here for analytics or transitions
  }, [pathname, searchParams, excludedPaths, excludedPatterns]);

  return <>{children}</>;
}

// =====================
// Context and Provider
// =====================

interface LoadingContextType {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  excludePage: (path: string) => void;
  includePage: (path: string) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

interface LoadingProviderProps {
  children: ReactNode;
  defaultExcludedPaths?: string[];
  defaultExcludedPatterns?: string[]; // Patterns as strings
}

export function LoadingProvider({
  children,
  defaultExcludedPaths = [],
  defaultExcludedPatterns = [],
}: LoadingProviderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [excludedPaths, setExcludedPaths] =
    useState<string[]>(defaultExcludedPaths);
  const [excludedPatterns] = useState<RegExp[]>(
    defaultExcludedPatterns.map((pattern) => new RegExp(pattern))
  );

  const excludePage = (path: string) =>
    setExcludedPaths((prev) => [...prev, path]);
  const includePage = (path: string) =>
    setExcludedPaths((prev) => prev.filter((p) => p !== path));

  const contextValue: LoadingContextType = {
    isLoading,
    setLoading: setIsLoading,
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

// =====================
// Hooks
// =====================

export function useLoading() {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
}

export function usePageLoading() {
  const { setLoading } = useLoading();
  useEffect(() => {
    setLoading(false);
    return () => setLoading(true);
  }, [setLoading]);
}
