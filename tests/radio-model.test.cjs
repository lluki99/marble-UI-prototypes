const assert=require('node:assert/strict'),m=require('../radio-model.js');
let r=m.create();const a={cooldown:6,lines:[{text:'First'},{text:'Second'}]},b={cooldown:6,lines:[{text:'Queued'}]};
assert(m.enqueue(r,'a',a,0));assert(!m.enqueue(r,'a',a,1));assert(m.enqueue(r,'b',b,1));assert(!m.enqueue(r,'b',b,2));
for(let t=0;t<100;t++)assert.equal(m.tick(r,t)?.index,0,'time never advances radio');
assert.equal(m.advance(r).index,1);assert.equal(m.advance(r).id,'b');assert.equal(m.advance(r),null);assert.equal(r.queue.length,0);
r=m.create();assert.equal(r.current,null);assert.equal(r.queue.length,0);assert.deepEqual(r.lastEvents,{});
console.log('PASS: manual advance, no time-driven changes, queue ordering, deduplication and reset.');

const key={space:true,open:true,editing:false,blocked:false,repeat:false};assert.equal(m.spaceAction(key),'advance');assert.equal(m.spaceAction({...key,repeat:true}),'consume');assert.equal(m.spaceAction({...key,editing:true}),null);assert.equal(m.spaceAction({...key,open:false}),null);assert.equal(m.spaceAction({...key,blocked:true}),null);
