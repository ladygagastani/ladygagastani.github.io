// After publishing: opens the live site in Edge and checks the pages that talk to the forum's database.
//   node scripts/live-check.mjs [https://mathesisstoicheion.com]
import { chromium } from "@playwright/test";

const base = process.argv[2] ?? "https://mathesisstoicheion.com";
const b = await chromium.launch({ channel: "msedge" });
const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
const errors = [];
p.on("console", (m) => { if (m.type() === "error") errors.push(m.text().slice(0, 160)); });
p.on("pageerror", (e) => errors.push("pageerror: " + String(e).slice(0, 160)));
const rest = [];
p.on("response", (r) => { if (r.url().includes("/rest/v1/")) rest.push(`${r.status()} ${new URL(r.url()).pathname.split("/").pop()}`); });

const step = async (name, fn) => { try { console.log("ok  ", name, "-", await fn()); } catch (e) { console.log("FAIL", name, "-", String(e).split("\n")[0]); } };
await step("home: forum section", async () => {
  await p.goto(base + "/"); await p.getByRole("heading", { name: "What people are asking" }).waitFor({ timeout: 20000 });
  await p.waitForFunction(() => !document.querySelector('[aria-busy="true"]'), null, { timeout: 20000 });
  return (await p.locator("#forum-title").locator("xpath=ancestor::section").innerText()).replace(/\s+/g, " ").slice(0, 200);
});
await step("town hall: categories", async () => {
  await p.goto(base + "/town-hall"); await p.getByRole("button", { name: /^Grammar help/ }).waitFor({ timeout: 20000 });
  return "categories shown";
});
await step("pnyx", async () => { await p.goto(base + "/town-hall/pnyx"); await p.getByText(/voted by a show of hands/).waitFor({ timeout: 20000 }); return "page shown"; });
await step("author page", async () => { await p.goto(base + "/library/author?a=tlg0012"); await p.getByRole("heading", { level: 1, name: "Homer" }).waitFor({ timeout: 20000 }); return "Homer"; });
await step("library vocabulary badges", async () => { await p.goto(base + "/library?a=tlg0059"); await p.getByText(/% common words/).first().waitFor({ timeout: 20000 }); return "badges shown"; });
console.log("database requests:", rest.join(", ") || "none");
console.log("console errors:", errors.length ? errors : "none");
await b.close();
