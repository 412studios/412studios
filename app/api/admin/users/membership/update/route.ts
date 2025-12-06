import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { membershipId, availableHours } = await request.json();

    if (!membershipId || availableHours === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate availableHours is a non-negative number
    if (availableHours < 0) {
      return NextResponse.json(
        { error: "Available hours must be non-negative" },
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

    // Update membership hours
    const updatedMembership = await prisma.memberships.update({
      where: { membershipId: membershipId },
      data: {
        availableHours: availableHours,
        updtedAt: new Date(),
        updateHours: new Date()
      },
      select: {
        membershipId: true,
        status: true,
        roomId: true,
        availableHours: true,
        planId: true,
      }
    });

    return NextResponse.json({ 
      success: true, 
      membership: updatedMembership 
    });

  } catch (error) {
    console.error("Error updating membership:", error);
    return NextResponse.json(
      { error: "Failed to update membership" },
      { status: 500 }
    );
  }
}