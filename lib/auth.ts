import { NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

/**
 * Guards an API route so only authenticated admins can proceed.
 *
 * Usage at the very top of a route handler:
 *   const denied = await requireAdmin();
 *   if (denied) return denied;
 *
 * Returns a NextResponse (401/403) that the handler should return directly
 * when the caller is not an admin, or null when the caller is a verified
 * admin and the handler may continue.
 *
 * Admin is determined by the Kinde "admin" permission — the same check used
 * by proxy.ts and the offer-codes / calendar admin routes.
 */
export async function requireAdmin(): Promise<NextResponse | null> {
  const { isAuthenticated, getPermission } = getKindeServerSession();

  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = await getPermission("admin");
  if (!admin?.isGranted) {
    return NextResponse.json(
      { error: "Forbidden - admin access required" },
      { status: 403 }
    );
  }

  return null;
}
