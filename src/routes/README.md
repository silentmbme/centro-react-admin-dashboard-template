# Routes

TanStack Start uses **file-based routing**. Every `.tsx` file in this directory
defines a route. Do **not** create `src/pages/`, `src/routes/_app/index.tsx`, or
`app/layout.tsx` those are Next.js / Remix conventions. The only root layout
is `src/routes/__root.tsx`.

## Conventions

| File                     | URL                                                               |
| ------------------------ | ----------------------------------------------------------------- |
| `index.tsx`              | `/`                                                               |
| `about.tsx`              | `/about`                                                          |
| `users/index.tsx`        | `/users`                                                          |
| `users/$id.tsx`          | `/users/:id` (dynamic bare `$`, no curly braces)                  |
| `posts/{-$category}.tsx` | `/posts/:category?` (optional segment)                            |
| `files/$.tsx`            | `/files/*` (splat read via `_splat` param, never `*`)             |
| `_layout.tsx`            | layout route (renders children via `<Outlet />`)                  |
| `__root.tsx`             | root route preserves `<Outlet />`; workspace pages use `AppShell` |

`routeTree.gen.ts` is auto-generated. Don't edit it by hand.

## Current route reference

See [the generated inventory](../../public/documentation/pages.html) for all route paths and legacy redirects. Run `npm run docs:build` after route changes. Section indexes redirect to their first workspace; files such as `doctor-directory[.]html.tsx` retain legacy HTML URLs. Keep feature behavior in `src/components/` and route files focused on composition.
