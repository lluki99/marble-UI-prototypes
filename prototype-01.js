/* Saltwind Run: lightweight visual race simulation. */
const $ = id => document.getElementById(id);
const {config,text,iconMarkup}=window.MarbleContent;
const model=window.MarbleAbilities;
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const abilities=config.abilities,colors=config.race.colors;
const effectIndex=id=>abilities.findIndex(a=>a.id===id);
const physics=window.MarbleRace;
let race=physics.create(config.race),phase='preparing',previousRank=3,radio=window.MarbleRadio.create(),enabled=new Set(Object.keys(config.events));
let elapsed=0, paused=false, selected=null, position=config.race.initialPosition, feedbackUntil=0;
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
  const title=document.createElementNS('http://www.w3.org/2000/svg','title');title.textContent=(i+1)+' · '+config.race.colorNames[i]+(i===2?' · '+text('you'):'');dot.append(title);dot.setAttribute('r',i===2?'8':'6');dot.setAttribute('fill',colors[i]);
  dot.setAttribute('stroke',i===2?'#fff9e8':'#344d43');dot.setAttribute('stroke-width','2');
  $('map-markers').append(dot);const label=document.createElementNS('http://www.w3.org/2000/svg','text');label.dataset.racerLabel=String(i);label.textContent=i+1;label.setAttribute('class','racer-number');$('map-markers').append(label);
}
$('map-markers').append($('map-markers').querySelector('[data-racer="2"]'),$('map-markers').querySelector('[data-racer-label="2"]'));
let renderedConversation=null,renderedLine=-1,radioExitTimer=null;
function cancelRadioAnimations(){clearTimeout(radioExitTimer);radioExitTimer=null;document.querySelectorAll('.radio-dock,.radio-dock *').forEach(el=>el.getAnimations().forEach(a=>a.cancel()));}
function clearRadio(){radioSpaceHeld=false;cancelRadioAnimations();radio=window.MarbleRadio.create();renderedConversation=null;renderedLine=-1;$('dialogue').hidden=true;$('portrait-npc').hidden=true;$('radio-dock').classList.remove('transmitting');$('portrait-player').classList.add('active');}
function event(id){if(!enabled.has(id)||phase!=='running')return;window.MarbleRadio.enqueue(radio,id,config.events[id],elapsed);tickRadio();}
function tickRadio(){const current=window.MarbleRadio.tick(radio);
if(!current){if(renderedConversation){cancelRadioAnimations();$('radio-dock').classList.remove('transmitting');$('dialogue').animate([{opacity:1},{opacity:0,transform:'translateX(-8px)'}],{duration:reducedMotion?80:120});$('portrait-npc').animate([{opacity:1},{opacity:0}],{duration:100});radioExitTimer=setTimeout(()=>{$('dialogue').hidden=true;$('portrait-npc').hidden=true;},120);}renderedConversation=null;renderedLine=-1;return;}
if(current===renderedConversation&&current.index===renderedLine)return;const opening=current!==renderedConversation;cancelRadioAnimations();$('dialogue').hidden=false;$('portrait-npc').hidden=false;$('radio-dock').classList.add('transmitting');const line=current.lines[current.index],actor=config.characters?.[line.who];$('dialog-text').textContent=line.text;$('speaker').textContent=actor?.name||text(line.who==='player'?'you':'npc');$('portrait-npc').setAttribute('aria-label',text('callerPortrait',{name:actor?.name||text('npc')}));$('portrait-npc').querySelector('.portrait-art').innerHTML=iconMarkup(actor?.icon||'npcPortrait');$('portrait-npc').classList.toggle('active',line.who!=='player');$('portrait-player').classList.toggle('active',line.who==='player');$('dialog-step').textContent=text('counter',{current:current.index+1,total:current.lines.length});
if(opening){$('portrait-npc').animate(reducedMotion?[{opacity:0},{opacity:1}]:[{opacity:0,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}],{duration:reducedMotion?100:140,fill:'backwards'});$('dialogue').animate(reducedMotion?[{opacity:0},{opacity:1}]:[{clipPath:'inset(0 100% 0 0)',opacity:.6},{clipPath:'inset(0 0 0 0)',opacity:1}],{duration:reducedMotion?100:190,delay:reducedMotion?0:90,fill:'backwards'});}$('dialog-text').animate([{opacity:0},{opacity:1}],{duration:opening?90:100,delay:opening&&!reducedMotion?240:0,fill:'backwards'});renderedConversation=current;renderedLine=current.index;
}
function detect(hits){position=physics.ranking(race).findIndex(b=>b.id===2)+1;if(position===2&&previousRank!==2)event('second');previousRank=position;if(hits.some(pair=>pair.includes(2)))event('collision');}
function consultAbility(i){selected=i;$('ability-detail').hidden=false;abilityButtons.forEach((b,j)=>b.classList.toggle('selected',j===i));renderAbilities();}
function closeAbility(){const previousSelection=selected;selected=null;$('ability-detail').hidden=true;abilityButtons.forEach(b=>b.classList.remove('selected'));if(previousSelection!==null)abilityButtons[previousSelection].focus();}
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
    const activeRemaining=Math.max(0,states[i].activeUntil-elapsed);
    button.classList.toggle('activated',active);button.classList.toggle('cooldown',cooldown);
    const label=text(phase==='preparing'?'preparing':elapsed>=raceDuration?'finishedState':active?'activeCooldown':cooldown?'cooldown':'ready',{seconds:Math.ceil(active?activeRemaining:remaining)});
    button.querySelector('.ability-state').textContent=remaining>0?`${Math.ceil(active?activeRemaining:remaining)}`:'';
    button.setAttribute('aria-label',text('inspectName',{name:abilities[i].name,state:label,inspect:text('inspect')}));
    button.title=text('iconHelp',{name:abilities[i].name,key:abilities[i].key});
    button.setAttribute('aria-expanded',String(selected===i));
    button.querySelector('.ring-progress').style.strokeDashoffset=220*(cooldown?Math.min(1,remaining/abilities[i].cooldown):0);
    button.style.setProperty('--spin-duration',abilities[i].duration+'s');
  });
  if(selected!==null){
    const a=abilities[selected];$('ability-name').textContent=a.name;$('ability-description').textContent=a.description;
    const status=model.status(states[selected],elapsed);
    $('ability-timing').textContent=status.active?text('activeDetail',{seconds:Math.ceil(Math.max(0,states[selected].activeUntil-elapsed))}):text('timing',a);
    $('ability-activate').disabled=elapsed<states[selected].readyAt||phase!=='running';
    $('ability-activate').textContent=text(phase==='preparing'?'preparing':elapsed>=raceDuration?'finishedState':status.active?'active':status.remaining>0?'cooldown':'activate',{seconds:Math.ceil(status.remaining)});
  }
}
function toggleMap(){const open=$('map-content').hidden;$('map-content').hidden=!open;$('map-toggle').setAttribute('aria-expanded',String(open));}
function updateMap(){
  [...$('map-markers').querySelectorAll('[data-racer]')].forEach(dot=>{
    const i=Number(dot.dataset.racer);
    const fraction=racerProgress(i);
    const p=route.getPointAtLength(fraction*routeLength);p.x+=race.balls[i].x*4;dot.setAttribute('cx',p.x);dot.setAttribute('cy',p.y);const label=$('map-markers').querySelector('[data-racer-label="'+i+'"]');label.setAttribute('x',p.x);label.setAttribute('y',p.y);
  });
  if($('map-dialog').open){const cloned=$('large-map').querySelector('.large-markers');cloned.innerHTML=$('map-markers').innerHTML;}
}
function openMap(){
  const clone=$('mini-map').cloneNode(true);clone.removeAttribute('id');clone.setAttribute('aria-label',text('route'));
  clone.querySelector('#map-markers').removeAttribute('id');clone.querySelector('g').classList.add('large-markers');$('large-map').replaceChildren(clone);$('map-dialog').showModal();
}
function setBench(open){$('demo-controls').hidden=!open;$('controls-toggle').setAttribute('aria-expanded',String(open));$('controls-toggle').textContent=text(open?'hideTools':'showTools');}
function reset(){race=physics.create(config.race);elapsed=0;phase='preparing';paused=false;position=physics.ranking(race).findIndex(b=>b.id===2)+1;previousRank=position;states=abilities.map(()=>model.idle());clearRadio();feedbackUntil=0;closeAbility();$('ability-feedback').textContent='';if($('map-dialog').open)$('map-dialog').close();$('map-content').hidden=false;$('map-toggle').setAttribute('aria-expanded','true');$('preparation').hidden=false;$('live-tools').hidden=true;$('pause').textContent=text('pause');setBench(true);renderAbilities();updateHUD();updateMap();drawScene();}
const raceDuration=config.race.duration;
function racerProgress(i){return Math.max(0,Math.min(1,race.balls[i].s/race.length));}
function finishRace(){phase='finished';states=abilities.map(()=>model.idle());feedbackUntil=0;$('ability-feedback').textContent='';closeAbility();$('result').textContent=text('result',{rank:position,count:colors.length,progress:Math.floor(racerProgress(2)*100)});}
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
abilityButtons.forEach((b,i)=>b.onclick=()=>consultAbility(i));
$('ability-close').onclick=closeAbility;$('ability-activate').onclick=()=>activate(selected);
$('map-toggle').onclick=toggleMap;$('map-expand').onclick=openMap;$('map-close').onclick=()=>$('map-dialog').close();
$('controls-toggle').onclick=()=>setBench($('demo-controls').hidden);
$('pause').onclick=()=>{paused=!paused;$('pause').textContent=text(paused?'resume':'pause');};
$('header-reset').onclick=reset;
$('start-race').onclick=()=>{race=physics.create(config.race);phase='running';previousRank=physics.ranking(race).findIndex(b=>b.id===2)+1;$('preparation').hidden=true;$('live-tools').hidden=false;setBench(false);};
abilities.forEach(a=>{const line=document.createElement('p');line.textContent=text('abilitySetting',{...a,total:a.duration+a.cooldown});$('ability-settings').append(line);});
colors.forEach((color,i)=>{const row=document.createElement('div');row.className='racer-identity';const swatch=document.createElement('span');swatch.className='marble-swatch';swatch.style.background=color;swatch.setAttribute('aria-hidden','true');row.append(swatch,text(i===2?'playerMarble':'marble',{number:i+1})+' · '+config.race.colorNames[i]);$('marble-editor').append(row);});
Object.entries(config.events).forEach(([id,def])=>{
 const label=document.createElement('label'),input=document.createElement('input');input.type='checkbox';input.checked=true;input.onchange=()=>input.checked?enabled.add(id):enabled.delete(id);label.append(input,def.label);$('event-options').append(label);
 const button=document.createElement('button');button.textContent=def.label;button.onclick=()=>{if(phase!=='running'||!enabled.has(id))return;if(id==='second')physics.forceSecond(race);if(id==='collision')physics.forceCollision(race);detect([]);};input.addEventListener('change',()=>button.disabled=!input.checked);$('event-triggers').append(button);
});
let radioSpaceHeld=false;
document.addEventListener('keyup',e=>{if(e.code==='Space'&&radioSpaceHeld){e.preventDefault();radioSpaceHeld=false;}});
window.addEventListener('blur',()=>radioSpaceHeld=false);
document.addEventListener('keydown',e=>{
const editing=e.target.closest('input,select,textarea,[contenteditable]:not([contenteditable="false"])');
if(e.code==='Space'&&radioSpaceHeld&&!editing){e.preventDefault();return;}
const action=window.MarbleRadio.spaceAction({space:e.code==='Space',open:!!radio.current,editing:!!editing,blocked:$('map-dialog').open,repeat:e.repeat});
if(action){e.preventDefault();radioSpaceHeld=true;if(action==='advance'){window.MarbleRadio.advance(radio);tickRadio();}return;}
if(e.repeat||e.ctrlKey||e.altKey||e.metaKey||$('map-dialog').open||editing)return;
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
  ctx.beginPath();trackPath(-1);trackPath(1,1.05,0,true);ctx.closePath();const road=ctx.createLinearGradient(0,0,0,height);road.addColorStop(0,'#474347');road.addColorStop(1,'#72564e');ctx.fillStyle=road;ctx.fill();
  for(const side of [-1,1]){ctx.beginPath();trackPath(side);ctx.strokeStyle='#121821';ctx.lineWidth=15;ctx.stroke();ctx.strokeStyle='#ffd348';ctx.lineWidth=3;ctx.stroke();ctx.beginPath();trackPath(side*.94);ctx.strokeStyle='#f8eed244';ctx.lineWidth=2;ctx.stroke();}
  const motion=0;
  for(let i=0;i<22;i++){const t=((i/22+motion)%1);const p=trackPoint(t);ctx.strokeStyle='#d5ba9d22';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(p.x-p.half*.8,p.y);ctx.lineTo(p.x+p.half*.8,p.y);ctx.stroke();}
  for(let i=0;i<9;i++){const t=(i/9+motion*.4)%1,p=trackPoint(t);for(const side of [-1,1]){const x=p.x+side*p.half*.99;ctx.fillStyle='#877959';ctx.fillRect(x-3, p.y-13*(t+.3),6,20*(t+.3));ctx.fillStyle='#f6efd9';ctx.fillRect(x-3,p.y-13*(t+.3),6,3);}}
  for(const [fraction,label] of [[.13,text('raceStart')],[width<=680?.43:.81,text('raceFinish')]]){const p=trackPoint(fraction);ctx.strokeStyle='#101824';ctx.lineWidth=8;ctx.beginPath();ctx.moveTo(p.x-p.half,p.y);ctx.lineTo(p.x+p.half,p.y);ctx.stroke();ctx.fillStyle='#fff1d0';for(let n=0;n<12;n+=2)ctx.fillRect(p.x-p.half+n*p.half/6,p.y-4,p.half/6,8);ctx.font='italic 800 13px sans-serif';ctx.fillStyle='#fff1d0';ctx.textAlign='center';ctx.fillText(label,p.x,p.y-12);}
  const player=race.balls[2];
  [...race.balls].sort((a,b)=>a.s-b.s).forEach(b=>{
    const i=b.id,t=Math.max(.12,Math.min(.86,.13+racerProgress(b.id)*(width<=680?.30:.68))),p=trackPoint(t),x=p.x+p.half*b.x/2.6,groundY=p.y,r=Math.max(12,width*(.009+.022*t));
    const jumpIndex=effectIndex('jump'),ghostIndex=effectIndex('ghost'),impulseIndex=effectIndex('impulse');
    const lift=i===2?model.jumpHeight(states[jumpIndex],abilities[jumpIndex],elapsed):0;
    const y=groundY-lift*r*(reducedMotion?1:2.8);
    ctx.save();
    if(!reducedMotion&&phase==='running'&&b.v>8){ctx.strokeStyle=colors[i]+'66';ctx.lineWidth=2;for(const side of [-1,1]){ctx.beginPath();ctx.moveTo(x+side*r*.8,groundY-r*1.4);ctx.lineTo(x+side*r*.8,groundY-r*1.4-Math.min(38,b.v));ctx.stroke();}}
    // The shadow stays on the road and shrinks as the single hop rises.
    ctx.globalAlpha=1-lift*.45;ctx.fillStyle='#5f624744';ctx.beginPath();ctx.ellipse(x+5,groundY+r*.78,r*(1.13-lift*.25),r*.35,0,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
    if(i===2&&model.status(states[impulseIndex],elapsed).active){const tail=ctx.createLinearGradient(x,y,x,y-100);tail.addColorStop(0,'#e6ba5899');tail.addColorStop(1,'#e6ba5800');ctx.fillStyle=tail;ctx.beginPath();ctx.moveTo(x-r*.6,y);ctx.lineTo(x+r*.6,y);ctx.lineTo(x+15,y-100);ctx.lineTo(x-15,y-100);ctx.fill();}
    if(i===2)ctx.globalAlpha=model.ghostOpacity(states[ghostIndex],abilities[ghostIndex],elapsed);
    ctx.fillStyle=colors[i];ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();ctx.fillStyle='#12182177';ctx.beginPath();ctx.arc(x,y,r,.15,Math.PI+.15);ctx.quadraticCurveTo(x-r*.1,y+r*.4,x+r,y);ctx.fill();ctx.fillStyle='#fff6daaa';ctx.beginPath();ctx.ellipse(x-r*.35,y-r*.4,r*.26,r*.14,-.6,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle='#ffffff33';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(x,y,r*.6,r,Math.PI*.3,0,Math.PI*2);ctx.stroke();
    ctx.strokeStyle='#111827';ctx.lineWidth=2;ctx.stroke();ctx.fillStyle='#101824';ctx.font='800 '+Math.max(12,r*.7)+'px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(i+1,x,y);ctx.textBaseline='alphabetic';
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
