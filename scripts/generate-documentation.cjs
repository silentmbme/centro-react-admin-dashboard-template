const fs = require("node:fs");
const path = require("node:path");
const {
  pages,
  release,
  section,
  p,
  list,
  table,
  callout,
} = require("../centro-documentation/content.cjs");
const root = path.resolve(__dirname, "..");
const target = path.join(root, "public/documentation");
fs.mkdirSync(target, { recursive: true });
const escape = (v) =>
  String(v)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
function files(dir) {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((e) =>
      e.isDirectory()
        ? files(path.join(dir, e.name))
        : [path.join(dir, e.name)],
    );
}
const routeRows = files(path.join(root, "src/routes"))
  .filter((f) => f.endsWith(".tsx"))
  .flatMap((file) => {
    const source = fs.readFileSync(file, "utf8");
    const match = source.match(/createFileRoute\(\s*["']([^"']+)["']\s*\)/);
    return match
      ? [
          {
            url: match[1],
            source: path.relative(root, file).replaceAll("\\", "/"),
            alias: source.includes("redirect("),
          },
        ]
      : [];
  })
  .sort((a, b) => a.url.localeCompare(b.url));
const nav = fs.readFileSync(path.join(root, "src/data/navigation.ts"), "utf8");
const dashboardSection = nav.slice(
  nav.indexOf('label: "Dashboards"'),
  nav.indexOf('title: "Apps"'),
);
const dashboards = [
  ...dashboardSection.matchAll(/label:\s*"([^"]+)"\s*,\s*href:\s*"([^"]+)"/g),
]
  .map((m) => [m[1], m[2]])
  .filter(([name]) => name !== "Dashboards");
const group = (title, base, rows) =>
  section(
    title,
    table(
      ["Page / route", "Implemented behavior"],
      rows.map(([name, url, behavior]) => [
        `<a href="${base + url}">${escape(name)}</a><br><code>${base + url}</code>`,
        behavior,
      ]),
    ),
  );
