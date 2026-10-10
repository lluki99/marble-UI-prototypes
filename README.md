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

Original coastal scenery and portraits; warm sand, sage and simple cream outline symbols. Dialogue stays bottom left, abilities bottom right and map top right. In narrow layouts an ability consultation temporarily replaces the dialogue and restores it on close.

- Impulse: a golden acceleration trail for 3 seconds; ready 10 seconds after activation. Shift.
- Jump: exactly one 1-second ascent and descent with a ground shadow; ready 8 seconds after activation. E.
- Ghost: a smooth 3-second fade of the player marble, with a small golden ground marker; ready 12 seconds after activation. Q. Other racers retain normal opacity.
- Gold tile and active dot indicate the ongoing effect; the number and strip independently show cooldown remaining. The countdown begins immediately at activation and prevents repeat activation.
- Minimap: open road from the top start to the bottom finish, six racers, gold player marker. Progress is distance along that road. M hides/shows the map; the expanded map supports Escape and native focus containment.
- One 75-second start-to-finish journey, with timer/progress clamped at the finish. Restart clears abilities, timers and transient feedback.
- Demo controls: pause/resume, dialogue, forced cooldowns, ready state, position, near-finish jump and restart.

Space advances dialogue when focus is not on a button/link. Escape closes ability details, demo controls or conversation. All pages use English. Reduced motion stops environmental movement and reduces jump height; meaningful ability states remain evaluable.

## Simulation limits

The original SVG landscape and Canvas marbles represent a moving camera on a coastal sector rather than the full map in 3D. The map, progress and ranking share simulated race data. Jump is a single timed visual arc. Impulse and Ghost do not change collisions, vulnerability, physics or ranking. Pause freezes simulation and cooldowns.

## Checks

`node tests/ability-model.test.cjs` checks effect boundaries, activation-based cooldown deadlines, duplicate blocking, reset, one jump apex/no repeats and smooth Ghost recovery. Browser checks cover the hub, direct HTML URL, dialogue, minimap orientation/expansion, ability state transitions, restart and desktop/mobile layout.

## Skills

`frontend-design` and `ui-ux-pro-max` continue to guide identity, restrained animation, readable states, contextual descriptions, accessible names and keyboard focus. The publicly available OpenAI [game-ui-frontend skill](https://github.com/openai/plugins/blob/main/plugins/game-studio/skills/game-ui-frontend/SKILL.md) specifically addresses browser-game HUDs and protecting the playfield. Its guidance fits this small prototype; no plugin, game engine or framework was installed.

Add future proposals as new HTML files and entries in the configuration registry. The hub lists them automatically. Git retains prior iterations.
