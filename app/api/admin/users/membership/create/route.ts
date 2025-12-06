import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { userId, roomId, availableHours } = await request.json();

    if (!userId || roomId === undefined || !availableHours) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check if membership already exists for this user and room
    const existingMembership = await prisma.memberships.findFirst({
      where: {
        userId: userId,
        roomId: roomId,
        status: "active"
      }
    });

    if (existingMembership) {
      return NextResponse.json(
        { error: "Active membership already exists for this studio" },
        { status: 400 }
      );
    }

    // Create new membership
    const membershipId = require("crypto").randomBytes(16).toString("hex");
    const currentDate = new Date();
    
    const membership = await prisma.memberships.create({
      data: {
        membershipId: membershipId,
        stripeSessionId: "",
        stripeMembershipId: "",
        interval: "month",
        status: "active",
        planId: "admin_created",
        currentPeriodStart: parseInt(currentDate.toISOString().split('T')[0].replace(/-/g, '')),
        currentPeriodEnd: parseInt(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDate()).toISOString().split('T')[0].replace(/-/g, '')),
        createdAt: currentDate,
        updtedAt: currentDate,
        roomId: roomId,
        availableHours: availableHours,
        updateHours: currentDate,
        userId: userId,
        weekMax: true
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
      membership: membership 
    });

  } catch (error) {
    console.error("Error creating membership:", error);
    return NextResponse.json(
      { error: "Failed to create membership" },
      { status: 500 }
    );
  }
}