const features =
  section(
    "Dashboards",
    p(
      `${dashboards.length} dashboard destinations are present in the sidebar.`,
    ) +
      table(
        ["Dashboard", "Route"],
        dashboards.map(([name, url]) => [
          escape(name),
          `<a href="${url}"><code>${url}</code></a>`,
        ]),
      ),
  ) +
  group("Apps", "/apps/", [
    ["Email", "email", "Email workspace UI."],
    ["Chat", "chat", "Chat application."],
    [
      "AI Chat",
      "ai-chat",
      "Local sample conversations, copy/export, history search, and attachment controls. Files are limited to 5 MB each and four per draft; supported images use local previews. HTTP/HTTPS link attachment and browser-dependent voice input are included. No model call, upload, or attachment analysis occurs.",
    ],
    ["Calendar", "calendar", "Calendar application."],
    ["Tasks", "tasks", "Task management UI."],
    [
      "Notes",
      "notes",
      "Session-only note creation, editing, categories, color, pinning, deletion confirmation, grid/list views, and export.",
    ],
    ["Kanban", "kanban", "Kanban board application."],
    ["File Manager", "files", "File-management UI."],
  ]) +
  group("Finance", "/finance/", [
    [
      "Transactions",
      "transactions",
      "Sample transactions, income/expense and status filters, sorting, cash-flow chart, creation/details, and CSV export.",
    ],
    [
      "Invoices",
      "invoices",
      "Sample balances, collection overview, overdue filter, invoice creation/details, and export.",
    ],
    [
      "Budgets",
      "budgets",
      "Allocation and utilization views with locally editable limits/spend and validation.",
    ],
    [
      "Expenses",
      "expenses",
      "Category summaries, search/filter, and local approve/reject actions.",
    ],
  ]) +
  group("Crypto", "/crypto/", [
    [
      "Market",
      "market",
      "Fixed sample prices, history range selection, movers, watchlist, sorting, and asset details.",
    ],
    [
      "Wallet",
      "wallet",
      "Sample holdings, allocation, cost basis, and unrealized gain/loss. No real wallet connection.",
    ],
    [
      "Exchange",
      "exchange",
      "Preview conversion and a sample 0.25% fee using fixed prices. No order is submitted.",
    ],
    [
      "Transactions",
      "transactions",
      "Ten sample records, type/status filters, sorting, detail dialogs, and export; no transaction hashes or on-chain activity.",
    ],
  ]) +
  group("AI Analytics", "/ai-analytics/", [
    [
      "AI Insights",
      "insights",
      "Eight sample insights, discovery chart, category/status filters, saving, review state, evidence details, recommended actions, and CSV export.",
    ],
    [
      "Chatbot Assistant",
      "chatbot-conversations",
      "Eight sample conversations with user photos, search/channel/status filters, resolve/reopen/review flags, local reply previews, internal notes, and transcript export. No customer messages are sent.",
    ],
    [
      "Predictions",
      "predictions",
      "Six metrics, historical/forecast charts, 7/14/30-day horizons, scenario comparison, assumptions, and CSV export. Forecasts linearly scale a fixed sample trend; optimistic/adverse cases shift it by 8%. Bounds are illustrative +/-12% ranges, not statistical confidence intervals.",
    ],
    [
      "Model Settings",
      "model-settings",
      "Six demo profiles, activation switches, generation/review/runtime/instruction tabs, validation/reset/save, local activity, and JSON export. Temperature 0-1, tokens 256-8192, threshold 50-100, timeout 5-120 seconds, retries 0-3; instructions up to 2000 characters. No live model settings change.",
    ],
  ]) +
  group("School Management", "/school/", [
    [
      "Students",
      "students",
      "Sample directory, profile details, admission form, enrollment status changes, class filters, and export.",
    ],
    [
      "Classes",
      "classes",
      "Class groups, teachers, rooms, sample enrollment, capacity, and roster dialogs.",
    ],
    [
      "Attendance",
      "attendance",
      "Per-date local registers, distribution chart, class completion, attention list, notes/late minutes, selected-student bulk marking, unmarked marking, and undo. Rate = present + late divided by present + late + absent; excused/unmarked are excluded. Late minutes accept 0-240.",
    ],
    [
      "Exams",
      "exams",
      "Sample exam schedule, creation, details, and cancellation. Detects overlapping scheduled exams for the same class or venue; duration is 30-180 minutes.",
    ],
  ]) +
  group("HRM", "/hrm/", [
    [
      "Employees",
      "employees",
      "Grid/list directory, team/work-arrangement/status filters, sorting, profile editing, manager/location/contact details, local photos, duplicate-email validation, and CSV export.",
    ],
    [
      "Payroll",
      "payroll",
      "Sample salary/allowance/deduction breakdown and processed status. No tax calculation or payment is performed.",
    ],
    [
      "Leave Requests",
      "leave-requests",
      "Weekly time-off calendar, priorities, filters/sorting, decision notes/history, same-department coverage check, and duplicate-date request validation. Rejection requires a note. Days are inclusive calendar days, not policy-adjusted working days.",
    ],
    [
      "Performance Reviews",
      "reviews",
      "Create and edit drafts, ratings/feedback, completion, reopening, filters, and export. Completion requires feedback.",
    ],
  ]) +
  group("Hospital Management", "/hospital/", [
    [
      "Patients",
      "patients",
      "Fictional patient directory, details, local registration, status/category filters, and export.",
    ],
    [
      "Doctors",
      "doctors",
      "Generated fictional portraits, grid/list directory, specialty/availability filters, saving, profile and schedule dialogs, local availability changes, and sample booking with duplicate doctor/patient slot checks. Bookings do not update the separate Appointments page.",
    ],
    [
      "Appointments",
      "appointments",
      "Sample queue and booking, doctor/patient duplicate-time checks, and scheduled → checked-in → completed transitions.",
    ],
    [
      "Wards & Beds",
      "wards",
      "Three-floor room layout, map/list, occupancy, bed assignment/transfer, cleaning queue, maintenance states, notes/activity, and export. Transfer marks the source bed cleaning and assigns the patient to the destination. No real admissions system is updated.",
    ],
    [
      "Pharmacy",
      "pharmacy",
      "Inventory catalog, batch/expiry/stock, low-stock filters, and local stock additions of 1-10000 whole units. No prescribing or dispensing workflow.",
    ],
    [
      "Ambulance",
      "ambulance",
      "Fictional fleet cards and local simulated dispatch status. No vehicle is dispatched or emergency service contacted.",
    ],
    [
      "Billing",
      "billing",
      "Sample itemized invoices and paid status. Net = consultation + services - adjustment; no payment is collected.",
    ],
  ]) +
  section(
    "Other route groups",
    p(
      "Existing eCommerce, CRM, Projects, Invoices, Profile, Settings, Pricing, FAQ, component galleries, forms, tables, charts, authentication variants, email templates, and error pages are listed below. Read their implementations before assuming backend behavior.",
    ),
  ) +
  section(
    "Legacy HTML URLs",
    p(
      "Legacy HTML routes either render the matching dashboard directly or redirect to canonical workspace pages. Redirect examples include <code>/doctor-directory.html</code>, <code>/floor-layout.html</code>, <code>/employees-list.html</code>, <code>/attendance-list.html</code>, and <code>/insights-list.html</code>. The complete inventory marks redirects.",
    ),
  );
