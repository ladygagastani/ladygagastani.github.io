/**
 * Recorded audio. Recordings are made by the project owner in the site's recording studio and
 * saved under web/public/audio/, listed in web/public/audio/index.json ({ key: file }).
 * Nothing is synthesised: where there is no recording, no play button is shown.
 */
let manifest: Promise<Record<string, string>> | null = null;

export function loadAudioManifest(): Promise<Record<string, string>> {
  manifest ??= fetch("/audio/index.json").then((r) => (r.ok ? r.json() : {})).catch(() => ({}));
  return manifest;
}

/** Keys used for recordings. */
export const audioKey = {
  letter: (name: string) => `letter-${name}`,
  diphthong: (spelling: string) => `diphthong-${[...spelling.replace(/\s+/g, "")].map((c) => c.codePointAt(0)!.toString(16)).join("-")}`,
  word: (lemma: string) => `word-${[...lemma.normalize("NFC")].map((c) => c.codePointAt(0)!.toString(16)).join("-")}`,
};

let current: HTMLAudioElement | null = null;
export async function play(key: string) {
  const m = await loadAudioManifest();
  if (!m[key]) return false;
  current?.pause();
  current = new Audio(`/audio/${m[key]}`);
  await current.play().catch(() => undefined);
  return true;
}
