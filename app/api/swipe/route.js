import { NextResponse } from "next/server";
import { readDb, writeDb, publicProfile } from "@/lib/db";
import { applySwipe } from "@/lib/swipe";

export const dynamic = "force-dynamic";

// POST /swipe  { profileId, action: "like" | "pass" } -> { match: boolean, profile? }
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const result = applySwipe(readDb(), body?.profileId, body?.action);
  if (result.db) writeDb(result.db);
  const payload = { ...result.body };
  // Only a mutual match ever returns profile details beyond what the feed gave.
  if (result.body.match && result.profile) payload.profile = publicProfile(result.profile);
  return NextResponse.json(payload, { status: result.status });
}
