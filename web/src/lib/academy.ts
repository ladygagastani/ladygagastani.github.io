/**
 * The learner's progress in the Academy: lessons completed, days active (for streaks) and the
 * review deck. Cards are scheduled with FSRS (ts-fsrs, MIT), a modern spaced-repetition algorithm.
 * Kept in this browser (localStorage); syncing across devices comes with accounts (Phase 8).
 */
import { create } from "zustand";
import { persist, createJSONStorage, type StateStorage } from "zustand/middleware";
import { createEmptyCard, fsrs, Rating, State, TypeConvert, type Card, type Grade } from "ts-fsrs";

export { Rating, State };
export type Source = "core" | "saved" | "lesson";
export interface DeckCard { id: string; lemma: string; gloss: string; source: Source; added: number; card: Card }

const scheduler = fsrs({ enable_fuzz: true });
const today = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const safe: StateStorage = {
  getItem: (k) => { try { return localStorage.getItem(k); } catch { return null; } },
  setItem: (k, v) => { try { localStorage.setItem(k, v); } catch { /* ignore */ } },
  removeItem: (k) => { try { localStorage.removeItem(k); } catch { /* ignore */ } },
};

interface AcademyState {
  completed: Record<string, number>;
  days: string[];
  deck: Record<string, DeckCard>;
  completeLesson: (id: string) => void;
  addCard: (lemma: string, gloss: string, source: Source) => boolean;
  review: (id: string, grade: Grade) => void;
  removeCard: (id: string) => void;
}

export const useAcademy = create<AcademyState>()(
  persist(
    (set, get) => ({
      completed: {},
      days: [],
      deck: {},
      completeLesson: (id) => set((s) => ({ completed: { ...s.completed, [id]: s.completed[id] ?? Date.now() }, days: markToday(s.days) })),
      addCard: (lemma, gloss, source) => {
        const id = lemma.normalize("NFC");
        if (get().deck[id]) return false;
        set((s) => ({ deck: { ...s.deck, [id]: { id, lemma: id, gloss, source, added: Date.now(), card: createEmptyCard(new Date()) } } }));
        return true;
      },
      review: (id, grade) => set((s) => {
        const c = s.deck[id];
        if (!c) return s;
        const { card } = scheduler.next(TypeConvert.card(c.card), new Date(), grade);
        return { deck: { ...s.deck, [id]: { ...c, card } }, days: markToday(s.days) };
      }),
      removeCard: (id) => set((s) => { const deck = { ...s.deck }; delete deck[id]; return { deck }; }),
    }),
    { name: "mathesis:academy", storage: createJSONStorage(() => safe), skipHydration: true },
  ),
);

function markToday(days: string[]) {
  const t = today();
  return days.includes(t) ? days : [...days, t].slice(-400);
}

/** Cards due now (dates come back from storage as strings, so convert). */
export function dueCards(deck: Record<string, DeckCard>, now = new Date()): DeckCard[] {
  return Object.values(deck)
    .map((c) => ({ ...c, card: TypeConvert.card(c.card) }))
    .filter((c) => c.card.due.getTime() <= now.getTime())
    .sort((a, b) => a.card.due.getTime() - b.card.due.getTime());
}

/** Human-readable intervals for each answer, e.g. { again: "1 min", good: "10 min" }. */
export function previewIntervals(c: DeckCard, now = new Date()): Record<"again" | "hard" | "good" | "easy", string> {
  const p = scheduler.repeat(TypeConvert.card(c.card), now);
  const fmt = (d: Date) => {
    const m = Math.max(1, Math.round((d.getTime() - now.getTime()) / 60000));
    if (m < 60) return `${m} min`;
    const h = Math.round(m / 60);
    if (h < 24) return `${h} h`;
    const days = Math.round(h / 24);
    return days < 31 ? `${days} d` : days < 365 ? `${Math.round(days / 30)} mo` : `${(days / 365).toFixed(1)} y`;
  };
  return { again: fmt(p[Rating.Again].card.due), hard: fmt(p[Rating.Hard].card.due), good: fmt(p[Rating.Good].card.due), easy: fmt(p[Rating.Easy].card.due) };
}

/** Days in a row, ending today or yesterday. */
export function streak(days: string[]): number {
  const set = new Set(days);
  const d = new Date();
  if (!set.has(today(d))) d.setDate(d.getDate() - 1);
  let n = 0;
  while (set.has(today(d))) { n++; d.setDate(d.getDate() - 1); }
  return n;
}

/** Words the learner knows well enough to count as read: reviewed successfully at least once. */
export const knownLemmas = (deck: Record<string, DeckCard>) =>
  new Set(Object.values(deck).filter((c) => TypeConvert.card(c.card).state === State.Review).map((c) => c.lemma));
