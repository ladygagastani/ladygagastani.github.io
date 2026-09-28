/**
 * The site header slides away while you scroll down and comes back when you scroll up.
 * Header.tsx keeps two CSS variables on <html> up to date, and anything sticky sits below them:
 *   --hdr-h    the header's full height (it is taller on phones, where the menu wraps);
 *   --hdr-vis  how much of it is showing now: --hdr-h, or 0 while it is tucked away.
 */
const px = (name: string) => parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name)) || 0;

/** The header's full height in pixels. */
export const headerHeight = () => px("--hdr-h");

/** How many pixels of the header are showing at the top of the window now. */
export const headerVisible = () => px("--hdr-vis");
