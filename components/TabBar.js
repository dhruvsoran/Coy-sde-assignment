"use client";

const Icon = {
  home: (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 11.5 12 5l8 6.5V19a1 1 0 0 1-1 1h-4v-5h-6v5H5a1 1 0 0 1-1-1z" />
    </svg>
  ),
  discover: (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
    </svg>
  ),
};

export default function TabBar({ active, onChange }) {
  return (
    <nav className="tabbar" aria-label="Main">
      {["home", "discover"].map((id) => (
        <button key={id} className={`tab ${active === id ? "on" : ""}`} onClick={() => onChange(id)} aria-current={active === id ? "page" : undefined}>
          {Icon[id]}
          <span>{id === "home" ? "Home" : "Discover"}</span>
        </button>
      ))}
    </nav>
  );
}
