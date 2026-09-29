import { test, expect, type Page } from "@playwright/test";

// Bug reports, suggestions and hiding a person. A pretend signed-in member and pretend database answers:
// nothing is sent to, or written in, the real forum.
const KEY = "sb-kxwppdhbvlamcmgckqpg-auth-token";
const me = "00000000-0000-0000-0000-000000000001";
const other = "00000000-0000-0000-0000-000000000002";
const session = {
  access_token: "a.b.c", token_type: "bearer", expires_in: 3600, expires_at: Math.floor(Date.now() / 1000) + 3600, refresh_token: "r",
  user: { id: me, aud: "authenticated", role: "authenticated", email: "member@example.org", app_metadata: {}, user_metadata: {}, created_at: "2026-09-01T00:00:00Z" },
};
const profile = { id: me, display_name: "Test member", bio: "", role: "member", banned_until: null, ban_reason: null, created_at: "2026-09-01T00:00:00Z" };
const pest = { id: other, display_name: "Noisy", role: "member" };
const cats = [
  { id: "grammar", title: "Grammar help", blurb: "Forms, endings, syntax.", sort: 2 },
  { id: "bugs", title: "Bug reports", blurb: "Something on the site not working?", sort: 9 },
  { id: "ideas", title: "Suggestions", blurb: "Ideas to make the site better.", sort: 10 },
];
const at = "2026-09-29T10:00:00Z";
const thread = (id: number, author: typeof pest | null, extra: object = {}) => ({
  id, category_id: "bugs", author_id: author?.id ?? me, title: `Report ${id}`, body: "**What happened**\nIt broke.", tags: [], quote: null,
  created_at: at, edited_at: null, last_activity_at: at, reply_count: 0, score: 0, answered_post_id: null, locked: false, hidden: false,
  hidden_reason: null, author: author ?? { id: me, display_name: "Test member", role: "member" }, status: "open", ...extra,
});

async function pretend(page: Page, sent: { body?: Record<string, unknown> } = {}) {
  await page.addInitScript(([k, s]) => { if (!localStorage.getItem(k)) localStorage.setItem(k, s); }, [KEY, JSON.stringify(session)]);
  await page.route("**/rest/v1/**", (route) => {
    const req = route.request();
    const url = req.url();
    const one = (req.headers()["accept"] ?? "").includes("vnd.pgrst.object");
    const cors = { "access-control-allow-origin": "*" };
    if (req.method() === "POST" && url.includes("/threads")) {
      sent.body = req.postDataJSON();
      return route.fulfill({ json: { id: 42 }, headers: cors });
    }
    // (a single row asked for with maybeSingle() arrives as a list of one)
    const wrap = (x: object) => (one ? x : [x]);
    const body = url.includes("/rest/v1/profiles") ? wrap(url.includes(`id=eq.${other}`) ? { ...pest, bio: "", created_at: at, banned_until: null } : profile)
      : url.includes("/forum_categories") ? cats
      : url.includes("/rest/v1/threads") ? (/[?&]id=eq\.7/.test(url) ? wrap(thread(7, pest, { status: "confirmed" })) : [thread(1, null), thread(2, pest)])
      : url.includes("/posts") ? [{ id: 5, thread_id: 7, parent_id: null, author_id: other, body: "Me too.", quote: null, created_at: at, edited_at: null, score: 0, hidden: false, hidden_reason: null, author: pest }]
      : [];
    return route.fulfill({ json: body, headers: cors });
  });
  await page.route("**/auth/v1/**", (route) => route.fulfill({ status: 400, json: { error: "no" }, headers: { "access-control-allow-origin": "*" } }));
}

test("the footer's 'Report a bug' opens the bug form with the page and browser filled in, and sends a tidy thread", async ({ page }) => {
  const sent: { body?: Record<string, unknown> } = {};
  await pretend(page, sent);
  await page.goto("/stoa/pericles");
  await page.getByRole("contentinfo").getByRole("link", { name: "Report a bug" }).click();
  await expect(page.getByRole("heading", { name: "Report a bug" })).toBeVisible();
  await expect(page.getByRole("textbox", { name: "Page" })).toHaveValue("/stoa/pericles");
  await expect(page.getByRole("textbox", { name: "Browser" })).toHaveValue(/ on .*window \d+ × \d+$/);
  await page.getByRole("textbox", { name: "Title" }).fill("A test report");
  await page.getByRole("textbox", { name: "What happened?" }).fill("The picture did not load.");
  await page.getByRole("button", { name: "Send the report" }).click();
  await expect(page).toHaveURL(/\/town-hall\/thread\?id=42/);
  expect(sent.body).toMatchObject({ category_id: "bugs", title: "A test report" });
  expect(sent.body!.body).toMatch(/^\*\*What happened\*\*\nThe picture did not load\.\n\n\*\*Page:\*\* \[\/stoa\/pericles\]\(http:\/\/localhost:\d+\/stoa\/pericles\)\n\*\*Browser:\*\* /);
});

test("an unsent bug report comes back after a reload", async ({ page }) => {
  await pretend(page);
  await page.goto("/town-hall/new?c=bugs");
  await page.getByRole("textbox", { name: "What happened?" }).fill("Half written");
  await page.reload();
  await expect(page.getByRole("textbox", { name: "What happened?" })).toHaveValue("Half written");
  await expect(page.getByText("Your unsent report has come back.")).toBeVisible();
});

test("bug reports show their status and can be narrowed to open or closed ones", async ({ page }) => {
  await pretend(page);
  await page.goto("/town-hall?c=bugs");
  await expect(page.getByRole("link", { name: "Report a bug →" })).toHaveAttribute("href", "/town-hall/new?c=bugs");
  await expect(page.getByRole("link", { name: /^Report 1/ })).toContainText("Open");
  await page.getByRole("group", { name: "Status" }).getByRole("button", { name: "Closed" }).click();
  await expect(page).toHaveURL(/state=closed/);
});

test("hiding a person: their threads leave the list, their replies fold, and the account page lists them", async ({ page }) => {
  await pretend(page);
  await page.goto(`/town-hall/member?id=${other}`);
  await page.getByRole("button", { name: "Hide this person's posts" }).click();
  await expect(page.getByRole("button", { name: "Show their posts again" })).toBeVisible();

  await page.goto("/town-hall?c=bugs");
  await expect(page.getByRole("link", { name: /^Report 1/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /^Report 2/ })).toHaveCount(0);
  await expect(page.getByText("One thread from people you have hidden is not shown.")).toBeVisible();
  await page.getByRole("button", { name: "Show it" }).click();
  await expect(page.getByRole("link", { name: /^Report 2/ })).toBeVisible();

  await page.goto("/town-hall/thread?id=7");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Confirmed");
  await expect(page.getByText("A reply by Noisy, whom you have hidden.")).toBeVisible();
  await expect(page.getByText("Me too.")).toHaveCount(0);
  await page.getByText("A reply by Noisy").getByRole("button", { name: "Show it" }).click();
  await expect(page.getByText("Me too.")).toBeVisible();

  await page.goto("/account");
  await expect(page.getByRole("heading", { name: "People you have hidden" })).toBeVisible();
  await page.getByRole("button", { name: "Show again" }).click();
  await expect(page.getByRole("heading", { name: "People you have hidden" })).toHaveCount(0);
});
