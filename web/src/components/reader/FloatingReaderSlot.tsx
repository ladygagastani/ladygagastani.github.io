"use client";
/**
 * Where the floating reader lives in the root layout. The reader's code (the text parser, look-up,
 * Echoes, metre…) is loaded only once a book is floated, or when one was left floating before a
 * reload, so pages that never float a book do not download it.
 */
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useFloat } from "@/lib/float";

const FloatingReader = dynamic(() => import("./FloatingReader"), { ssr: false });

export default function FloatingReaderSlot() {
  const open = useFloat((s) => s.open);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => { Promise.resolve(useFloat.persist.rehydrate()).then(() => setHydrated(true)); }, []);
  return hydrated && open ? <FloatingReader /> : null;
}
