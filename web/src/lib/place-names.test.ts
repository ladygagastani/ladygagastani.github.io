import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { ENGLISH_NAMES } from "./place-names";
import { shortName, type Place } from "./map";

const places = (JSON.parse(readFileSync("public/data/map/places.json", "utf8")) as { places: Place[] }).places;
const byId = new Map(places.map((p) => [p.id, p]));
const byGreek = new Map(places.map((p) => [p.grc, p]));

describe("place names in English", () => {
  it("name only places that are on the map", () => {
    for (const id of Object.keys(ENGLISH_NAMES)) expect(byId.has(id), id).toBe(true);
  });

  it("use the usual English name, else Pleiades' first title without its notes", () => {
    expect(shortName(byGreek.get("Ἀθῆναι")!)).toBe("Athens");
    expect(shortName(byGreek.get("Τροία")!)).toBe("Troy");
    expect(shortName(byGreek.get("Σπάρτη")!)).toBe("Sparta");
    expect(shortName(byGreek.get("Κρότων")!)).toBe("Croton");   // Pleiades: "Croto(n)"
    for (const p of places) expect(shortName(p), p.id).not.toMatch(/[()/?]|^\s|\s$/);
  });
});

describe("places the texts mean, where Pleiades has several of the name", () => {
  const near = (grc: string, lat: number, lon: number) => {
    const p = byGreek.get(grc)!;
    expect(Math.abs(p.lat - lat) < 0.5 && Math.abs(p.lon - lon) < 0.5, `${grc} at ${p.lat}, ${p.lon}`).toBe(true);
  };
  it("Artemisium is the Euboean cape, Abdera the Thracian city, the Chersonese the Thracian peninsula", () => {
    near("Ἀρτεμίσιον", 39.0, 23.2);
    near("Ἄβδηρα", 40.9, 25.0);
    near("Χερρόνησος", 40.3, 26.5);
  });
});
