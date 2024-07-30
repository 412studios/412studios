import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

import { NextRequest, NextResponse } from "next/server";

export default async function middleware(request: NextRequest) {
  const { getPermission, getPermissions, getUser } = getKindeServerSession();
  const admin = await getPermission("admin");

  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (!admin?.isGranted) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }
  return await withAuth(request);
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
    "/booking/:path*",
    "/pricing/:subscription*",
  ],
};
