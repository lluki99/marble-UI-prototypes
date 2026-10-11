# Marble trails

Independent HTML race-interface prototypes. No framework, package installation or build step.

## Open

Start a static server in this directory: `python -m http.server 4173`.

- Hub: http://localhost:4173/index.html
- Saltwind Run: http://localhost:4173/prototype-01.html

HTML files also open directly. Google Fonts are optional; local fallbacks are provided.

## Edit

**`prototype-config.js`** is the single editing location for copy, accessible labels, icons and icon references, artwork, dialogue, route and ability parameters. Shared defaults and per-prototype overrides keep independent HTML pages while avoiding duplicated content. `content.js` binds content to HTML and generates hub cards from the registry. [Editing guide with examples](EDITING.md).

## Saltwind Run

Original desert speedway and portraits; ink-blue shadows, crimson machinery, yellow rails and bold angular silhouettes. A single external header contains ← All prototypes, Test bench and Reset, in that order. Dialogue stays bottom left, abilities bottom right and map top right. The player radio portrait remains visible when no conversation is open.

- Impulse: a golden acceleration trail for 3 seconds; 10-second cooldown after the effect (13 seconds between uses). Shift.
- Jump: exactly one 1-second ascent and descent with a ground shadow; 8-second cooldown after the effect (9 seconds between uses). E.
- Ghost: a smooth 3-second fade of the player marble, with a small golden ground marker; 12-second cooldown after the effect (15 seconds between uses). Q. Other racers retain normal opacity.
- Circular controls: a separate rim spins only during the effect; the icon stays upright. After the effect ends, the high-contrast outer ring fills over the full cooldown. Reduced motion replaces spin with a steady rim.
- Minimap: open road from the top start to the bottom finish. Six markers use each marble's actual distance.
- Preparation does not consume race time. Choose enabled events, then start a 60-second run. Ranking is distance-based at the time limit.
- The separate Test bench can be hidden. Its enabled event buttons change race state or arrange an actual impact; natural and forced events share the detector and radio queue.
- Radio lines advance only with Space; another press after the last line closes the call. Events queue without interruption; duplicate pending conversations and frequent repeat triggers are suppressed. Reset clears conversations and ability deadlines; calls can still be advanced after the timed race ends.

All pages use English. Escape closes ability details or the test bench. Reset returns to preparation and restores the permanent player portrait. Space is not intercepted in editable fields.

## Simulation limits

`race-model.js` runs a fixed 1/120-second step with common rules for all six marbles. Temporary random rhythm and lane targets blend smoothly; contacts cause small lateral nudges and a 0.65-second slowdown. No per-marble statistics determine performance. Test triggers guide movement toward an overtake/contact rather than teleporting racers. An optional shared seed makes a session reproducible.

The Canvas, minimap and ranking all use the same distance/lane state. Impulse temporarily accelerates the player; Jump is one visual arc; Ghost changes opacity only. The race stops at 60 seconds, ranked by distance; it does not force a simultaneous finish. Pause/inactive browser tabs freeze race time. This is a visual HUD simulation, not a physical game engine.

## Checks

Run `node tests/ability-model.test.cjs`, `node tests/race-model.test.cjs`  , `node tests/radio-model.test.cjs` and `node tests/camera-model.test.cjs`. They cover effect-then-cooldown boundaries/reset, exact time limit, smooth motion, overtakes, stability, natural/forced contacts, Space-driven radio, queuing and deduplication. Browser checks cover preparation, events, manual lines, result at 01:00.0, ability states, minimap, restart and desktop/mobile hub navigation.

## Skills

`frontend-design` and `ui-ux-pro-max` continue to guide identity, restrained animation, readable states, contextual descriptions, accessible names and keyboard focus. The publicly available OpenAI [game-ui-frontend skill](https://github.com/openai/plugins/blob/main/plugins/game-studio/skills/game-ui-frontend/SKILL.md) specifically addresses browser-game HUDs and protecting the playfield. Its guidance fits this small prototype; no plugin, game engine or framework was installed.

Add future proposals as new HTML files and entries in the configuration registry. The hub lists them automatically. Git retains prior iterations.

Racer identities are shared in `shared.race.colors` and `colorNames`; names A–F appear on the marbles and map, with swatches and names in the editor. Start is above finish in both views.


## Redline visual revision

The supplied frames informed an ink-blue sky, near-black mechanical silhouettes, desert rose stone, yellow racing hardware and crimson repair panels. Heavy contour lines, condensed italic headings and cel-shaded lettered marbles replace the softer coastal treatment. Original stepped green radio portraits remain readable and quiet. Speed trails extend upward behind marbles travelling downward. Reduced motion removes speed strokes and spin.

The header stays outside the game HUD. Both scene and minimap calculate forward position from actual distance, starting above and ending below. Ability timing is effect → full configured cooldown → ready; the separate rim spins during the effect and a thick yellow recovery ring fills during cooldown only. The Ability timing section edits effect/jump duration and cooldown (seconds), shows the total wait, validates 0.1–60 seconds and captures settings per activation. Reset keeps edits; reload restores defaults.

Radio opening: caller slide (140 ms), text glass reveal (90 ms delay + 190 ms), readable text fade (240 ms delay + 90 ms). New lines only fade for 100 ms; Space closes after the last, with a 120 ms exit. The fixed player portrait never exits.

## Following camera

A 6,000-unit road shows only approximately 300–400 units at once. A smooth world-space camera keeps the player toward the upper half, leaving room ahead below. Road marks, rails and angular roadside terrain scroll continuously past. Framing widens between 25–37% progress, then moves closer between 60–72%. Reduced motion keeps a fixed framing and omits speed strokes. The complete-route map is independent of camera framing.
