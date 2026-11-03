# Racers UI III — floating minimap

Open `../prototype-04.html` or its hub card. This is an independent snapshot of Racers UI II. Earlier race pages remain unchanged.

Only `minimap.css` changes the HUD presentation: the docked map has no panel/background/border, and the existing SVG route uses a 16-unit yellow stroke at 62% opacity, with rounded joins and ends. The container dimensions, bottom-right anchors, live racer markers, route geometry and all controls are preserved. The expanded-map dialog retains its existing presentation.

Tune the floating map in `minimap.css`. Route data, racer names/colors and other editable content remain in `config.js`. The simulation, camera, abilities, dialogue and live leaderboard are unchanged snapshots from `racers-v2/`.
