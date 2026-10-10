/* EDIT HERE: page copy, icons, art, dialogue and ability settings.
   Plain JavaScript works over HTTP and when opening the HTML directly. */
window.MARBLE_CONFIG = {
  shared: {
    theme: {ink:'#344d43', paper:'#f7f0db', sage:'#668879', sea:'#8db4aa', gold:'#edc567', rust:'#ae563c', muted:'#596958', white:'#fff9e8'},
    text: {
      brand: 'M.A.R.B.L.E.', home: 'M.A.R.B.L.E. home', hubTitle: 'M.A.R.B.L.E. · Prototypes',
      hubIntro: 'A collection of UI prototypes.', hubHeading: 'Select a prototype.',
      hubFooter: 'M.A.R.B.L.E. prototypes', hubFuture: 'These prototypes are currently under development.',
      back: '← All prototypes', backLabel: 'Back to prototypes', play: 'Test the UI',
      restart: 'Restart demo', restartButton: '↺ Restart demo', controls: 'Demo controls',
      scene: 'Six marbles racing along a sunlit coastal trail', raceProgress: 'Race progress',
      distance: 'Distance to finish', minimap: 'Minimap', toggleMap: 'Toggle minimap',
      toggleMapHelp: 'Toggle minimap (M)', expandMap: 'Expand minimap',
      route: 'Open road from start to finish with six racers',
      conversation: 'Radio conversation', closeConversation: 'Close conversation',
      next: 'Next ›', done: 'Done', you: 'You', npc: 'Vega', abilities: 'Abilities',
      closeAbility: 'Close ability details', activate: 'Activate', active: 'Active', ready: 'Ready',
      cooldown: 'Cooldown {seconds} s', activeCooldown: 'Active · ready in {seconds} s',
      inspect: 'Inspect ability', activated: '{name} activated',
      timing: '{duration} s effect · {cooldown} s from activation',
      activeDetail: 'Effect active · {seconds} s until ready', finishedState: 'Race finished',
      finishIntro: 'That’s the trail.', finishTitle: 'Finish!', finishRestart: 'Ride again',
      simulation: 'Simulation controls', tryMoment: 'Try a moment', pause: 'Pause race', resume: 'Resume race',
      radio: 'Radio call', forceCooldown: 'All on cooldown', allReady: 'All ready',
      changePosition: 'Change position', nearFinish: 'Near the finish',
      keyboard: 'Shift / E / Q: activate · M: map · Space: next line · Esc: close',
      closeMap: 'Close expanded map', mapHeading: 'The coastal trail', otherRacers: 'Other racers',
      start: 'Start ○', finish: 'Finish ⚑', counter: '{current} / {total}',
      inspectName: '{name}: {state}. {inspect}', iconHelp: '{name} · {key} · Inspect',
      playLabel: 'Play {name}', previewLabel: 'Sandy cliffs above a sage-green sea',
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
      npcPortrait: {viewBox:'0 0 90 90', markup:'<path fill="#66877a" d="M8 90V70L31 57H59L82 70V90Z"/><path fill="#d99a74" d="M29 21L45 17L63 26L59 53L47 64L32 53Z"/><path fill="#594b3c" d="M24 29L31 12L57 10L68 28L59 40L55 23L29 38Z"/><path fill="#f4d77a" d="M25 27L28 17L60 17L68 28Z"/><path stroke="#554a3d" stroke-width="3" d="M36 40H40M50 40H54M40 52L49 53"/>'},
      playerPortrait: {viewBox:'0 0 90 90', markup:'<path fill="#be6448" d="M9 90V71L32 57H58L81 71V90Z"/><path fill="#ecc398" d="M29 24L46 19L62 27L59 53L45 65L31 53Z"/><path fill="#9b4b36" d="M24 36L25 20L35 11L58 14L66 29L57 34L49 25L31 36Z"/><path fill="#83b8a8" d="M26 61L43 72L64 60L65 76L43 83L27 75Z"/><path stroke="#554a3d" stroke-width="3" d="M35 42H39M50 42H54M40 54H49"/>'}
    },
    abilityDefaults: [
      {id:'impulse', name:'Impulse', icon:'impulse', key:'Shift', duration:3, cooldown:10, description:'Leave a golden acceleration trail behind your marble for three seconds.'},
      {id:'jump', name:'Jump', icon:'jump', key:'E', duration:1, cooldown:8, description:'Hop once and land back on the trail. Your shadow stays on the ground.'},
      {id:'ghost', name:'Ghost', icon:'ghost', key:'Q', duration:3, cooldown:12, fadeSeconds:.4, minOpacity:.18, description:'Fade softly for three seconds. A small golden ground marker keeps you in sight.'}
    ],
    assets: {landscape:'coast.svg'},
    race: {duration:75, initialPosition:3, colors:['#447d72','#b8664d','#eabf58','#7c8d60','#8a7595','#ede5cc']},
    map: {path:'M112 28L133 48Q151 78 114 104Q83 127 114 149Q148 180 102 198Q50 218 66 242L94 242', start:{x:112,y:28}, finish:{x:94,y:242}},
    dialogue: [
      {who:'npc', text:'There you are! Keep an eye on that bend by the shore.'},
      {who:'player', text:'Got it, Vega. A little impulse should see me through.'},
      {who:'npc', text:'Check the trail if you lose your bearings. You’re the little golden dot.'},
      {who:'player', text:'All clear. See you at the finish!'}
    ]
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
      // Optional full dialogue replacement: dialogue:[{who:'npc',text:'Hello, racer!'}]
    }
  }
};
