import { describe as group, expect, it } from "vitest";
import { describe, fold, type CatText } from "./catalog";

const t = (desc: string, urn = "urn:cts:greekLit:tlg0012.tlg001.perseus-eng4"): CatText =>
  ({ urn, kind: "translation", lang: "eng", label: "Iliad", desc, col: "perseus", path: "", size: 0, sha: "" });

group("catalogue helpers", () => {
  it("names a version by translator or editor and year of publication", () => {
    expect(describe(t("Homer. The Iliad of Homer. Butler, Samuel, 1835-1902, translator. London: Longmans, Green, and Co, 1898."))).toBe("Butler, 1898 (perseus-eng4)");
    expect(describe(t("Homer. The Iliad, Volume 1-2. Murray, A. T. (Augustus Taber), translator. London: William Heinmann, 1924-1925."))).toBe("Murray, 1924 (perseus-eng4)");
    expect(describe(t("Homer. Homeri Opera. Monro, D. B. (David Binning), editor; Allen, Thomas W., editor. Oxford: Clarendon Press, 1908-1920."))).toBe("Monro, 1908 (perseus-eng4)");
  });
  it("folds accents, breathings, case and final sigma for searching", () => {
    expect(fold("Λόγος")).toBe("λογοσ");
    expect(fold("ᾠδῇ")).toBe("ωδη");
  });
});
