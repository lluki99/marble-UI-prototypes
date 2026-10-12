/* EDIT HERE: page copy, icons, art, dialogue and ability settings.
   Plain JavaScript works over HTTP and when opening the HTML directly. */
window.MARBLE_CONFIG = {
  shared: {
    theme: {ink:'#121821', paper:'#eee3c6', sage:'#526f69', sea:'#17394b', gold:'#ffd348', rust:'#bd3449', muted:'#665e50', white:'#fff6da'},
    text: {
      radioLink:'Radio link', transmissionScan:'Scanning Incoming Transmissions', faction:'Facción X', raceStart:'Start', raceFinish:'Finish', abilitySettings:'Ability timing', timingDuration:'Effect duration (s)', jumpDuration:'Jump duration (s)', timingCooldown:'Cooldown (s)', timingTotal:'{total} s between activations', timingHint:'Changes apply on the next activation. Enter 0.1–60 seconds.', timingError:'Enter a number from 0.1 to 60 seconds.', dialogueTriggers:'Dialogue trigger events', abilitySetting:'{name}: {duration} s effect + {cooldown} s cooldown = {total} s between uses', preparation:'Prepare the run', startRace:'Start 60-second race', testTools:'Test bench', hideTools:'Hide test bench', showTools:'Show test bench', enabledEvents:'Enabled radio events', marble:'Marble {name}', playerMarble:'You · marble {name}', result:'Your result: {rank} / {count} · {progress}% of the trail', prepHint:'Shared racing rules, changing rhythm. Choose the radio events and start the run.', simulationStatus:'{phase} · {time} / 60 s', preparing:'Preparation', running:'Running', finished:'Finished',
      brand: 'M.A.R.B.L.E.', home: 'M.A.R.B.L.E. home', hubTitle: 'M.A.R.B.L.E. · Prototypes',
      hubIntro: 'A collection of UI prototypes.', hubHeading: 'Select a prototype.',
      hubFooter: 'M.A.R.B.L.E. prototypes', hubFuture: 'These prototypes are currently under development.',
      back: '← All prototypes', backLabel: 'Back to prototypes', play: 'Test the UI',
      restart: 'Reset', restartButton: '↺ Restart demo', controls: 'Demo controls',
      scene: 'Six lettered marbles racing downward through a desert speedway', raceProgress: 'Race progress',
      distance: 'Distance to finish', minimap: 'Minimap', toggleMap: 'Toggle minimap',
      toggleMapHelp: 'Toggle minimap (M)', expandMap: 'Expand minimap',
      route: 'Open road from start to finish with six racers',
      callerPortrait:'{name} radio portrait', continueRadio:'Space to continue', playerPortrait:'Player radio portrait', conversation: 'Radio conversation', closeConversation: 'Close conversation',
      next: 'Next ›', done: 'Done', you: 'You', npc: 'Captain Perry', abilities: 'Abilities',
      closeAbility: 'Close ability details', activate: 'Activate', active: 'Active', ready: 'Ready',
      cooldown: 'Cooldown {seconds} s', activeCooldown: 'Active {seconds} s',
      inspect: 'Inspect ability', activated: '{name} activated',
      timing: '{duration} s effect → {cooldown} s cooldown',
      activeDetail: 'Effect: {seconds} s left; cooldown follows', finishedState: 'Race finished',
      finishIntro: 'Time is up.', finishTitle: 'Race results', resultsRacer:'Marble', resultsProgress:'Progress', resultsArrival:'Arrival', resultsPending:'Not finished', resultsPlayer:'You finished {rank} / {count}', finishRestart: 'Ride again',
      simulation: 'Simulation controls', tryMoment: 'Try a moment', pause: 'Pause race', resume: 'Resume race',
      radio: 'Radio call', forceCooldown: 'All on cooldown', allReady: 'All ready',
      changePosition: 'Change position', nearFinish: 'Near the finish',
      keyboard: 'Space: continue radio · Shift / E / Q: activate · M: map',
      closeMap: 'Close expanded map', mapHeading: 'The speedway', otherRacers: 'Other racers',
      start: 'Start ○', finish: 'Finish ⚑', counter: '{current} / {total}',
      inspectName: '{name}: {state}. {inspect}', iconHelp: '{name} · {key} · Inspect',
      playLabel: 'Play {name}', previewLabel: 'A desert speedway beneath an ink-blue sky',
      cardVersion: 'Race interface · Prototype {number}'
    },
    iconRoles: {brand:'brand', arrow:'arrow', restart:'restart', controls:'controls', map:'map', close:'close', expand:'expand', npcPortrait:'npcPortrait', playerPortrait:'playerPortrait'},
    icons: {
      impulse: {viewBox:'0 0 48 48', markup:'<path d="M24 6L15 25H24L20 42L35 20H26Z"/>'},
      jump: {viewBox:'0 0 48 48', markup:'<path d="M8 37H40M24 31V9M14 19L24 9L34 19"/>'},
      ghost: {viewBox:'0 0 48 48', markup:'<path d="M11 39V21Q11 7 24 7Q37 7 37 21V39L30 35L24 39L18 35Z"/><path d="M19 21V24M29 21V24"/>'},
      map: {viewBox:'0 0 48 48', markup:'<path d="M8 12L19 8L30 13L40 9V36L30 40L19 35L8 39ZM19 8V35M30 13V40"/>'},
      controls: {viewBox:'0 0 32 32', markup:'<path d="M5 9H27M5 23H27M12 5V13M22 19V27"/>'},
      restart: {viewBox:'0 0 32 32', markup:'<path d="M8 11A10 10 0 1 1 6 20M8 5V11H14"/>'},
      close: {viewBox:'0 0 32 32', markup:'<path d="M9 9L23 23M23 9L9 23"/>'},
      expand: {viewBox:'0 0 32 32', markup:'<path d="M5 14V5H14M18 27H27V18M5 5L12 12M27 27L20 20"/>'},
      arrow: {viewBox:'0 0 32 32', markup:'<path d="M6 16H26M18 8L26 16L18 24"/>'},
      brand: {viewBox:'0 0 40 40', markup:'<circle cx="20" cy="20" r="15"/><path d="M9 28Q30 28 30 10M8 16Q20 13 27 27"/>'},
      npcPortrait: {src:'assets/radio-caller.png'},
      playerPortrait: {src:'assets/radio-player.png'}
    },
    abilityDefaults: [
      {id:'impulse', name:'Impulse', icon:'impulse', key:'Shift', duration:3, cooldown:10, description:'Leave a golden acceleration trail behind your marble for the configured duration.'},
      {id:'jump', name:'Jump', icon:'jump', key:'E', duration:1, cooldown:8, description:'Hop once and land back on the trail. Your shadow stays on the ground.'},
      {id:'ghost', name:'Ghost', icon:'ghost', key:'Q', duration:3, cooldown:12, fadeSeconds:.4, minOpacity:.18, description:'Fade softly for the configured duration. A small golden ground marker keeps you in sight.'}
    ],
    characters: {npc:{name:'Captain Perry',icon:'npcPortrait',marbleIndex:0},player:{name:'You',icon:'playerPortrait',marbleIndex:2}},
    assets: {landscape:'speedway.svg'},
    race: {duration:60, length:6000, names:['A','B','C','D','E','F'], initialPosition:3, colorNames:['Teal','Crimson','Gold','Lime','Violet','Ivory'], colors:['#27b6ad','#e84962','#ffd348','#a4d94c','#b186e4','#fff1d0']},
    map: {path:'M112 28L133 48Q151 78 114 104Q83 127 114 149Q148 180 102 198Q50 218 66 242L94 242', start:{x:112,y:28}, finish:{x:94,y:242}},
    events: {
      second:{label:'Reach second place',cooldown:8,lines:[{who:'npc',text:'Second place! Keep that line.'},{who:'player',text:'One more marble ahead.'}]},
      collision:{label:'Collide with the player',cooldown:6,lines:[{who:'npc',text:'A bump from the side. Steady now.'},{who:'player',text:'Still rolling, Captain Perry.'}]}
    }

  },
  // Each independent HTML selects one entry using data-prototype on <body>.
  prototypes: {
    'prototype-01': {
      file:'prototype-01.html', number:'01', name:'Races UI',
      description:'UI prototype for the races interface.',
      text:{pageTitle:'Race UI · M.A.R.B.L.E.'},
      abilityOverrides:{}, assets:{}, icons:{}, iconRoles:{}, race:{}, map:{}, theme:{}
      // Override any shared text by adding its key above.
      // Override one ability: abilityOverrides:{impulse:{duration:4,cooldown:11}}
      // Optional event replacement: events:{collision:{label:'Collision',cooldown:6,lines:[{who:'npc',text:'Steady!'}]}}
    }
  }
};
