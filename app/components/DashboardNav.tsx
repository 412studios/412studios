"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "./UserNav";

export function DashboardNav() {
  const pathname = usePathname();
  console.log(pathname);
  return (
    <nav className="grid items-start gap-2">
      {navItems.map((item, index) => (
        <Link key={index} href={item.href}>
          <span
            className={cn(
              "hover:bg-accent hover:text-accent-foreground group flex items-center rounded-md px-3 py-2 text-sm font-medium",
              pathname === item.href ? "bg-accent" : "bg-transparent",
            )}
          >
            <item.icon className="text-primary mr-2 h-4 w-4" />
            <span>{item.name}</span>
          </span>
        </Link>
      ))}
    </nav>
  );
}
