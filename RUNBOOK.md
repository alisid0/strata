# Runbook — how to run everything in this repo

Three separate machines live here. They do not share a toolchain, and two of
them do not share `node_modules`. Work out which one you are touching first.

| Machine | Lives in | Ships to |
|---|---|---|
| **Qubix** — the Svelte app | repo root, `src/` | qubix.university |
| **Calculus Made Easy** — the interactive edition | `build/`, `content-drafts/` | static HTML pages (not yet shipping) |
| **Mustang Lab** — the physics lab | `ziNA5HJw/mustang-lab/` | standalone, not shipping |

Prerequisites: Node 22 (`node -v`), and `npm`. Git Bash or PowerShell both work.

---

## 1. Qubix — the app

### Run it locally

```bash
npm install          # once, or after a branch change that touches package.json
npm run dev          # http://localhost:5173
```

**`npm run dev` runs against STAGING**, not production. Staging and production
are separate Supabase projects with separate user data. Use
`npm run dev:production` only when you specifically need production data.

### Check it before shipping

```bash
npm run build:staging     # compile check — catches Svelte/CSS errors
npm run test:security     # HTML sanitiser
npm run audit:live-media  # what is actually live; run before claiming BB counts
```

### Ship it

A git push does **not** deploy. Deployment is a separate manual step.

```bash
git push origin main      # code to GitHub — changes nothing live
npm run deploy            # builds production, deploys to Vercel, re-aliases
```

`npm run deploy` builds production explicitly, pushes to Vercel, then aliases
`strata-nine-pi.vercel.app`, `qubix.university` and `www.qubix.university`.
Run it from a clean worktree, or you ship whatever is lying around uncommitted.

### Verify it actually went live

Do not trust "deploy succeeded". Check the deployed bundle:

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://qubix.university/
```

Then grep the live JS/CSS bundle for a string unique to your change. If the
string is missing, you are looking at a cached older build.

### Two traps that have already bitten

- **Maths draft count.** Adding a BB number to a maths path in
  `src/lib/content/paths.js` without adding a matching draft to the maths
  final-drafts JSON makes the whole app throw
  `Mathematics fallback mismatch: N drafts for M boards` and render blank —
  locally and in any local build. Production is only affected if you commit it.
- **Concurrent sessions.** If two agents edit this repo at once you will get a
  half-merged working tree. Check `git status` before committing, and commit
  only the files you actually changed.

---

## 2. Calculus Made Easy — the interactive edition

Dev-only toolchain that turns Thompson's LaTeX into pre-rendered pages. It has
its **own `node_modules`** and is not part of the Qubix build.

### Set up once

```bash
cd build
npm install          # installs mathjax-full here, NOT at the repo root
cd ..
```

### The source

`content-drafts/33283-t.tex` — Project Gutenberg ebook 33283, Thompson's
*Calculus Made Easy*, second edition, public domain. It is **latin1**, not
UTF-8; read it with the right encoding or the mathematics turns to mojibake.

### Split the book into chapters

```bash
node build/split-chapters.mjs
```

Cuts at Thompson's own chapter breaks into `build/chapters/`, one `.tex` per
chapter, plus `manifest.json` recording each chapter's exercise sets and how
much mathematics it carries.

Expect: **22 files, 21 numbered chapters, 18 exercise sets**, none in chapters
I–III, the first two in IV and V.

The `.tex` chapter files are regenerable and gitignored. `manifest.json` is
committed, because it is the book's structure at a glance.

### Render mathematics

```bash
node build/render-math.mjs --test
```

Self-test: renders a spread of Thompson's kinds of expression, checks that no
glyph reference dangles, prints the size cost, and writes
`build/_mathtest.html`. **Open that file in a browser and look at it.** The
failure mode here is silent — fraction bars draw while every letter and digit
vanishes — so a green check is not sufficient evidence.

To use it in a page:

```js
import { PageMath } from './build/render-math.mjs';
const math = new PageMath();
const eq = math.render('\\dfrac{dy}{dx} = n\\,x^{n-1}', { display: true });
// emit math.styleCss() once in <head>; drop eq wherever the equation goes
```

Each expression is rendered through its own MathJax document so its glyphs are
inlined and it renders anywhere it is dropped, including a page opened straight
off disk with no server. Cost is roughly 5 kB per expression. Do not "optimise"
this to a shared font cache without testing the result in a `file://` page —
that is exactly the configuration that fails silently.

---

## 3. Mustang Lab — the physics lab

Self-contained static site. No build step, no dependencies.

```bash
cd ziNA5HJw/mustang-lab
python -m http.server 8000     # then http://localhost:8000
node test/physics.test.mjs     # 38 checks, must stay green
```

**It will not work by double-clicking `index.html`** — browsers block ES module
imports over `file://`. Serve it over HTTP. (`standalone-mustang.html` is the
single-file car with no lessons, and that one does open directly.)

`src/physics.js` imports nothing, on purpose, so the tests run in Node without
graphics. Keep it that way.

See `ziNA5HJw/mustang-lab/HANDOVER-DEEPSEEK.md` for the build plan.

---

## Quick reference

```bash
# Qubix
npm run dev                    # staging, localhost:5173
npm run build:staging          # compile check
npm run deploy                 # build + deploy + alias (clean worktree)

# Calculus
cd build && npm install && cd ..
node build/split-chapters.mjs  # book -> per-chapter source
node build/render-math.mjs --test

# Mustang
cd ziNA5HJw/mustang-lab && python -m http.server 8000
node ziNA5HJw/mustang-lab/test/physics.test.mjs
```
