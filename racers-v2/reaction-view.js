/* Single reaction presenter. Portrait tint is permanent CSS on the host, never state-dependent. */
window.ReactionView={create(dock,config,{reducedMotion=false}={}){
 const find=id=>dock.querySelector('#'+id),panel=find('reaction-panel'),portrait=find('reaction-portrait'),art=portrait.querySelector('.reaction-portrait-art'),name=find('reaction-name'),faction=find('reaction-faction'),text=find('reaction-text'),emblem=find('reaction-emblem'),matrix=find('scan-matrix');
 const images=new Map(),signalMotions=[];let current=null,exitTimer=null,panelMotion=null,textMotion=null;
 function imageFor(source){if(!images.has(source)){const image=document.createElement('img');image.alt='';image.decoding='async';image.src=source;images.set(source,image);}return images.get(source);}
 // Load existing character assets once; reuse the same node for later reactions.
 Object.values(config.characters).forEach(actor=>imageFor(actor.portrait));
 emblem.innerHTML='<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="21"/><path d="M24 4L44 24L24 44L4 24Z"/><circle cx="24" cy="24" r="15"/><rect x="10" y="16" width="28" height="17"/><text x="24" y="28"></text></svg>';
 // Sample one continuous signal across columns. Rows mirror around the centre line.
 function signalOpacity(column,row,time){
  const carrier=.5+.5*Math.sin(column*.83-time*1.2);
  const envelope=.55+.45*Math.pow(Math.sin(column*.31+time*.35),2);
  const height=.35+3.15*carrier*envelope;
  return .12+.72*Math.max(0,Math.min(1,height-Math.abs(row-3)+.35));
 }
 const squares=[];
 for(let n=0;n<168;n++){
  const square=document.createElement('i'),column=n%24,row=Math.floor(n/24);
  square.style.opacity=signalOpacity(column,row,0);matrix.append(square);squares.push(square);
 }
 function stopSignal(){signalMotions.splice(0).forEach(motion=>motion.cancel());}
 function startSignal(){
  stopSignal();if(reducedMotion)return;
  squares.forEach((square,n)=>{
   const frames=Array.from({length:121},(_,frame)=>({opacity:signalOpacity(n%24,Math.floor(n/24),frame/120*Math.PI*20),offset:frame/120}));
   signalMotions.push(square.animate(frames,{duration:24000,iterations:Infinity,easing:'linear'}));
  });
 }
 function cancelMotion(){clearTimeout(exitTimer);exitTimer=null;panelMotion?.cancel();textMotion?.cancel();panelMotion=null;textMotion=null;}
 function clear(){cancelMotion();stopSignal();current=null;dock.classList.remove('is-active');dock.hidden=true;panel.hidden=true;}
 function render(next){if(next===current)return;cancelMotion();current=next;
  if(!next){stopSignal();dock.classList.remove('is-active');panelMotion=dock.animate(reducedMotion?[{opacity:1},{opacity:0}]:[{transform:'translateX(0)'},{transform:'translateX(calc(100% + 48px))'}],{duration:reducedMotion?100:180,easing:'ease-in'});exitTimer=setTimeout(()=>{dock.hidden=true;panel.hidden=true;exitTimer=null;},reducedMotion?100:180);return;}
  const reaction=next.reaction,actor=config.characters[reaction.who]||config.characters.npc,image=imageFor(actor.portrait),index=actor.marbleIndex??0;
  if(art.firstChild!==image)art.replaceChildren(image);
  portrait.setAttribute('aria-label',actor.name+' portrait');name.textContent=actor.name;faction.textContent=actor.faction||config.text.faction;text.textContent=reaction.text;emblem.querySelector('text').textContent=config.race.labels[index];emblem.setAttribute('aria-label',config.race.names[index]+' · '+config.race.colorNames[index]);
  dock.hidden=false;panel.hidden=false;dock.classList.add('is-active');startSignal();
  panelMotion=dock.animate(reducedMotion?[{opacity:0},{opacity:1}]:[{transform:'translateX(calc(100% + 48px))'},{transform:'translateX(0)'}],{duration:reducedMotion?120:380,easing:'cubic-bezier(.22,1,.36,1)'});textMotion=text.animate([{opacity:.3},{opacity:1}],{duration:100});
 }
 return{render,clear};
}};
