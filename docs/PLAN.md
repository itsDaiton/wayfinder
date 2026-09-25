# Wayfinder — Build Plan

**Last updated:** 25 Sep 2026 · See [SPEC.md](SPEC.md) for behaviour and technical decisions.

Version 1 is built in the milestones below. Each one ends with something that runs on the phone. The riskiest parts come first, so a bad surprise costs days, not weeks.

---

## Milestone 0: Spike

Prove the parts that could force a change of plan before building anything on top of them.

- Create the Expo project (TypeScript) and install a development build on the phone.
- Show Mapy.com outdoor tiles with MapLibre, with the Mapy.com logo and copyright link on top.
- Tap twice: call Mapy.com routing and draw the path.
- Drag a point marker: recalculate the path.
- Switch through all four map styles.

**Measure:**
- Credit use in the Mapy.com account after a realistic 15-minute planning session.
- How reliable marker dragging is on the phone.
- How winter and aerial tiles look without high-resolution versions.

**Done when:** dragging works reliably, and one session's credit use × a generous number of sessions per month is well under 250,000.

**If not:**
- Dragging is unreliable → move a point by tapping it, then tapping its new position.
- Credits run too high → compare openrouteservice + Thunderforest (see SPEC 9.2).

## Milestone 1: Build pipeline

Done early because the signing key has to exist, and be backed up, before any real routes are saved on the phone.

- Create the signing key and back it up outside the repo and the phone.
- Dockerfile that builds a signed release APK (SPEC 9.6).
- One local command that produces the APK in `dist/`.
- GitHub Actions workflow on push to `main` that runs the same image and keeps the APK as a workflow artifact.
- Secrets set up locally (git-ignored files) and in GitHub.

**Done when:** an APK built by the pipeline installs over the previous one without uninstalling.

## Milestone 2: Route model

Plain TypeScript with Jest tests, no screens (SPEC 9.3–9.5).

- Provider interface, the Mapy.com implementation, and a fake provider for tests.
- Route state: points, legs, `closed` flag, activity.
- Actions: add point, drag point, undo, clear, close loop, out and back, switch activity.
- Snapping rules: 200 m limit, "no path" errors.
- Elevation sampling and gain, estimated time, number and time formatting.
- GPX writer.

**Done when:** tests cover the logic behind checklist items 1–7 and 15.

## Milestone 3: Planning screen

Connect the route model to the map.

- Location permission, centring on the user or Prague, "Start at my location".
- Tap queue, loading indicator, distinct start marker, dragging, undo and clear with confirmation.
- Close loop, out and back, activity switch.
- Stats bar, map style switch that remembers the last style.
- Draft saved automatically.
- Offline detection and message.
- All text goes through i18next from the first screen, even before the Czech translations exist.

**Done when:** checklist items 1–7, 14 and 15 pass on the phone.

## Milestone 4: Saving and the routes list

- Database tables and migrations for routes, legs, tags and the draft.
- Save form, and overwrite or save as copy when editing.
- Routes list with one-tag filter and accent-insensitive search.
- Open, rename, change tags and notes, delete. Ask before discarding the draft.
- Unused tags disappear automatically.

**Done when:** checklist items 8 and 13 pass.

## Milestone 5: Export, backup and offline

- GPX export through the share sheet.
- Export all and Import.
- Saved routes shown over stored map areas when offline.

**Done when:** checklist items 9, 10 and 16 pass.

## Milestone 6: Polish

- Czech translations and number formats.
- Dark mode, with the map dimmed.
- Settings screen: language, paces, backup.
- Run the whole checklist on the phone.

**Done when:** checklist items 11–13 pass and the full checklist passes. Version 1 is done.

---

## After version 1

Use the app for a few weeks before starting version 2. Settle the open v2 questions in SPEC §5 first, and look again at openrouteservice's built-in loop feature against building the loops on Mapy.com.
