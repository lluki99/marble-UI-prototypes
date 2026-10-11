# Editing Marble trails

Open **`prototype-config.js`**. This is the single editing location for page text, accessible labels, icons, portraits, dialogue, artwork references, route shape and ability parameters. The HTML files contain layout hooks; `content.js` fills them. No framework, package install or build is required. Refresh the page after saving.

## Change text

For all prototypes, edit a key under `shared.text`:

```js
hubHeading: 'Choose your next trail.',
```

For Saltwind Run only, add that key under `prototypes['prototype-01'].text`:

```js
text: {
  pageTitle: 'Saltwind Run · Marble trails',
  startRace: 'Start the run'
},
```

The override wins over the shared value. Keep page text in English. Text containing `{seconds}`, `{name}`, etc. uses automatic placeholders; preserve these if you still want their values displayed. Change speaker names under `shared.text.npc` and `shared.text.you`. Conversation lines are under `shared.events[eventId].lines`; per-prototype `events` override shared event definitions.

## Replace an icon

Edit an entry in `shared.icons`, or define a new icon and refer to its key from an ability:

```js
impulse: {
  viewBox: '0 0 48 48',
  markup: '<path d="M24 6L15 25H24L20 42L35 20H26Z"/>'
},
```

SVG markup is local trusted artwork. For an external file, use:

```js
impulse: {src: 'assets/my-impulse.svg'},
```

Use transparent square icons with suitable contrast; SVG file colors are defined in the file. The HTML provides the accessible button name independently. A prototype can replace a single icon via `icons: {impulse: {...}}`. Portrait artwork uses the same registry. To point an ability at another registry icon, change its `icon` key. Other interface icon references are in `shared.iconRoles`; a prototype can override these via `iconRoles: {map: 'anotherMapIcon'}`.

## Adjust duration or cooldown

Edit `shared.abilityDefaults`, or override one ability for a specific prototype:

```js
abilityOverrides: {
  impulse: {duration: 4, cooldown: 11, icon: 'impulse'}
},
```

Both values are seconds. **Cooldown begins when the effect ends**. Total wait equals duration + cooldown, added once in `ability-model.js`. Keep both values positive. The circle stays gold and its separate rim spins while the effect is active. After the effect, the circle dims and the outer progress ring continues. Activation remains blocked until it reaches zero.

Current settings:

| Ability | Effect duration | Cooldown after effect | Key |
| --- | --- | --- | --- |
| Impulse | 3 s | 10 s | Shift |
| Jump | 1 s (one up/down movement) | 8 s | E |
| Ghost | 3 s | 12 s | Q |

Jump's `duration` is the total ascent/descent time; there is no loop. Ghost has additional `fadeSeconds` and `minOpacity` parameters. Duration changes do not automatically rewrite the ability description: edit its `description` as well. The detailed timer text always uses actual parameters.

## Artwork and basic race parameters

`shared.assets.landscape` supplies both scene and hub artwork. `shared.race.duration` sets the simulation time limit (60 seconds); `length` sets the trail length (1400 metres). Starting rank comes from the initial staggered grid. The six colors define the six racers; the third is the player. Matching English color names are in `shared.race.colorNames`. Racer numbers stay stable across scene, map and editor. Basic UI colors are in `shared.theme`; per-prototype `theme` entries override them. `styles.css` holds layout and fallback colors.

`shared.map.path` is an open SVG path with start at its first point and finish at its last point. The `start` and `finish` coordinates place the symbols. The current route runs from y=28 at the top to y=242 at the bottom. Marker positions are calculated from traveled distance along that path; 0% is the start and 100% the finish.

## Add another independent prototype

1. Copy `prototype-01.html` to `prototype-02.html`.
2. Change only `data-prototype="prototype-01"` on its body to `prototype-02`.
3. Add a `prototype-02` entry in `prototypes` with `file`, `number`, `name`, `description`, `text.pageTitle` and any overrides.

```js
'prototype-02': {
  file: 'prototype-02.html', number: '02', name: 'Another trail',
  description: 'A new variation of the coastal HUD.',
  text: {pageTitle: 'Another trail · Marble trails', npc: 'Mara'},
  abilityOverrides: {ghost: {minOpacity: .3}},
  assets: {}, icons: {}, race: {}, map: {}
}
```

The hub automatically lists every registered prototype. Each HTML has its own direct URL; the shared renderer and content binder work with its selected overrides. No previous prototype needs to be overwritten.


## Shared motion and radio events

There are no individual marble statistics or presets. `race-model.js` applies the same rules to all six: smoothly changing random rhythm/lane targets, occasional contact nudges and a brief shared contact slowdown. Set `shared.race.seed` to a number for reproducible testing; omit it for a fresh run on Reset.

The Test bench lists fixed numbers, color swatches and English color names, enabled event checkboxes, ability timings and test triggers. Reach second place guides the player toward an overtake; collision guides a nearby rival toward contact. Neither trigger teleports a marble. Natural and forced outcomes share event detection.

```js
events: {
  collision: {
    label: 'Collide with the player', cooldown: 6,
    lines: [
      {who: 'npc', text: 'Steady now.'},
      {who: 'player', text: 'Still rolling.'}
    ]
  }
}
```

Each Space press advances one line; Space after the last closes the conversation. Time never advances it. Held keys are ignored, and fields retain their own Space behavior. Pending/current duplicate event conversations cannot accumulate. The event cooldown is a repeat guard, separate from ability cooldowns. New gameplay event types also need a detector/test-action branch in `prototype-01.js`.

The player module is permanently anchored bottom left. The caller appears above it and text unfolds to the right in 330 ms; subsequent lines fade in over 100 ms. Exit lasts 120 ms. Reduced motion uses short fades. Reset cancels animations and the exit cleanup callback, empties the queue and restores the player module.

Original radio portraits live in `shared.icons.npcPortrait` / `playerPortrait`. For another caller add an icon, then add `shared.characters: {mara:{name:'Mara',icon:'maraPortrait'}}` and use `who:'mara'` in a line. Scanlines affect portraits, not text.

## Live ability timing
Open **Show test bench → Ability timing**. Each ability has an effect/jump duration and cooldown, both in seconds (0.1–60). The total updates immediately. Valid changes are captured on the next activation; active effects and cooldown rings retain their original settings. Reset clears effects and the camera but keeps edited timings for another run; reloading restores configuration defaults.

The race is 6,000 world units long over 60 seconds (`shared.race.length` and `duration`). Racer names A–F live in `shared.race.names`. `camera-model.js` controls smooth follow and the wide/close framing transitions. The minimap always uses world progress, independently of camera zoom.

## Radio characters and signals
In `prototype-config.js`, edit `shared.characters.npc.name` to rename Captain Perry and `shared.characters.npc.marbleIndex` to associate him with a racer (0=A, 1=B, 2=C…). Player defaults to index 2 and caller to index 0; the sphere color and letter come from the same race palette. Update names mentioned explicitly in `shared.events.*.lines` as well. `shared.text.faction` holds the provisional “Facción X” label, and `shared.text.transmissionScan` holds the scanner title. Portrait files retain their original colors; CSS applies the yellow screen treatment only while `.radio-dock.transmitting` is present.
