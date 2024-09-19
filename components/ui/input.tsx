import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  /**
   * Renders a customizable input component with styling and forwarded ref
   * @param {object} props - The component props
   * @param {string} props.className - Additional CSS classes to apply to the input
   * @param {string} props.type - The type of the input element
   * @param {React.Ref} ref - Ref object to be forwarded to the input element
   * @returns {React.Element} A styled input element with forwarded ref and applied props
   */
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-xl border-4 border-primaary bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
