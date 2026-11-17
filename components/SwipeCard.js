"use client";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";

const THRESHOLD = 110; // px of horizontal drag that commits a swipe
const EXIT_MS = 280;

const SwipeCard = forwardRef(function SwipeCard({ profile, onSwiped, interactive = true, depth = 0 }, ref) {
  const [dx, setDx] = useState(0);
  const [dy, setDy] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [exit, setExit] = useState(null); // "like" | "pass" | null
  const start = useRef(null);
  const locked = useRef(false);

  function fly(dir) {
    if (locked.current) return;
    locked.current = true;
    setExit(dir);
    setTimeout(() => onSwiped(dir), EXIT_MS);
  }
  useImperativeHandle(ref, () => ({ swipe: fly }));

  function down(e) {
    if (!interactive || locked.current) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    start.current = { x: e.clientX, y: e.clientY };
    setDragging(true);
  }
  function move(e) {
    if (!start.current) return;
    setDx(e.clientX - start.current.x);
    setDy((e.clientY - start.current.y) * 0.35);
  }
  function up() {
    if (!start.current) return;
    start.current = null;
    setDragging(false);
    if (Math.abs(dx) > THRESHOLD) fly(dx > 0 ? "like" : "pass");
    else { setDx(0); setDy(0); }
  }

  let transform, transition;
  if (exit) {
    const sign = exit === "like" ? 1 : -1;
    transform = `translate(${sign * 130}%, ${dy - 30}px) rotate(${sign * 24}deg)`;
    transition = `transform ${EXIT_MS}ms cubic-bezier(.3,.7,.4,1), opacity ${EXIT_MS}ms`;
  } else if (!interactive) {
    transform = `scale(${1 - depth * 0.05}) translateY(${depth * 14}px)`;
    transition = "transform .3s ease";
  } else {
    transform = `translate(${dx}px, ${dy}px) rotate(${dx / 18}deg)`;
    transition = dragging ? "none" : "transform .25s ease";
  }

  const likeOpacity = exit === "like" ? 1 : Math.max(0, Math.min(dx / THRESHOLD, 1));
  const passOpacity = exit === "pass" ? 1 : Math.max(0, Math.min(-dx / THRESHOLD, 1));

  return (
    <article
      className={`card ${interactive ? "top" : "behind"}`}
      style={{ transform, transition, opacity: exit ? 0 : 1, zIndex: 10 - depth }}
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={up}
      aria-label={`${profile.name}, ${profile.age}`}
    >
      <img className="photo" src={profile.photo} alt="" draggable={false} />
      <div className="shade" />
      <span className="stamp like" style={{ opacity: likeOpacity }}>Like</span>
      <span className="stamp pass" style={{ opacity: passOpacity }}>Pass</span>
      <div className="info">
        <h2>{profile.name}<span className="age">{profile.age}</span></h2>
        <p className="city">{profile.city}</p>
        <p className="bio">{profile.bio}</p>
        <ul className="chips">
          {profile.interests.map((i) => <li key={i}>{i}</li>)}
        </ul>
      </div>
    </article>
  );
});

export default SwipeCard;
