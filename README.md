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

Original desert speedway and portraits; ink-blue shadows, crimson machinery, yellow rails and bold angular silhouettes. A single external header contains Test bench, All prototypes and Reset. Dialogue stays bottom left, abilities bottom right and map top right. In narrow layouts an ability consultation temporarily replaces the dialogue and restores it on close.

- Impulse: a golden acceleration trail for 3 seconds; 10-second cooldown after the effect (13 seconds between uses). Shift.
- Jump: exactly one 1-second ascent and descent with a ground shadow; 8-second cooldown after the effect (9 seconds between uses). E.
- Ghost: a smooth 3-second fade of the player marble, with a small golden ground marker; 12-second cooldown after the effect (15 seconds between uses). Q. Other racers retain normal opacity.
- Circular controls: a separate rim spins only during the effect; the icon stays upright. After the effect ends, the high-contrast outer ring fills over the full cooldown. Reduced motion replaces spin with a steady rim.
- Minimap: open road from the top start to the bottom finish. Six markers use each marble's actual distance.
- Preparation does not consume race time. Edit all six marbles, choose presets and enabled events, then start a 60-second run. Ranking is distance-based at the time limit.
- The separate Test bench can be hidden. Its enabled event buttons change race state or arrange an actual impact; natural and forced events share the detector and radio queue.
- Radio lines advance automatically every 3 simulation seconds. Events queue without interruption; duplicate pending conversations and frequent repeat triggers are suppressed. Reset/end clears conversations and ability deadlines.

All pages use English. Escape closes ability details or the test bench. Reset returns to preparation with the edited properties retained for repeatable comparisons.

## Simulation limits

`race-model.js` uses a fixed 1/120-second step on a two-dimensional strip: forward distance and lateral position, proportional drive toward target speed, frictional drag, mass-dependent acceleration and contact impulses with restitution. Presets affect motion and collisions; heavy marbles are not inherently faster. Impulse increases target speed while active. Jump is one visual arc; Ghost changes only opacity, not collision or invulnerability. Pause and inactive browser tabs freeze simulation time.

The Canvas shows a projected desert strip from top start to bottom finish, not the whole track in 3D. There is no gravity solver, rolling torque, terrain physics or airborne collision handling. Test positioning is an explicit controlled state change. Racers that reach the end stay there; the run still ends by time. This is a HUD evaluation model, not final game physics.

## Checks

Run `node tests/ability-model.test.cjs`, `node tests/race-model.test.cjs` and `node tests/radio-model.test.cjs`. They cover effect-then-cooldown boundaries/reset, exact time limit, property effects, stability, natural/forced contacts, radio timing, queuing and deduplication. Browser checks cover preparation, events, automatic lines, result at 01:00.0, ability states, minimap, restart and desktop/mobile hub navigation.

## Skills

`frontend-design` and `ui-ux-pro-max` continue to guide identity, restrained animation, readable states, contextual descriptions, accessible names and keyboard focus. The publicly available OpenAI [game-ui-frontend skill](https://github.com/openai/plugins/blob/main/plugins/game-studio/skills/game-ui-frontend/SKILL.md) specifically addresses browser-game HUDs and protecting the playfield. Its guidance fits this small prototype; no plugin, game engine or framework was installed.

Add future proposals as new HTML files and entries in the configuration registry. The hub lists them automatically. Git retains prior iterations.

Racer identities are shared in `shared.race.colors` and `colorNames`; fixed numbers appear on the marbles and map, with swatches and names in the editor. Start is above finish in both views.


## Redline visual revision

The supplied frames informed an ink-blue sky, near-black mechanical silhouettes, desert rose stone, yellow racing hardware and crimson repair panels. Heavy contour lines, condensed italic headings and cel-shaded numbered marbles replace the softer coastal treatment. Original stepped green radio portraits remain readable and quiet. Speed trails extend upward behind marbles travelling downward. Reduced motion removes speed strokes and spin.

The header stays outside the game HUD. Both scene and minimap calculate forward position from actual distance, starting above and ending below. Ability timing is effect → full configured cooldown → ready; the separate rim spins during the effect and a thick yellow recovery ring fills during cooldown only. Timings are also listed in the Test bench.
