/* Portrait-only transmission controller. All overlays remain inside the permanently tinted host. */
window.PortraitTransmission={create(art,settings={},reducedMotion=false){
 const intensity=Math.max(0,Math.min(1,settings.intensity??.55));
 const min=Math.max(300,settings.minIntervalMs??1400),max=Math.max(min,settings.maxIntervalMs??3200);
 const strips=[document.createElement('span'),document.createElement('span')],noise=document.createElement('span');
 strips.forEach(strip=>{strip.className='portrait-interference-strip';strip.setAttribute('aria-hidden','true');});
 noise.className='portrait-interference-noise';noise.setAttribute('aria-hidden','true');
 let timer=null,motions=[],active=false;
 const cancelBurst=()=>{motions.splice(0).forEach(motion=>motion.cancel());};
 function stop(){active=false;clearTimeout(timer);timer=null;cancelBurst();}
 function burst(connecting=false){
  cancelBurst();const strength=intensity*(connecting?.8:.3+Math.random()*.7),duration=connecting?240:100+Math.random()*90;
  strips.forEach((strip,index)=>{
   const top=18+Math.random()*62,height=3+Math.random()*8,shift=(index?1:-1)*strength*4;
   strip.style.clipPath=`inset(${top}% 0 ${100-top-height}% 0)`;
   motions.push(strip.animate([{opacity:0,transform:'translateX(0)'},{opacity:.7,transform:`translateX(${shift}px)`,offset:.25},{opacity:.35,transform:`translateX(${-shift*.45}px)`,offset:.6},{opacity:0,transform:'translateX(0)'}],{duration,delay:connecting?140:0,easing:'linear'}));
  });
  motions.push(noise.animate([{opacity:0},{opacity:strength*.16,offset:.3},{opacity:0}],{duration:duration+40,delay:connecting?140:0}));
 }
 function schedule(){timer=setTimeout(()=>{timer=null;if(!active)return;burst();schedule();},min+Math.random()*(max-min));}
 function start(source){
  stop();strips.forEach(strip=>{strip.style.backgroundImage=`url("${source}")`;});
  art.append(...strips,noise);
  if(reducedMotion||intensity===0)return;
  active=true;burst(true);schedule();
 }
 return{start,stop};
}};
/* Single reaction presenter. Portrait tint is permanent CSS on the host, never state-dependent. */
window.ReactionView={create(dock,config,{reducedMotion=false}={}){
 const find=id=>dock.querySelector('#'+id),panel=find('reaction-panel'),portrait=find('reaction-portrait'),art=portrait.querySelector('.reaction-portrait-art'),name=find('reaction-name'),faction=find('reaction-faction'),text=find('reaction-text'),emblem=find('reaction-emblem'),matrix=find('scan-matrix');
 const transmission=window.PortraitTransmission.create(art,config.portraitTransmission,reducedMotion);
 const images=new Map(),signalMotions=[];let current=null,exitTimer=null,panelMotion=null,textMotion=null;
 function imageFor(source){if(!images.has(source)){const image=document.createElement('img');image.alt='';image.decoding='async';image.src=source;images.set(source,image);}return images.get(source);}
 // Load existing character assets once; reuse the same node for later reactions.
 Object.values(config.characters).forEach(actor=>imageFor(actor.portrait));
 emblem.innerHTML='<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="21"/><path d="M24 4L44 24L24 44L4 24Z"/><circle cx="24" cy="24" r="15"/><rect x="10" y="16" width="28" height="17"/><text x="24" y="28"></text></svg>';
 // Smooth spatial noise couples neighbouring columns; shared envelopes mimic speech.
 // Temporal lattice wraps after 20 seconds so the procedural loop has no seam.
 function signalNoise(x,time,period){
  const ix=Math.floor(x),it=Math.floor(time),smooth=v=>v*v*(3-2*v);
  const hash=(a,b)=>{const n=Math.sin(a*127.1+(b%period)*311.7)*43758.5453;return n-Math.floor(n);};
  const u=smooth(x-ix),v=smooth(time-it),mix=(a,b,t)=>a+(b-a)*t;
  return mix(mix(hash(ix,it),hash(ix+1,it),u),mix(hash(ix,it+1),hash(ix+1,it+1),u),v);
 }
 function signalOpacity(column,row,time){
  const envelope=.55+.45*signalNoise(7,time*2,40);
  const body=signalNoise(column*.6,time*6,120);
  const detail=signalNoise(column*.9+13,time*9,180);
  const amplitude=Math.min(1,(body*.8+detail*.2)*envelope*1.45);
  const height=1+6*amplitude;
  return .12+.72*Math.max(0,Math.min(1,height-(6-row)));
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
   const frames=Array.from({length:401},(_,frame)=>({opacity:signalOpacity(n%24,Math.floor(n/24),frame/400*20),offset:frame/400}));
   signalMotions.push(square.animate(frames,{duration:20000,iterations:Infinity,easing:'linear'}));
  });
 }
 function cancelMotion(){clearTimeout(exitTimer);exitTimer=null;panelMotion?.cancel();textMotion?.cancel();panelMotion=null;textMotion=null;}
 function clear(){cancelMotion();stopSignal();transmission.stop();current=null;dock.classList.remove('is-active');dock.hidden=true;panel.hidden=true;}
 function render(next){if(next===current)return;cancelMotion();transmission.stop();current=next;
  if(!next){stopSignal();dock.classList.remove('is-active');panelMotion=dock.animate(reducedMotion?[{opacity:1},{opacity:0}]:[{transform:'translateX(0)'},{transform:'translateX(calc(100% + 48px))'}],{duration:reducedMotion?100:180,easing:'ease-in'});exitTimer=setTimeout(()=>{dock.hidden=true;panel.hidden=true;exitTimer=null;},reducedMotion?100:180);return;}
  const reaction=next.reaction,actor=config.characters[reaction.who]||config.characters.npc,image=imageFor(actor.portrait),index=actor.marbleIndex??0;
  if(art.firstChild!==image)art.replaceChildren(image);
  portrait.setAttribute('aria-label',actor.name+' portrait');name.textContent=actor.name;faction.textContent=actor.faction||config.text.faction;text.textContent=reaction.text;emblem.querySelector('text').textContent=config.race.labels[index];emblem.setAttribute('aria-label',config.race.names[index]+' · '+config.race.colorNames[index]);
  dock.hidden=false;panel.hidden=false;dock.classList.add('is-active');startSignal();transmission.start(actor.portrait);
  panelMotion=dock.animate(reducedMotion?[{opacity:0},{opacity:1}]:[{transform:'translateX(calc(100% + 48px))'},{transform:'translateX(0)'}],{duration:reducedMotion?120:380,easing:'cubic-bezier(.22,1,.36,1)'});textMotion=text.animate([{opacity:.3},{opacity:1}],{duration:100});
 }
 return{render,clear};
}};
