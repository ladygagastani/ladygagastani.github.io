"use client";

import { useEffect, useRef } from "react";
import { useSettings, LIMITS, applySettings, type ThemePref, type MotionPref } from "@/lib/settings";
import { useUI } from "@/lib/ui";
import { useAcademy } from "@/lib/academy";
import { useDragToClose } from "@/lib/use-drag-close";
import OfflineActions from "./OfflineActions";
import styles from "./SettingsPanel.module.css";

const THEMES: [ThemePref, string][] = [["auto", "Automatic"], ["light", "Papyrus (light)"], ["dark", "Black-figure (dark)"]];
const MOTIONS: [MotionPref, string][] = [["auto", "Automatic"], ["reduce", "Reduced"], ["full", "Full"]];

/**
 * Loads saved settings after hydration (so server and client first render match) and applies
 * every later change to the page. The boot script in <head> has already applied the saved
 * values before first paint, so nothing flashes.
 */
export function SettingsApplier() {
  useEffect(() => {
    const unsubscribe = useSettings.subscribe((s) => applySettings(s));
    useSettings.persist.rehydrate();
    useAcademy.persist.rehydrate();
    return unsubscribe;
  }, []);
  return null;
}

function Segmented<T extends string>({ label, value, options, onChange }:
  { label: string; value: T; options: [T, string][]; onChange: (v: T) => void }) {
  return (
    <div className={styles.seg} role="radiogroup" aria-label={label}>
      {options.map(([v, text]) => (
        <button key={v} type="button" role="radio" aria-checked={value === v} onClick={() => onChange(v)}>{text}</button>
      ))}
    </div>
  );
}

function Stepper({ label, value, display, onChange, step, min, max }:
  { label: string; value: number; display: string; onChange: (v: number) => void; step: number; min: number; max: number }) {
  return (
    <div className={styles.stepper}>
      <button type="button" onClick={() => onChange(value - step)} disabled={value <= min} aria-label={`Decrease ${label}`}>−</button>
      <output aria-live="polite">{display}</output>
      <button type="button" onClick={() => onChange(value + step)} disabled={value >= max} aria-label={`Increase ${label}`}>+</button>
    </div>
  );
}

export default function SettingsPanel() {
  const open = useUI((s) => s.settingsOpen);
  const close = useUI((s) => s.closeSettings);
  const s = useSettings();
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) { reset(); d.showModal(); }
    if (!open && d.open) d.close();
    // reset is the same function every time in effect
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Phones: the sheet follows a finger dragging its top edge down, and goes away if let go far enough down.
  const { handlers: dragProps, reset } = useDragToClose({
    el: () => ref.current, onClose: close, direction: "down", draggingClass: styles.dragging,
    when: () => matchMedia("(max-width: 760px)").matches,
  });

  return (
    <dialog
      ref={ref}
      className={styles.sheet}
      aria-labelledby="settings-title"
      onClose={close}
      onClick={(e) => { if (e.target === ref.current) close(); }}
    >
      <div className={styles.handle} aria-hidden="true" {...dragProps} />
      <div className={styles.inner}>
        <div className={styles.head} {...dragProps}>
          <h2 id="settings-title">Settings</h2>
          <button type="button" className={styles.x} onClick={close} aria-label="Close settings">×</button>
        </div>

        <section className={styles.group}>
          <h3 className="label">Appearance</h3>
          <Segmented label="Theme" value={s.theme} options={THEMES} onChange={(theme) => s.set({ theme })} />
        </section>

        <section className={styles.group}>
          <h3 className="label">Reading</h3>
          <p className={styles.sample} lang="grc" style={{ fontSize: `${s.greekSize}rem`, lineHeight: s.leading }}>
            μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος<br />οὐλομένην, ἣ μυρίʼ Ἀχαιοῖς ἄλγεʼ ἔθηκε
          </p>
          <div className={styles.row}>
            <span>Greek text size</span>
            <Stepper label="Greek text size" value={s.greekSize} display={`${Math.round(s.greekSize * 16)} px`}
              onChange={(greekSize) => s.set({ greekSize })} {...LIMITS.greekSize} />
          </div>
          <div className={styles.row}>
            <span>Line spacing</span>
            <Stepper label="line spacing" value={s.leading} display={s.leading.toFixed(1)}
              onChange={(leading) => s.set({ leading: Math.round(leading * 10) / 10 })} {...LIMITS.leading} />
          </div>
        </section>

        <section className={styles.group}>
          <h3 className="label">Animation</h3>
          <Segmented label="Animation" value={s.motion} options={MOTIONS} onChange={(motion) => s.set({ motion })} />
          <p className={styles.hint}>Automatic follows your device&apos;s &ldquo;reduce motion&rdquo; setting.</p>
        </section>

        <section className={styles.group}>
          <h3 className="label">Offline reading</h3>
          <p className={styles.hint}>Keep a copy of the text collections on this computer and read without a connection.</p>
          {/* only while open: it works out download sizes from the whole catalogue (1.3 MB), which no page should pay for unasked */}
          {open && <OfflineActions compact />}
        </section>

        <button type="button" className={styles.reset} onClick={s.reset}>
          Restore default settings
        </button>
      </div>
    </dialog>
  );
}
