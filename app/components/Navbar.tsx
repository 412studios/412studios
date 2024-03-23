import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  RegisterLink,
  LoginLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { UserNav } from "./UserNav";
import { Logo } from "@/public/icons/logo";

export async function Navbar() {
  const { isAuthenticated, getUser } = getKindeServerSession();
  const user = await getUser();
  return (
    <nav className="bg-background flex h-[10vh] min-h-[100px] items-center border-b">
      <div className="container flex items-center justify-between">
        <Link href="/" className="" aria-label="Home">
          <Logo className="text-foreground max-h-[60px]" />
        </Link>
        <div className="flex items-center gap-x-5">
          {(await isAuthenticated()) ? (
            <UserNav name={user?.given_name as string} />
          ) : (
            <div className="flex items-center gap-x-5">
              <LoginLink>
                <Button>Book Now</Button>
              </LoginLink>
              <RegisterLink>
                <Button variant="secondary">Sign In</Button>
              </RegisterLink>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
