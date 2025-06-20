import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { membershipId } = await request.json();

    if (!membershipId) {
      return NextResponse.json(
        { error: "Membership ID is required" },
        { status: 400 }
      );
    }

    // Check if membership exists
    const existingMembership = await prisma.memberships.findUnique({
      where: { membershipId: membershipId }
    });

    if (!existingMembership) {
      return NextResponse.json(
        { error: "Membership not found" },
        { status: 404 }
      );
    }

    // Instead of deleting, mark membership as cancelled
    const updatedMembership = await prisma.memberships.update({
      where: { membershipId: membershipId },
      data: {
        status: "cancelled",
        updtedAt: new Date()
      }
    });

    return NextResponse.json({ 
      success: true,
      message: "Membership cancelled successfully"
    });

  } catch (error) {
    console.error("Error deleting membership:", error);
    return NextResponse.json(
      { error: "Failed to delete membership" },
      { status: 500 }
    );
  }
}