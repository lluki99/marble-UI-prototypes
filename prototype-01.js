/* Saltwind Run: lightweight visual race simulation. */
const $ = id => document.getElementById(id);
const {config,text,iconMarkup}=window.MarbleContent;
const model=window.MarbleAbilities;
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const abilities=config.abilities,colors=config.race.colors;
const effectIndex=id=>abilities.findIndex(a=>a.id===id);
const physics=window.MarbleRace;
let properties=config.marbles.map(name=>({...config.presets[name]}));
let race=physics.create(config.race,properties),phase='preparing',previousRank=3,radio=window.MarbleRadio.create(),enabled=new Set(Object.keys(config.events));
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
function clearRadio(){radio=window.MarbleRadio.create();$('dialogue').hidden=true;restoreDialogue=false;}
function event(id){if(!enabled.has(id)||phase!=='running')return;window.MarbleRadio.enqueue(radio,id,config.events[id],elapsed,config.dialogueLineDuration);tickRadio();}
function tickRadio(){
 const current=window.MarbleRadio.tick(radio,elapsed,config.dialogueLineDuration);
 if(!current){$('dialogue').hidden=true;return;}
 const line=current.lines[current.index];restoreDialogue=selected!==null&&matchMedia('(max-width:680px)').matches;$('dialogue').hidden=restoreDialogue;
 $('dialog-text').textContent=line.text;$('speaker').textContent=text(line.who==='npc'?'npc':'you');
 $('portrait-npc').classList.toggle('active',line.who==='npc');$('portrait-player').classList.toggle('active',line.who==='player');
 $('dialog-step').textContent=text('counter',{current:current.index+1,total:current.lines.length});
}
function detect(hits){position=physics.ranking(race).findIndex(b=>b.id===2)+1;if(position===2&&previousRank!==2)event('second');previousRank=position;if(hits.some(pair=>pair.includes(2)))event('collision');}
function consultAbility(i){selected=i;if(matchMedia('(max-width:680px)').matches&&!$('dialogue').hidden){restoreDialogue=true;$('dialogue').hidden=true;}$('ability-detail').hidden=false;abilityButtons.forEach((b,j)=>b.classList.toggle('selected',j===i));renderAbilities();}
function closeAbility(){const previousSelection=selected;selected=null;$('ability-detail').hidden=true;abilityButtons.forEach(b=>b.classList.remove('selected'));if(restoreDialogue){$('dialogue').hidden=false;restoreDialogue=false;}if(previousSelection!==null)abilityButtons[previousSelection].focus();}
function activate(i){
  if(phase!=='running')return;
  const next=model.activate(states[i],abilities[i],elapsed);if(!next)return;
  states[i]=next;
  $('ability-feedback').textContent=text('activated',{name:abilities[i].name});feedbackUntil=elapsed+1.8;
  renderAbilities();
}
function renderAbilities(){
  abilityButtons.forEach((button,i)=>{
    const {active,remaining}=model.status(states[i],elapsed), cooldown=!active&&remaining>0;
    button.classList.toggle('activated',active);button.classList.toggle('cooldown',cooldown);
    const label=text(phase==='preparing'?'preparing':elapsed>=raceDuration?'finishedState':active?'activeCooldown':cooldown?'cooldown':'ready',{seconds:Math.ceil(remaining)});
    button.querySelector('.ability-state').textContent=remaining>0?`${Math.ceil(remaining)}`:'';
    button.setAttribute('aria-label',text('inspectName',{name:abilities[i].name,state:label,inspect:text('inspect')}));
    button.title=text('iconHelp',{name:abilities[i].name,key:abilities[i].key});
    button.setAttribute('aria-expanded',String(selected===i));
    button.querySelector('.cooldown-ring circle').style.strokeDashoffset=226*(1-remaining/abilities[i].cooldown);
    button.style.setProperty('--spin-duration',abilities[i].duration+'s');
  });
  if(selected!==null){
    const a=abilities[selected];$('ability-name').textContent=a.name;$('ability-description').textContent=a.description;
    const status=model.status(states[selected],elapsed);
    $('ability-timing').textContent=status.active?text('activeDetail',{seconds:Math.ceil(status.remaining)}):text('timing',a);
    $('ability-activate').disabled=elapsed<states[selected].readyAt||phase!=='running';
    $('ability-activate').textContent=text(phase==='preparing'?'preparing':elapsed>=raceDuration?'finishedState':status.active?'active':status.remaining>0?'cooldown':'activate',{seconds:Math.ceil(status.remaining)});
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
function setBench(open){$('demo-controls').hidden=!open;$('controls-toggle').setAttribute('aria-expanded',String(open));$('controls-toggle').textContent=text(open?'hideTools':'showTools');}
function reset(){race=physics.create(config.race,properties);elapsed=0;phase='preparing';paused=false;position=physics.ranking(race).findIndex(b=>b.id===2)+1;previousRank=position;states=abilities.map(()=>model.idle());clearRadio();feedbackUntil=0;closeAbility();$('ability-feedback').textContent='';if($('map-dialog').open)$('map-dialog').close();$('map-content').hidden=false;$('map-toggle').setAttribute('aria-expanded','true');$('preparation').hidden=false;$('live-tools').hidden=true;$('pause').textContent=text('pause');setBench(true);renderAbilities();updateHUD();updateMap();drawScene();}
const raceDuration=config.race.duration;
function racerProgress(i){return Math.max(0,Math.min(1,race.balls[i].s/race.length));}
function finishRace(){phase='finished';states=abilities.map(()=>model.idle());clearRadio();closeAbility();$('result').textContent=text('result',{rank:position,count:colors.length,progress:Math.floor(racerProgress(2)*100)});}
function updateHUD(){
  $('position').textContent=position;
  $('sim-status').textContent=text('simulationStatus',{phase:text(phase),time:elapsed.toFixed(1)});
  const time=Math.min(elapsed,raceDuration);$('race-time').textContent=`${String(Math.floor(time/60)).padStart(2,'0')}:${(time%60).toFixed(1).padStart(4,'0')}`;
  const progress=Math.min(100,racerProgress(2)*100);
  $('progress-label').textContent=`${Math.floor(progress)}%`;
  $('race-progress').style.width=progress+'%';
  document.querySelector('.progress-track').setAttribute('aria-valuenow',Math.floor(progress));
  $('finish-banner').hidden=elapsed<raceDuration;
  $('ability-feedback').classList.toggle('visible',elapsed<feedbackUntil);
}
$('dialog-close').onclick=()=>{radio.current=null;restoreDialogue=false;tickRadio();};
abilityButtons.forEach((b,i)=>b.onclick=()=>consultAbility(i));
$('ability-close').onclick=closeAbility;$('ability-activate').onclick=()=>activate(selected);
$('map-toggle').onclick=toggleMap;$('map-expand').onclick=openMap;$('map-close').onclick=()=>$('map-dialog').close();
$('controls-toggle').onclick=()=>setBench($('demo-controls').hidden);
$('pause').onclick=()=>{paused=!paused;$('pause').textContent=text(paused?'resume':'pause');};
$('header-reset').onclick=reset;$('finish-reset').onclick=reset;
$('start-race').onclick=()=>{race=physics.create(config.race,properties);phase='running';previousRank=physics.ranking(race).findIndex(b=>b.id===2)+1;$('preparation').hidden=true;$('live-tools').hidden=false;setBench(false);};
properties.forEach((p,i)=>{
 const block=document.createElement('details');block.open=i===2;
 const summary=document.createElement('summary');summary.textContent=text(i===2?'playerMarble':'marble',{number:i+1});block.append(summary);
 const presetLabel=document.createElement('label');presetLabel.textContent=text('preset');const select=document.createElement('select');
 [...Object.keys(config.presets),text('custom')].forEach(name=>{const o=document.createElement('option');o.textContent=name;select.append(o);});select.value=config.marbles[i];presetLabel.append(select);block.append(presetLabel);
 const inputs={};Object.entries(config.properties).forEach(([key,def])=>{const label=document.createElement('label');label.textContent=key[0].toUpperCase()+key.slice(1);label.title=def.description;const input=document.createElement('input');input.type='number';input.min=def.min;input.max=def.max;input.step=def.step;input.value=p[key];input.setAttribute('aria-label',summary.textContent+' '+key);input.onchange=()=>{const value=Number(input.value);p[key]=Math.max(def.min,Math.min(def.max,Number.isFinite(value)?value:def.min));input.value=p[key];select.value=text('custom');race=physics.create(config.race,properties);};label.append(input);block.append(label);const help=document.createElement('small');help.textContent=def.min+'–'+def.max+' · '+def.description;block.append(help);inputs[key]=input;});
 select.onchange=()=>{if(config.presets[select.value]){Object.assign(p,config.presets[select.value]);Object.keys(inputs).forEach(k=>inputs[k].value=p[k]);race=physics.create(config.race,properties);}};$('marble-editor').append(block);
});
Object.entries(config.events).forEach(([id,def])=>{
 const label=document.createElement('label'),input=document.createElement('input');input.type='checkbox';input.checked=true;input.onchange=()=>input.checked?enabled.add(id):enabled.delete(id);label.append(input,def.label);$('event-options').append(label);
 const button=document.createElement('button');button.textContent=def.label;button.onclick=()=>{if(phase!=='running'||!enabled.has(id))return;if(id==='second')physics.forceSecond(race);if(id==='collision')physics.forceCollision(race);detect([]);};input.addEventListener('change',()=>button.disabled=!input.checked);$('event-triggers').append(button);
});
document.addEventListener('keydown',e=>{
 if(e.repeat||e.ctrlKey||e.altKey||e.metaKey||$('map-dialog').open||e.target.closest('input,select,textarea'))return;
 const i=abilities.findIndex(a=>a.key.toLowerCase()===e.key.toLowerCase());if(i!==-1)activate(i);else if(e.key.toLowerCase()==='m')toggleMap();else if(e.key==='Escape'){if(selected!==null)closeAbility();else if(!$('demo-controls').hidden)setBench(false);}
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
  const player=race.balls[2];
  [...race.balls].sort((a,b)=>b.s-a.s).forEach(b=>{
    const i=b.id,t=Math.max(.12,Math.min(.86,.56+(player.s-b.s)*.006))*(width<=680?.48:1),p=trackPoint(t),x=p.x+p.half*b.x/2.6,groundY=p.y,r=Math.max(12,width*(.009+.022*t));
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
function frame(now){const delta=Math.min((now-previous)/1000,.1);previous=now;if(phase==='running'&&!paused&&!document.hidden){let remaining=delta;while(remaining>1e-8&&race.elapsed<raceDuration){const dt=Math.min(remaining,1/120);const hits=physics.step(race,dt,model.status(states[effectIndex('impulse')],elapsed).active);elapsed=race.elapsed;detect(hits);tickRadio();remaining-=dt;}if(elapsed>=raceDuration)finishRace();}if(now-lastUI>80){renderAbilities();updateHUD();updateMap();if(phase==='running')tickRadio();lastUI=now;}drawScene();requestAnimationFrame(frame);}
new ResizeObserver(resize).observe(canvas);reset();requestAnimationFrame(frame);
