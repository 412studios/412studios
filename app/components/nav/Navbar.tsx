import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import NavbarClient from "./NavbarClient";
import prisma from "@/app/lib/db";

export async function Navbar() {
  // Fetch authentication status on the server
  const { isAuthenticated, getUser } = getKindeServerSession();
  const user = await getUser();
  
  let isAdmin = false;
  if (user) {
    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    });
    isAdmin = userData?.role === "admin";
  }
  
  return <NavbarClient isAuthenticated={await isAuthenticated()} user={user} isAdmin={isAdmin} />;
}
