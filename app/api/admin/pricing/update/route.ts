import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import prisma from "@/app/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    });

    if (userData?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const prices = await request.json();

    // Update each pricing record
    const updatePromises = prices.map((price: any) =>
      prisma.pricing.update({
        where: { id: price.id },
        data: {
          dayRate: price.dayRate,
          hourlyRate: price.hourlyRate,
          membershipPrice: price.membershipPrice,
          engineerPrice: price.engineerPrice,
          blocked: price.blocked,
        },
      })
    );

    await Promise.all(updatePromises);

    return NextResponse.json({ message: "Pricing updated successfully" });
  } catch (error) {
    console.error("Error updating pricing:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}