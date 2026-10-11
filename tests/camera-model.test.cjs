const assert=require('node:assert/strict'),camera=require('../camera-model.js'),ability=require('../ability-model.js');
const c=camera.create();let wide=false,close=false;
for(let n=0;n<7200;n++){const before={...c};camera.step(c,n/7200*6000,6000,1/120);assert(c.s>=before.s);assert(c.s-before.s<1);assert(Math.abs(c.zoom-before.zoom)<.01);assert(Math.abs(c.x-before.x)<1);if(n===3600)wide=c.zoom<.82;if(n===6500)close=c.zoom>1.15;}
assert(wide&&close);assert(c.s>5900);assert(340/c.zoom<6000/10,'only a small section fits on screen');
const reduced=camera.create();camera.step(reduced,5000,6000,1,true);assert.equal(reduced.zoom,1);
const settings={duration:3,cooldown:10};const active=ability.activate(ability.idle(),settings,0);settings.duration=1;settings.cooldown=2;
assert.equal(active.activeUntil,3);assert.equal(active.readyAt,13);assert.equal(active.settings.duration,3);assert.equal(ability.activate(active,settings,12),null);const next=ability.activate(active,settings,13);assert.equal(next.activeUntil,14);assert.equal(next.readyAt,16);
const jump=ability.activate(ability.idle(),{duration:2,cooldown:8},0);assert.equal(ability.jumpHeight(jump,{duration:9},1),1);
for(const value of ['',0,-1,61,'abc',Infinity])assert(!ability.validTiming(value));for(const value of [.1,3,60])assert(ability.validTiming(value));
console.log('PASS: long-track follow, smooth wide/close framing, reduced motion, timing validation and immutable activation settings.');
