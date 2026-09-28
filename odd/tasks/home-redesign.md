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

## Evidence
- T1: LandingPage.tsx rewritten, site.ts copy restructured (`intro` replaced by `about[]`). `npx astro build`: 11 pages, Complete. No em dash in copy.
- T2: local render at 1440x900 and 390x844, ES and EN: horizontal overflow 0 in all four; sections render in order hero, about+now, blog, contact.
- T3: commit b9424df fast-forwarded to main and pushed; Pages run 36497824446 success (45s); live www.fullfran.com serves the new copy (whoami, sobre-mi.md, Ver CV).

## Next step
Next session: decide whether to add a projects section (grouped by domain) and whether headings should read as slugs (`~/sobre-mi`) instead of titles (`~/Sobre mí`).
