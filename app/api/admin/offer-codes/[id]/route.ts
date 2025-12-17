import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const { getPermission } = getKindeServerSession();
    const admin = await getPermission("admin");

    if (!admin?.isGranted) {
      return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 403 });
    }
    const { code, description, discountType, discountValue, isActive } = await req.json();

    const existingOfferCode = await prisma.offerCode.findUnique({
      where: { id },
    });

    if (!existingOfferCode) {
      return NextResponse.json({ error: "Offer code not found" }, { status: 404 });
    }

    const updateData: any = {};

    if (code !== undefined) {
      const codeExists = await prisma.offerCode.findFirst({
        where: {
          code: code.toUpperCase(),
          NOT: { id },
        },
      });

      if (codeExists) {
        return NextResponse.json({ error: "Offer code already exists" }, { status: 409 });
      }

      updateData.code = code.toUpperCase();
    }

    if (description !== undefined) {
      updateData.description = description || null;
    }

    if (discountType !== undefined) {
      if (discountType !== "percentage" && discountType !== "fixed") {
        return NextResponse.json(
          { error: "Discount type must be either 'percentage' or 'fixed'" },
          { status: 400 }
        );
      }
      updateData.discountType = discountType;
    }

    if (discountValue !== undefined) {
      const finalDiscountType = discountType || existingOfferCode.discountType;

      if (finalDiscountType === "percentage" && (discountValue < 0 || discountValue > 100)) {
        return NextResponse.json(
          { error: "Percentage discount must be between 0 and 100" },
          { status: 400 }
        );
      }

      if (discountValue < 0) {
        return NextResponse.json({ error: "Discount value cannot be negative" }, { status: 400 });
      }

      updateData.discountValue = parseFloat(discountValue);
    }

    if (isActive !== undefined) {
      updateData.isActive = isActive;
    }

    const offerCode = await prisma.offerCode.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ offerCode });
  } catch (error) {
    console.error("Error updating offer code:", error);
    return NextResponse.json({ error: "Failed to update offer code" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const { getPermission } = getKindeServerSession();
    const admin = await getPermission("admin");

    if (!admin?.isGranted) {
      return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 403 });
    }

    const existingOfferCode = await prisma.offerCode.findUnique({
      where: { id },
    });

    if (!existingOfferCode) {
      return NextResponse.json({ error: "Offer code not found" }, { status: 404 });
    }

    await prisma.offerCode.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting offer code:", error);
    return NextResponse.json({ error: "Failed to delete offer code" }, { status: 500 });
  }
}
