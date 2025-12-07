import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();

    if (!code) {
      return NextResponse.json(
        { error: "Offer code is required" },
        { status: 400 }
      );
    }

    const offerCode = await prisma.offerCode.findUnique({
      where: {
        code: code.toUpperCase(),
      },
    });

    if (!offerCode) {
      return NextResponse.json(
        { error: "Invalid offer code" },
        { status: 404 }
      );
    }

    if (!offerCode.isActive) {
      return NextResponse.json(
        { error: "This offer code is no longer active" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      offerCode: {
        id: offerCode.id,
        code: offerCode.code,
        discountType: offerCode.discountType,
        discountValue: offerCode.discountValue,
        description: offerCode.description,
      },
    });
  } catch (error) {
    console.error("Error validating offer code:", error);
    return NextResponse.json(
      { error: "Failed to validate offer code" },
      { status: 500 }
    );
  }
}
