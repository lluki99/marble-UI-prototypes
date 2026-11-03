# Racers UI II — independent iteration

Open `../prototype-03.html` or its card in the hub. The original `prototype-01.html` remains unchanged.

This directory contains a frozen copy of the original race's configuration, content binder, styles and models. All scripts and styles used by the new page come from here. Existing artwork is reused from `../assets` and `../speedway.svg` (URLs resolve from the root HTML). Changing shared artwork files would affect every page referencing that artwork; use a new asset filename when experimenting.

- `config.js`: names, short labels, colors, dialogue, ability timing and race parameters. Full names appear in the standings, test bench and results; short labels fit the marbles and minimap. Player ID is 2, as in the original simulation. Captain Rennick is ID 1.
- `layout.css`: corner anchors and compact layout. `styles.css` is the original stylesheet snapshot.
- `leaderboard.js`: stable rows, real ranking updates and interruptible 420 ms FLIP motion. Reduced motion disables row travel.
- `race.js`: scene, HUD and input wiring. Radio enters as a whole panel from the right in 380 ms, with a simple fade for reduced motion. It appears only while a conversation is active. Automatic 3–4 second dialogue and Space skipping are preserved.
- `race-model.js`, `ability-model.js`, `radio-model.js`, `camera-model.js`: independent simulation and timing models.

The race still lasts 60 seconds, follows an open road downward, and uses common randomized rules with overtakes and occasional collisions. Impulse, Jump and Ghost keep their original effects and effect-then-cooldown timing. Test bench, map expansion/M toggle, pause, results and Reset remain available.

The hub card is metadata in the root `prototype-config.js`. Its fields do not configure this independent race page.
