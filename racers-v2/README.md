# Prototype 1 - Iteration 2

Open `../prototype-03.html` or its hub card. This is the current development version, including the floating translucent minimap. Continue revising this page and directory in place; create another iteration only when explicitly requested. Iteration 1 (`../prototype-01.html`) remains separate.

Edit `config.js` for racer names, route, reactions and ability parameters. `minimap.css` defines the floating map, while `layout.css` defines the corner HUD. Artwork is shared; use a new filename for version-specific artwork changes.

The superseded iteration II has been replaced by the latest visual revision. The redundant prototype-04 page and racers-v3 directory are removed.

## Light blue HUD

`hud-theme.css` centralizes the accent (`--hud-accent`) and translucent surfaces. The leaderboard contains only the Grand Prix title and live rank/name rows. The player rank is beside the floating minimap. `race.js` renders real coloured circles without map labels; map expansion has been removed, while M still toggles the map. The player identity colour is light blue in `config.js`. Ability sizes, effects and timings are preserved.

## One-shot character reactions

The reaction queue holds one standalone reaction per event, with no reply or progression UI. Reactions retain the automatic 3–4 second duration, deduplication, pause/reset handling and Space dismissal.

Edit an event in `config.js` using `reaction: {who: 'npc', text: 'Your standalone reaction.'}`. `who` selects a character from `characters`; its `name`, `portrait` asset path and `marbleIndex` drive the single header, portrait and identity circle. A character may define `faction`; otherwise the global `text.faction` is used. Character assets are unchanged.

`reaction.css` defines the shared header, left portrait, reaction text and bottom identity/signal strip. On small screens the strip occupies the full bottom row to keep the portrait readable. The main text area scrolls only when a longer reaction exceeds the available height.

## Position and portrait ownership

`position.js` is the single ordinal formatter (including 11th–13th exceptions). `race.js` uses it whenever the real player rank changes.

`reaction-model.js` owns standalone reaction timing, deduplication and dismissal; it has no dialogue line indexes or reply arrays. `reaction-view.js` owns rendering, cached image nodes, signal initialization and cancellable entry/exit animations. `race.js` only passes event state to the presenter.

`reaction.css` owns **all** reaction/portrait rules. The permanent tint is on `.reaction-portrait-art`, outside any active-state selector, and is never transitioned. The active state only controls the signal matrix/wave. This prevents the original-colour flash that occurred when the old transmitting class was removed before the exit animation completed. No loading delay or temporary portrait visibility gate is used.

Open `../tests/reaction-portrait-preview.html` to exercise both existing character assets, repeated shows, character swaps, dismissal and reset against the production presenter/styles. This test page is not part of the prototype hub.
