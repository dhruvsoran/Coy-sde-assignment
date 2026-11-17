# Coy · Discover tab

A swipe-based **Discover** tab built as a standalone Next.js app. The tab bar has a blank **Home** tab and a **Discover** tab that holds all the functionality.

## Run it

```bash
npm install
npm run dev     # http://localhost:3000 (use mobile view for drag gestures)
npm test        # unit tests for the matching logic
```

`data/db.json` is created and seeded automatically on first request. Use **Reset demo** on the empty screen (or `POST /api/reset`) to replay the demo.

## Features

- 36 seeded profiles (name, age, photo, bio, college/city, interests); 9 have already liked you.
- Swipe right = like, left = pass: drag on touch/mouse, buttons and ←/→ keys on desktop. Cards tilt, show LIKE/PASS stamps and fly off.
- A swiped profile never reappears (swipes are saved server-side and `/feed` excludes them).
- Match only when both sides liked: "It's a match!" screen, plus a Matches view.
- Empty state when the deck runs out.

## API

| Endpoint | Description |
| --- | --- |
| `GET /feed` | Profiles not yet swiped on |
| `POST /swipe` `{ profileId, action: "like" or "pass" }` | Records the swipe, returns `{ match, profile? }`. 400 bad input, 404 unknown profile, 409 already swiped |
| `GET /matches` | Mutual matches, newest first |
| `POST /api/reset` | Demo helper |

`/feed`, `/swipe`, `/matches` are rewrites of `/api/*`.

## Privacy promise (never reveal who liked you)

- `likesMe` exists only in the server DB. Every profile leaves the server through `publicProfile()` (`lib/db.js`), which strips it.
- `/feed` looks identical for everyone, so admirers can't be picked out.
- `/swipe` reveals a match only after you like them back; a pass reveals nothing.

## Design notes

- Swipe rules are a pure function (`lib/swipe.js`), unit-tested in `tests/`.
- Atomic JSON writes (temp file + rename); swipes are idempotent (409 on repeats).
- Optimistic UI with rollback + toast if a save fails.
- Placeholder photos are generated SVGs (`/api/photo/[id]`), no external hosts.

## Limits / next steps

Single hard-coded user as specified. For production: per-user swipes with a unique `(userId, profileId)` constraint, a real database (serverless disks are ephemeral), rate limiting, undo, and chat from the Matches view.
