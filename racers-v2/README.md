# Prototype 1 - Iteration 2

Open `../prototype-03.html` or its hub card. This is the current development version, including the floating translucent minimap. Continue revising this page and directory in place; create another iteration only when explicitly requested. Iteration 1 (`../prototype-01.html`) remains separate.

Edit `config.js` for racer names, route, dialogue and ability parameters. `minimap.css` defines the floating map, while `layout.css` defines the corner HUD. Artwork is shared; use a new filename for version-specific artwork changes.

The superseded iteration II has been replaced by the latest visual revision. The redundant prototype-04 page and racers-v3 directory are removed.

## Light blue HUD

`hud-theme.css` centralizes the accent (`--hud-accent`) and translucent surfaces. The leaderboard contains only the Grand Prix title and live rank/name rows. The player rank is beside the floating minimap. `race.js` renders real coloured circles without map labels; map expansion has been removed, while M still toggles the map. The player identity colour is light blue in `config.js`. Ability sizes, effects and timings are preserved.
