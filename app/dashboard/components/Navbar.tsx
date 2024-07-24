import Link from "next/link";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

import {
  RegisterLink,
  LoginLink,
  LogoutLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import { Button } from "@/components/ui/button";
import { UserNav } from "./UserNav";

export async function Navbar() {
  const { isAuthenticated, getUser } = getKindeServerSession();
  const user = await getUser();
  return (
    <nav className="flex h-[10vh] min-h-[70px] justify-between border p-4">
      <Link href="/" className="flex items-center justify-center">
        <h1 className="text-3xl font-bold">412</h1>
      </Link>
      <div className="flex">
        {(await isAuthenticated()) ? (
          <UserNav
            name={user?.given_name as string}
            email={user?.email as string}
          />
        ) : (
          <div className="flex">
            <LoginLink>
              <Button
                variant="outline"
                className="mr-2 h-full rounded-md border px-2"
              >
                Sign in
              </Button>
            </LoginLink>
            <RegisterLink>
              <Button className="mr-2 h-full rounded-md border px-2">
                Sign up
              </Button>
            </RegisterLink>
          </div>
        )}
      </div>
    </nav>
  );
}
