(function(root,factory){if(typeof module==='object')module.exports=factory();else root.MarbleRadio=factory();})(globalThis,()=>{
function create(timing={}){return {queue:[],current:null,lastEvents:{},timing:{minSeconds:3,maxSeconds:4,charactersForMax:100,...timing}};}
function lineDuration(line,timing){return timing.minSeconds+(timing.maxSeconds-timing.minSeconds)*Math.min(1,[...(line.text||'')].length/timing.charactersForMax);}
function tick(r,now){if(!r.current&&r.queue.length)r.current=r.queue.shift();if(r.current&&Number.isFinite(now)){if(r.current.until==null)r.current.until=now+lineDuration(r.current.lines[r.current.index],r.timing);else if(now>=r.current.until)return advance(r,now);}return r.current;}
function advance(r,now){if(r.current){r.current.until=null;r.current.index++;if(r.current.index>=r.current.lines.length)r.current=null;}return tick(r,now);}
function enqueue(r,id,def,now){if(r.current?.id===id||r.queue.some(c=>c.id===id)||now-(r.lastEvents[id]??-Infinity)<def.cooldown)return false;r.lastEvents[id]=now;r.queue.push({id,lines:def.lines,index:0});tick(r,now);return true;}
function spaceAction({space,open,editing,blocked,repeat}){return space&&open&&!editing&&!blocked?(repeat?'consume':'advance'):null;}
return {create,tick,advance,enqueue,spaceAction,lineDuration};});
