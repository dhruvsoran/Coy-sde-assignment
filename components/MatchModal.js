"use client";

export default function MatchModal({ profile, onKeep, onView }) {
  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-labelledby="match-title">
      <div className="match">
        <h2 id="match-title">It’s a match!</h2>
        <p>You and {profile.name} liked each other.</p>
        <div className="pair">
          <div className="avatar you">You</div>
          <img className="avatar" src={profile.photo} alt={profile.name} />
        </div>
        <button className="btn primary" onClick={onView}>See your matches</button>
        <button className="btn ghost" onClick={onKeep}>Keep swiping</button>
      </div>
    </div>
  );
}
