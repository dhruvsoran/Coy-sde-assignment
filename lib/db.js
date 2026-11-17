import fs from "fs";
import path from "path";
import os from "os";
import { buildSeed } from "./seed";

// Persistence: a single JSON file. Writes are atomic (write temp + rename) and
// all access is synchronous, so concurrent requests can't interleave a
// read-modify-write inside one Node process.
// If the project dir is read-only (e.g. serverless), fall back to the OS tmp dir.
const PRIMARY = path.join(process.cwd(), "data", "db.json");
const FALLBACK = path.join(os.tmpdir(), "coy-discover-db.json");
let resolved = null;

function dbFile() {
  if (resolved) return resolved;
  try {
    fs.mkdirSync(path.dirname(PRIMARY), { recursive: true });
    fs.accessSync(path.dirname(PRIMARY), fs.constants.W_OK);
    resolved = PRIMARY;
  } catch {
    resolved = FALLBACK;
  }
  return resolved;
}

export function writeDb(db) {
  const file = dbFile();
  const tmp = `${file}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(db, null, 2));
  fs.renameSync(tmp, file);
}

export function readDb() {
  const file = dbFile();
  if (!fs.existsSync(file)) {
    const seeded = buildSeed();
    writeDb(seeded);
    return seeded;
  }
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

export function resetDb() {
  const seeded = buildSeed();
  writeDb(seeded);
  return seeded;
}

// PRIVACY: the one place `likesMe` is removed. Every profile that leaves the
// server goes through this, so the client can never learn who liked the user.
export function publicProfile(profile) {
  const { likesMe, ...safe } = profile; // eslint-disable-line no-unused-vars
  return safe;
}
