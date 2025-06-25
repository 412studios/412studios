import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex rounded-full items-center justify-center whitespace-nowrap text-sm font-normal transition-all duration-300",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-background hover:bg-primary/50 active:bg-primary/70 focus:bg-primary/70 aria-[pressed=true]:bg-primary/70",
        secondary:
          "bg-background text-primary hover:bg-opacity-50 active:bg-background/70 focus:bg-background/70 aria-[pressed=true]:bg-background/70",
        outline:
          "border text-primary bg-background/60 hover:bg-background hover:text-primary active:bg-background/80 focus:bg-background/80 aria-[pressed=true]:bg-background/80",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive/80 focus:bg-destructive/80 aria-[pressed=true]:bg-destructive/80",
        ghost:
          "transition ease-in-out hover:bg-primary/50 border-0 transition-all duration-300 ease-in-out active:bg-primary/60 focus:bg-primary/60 aria-[pressed=true]:bg-primary/60",
        link: "text-primary underline-offset-4 hover:underline active:underline focus:underline",
        nav: "p-6 rounded-lg border w-full hover:bg-primary/20 transition-all duration-300 active:bg-background/60 focus:bg-background/60 aria-[pressed=true]:bg-background/60",
      },
      size: {
        default: "px-12",
        sm: "px-4",
        lg: "px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
