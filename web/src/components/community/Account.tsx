"use client";
/**
 * Your account: join (display name, email, password), sign in, a forgotten password, and once
 * signed in your public profile and signing out. Reading the site never needs an account; only
 * the Town Hall and the Pnyx do, and syncing your Treasury between devices.
 */
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { isBanned, isModerator, problem, supabase, useAccount } from "@/lib/community/client";
import { updateProfile } from "@/lib/community/data";
import styles from "./Community.module.css";

type Mode = "in" | "join" | "forgot";

export default function Account() {
  const { ready, session, profile, start, refreshProfile } = useAccount();
  const params = useSearchParams();
  const router = useRouter();
  const [recovering, setRecovering] = useState(false);
  useEffect(() => { start(); }, [start]);
  useEffect(() => {
    const { data } = supabase().auth.onAuthStateChange((event) => { if (event === "PASSWORD_RECOVERY") setRecovering(true); });
    return () => data.subscription.unsubscribe();
  }, []);
  const next = params.get("next");

  if (!ready) return <div className={`wrap ${styles.status}`} aria-busy="true"><span className={styles.spinner} aria-hidden="true" /> Opening the doors…</div>;
  if (session && (recovering || params.get("reset") === "1")) return <div className={`wrap ${styles.narrow}`}><NewPassword onDone={() => { setRecovering(false); router.replace("/account"); }} /></div>;
  if (session) {
    return (
      <div className={`wrap ${styles.narrow}`}>
        {next && <p className={styles.note}>You are signed in. <Link href={next}>Go back to where you were →</Link></p>}
        {profile ? <ProfileCard key={profile.id} email={session.user.email ?? ""} onSaved={refreshProfile} /> : <p className="muted">Loading your profile…</p>}
      </div>
    );
  }
  return <div className={`wrap ${styles.narrow}`}><SignIn next={next} /></div>;
}

// ------------------------------------------------------------ signing in and joining
function SignIn({ next }: { next: string | null }) {
  const [mode, setMode] = useState<Mode>("in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState<string | null>(null);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const back = `${location.origin}/account${next ? `?next=${encodeURIComponent(next)}` : ""}`;
    setBusy(true); setError(null);
    try {
      const auth = supabase().auth;
      if (mode === "in") {
        const { error } = await auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else if (mode === "join") {
        const { error } = await auth.signUp({ email, password, options: { data: { display_name: name.trim() }, emailRedirectTo: back } });
        if (error) throw error;
        setSent(`We have sent a link to ${email}. Open it to confirm your address, and you are in.`);
      } else {
        const { error } = await auth.resetPasswordForEmail(email, { redirectTo: `${location.origin}/account?reset=1` });
        if (error) throw error;
        setSent(`If ${email} has an account, a link to choose a new password is on its way.`);
      }
    } catch (err) {
      const m = problem(err);
      setError(/Invalid login credentials/i.test(m) ? "That email and password do not match an account." :
        /Email not confirmed/i.test(m) ? "Please confirm your email address first: open the link we sent you." : m);
    } finally { setBusy(false); }
  };

  if (sent) return (
    <section className={styles.card}>
      <p className="label">Check your email</p>
      <h2>A letter is on its way</h2>
      <p>{sent}</p>
      <p className={styles.fine}>Nothing arrived after a few minutes? Look in the spam folder, or <button type="button" className={styles.linkBtn} onClick={() => setSent(null)}>try again</button>.</p>
    </section>
  );
  return (
    <section className={styles.card}>
      <div className={styles.tabs} role="tablist" aria-label="Account">
        <button type="button" role="tab" aria-selected={mode === "in"} onClick={() => { setMode("in"); setError(null); }}>Sign in</button>
        <button type="button" role="tab" aria-selected={mode === "join"} onClick={() => { setMode("join"); setError(null); }}>Join</button>
      </div>
      <form onSubmit={submit} className={styles.form}>
        {mode === "join" && (
          <label>
            <span>Display name <small>shown beside what you write; 2–40 characters</small></span>
            <input aria-label="Display name" value={name} onChange={(e) => setName(e.target.value)} required minLength={2} maxLength={40} autoComplete="nickname" />
          </label>
        )}
        <label>
          <span>Email address {mode === "join" && <small>never shown to anyone</small>}</span>
          <input type="email" aria-label="Email address" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
        </label>
        {mode !== "forgot" && (
          <label>
            <span>Password {mode === "join" && <small>at least 10 characters</small>}</span>
            <input type="password" aria-label="Password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={mode === "join" ? 10 : 1}
              autoComplete={mode === "join" ? "new-password" : "current-password"} />
          </label>
        )}
        {mode === "join" && (
          <label className={styles.check}>
            <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} required />
            <span>I will keep the <Link href="/town-hall#rules" target="_blank">rules of the Town Hall</Link>: argue the idea, not the person.</span>
          </label>
        )}
        {error && <p className={styles.error} role="alert">{error}</p>}
        <button type="submit" className="btn" disabled={busy}>
          {busy ? "One moment…" : mode === "in" ? "Sign in" : mode === "join" ? "Join" : "Send me a link"}
        </button>
        {mode === "in" && <button type="button" className={styles.linkBtn} onClick={() => { setMode("forgot"); setError(null); }}>I forgot my password</button>}
        {mode === "forgot" && <button type="button" className={styles.linkBtn} onClick={() => setMode("in")}>Back to signing in</button>}
      </form>
      <p className={styles.fine}>
        An account is needed only to write in the Town Hall and the Pnyx, and to keep your Treasury in step between devices.
        Accounts are kept by Supabase, in the European Union; see <Link href="/credits#privacy">Privacy</Link>.
      </p>
    </section>
  );
}

