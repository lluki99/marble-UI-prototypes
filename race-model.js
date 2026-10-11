/* Common rules; smoothly changing random targets are temporary motion state, not stats. */
(function(root,factory){if(typeof module==='object')module.exports=factory();else root.MarbleRace=factory();})(globalThis,()=>{
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function random(r){r.seed=(Math.imul(r.seed,1664525)+1013904223)>>>0;return r.seed/4294967296;}
function create(c){return {elapsed:0,duration:c.duration,length:c.length,seed:c.seed??Math.floor(Math.random()*4294967296),orders:{},contacts:new Set(),balls:c.colors.map((_,i)=>({id:i,s:(c.colors.length-i)*18,x:(i%3-1)*1.3,v:0,vx:0,pace:1,targetPace:1,lane:(i%3-1)*1.3,nextChange:0,slowUntil:0}))};}
function ranking(r){return [...r.balls].sort((a,b)=>b.s-a.s||a.id-b.id);}
function step(r,dt,impulse=false){dt=Math.min(dt,r.duration-r.elapsed);if(dt<=0)return [];const hits=[];
for(const b of r.balls){if(r.elapsed>=b.nextChange){b.targetPace=.78+random(r)*.44;b.lane=-1.8+random(r)*3.6;b.nextChange=r.elapsed+2+random(r)*3;}b.pace+=(b.targetPace-b.pace)*dt*.8;let target=r.length/r.duration*1.04*b.pace*(r.elapsed<b.slowUntil?.84:1)*(impulse&&b.id===2?1.5:1);const order=r.orders[b.id];if(order){const other=r.balls[order.target];b.lane=other.x+order.side*.75;target=other.v+clamp((other.s+order.offset-b.s)*1.8,-r.length/r.duration*.6,r.length/r.duration*.6);if(r.elapsed>order.until)delete r.orders[b.id];}b.v+=(Math.max(0,target)-b.v)*dt*1.8;b.vx+=((clamp(b.lane,-1.9,1.9)-b.x)*3-b.vx*3)*dt;b.s=clamp(b.s+b.v*dt,0,r.length);b.x=clamp(b.x+b.vx*dt,-2.1,2.1);if(b.s===r.length)b.v=0;}
const contacts=new Set();for(let i=0;i<r.balls.length;i++)for(let j=i+1;j<r.balls.length;j++){const a=r.balls[i],b=r.balls[j],key=i+':'+j;if(Math.abs(a.s-b.s)>1.1||Math.abs(a.x-b.x)>.85)continue;contacts.add(key);if(!r.contacts.has(key)){hits.push([i,j]);a.slowUntil=b.slowUntil=r.elapsed+.65;const side=a.x<=b.x?-1:1;a.vx+=side*.7;b.vx-=side*.7;}}r.contacts=contacts;r.elapsed=Math.min(r.duration,r.elapsed+dt);return hits;}
function forceSecond(r){const others=ranking(r).filter(b=>b.id!==2);r.orders[2]={target:others[1].id,offset:1.6,side:1,until:r.elapsed+12};}
function forceCollision(r){const p=r.balls[2],b=r.balls.filter(b=>b.id!==2).sort((a,b)=>Math.abs(a.s-p.s)-Math.abs(b.s-p.s))[0];r.orders[b.id]={target:2,offset:0,side:p.x>0?-1:1,until:r.elapsed+12};}
return {create,step,ranking,forceSecond,forceCollision};});
