/**
 * Every picture the site shows, with its full credit: the machine-readable image credits file the
 * brief asks for (src/data/images.json, written by pipeline/fetch_images.py from each museum's or
 * Wikimedia Commons' own record). Nothing is shown without a recorded licence.
 */
import data from "@/data/images.json";

export interface ImageCredit {
  file: string;            // under /images/
  width: number; height: number;
  title: string;           // what the object is
  date: string;            // its date, as the holding institution gives it
  place: string;           // where it is now
  creator: string;         // maker, or "Unknown"; and the photographer where known
  licence: string;         // "CC0", "Public domain", "CC BY-SA 4.0"…
  licenceUrl: string;
  source: string;          // the record it came from
  sourceName: string;      // "The Metropolitan Museum of Art", "Wikimedia Commons"…
  alt: string;             // a description for screen readers
}

export const IMAGES = data as Record<string, ImageCredit>;

/** The smaller copies made of every picture (scripts/fetch-images.ts), under /images/w<width>/. */
export const SIZES = [320, 640, 1024];

/** A srcset naming every size of a picture, so each screen downloads one no larger than it needs. */
export const srcSet = (im: ImageCredit) =>
  [...SIZES.filter((w) => w < im.width).map((w) => `/images/w${w}/${im.file} ${w}w`), `/images/${im.file} ${im.width}w`].join(", ");
