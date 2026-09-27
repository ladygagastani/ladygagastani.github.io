"use client";

import dynamic from "next/dynamic";

// The drills pick random questions, so they are drawn in the browser only.
const Practice = dynamic(() => import("./Practice"), { ssr: false, loading: () => <p className="muted">Setting the questions…</p> });
export default function PracticeClient() { return <Practice />; }
