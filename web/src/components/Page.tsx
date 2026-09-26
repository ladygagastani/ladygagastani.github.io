import { ViewTransition } from "react";

/**
 * Wraps every page so that navigating between areas plays the page-turn transition.
 * It has to sit in each page, not in the layout: layouts persist, so they never enter or exit.
 */
export default function Page({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition
      enter={{ "page-turn": "page-turn", default: "none" }}
      exit={{ "page-turn": "page-turn", default: "none" }}
      default="none"
    >
      <main id="main" tabIndex={-1}>{children}</main>
    </ViewTransition>
  );
}
