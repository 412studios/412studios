import * as React from "react";
import { cn } from "@/lib/utils";

const H2 = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <h2
      ref={ref}
      className={cn("title title-mob hl font-bold text-6xl sm:text-6xl", className)}
      {...props}
    >
      {children}
    </h2>
  )
);
H2.displayName = "H2";

const H3 = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("hl title-mob font-bold text-2xl sm:text-4xl", className)}
      {...props}
    >
      {children}
    </h3>
  )
);
H3.displayName = "H3";

const H4 = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <h3 ref={ref} className={cn("hl title-mob font-bold text-md sm:text-xl", className)} {...props}>
      {children}
    </h3>
  )
);
H4.displayName = "H4";

const Subtitle = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <p ref={ref} className={cn("hl text-md sm:text-xl font-normal", className)} {...props}>
      {children}
    </p>
  )
);
Subtitle.displayName = "Subtitle";

const Section = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <section
      ref={ref}
      className={cn("flex items-center justify-center min-h-screen", className)}
      {...props}
    >
      <div className="max-w-screen-xl p-8 w-full">
        <div className="p-4 rounded-xl">{children}</div>
      </div>
    </section>
  )
);
Section.displayName = "Section";

const Divider = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className }, ref) => <div ref={ref} className={cn("h-[1px] bg-foreground", className)} />
);
Divider.displayName = "Divider";

export { H2, H3, H4, Subtitle, Section, Divider };
