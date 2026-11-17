// Pure swipe logic (no I/O) so it can be unit-tested.
// Returns { status, body, db } ; `db` is the updated state when a write is needed.
export function applySwipe(db, profileId, action, now = new Date().toISOString()) {
  if (action !== "like" && action !== "pass") {
    return { status: 400, body: { error: "action must be 'like' or 'pass'" } };
  }
  if (typeof profileId !== "string") {
    return { status: 400, body: { error: "profileId is required" } };
  }
  const profile = db.profiles.find((p) => p.id === profileId);
  if (!profile) return { status: 404, body: { error: "Profile not found" } };

  // A profile can only be swiped once: never reappears, never double-counted.
  if (db.swipes.some((s) => s.profileId === profileId)) {
    return { status: 409, body: { error: "Already swiped", match: false } };
  }

  // Match only when BOTH sides liked: user likes now AND profile liked user earlier.
  const match = action === "like" && profile.likesMe === true;
  const next = {
    ...db,
    swipes: [...db.swipes, { profileId, action, at: now }],
    matches: match ? [...db.matches, { profileId, at: now }] : db.matches,
  };
  return { status: 200, body: { match }, db: next, profile };
}
