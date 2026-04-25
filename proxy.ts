import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export default async function proxy(request: NextRequest) {
  const { getPermission } = getKindeServerSession();

  // Handle admin routes
  if (request.nextUrl.pathname.startsWith("/user/admin")) {
    const admin = await getPermission("admin");
    if (!admin?.isGranted) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Only apply auth to user routes, not the home page
  if (request.nextUrl.pathname.startsWith("/user")) {
    return await withAuth(request);
  }

  // Add pathname header for layout to use
  const response = NextResponse.next();
  response.headers.set("x-pathname", request.nextUrl.pathname);
  return response;
}

export const config = {
  matcher: ["/user/:path*"],
};
