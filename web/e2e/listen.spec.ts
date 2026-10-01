import { test, expect, type Page } from "@playwright/test";

// Listen: the English translation read aloud. The device's voice is replaced by a stand-in that "speaks" each
// piece of text at once, word by word, so the test runs the same everywhere. Needs a connection (texts from GitHub).
test.describe.configure({ timeout: 60_000 });

async function fakeVoice(page: Page) {
  await page.addInitScript(() => {
    const w = window as unknown as { __spoken: string[]; __words: number };
    w.__spoken = []; w.__words = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    class Utterance { text: string; voice: unknown = null; lang = ""; rate = 1;
      onboundary: ((e: { name: string; charIndex: number }) => void) | null = null;
      onend: (() => void) | null = null; onerror: ((e: { error: string }) => void) | null = null;
      constructor(t: string) { this.text = t; } }
    const synth = {
      getVoices: () => [{ name: "Test English", lang: "en-GB", localService: true, default: true, voiceURI: "test" }],
      speak(u: Utterance) {
        w.__spoken.push(u.text);
        const starts = [...u.text.matchAll(/\S+/g)].map((m) => m.index!);
        let i = 0;
        const next = () => {
          if (i < starts.length) { w.__words++; u.onboundary?.({ name: "word", charIndex: starts[i++] }); timer = setTimeout(next, 15); }
          else u.onend?.();
        };
        timer = setTimeout(next, 15);
      },
      cancel() { clearTimeout(timer); },
      pause() {}, resume() {},
      addEventListener() {}, removeEventListener() {},
    };
    Object.defineProperty(window, "speechSynthesis", { value: synth, configurable: true });
    Object.defineProperty(window, "SpeechSynthesisUtterance", { value: Utterance, configurable: true });
  });
}

test("Listen reads the English translation aloud, marking the passage and the word, and can pause, skip and stop", async ({ page }) => {
  await fakeVoice(page);
  await page.goto("/read?w=tlg0012.tlg001&tr=perseus-eng3&at=1.1");
  await expect(page.locator('[data-key="1.1"]').first()).toBeVisible({ timeout: 30_000 });
  await page.getByRole("button", { name: "Listen", exact: true }).click();
  const bar = page.getByRole("region", { name: "Listen to the translation" });
  await expect(bar).toBeVisible();
  await expect(bar).toContainText("The Greek is not read aloud");
  await bar.getByRole("button", { name: "Read aloud" }).click();
  // the first passage's English is spoken, and only English (no Greek letters, no line numbers)
  await expect.poll(() => page.evaluate(() => (window as unknown as { __spoken: string[] }).__spoken.join(" "))).toContain("wrath");
  const spoken = await page.evaluate(() => (window as unknown as { __spoken: string[] }).__spoken.join(" "));
  expect(spoken).not.toMatch(/[Ͱ-Ͽἀ-῿]/);
  // the passage being read is marked
  await expect(page.locator("article [data-listening]")).toHaveCount(1);
  // it moves on through the page by itself
  await expect.poll(() => page.evaluate(() => document.querySelector("article [data-listening]")?.getAttribute("data-key")), { timeout: 20_000 }).not.toBe("1.1");
  // pause, then skip ahead a passage
  await bar.getByRole("button", { name: "Pause" }).click();
  const at = await page.evaluate(() => document.querySelector("article [data-listening]")?.getAttribute("data-key"));
  await bar.getByRole("button", { name: "Next passage" }).click();
  await expect.poll(() => page.evaluate(() => document.querySelector("article [data-listening]")?.getAttribute("data-key"))).not.toBe(at);
  // speed is remembered
  await bar.getByRole("button", { name: /^Speed 1 times/ }).click();
  await expect(bar.getByRole("button", { name: /^Speed 1.2 times/ })).toBeVisible();
  // closing stops it and takes the marks away
  await bar.getByRole("button", { name: "Stop and close" }).click();
  await expect(bar).toBeHidden();
  await expect(page.locator("article [data-listening]")).toHaveCount(0);
});

test("on a phone, Listen is in the reading aids and its player sits above the bars", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await fakeVoice(page);
  await page.goto("/read?w=tlg0012.tlg001&tr=perseus-eng3&at=1.1");
  await expect(page.locator('[data-key="1.1"]').first()).toBeVisible({ timeout: 30_000 });
  await page.getByRole("toolbar", { name: "Reading" }).getByRole("button", { name: "Aids" }).click();
  await page.getByRole("dialog", { name: "Reading aids" }).getByRole("button", { name: "Listen", exact: true }).click();
  const bar = page.getByRole("region", { name: "Listen to the translation" });
  await expect(bar).toBeVisible();
  await expect(page.getByRole("dialog", { name: "Reading aids" })).toBeHidden();
  const b = (await bar.boundingBox())!, rb = (await page.getByRole("toolbar", { name: "Reading" }).boundingBox())!;
  expect(b.y + b.height).toBeLessThanOrEqual(rb.y + 1);
  expect(b.x).toBeGreaterThanOrEqual(0);
  expect(b.x + b.width).toBeLessThanOrEqual(375);
});
