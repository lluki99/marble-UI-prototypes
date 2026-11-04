/* Editable iteration 2: one-shot reactions, portrait assets, HUD and gameplay. */
window.MARBLE_CONFIG = {
  "shared": {
    "portraitTransmission": {
      "intensity": 0.9,
      "minIntervalMs": 450,
      "maxIntervalMs": 1100
    },
    "reactionTiming": {
      "minSeconds": 3,
      "maxSeconds": 4,
      "charactersForMax": 100
    },
    "theme": {
      "ink": "#121821",
      "paper": "#eee3c6",
      "sage": "#526f69",
      "sea": "#17394b",
      "gold": "#9fdefc",
      "rust": "#bd3449",
      "muted": "#665e50",
      "white": "#fff6da"
    },
    "text": {
      "radioLink": "Radio link",
      "faction": "People's M.A.R.B.L.E. Navy",
      "raceStart": "Start",
      "raceFinish": "Finish",
      "abilitySettings": "Ability timing",
      "timingDuration": "Effect duration (s)",
      "jumpDuration": "Jump duration (s)",
      "timingCooldown": "Cooldown (s)",
      "timingTotal": "{total} s between activations",
      "timingHint": "Changes apply on the next activation. Enter 0.1–60 seconds.",
      "timingError": "Enter a number from 0.1 to 60 seconds.",
      "reactionTriggers": "Reaction trigger events",
      "abilitySetting": "{name}: {duration} s effect + {cooldown} s cooldown = {total} s between uses",
      "preparation": "Prepare the run",
      "startRace": "Start 60-second race",
      "testTools": "Test bench",
      "hideTools": "Hide test bench",
      "showTools": "Show test bench",
      "enabledEvents": "Enabled reaction events",
      "marble": "{name}",
      "playerMarble": "{name}",
      "result": "Your result: {rank} / {count} · {progress}% of the trail",
      "prepHint": "Shared racing rules, changing rhythm. Choose reaction events and start the run.",
      "simulationStatus": "{phase} · {time} / 60 s",
      "preparing": "Preparation",
      "running": "Running",
      "finished": "Finished",
      "brand": "M.A.R.B.L.E.",
      "home": "M.A.R.B.L.E. home",
      "hubTitle": "M.A.R.B.L.E. · Prototypes",
      "hubIntro": "A collection of UI prototypes.",
      "hubHeading": "Select a prototype.",
      "hubFooter": "M.A.R.B.L.E. prototypes",
      "hubFuture": "These prototypes are currently under development.",
      "back": "← All prototypes",
      "backLabel": "Back to prototypes",
      "play": "Test the UI",
      "restart": "Reset",
      "restartButton": "↺ Restart demo",
      "controls": "Demo controls",
      "scene": "Eight racers moving downward through a desert speedway",
      "raceProgress": "Race progress",
      "distance": "Distance to finish",
      "minimap": "Minimap",
      "toggleMap": "Toggle minimap",
      "toggleMapHelp": "Toggle minimap (M)",
      "expandMap": "Expand minimap",
      "route": "Open road from start to finish with eight racers",
      "reaction": "Character reaction",
      "next": "Next ›",
      "done": "Done",
      "you": "You",
      "npc": "Captain Perry",
      "abilities": "Abilities",
      "closeAbility": "Close ability details",
      "activate": "Activate",
      "active": "Active",
      "ready": "Ready",
      "cooldown": "Cooldown {seconds} s",
      "activeCooldown": "Active {seconds} s",
      "inspect": "Inspect ability",
      "timing": "{duration} s effect → {cooldown} s cooldown",
      "activeDetail": "Effect: {seconds} s left; cooldown follows",
      "finishedState": "Race finished",
      "finishIntro": "Time is up.",
      "finishTitle": "Race results",
      "resultsRacer": "Marble",
      "resultsProgress": "Progress",
      "resultsArrival": "Arrival",
      "resultsPending": "Not finished",
      "resultsPlayer": "You finished {rank} / {count}",
      "finishRestart": "Ride again",
      "simulation": "Simulation controls",
      "tryMoment": "Try a moment",
      "pause": "Pause race",
      "resume": "Resume race",
      "radio": "Radio call",
      "forceCooldown": "All on cooldown",
      "allReady": "All ready",
      "changePosition": "Change position",
      "nearFinish": "Near the finish",
      "keyboard": "Space: dismiss reaction · Shift / E / Q: activate · M: map",
      "closeMap": "Close expanded map",
      "mapHeading": "The speedway",
      "otherRacers": "Other racers",
      "start": "Start ○",
      "finish": "Finish ⚑",
      "inspectName": "{name}: {state}. {inspect}",
      "iconHelp": "{name} · {key} · Inspect",
      "playLabel": "Play {name}",
      "previewLabel": "A desert speedway beneath an ink-blue sky",
      "cardVersion": "Race interface · Prototype {number}"
    },
    "iconRoles": {
      "brand": "brand",
      "arrow": "arrow",
      "restart": "restart",
      "controls": "controls",
      "map": "map",
      "close": "close",
      "expand": "expand"
    },
    "icons": {
      "impulse": {
        "viewBox": "0 0 48 48",
        "markup": "<path d=\"M24 6L15 25H24L20 42L35 20H26Z\"/>"
      },
      "jump": {
        "viewBox": "0 0 48 48",
        "markup": "<path d=\"M8 37H40M24 31V9M14 19L24 9L34 19\"/>"
      },
      "ghost": {
        "viewBox": "0 0 48 48",
        "markup": "<path d=\"M11 39V21Q11 7 24 7Q37 7 37 21V39L30 35L24 39L18 35Z\"/><path d=\"M19 21V24M29 21V24\"/>"
      },
      "map": {
        "viewBox": "0 0 48 48",
        "markup": "<path d=\"M8 12L19 8L30 13L40 9V36L30 40L19 35L8 39ZM19 8V35M30 13V40\"/>"
      },
      "controls": {
        "viewBox": "0 0 32 32",
        "markup": "<path d=\"M5 9H27M5 23H27M12 5V13M22 19V27\"/>"
      },
      "restart": {
        "viewBox": "0 0 32 32",
        "markup": "<path d=\"M8 11A10 10 0 1 1 6 20M8 5V11H14\"/>"
      },
      "close": {
        "viewBox": "0 0 32 32",
        "markup": "<path d=\"M9 9L23 23M23 9L9 23\"/>"
      },
      "expand": {
        "viewBox": "0 0 32 32",
        "markup": "<path d=\"M5 14V5H14M18 27H27V18M5 5L12 12M27 27L20 20\"/>"
      },
      "arrow": {
        "viewBox": "0 0 32 32",
        "markup": "<path d=\"M6 16H26M18 8L26 16L18 24\"/>"
      },
      "brand": {
        "viewBox": "0 0 40 40",
        "markup": "<circle cx=\"20\" cy=\"20\" r=\"15\"/><path d=\"M9 28Q30 28 30 10M8 16Q20 13 27 27\"/>"
      }
    },
    "abilityDefaults": [
      {
        "id": "impulse",
        "name": "Impulse",
        "icon": "impulse",
        "key": "Shift",
        "duration": 3,
        "cooldown": 10,
        "description": "Leave a light blue acceleration trail behind your marble for the configured duration."
      },
      {
        "id": "jump",
        "name": "Jump",
        "icon": "jump",
        "key": "E",
        "duration": 1,
        "cooldown": 8,
        "description": "Hop once and land back on the trail. Your shadow stays on the ground."
      },
      {
        "id": "ghost",
        "name": "Ghost",
        "icon": "ghost",
        "key": "Q",
        "duration": 3,
        "cooldown": 12,
        "fadeSeconds": 0.4,
        "minOpacity": 0.18,
        "description": "Fade softly for the configured duration. A small light blue ground marker keeps you in sight."
      }
    ],
    "characters": {
      "npc": {
        "name": "Captain Rennick",
        "marbleIndex": 1,
        "portrait": "assets/radio-caller.png"
      },
      "player": {
        "name": "You",
        "marbleIndex": 2,
        "portrait": "assets/radio-player.png"
      }
    },
    "assets": {
      "landscape": "speedway.svg"
    },
    "race": {
      "duration": 60,
      "length": 6000,
      "names": [
        "Mil Rowan",
        "Captain Rennick",
        "You",
        "Potemkin",
        "Unit-01",
        "Unit-02",
        "Juniper Joy",
        "River Rayne"
      ],
      "initialPosition": 3,
      "colorNames": [
        "Teal",
        "Crimson",
        "Light blue",
        "Lime",
        "Violet",
        "Ivory",
        "Orange",
        "Blue"
      ],
      "colors": [
        "#27b6ad",
        "#e84962",
        "#9fdefc",
        "#a4d94c",
        "#b186e4",
        "#fff1d0",
        "#f49342",
        "#6aabec"
      ],
      "labels": [
        "MR",
        "CR",
        "YOU",
        "PT",
        "U1",
        "U2",
        "JJ",
        "RR"
      ]
    },
    "map": {
      "path": "M112 28L133 48Q151 78 114 104Q83 127 114 149Q148 180 102 198Q50 218 66 242L94 242",
      "start": {
        "x": 112,
        "y": 28
      },
      "finish": {
        "x": 94,
        "y": 242
      }
    },
    "events": {
      "second": {
        "label": "Reach second place",
        "cooldown": 8,
        "reaction": {
          "who": "npc",
          "text": "Second place! Keep that line."
        }
      },
      "collision": {
        "label": "Collide with the player",
        "cooldown": 6,
        "reaction": {
          "who": "npc",
          "text": "A bump from the side. Steady now."
        }
      }
    }
  },
  "prototypes": {
    "prototype-03": {
      "name": "Prototype 1 - Iteration 2",
      "text": {
        "pageTitle": "Prototype 1 - Iteration 2 · Racers UI"
      }
    }
  }
};
