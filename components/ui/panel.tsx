import * as React from "react";
import { cn } from "@/lib/utils";

const Panel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
/**
 * Creates a customizable div element with specific styling
 * @param {Object} props - The component props
 * @param {string} [props.className] - Additional CSS classes to apply to the div
 * @param {React.Ref} ref - React ref object to be attached to the div
 * @returns {React.JSX.Element} A styled div element with applied props and ref
 */
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex-col overflow-hidden border-4 rounded-xl", className)}
    {...props}
  />
));
Panel.displayName = "Card";

export { Panel };