function NewPassword({ onDone }: { onDone: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  return (
    <section className={styles.card}>
      <p className="label">A new password</p>
      <h2>Choose a new password</h2>
      <form className={styles.form} onSubmit={async (e) => {
        e.preventDefault(); setBusy(true); setError(null);
        const { error } = await supabase().auth.updateUser({ password });
        setBusy(false);
        if (error) setError(problem(error)); else onDone();
      }}>
        <label><span>New password <small>at least 10 characters</small></span>
          <input type="password" aria-label="New password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={10} autoComplete="new-password" /></label>
        {error && <p className={styles.error} role="alert">{error}</p>}
        <button type="submit" className="btn" disabled={busy}>{busy ? "One moment…" : "Save the new password"}</button>
      </form>
    </section>
  );
}

// ------------------------------------------------------------ your profile
function ProfileCard({ email, onSaved }: { email: string; onSaved: () => Promise<void> }) {
  const profile = useAccount((s) => s.profile)!;
  const [name, setName] = useState(profile.display_name);
  const [bio, setBio] = useState(profile.bio);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const changed = name.trim() !== profile.display_name || bio !== profile.bio;
  return (
    <section className={styles.card}>
      <p className="label">{isModerator(profile) ? "Moderator of the Town Hall" : "Member of the Town Hall"}</p>
      <h2>{profile.display_name}</h2>
      <p className={styles.fine}>Signed in as {email} (never shown to anyone). Member since {new Date(profile.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}.</p>
      {isBanned(profile) && <p className={styles.error}>The moderator has paused your writing until {new Date(profile.banned_until!).toLocaleString("en-GB")}{profile.ban_reason ? `: ${profile.ban_reason}` : "."}</p>}
      <form className={styles.form} onSubmit={async (e) => {
        e.preventDefault(); setMsg(null); setError(null);
        try { await updateProfile(profile.id, { display_name: name.trim(), bio }); await onSaved(); setMsg("Saved."); }
        catch (err) { const m = problem(err); setError(/duplicate|unique/i.test(m) ? "Someone already uses that display name." : m); }
      }}>
        <label><span>Display name</span><input aria-label="Display name" value={name} onChange={(e) => setName(e.target.value)} required minLength={2} maxLength={40} /></label>
        <label><span>About you <small>optional, up to 500 characters; shown on your page</small></span>
          <textarea aria-label="About you" value={bio} onChange={(e) => setBio(e.target.value)} maxLength={500} rows={3} /></label>
        {error && <p className={styles.error} role="alert">{error}</p>}
        {msg && <p className={styles.ok} role="status">{msg}</p>}
        <div className={styles.row}>
          <button type="submit" className="btn" disabled={!changed}>Save</button>
          <Link className="btn ghost" href={`/town-hall/member?id=${profile.id}`}>Your page</Link>
          <button type="button" className="btn ghost" onClick={() => supabase().auth.signOut()}>Sign out</button>
        </div>
      </form>
      <details className={styles.danger}>
        <summary>Delete my account</summary>
        <p>This removes your account, your profile, everything you wrote in the Town Hall and the Pnyx, your votes and your stored Treasury.
          It cannot be undone. Your notes and marks in this browser stay here.</p>
        <DeleteAccount />
      </details>
    </section>
  );
}

function DeleteAccount() {
  const [typed, setTyped] = useState("");
  const [error, setError] = useState<string | null>(null);
  return (
    <form className={styles.form} onSubmit={async (e) => {
      e.preventDefault(); setError(null);
      const { error } = await supabase().rpc("delete_my_account");
      if (error) { setError(problem(error)); return; }
      await supabase().auth.signOut();
    }}>
      <label><span>Type DELETE to confirm</span><input aria-label="Type DELETE to confirm" value={typed} onChange={(e) => setTyped(e.target.value)} autoComplete="off" /></label>
      {error && <p className={styles.error} role="alert">{error}</p>}
      <button type="submit" className="btn ghost" disabled={typed !== "DELETE"}>Delete my account for ever</button>
    </form>
  );
}
