import { test } from "node:test";
import assert from "node:assert/strict";
import { applySwipe } from "../lib/swipe.js";
import { buildSeed } from "../lib/seed.js";

const fresh = () => buildSeed();
const liker = (db) => db.profiles.find((p) => p.likesMe);
const nonLiker = (db) => db.profiles.find((p) => !p.likesMe);

test("seed has 30+ profiles, some already liking the user", () => {
  const db = fresh();
  assert.ok(db.profiles.length >= 30);
  assert.ok(db.profiles.filter((p) => p.likesMe).length >= 5);
});

test("liking someone who liked you creates a match", () => {
  const db = fresh();
  const r = applySwipe(db, liker(db).id, "like");
  assert.equal(r.status, 200);
  assert.equal(r.body.match, true);
  assert.equal(r.db.matches.length, 1);
});

test("liking someone who has NOT liked you is not a match", () => {
  const db = fresh();
  const r = applySwipe(db, nonLiker(db).id, "like");
  assert.equal(r.body.match, false);
  assert.equal(r.db.matches.length, 0);
});

test("passing never creates a match, even on someone who liked you", () => {
  const db = fresh();
  const r = applySwipe(db, liker(db).id, "pass");
  assert.equal(r.body.match, false);
  assert.equal(r.db.matches.length, 0);
});

test("a profile can only be swiped once", () => {
  const db = fresh();
  const id = liker(db).id;
  const first = applySwipe(db, id, "pass");
  const second = applySwipe(first.db, id, "like");
  assert.equal(second.status, 409);
  assert.equal(second.db, undefined);
});

test("validates input", () => {
  const db = fresh();
  assert.equal(applySwipe(db, "p1", "superlike").status, 400);
  assert.equal(applySwipe(db, undefined, "like").status, 400);
  assert.equal(applySwipe(db, "nope", "like").status, 404);
});
