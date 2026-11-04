/* Portrait-only corruption. Base tint is invariant; RGB echoes have their own fixed channel filters. */
window.PortraitTransmission={create(art,settings={},reducedMotion=false,portrait=art){
 const intensity=Math.max(0,Math.min(1,settings.intensity??.9));
 const min=Math.max(300,settings.minIntervalMs??450),max=Math.max(min,settings.maxIntervalMs??1100);
 const make=className=>{const el=document.createElement('span');el.className=className;el.setAttribute('aria-hidden','true');return el;};
 const strips=Array.from({length:8},()=>make('portrait-interference-strip'));
 const tears=Array.from({length:2},()=>make('portrait-interference-tear'));
 const channels=['red','green','blue'].map(color=>make('portrait-channel portrait-channel-'+color));
 const noise=make('portrait-interference-noise');
 let timer=null,motions=[],active=false;
 const cancelBurst=()=>{motions.splice(0).forEach(motion=>motion.cancel());};
 function stop(){active=false;clearTimeout(timer);timer=null;cancelBurst();}
 function burst(connecting=false){
  cancelBurst();const large=connecting||Math.random()<.3,strength=intensity*(large?.85+Math.random()*.15:.4+Math.random()*.35);
  const duration=connecting?340:large?240+Math.random()*100:140+Math.random()*100,delay=connecting?120:0;
  const animate=(el,frames)=>motions.push(el.animate(frames,{duration,delay,easing:'linear'}));
  strips.forEach((strip,index)=>{
   const top=index*12,height=large?10+Math.random()*9:5+Math.random()*6,shift=(index%2?1:-1)*strength*(large?16+Math.random()*12:8+Math.random()*8);
   strip.style.clipPath=`inset(${top}% 0 ${Math.max(0,100-top-height)}% 0)`;
   animate(strip,[{opacity:0,transform:'translateX(0)'},{opacity:1,transform:`translateX(${shift}px)`,offset:.15},{opacity:.95,transform:`translateX(${-shift*.7}px)`,offset:.4},{opacity:.7,transform:`translateX(${shift*.4}px)`,offset:.68},{opacity:0,transform:'translateX(0)'}]);
  });
  tears.forEach((tear,index)=>{const top=12+Math.random()*65,height=large?10+Math.random()*15:3+Math.random()*5;tear.style.clipPath=`inset(${top}% 0 ${100-top-height}% 0)`;animate(tear,[{opacity:0},{opacity:strength*(index?.7:.95),offset:.25},{opacity:0,offset:.5},{opacity:strength*.5,offset:.7},{opacity:0}]);});
  channels.forEach((channel,index)=>{const shift=(index-1)*strength*(large?9:5);channel.style.clipPath=`inset(${large?0:20}% 0 ${large?0:25}% 0)`;animate(channel,[{opacity:0,transform:'translateX(0)'},{opacity:strength*.95,transform:`translate(${shift}px,${index===1?1:0}px)`,offset:.2},{opacity:strength*.7,transform:`translateX(${-shift*.65}px)`,offset:.55},{opacity:0,transform:'translateX(0)'}]);});
  noise.style.backgroundPosition=`${Math.round(Math.random()*30)}px ${Math.round(Math.random()*30)}px`;
  animate(noise,[{opacity:0},{opacity:strength*.65,offset:.15},{opacity:strength*.2,offset:.4},{opacity:strength*.5,offset:.65},{opacity:0}]);
 }
 function schedule(){timer=setTimeout(()=>{timer=null;if(!active)return;burst();schedule();},min+Math.random()*(max-min));}
 function start(source){
  stop();[...strips,...channels].forEach(layer=>{layer.style.backgroundImage=`url("${source}")`;});
  art.append(...strips,...tears,noise);portrait.append(...channels);
  if(reducedMotion||intensity===0)return;
  active=true;burst(true);schedule();
 }
 return{start,stop};
}};
/* Single reaction presenter. Portrait tint is permanent CSS on the host, never state-dependent. */
window.ReactionView={create(dock,config,{reducedMotion=false}={}){
 const find=id=>dock.querySelector('#'+id),panel=find('reaction-panel'),portrait=find('reaction-portrait'),art=portrait.querySelector('.reaction-portrait-art'),name=find('reaction-name'),faction=find('reaction-faction'),text=find('reaction-text'),emblem=find('reaction-emblem'),matrix=find('scan-matrix');
 const transmission=window.PortraitTransmission.create(art,config.portraitTransmission,reducedMotion,portrait);
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
