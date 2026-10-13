import { NextResponse } from "next/server";
import { db } from "@/db";
import { creations } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const items = await db.select().from(creations).where(eq(creations.id, id));
    if (items.length === 0) {
      return NextResponse.json({ error: "Creation not found" }, { status: 404 });
    }

    // Increment view count
    await db
      .update(creations)
      .set({ viewsCount: items[0].viewsCount + 1 })
      .where(eq(creations.id, id));

    return NextResponse.json({ creation: { ...items[0], viewsCount: items[0].viewsCount + 1 } });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, description, isFavorite, tags, downloadsIncrement } = body;

    const existing = await db.select().from(creations).where(eq(creations.id, id));
    if (existing.length === 0) {
      return NextResponse.json({ error: "Creation not found" }, { status: 404 });
    }

    const updates: any = { updatedAt: new Date() };
    if (typeof title === "string") updates.title = title;
    if (typeof description === "string") updates.description = description;
    if (typeof isFavorite === "boolean") updates.isFavorite = isFavorite;
    if (Array.isArray(tags)) updates.tags = tags;
    if (downloadsIncrement) updates.downloadsCount = existing[0].downloadsCount + 1;

    await db.update(creations).set(updates).where(eq(creations.id, id));
    const updated = await db.select().from(creations).where(eq(creations.id, id));

    return NextResponse.json({ success: true, creation: updated[0] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.delete(creations).where(eq(creations.id, id));
    return NextResponse.json({ success: true, message: "Creation deleted" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
