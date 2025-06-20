import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/db";

export async function POST(request: NextRequest) {
  try {
    const {
      userId,
      name,
      email,
      role,
      phone,
      userBio,
      socialLinks,
      categories,
      verifyFormSubmitted,
      isUserVerified,
      acceptedTerms,
    } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate role
    const validRoles = ["user", "admin"];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: "Invalid role" },
        { status: 400 }
      );
    }

    // Check if email is already taken by another user
    const existingUser = await prisma.user.findFirst({
      where: {
        email: email,
        id: {
          not: userId
        }
      }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email is already taken by another user" },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: userId
      },
      data: {
        name: name || null,
        email: email,
        role: role,
        phone: phone || null,
        userBio: userBio || null,
        socialLinks: socialLinks || null,
        categories: categories || null,
        verifyFormSubmitted: verifyFormSubmitted,
        isUserVerified: isUserVerified,
        acceptedTerms: acceptedTerms,
      },
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
      }
    });

    return NextResponse.json({ 
      success: true, 
      user: updatedUser 
    });

  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}