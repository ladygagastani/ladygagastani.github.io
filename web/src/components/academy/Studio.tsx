"use client";

import { useEffect, useRef, useState } from "react";
import { LETTERS, DIPHTHONGS, ALLEN } from "@/data/alphabet";
import { coreWords } from "@/lib/lookup/core";
import { audioKey } from "@/lib/audio";
import { transliterate } from "@/lib/translit";
import styles from "./Academy.module.css";

interface Item { key: string; say: string; guide: string; group: string }

/**
 * The recording studio: record the site's audio in reconstructed Classical Attic and save each file,
 * correctly named, into web/public/audio/, updating index.json. For use on the project computer.
 */
export default function Studio() {
  const [items, setItems] = useState<Item[]>([]);
  const [folder, setFolder] = useState<FileSystemDirectoryHandle | null>(null);
  const [index, setIndex] = useState<Record<string, string>>({});
  const [recording, setRecording] = useState<string | null>(null);
  const [takes, setTakes] = useState<Record<string, { blob: Blob; url: string }>>({});
  const [message, setMessage] = useState("");
  const rec = useRef<MediaRecorder | null>(null);

  useEffect(() => {
    const letters: Item[] = LETTERS.map((L) => ({
      key: audioKey.letter(L.name), group: "Letters (say the Classical name)",
      say: L.classicalName ?? L.greekName,
      guide: `${L.name}: its sound is [${L.sounds.attic.ipa}]. Say the name as Athenians did: ${transliterate(L.classicalName ?? L.greekName)}.`,
    }));
    const diph: Item[] = DIPHTHONGS.map((d) => ({
      key: audioKey.diphthong(d.spelling), group: "Vowel pairs (say the sound alone)",
      say: d.spelling, guide: `[${d.sounds.attic.ipa}]: ${d.sounds.attic.say}.`,
    }));
    coreWords().then((ws) => setItems([...letters, ...diph, ...ws.slice(0, 100).map((w) => ({
      key: audioKey.word(w.lemma), group: "The 100 commonest words (dictionary form)",
      say: w.lemma, guide: `${transliterate(w.lemma)}: "${w.entry.def}". Raise the pitch on the accented syllable; on a circumflex, rise then fall.`,
    }))]));
  }, []);

  async function chooseFolder() {
    try {
      const h = await window.showDirectoryPicker!({ id: "mathesis-audio", mode: "readwrite" });
      setFolder(h);
      try { setIndex(JSON.parse(await (await (await h.getFileHandle("index.json")).getFile()).text())); }
      catch { setIndex({}); }
      setMessage(`Saving into "${h.name}". Choose web/public/audio inside the project folder.`);
    } catch { /* cancelled */ }
  }

  async function record(key: string) {
    if (recording) { rec.current?.stop(); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: true } });
      const r = new MediaRecorder(stream, { mimeType: "audio/webm;codecs=opus" });
      const chunks: Blob[] = [];
      r.ondataavailable = (e) => chunks.push(e.data);
      r.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunks, { type: "audio/webm" });
        setTakes((t) => ({ ...t, [key]: { blob, url: URL.createObjectURL(blob) } }));
        setRecording(null);
      };
      rec.current = r;
      r.start();
      setRecording(key);
    } catch (e) { setMessage(`The microphone could not be used (${(e as Error).message}).`); }
  }

  async function save(key: string) {
    const t = takes[key];
    if (!t || !folder) return;
    const name = `${key}.webm`;
    const w = await (await folder.getFileHandle(name, { create: true })).createWritable();
    await w.write(t.blob); await w.close();
    const next = { ...index, [key]: name };
    const iw = await (await folder.getFileHandle("index.json", { create: true })).createWritable();
    await iw.write(JSON.stringify(next, null, 1)); await iw.close();
    setIndex(next);
    setMessage(`Saved ${name}.`);
  }

  const groups = [...new Set(items.map((i) => i.group))];
  const done = items.filter((i) => index[i.key]).length;

  return (
    <div className={styles.studio}>
      <div className={styles.studioHead}>
        <p>Record each item in <b>reconstructed Classical Attic</b> (guide: {ALLEN}). Record, listen, and save when you are happy. {done} of {items.length} recorded.</p>
        <button type="button" className="btn" onClick={chooseFolder}>{folder ? `Saving into "${folder.name}"` : "Choose the audio folder"}</button>
        {message && <p className={styles.small} role="status">{message}</p>}
      </div>
      {groups.map((g) => (
        <section key={g} className={styles.studioGroup}>
          <h2>{g}</h2>
          <ul>
            {items.filter((i) => i.group === g).map((i) => (
              <li key={i.key} className={index[i.key] ? styles.recorded : undefined}>
                <span lang="grc" className={styles.studioSay}>{i.say}</span>
                <span className={styles.studioGuide}>{i.guide}</span>
                <span className={styles.studioActs}>
                  <button type="button" className="chip" onClick={() => record(i.key)} disabled={!!recording && recording !== i.key}>{recording === i.key ? "Stop" : "Record"}</button>
                  {takes[i.key] && <audio src={takes[i.key].url} controls preload="none" />}
                  {takes[i.key] && <button type="button" className="chip" disabled={!folder} onClick={() => save(i.key)}>Save</button>}
                  {index[i.key] && <span className={styles.inDeck}>saved</span>}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
