"use client";

export default function MatchesList({ matches }) {
  if (!matches.length) {
    return (
      <div className="empty">
        <h2>No matches yet</h2>
        <p>A match shows up here only when you and someone else both like each other.</p>
      </div>
    );
  }
  return (
    <ul className="grid">
      {matches.map((m) => (
        <li key={m.id} className="tile">
          <img src={m.photo} alt="" />
          <div className="tile-info">
            <strong>{m.name}, {m.age}</strong>
            <span>{m.city}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}
