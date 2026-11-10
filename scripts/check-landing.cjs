const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");
const root = path.resolve(__dirname, "..");
const folder = path.join(root, "landing/centro-landingpage");
const html = fs.readFileSync(path.join(folder, "index.html"), "utf8");
let localLinks = 0;
const ids = new Set(
  [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]),
);
const routeDir = path.join(root, "src/routes");
function readRoutes(dir) {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((entry) =>
      entry.isDirectory()
        ? readRoutes(path.join(dir, entry.name))
        : entry.name.endsWith(".tsx")
          ? [
              ...fs
                .readFileSync(path.join(dir, entry.name), "utf8")
                .matchAll(/createFileRoute\(\s*["']([^"']+)["']\s*\)/g),
            ].map((match) => match[1])
          : [],
    );
}
const routes = new Set(readRoutes(routeDir));
for (const [, url] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
  assert.ok(!url.startsWith("file:"), "Machine-specific file link: " + url);
  if (/^https?:\/\/(?:localhost:3000|127\.0\.0\.1:3000|centro\.adminsmpixelcraft\.workers\.dev)(?:\/|$)/.test(url)) {
    assert.ok(
      routes.has(new URL(url).pathname),
      "Missing project route: " + url,
    );
    continue;
  }
  if (/^(https?:|mailto:|data:)/.test(url)) continue;
  if (url.startsWith("#"))
    assert.ok(ids.has(url.slice(1)), "Missing section " + url);
  else
    assert.ok(
      fs.existsSync(path.resolve(folder, url.split(/[?#]/)[0])),
      "Missing local asset/link " + url,
    );
  localLinks++;
}
assert.equal(
  (html.match(/class="all-dashboard-card/g) || []).length,
  24,
  "Expected 16 dashboards and 8 apps",
);
assert.equal((html.match(/class="management-feature"/g) || []).length, 6);
assert.ok(html.includes("<strong>167</strong><span>Routes</span>"));
const capturesPath = path.join(
  folder,
  "assets/screenshots/dashboard-captures.json",
);
if (fs.existsSync(capturesPath)) {
  const { entries } = JSON.parse(fs.readFileSync(capturesPath, "utf8"));
  assert.equal(entries.length, 16);
  for (const entry of entries) {
    assert.ok(
      html.includes(`assets/screenshots/${entry.filename}`),
      `Unused dashboard capture: ${entry.title}`,
    );
    const png = fs.readFileSync(
      path.join(folder, "assets/screenshots", entry.filename),
    );
    assert.equal(png.readUInt32BE(16), 1440, `Invalid width: ${entry.title}`);
    assert.equal(png.readUInt32BE(20), 1000, `Invalid height: ${entry.title}`);
  }
}
console.log(
  `Landing checks passed: 24 dashboard/app cards, 6 management groups, ${localLinks} local references; preview paths match project routes.`,
);
