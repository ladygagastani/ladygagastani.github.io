/**
 * Every checked author article at once: for the static /author/<id> pages (built on the server, so each page
 * holds only its own article) and for the tests. The browser loads one at a time (ARTICLE_LOADERS).
 */
import { draftFor, type AuthorArticle } from "./author-articles";
import { herodotus } from "./authors/tlg0016";
import { homer } from "./authors/tlg0012";
import { thucydides } from "./authors/tlg0003";
import { plato } from "./authors/tlg0059";
import { sophocles } from "./authors/tlg0011";
import { aristotle } from "./authors/tlg0086";
import { euripides } from "./authors/tlg0006";
import { aeschylus } from "./authors/tlg0085";

export const ARTICLES: Record<string, AuthorArticle> = { [herodotus.id]: herodotus, [homer.id]: homer, [thucydides.id]: thucydides, [plato.id]: plato, [sophocles.id]: sophocles, [aristotle.id]: aristotle, [euripides.id]: euripides, [aeschylus.id]: aeschylus };

/** The article for an author: the checked one, or (development only) a draft marked as unchecked. */
export function articleFor(id: string): { article: AuthorArticle; draft: boolean } | null {
  return ARTICLES[id] ? { article: ARTICLES[id], draft: false } : draftFor(id);
}
