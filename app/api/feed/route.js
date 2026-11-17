import { NextResponse } from "next/server";
import { readDb, publicProfile } from "@/lib/db";

export const dynamic = "force-dynamic";

// GET /feed -> profiles the user has not swiped on yet.
export function GET() {
  const db = readDb();
  const swiped = new Set(db.swipes.map((s) => s.profileId));
  const profiles = db.profiles.filter((p) => !swiped.has(p.id)).map(publicProfile);
  return NextResponse.json({ profiles, count: profiles.length });
}
