import * as React from "react";

import { cn } from "@/lib/utils";

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
/**
 * Renders a table component with a scrollable container and custom styling
 * @param {Object} props - The component props
 * @param {string} props.className - Additional CSS classes to apply to the table
 * @param {React.Ref} ref - React ref object for the table element
 * @returns {React.ReactElement} A div containing a scrollable table with custom styling
 */
>(({ className, ...props }, ref) => (
  <div className="border-4 rounded-xl overflow-hidden">
    <div className="relative w-full overflow-scroll max-h-[60vh]">
      <table
        ref={ref}
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  /**
   * Creates a custom table header component with a sticky top position and custom styling
   * @param {Object} props - The props object
   * @param {string} [props.className] - Additional CSS class names to apply to the thead element
   * @param {React.Ref} ref - Ref object to be forwarded to the thead element
   * @returns {JSX.Element} A styled thead element with sticky positioning and custom class names
   */
  </div>
));
Table.displayName = "Table";

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn("[&_tr]:border-0 sticky top-0 bg-background", className)}
    {...props}
  />
));
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
/**
 * Renders a table body component with customizable styling
 * @param {Object} props - The component props
 * @param {string} props.className - Additional CSS classes to apply to the tbody
 * @param {React.Ref} ref - Ref object for the tbody element
 * @returns {JSX.Element} A styled tbody element
 */
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0 border-t-4", className)}
    {...props}
  /**
   * Renders a table footer component with customizable styles and properties
   * @param {Object} props - The properties passed to the component
   * @param {string} [props.className] - Additional CSS classes to apply to the footer
   * @param {React.Ref} ref - Ref object for the footer element
   * @returns {JSX.Element} A styled table footer element
   */
  />
));
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
      className,
    )}
    {...props}
  />
));
TableFooter.displayName = "TableFooter";

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
/**
 * A React component that renders a table row with customizable styling and behavior.
 * @param {Object} props - The props object containing className and other properties.
 * @param {string} [props.className] - Additional CSS class names to apply to the table row.
 * @param {React.Ref} ref - A ref object to be attached to the table row element.
 * @returns {JSX.Element} A styled table row component with forwarded ref and merged className.
 */
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b border-dashed transition-colors hover:bg-accent data-[state=selected]:bg-muted",
      className,
    )}
    {...props}
  />
));
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
/**
 * A custom table header component with configurable styling
 * @param {Object} props - The component props
 * @param {string} [props.className] - Additional CSS classes to apply to the th element
 * @param {React.Ref} ref - React ref object for the th element
 * @returns {JSX.Element} A styled table header (th) element
 */
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-12 px-4 text-left align-middle font-medium text-primary [&:has([role=checkbox])]:pr-0",
      className,
    )}
    {...props}
  /**
   * Renders a table cell component with customizable className and additional props
   * @param {Object} props - The properties passed to the component
   * @param {string} [props.className] - Additional CSS class names to apply to the td element
   * @param {React.Ref} ref - React ref object to be attached to the td element
   * @returns {JSX.Element} A td element with the specified properties and styling
   */
  />
));
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}
    {...props}
  /**
   * Renders a caption component with customizable className and additional props
   * @param {Object} props - The props object
   * @param {string} [props.className] - Additional CSS class names to apply to the caption
   * @param {React.Ref} ref - Ref object to be forwarded to the caption element
   * @returns {JSX.Element} A caption element with applied className and props
   */
  />
));
TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
));
TableCaption.displayName = "TableCaption";

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
