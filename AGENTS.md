# AGENTS.md

Reference for AI agents (and contributors) working in this repository: what the project is, where decisions live, and how work is tracked and shipped.

This is the basic version. Commands, project layout, code conventions and testing rules are added with the first code (WAY-3, [#3](https://github.com/itsDaiton/wayfinder/issues/3)).

---

## Project

Wayfinder is a personal Android app for planning running, walking and cycling routes on a Mapy.com map. It's built with React Native (Expo) and TypeScript, and installed directly as an APK.

The repo currently holds documents only; there is no code yet.

## Source of truth

- **[docs/SPEC.md](./docs/SPEC.md)** covers the product:
  - how the app behaves (§1–8)
  - the technical decisions (§9)
  - the acceptance checklist for version 1 (§10)
- **GitHub Issues** hold the work. Version 1 is epic [#2](https://github.com/itsDaiton/wayfinder/issues/2), with one sub-issue per ticket. Version 2 is backlog epic [#17](https://github.com/itsDaiton/wayfinder/issues/17).

A change that alters how the app behaves updates `docs/SPEC.md` in the same PR. A change to how the repo works (workflow, conventions) updates this file in the same PR. Docs that describe the old way are a bug, not a nit.

---

## Git workflow

- **Never commit directly to `main`.** All work goes through a branch and a pull request.
- **Branch names:**
  - `type/way-<n>-<slug>` for ticket work, e.g. `feat/way-5-tap-to-route`
  - `type/<slug>` for work without a ticket
- **One logical change per branch.** Prefer one ticket per PR, and don't bundle unrelated changes.
- **Never commit secrets:** the Mapy.com API key, the signing keystore and its passwords stay in git-ignored files (SPEC §9.6).

### Conventional Commits everywhere

**Commit messages, PR titles and issue titles, including epics, all use [Conventional Commits](https://www.conventionalcommits.org/): `type(scope): summary`.**

- **Types: `feat` and `fix` only**, with `feat!` / `fix!` for a breaking change. This is the same rule as nebula-chat, so Release Please can be added later without rewriting history.
  - `feat`: new capability someone could use or notice, e.g. a new screen, action or documented convention.
  - `fix`: everything else, e.g. bug fixes, docs, tooling, CI, refactors, tests, dependency bumps. When in doubt, `fix`.
  - Don't use `chore`, `docs`, `refactor`, `style`, `test`, `build`, `ci` or `perf`.
- **Scope names the area** the change touches: `app`, `build`, `planning`, `stats`, `routes`, `export`, `settings`, `backup`, `map`. Leave it out for repo-wide changes (docs, `AGENTS.md`) and for epics.
- **Summary:** lowercase, imperative, no trailing period. Keep the whole subject line under 72 characters.

### Ticket IDs

Every issue is a ticket with the key **`WAY-<issue-number>`**: issue `#5` is `WAY-5`. The key is an alias for the issue number; there is no separate counter.

- **Issue titles carry the key:** `type(scope): WAY-<n> summary`, meaning the key, a space, then the summary, with no colon after the key.
  - Ticket: `feat(planning): WAY-5 plan a route by tapping`
  - Epic: `feat: WAY-2 v1 manual route planning`
  - The issue number is only known after creating the issue, so edit the title right after.
- **The PR title is the issue title**, reused exactly.
- **The PR body has a `Closes #<n>` line.** GitHub closes issues by the bare `#n`, not by the `WAY-` key.
- **Work without a ticket** uses a plain `type(scope): summary` title.
- **Gotcha:** GitHub closes an issue when a merged PR's title, body or commits contain a closing keyword (`close`, `fixes`, `resolves`) before `#n`, even inside "do not close #n". To mention an issue a PR doesn't resolve, write "issue 5" or avoid the keyword.

### Pull requests

- Open PRs against `main`, as drafts until they're ready for review.
- The body has:
  - a short summary of what changed and why
  - `Closes #<n>`
  - a test plan, including which SPEC §10 checklist items were checked on the phone
- Keep PRs small. A ticket too big for one PR should be split into new tickets, not left half-closed.

---

## Issues

Tickets follow the skeleton in [`.github/ISSUE_TEMPLATE.md`](./.github/ISSUE_TEMPLATE.md), which pre-fills new issues in the browser.

**Sections:** Change type · Summary · Background & problem · Scope · Acceptance criteria · Technical approach & notes · Testing · Depends on · Out of scope · Notes.

**How to write one:**
- **A ticket comes before implementation.** Write it in the present or imperative tense ("Add…", "The map shows…"), never as a changelog. Acceptance criteria stay unchecked.
- **Detailed enough to implement cold,** by someone with no other context: explain the why, name the files, modules and patterns, and call out the traps and the seams to test.
- **No code snippets or line numbers.** They go stale.
- **Point to the spec.** Link the SPEC sections the ticket implements instead of restating decisions differently.

**Labels:**
- `enhancement` for a `feat`, `bug` for a `fix`.
- One state label:
  - `ready-for-agent`: fully specified; an agent can implement it
  - `ready-for-human`: needs the phone, secrets or accounts
- `epic` for tracking issues, plus `backlog` for an epic that hasn't started.

**Structure and dependencies:**
- Tickets are sub-issues of their epic.
- Each ticket's **Depends on** section lists its blockers, one bullet per blocker starting with `#n` (`- #3 — the Expo project`), or a single `- None (can start immediately)`.
- **Every bullet is also a native GitHub "blocked by" link**, so tools can tell which tickets are ready. Keep the two in sync: when you add or remove one, do the other.

  ```bash
  # <blocker-id> is the blocker's database id, NOT its #number:
  gh api repos/itsDaiton/wayfinder/issues/<blocker> --jq .id

  gh api --method POST repos/itsDaiton/wayfinder/issues/<n>/dependencies/blocked_by -F issue_id=<blocker-id>
  gh api --method DELETE repos/itsDaiton/wayfinder/issues/<n>/dependencies/blocked_by/<blocker-id>
  gh api repos/itsDaiton/wayfinder/issues/<n>/dependencies/blocked_by   # list blockers
  ```

- **A ticket is ready to pick up when it has no open blockers**: `gh api repos/itsDaiton/wayfinder/issues/<n> --jq .issue_dependencies_summary.blocked_by` returns `0`. A blocker must be closed, not just referenced, to unblock it.

---

## Architecture rules already decided

These come from SPEC §9 and apply from the first line of code:

- **Route logic is plain TypeScript** with no React or React Native imports, so it can be unit-tested with Jest.
- **Only the provider module talks to Mapy.com.** It sits behind a small interface (route, elevation, tile URL), so the provider can be swapped in one place.
- **Routes store the positions the user tapped,** not snapped ones. Snapped positions and paths are derived.
- **Estimated time is always calculated, never stored.**
