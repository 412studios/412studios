import * as React from "react";
import { cn } from "@/lib/utils";
export interface GradientProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Gradient = React.forwardRef<HTMLInputElement, GradientProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <div
        className={cn(
          "fixed top-0 left-0 w-full h-[100vh] z-[-10] bg-background",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Gradient.displayName = "Input";

export { Gradient };
