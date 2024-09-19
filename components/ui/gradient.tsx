import * as React from "react";
import { cn } from "@/lib/utils";
export interface GradientProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Gradient = React.forwardRef<HTMLInputElement, GradientProps>(
  /**
   * Renders a full-screen gradient container component
   * @param {string} className - Additional CSS classes to apply to the container
   * @param {string} type - The type of the component (unused in this implementation)
   * @param {Object} props - Additional props to spread onto the div element
   * @param {React.Ref} ref - React ref to be attached to the div element
   * @returns {React.ReactElement} A div element with applied classes and props
   */
  ({ className, type, ...props }, ref) => {
    return (
      <div
        className={cn(
          "gradients-container fixed top-0 left-0 w-full h-[100vh] z-[-10]",
          className,
        )}
        ref={ref}
        {...props}
      ></div>
    );
  },
);
Gradient.displayName = "Input";

export { Gradient };
