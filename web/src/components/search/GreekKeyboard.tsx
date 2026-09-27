"use client";
/**
 * An on-screen keyboard of Greek letters, for readers without a Greek keyboard layout.
 * Search ignores accents and breathings, so letters are all it needs.
 */
import styles from "./Search.module.css";

const ROWS = ["ς ε ρ τ υ θ ι ο π", "α σ δ φ γ η ξ κ λ", "ζ χ ψ ω β ν μ"].map((r) => r.split(" "));
const NAMES: Record<string, string> = {
  α: "alpha", β: "beta", γ: "gamma", δ: "delta", ε: "epsilon", ζ: "zeta", η: "eta", θ: "theta", ι: "iota", κ: "kappa",
  λ: "lambda", μ: "mu", ν: "nu", ξ: "xi", ο: "omicron", π: "pi", ρ: "rho", σ: "sigma", ς: "final sigma", τ: "tau",
  υ: "upsilon", φ: "phi", χ: "chi", ψ: "psi", ω: "omega",
};

export default function GreekKeyboard({ onKey }: { onKey: (k: string) => void }) {
  return (
    <div className={styles.kbd} role="group" aria-label="Greek letters">
      {ROWS.map((row, i) => (
        <div key={i} className={styles.kbdRow}>
          {row.map((k) => (
            <button key={k} type="button" lang="grc" aria-label={NAMES[k]} onMouseDown={(e) => e.preventDefault()} onClick={() => onKey(k)}>{k}</button>
          ))}
          {i === 2 && (
            <>
              <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => onKey("*")} aria-label="wildcard: any letters" title="any letters">*</button>
              <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => onKey("?")} aria-label="wildcard: one letter" title="one letter">?</button>
              <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => onKey("Backspace")} aria-label="delete">⌫</button>
            </>
          )}
        </div>
      ))}
      <div className={styles.kbdRow}>
        <button type="button" className={styles.kbdSpace} onMouseDown={(e) => e.preventDefault()} onClick={() => onKey(" ")}>space</button>
      </div>
    </div>
  );
}
