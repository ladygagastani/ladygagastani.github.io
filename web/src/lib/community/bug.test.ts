import { describe, expect, it } from "vitest";
import { bugBody, describeBrowser, pageFrom } from "./bug";

describe("describeBrowser", () => {
  it("names the browser, its main version and the system in plain words", () => {
    expect(describeBrowser("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0", 1366, 900))
      .toBe("Edge 140 on Windows, window 1366 × 900");
    expect(describeBrowser("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36"))
      .toBe("Chrome 140 on Windows");
    expect(describeBrowser("Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1", 390, 844))
      .toBe("Safari 18.5 on an iPhone, window 390 × 844");
    expect(describeBrowser("Mozilla/5.0 (Android 15; Mobile; rv:141.0) Gecko/141.0 Firefox/141.0")).toBe("Firefox 141 on Android");
    expect(describeBrowser("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15")).toBe("Safari 18.6 on a Mac");
    expect(describeBrowser("curl/8")).toBe("an unknown browser");
  });
});

describe("bugBody", () => {
  const base = { what: " The page went blank. ", steps: "", expected: "", page: "", browser: "" };
  it("keeps only the parts that were filled in", () => {
    expect(bugBody(base, "https://x.org")).toBe("**What happened**\nThe page went blank.");
  });
  it("links a page on this site in full, and lists page and browser together", () => {
    expect(bugBody({ ...base, steps: "1. Open the Iliad\n2. Press Metre", expected: "The scansion", page: "/read?w=tlg0012.tlg001", browser: "Edge 140 on Windows" }, "https://x.org"))
      .toBe("**What happened**\nThe page went blank.\n\n**Steps to see it**\n1. Open the Iliad\n2. Press Metre\n\n**What I expected**\nThe scansion\n\n"
        + "**Page:** [/read?w=tlg0012.tlg001](https://x.org/read?w=tlg0012.tlg001)\n**Browser:** Edge 140 on Windows");
  });
  it("adds the error message from the page that stumbled", () => {
    expect(bugBody({ ...base, error: "Cannot read x" }, "")).toContain("**The message the page showed**\nCannot read x");
  });
});

describe("pageFrom", () => {
  it("takes only this site's own paths, never another site or the form itself", () => {
    expect(pageFrom("/read?w=tlg0012.tlg001")).toBe("/read?w=tlg0012.tlg001");
    expect(pageFrom("https://evil.example/")).toBe("");
    expect(pageFrom("//evil.example/")).toBe("");
    expect(pageFrom("/town-hall/new?c=bugs")).toBe("");
    expect(pageFrom(null)).toBe("");
  });
});
