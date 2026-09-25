<!--
Wayfinder ticket: the single template for every issue. Keep the `## headings` and fill each one.

A ticket is written BEFORE implementation, for someone who may pick it up with no other context:
  • Present or imperative tense. Never past tense or a changelog voice. Acceptance criteria stay unchecked.
  • Detailed enough to implement cold: explain the why, name the files/modules/patterns, the traps,
    and the seams to test. No code snippets or line numbers (they go stale).
  • Link the docs/SPEC.md sections this implements rather than restating decisions differently.
  • Title: `type(scope): summary` with type `feat` or `fix`. Once the issue has a number, edit the
    title to `type(scope): WAY-<n> summary`. The implementing PR reuses it exactly.
  • Labels: `enhancement` (feat) or `bug` (fix), plus `ready-for-agent` or `ready-for-human`.
  • Full rules: AGENTS.md → Issues.
-->

## Change type

`feat` <!-- one of: feat | fix | feat! | fix! -->

## Summary

<!-- 2–5 sentences: what is true once this ships that isn't today, and the shape of the change. -->

## Background & problem

<!--
The long section. Everything an implementer needs to understand the "why": the current state, what is
missing or broken, the SPEC sections and decisions that bound the solution, and any relevant history.
-->

## Scope

| Area | What changes |
| --- | --- |
|  |  |

## Acceptance criteria

- [ ]
- [ ]
- [ ] Tests cover the behaviour at its seam(s)

## Technical approach & notes

<!--
Files, modules, patterns, interfaces and traps a cold implementer needs. Name the files. No code
snippets or line numbers.
-->

## Testing

<!--
Which seams to test and how: what to fake (e.g. the route provider) and what stays real, and what is
deliberately not unit-tested (checked on the phone instead) and why.
-->

## Depends on

- None (can start immediately) <!-- or one bullet per blocker, starting with the link: `- #NN — what it provides`. Add a native "blocked by" link for each (AGENTS.md → Issues). -->

## Out of scope

<!-- Explicit non-goals, where they matter. Omit if there are none. -->

## Notes

<!-- Optional. References, open defaults to confirm, links to related tickets. Omit if empty. -->
