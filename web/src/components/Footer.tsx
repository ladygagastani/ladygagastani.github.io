import Link from "next/link";
import { SITE } from "@/config/areas";
import ReportBugLink from "./ReportBugLink";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="meander" aria-hidden="true" />
      <div className="wrap site-footer-in">
        <div>
          <p className="site-footer-name" lang="grc">{SITE.greek}</p>
          <p className="muted">Free for everyone. No adverts, no trackers.</p>
        </div>
        <nav aria-label="About this site" className="site-footer-links">
          <Link href="/about" transitionTypes={["page-turn"]}>About the names</Link>
          <Link href="/credits" transitionTypes={["page-turn"]}>Credits, licences &amp; privacy</Link>
          <ReportBugLink />
          <Link href="/town-hall?c=ideas">Suggest an idea</Link>
        </nav>
        <p className="muted site-footer-src">
          Greek texts and translations from the Perseus Digital Library and the First Thousand Years of Greek project,
          used unchanged under CC BY-SA 4.0.
        </p>
      </div>
    </footer>
  );
}
