import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

import { NextRequest, NextResponse } from "next/server";

export default async function middleware(request: NextRequest) {
  const { getPermission } = getKindeServerSession();
  const admin = await getPermission("admin");

  // Update the path check to use "/user/admin"
  if (request.nextUrl.pathname.startsWith("/user/admin")) {
    if (!admin?.isGranted) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }
  return await withAuth(request);
}

export const config = {
  matcher: ["/user/admin/:path*", "/user/:path*"],
};
