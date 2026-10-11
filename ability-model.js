/* Pure timing/effect model, shared by the renderer and deterministic checks. */
(function(root){
  const idle=()=>({startedAt:null,activeUntil:0,readyAt:0});
  const activate=(state,ability,now)=>now<state.readyAt?null:{startedAt:now,activeUntil:now+ability.duration,readyAt:now+ability.duration+ability.cooldown};
  const status=(state,now)=>({active:state.startedAt!==null&&now<state.activeUntil,remaining:Math.max(0,state.readyAt-now),age:state.startedAt===null?Infinity:Math.max(0,now-state.startedAt)});
  const jumpHeight=(state,ability,now)=>{
    const s=status(state,now);if(!s.active)return 0;
    return Math.sin(Math.PI*Math.min(1,s.age/ability.duration));
  };
  const ghostOpacity=(state,ability,now)=>{
    const s=status(state,now);if(!s.active)return 1;
    const fade=Math.min(ability.fadeSeconds||.4,ability.duration/2);
    const amount=Math.min(1,s.age/fade,(ability.duration-s.age)/fade);
    const smooth=amount*amount*(3-2*amount);
    return 1-(1-(ability.minOpacity??.18))*smooth;
  };
  const api={idle,activate,status,jumpHeight,ghostOpacity};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.MarbleAbilities=api;
})(typeof window==='undefined'?globalThis:window);
