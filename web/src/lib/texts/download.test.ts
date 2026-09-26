import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { gitBlobSha, planDownload } from "./download";
import { indexCatalog, type Catalog } from "@/lib/catalog";

const idx = indexCatalog(JSON.parse(readFileSync("public/data/catalog.json", "utf8")) as Catalog);

describe("downloads", () => {
  it("computes GitHub's fingerprint of a file exactly", async () => {
    const bytes = new Uint8Array(readFileSync("test-fixtures/tlg0012.tlg001.perseus-grc2.xml"));
    const iliad = idx.text.get("urn:cts:greekLit:tlg0012.tlg001.perseus-grc2")!;
    expect(await gitBlobSha(bytes)).toBe(iliad.sha);
  });

  it("plans Greek and English only, per collection", () => {
    const p = planDownload(idx, { cols: ["perseus"], langs: ["grc", "eng"] });
    expect(p.texts.length).toBeGreaterThan(1500);
    expect(p.texts.every((t) => t.col === "perseus" && (t.lang === "grc" || t.lang === "eng"))).toBe(true);
    expect(p.bytes).toBe(p.texts.reduce((n, t) => n + t.size, 0));
  });

  it("can plan a single work", () => {
    const p = planDownload(idx, { cols: ["perseus", "first1k"], langs: ["grc", "eng"], workIds: new Set(["tlg0012.tlg001"]) });
    expect(p.texts.map((t) => t.urn)).toContain("urn:cts:greekLit:tlg0012.tlg001.perseus-grc2");
  });
});
