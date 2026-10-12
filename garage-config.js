/* Garage coordinates are pixels in the original 1983 × 793 shared canvas. */
window.GARAGE_CONFIG={
 width:1983,height:793,background:'assets/garage/Environment.png',initial:'mechanic',
 text:{title:'Garage UI',back:'← All prototypes',reset:'Reset',close:'Close',help:'A / D to navigate · Enter to select · Esc to return',previous:'Previous object',next:'Next object',select:'Select',loading:'Loading garage…',error:'Garage assets could not load. Reload to try again.'},
 motion:{overscan:1.035,mouseTravel:22,smoothing:9,zoomSmoothing:6,pulseSeconds:2.4,pulseScale:1.006,alphaThreshold:32},
 objects:[
 {id:'mechanic',name:'Geralt Witcher',src:'Mecanico.png',layer:5,bounds:[395,235,209,460],pivot:[500,465],zoom:{scale:1.85,target:[500,450]},menu:{id:'mechanic-menu',content:[]}},
 {id:'marble',name:'Marble',src:'Bola.png',layer:2,bounds:[635,190,364,351],pivot:[817,365],zoom:{scale:1.65,target:[817,365]},menu:{id:'marble-menu',content:[]}},
 {id:'lift',name:'Lift',src:'Elevador.png',layer:3,bounds:[579,169,486,428],pivot:[822,383],zoom:{scale:1.55,target:[822,383]},menu:{id:'lift-menu',content:[]}},
 {id:'leaderboard',name:'Leaderboard',src:'Leaderboard.png',layer:4,bounds:[1121,229,274,143],pivot:[1258,301],zoom:{scale:2,target:[1258,301]},menu:{id:'leaderboard-menu',content:[]}},
 {id:'racer',name:'Racer',src:'Corredora.png',layer:6,bounds:[1373,262,159,334],pivot:[1453,429],zoom:{scale:1.9,target:[1453,429]},menu:{id:'racer-menu',content:[]}},
 {id:'door',name:'Door',src:'Puerta.png',layer:1,bounds:[1565,177,103,302],pivot:[1617,328],zoom:{scale:1.8,target:[1617,328]},menu:{id:'door-menu',content:[]}},
 {id:'terminal',name:'Terminal',src:'Terminal.png',layer:7,bounds:[1660,365,280,177],pivot:[1800,454],zoom:{scale:1.8,target:[1800,454]},menu:{id:'terminal-menu',content:[]}}
 ]
};
