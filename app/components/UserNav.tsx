import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import Link from "next/link";

export const navItems = [{ name: "Profile", href: "/dashboard", icon: Home }];

export function UserNav({ name }: { name: string }) {
  return (
    <Link href="/dashboard">
      <Button variant="ghost" className="relative w-auto border p-6">
        Profile
      </Button>
    </Link>
  );
}
