/**
 * Modern scholarship cited by the Painted Stoa. Every work here was checked against a publisher's
 * page or a library catalogue (the `checked` link) before it was cited. Nothing is added from memory.
 */
import type { Secondary } from "./types";

export const BIB: Record<string, Secondary> = {
  "hornblower-thuc-3": {
    author: "Simon Hornblower", title: "A Commentary on Thucydides, Volume III: Books 5.25–8.109", year: 2008,
    publisher: "Oxford: Oxford University Press", checked: "https://global.oup.com/academic/product/a-commentary-on-thucydides-volume-iii-books-525-8109-9780199276486",
  },
  "hct-4": {
    author: "A. W. Gomme, A. Andrewes and K. J. Dover", title: "A Historical Commentary on Thucydides, Volume IV: Books V 25–VII", year: 1970,
    publisher: "Oxford: Clarendon Press", checked: "https://global.oup.com/academic/product/an-historical-commentary-on-thucydides-9780198141983",
  },
  "kagan-nicias": {
    author: "Donald Kagan", title: "The Peace of Nicias and the Sicilian Expedition", year: 1981,
    publisher: "Ithaca: Cornell University Press", checked: "https://www.cornellpress.cornell.edu/book/9780801499401/the-peace-of-nicias-and-the-sicilian-expedition/",
  },
};
