/* Saltwind Run: lightweight visual race simulation. */
const $ = id => document.getElementById(id);
const {config,text,iconMarkup}=window.MarbleContent;
const model=window.MarbleAbilities;
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const abilities=config.abilities,conversation=config.dialogue,colors=config.race.colors;
const effectIndex=id=>abilities.findIndex(a=>a.id===id);
let elapsed=0, paused=false, dialogIndex=0, selected=null, position=config.race.initialPosition, feedbackUntil=0, restoreDialogue=false;
let states=abilities.map(()=>model.idle());
const abilityButtons=[...document.querySelectorAll('[data-ability]')];
abilityButtons.forEach((button,i)=>{
  button.querySelector('.ability-icon').innerHTML=iconMarkup(abilities[i].icon);
  button.querySelector('.ability-key').textContent=abilities[i].key;
});
const route=document.querySelector('#mini-map .map-route');
const routeLength=route.getTotalLength();
for(let i=0;i<6;i++){
  const dot=document.createElementNS('http://www.w3.org/2000/svg','circle');
  dot.dataset.racer=String(i);
  dot.setAttribute('r',i===2?'6':'4');dot.setAttribute('fill',colors[i]);
  dot.setAttribute('stroke',i===2?'#fff9e8':'#344d43');dot.setAttribute('stroke-width','2');
  $('map-markers').append(dot);
}
$('map-markers').append($('map-markers').querySelector('[data-racer="2"]'));
function showDialog(){if(selected!==null)closeAbility();dialogIndex=0;$('dialogue').hidden=false;renderDialog();}
function renderDialog(){
  const line=conversation[dialogIndex];
  $('dialog-text').textContent=line.text;
  $('speaker').textContent=text(line.who==='npc'?'npc':'you');
  $('portrait-npc').classList.toggle('active',line.who==='npc');
  $('portrait-player').classList.toggle('active',line.who==='player');
  $('dialog-step').textContent=text('counter',{current:dialogIndex+1,total:conversation.length});
  $('dialog-next').textContent=text(dialogIndex===conversation.length-1?'done':'next');
}
function nextDialog(){if(dialogIndex<conversation.length-1){dialogIndex++;renderDialog();}else $('dialogue').hidden=true;}
function consultAbility(i){selected=i;if(matchMedia('(max-width:680px)').matches&&!$('dialogue').hidden){restoreDialogue=true;$('dialogue').hidden=true;}$('ability-detail').hidden=false;abilityButtons.forEach((b,j)=>b.classList.toggle('selected',j===i));renderAbilities();}
function closeAbility(){const previousSelection=selected;selected=null;$('ability-detail').hidden=true;abilityButtons.forEach(b=>b.classList.remove('selected'));if(restoreDialogue){$('dialogue').hidden=false;restoreDialogue=false;}if(previousSelection!==null)abilityButtons[previousSelection].focus();}
function activate(i){
  if(elapsed>=raceDuration)return;
  const next=model.activate(states[i],abilities[i],elapsed);if(!next)return;
  states[i]=next;
  $('ability-feedback').textContent=text('activated',{name:abilities[i].name});feedbackUntil=elapsed+1.8;
  renderAbilities();
}
function renderAbilities(){
  abilityButtons.forEach((button,i)=>{
    const {active,remaining}=model.status(states[i],elapsed), cooldown=!active&&remaining>0;
    button.classList.toggle('activated',active);button.classList.toggle('cooldown',cooldown);
    const label=text(elapsed>=raceDuration?'finishedState':active?'activeCooldown':cooldown?'cooldown':'ready',{seconds:Math.ceil(remaining)});
    button.querySelector('.ability-state').textContent=remaining>0?`${Math.ceil(remaining)}`:'';
    button.setAttribute('aria-label',text('inspectName',{name:abilities[i].name,state:label,inspect:text('inspect')}));
    button.title=text('iconHelp',{name:abilities[i].name,key:abilities[i].key});
    button.setAttribute('aria-expanded',String(selected===i));
    button.querySelector('.cooldown-fill').style.width=(remaining>0?100*(1-remaining/abilities[i].cooldown):0)+'%';
  });
  if(selected!==null){
    const a=abilities[selected];$('ability-name').textContent=a.name;$('ability-description').textContent=a.description;
    const status=model.status(states[selected],elapsed);
    $('ability-timing').textContent=status.active?text('activeDetail',{seconds:Math.ceil(status.remaining)}):text('timing',a);
    $('ability-activate').disabled=elapsed<states[selected].readyAt||elapsed>=raceDuration;
    $('ability-activate').textContent=text(elapsed>=raceDuration?'finishedState':status.active?'active':status.remaining>0?'cooldown':'activate',{seconds:Math.ceil(status.remaining)});
  }
}
function toggleMap(){const open=$('map-content').hidden;$('map-content').hidden=!open;$('map-toggle').setAttribute('aria-expanded',String(open));}
function updateMap(){
  [...$('map-markers').children].forEach(dot=>{
    const i=Number(dot.dataset.racer);
    const fraction=racerProgress(i);
    const p=route.getPointAtLength(fraction*routeLength);dot.setAttribute('cx',p.x);dot.setAttribute('cy',p.y);
  });
  if($('map-dialog').open){const cloned=$('large-map').querySelector('.large-markers');cloned.innerHTML=$('map-markers').innerHTML;}
}
function openMap(){
  const clone=$('mini-map').cloneNode(true);clone.removeAttribute('id');clone.setAttribute('aria-label',text('route'));
  clone.querySelector('#map-markers').removeAttribute('id');clone.querySelector('g').classList.add('large-markers');$('large-map').replaceChildren(clone);$('map-dialog').showModal();
}
function reset(){
  elapsed=0;paused=false;position=config.race.initialPosition;states=abilities.map(()=>model.idle());feedbackUntil=0;
  $('pause').textContent=text('pause');$('map-content').hidden=false;$('map-toggle').setAttribute('aria-expanded','true');
  $('ability-feedback').textContent='';
  if($('map-dialog').open)$('map-dialog').close();closeAbility();showDialog();renderAbilities();updateHUD();updateMap();drawScene();
}
const raceDuration=config.race.duration;
function racerProgress(i){
  const p=Math.min(1,elapsed/raceDuration);
  if(i===2)return p;
  const order=[0,1,3,4,5];
  const slot=order.indexOf(i);
  const relative=slot < position-1 ? (position-1-slot)*.07 : -(slot-position+2)*.07;
  return Math.max(0,Math.min(1,p+relative*Math.sin(Math.PI*p)));
}
function updateHUD(){
  $('position').textContent=position;
  const time=Math.min(elapsed,raceDuration);$('race-time').textContent=`${String(Math.floor(time/60)).padStart(2,'0')}:${(time%60).toFixed(1).padStart(4,'0')}`;
  const progress=Math.min(100,elapsed/raceDuration*100);
  $('progress-label').textContent=`${Math.floor(progress)}%`;
  $('race-progress').style.width=progress+'%';
  document.querySelector('.progress-track').setAttribute('aria-valuenow',Math.floor(progress));
  $('finish-banner').hidden=elapsed<raceDuration;
  $('ability-feedback').classList.toggle('visible',elapsed<feedbackUntil);
}
$('dialog-next').onclick=nextDialog;$('dialog-close').onclick=()=>{$('dialogue').hidden=true;};
abilityButtons.forEach((b,i)=>b.onclick=()=>consultAbility(i));
$('ability-close').onclick=closeAbility;$('ability-activate').onclick=()=>activate(selected);
$('map-toggle').onclick=toggleMap;$('map-expand').onclick=openMap;$('map-close').onclick=()=>$('map-dialog').close();
$('controls-toggle').onclick=()=>{const open=$('demo-controls').hidden;$('demo-controls').hidden=!open;$('controls-toggle').setAttribute('aria-expanded',String(open));};
$('pause').onclick=()=>{paused=!paused;$('pause').textContent=text(paused?'resume':'pause');};
$('show-dialog').onclick=showDialog;
$('force-cooldown').onclick=()=>{states=abilities.map(a=>({startedAt:null,activeUntil:0,readyAt:elapsed+a.cooldown}));renderAbilities();};
$('ready-all').onclick=()=>{states=abilities.map(()=>model.idle());renderAbilities();};
$('overtake').onclick=()=>{position=position===1?colors.length:position-1;updateHUD();};$('reset').onclick=reset;$('header-reset').onclick=reset;$('finish-reset').onclick=reset;$('jump-finish').onclick=()=>{elapsed=raceDuration-4;states=abilities.map(()=>model.idle());closeAbility();$('dialogue').hidden=true;$('demo-controls').hidden=true;$('controls-toggle').setAttribute('aria-expanded','false');updateHUD();updateMap();};
document.addEventListener('keydown',e=>{
  if(e.repeat||e.ctrlKey||e.altKey||e.metaKey||$('map-dialog').open)return;
  if(e.target.closest('button,a,input,select,textarea')&&e.code==='Space')return;
  const abilityIndex=abilities.findIndex(a=>a.key.toLowerCase()===e.key.toLowerCase());
  if(abilityIndex!==-1)activate(abilityIndex);
  else if(e.key.toLowerCase()==='m')toggleMap();else if(e.code==='Space'&&!$('dialogue').hidden){e.preventDefault();nextDialog();}
  else if(e.key==='Escape'){if(!$('ability-detail').hidden)closeAbility();else if(!$('demo-controls').hidden){$('demo-controls').hidden=true;$('controls-toggle').setAttribute('aria-expanded','false');$('controls-toggle').focus();}else $('dialogue').hidden=true;}
});
/* Pista proyectada: curvas, barandillas y canicas originales dibujadas en Canvas. */
const canvas=$('scene'),ctx=canvas.getContext('2d');let width=0,height=0;
function resize(){const r=canvas.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,2);width=r.width;height=r.height;canvas.width=width*dpr;canvas.height=height*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);drawScene();}
function trackPoint(t){const y=height*(.08+t*1.06);const curve=Math.sin(t*5.3-.9)*width*.12;return {x:width*.51+curve,y,half:width*(.045+.25*t*t)};}
function trackPath(side,start=0,end=1.05,connect=false){for(let n=0;n<=70;n++){const p=trackPoint(start+(end-start)*n/70);const x=p.x+p.half*side;if(n===0&&!connect)ctx.moveTo(x,p.y);else ctx.lineTo(x,p.y);}}
function drawScene(){
  if(!width)return;
  ctx.clearRect(0,0,width,height);
  // Flat limestone road and quiet timber rails, inspired by the supplied coastal references.
  ctx.save();ctx.translate(0,18);ctx.beginPath();trackPath(-1);trackPath(1,1.05,0,true);ctx.closePath();ctx.fillStyle='#6b70594d';ctx.fill();ctx.restore();
  ctx.beginPath();trackPath(-1);trackPath(1,1.05,0,true);ctx.closePath();const road=ctx.createLinearGradient(0,0,0,height);road.addColorStop(0,'#c9bd9b');road.addColorStop(1,'#e4d6b3');ctx.fillStyle=road;ctx.fill();
  for(const side of [-1,1]){ctx.beginPath();trackPath(side);ctx.strokeStyle='#807759';ctx.lineWidth=15;ctx.stroke();ctx.strokeStyle='#f8eed2';ctx.lineWidth=3;ctx.stroke();ctx.beginPath();trackPath(side*.94);ctx.strokeStyle='#f8eed244';ctx.lineWidth=2;ctx.stroke();}
  const motion=reducedMotion?0:Math.min(elapsed,raceDuration)*.055;
  for(let i=0;i<22;i++){const t=((i/22+motion)%1);const p=trackPoint(t);ctx.strokeStyle='#988c6833';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(p.x-p.half*.8,p.y);ctx.lineTo(p.x+p.half*.8,p.y);ctx.stroke();}
  for(let i=0;i<9;i++){const t=(i/9+motion*.4)%1,p=trackPoint(t);for(const side of [-1,1]){const x=p.x+side*p.half*.99;ctx.fillStyle='#877959';ctx.fillRect(x-3, p.y-13*(t+.3),6,20*(t+.3));ctx.fillStyle='#f6efd9';ctx.fillRect(x-3,p.y-13*(t+.3),6,3);}}
  const balls=[{l:-.25},{l:.48},{l:-.12},{l:-.5},{l:.06},{l:.5}];
  const order=[0,1,3,4,5];
  balls.forEach((b,i)=>{
    const slot=order.indexOf(i);const rank=i===2?position-1:slot>=position-1?slot+1:slot;
    const t=(.28+rank*.078+(reducedMotion?0:Math.sin(Math.min(elapsed,raceDuration)*.4+i)*.012))*(width<=680?.42:1),p=trackPoint(t),x=p.x+p.half*b.l,groundY=p.y,r=Math.max(12,width*(.009+.022*t));
    const jumpIndex=effectIndex('jump'),ghostIndex=effectIndex('ghost'),impulseIndex=effectIndex('impulse');
    const lift=i===2?model.jumpHeight(states[jumpIndex],abilities[jumpIndex],elapsed):0;
    const y=groundY-lift*r*(reducedMotion?1:2.8);
    ctx.save();
    // The shadow stays on the road and shrinks as the single hop rises.
    ctx.globalAlpha=1-lift*.45;ctx.fillStyle='#5f624744';ctx.beginPath();ctx.ellipse(x+5,groundY+r*.78,r*(1.13-lift*.25),r*.35,0,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
    if(i===2&&model.status(states[impulseIndex],elapsed).active){const tail=ctx.createLinearGradient(x,y,x,y+100);tail.addColorStop(0,'#e6ba5899');tail.addColorStop(1,'#e6ba5800');ctx.fillStyle=tail;ctx.beginPath();ctx.moveTo(x-r*.6,y);ctx.lineTo(x+r*.6,y);ctx.lineTo(x+15,y+100);ctx.lineTo(x-15,y+100);ctx.fill();}
    if(i===2)ctx.globalAlpha=model.ghostOpacity(states[ghostIndex],abilities[ghostIndex],elapsed);
    const g=ctx.createRadialGradient(x-r*.35,y-r*.45,r*.05,x,y,r);g.addColorStop(0,'#fff4cf');g.addColorStop(.22,colors[i]);g.addColorStop(1,i===2?'#ab7939':'#52695b');ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle='#ffffff33';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(x,y,r*.6,r,Math.PI*.3,0,Math.PI*2);ctx.stroke();
    if(i===2){
      ctx.globalAlpha=1;
      if(model.status(states[ghostIndex],elapsed).active){ctx.fillStyle='#f3cf74';ctx.beginPath();ctx.moveTo(x,groundY+r+3);ctx.lineTo(x+4,groundY+r+7);ctx.lineTo(x,groundY+r+11);ctx.lineTo(x-4,groundY+r+7);ctx.closePath();ctx.fill();}
      ctx.font='600 12px sans-serif';const labelWidth=Math.max(38,ctx.measureText(text('you')).width+12);
      ctx.fillStyle='#3e5145ee';ctx.fillRect(x-labelWidth/2,y-r-28,labelWidth,21);ctx.fillStyle='#f3cf74';ctx.textAlign='center';ctx.fillText(text('you'),x,y-r-13);
    }
    ctx.restore();
  });
}
let previous=performance.now(),lastUI=0;
function frame(now){const delta=Math.min((now-previous)/1000,.1);previous=now;if(!paused&&!document.hidden)elapsed+=delta;if(now-lastUI>80){renderAbilities();updateHUD();updateMap();lastUI=now;}drawScene();requestAnimationFrame(frame);}
new ResizeObserver(resize).observe(canvas);showDialog();renderAbilities();updateMap();requestAnimationFrame(frame);
