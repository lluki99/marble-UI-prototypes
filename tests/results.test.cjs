const assert=require('node:assert/strict'),race=require('../race-model.js');
const ranks=new Set();
for(const seed of [1,2,3,42,99]){
 const r=race.create({duration:60,length:6000,colors:Array(6).fill(''),seed});
 for(let n=0;n<7202;n++)race.step(r,1/120);
 assert.equal(r.elapsed,60);assert.deepEqual(r.result.map(b=>b.id),race.ranking(r).map(b=>b.id));
 ranks.add(r.result.find(b=>b.id===2).rank);
 const saved=JSON.stringify(r.result);race.step(r,10);assert.equal(JSON.stringify(r.result),saved);
}
assert(ranks.size>=3,'player can finish in several different positions');
const tied=race.create({duration:60,length:6000,colors:Array(6).fill(''),seed:1});
tied.balls.forEach((b,i)=>{b.s=6000;b.finishedAt=[5,4,1,2,6,3][i];});
assert.equal(race.ranking(tied)[0].id,2,'arrival order wins over initial identifiers');
console.log('PASS: arrival order, varied final places, matching ranking and immutable result at 60 seconds. Player ranks:',[...ranks].join(', '));
