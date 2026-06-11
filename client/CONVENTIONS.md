# Client conventions

How frontend code in this repo is written. Read before adding or moving a file.
The project is **JavaScript + JSDoc** (no TypeScript) — JSDoc `@typedef` and
`@param` annotations are first-class and the IDE reads them via `// @ts-check`.

## React

- **Function components only.** No class components.
- **Named exports for components.** `export function UserCard() {}` — never a
  default export. The one exception is a module's main component, defined in the
  barrel as `export const Name = () => {…}` (see *Module structure*).
- **One component per file.** The filename matches the component
  (`UserCard.jsx` exports `UserCard`). Anything that returns JSX from a named
  function is a component and lives in its own file.
- This is a Vite SPA — no server/client component split.
- **Rules of hooks** apply (ESLint enforces): never call hooks conditionally.
  Don't extract a custom hook just because the code sits in a `useEffect`.
- **Composition over prop-drilling.** When two levels of drilling appear, lift
  state to the nearest common ancestor or add a module-scoped context.
- Refs are an escape hatch — focus management, scroll, integrating non-React
  libraries. Not "easier than state."

## File naming

- Components: `PascalCase.jsx` — `UserForm.jsx`, `UserCard.jsx`.
- Pages: `PascalCase.jsx` under `src/pages/` — `UsersPage.jsx`.
- Non-component JS: `kebab-case.js` — `use-api-users.js`, `routes.js`, `tokens.js`.
- Hooks: `use-foo.js` filename, `useFoo` export (camelCase signals a hook).
- One barrel per folder, and the barrel **is** the main file: it defines the
  folder's primary component/value as a **named** export (never a default), not a
  re-export of a same-named sibling. Use `index.jsx` when it holds a component,
  `index.js` otherwise. A pure re-export `index.js` is allowed **only** for a flat
  collection of peers with no single main file (e.g. `base`).

## Module structure

- All code under `src/`.
- **Pages live in `src/pages/`** — one page (container) component per file, and
  nothing else in that folder. A page owns local UI state, wires the query and
  mutation hooks, and composes module components. It's the only layer that
  reaches into both the api layer and feature modules.
- **Feature code under `src/modules/<feature>/`.** This app has `base`
  (reusable primitives) and `users` (the CRUD feature). Modules expose
  components and helpers; they don't own page-level wiring.
- **A folder defines its main component directly in its barrel** — the folder's
  `index.jsx` *is* the component (a named export, `export function Foo(…)` or
  `export const Foo = () => {…}`), not a re-export of a separate `Foo.jsx`.
  **Never create a re-export-only barrel** whose entire body is
  `export { Foo } from "@modules/.../Foo/Foo"` — that file earns nothing; put the
  component in `index.jsx` and delete the extra file. Sibling public components
  and helpers live in their own files alongside it and are imported in; the
  module's barrel may re-export those siblings alongside its own main component to
  form the public surface. A flat collection of peers with no single main
  component (e.g. `base`) is the one case that stays a pure **`index.js`**
  re-export barrel.

### When a flat file becomes a folder

A flat `Foo.jsx` is the right shape only when it holds exactly one props
`@typedef` and one exported component. The moment it grows a local hook,
top-level constants, a second type, an extra component, or a non-trivial pure
helper, it graduates to a folder:

```
Foo/
  index.jsx       # the main component itself — `export function Foo(…)` (named, no default)
  types.js        # the props @typedef + any other types
  hooks.js        # local custom hooks
  constants.js    # lookup maps / constants
  utils.js        # pure helpers
  SubFoo.jsx      # one file per additional component
```

Drop any file that isn't needed. A `Foo/` folder whose `index.jsx` is the only
file is a smell — promote it back to a flat `Foo.jsx`.

Hard rules:

- **Never more than one component per file.**
- The folder's `index.jsx`/`index.js` is the public entry and holds the main
  component; nothing outside the folder reaches past it.
- Internal files import each other through their alias path — no `./` or `../`.

## Imports

- **Inside `src/`, never use `./` or `../`.** Every import resolves through a
  root-relative alias. No exceptions.
- **Alias inventory** — mapped in `jsconfig.json` (`compilerOptions.paths`) and
  mirrored in `vite.config.js` (`resolve.alias`). Edit **both** in the same
  change; keeping them in sync is the cost of having no plugin between them.

  | Alias | Resolves to | Use for |
  |---|---|---|
  | `@/*` | `src/*` | catch-all; only when no specific alias fits |
  | `@theme/*` | `src/theme/*` | design tokens + Chakra system |
  | `@lib/*` | `src/lib/*` | cross-module infrastructure (the API layer) |
  | `@pages/*` | `src/pages/*` | page (container) components |
  | `@base/*` | `src/modules/base/*` | reusable UI primitives |
  | `@modules/*` | `src/modules/*` | feature modules (import the **barrel** only) |

- **Pick the most specific alias.** `@theme/tokens` beats `@/theme/tokens`;
  `@base/Field` beats `@modules/base/Field`.
- **Only a module's barrel is importable from outside the module**
  (`@modules/users`, never `@modules/users/UserCard`). Cross-file imports
  *inside* a module still go through the alias (`@modules/users/UserForm`).
- **Order:** third-party → local (alias-prefixed). One blank line between groups.
- No circular imports. If you hit one, extract shared types to a lower file.

## Styling

Chakra UI v3 is the design system — and the only styling source. Default
everything to Chakra components and props: `<Box>`, `<Stack>`, `<Heading>`,
`<Text>`, `<Button>`, inputs. Use Chakra's `_hover`, `_focus`, `_disabled` for
interaction states. Theme overrides live in `@theme` via `createSystem`.

## State management

- **Local state first.** `useState` / `useReducer` for component state.
- **Server state lives in TanStack Query**, never mirrored into local state.
- React Context only for cross-component state **within a module**.
- **No Redux, Zustand, or Jotai.** Local state + Query is sufficient here.

## Types (JSDoc)

- Every exported function/component gets a JSDoc block with `@param`/`@returns`.
- Shared shapes are `@typedef` declarations; import them across files with
  `@typedef {import('@lib/api/types').User} User`.

## Comments

- Default to no comments. Names carry the meaning.
- Comment **why** when it's non-obvious — a hidden constraint, a subtle
  invariant, a deliberate departure. Don't comment **what** (`// increment` is
  noise). No ticket/PR references in code. One line max.
