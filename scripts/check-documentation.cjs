const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
let checks = 0;
const errors = [];
for (const folder of ["public/documentation", "centro-documentation"]) {
  const dir = path.join(root, folder);
  for (const name of fs.readdirSync(dir).filter((n) => n.endsWith(".html"))) {
    if (name === "template.html") continue;
    const source = fs.readFileSync(path.join(dir, name), "utf8");
    if (!source.includes("<h1>") || source.includes("{{"))
      errors.push(`${name}: missing content or unresolved placeholder`);
    for (const match of source.matchAll(/(?:href|src)="([^"]+)"/g)) {
      const target = match[1];
      if (/^(?:https?:|mailto:|#|\/)/.test(target)) continue;
      const file = target.split(/[?#]/)[0];
      if (file && !fs.existsSync(path.resolve(dir, file)))
        errors.push(`${name}: missing ${file}`);
      checks++;
    }
    if (!source.includes("Version 1.0.0"))
      errors.push(`${folder}/${name}: missing current version`);
    if (
      folder === "centro-documentation" &&
      source !==
        fs.readFileSync(path.join(root, "public/documentation", name), "utf8")
    )
      errors.push(`${name}: documentation copies differ`);
  }
}
if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else
  console.log(
    `Documentation check passed: ${checks} relative asset/link references.`,
  );
