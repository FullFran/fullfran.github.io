# Home redesign (friendlier terminal landing)

## Objective
Make the fullfran.com home better organised and friendlier while keeping the terminal aesthetic. Reference: antoniogalan.es (clear sections, centred section titles, CV as a secondary view).

## Scope (authorized 2026-09-29)
- Home only (`page/src/components/LandingPage.tsx`, copy in `page/src/data/site.ts`).
- Order: hero (with "CV" button) -> about me (warmer, not boastful) + now -> blog (latest posts) -> contact.
- No projects section (deferred; decide next session).
- Blog pages, `/cv` and the `~` terminal view stay untouched.
- Deploy: merge to `main` and push (GitHub Pages workflow), authorized by the user.

## Constraints
- Copy in Fran's voice: peninsular Spanish, parentheses instead of em dashes, no self-granted adjectives ("production-grade" etc.), no "partner/socio" for Hagalink.
- Only verified facts (existing site.ts copy, portfolio.json).
- TDD: global strict TDD is on, but this project has no test runner; checks are `npx astro build` + rendered visual check (desktop and mobile).

## Tasks
- [x] T1 Rewrite landing layout and copy (route: delegated writer, trigger: 2 non-trivial files)
- [x] T2 Build + visual check desktop/mobile, ES/EN
- [x] T3 Commit, merge to main, push, confirm deploy workflow
- [x] T3b Remove "Lead AI Engineer" title from home and terminal (user request), commit content(home), deployed
- [x] T4 Terminal view (`~`) mirrors the home interactively (about, now, blog, contact), can list and read blog posts, keeps vim-style navigation, drops the CV-like content (experience/skills) (route: delegated writer, trigger: Portfolio.tsx + portfolio.json non-trivial)
- [x] T5 Link "teclado partido de 34 teclas" / "34-key split keyboard" in the about to /fifi-keyboard-vial/ (user request)

## Evidence
- T1: LandingPage.tsx rewritten, site.ts copy restructured (`intro` replaced by `about[]`). `npx astro build`: 11 pages, Complete. No em dash in copy.
- T2: local render at 1440x900 and 390x844, ES and EN: horizontal overflow 0 in all four; sections render in order hero, about+now, blog, contact.
- T3: commit b9424df fast-forwarded to main and pushed; Pages run 36497824446 success (45s); live www.fullfran.com serves the new copy (whoami, sobre-mi.md, Ver CV).
- T4: Portfolio.tsx rewritten (tabs about/blog/contact/help from site.ts, read posts in-terminal via Enter, tap or `:e <text>`, `q` back, `:cv`), fake admin login removed, portfolio.json deleted; home blog list shows 5 posts + "Ver más" (+5). Browser check: 5 -> 9 posts, button hides; Enter/`:e gatos`/tap open posts; `:q` exits; mobile overflow 0; no page errors. Fixed duplicated bullet in list lines. Known cosmetic: line-number gutter does not follow wrapped lines.
- T3b: commit "content(home): quitar el titulo lead ai engineer", deployed, live grep "lead ai" = 0.
- T4 deploy: 4d593f5, Pages run 36498489522 success.
- T5: keyboard link, Pages run 36498630288 success, live href present.

## Next step
Next session: decide whether to add a projects section (grouped by domain) and whether headings should read as slugs (`~/sobre-mi`) instead of titles (`~/Sobre mí`).
User idea for later: make the terminal feel like a real shell (`ls`, `cat`, `vi`) and add an `agent` command that opens an AI assistant with RAG over his own writing, in his voice.
