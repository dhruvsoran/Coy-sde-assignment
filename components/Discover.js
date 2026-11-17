"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import SwipeCard from "./SwipeCard";
import MatchModal from "./MatchModal";
import MatchesList from "./MatchesList";

export default function Discover() {
  const [queue, setQueue] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState("swipe");
  const [matchProfile, setMatchProfile] = useState(null);
  const [toast, setToast] = useState(null);
  const topRef = useRef(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [f, m] = await Promise.all([fetch("/api/feed"), fetch("/api/matches")]);
      if (!f.ok || !m.ok) throw new Error("bad response");
      setQueue((await f.json()).profiles);
      setMatches((await m.json()).matches);
    } catch {
      setError("Couldn’t load profiles. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleSwiped(profile, action) {
    // Remove right away so the next card is instant; roll back if the save fails.
    setQueue((q) => q.filter((p) => p.id !== profile.id));
    try {
      const res = await fetch("/api/swipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileId: profile.id, action }),
      });
      if (res.status === 409) return; // already recorded; keep it gone
      if (!res.ok) throw new Error("save failed");
      const data = await res.json();
      if (data.match) {
        setMatchProfile(data.profile);
        setMatches((m) => [{ ...data.profile, matchedAt: new Date().toISOString() }, ...m]);
      }
    } catch {
      setQueue((q) => [profile, ...q]);
      setToast("Swipe didn’t save. Try again.");
      setTimeout(() => setToast(null), 2500);
    }
  }

  async function reset() {
    await fetch("/api/reset", { method: "POST" });
    load();
  }

  // Desktop keyboard: ← pass, → like
  useEffect(() => {
    function onKey(e) {
      if (view !== "swipe" || matchProfile) return;
      if (e.key === "ArrowRight") topRef.current?.swipe("like");
      if (e.key === "ArrowLeft") topRef.current?.swipe("pass");
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [view, matchProfile]);

  const visible = queue.slice(0, 3);

  return (
    <main className="discover">
      <header className="top-bar">
        <div className="seg" role="tablist">
          <button role="tab" aria-selected={view === "swipe"} className={view === "swipe" ? "on" : ""} onClick={() => setView("swipe")}>Swipe</button>
          <button role="tab" aria-selected={view === "matches"} className={view === "matches" ? "on" : ""} onClick={() => setView("matches")}>
            Matches{matches.length > 0 && <span className="count">{matches.length}</span>}
          </button>
        </div>
      </header>

      {view === "matches" ? (
        <section className="scroll"><MatchesList matches={matches} /></section>
      ) : loading ? (
        <div className="empty"><p>Loading profiles…</p></div>
      ) : error ? (
        <div className="empty">
          <h2>Something went wrong</h2>
          <p>{error}</p>
          <button className="btn primary" onClick={load}>Try again</button>
        </div>
      ) : queue.length === 0 ? (
        <div className="empty">
          <h2>You’re all caught up</h2>
          <p>No more profiles for now. Check your matches, or start over to replay the demo.</p>
          <button className="btn primary" onClick={() => setView("matches")}>View matches</button>
          <button className="btn ghost" onClick={reset}>Reset demo</button>
        </div>
      ) : (
        <>
          <div className="deck">
            {visible.map((p, i) => (
              <SwipeCard
                key={p.id}
                ref={i === 0 ? topRef : null}
                profile={p}
                depth={i}
                interactive={i === 0}
                onSwiped={(dir) => handleSwiped(p, dir)}
              />
            )).reverse()}
          </div>
          <div className="actions">
            <button className="round pass" aria-label="Pass" onClick={() => topRef.current?.swipe("pass")}>
              <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18" /></svg>
            </button>
            <span className="left">{queue.length} left</span>
            <button className="round like" aria-label="Like" onClick={() => topRef.current?.swipe("like")}>
              <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor"><path d="M12 20.5s-7.5-4.6-7.5-10.6A4.4 4.4 0 0 1 12 7a4.4 4.4 0 0 1 7.5 2.9c0 6-7.5 10.6-7.5 10.6z" /></svg>
            </button>
          </div>
        </>
      )}

      {matchProfile && (
        <MatchModal
          profile={matchProfile}
          onKeep={() => setMatchProfile(null)}
          onView={() => { setMatchProfile(null); setView("matches"); }}
        />
      )}
      {toast && <div className="toast" role="status">{toast}</div>}
    </main>
  );
}
