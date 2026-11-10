const fs = require("node:fs"),
  path = require("node:path");
const root = path.resolve(__dirname, ".."),
  folder = path.join(root, "landing/centro-landingpage");
const { entries } = JSON.parse(
  fs.readFileSync(
    path.join(folder, "assets/screenshots/dashboard-captures.json"),
    "utf8",
  ),
);
const file = path.join(folder, "index.html");
let html = fs.readFileSync(file, "utf8");
for (const entry of entries) {
  if (!fs.existsSync(path.join(folder, "assets/screenshots", entry.filename)))
    throw Error(`Missing ${entry.filename}`);
  let found = false;
  html = html.replace(
    /<a\b[^>]*class="all-dashboard-card[^\"]*"[^>]*>[\s\S]*?<\/a\s*>/g,
    (card) => {
      const href = card.match(/href="([^"]+)"/)?.[1];
      if (!href || new URL(href).pathname !== entry.route) return card;
      found = true;
      const heading = card.match(/<div>\s*<h3>[\s\S]*$/);
      if (!heading) throw Error(`Missing card description: ${entry.slug}`);
      const opening = card
        .slice(0, card.indexOf(">") + 1)
        .replace(" new-workspace-card", "");
      return `${opening}<div class="all-dashboard-shot"><img src="assets/screenshots/${entry.filename}" alt="${entry.title} dashboard screenshot from the current Centro project" loading="lazy" decoding="async" width="1440" height="1000"></div>${heading[0]}`;
    },
  );
  if (!found) throw Error(`Missing card: ${entry.slug}`);
}
fs.writeFileSync(file, html);
console.log(
  `Updated ${entries.length} dashboard cards with current project screenshots.`,
);
