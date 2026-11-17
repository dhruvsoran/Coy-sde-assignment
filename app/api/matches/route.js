import { NextResponse } from "next/server";
import { readDb, publicProfile } from "@/lib/db";

export const dynamic = "force-dynamic";

// GET /matches -> mutual matches only, newest first.
export function GET() {
  const db = readDb();
  const byId = new Map(db.profiles.map((p) => [p.id, p]));
  const matches = [...db.matches]
    .sort((a, b) => b.at.localeCompare(a.at))
    .map((m) => ({ ...publicProfile(byId.get(m.profileId)), matchedAt: m.at }));
  return NextResponse.json({ matches, count: matches.length });
}
