import * as React from "react";

import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  /**
   * Renders a customizable textarea component with specific styling and behavior
   * @param {Object} props - The properties passed to the component
   * @param {string} [props.className] - Additional CSS class names to apply to the textarea
   * @param {React.Ref} ref - A ref object to access the underlying textarea DOM element
   * @returns {JSX.Element} A styled textarea component with applied props and ref
   */
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        maxLength={300}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
