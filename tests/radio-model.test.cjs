const assert=require('node:assert/strict'),m=require('../radio-model.js');
let r=m.create();const a={cooldown:6,lines:[{text:'First'},{text:'Second'}]},b={cooldown:6,lines:[{text:'Queued'}]};
assert(m.enqueue(r,'a',a,0));assert(!m.enqueue(r,'a',a,1));assert(m.enqueue(r,'b',b,1));assert(!m.enqueue(r,'b',b,2));
assert.equal(m.tick(r,3).index,0,'short line remains for at least three seconds');
assert.equal(m.advance(r).index,1);assert.equal(m.advance(r).id,'b');assert.equal(m.advance(r),null);assert.equal(r.queue.length,0);
r=m.create();assert.equal(r.current,null);assert.equal(r.queue.length,0);assert.deepEqual(r.lastEvents,{});
console.log('PASS: manual skip, timed advance, queue ordering, deduplication and reset.');

const key={space:true,open:true,editing:false,blocked:false,repeat:false};assert.equal(m.spaceAction(key),'advance');assert.equal(m.spaceAction({...key,repeat:true}),'consume');assert.equal(m.spaceAction({...key,editing:true}),null);assert.equal(m.spaceAction({...key,open:false}),null);assert.equal(m.spaceAction({...key,blocked:true}),null);

r=m.create();const timed={cooldown:1,lines:[{text:'Hi'},{text:'x'.repeat(120)}]};m.enqueue(r,'timed',timed,0);assert.equal(m.lineDuration(timed.lines[0],r.timing),3.02);assert.equal(m.lineDuration(timed.lines[1],r.timing),4);assert.equal(m.tick(r,3.019).index,0);assert.equal(m.tick(r,3.02).index,1);assert.equal(m.tick(r,7.019).index,1);assert.equal(m.tick(r,7.02),null);r=m.create();m.enqueue(r,'a',a,0);m.enqueue(r,'b',b,0);m.tick(r,4);assert.equal(m.tick(r,8).id,'b');assert.equal(m.tick(r,12),null);r=m.create();assert.equal(m.tick(r,100),null);console.log('PASS: 3–4 second length-based timing, auto close, queue and clean reset.');
