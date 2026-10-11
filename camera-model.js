/* A continuous world-space camera. Framing changes never alter race positions. */
(function(root){
 const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
 const create=()=>({s:0,x:0,zoom:1,anchor:.36});
 function step(c,player,length,dt,reduced=false){
  const progress=player/length,wide=smooth((progress-.25)/.12),close=smooth((progress-.60)/.12);
  const blend=1-Math.exp(-dt*4);
  c.s+=(player-c.s)*blend;c.x+=(Math.sin(player/280)*45-c.x)*blend;
  c.zoom+=((reduced?1:1-.2*wide+.36*close)-c.zoom)*blend;
  c.anchor+=((reduced?.36:.36-.04*wide+.06*close)-c.anchor)*blend;
  return c;
 }
 const api={create,step};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.MarbleCamera=api;
})(typeof window==='undefined'?globalThis:window);
