const assert=require('node:assert/strict'),m=require('../radio-model.js');
let r=m.create();const a={cooldown:6,lines:[{text:'First'},{text:'Second'}]},b={cooldown:6,lines:[{text:'Queued'}]};
assert(m.enqueue(r,'a',a,0,3));assert(!m.enqueue(r,'a',a,1,3));assert(m.enqueue(r,'b',b,1,3));assert(!m.enqueue(r,'b',b,2,3));
assert.equal(m.tick(r,2.99,3).index,0);assert.equal(m.tick(r,3,3).index,1);assert.equal(m.tick(r,6,3).id,'b');assert.equal(m.tick(r,9,3),null);assert.equal(r.queue.length,0);
r=m.create();assert.equal(r.current,null);assert.equal(r.lineUntil,0);assert.equal(r.queue.length,0);assert.deepEqual(r.lastEvents,{});
console.log('PASS: three-second auto advance, ordered queue, repeated-event protection, auto close and reset.');
