# Marble trails

Independent HTML race-interface prototypes. No build step or runtime packages.

## Open

Start a static server in this directory, for example `python -m http.server 4173`.

- Hub: http://localhost:4173/index.html
- Saltwind Run: http://localhost:4173/prototype-01.html

HTML files also open directly. Google Fonts are optional; local font fallbacks are provided.

## Saltwind Run

The revised first prototype uses the supplied Caravan SandWitch references for a warm coastal palette, flat landscape silhouettes and simple cream pictograms. All artwork, portraits and icons are original. Original mockup relationships remain: stacked speakers at bottom left, three abilities at bottom right and a retractable vertical map at top right.

- Radio conversation: four alternating lines, next and close. The active portrait has full opacity.
- Abilities: inspect a symbol to see its name, description and activation button. Shift activates Boost; E activates Shield; Q activates Focus. A gold tile indicates activation; a number and filling strip indicate cooldown. Details and accessible names preserve meaning without persistent labels.
- Map: open road, start circle and finish flag, six racers, gold player marker. M toggles visibility. The expanded map continues updating and supports Escape and native focus containment.
- Race: one 75-second journey from start to finish. Progress is distance from the start, clamped at 100%; the timer stops at the finish. The race remains finished until restarted. There is no repeating circuit logic.
- Demo controls: pause/resume, radio, cooldowns, ready state, position, near-finish jump and restart. The header also offers a restart button.
- Space advances dialogue when focus is not on a button/link. Escape closes ability details, demo controls or the conversation.

On small screens, inspecting an ability temporarily replaces the dialogue, restoring it on close. Participants stay in the free upper area. Reduced motion stops environmental animation while progress and cooldown data continue to update.

## Simulation limits

The scene is an original SVG landscape with a Canvas road and marbles. It represents a moving camera on a coastal sector rather than rendering the full mapped road in 3D. The map, progress and rank share coherent simulated race data; scene order follows rank. Abilities are visual only, with no physics, collisions, damage or automatic overtaking. Pause also freezes cooldowns. Finishing prevents further ability activation.

## Design decisions

`frontend-design`: replace sci-fi panels with a coastal identity; use Varela Round for friendly names and Barlow for readable dialogue; create original scenery and portraits; remove decorative borders, headings, persistent ability names and availability text. The hub shares the same art, type and quiet asymmetrical silhouettes.

`ui-ux-pro-max`: consistent simple outline icons, accessible names for icon-only controls, visible keyboard focus, controls at least 44 px, interaction states beyond color alone, progressive disclosure, responsive layouts and reduced motion. The generic generated marketing layout was discarded because it did not fit a game HUD.

## New prototypes

Add a separate HTML (`prototype-02.html`, etc.) and its hub entry. Revise existing proposals only on request. This redesign updates `prototype-01.html` as explicitly requested; Git retains the original iteration.
