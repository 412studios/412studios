import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function GET(req: NextRequest) {
  try {
    const { getPermission } = getKindeServerSession();
    const admin = await getPermission("admin");

    if (!admin?.isGranted) {
      return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 403 });
    }

    const offerCodes = await prisma.offerCode.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        _count: {
          select: {
            bookings: true,
          },
        },
      },
    });

    return NextResponse.json({ offerCodes });
  } catch (error) {
    console.error("Error fetching offer codes:", error);
    return NextResponse.json({ error: "Failed to fetch offer codes" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { getPermission } = getKindeServerSession();
    const admin = await getPermission("admin");

    if (!admin?.isGranted) {
      return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 403 });
    }

    const { code, description, discountType, discountValue, isActive } = await req.json();

    if (!code || !discountType || discountValue === undefined) {
      return NextResponse.json(
        { error: "Code, discount type, and discount value are required" },
        { status: 400 }
      );
    }

    if (discountType !== "percentage" && discountType !== "fixed") {
      return NextResponse.json(
        { error: "Discount type must be either 'percentage' or 'fixed'" },
        { status: 400 }
      );
    }

    if (discountType === "percentage" && (discountValue < 0 || discountValue > 100)) {
      return NextResponse.json(
        { error: "Percentage discount must be between 0 and 100" },
        { status: 400 }
      );
    }

    if (discountValue < 0) {
      return NextResponse.json({ error: "Discount value cannot be negative" }, { status: 400 });
    }

    const existingCode = await prisma.offerCode.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (existingCode) {
      return NextResponse.json({ error: "Offer code already exists" }, { status: 409 });
    }

    const offerCode = await prisma.offerCode.create({
      data: {
        code: code.toUpperCase(),
        description: description || null,
        discountType,
        discountValue: parseFloat(discountValue),
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return NextResponse.json({ offerCode }, { status: 201 });
  } catch (error) {
    console.error("Error creating offer code:", error);
    return NextResponse.json({ error: "Failed to create offer code" }, { status: 500 });
  }
}
