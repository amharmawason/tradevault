import { NextResponse } from "next/server";
import { db } from "@/db";
import { templates } from "@/db/schema";
import { seedDatabase } from "@/db/seed";

export async function GET() {
  try {
    let list = await db.select().from(templates);
    if (list.length === 0) {
      await seedDatabase();
      list = await db.select().from(templates);
    }
    return NextResponse.json({ templates: list });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
