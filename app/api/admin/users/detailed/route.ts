import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/db";

export async function GET(request: NextRequest) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        stripeCustomerId: true,
        verifyFormSubmitted: true,
        isUserVerified: true,
        userBio: true,
        acceptedTerms: true,
        phone: true,
        socialLinks: true,
        categories: true,
      },
      orderBy: {
        name: 'asc'
      }
    });

    return NextResponse.json(users);

  } catch (error) {
    console.error("Error fetching detailed users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}