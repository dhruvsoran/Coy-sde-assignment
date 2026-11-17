import { NextResponse } from "next/server";
import { resetDb } from "@/lib/db";

export const dynamic = "force-dynamic";

// POST /api/reset -> wipes swipes/matches so the demo can be replayed.
export function POST() {
  resetDb();
  return NextResponse.json({ ok: true });
}
