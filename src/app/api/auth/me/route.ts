import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { seedDatabase } from "@/db/seed";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const requestedUserId = searchParams.get("userId");

    // Ensure database has seeds
    let allUsers = await db.select().from(users);
    if (allUsers.length === 0) {
      await seedDatabase();
      allUsers = await db.select().from(users);
    }

    const currentUser = requestedUserId
      ? allUsers.find((u) => u.id === requestedUserId) || allUsers[0]
      : allUsers[0];

    return NextResponse.json({
      currentUser,
      allUsers,
      featherStatus: {
        isUnlocked: true,
        tier: "SUPREME_UNLIMITED",
        badge: "Feather Sovereign v5.0",
        remainingCompute: "∞ (UNLIMITED VIP)",
        features: [
          "4K 60fps Video Synthesis",
          "Lossless Stems Audio Studio",
          "Autonomous 5-Tier Deep Research",
          "Playable Canvas Game Compiler",
          "Full-Stack Web & Mobile App Sandbox",
          "Any File Parser (.xlsx, .pdf, .docx, .mp4, .png)",
          "Zero Latency Amhar Turbo Engine",
        ],
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { userId, name, email, apiKey, settings } = body;

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const updateFields: any = { updatedAt: new Date() };
    if (name) updateFields.name = name;
    if (email) updateFields.email = email;
    if (apiKey) updateFields.apiKey = apiKey;
    if (settings) updateFields.settings = settings;

    await db.update(users).set(updateFields).where(eq(users.id, userId));

    const updatedUser = await db.select().from(users).where(eq(users.id, userId));
    return NextResponse.json({ success: true, user: updatedUser[0] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
