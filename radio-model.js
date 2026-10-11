(function(root,factory){if(typeof module==='object')module.exports=factory();else root.MarbleRadio=factory();})(globalThis,()=>{
function create(){return {queue:[],current:null,lastEvents:{}};}
function tick(r){if(!r.current&&r.queue.length)r.current=r.queue.shift();return r.current;}
function advance(r){if(r.current){r.current.index++;if(r.current.index>=r.current.lines.length)r.current=null;}return tick(r);}
function enqueue(r,id,def,now){if(r.current?.id===id||r.queue.some(c=>c.id===id)||now-(r.lastEvents[id]??-Infinity)<def.cooldown)return false;r.lastEvents[id]=now;r.queue.push({id,lines:def.lines,index:0});tick(r);return true;}
function spaceAction({space,open,editing,blocked,repeat}){return space&&open&&!editing&&!blocked?(repeat?'consume':'advance'):null;}
return {create,tick,advance,enqueue,spaceAction};});
