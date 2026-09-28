import { test, expect } from "@playwright/test";

// The home page's "What people are asking": the database's answers are replaced here by made-up ones,
// so nothing is written to (or needed from) the real forum.

const REST = "**/rest/v1/**";

test("the home page shows the latest threads and the motion of the week", async ({ page }) => {
  await page.route(REST, (route) => {
    const url = route.request().url();
    const body = url.includes("/threads?")
      ? [
          { id: 7, title: "Why does ἐστί lose its accent?", reply_count: 2, last_activity_at: new Date(Date.now() - 3 * 3600e3).toISOString(),
            category: { title: "Grammar help" }, author: { display_name: "Test reader" } },
          { id: 5, title: "Where should I begin?", reply_count: 1, last_activity_at: new Date(Date.now() - 2 * 86400e3).toISOString(),
            category: { title: "Beginners' questions" }, author: null },
        ]
      : [{ id: 3, motion: "This house would keep the Parthenon marbles in London.", closes_at: "2026-10-12T12:00:00Z" }];
    return route.fulfill({ json: body, headers: { "access-control-allow-origin": "*" } });
  });
  await page.goto("/");
  const first = page.getByRole("link", { name: /Why does ἐστί lose its accent\?/ });
  await expect(first).toBeVisible();
  await expect(first).toHaveAttribute("href", "/town-hall/thread?id=7");
  await expect(first).toContainText("Grammar help");
  await expect(first).toContainText("2 replies");
  await expect(page.getByRole("link", { name: /Where should I begin\?/ })).toContainText("1 reply");
  const motion = page.getByRole("link", { name: /keep the Parthenon marbles in London/ });
  await expect(motion).toHaveAttribute("href", "/town-hall/pnyx/debate?id=3");
  await expect(motion).toContainText("Open until 12 October");
});

test("an empty forum is an invitation, not an error", async ({ page }) => {
  await page.route(REST, (route) => route.fulfill({ json: [], headers: { "access-control-allow-origin": "*" } }));
  await page.goto("/");
  await expect(page.getByText("No one has spoken yet.")).toBeVisible();
  await expect(page.getByRole("link", { name: /The Assembly is in recess/ })).toHaveAttribute("href", "/town-hall/pnyx");
});

test("if the forum cannot be reached, the home page says so quietly and keeps working", async ({ page }) => {
  await page.route(REST, (route) => route.abort());
  await page.goto("/");
  await expect(page.getByText(/cannot be reached just now/)).toBeVisible();
  await expect(page.getByRole("link", { name: /Enter The Town Hall/ })).toHaveAttribute("href", "/town-hall");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});
