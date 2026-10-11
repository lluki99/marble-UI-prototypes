/* Small fixed-step longitudinal/lateral simulation; units are metres and seconds. */
(function(root,factory){if(typeof module==='object')module.exports=factory();else root.MarbleRace=factory();})(globalThis,()=>{
 const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
 function create(settings,properties){return {elapsed:0,duration:settings.duration,length:settings.length,balls:properties.map((p,i)=>({...p,id:i,s:(properties.length-i)*1.8,x:(i%3-1)*1.1,v:0,vx:0})),contacts:new Set()};}
 function ranking(r){return [...r.balls].sort((a,b)=>b.s-a.s||a.id-b.id);}
 function step(r,dt,impulse=false){
  dt=Math.min(dt,r.duration-r.elapsed);if(dt<=0)return [];
  const hits=[],radius=.48;
  for(const b of r.balls){
   const target=b.speed*(impulse&&b.id===2?1.6:1);
   b.v+=((target-b.v)*1.8/b.weight-b.friction*b.v*.12)*dt;
   // Gentle steering toward the trail centre; lateral motion comes from contacts.
   b.vx+=(-b.x*.13-b.vx*(.7+b.friction))*dt;
   b.s=clamp(b.s+b.v*dt,0,r.length);b.x+=b.vx*dt;
   if(Math.abs(b.x)>2.1){b.x=clamp(b.x,-2.1,2.1);b.vx*=-b.bounciness;}
   if(b.s===r.length)b.v=0;
  }
  const contacts=new Set();
  for(let i=0;i<r.balls.length;i++)for(let j=i+1;j<r.balls.length;j++){
   const a=r.balls[i],b=r.balls[j],ds=b.s-a.s,dx=b.x-a.x,d=Math.hypot(ds,dx),key=i+':'+j;
   if(d>=radius*2)continue;contacts.add(key);
   const ns=d>.001?ds/d:1,nx=d>.001?dx/d:0,inv=1/a.weight+1/b.weight;
   const overlap=radius*2-d+.001;
   a.s-=ns*overlap/a.weight/inv;b.s+=ns*overlap/b.weight/inv;
   a.x-=nx*overlap/a.weight/inv;b.x+=nx*overlap/b.weight/inv;
   const relative=(b.v-a.v)*ns+(b.vx-a.vx)*nx;
   if(relative<0){const impulse=-(1+Math.min(a.bounciness,b.bounciness))*relative/inv;a.v-=impulse*ns/a.weight;b.v+=impulse*ns/b.weight;a.vx-=impulse*nx/a.weight;b.vx+=impulse*nx/b.weight;}
   if(!r.contacts.has(key))hits.push([a.id,b.id]);
  }
  r.contacts=contacts;r.elapsed=Math.min(r.duration,r.elapsed+dt);return hits;
 }
 function forceSecond(r){const others=ranking(r).filter(b=>b.id!==2);r.balls[2].s=(others[0].s+others[1].s)/2;}
 function forceCollision(r){const p=r.balls[2],b=r.balls[3];b.s=p.s+.12;b.x=p.x+1.02;b.v=p.v;b.vx=-5;}
 return {create,step,ranking,forceSecond,forceCollision};
});
