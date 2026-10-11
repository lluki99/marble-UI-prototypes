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


## Marble properties and radio events

Edit `shared.properties` for input ranges/help, `shared.presets` for values, and `shared.marbles` for the six preset assignments. The third marble is the player. Per-prototype `properties`, `presets`, `marbles` and `events` can differ.

| Property | Range | Meaning |
| --- | --- | --- |
| speed | 12–28 | Gameplay target forward speed in m/s, before drag |
| friction | 0–2 | Physical drag strength; reduces motion |
| weight | 0.5–4 | Relative mass/inertia; changes acceleration and collision response |
| bounciness | 0–1 | Restitution; 0 absorbs relative contact speed, 1 rebounds |

```js
presets: {
  Balanced: {speed: 22, friction: .5, weight: 1.4, bounciness: .5},
  // Add another preset here; it automatically appears in the editor.
},
```

Before starting, expand a marble in the Test bench and choose a preset or edit its four numeric fields. Help and ranges appear beneath each field. Select radio events, then start. Reopen the bench during the race to trigger enabled events. Reach second place changes forward distance; collision brings a rival alongside with lateral closing velocity. Contact detection then starts the same radio event used for natural impacts. Hide the bench to evaluate the game HUD.

```js
events: {
  collision: {
    label: 'Collide with the player', cooldown: 6,
    lines: [
      {who: 'npc', text: 'Steady now.', duration: 3},
      {who: 'player', text: 'Still rolling.'}
    ]
  }
},
dialogueLineDuration: 3,
```

The event cooldown is a repeat guard, separate from ability cooldowns. An event cannot queue again while its conversation is current or pending. `duration` on a line overrides `dialogueLineDuration`. Definitions and copy belong here; genuinely new gameplay event types also need a detection/forced-action branch in `prototype-01.js`.

The Test bench’s Ability timings section shows configured effect, cooldown and total wait for each ability.

Original radio portraits live in `shared.icons.npcPortrait` / `playerPortrait`: a 32-unit stepped silhouette in four greens. Scanlines are applied only to portraits in CSS; text is not distorted.
