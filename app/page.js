"use client";
import { useState } from "react";
import Discover from "@/components/Discover";
import TabBar from "@/components/TabBar";

export default function Page() {
  const [tab, setTab] = useState("discover");
  return (
    <div className="shell">
      {/* Home is intentionally blank, per the brief. */}
      {tab === "home" ? <main className="blank" aria-label="Home" /> : <Discover />}
      <TabBar active={tab} onChange={setTab} />
    </div>
  );
}
