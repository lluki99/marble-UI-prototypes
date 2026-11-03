/* Single reaction presenter. Portrait tint is permanent CSS on the host, never state-dependent. */
window.ReactionView={create(dock,config,{reducedMotion=false}={}){
 const find=id=>dock.querySelector('#'+id),panel=find('reaction-panel'),portrait=find('reaction-portrait'),art=portrait.querySelector('.reaction-portrait-art'),name=find('reaction-name'),faction=find('reaction-faction'),text=find('reaction-text'),emblem=find('reaction-emblem'),matrix=find('scan-matrix');
 const images=new Map();let current=null,exitTimer=null,panelMotion=null,textMotion=null;
 function imageFor(source){if(!images.has(source)){const image=document.createElement('img');image.alt='';image.decoding='async';image.src=source;images.set(source,image);}return images.get(source);}
 // Load existing character assets once; reuse the same node for later reactions.
 Object.values(config.characters).forEach(actor=>imageFor(actor.portrait));
 emblem.innerHTML='<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="21"/><path d="M24 4L44 24L24 44L4 24Z"/><circle cx="24" cy="24" r="15"/><rect x="10" y="16" width="28" height="17"/><text x="24" y="28"></text></svg>';
 for(let n=0;n<96;n++){const square=document.createElement('i');square.style.setProperty('--scan-delay',-(n*73%1700)+'ms');square.style.setProperty('--scan-period',(900+n*47%1300)+'ms');matrix.append(square);}
 function cancelMotion(){clearTimeout(exitTimer);exitTimer=null;panelMotion?.cancel();textMotion?.cancel();panelMotion=null;textMotion=null;}
 function clear(){cancelMotion();current=null;dock.classList.remove('is-active');dock.hidden=true;panel.hidden=true;}
 function render(next){if(next===current)return;cancelMotion();current=next;
  if(!next){dock.classList.remove('is-active');panelMotion=dock.animate(reducedMotion?[{opacity:1},{opacity:0}]:[{transform:'translateX(0)'},{transform:'translateX(calc(100% + 48px))'}],{duration:reducedMotion?100:180,easing:'ease-in'});exitTimer=setTimeout(()=>{dock.hidden=true;panel.hidden=true;exitTimer=null;},reducedMotion?100:180);return;}
  const reaction=next.reaction,actor=config.characters[reaction.who]||config.characters.npc,image=imageFor(actor.portrait),index=actor.marbleIndex??0;
  if(art.firstChild!==image)art.replaceChildren(image);
  portrait.setAttribute('aria-label',actor.name+' portrait');name.textContent=actor.name;faction.textContent=actor.faction||config.text.faction;text.textContent=reaction.text;emblem.querySelector('text').textContent=config.race.labels[index];emblem.setAttribute('aria-label',config.race.names[index]+' · '+config.race.colorNames[index]);
  dock.hidden=false;panel.hidden=false;dock.classList.add('is-active');
  panelMotion=dock.animate(reducedMotion?[{opacity:0},{opacity:1}]:[{transform:'translateX(calc(100% + 48px))'},{transform:'translateX(0)'}],{duration:reducedMotion?120:380,easing:'cubic-bezier(.22,1,.36,1)'});textMotion=text.animate([{opacity:.3},{opacity:1}],{duration:100});
 }
 return{render,clear};
}};
