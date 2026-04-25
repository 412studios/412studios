"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Logo } from "@/public/icons/logo";

// =====================
// Loading Screen Component
// =====================

interface LoadingScreenProps {
  excludedPaths?: string[];
  excludedPatterns?: RegExp[];
}

function LoadingScreen({ excludedPaths = [], excludedPatterns = [] }: LoadingScreenProps) {
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
      setIsVisible(false);
      return;
    }

    setShouldShow(true);
    setIsVisible(true);
    setOpacity(1);
    setLoadingProgress(0);

    const startTime = Date.now();
    const duration = 1000;

    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
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
        setIsVisible(false);
      }, 500);
      return () => clearTimeout(fadeOutTimer);
    }, 1000);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(minTimer);
    };
  }, [pathname, excludedPaths, excludedPatterns]);

  if (!shouldShow || !isVisible) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center transition-opacity duration-500 ease-out pointer-events-none"
      style={{ opacity, zIndex: 99999, backgroundColor: "#FFD60A" }}
      aria-hidden="true"
    >
      <div className="flex flex-col items-center space-y-2">
        <div className="relative h-auto w-48">
          <Logo className="h-auto w-48 text-primary opacity-20" />
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ clipPath: `inset(${100 - loadingProgress}% 0 0 0)` }}
          >
            <Logo className="h-auto w-48 text-primary" />
          </div>
        </div>
      </div>
    </div>
  );
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
  defaultExcludedPatterns?: string[];
}

export function LoadingProvider({
  children,
  defaultExcludedPaths = [],
  defaultExcludedPatterns = [],
}: LoadingProviderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [excludedPaths, setExcludedPaths] = useState<string[]>(defaultExcludedPaths);
  const [excludedPatterns] = useState<RegExp[]>(
    defaultExcludedPatterns.map((pattern) => new RegExp(pattern))
  );

  const excludePage = (path: string) => setExcludedPaths((prev) => [...prev, path]);
  const includePage = (path: string) => setExcludedPaths((prev) => prev.filter((p) => p !== path));

  return (
    <LoadingContext.Provider
      value={{ isLoading, setLoading: setIsLoading, excludePage, includePage }}
    >
      <LoadingScreen excludedPaths={excludedPaths} excludedPatterns={excludedPatterns} />
      {children}
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
