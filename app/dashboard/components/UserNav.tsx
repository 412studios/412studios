"use client";
import { Home, Settings, CreditCard, DoorClosed, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuContent } from "@radix-ui/react-dropdown-menu";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";

export const navItems = [
  { name: "Home", href: "/dashboard", icon: Home },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
  { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
];

export function UserNav({ name, email }: { name: string; email: string }) {
  // const pathname = usePathname();
  return (
    <a
      href="/dashboard"
      className="bg-muted hover:bg-muted-foreground flex aspect-square h-full cursor-pointer items-center justify-center rounded-full transition duration-500"
    >
      <User className="p-0.5" />
    </a>
  );
}
