import { describe, expect, it } from "vitest";
import { useSettings, DEFAULTS, LIMITS } from "./settings";

describe("settings", () => {
  it("starts from the defaults", () => {
    const { theme, motion, greekSize, leading, columns, translit, cases, metre, tryFirst, fitLines, vibrate, pron, markers, greekFace, textFace } = useSettings.getState();
    expect({ theme, motion, greekSize, leading, columns, translit, cases, metre, tryFirst, fitLines, vibrate, pron, markers, greekFace, textFace }).toEqual(DEFAULTS);
  });

  it("keeps text size and line spacing inside their limits", () => {
    useSettings.getState().set({ greekSize: 99, leading: 0 });
    expect(useSettings.getState().greekSize).toBe(LIMITS.greekSize.max);
    expect(useSettings.getState().leading).toBe(LIMITS.leading.min);
    useSettings.getState().reset();
    expect(useSettings.getState().greekSize).toBe(DEFAULTS.greekSize);
  });
});
