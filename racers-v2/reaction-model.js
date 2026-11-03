/* One-shot reactions use the existing event queue and simulation clock. No dialogue indexes or reply lines. */
(function(root,factory){if(typeof module==='object')module.exports=factory();else root.MarbleReactions=factory();})(globalThis,()=>{
 function create(timing={}){return{queue:[],current:null,lastEvents:{},timing:{minSeconds:3,maxSeconds:4,charactersForMax:100,...timing}};}
 function duration(reaction,timing){return timing.minSeconds+(timing.maxSeconds-timing.minSeconds)*Math.min(1,[...(reaction.text||'')].length/timing.charactersForMax);}
 function tick(state,now){if(state.current&&Number.isFinite(now)&&now>=state.current.until)state.current=null;if(!state.current&&state.queue.length){state.current=state.queue.shift();state.current.until=now+duration(state.current.reaction,state.timing);}return state.current;}
 function dismiss(state,now){state.current=null;return tick(state,now);}
 function enqueue(state,id,definition,now){if(!definition.reaction||state.current?.id===id||state.queue.some(item=>item.id===id)||now-(state.lastEvents[id]??-Infinity)<definition.cooldown)return false;state.lastEvents[id]=now;state.queue.push({id,reaction:definition.reaction});tick(state,now);return true;}
 function spaceAction({space,open,editing,repeat}){return space&&open&&!editing?(repeat?'consume':'dismiss'):null;}
 return{create,duration,tick,dismiss,enqueue,spaceAction};
});
