"use client";
/**
 * People a member has chosen not to see in the Town Hall and the Pnyx. Kept only in this browser
 * (nothing is sent, and the person is not told): their threads leave the lists, and their replies and
 * arguments fold to a line with "Show it". Managed on their member page and on the account page.
 */
import { useEffect } from "react";
import { create } from "zustand";
import { persist, createJSONStorage, type StateStorage } from "zustand/middleware";

const safe: StateStorage = {
  getItem: (k) => { try { return localStorage.getItem(k); } catch { return null; } },
  setItem: (k, v) => { try { localStorage.setItem(k, v); } catch { /* not saved */ } },
  removeItem: (k) => { try { localStorage.removeItem(k); } catch { /* ignore */ } },
};

interface HiddenPeople {
  /** member id → their display name when hidden (for the list on the account page) */
  people: Record<string, string>;
  hide: (id: string, name: string) => void;
  show: (id: string) => void;
}

export const useHiddenPeople = create<HiddenPeople>()(persist((set, get) => ({
  people: {},
  hide(id, name) { set({ people: { ...get().people, [id]: name } }); },
  show(id) { const people = { ...get().people }; delete people[id]; set({ people }); },
}), { name: "mathesis:hidden-people", storage: createJSONStorage(() => safe), partialize: (s) => ({ people: s.people }), skipHydration: true }));

/** The hidden people, read from this browser once the page is running (the first paint shows everyone). */
export function useHidden(): Record<string, string> {
  useEffect(() => { if (!useHiddenPeople.persist.hasHydrated()) void useHiddenPeople.persist.rehydrate(); }, []);
  return useHiddenPeople((s) => s.people);
}
