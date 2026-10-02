# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Status

v1 is implemented per the GitHub Issues on `zeksdev/PizzaCalculator`: **#1** is the parent spec (Pizza Dough Calculator PWA v1) and **#2–#8** are its vertical-slice tickets. Read #1 before changing behaviour.

## Commands

- `npm install`: install dependencies
- `npm run dev`: dev server (served under `/PizzaCalculator/`)
- `npm run typecheck`: TypeScript check
- `npm test`: the full Vitest suite
- `npx vitest run src/App.test.tsx`: a single test file (add `-t "<name>"` for a single test)
- `npm run build`: typecheck + production build with the PWA service worker into `dist/`

Every push to `main` runs `.github/workflows/deploy.yml`, which tests, builds and deploys to GitHub Pages.

## Code map

- `src/dough/dough.ts`: the pure calculation module (formula, recommended yeast table, proofing timelines, defaults, limits)
- `src/format.ts`: Serbian number formatting and input parsing; `src/quantitiesText.ts`: Quantities lines and the share text
- `src/strings.ts`: all UI text, plus the Serbian plural rule for ball counts
- `src/useCalculator.ts`: calculator state, reset rules, clamping, persistence (`localStorage` key `moja-pizza.inputs.v1`)
- `src/components/`: the design-system components; `src/screens/`: Calculator, Quantities, Recipe
- `src/App.tsx`: app shell; `src/routes.ts`: hash routes (`#/`, `#/kolicine`, `#/recept`)
- `public/recept/korak-N.jpg`: recipe step photos (placeholders). Replace a file to swap its photo.

## Domain

- `CONTEXT.md` is the domain glossary: Batch, Dough ball, Ball weight, Baker's percentage, Hydration, Yeast type, Recommended yeast percentage, Proofing schedule, Cold/Room proof, Quantities, Recipe. Use these terms in code, tests and issues, and avoid the synonyms listed under each term's _Avoid_ line. Each term also lists the Serbian label used in the UI.
- `docs/adr/` holds the decision records. **ADR 0001: Ball weight excludes yeast.** Flour = balls × ballWeight ÷ (1 + hydration + salt), and yeast is added on top. This is intentional; don't "fix" it.
- `docs/pizza-workshop.pdf` is the source recipe the defaults come from. Its numbers are used, but its text and branding are not.

## Key constraints (from #1)

- React + Vite + TypeScript PWA, deployed to GitHub Pages from `main`. No backend.
- UI language is Serbian, Latin script only, with decimal commas. All UI text lives in one strings module.
- The defaults must reproduce the source recipe: 6 × 280 g, Instant dry yeast, 72h proofing, yeast 0,10%, Hydration 65%, salt 3% → 1000 / 650 / 30 / 1 g.
- No Ooni, Grill-On-Fire or Weber names or logos.

## Design system

The UI follows the **Moja Pizza** design system: https://claude.ai/artifact/XbGLVhKbqXxbkJHNHb3bbL. "Moja Pizza" is also the app's name. Read it with the Artifact tool's `read` action, never with a web fetch:

- `project/README.md`: the brand book. Read it first.
- `project/tokens.json`: color, type, spacing, radius, size and shadow tokens. Turn them into CSS custom properties that keep the token names (`--accent`, `--space-4`, …), and never hard-code the values.
- `project/components/<Name>/README.md` and `preview.html`: guidelines and a static reference for Header, SectionHeader, Stepper, SegmentedControl, Button, SummaryBar, IngredientRow, TabBar and Toast.

The system has no JS bundle; the app implements these components itself in React. Rules most likely to matter in code:

- Light theme only, and flat: borders separate things, and `shadow-toast` is the only shadow.
- `accent` yellow marks only the single next action and the current selection. Text on it is always `on-accent` (graphite), never white. `cold` and `warm` are used only for the two proofing-stage icons.
- The summary bar and the toast are the only dark (`ink`) surfaces.
- Fonts come from Google Fonts: Bricolage Grotesque (`display`) for titles, numbers and button labels, and Figtree (`sans`) for everything else.
- Yeast type and Proofing schedule are **segmented controls**, not dropdowns.
- Izračunaj sits in a sticky bar above the tab bar.
- Nothing tappable is smaller than 44px. Steppers are 54px tall and buttons 56px.
- Icons are inline 24×24 stroke SVGs using `currentColor`. Never emoji.
- Use `aria-pressed` on segments and `aria-expanded` on the advanced-settings toggle. − / + at a limit get the `disabled` attribute, not just a color.

## Screen designs

Phone-size (390×844) reference screens are on the **Moja Pizza** design canvas: https://claude.ai/artifact/7to2mD2sG8p4eodhi3ErDX. Read them with the Artifact tool, starting with `project/canvas.json`; each screen is a `project/<Name>.dc.html` file. They are references for layout and copy, not code to copy: the inline hex values correspond to the design-system tokens.

| Board | Shows |
|---|---|
| `Main` | Calculator: Testo (Broj loptica, Težina loptice), Vrsta kvasca, Fermentacija with a timeline caption, Napredna podešavanja collapsed with a summary line, sticky Izračunaj |
| `Napredna` | Advanced settings expanded: section Procenti; yeast overridden (0,18% against the recommended 0,13%); salt at its 4% maximum with + disabled and the caption "Najviše 4%" |
| `Kolicine` | Quantities at the defaults: back button, dark summary bar, Sastojci with Izmeni, an "Ukupno testo" total row (includes yeast, per ADR 0001), the Fermentacija timeline, and Podeli + Pogledaj recept |
| `Podeli` | Quantities for Isti dan with Sveži yeast (4 × 260 g), plus the toast "Količine su kopirane u klipbord" |
| `Recept` | "Testo za picu", the subtitle "8 koraka · količine i vreme fermentacije su u kalkulatoru", and 8 step cards with photo placeholders `korak-1.jpg` … `korak-8.jpg` |

Counts use Serbian plural forms ("1 loptica", "4 loptice", "6 loptica"), so ball counts need a plural rule, not string concatenation.

## Architecture

All dough math lives in a pure calculation module that doesn't depend on React. Screens only render its output and format the numbers.

Tests use exactly two seams:
1. The fully rendered app, driven like a user with React Testing Library.
2. The calculation module, with table-driven tests.

Test external behaviour only, never internals.
