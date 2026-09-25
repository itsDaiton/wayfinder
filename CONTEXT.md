# Wayfinder

A personal Android app for planning running, walking and cycling routes by tapping on a map, where the route always follows real paths, roads and streets.

Use these terms in issues, code, tests and commit messages. User-facing text can be plainer (for example "part of the route" for a Leg), but the code and tickets use the terms below.

## Language

**Route**:
The thing being planned or saved: an Activity, an ordered list of Points, one Leg between each pair of neighbouring Points, and whether it's a Closed loop. Its Stats are derived from its Legs.
_Avoid_: Track (the GPX element a Route is exported as), course, trip, path (a Path is one Leg's line).

**Activity**:
What a Route is planned for: **Run/Walk** or **Bike**. It decides which paths the Legs use and which Pace the Estimated time uses. Set per Route; switching it recalculates every Leg.
_Avoid_: Mode, profile, sport, route type (`routeType` is Mapy.com's parameter and stays inside the Route provider).

**Point**:
A position the user placed on the map by tapping or with "Start at my location". Stored as the tapped position, never the Snapped position, so the Route can be recalculated for another Activity without drifting.
_Avoid_: Waypoint (Mapy.com's term for points in the middle of one request), marker (how a Point is drawn), stop, node.

**Start**:
The first Point of a Route, drawn differently from the others.
_Avoid_: Origin, first waypoint.

**Leg**:
The part of a Route between two neighbouring Points. It holds its Path, its length, the Snapped positions of both ends and its Elevation samples. A Leg depends only on its two Points and the Activity, so moving a Point recalculates only the Legs that touch it.
_Avoid_: Segment (GPX's `trkseg` means something else), section, part (fine in user-facing text).

**Path**:
The line a Leg follows on the map, as returned by the Route provider. It always runs along real paths, roads or streets, never straight across. Not to be confused with a path on the ground (a footpath or trail).
_Avoid_: Geometry (fine when talking about the API response), polyline (that's its encoding).

**Snapped position**:
Where Mapy.com moves a Point on the path network for the Activity; the distance moved is the **Snap distance**. A Point with a Snap distance over 200 m is rejected. Snapped positions are derived per Activity and never replace the Point.
_Avoid_: Mapped position (Mapy.com's field name, only inside the Route provider), nearest road.

**Closed loop**:
A Route whose last Leg goes from the last Point back to the Start, made with **Close loop**. It's a flag on the Route, not an extra Point: dragging the Start moves the end of the loop with it.
_Avoid_: Round trip, circuit, loop on its own (ambiguous with Generated loop).

**Out and back**:
The shortcut that adds the Route's Points again in reverse, reusing each Leg with its Path reversed, so the Route returns to the Start the way it came. The returning Points are ordinary Points afterwards and can be edited on their own.
_Avoid_: Mirror, return trip, there and back.

**Draft**:
The Route currently being planned and not yet saved. There is exactly one, saved automatically so it survives the app being closed. Editing a Saved route also happens in the Draft.
_Avoid_: Work in progress, temporary route, unsaved route (fine in user-facing text).

**History**:
The earlier states of the Draft that Undo steps back through. Every change adds one, including Clear and the shortcuts. Kept in memory only.
_Avoid_: Undo stack, changelog.

**Saved route**:
A Route the user saved with a name, optional Tags and notes, and a creation date. It can be opened, edited (overwritten or saved as a copy), renamed, deleted and exported.
_Avoid_: Favourite, stored route, library entry.

**Tag**:
A free-text word or phrase on Saved routes (e.g. "forest", "intervals"), several per route. Tags no Saved route uses are deleted automatically. The list filters by one Tag at a time.
_Avoid_: Label (a GitHub concept in this repo), category, folder.

### Stats

**Stats**:
The Distance, Elevation gain and Estimated time of a Route, shown in the stats bar and on Saved routes.
_Avoid_: Metrics, summary.

**Distance**:
The total length of a Route's Legs, in kilometres.
_Avoid_: Length (fine for a single Leg).

**Elevation gain**:
The total climbing along a Route, calculated over the whole Route's elevation profile with a threshold that ignores noise. Never a sum of per-Leg gains: an Out and back would come out wrong.
_Avoid_: Elevation on its own (that's a height), altitude, vertical.

**Elevation sample**:
A height from the Mapy.com Elevation API at a position along a Leg's Path, about every 25 m. Stored with the Leg; missing data is stored as null.
_Avoid_: Altitude, profile point.

**Estimated time**:
Distance × the Pace for the Route's Activity. Calculated whenever it's shown, never stored, so changing a Pace updates every Route. Ignores climbing.
_Avoid_: Duration (Mapy.com's field, which the app ignores), ETA, moving time.

**Pace**:
The per-Activity setting used for Estimated time: minutes per km for Run/Walk (default 6:30), km/h for Bike (default 20). The Bike value is strictly a speed, but both settings are called Pace.
_Avoid_: Speed (for the setting), tempo.

### Map and files

**Route provider**:
The module that talks to Mapy.com: routing a Leg, fetching Elevation samples, building tile URLs. The only code that knows Mapy.com's URLs, `routeType` values and error codes, so the provider can be swapped in one place.
_Avoid_: API client, service, backend.

**Map style**:
Which Mapy.com map is shown: basic, outdoor, winter or aerial. The last one used is remembered.
_Avoid_: Layer, theme (theme means light/dark), mapset (Mapy.com's parameter, only inside the Route provider).

**GPX export**:
One Saved route written as a GPX track and sent through Android's share sheet.
_Avoid_: Download, sync.

**Backup**:
One file holding every Saved route with everything needed to restore it offline. Made with **Export all**, read with **Import**; Import never overwrites or duplicates a Saved route that already exists.
_Avoid_: Sync, cloud backup, GPX export (a Backup isn't GPX).

### Version 2

**Generated loop**:
A Closed loop the v2 loop generator proposes for a target distance. Picking one turns it into a normal Route.
_Avoid_: Suggestion, auto-route, round trip.
