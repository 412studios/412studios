"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
```
/**
 * Renders a custom checkbox component using CheckboxPrimitive.Root
 * @param {Object} props - The properties passed to the component
 * @param {string} [props.className] - Additional CSS class names for styling
 * @param {React.Ref} ref - Ref object for the checkbox
 * @returns {JSX.Element} A styled checkbox component with an indicator
 */

```>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    aria-label="check engineer"
    className={cn(
      "peer h-4 w-4 shrink-0 rounded-lg border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-background",
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
    >
      <Check className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
