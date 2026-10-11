(function(root,factory){if(typeof module==='object')module.exports=factory();else root.MarbleRadio=factory();})(globalThis,()=>{
 function create(){return {queue:[],current:null,lineUntil:0,lastEvents:{}};}
 function tick(r,now,duration){
  if(r.current&&now>=r.lineUntil){r.current.index++;if(r.current.index>=r.current.lines.length)r.current=null;else r.lineUntil=now+(r.current.lines[r.current.index].duration||duration);}
  if(!r.current&&r.queue.length){r.current=r.queue.shift();r.lineUntil=now+(r.current.lines[0].duration||duration);}
  return r.current;
 }
 function enqueue(r,id,def,now,duration){if(r.current?.id===id||r.queue.some(c=>c.id===id)||now-(r.lastEvents[id]??-Infinity)<def.cooldown)return false;r.lastEvents[id]=now;r.queue.push({id,lines:def.lines,index:0});tick(r,now,duration);return true;}
 return {create,tick,enqueue};
});
