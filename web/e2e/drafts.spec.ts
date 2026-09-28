import { test, expect } from "@playwright/test";

// A pretend signed-in member and pretend database answers: nothing is sent to, or written in, the real forum.
const KEY = "sb-kxwppdhbvlamcmgckqpg-auth-token";
const session = {
  access_token: "a.b.c", token_type: "bearer", expires_in: 3600, expires_at: Math.floor(Date.now() / 1000) + 3600, refresh_token: "r",
  user: { id: "00000000-0000-0000-0000-000000000001", aud: "authenticated", role: "authenticated", email: "member@example.org", app_metadata: {}, user_metadata: {}, created_at: "2026-09-01T00:00:00Z" },
};
const profile = { id: session.user.id, display_name: "Test member", bio: "", role: "member", banned_until: null, ban_reason: null, created_at: "2026-09-01T00:00:00Z" };

test.beforeEach(async ({ page }) => {
  await page.addInitScript(([k, s]) => { if (!localStorage.getItem(k)) localStorage.setItem(k, s); }, [KEY, JSON.stringify(session)]);
  await page.route("**/rest/v1/**", (route) => {
    const url = route.request().url();
    const one = (route.request().headers()["accept"] ?? "").includes("vnd.pgrst.object");
    const body = url.includes("/profiles") ? (one ? profile : [profile])
      : url.includes("/forum_categories") ? [{ id: "grammar", title: "Grammar help", blurb: "", sort: 2 }] : [];
    return route.fulfill({ json: body, headers: { "access-control-allow-origin": "*" } });
  });
  await page.route("**/auth/v1/**", (route) => route.fulfill({ status: 400, json: { error: "no" }, headers: { "access-control-allow-origin": "*" } }));
});

test("an unsent forum post comes back after a reload, and goes when it is emptied", async ({ page }) => {
  await page.goto("/town-hall/new");
  const box = page.getByRole("textbox", { name: "Your question" });
  await box.fill("Why does the article change? μῆνιν");
  await page.reload();
  await expect(page.getByRole("textbox", { name: "Your question" })).toHaveValue("Why does the article change? μῆνιν");
  await expect(page.getByText("Your unsent draft has come back.")).toBeVisible();
  await page.getByRole("textbox", { name: "Your question" }).fill("");
  await page.reload();
  await expect(page.getByRole("textbox", { name: "Your question" })).toHaveValue("");
  await expect(page.getByText("Your unsent draft has come back.")).toHaveCount(0);
});