const routeTable = table(
  ["Route", "Source file", "Behavior"],
  routeRows.map((r) => [
    r.url.includes("$")
      ? `<code>${escape(r.url)}</code>`
      : `<a href="${escape(r.url)}"><code>${escape(r.url)}</code></a>`,
    `<code>${escape(r.source)}</code>`,
    r.alias ? "Redirect / section index" : "Page",
  ]),
).replace("<table>", "<table data-route-inventory>");
const routes =
  `<label for="route-search">Filter route inventory</label><input class="search" id="route-search" type="search" placeholder="Search route or source file"><p id="route-count" role="status">${routeRows.length} routes</p>` +
  routeTable;
const pkg = JSON.parse(
  fs.readFileSync(path.join(root, "package.json"), "utf8"),
);
const dependencies = ["dependencies", "devDependencies", "overrides"]
  .map((key) =>
    section(
      key,
      table(
        ["Package", "Declared specification"],
        Object.entries(pkg[key] ?? {})
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([name, version]) => [
            escape(name),
            `<code>${escape(typeof version === "string" ? version : JSON.stringify(version))}</code>`,
          ]),
      ),
    ),
  )
  .join("");
const template = fs.readFileSync(
  path.join(root, "centro-documentation/template.html"),
  "utf8",
);
for (const [filename, page] of Object.entries(pages)) {
  const body = page.body
    .replace("{{FEATURES}}", features)
    .replace("{{ROUTES}}", routes)
    .replace("{{DEPENDENCIES}}", dependencies)
    .replace("<h2>LTR and RTL</h2>", '<h2 id="rtl-ltr">LTR and RTL</h2>');
  const content = page.preserveLayout
    ? body
    : `<p class="eyebrow">Version 1.0.0 documentation</p><h1>${escape(page.title)}</h1><p class="lead">${page.intro}</p>${body}<p class="footer-note">Centro / Version 1.0.0 / Updated October 10, 2026</p>`;
  const pageTemplate = page.template
    ? fs.readFileSync(
        path.join(root, "centro-documentation", page.template),
        "utf8",
      )
    : template;
  const html = pageTemplate
    .replace("{{TITLE}}", escape(page.title))
    .replace("{{CONTENT}}", content)
    .replaceAll("v1.0.0 Documentation", "v1.0.0 Documentation")
    .replace('href="css/style.css"', 'href="css/style.css?v=1.0.0"')
    .replace('src="js/main.js?v=1.0.2"', 'src="js/main.js?v=1.0.0"')
    .replace(
      /<h3>Customize<\/h3>(?!\s*<a[^>]+href="customization.html#rtl-ltr")/,
      '<h3>Customize</h3><a class="nav-link" href="customization.html#rtl-ltr" data-keywords="rtl ltr direction right left layout">RTL / LTR</a>',
    );
  fs.writeFileSync(path.join(target, filename), html);
  fs.writeFileSync(path.join(root, "centro-documentation", filename), html);
}
for (const name of ["css", "js", "assets"]) {
  fs.cpSync(
    path.join(root, "centro-documentation", name),
    path.join(target, name),
    {
      recursive: true,
    },
  );
}
fs.writeFileSync(path.join(root, "CHANGELOG.md"), "# Changelog\n\n## Version 1.0.0\n\n- Initial release of Centro.\n");
console.log(
  `Generated ${Object.keys(pages).length} documentation pages and changelog; inventoried ${routeRows.length} routes.`,
);
