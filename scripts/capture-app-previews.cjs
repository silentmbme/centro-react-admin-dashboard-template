const fs = require("node:fs"),
  path = require("node:path"),
  os = require("node:os");
const { spawnSync } = require("node:child_process");
const folder = path.resolve("landing/centro-landingpage"),
  base = process.env.DASHBOARD_PREVIEW_URL || "http://localhost:3000";
const chrome =
  process.env.CHROME_PATH ||
  "C:/Program Files/Google/Chrome/Application/chrome.exe";
const entries = [
  { title: "AI Chat", route: "/apps/ai-chat", filename: "app-ai-chat-v2.png" },
  { title: "Notes", route: "/apps/notes", filename: "app-notes-v2.png" },
];
let html = fs.readFileSync(path.join(folder, "index.html"), "utf8");
for (const entry of entries) {
  const result = spawnSync(
    chrome,
    [
      "--headless=new",
      "--no-sandbox",
      "--disable-gpu",
      "--no-first-run",
      "--no-default-browser-check",
      `--user-data-dir=${path.join(os.tmpdir(), "centro-dashboard-captures")}`,
      "--window-size=1440,1000",
      "--virtual-time-budget=20000",
      "--timeout=30000",
      `--screenshot=${path.join(folder, "assets/screenshots", entry.filename)}`,
      base + entry.route,
    ],
    { windowsHide: true, encoding: "utf8", timeout: 45000 },
  );
  if (result.error || !result.stderr.includes("bytes written"))
    throw Error(
      `Capture failed: ${entry.title}: ${result.error || result.stderr}`,
    );
  let found = false;
  html = html.replace(
    /<a\b[^>]*class="all-dashboard-card[^\"]*"[^>]*>[\s\S]*?<\/a\s*>/g,
    (card) => {
      const href = card.match(/href="([^"]+)"/)?.[1];
      if (!href || new URL(href).pathname !== entry.route) return card;
      found = true;
      const description = card.match(/<div>\s*<h3>[\s\S]*$/);
      if (!description) throw Error("Missing description");
      return (
        card
          .slice(0, card.indexOf(">") + 1)
          .replace(" new-workspace-card", "") +
        `<div class="all-dashboard-shot"><img src="assets/screenshots/${entry.filename}" alt="${entry.title} screenshot from the current Centro project" loading="lazy" decoding="async" width="1440" height="1000"></div>` +
        description[0]
      );
    },
  );
  if (!found) throw Error("Missing card " + entry.title);
  console.log("Captured and updated " + entry.title);
}
fs.writeFileSync(path.join(folder, "index.html"), html);
fs.writeFileSync(
  path.join(folder, "assets/screenshots/app-captures.json"),
  JSON.stringify(
    {
      source: base,
      method: "Chrome screenshots of current project pages",
      viewport: { width: 1440, height: 1000 },
      entries,
    },
    null,
    2,
  ) + "\n",
);
