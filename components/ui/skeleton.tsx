import { cn } from "@/lib/utils"

/**
 * Renders a skeleton loading component with a pulsing animation.
 * @param {React.HTMLAttributes<HTMLDivElement>} props - The props to be spread on the div element, including className and any other HTML attributes.
 * @returns {JSX.Element} A div element with animated pulse effect and rounded corners.
 */
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

export { Skeleton }
