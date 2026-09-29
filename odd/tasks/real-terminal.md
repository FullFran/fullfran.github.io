# Real terminal (shell) for fullfran.com

## Objective
Make the `~` terminal feel like a real shell: a prompt where you type `ls`, `cd`, `cat`, `vi`... over a virtual filesystem made of the site content, instead of only a tabbed vim viewer.

## Scope (authorized 2026-09-29)
- Phase 1 (this doc): shell over a virtual FS built from `site.ts` + blog posts; `vi <file>` opens the existing vim viewer (Portfolio.tsx) on that file and `:q` returns to the shell. Mobile usable.
- Phase 2 (NOT authorized yet, needs user decisions): `agent` command with RAG over Fran's writing in his voice. Needs a backend (site is static on GitHub Pages), a model provider and a cost ceiling.

## Constraints
- Copy: Fran's voice, peninsular Spanish, no em dash, no self-granted titles (no "lead", "socio", "fundé"), ES/EN.
- TDD: strict TDD enabled in global user config (source: ~/.claude/CLAUDE.md "Strict TDD Mode: enabled"). No runner existed; adding `vitest` as devDependency (same runner as fifi-keyboard-vial). Runner: `cd page && npx vitest run`. RED -> GREEN -> REFACTOR for the pure shell core.
- Checks: `npx vitest run`, `npx astro build`, browser check desktop 1440 + mobile 390.
- Delivery: forecast ~700 authored lines; repo policy is direct pushes to `main` (solo repo), delivered as one work-unit commit per task.

## Tasks
- [x] T1 Shell core (pure TS): virtual FS, path resolution, parser, commands, completion; vitest tests first (route: delegated writer, trigger: new module + tests + package.json)
- [x] T2 Shell UI + wiring: prompt/output component, history, Tab completion, mobile chips, `vi` handoff to Portfolio viewer, `exit` to landing (route: same delegated writer)
- [x] T3 Browser check desktop/mobile, ES/EN; deploy
- [ ] T4 (phase 2, pending user decisions) `agent` with RAG

## Evidence
- T1 dd49910: shell core in page/src/lib/shell (fs, path, parse, markdown, commands, complete). RED observed first (5 files failing, modules missing), GREEN 55/55 (`npx vitest run`).
- T2 acc42ed: Shell.tsx (prompt, banner, history, Tab, Ctrl+L/C, mobile chips, tappable ls), Portfolio `initialBuffer` + `onReturnToShell`, App wiring.
- T3: parent re-ran vitest 55/55 and astro build OK. Browser 1440: ls, cd, ls -l, pwd, grep, unknown cmd, sudo, history Up, vi + :q back to shell, exit to landing; Tab `cat blog/los` -> full slug, `ne` -> neofetch. Mobile 390: chips + tappable ls, overflow 0. No page errors.
- Known: pre-existing em dashes in page titles/CSS comments outside the shell (not touched); touch devices do not auto-focus the input.
