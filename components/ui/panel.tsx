import * as React from "react";
import { cn } from "@/lib/utils";

const Panel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex-col overflow-hidden border-4 rounded-xl", className)}
    {...props}
  />
));
Panel.displayName = "Card";

export { Panel };
