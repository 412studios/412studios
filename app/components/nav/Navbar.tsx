import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import NavbarClient from "./NavbarClient";

export async function Navbar() {
  // Fetch authentication status on the server
  const { isAuthenticated, getUser } = getKindeServerSession();
  const user = await getUser();
  return <NavbarClient isAuthenticated={await isAuthenticated()} user={user} />;
}
