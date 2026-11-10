const fs = require("node:fs"),
  path = require("node:path"),
  os = require("node:os");
const { spawnSync } = require("node:child_process");
const root = path.resolve(__dirname, ".."),
  folder = path.join(root, "landing/centro-landingpage/assets/screenshots");
const chrome =
  process.env.CHROME_PATH ||
  "C:/Program Files/Google/Chrome/Application/chrome.exe";
const base = process.env.DASHBOARD_PREVIEW_URL || "http://localhost:3000";
const nav = fs.readFileSync(path.join(root, "src/data/navigation.ts"), "utf8");
const section = nav.slice(
  nav.indexOf("children: ["),
  nav.indexOf('title: "Apps"'),
);
const entries = [
  ...section.matchAll(/label:\s*"([^"]+)"\s*,\s*href:\s*"([^"]+)"/g),
].map(([, title, route]) => ({
  title,
  route,
  slug: route === "/" ? "executive" : route.split("/").pop(),
}));
if (entries.length !== 16) throw Error("Expected 16 dashboard destinations");
for (const entry of entries) {
  entry.filename = `dashboard-${entry.slug}-v2.png`;
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
      `--screenshot=${path.join(folder, entry.filename)}`,
      base + entry.route,
    ],
    { windowsHide: true, encoding: "utf8", timeout: 45000 },
  );
  if (
    result.error ||
    !fs.existsSync(path.join(folder, entry.filename)) ||
    !result.stderr.includes("bytes written")
  )
    throw Error(
      `Capture failed for ${entry.title}: ${result.error || result.stderr}`,
    );
  console.log(`Captured ${entry.title}`);
}
fs.writeFileSync(
  path.join(folder, "dashboard-captures.json"),
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
