const assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
const context={window:{}};vm.runInNewContext(fs.readFileSync('prototype-config.js','utf8'),context);
const c=context.window.MARBLE_CONFIG.shared,m=require('../race-model.js');
const run=(props,seconds=60)=>{const r=m.create(c.race,props);for(let i=0;i<seconds*120+2;i++)m.step(r,1/120);return r;};
const single=p=>run([p]);
const balanced=c.presets.Balanced;
assert(single({...balanced,speed:28}).balls[0].s>single({...balanced,speed:12}).balls[0].s);
assert(single({...balanced,friction:0}).balls[0].s>single({...balanced,friction:2}).balls[0].s);
assert(run([{...balanced,weight:.5}],1).balls[0].v>run([{...balanced,weight:4}],1).balls[0].v);
const r=run(c.marbles.map(n=>c.presets[n]));assert.equal(r.elapsed,60);assert(new Set(r.balls.map(b=>Math.round(b.s))).size>2);
const snapshot=JSON.stringify(r.balls);m.step(r,1);assert.equal(JSON.stringify(r.balls),snapshot);
for(const b of r.balls)for(const key of ['s','x','v','vx'])assert(Number.isFinite(b[key]));
const forced=m.create(c.race,c.marbles.map(n=>c.presets[n]));m.forceSecond(forced);assert.equal(m.ranking(forced)[1].id,2);
m.forceCollision(forced);let collision=false;for(let i=0;i<120;i++)if(m.step(forced,1/120).some(pair=>pair.includes(2)))collision=true;assert(collision);
function rebound(bounciness){const r=m.create(c.race,[{...balanced,bounciness},{...balanced,bounciness}]);Object.assign(r.balls[0],{s:10,x:0,v:20});Object.assign(r.balls[1],{s:10.9,x:0,v:0});m.step(r,1/120);return r.balls[1].v-r.balls[0].v;}
assert(rebound(1)>rebound(0));
const natural=m.create(c.race,c.marbles.map(n=>c.presets[n]));let hits=0;for(let i=0;i<7200;i++)hits+=m.step(natural,1/120).filter(p=>p.includes(2)).length;assert(hits>0);
console.log('PASS: exact 60-second stop, distinct progress, speed/drag/mass/restitution, stability, natural and forced contacts.');
