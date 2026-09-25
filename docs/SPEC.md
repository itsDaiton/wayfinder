# Wayfinder — Product Spec

**Status:** v1 and v2 defined, technical decisions agreed · **Owner:** David · **Last updated:** 25 Sep 2026

Sections 1–8 describe how the app should behave. Section 9 records the technical decisions. The work is tracked as GitHub issues: version 1 in epic [#2](https://github.com/itsDaiton/wayfinder/issues/2), version 2 in [#17](https://github.com/itsDaiton/wayfinder/issues/17).

---

## 1. What Wayfinder is

Wayfinder is a personal Android app for planning running, walking and cycling routes by tapping on a map. The route always follows real paths, roads and streets. While planning, the app shows the distance, elevation gain and estimated time. Routes are saved on the phone, organized with tags, and exported as GPX files so they can be used on a watch or in other apps.

It exists because creating routes in Strava requires a paid subscription, and Google Maps isn't built for planning exercise routes. It's also a learning project for mobile development.

## 2. Guiding principles

1. **One user, one phone.** Built for the owner only. No accounts, no sign-in, no cloud, no sharing with other users.
2. **Routes follow real paths.** The route never draws straight lines through fields, buildings or water.
3. **Free to run.** Usage stays within the map provider's free tier.
4. **Planning needs internet; your data doesn't.** Saved routes, their stats, export and backup always work offline.
5. **Simple beats clever.** When a feature is in doubt, choose the simpler behavior.

## 3. Constraints

- Android only, installed directly as an APK (not published on Google Play).
- The map, the path-finding and the elevation data all come from **Mapy.com**, so the route always follows paths that are visible on the map. Mapy.com's logo and copyright link must stay visible as the provider requires. No other part of the interface may cover them.
- The user interface is in **Czech and English**, switchable in settings. Numbers follow the language: `10,4 km` in Czech, `10.4 km` in English.
- The theme **follows the phone's light/dark setting**. Mapy.com has no dark map, so in dark mode the map is dimmed.
- Distances are in kilometres and elevation in metres.

---

## 4. Version 1: manual route planning

### 4.1 The map screen

- The app opens on the map, centred on the user's current location. If location permission is denied, it opens on Prague.
- Standard map gestures: drag to move, pinch to zoom.
- Several switchable map styles: **basic, outdoor, winter, aerial**. Outdoor is used on first launch. After that, the app remembers the last style used.
- There's an activity switch at the top: **Run/Walk** or **Bike**. The activity affects which paths the route uses and which pace is used for the time estimate.

### 4.2 Starting a route

- The first tap on the map sets the **start point**.
- A **"Start at my location"** button places the start point at the user's current GPS position.
- The start point looks visibly different from the other points.

### 4.3 Adding points

- Each tap adds a new point. The app connects it to the previous point along real paths for the selected activity.
- **There are never straight lines.** Every part of the route follows paths, roads or streets.
- If the user taps somewhere with no path (a pond, a field, a building), the point **snaps to the nearest path** and is shown there.
- If the nearest path is **more than 200 m away**, or no path connection exists at all, the point isn't added and a short message explains why.
- While a new part of the route is loading, a small loading indicator is shown. The map stays usable.
- Taps made while a part is still loading are handled in order. If one of them can't be added, it's dropped and the next one connects to the last point that worked.

### 4.4 Editing a route

- **Undo** reverses the last change of any kind: adding a point, dragging a point, a finishing shortcut, switching the activity, or Clear. The user can undo repeatedly, all the way back to an empty map.
- **Drag a point** to move it. The route on both sides of that point recalculates.
- Tapping an existing point does nothing. It never adds a new point on top of it.
- **Clear** removes the whole route, after asking for confirmation. Clear can be undone.
- **Switching the activity** (Run/Walk ↔ Bike) recalculates the whole route for the new activity. Switching back gives the original route again.
- The route being planned is kept as a **draft** automatically. It survives leaving the app, the phone closing the app in the background, and restarting the phone. There is one draft at a time.

### 4.5 Finishing shortcuts

- **Close loop** adds a route from the last point back to the start point. The route stays a loop: if the start point is dragged later, the end of the loop follows it.
- **Out and back** adds the same route back to the start in reverse, which doubles the distance. The points on the way back become normal points, so each half can be edited on its own afterwards.
- After either shortcut, the route can still be edited, and undo reverses the shortcut.
- Known limitation: on Bike, the reversed way back may use a one-way street against traffic. Dragging a point on the way back recalculates that part properly.

### 4.6 Live stats

A stats bar is always visible while planning and updates after every change:

| Stat           | Shown as  | Notes                                                                                                                                          |
| -------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Distance       | `10.4 km` | Total length of the route                                                                                                                      |
| Elevation gain | `↑ 124 m` | Total climbing along the route. Tiny ups and downs of a few metres are ignored so noise in the elevation data doesn't add up to fake climbing. |
| Estimated time | `1:08`    | Distance × the pace set for the selected activity. Climbing isn't taken into account.                                                          |

### 4.7 Saving a route

- The **Save** button opens a short form:
  - **Name** (required)
  - **Activity** (shown but not editable: it's the activity the route was planned for. To change it, switch the activity on the map, which recalculates the route.)
  - **Tags** (optional; pick existing tags or create new ones; several are allowed)
  - **Notes** (optional free text)
- The creation date is recorded automatically.
- A saved route keeps its points, its path on the map, and its distance and elevation gain. The estimated time is not stored. It's always calculated from the current pace settings, so changing the pace updates every route.

### 4.8 Saved routes list

- Shows all saved routes, newest first. Each item shows the name, activity, distance, tags and creation date.
- Routes can be filtered by **one tag at a time** and searched by name. Search ignores upper/lower case and Czech accents: "pruhonice" finds "Průhonice".
- Tags that no route uses any more disappear automatically. There's no separate screen for managing tags.
- Tapping a route opens it on the map with its stats. If an unsaved route is being planned, the app first asks whether to discard it.
- An open saved route can be:
  - **edited** and then saved again (overwriting it) or saved as a new copy,
  - **renamed**, with its tags and notes changed,
  - **deleted**, after confirmation,
  - **exported** as GPX.

### 4.9 GPX export

- Any saved route can be exported as a GPX file.
- Export uses Android's standard share sheet, so the file can go to a watch app, Google Drive, email or anywhere else.
- The file is named after the route, e.g. `Stromovka loop.gpx`. Characters that aren't allowed in file names (such as `/` or `:`) are replaced. Czech accents are kept.
- The route is written as a track, which watch apps import most reliably. It includes the elevation of each point where available.
- Export works offline.

### 4.10 Backup and restore

The app has no cloud, so a lost or reset phone would lose every route. Backup is a file the user keeps wherever they like.

- **Export all** writes every saved route, with its tags and notes, into one backup file and sends it through the share sheet (e.g. to Google Drive or email).
- **Import** reads a backup file and adds its routes to the app.
- Both work offline.

### 4.11 Settings

- **Language:** Czech or English. Defaults to the phone's language, or English if the phone uses a different language.
- **Default pace, Run/Walk:** minutes per km. Starts at 6:30 /km.
- **Default pace, Bike:** km per hour. Starts at 20 km/h.
- **Backup:** Export all and Import (see 4.10).

### 4.12 Offline behavior

- **Without internet:** the saved routes list, route details, stats, tags, notes, GPX export and backup all work normally.
- An opened saved route shows its line and points over whatever parts of the map are still stored from earlier use. Elsewhere the map is blank.
- **Planning** needs internet. When offline, the map screen shows a clear message: "No connection, planning unavailable."

---

## 5. Version 2: loop generator

Built only after version 1 works well. No AI is involved.

- The user chooses:
  - the **activity** (Run/Walk or Bike),
  - the **start point** (current location or a tap on the map),
  - the **target distance** (e.g. 10 km).
- The app generates **about 3 different loops**. Each one starts and ends at the start point and is close to the target distance (roughly within 5%).
- The options can be compared on the map, each with its distance, elevation gain and estimated time.
- **Try again** generates a new set of options.
- Picking an option turns it into a normal route. It can be edited, saved, tagged and exported exactly like a manually planned route.
- Loops that go out and back along the same path for most of their length should be avoided where possible.

Still to decide before building v2 (tracked in [#17](https://github.com/itsDaiton/wayfinder/issues/17)):

- What to show when no option lands within 5% of the target.
- How much doubling back counts as "most of their length".
- Whether to build the generator on Mapy.com (see 9.7) or use openrouteservice's built-in loop feature, which would mean routes no longer come from the same data as the map.

## 6. Out of scope

- Live tracking or turn-by-turn navigation during exercise
- AI features
- Accounts, cloud sync, or sharing routes with other people
- Strava integration
- Full offline maps
- iOS and Google Play publishing
- Straight-line route segments

## 7. Later ideas (not committed)

- Elevation profile chart for a route
- Inserting a new point by dragging the middle of the line
- Estimated time that takes climbing into account
- Loop generator preferences: flat, avoid main roads, prefer forest
- Downloading map areas for offline use

## 8. Assumptions to confirm

These details weren't discussed and were filled in with sensible defaults:

- If location permission is denied, the app opens on Prague.
- Starting paces are 6:30 /km (Run/Walk) and 20 km/h (Bike).
- GPX export is available for saved routes only.
- Close loop and Out and back need at least two points. Out and back isn't offered on a route that's already a loop, and Close loop isn't offered twice.
- On a closed loop, a new tap becomes the last point before the return to the start, so the route stays a loop.
- Import never overwrites or duplicates a route that's already in the app.

---

## 9. Technical decisions

Agreed in the spec review on 25 Sep 2026.

### 9.1 App

- **React Native with Expo**, in TypeScript. The map library contains native code, so the app runs as an Expo development build, not in Expo Go.
- **No backend.** The app calls Mapy.com directly and keeps everything in SQLite on the phone. The Backup file covers a lost phone. A server only becomes worth it for syncing between devices, which isn't planned.
- **Screens:** Expo Router, with one file per screen in `src/app/`.
- **Map:** `@maplibre/maplibre-react-native` showing Mapy.com image tiles. The route is drawn as a line on top. The Mapy.com logo and copyright link are a normal view placed over the map.
- **Storage:** `expo-sqlite`. Each route stores an accent-free copy of its name for search. The draft is stored the same way as saved routes.
- **Other libraries:** `expo-location` (GPS), `@react-native-community/netinfo` (offline detection), `expo-file-system` + `expo-sharing` (GPX and backup export), `expo-document-picker` (backup import), `i18next` + `expo-localization` (translations), `Intl.NumberFormat` (Czech/English number formats).
- The language switch changes the app's own text. System dialogs, such as the location permission prompt, stay in the phone's language.

### 9.2 Mapy.com

| Need        | Mapy.com API                              | Notes                                                                                                                                                  |
| ----------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Map         | `/v1/maptiles/{style}/{size}/{z}/{x}/{y}` | High-resolution `256@2x` tiles exist only for basic and outdoor. Winter and aerial use `256`, so they look slightly softer.                            |
| Route parts | `/v1/routing/route`                       | Run/Walk uses `foot_fast`, Bike uses `bike_road`. The response gives the path, its length, and for each point the snapped position and `snapDistance`. |
| Elevation   | `/v1/elevation`                           | Up to 256 positions per request. Missing data comes back as `-100000`.                                                                                 |

- `snapDistance` over 200 m means the tap is rejected. A `404` with `errorCode` 7 (outside the network for this activity) or 9 (not connected) means there's no path connection.
- Rate limits: 30 requests per second for routing and elevation, at most 15 waypoints per routing request.
- **Free tier:** 250,000 credits per month. Paid use needs explicit consent, so the worst case is the API stopping until the 1st of the next month, never a bill. Actual credit use is measured in the spike ([#3](https://github.com/itsDaiton/wayfinder/issues/3)).
- All Mapy.com calls go through one small provider interface (route between two points, elevation for a list of positions, tile URL for a style). Switching to another provider, such as openrouteservice, means replacing one module.

### 9.3 Route model

The route logic is plain TypeScript with no React Native imports, unit-tested with Jest.

- A route is the activity, the list of **tapped positions** (not the snapped ones), a `closed` flag, and one **leg** per pair of neighbouring points. A leg holds its path, length, snapped end positions and elevation samples.
- Each leg depends only on its two taps, so legs can be recalculated independently: adding a point needs one leg, dragging a point needs two, switching activity needs all of them. Because the taps are kept, switching activity back gives the original route.
- **Undo:** every change stores the previous route state (which includes its legs) on a history stack, and undo restores it. Undo never calls the API.
- **Close loop:** sets `closed`. The last leg always goes from the last point to the current start point.
- **Out and back:** adds the points in reverse order and reuses the legs with their paths and elevation reversed. No API calls.
- Taps are processed in a queue, one leg at a time.

### 9.4 Stats

- **Distance:** sum of leg lengths.
- **Elevation gain:** each leg's path is sampled about every 25 m and the elevations are cached with the leg. Gain is calculated over the whole route's profile, counting a climb only once it exceeds a threshold (start at ~3 m and tune on real routes). It's never a sum of per-leg gains. That matters for out and back, where the climb on the way back equals the descent on the way out.
- **Estimated time:** distance × pace, calculated whenever it's shown.

### 9.5 GPX and backup

- GPX export writes a `<trk>` with one `<trkpt>` per path point and `<ele>` where elevation is known.
- The backup file contains everything needed to restore routes without internet: points, legs, elevation samples, tags, notes and dates. Each route has a unique ID so Import can skip routes that already exist.

### 9.6 Build and release

- One **Dockerfile** (Java 17, Android SDK, Node, pnpm) runs `pnpm install --frozen-lockfile`, `pnpm expo prebuild --platform android --clean` and a Gradle release build. The APK is signed by passing the signing key in with Gradle's `-Pandroid.injected.signing.*` properties. The generated `android/` folder isn't committed.
- The same image builds the APK **locally** with one command and in **GitHub Actions** on every push to `main`. In CI the APK is kept as a workflow artifact, never published as a public Release.
- **Secrets** (signing key, its passwords, Mapy.com API key) are passed in at build time and never stored in the image or the repo. Locally they live in files that git ignores.
- The Mapy.com key ends up inside the APK, where anyone with the file could extract it. That's acceptable for a personal app, as long as APKs aren't shared publicly.
- The **signing key** is created once and backed up outside the repo and the phone. Without it, an update can only be installed by uninstalling first, which deletes all saved routes.
- The Android package name is `com.itsdaiton.wayfinder`. It can't change later: Android treats a different name as a separate app, and the saved routes stay behind in the old one.

### 9.7 Loop generator approach (v2)

Mapy.com has no loop feature, so the app builds loops itself:

1. Place 2–3 waypoints on a circle around the start at a random bearing.
2. Route start → waypoints → start in one request.
3. Resize the circle by target ÷ actual length and repeat 2–3 times.

That's about 10 routing requests per "Try again". Doubling back is detected by measuring how much of the path runs back along itself.

---

## 10. Acceptance checklist (version 1)

Version 1 is done when all of these work on the phone:

1. Open the app, tap "Start at my location", tap 4–5 points and get a route that follows real paths, with live distance, elevation gain and time.
2. Tap in the middle of a pond or field: the point snaps to the nearest path. Tap somewhere more than 200 m from any path: the point is rejected with a message.
3. Undo three times: the last three points and their route parts disappear.
4. Drag a middle point: the route recalculates on both sides. Undo: the point moves back.
5. Tap "Close loop": the route returns to the start. Drag the start point: the end of the loop follows. Undo twice: the drag and the loop are reversed.
6. Tap "Out and back" on a new route: the distance doubles.
7. Switch Run/Walk → Bike: the route recalculates and the estimated time changes. Switch back: the original route returns.
8. Save a route with a name, two tags and a note, then find it in the list by tag and by its name typed without accents.
9. Export a saved route as GPX, send it to another app, and see the same route there, with elevation.
10. Turn on airplane mode: the saved routes list, route details and GPX export still work, a saved route shows its line on the map, and the map screen shows the offline message.
11. Switch the language to Czech and back: all text changes, including number formats (`10,4 km`).
12. Switch the phone to dark mode: the app follows and the map is dimmed.
13. Change the Run/Walk pace in settings: estimated times update, including for saved routes.
14. Plan a route, leave the app, close it from the recent apps list, and reopen it: the unsaved route is still there.
15. Clear a route, confirm, then undo: the route is back.
16. Export all routes, uninstall the app, install it again and import the backup: all routes, tags and notes are back.
