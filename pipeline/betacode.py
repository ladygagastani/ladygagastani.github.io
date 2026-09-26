"""Beta Code → Unicode polytonic Greek (as used in the Perseus LSJ). Output is NFC."""
from __future__ import annotations

import re
import unicodedata

LETTERS = {
    "a": "α", "b": "β", "g": "γ", "d": "δ", "e": "ε", "z": "ζ", "h": "η", "q": "θ", "i": "ι", "k": "κ",
    "l": "λ", "m": "μ", "n": "ν", "c": "ξ", "o": "ο", "p": "π", "r": "ρ", "s": "σ", "t": "τ", "u": "υ",
    "f": "φ", "x": "χ", "y": "ψ", "w": "ω", "v": "ϝ",
}
MARKS = {"_": "̄", "^": "̆", "+": "̈", ")": "̓", "(": "̔", "/": "́", "\\": "̀", "=": "͂", "|": "ͅ"}
ORDER = "̄̆̈̓̔́̀͂ͅ"   # composing order for NFC
MARK_CHARS = "".join(re.escape(k) for k in MARKS)
TOKEN = re.compile(rf"(\*)([{MARK_CHARS}]*)([a-zA-Z])(\d?)|([a-zA-Z])(\d?)([{MARK_CHARS}]*)")


def _apply(base: str, marks: str) -> str:
    combining = sorted((MARKS[m] for m in marks), key=ORDER.index)
    return base + "".join(combining)


def beta_to_unicode(s: str) -> str:
    out: list[str] = []
    pos = 0
    for m in TOKEN.finditer(s):
        out.append(s[pos:m.start()])
        pos = m.end()
        if m.group(1):                                  # capital: *)/a
            letter = LETTERS.get(m.group(3).lower())
            if not letter:
                out.append(m.group(0)); continue
            out.append(_apply(letter.upper(), m.group(2)))
        else:
            ch, num, marks = m.group(5), m.group(6), m.group(7)
            letter = LETTERS.get(ch.lower())
            if not letter:
                out.append(m.group(0)); continue
            if ch.lower() == "s":
                if num == "3":
                    letter = "ϲ"
                elif num == "2":
                    letter = "ς"
                elif num != "1":
                    nxt = s[m.end():m.end() + 1]
                    if not nxt or not re.match(r"[a-zA-Z*]", nxt):
                        letter = "ς"
            elif num:
                out.append(_apply(letter, marks) + num); continue
            out.append(_apply(letter, marks))
    out.append(s[pos:])
    return unicodedata.normalize("NFC", "".join(out))


if __name__ == "__main__":
    tests = {"mh=nis": "μῆνις", "*)axilleu/s": "Ἀχιλλεύς", "a)ei/dw": "ἀείδω", "qea/": "θεά", "ca^nw=": "ξᾰνῶ",
             "*(/hra": "Ἥρα", "ei)mi/": "εἰμί", "tw=|": "τῷ", "prohi+/ayen": "προηΐαψεν", "lo/gos kai\\": "λόγος καὶ"}
    for b, u in tests.items():
        got = beta_to_unicode(b)
        print("ok " if got == u else "BAD", b, got, u)
