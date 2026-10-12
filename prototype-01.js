/* Saltwind Run: lightweight visual race simulation. */
const $ = id => document.getElementById(id);
const {config,text,iconMarkup}=window.MarbleContent;
const model=window.MarbleAbilities;
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const abilities=config.abilities,colors=config.race.colors;
const effectIndex=id=>abilities.findIndex(a=>a.id===id);
const physics=window.MarbleRace;
const cameraModel=window.MarbleCamera;let camera=cameraModel.create();
const racerName=i=>config.race.names[i];
const effectiveAbility=i=>elapsed<states[i].readyAt?(states[i].settings||abilities[i]):abilities[i];
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
  const title=document.createElementNS('http://www.w3.org/2000/svg','title');title.textContent=racerName(i)+' · '+config.race.colorNames[i]+(i===2?' · '+text('you'):'');dot.append(title);dot.setAttribute('r',i===2?'8':'6');dot.setAttribute('fill',i===2?'#f1c817':'#080b0c');
  dot.setAttribute('stroke','#f1c817');dot.setAttribute('stroke-width','2');
  const link=document.createElementNS('http://www.w3.org/2000/svg','path');link.dataset.racerLink=String(i);link.setAttribute('class','racer-link');$('map-markers').prepend(link);const tag=document.createElementNS('http://www.w3.org/2000/svg','rect');tag.dataset.racerTag=String(i);tag.setAttribute('class',i===2?'racer-tag player-tag':'racer-tag');tag.setAttribute('x','149');tag.setAttribute('width','22');tag.setAttribute('height','20');$('map-markers').append(dot,tag);const label=document.createElementNS('http://www.w3.org/2000/svg','text');label.dataset.racerLabel=String(i);label.textContent=racerName(i);label.setAttribute('class','racer-number');$('map-markers').append(label);
}
$('map-markers').append($('map-markers').querySelector('[data-racer="2"]'),$('map-markers').querySelector('[data-racer-label="2"]'));
function setRadioMarble(id,index){const sphere=$(id),pattern=id==='player-radio-marble'?'<path d="M7 20Q24 3 41 20M7 28Q24 45 41 28M13 7Q3 24 13 41M35 7Q45 24 35 41"/>':'<path d="M24 4L44 24L24 44L4 24Z"/><circle cx="24" cy="24" r="15"/>';sphere.innerHTML='<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="21"/>'+pattern+'<rect x="17" y="16" width="14" height="17"/><text x="24" y="28">'+racerName(index)+'</text></svg>';sphere.setAttribute('aria-label',racerName(index)+' · '+config.race.colorNames[index]);}
for(let n=0;n<96;n++){const square=document.createElement('i');square.style.setProperty('--scan-delay',-(n*73%1700)+'ms');square.style.setProperty('--scan-period',(900+n*47%1300)+'ms');$('scan-matrix').append(square);}
let renderedConversation=null,renderedLine=-1,radioExitTimer=null;
function cancelRadioAnimations(){clearTimeout(radioExitTimer);radioExitTimer=null;document.querySelectorAll('.radio-dock,.radio-dock *').forEach(el=>el.getAnimations().filter(a=>!a.animationName).forEach(a=>a.cancel()));}
function clearRadio(){radioSpaceHeld=false;cancelRadioAnimations();radio=window.MarbleRadio.create();renderedConversation=null;renderedLine=-1;$('dialogue').hidden=true;$('portrait-npc').hidden=true;$('radio-dock').classList.remove('transmitting');$('portrait-player').classList.add('active');}
function event(id){if(!enabled.has(id)||phase!=='running')return;window.MarbleRadio.enqueue(radio,id,config.events[id],elapsed);tickRadio();}
function tickRadio(){const current=window.MarbleRadio.tick(radio);
if(!current){if(renderedConversation){cancelRadioAnimations();$('radio-dock').classList.remove('transmitting');$('dialogue').animate([{opacity:1},{opacity:0,transform:'translateX(-8px)'}],{duration:reducedMotion?80:120});$('portrait-npc').animate([{opacity:1},{opacity:0}],{duration:100});radioExitTimer=setTimeout(()=>{$('dialogue').hidden=true;$('portrait-npc').hidden=true;},120);}renderedConversation=null;renderedLine=-1;return;}
if(current===renderedConversation&&current.index===renderedLine)return;const opening=current!==renderedConversation;cancelRadioAnimations();$('dialogue').hidden=false;$('portrait-npc').hidden=false;$('radio-dock').classList.add('transmitting');const line=current.lines[current.index],actor=config.characters?.[line.who],caller=config.characters?.[current.lines.find(l=>l.who!=='player')?.who]||config.characters.npc;$('dialog-text').textContent=line.text;$('speaker').textContent=actor?.name||text(line.who==='player'?'you':'npc');$('portrait-npc').setAttribute('aria-label',text('callerPortrait',{name:caller.name}));$('portrait-npc').querySelector('.portrait-art').innerHTML=iconMarkup(caller.icon||'npcPortrait');$('portrait-npc').classList.toggle('active',line.who!=='player');$('portrait-player').classList.toggle('active',line.who==='player');setRadioMarble('player-radio-marble',config.characters.player.marbleIndex);setRadioMarble('caller-radio-marble',caller.marbleIndex??0);$('dialog-step').textContent=text('counter',{current:current.index+1,total:current.lines.length});
if(opening){
 $('portrait-player').animate(reducedMotion?[{opacity:.8},{opacity:1}]:[{opacity:1},{opacity:.7,offset:.3},{opacity:.95,offset:.6},{opacity:.8,offset:.8},{opacity:1}],{duration:reducedMotion?100:140});
 $('dialogue').animate(reducedMotion?[{opacity:0},{opacity:1}]:[{clipPath:'inset(0 100% 0 0)',opacity:.6},{clipPath:'inset(0 0 0 0)',opacity:1}],{duration:reducedMotion?100:180,delay:reducedMotion?0:140,fill:'backwards'});
 $('portrait-npc').animate([{opacity:0},{opacity:line.who==='player'?.45:1}],{duration:100,delay:reducedMotion?0:240,fill:'backwards'});
 }
 $('dialog-text').animate([{opacity:0},{opacity:1}],{duration:opening?80:100,delay:opening&&!reducedMotion?280:0,fill:'backwards'});
renderedConversation=current;renderedLine=current.index;
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
    button.querySelector('.ring-progress').style.strokeDashoffset=220*(cooldown?Math.min(1,remaining/effectiveAbility(i).cooldown):0);
    button.style.setProperty('--spin-duration','.45s');
  });
  if(selected!==null){
    const a=effectiveAbility(selected);$('ability-name').textContent=a.name;$('ability-description').textContent=a.description;
    const status=model.status(states[selected],elapsed);
    $('ability-timing').textContent=status.active?text('activeDetail',{seconds:Math.ceil(Math.max(0,states[selected].activeUntil-elapsed))}):text('timing',a);
    $('ability-activate').disabled=elapsed<states[selected].readyAt||phase!=='running';
    $('ability-activate').textContent=text(phase==='preparing'?'preparing':elapsed>=raceDuration?'finishedState':status.active?'active':status.remaining>0?'cooldown':'activate',{seconds:Math.ceil(status.remaining)});
  }
}
const mapInitiallyVisible=!$('map-content').hidden;
let mapVisible=mapInitiallyVisible,mapAnimation=null;
function setMapVisible(visible,animate=true){
 mapVisible=visible;if(mapAnimation){mapAnimation.cancel();mapAnimation=null;}
 const dock=document.querySelector('.map-dock'),panel=$('map-content');
 if(visible){dock.hidden=false;panel.hidden=false;}
 dock.style.pointerEvents=visible?'':'none';panel.inert=!visible;
 if(!animate){dock.hidden=!visible;panel.hidden=!visible;return;}
 const frames=reducedMotion?[{opacity:visible?0:1},{opacity:visible?1:0}]:visible?[{opacity:0},{opacity:.8,offset:.5},{opacity:.65,offset:.7},{opacity:1}]:[{opacity:1},{opacity:.65,offset:.35},{opacity:.8,offset:.55},{opacity:0}];
 const animation=dock.animate(frames,{duration:reducedMotion?100:180});mapAnimation=animation;
 animation.onfinish=()=>{if(mapAnimation!==animation)return;dock.hidden=!visible;panel.hidden=!visible;mapAnimation=null;};
}
function toggleMap(){setMapVisible(!mapVisible);}
function updateMap(){
  [...$('map-markers').querySelectorAll('[data-racer]')].forEach(dot=>{
    const i=Number(dot.dataset.racer);
    const fraction=racerProgress(i);
    const p=route.getPointAtLength(fraction*routeLength);p.x+=race.balls[i].x*4;dot.setAttribute('cx',p.x);dot.setAttribute('cy',p.y);
  });
  // Letters are separated from clustered real positions by fine leader lines.
  const dots=[...$('map-markers').querySelectorAll('[data-racer]')].sort((a,b)=>Number(a.getAttribute('cy'))-Number(b.getAttribute('cy')));
  const ys=[];dots.forEach((dot,n)=>ys.push(Math.max(Number(dot.getAttribute('cy')),n?ys[n-1]+23:26)));
  for(let n=ys.length-1;n>=0;n--)ys[n]=Math.min(ys[n],n===ys.length-1?246:ys[n+1]-23);
  dots.forEach((dot,n)=>{const i=dot.dataset.racer,y=ys[n];const label=$('map-markers').querySelector('[data-racer-label="'+i+'"]');label.setAttribute('x','160');label.setAttribute('y',y);$('map-markers').querySelector('[data-racer-tag="'+i+'"]').setAttribute('y',y-10);$('map-markers').querySelector('[data-racer-link="'+i+'"]').setAttribute('d','M'+dot.getAttribute('cx')+' '+dot.getAttribute('cy')+'L149 '+y);});
  if($('map-dialog').open){const cloned=$('large-map').querySelector('.large-markers');cloned.innerHTML=$('map-markers').innerHTML;}
}
function openMap(){
  const clone=$('mini-map').cloneNode(true);clone.removeAttribute('id');clone.setAttribute('aria-label',text('route'));
  clone.querySelector('#map-markers').removeAttribute('id');clone.querySelector('g').classList.add('large-markers');$('large-map').replaceChildren(clone);$('map-dialog').showModal();
}
function setBench(open){$('demo-controls').hidden=!open;$('controls-toggle').setAttribute('aria-expanded',String(open));$('controls-toggle').textContent=text(open?'hideTools':'showTools');}
function reset(){camera=cameraModel.create();race=physics.create(config.race);elapsed=0;phase='preparing';paused=false;position=physics.ranking(race).findIndex(b=>b.id===2)+1;previousRank=position;states=abilities.map(()=>model.idle());clearRadio();feedbackUntil=0;closeAbility();$('ability-feedback').textContent='';if($('map-dialog').open)$('map-dialog').close();setMapVisible(mapInitiallyVisible,false);$('preparation').hidden=false;$('live-tools').hidden=true;$('pause').textContent=text('pause');setBench(true);renderAbilities();updateHUD();updateMap();drawScene();}
const raceDuration=config.race.duration;
function racerProgress(i){return Math.max(0,Math.min(1,race.balls[i].s/race.length));}
function finishRace(){const final= race.result||physics.ranking(race).map((b,index)=>({id:b.id,rank:index+1,distance:b.s,finishedAt:b.finishedAt}));position=final.find(b=>b.id===2).rank;phase='finished';states=abilities.map(()=>model.idle());feedbackUntil=0;$('ability-feedback').textContent='';closeAbility();$('result').textContent=text('result',{rank:position,count:colors.length,progress:Math.floor(racerProgress(2)*100)});}
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
$('map-expand').onclick=openMap;$('map-close').onclick=()=>$('map-dialog').close();
$('controls-toggle').onclick=()=>setBench($('demo-controls').hidden);
$('pause').onclick=()=>{paused=!paused;$('pause').textContent=text(paused?'resume':'pause');};
$('header-reset').onclick=reset;
$('start-race').onclick=()=>{camera=cameraModel.create();race=physics.create(config.race);phase='running';previousRank=physics.ranking(race).findIndex(b=>b.id===2)+1;$('preparation').hidden=true;$('live-tools').hidden=false;setBench(false);};
abilities.forEach(a=>{
 const group=document.createElement('fieldset'),legend=document.createElement('legend'),total=document.createElement('p');legend.textContent=a.name;group.append(legend);
 const updateTotal=()=>total.textContent=text('timingTotal',{total:Number((a.duration+a.cooldown).toFixed(2))});
 for(const key of ['duration','cooldown']){const label=document.createElement('label'),input=document.createElement('input'),error=document.createElement('span');label.textContent=text(key==='cooldown'?'timingCooldown':a.id==='jump'?'jumpDuration':'timingDuration');input.type='number';input.min='.1';input.max='60';input.step='any';input.value=a[key];input.id='timing-'+a.id+'-'+key;error.id=input.id+'-error';error.className='timing-error';input.setAttribute('aria-describedby',error.id);input.addEventListener('input',()=>{const valid=model.validTiming(input.value);input.setAttribute('aria-invalid',String(!valid));error.textContent=valid?'':text('timingError');if(valid){a[key]=Number(input.value);updateTotal();}});label.append(input);group.append(label,error);}
 updateTotal();group.append(total);$('ability-settings').append(group);
});
colors.forEach((color,i)=>{const row=document.createElement('div');row.className='racer-identity';const swatch=document.createElement('span');swatch.className='marble-swatch';swatch.style.background=color;swatch.setAttribute('aria-hidden','true');row.append(swatch,text(i===2?'playerMarble':'marble',{name:racerName(i)})+' · '+config.race.colorNames[i]);$('marble-editor').append(row);});
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
const i=abilities.findIndex(a=>a.key.toLowerCase()===e.key.toLowerCase());if(i!==-1)activate(i);else if(e.key.toLowerCase()==='m'){e.preventDefault();toggleMap();}else if(e.key==='Escape'){if(selected!==null)closeAbility();else if(!$('demo-controls').hidden)setBench(false);}
});
/* Pista proyectada: curvas, barandillas y canicas originales dibujadas en Canvas. */
const canvas=$('scene'),ctx=canvas.getContext('2d');let width=0,height=0;
function resize(){const r=canvas.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,2);width=r.width;height=r.height;canvas.width=width*dpr;canvas.height=height*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);drawScene();}
function sceneScale(){return height/340*camera.zoom;}
function trackPoint(s){const scale=sceneScale();return {x:width*.5+(Math.sin(s/280)*45-camera.x)*scale,y:height*camera.anchor+(s-camera.s)*scale,half:Math.min(width*.29,190)*camera.zoom};}
function sceneRange(){const scale=sceneScale();return [camera.s-height*camera.anchor/scale-35,camera.s+height*(1-camera.anchor)/scale+35];}
function trackPath(side,start=sceneRange()[0],end=sceneRange()[1],connect=false){for(let n=0;n<=70;n++){const p=trackPoint(start+(end-start)*n/70),x=p.x+p.half*side;if(n===0&&!connect)ctx.moveTo(x,p.y);else ctx.lineTo(x,p.y);}}
function drawScene(){
 if(!width)return;
 const [start,end]=sceneRange();
 ctx.fillStyle='#ac7359';ctx.fillRect(0,0,width,height);
 for(const side of [-1,1]){ctx.beginPath();ctx.moveTo(side<0?0:width,-40);for(let s=Math.floor(start/40)*40;s<end+40;s+=40){const p=trackPoint(s);ctx.lineTo(p.x+side*(p.half+75+Math.sin(s*.11)*40),p.y);}ctx.lineTo(side<0?0:width,height+40);ctx.closePath();ctx.fillStyle='#835c51';ctx.fill();}

 // Stationary roadside objects slide past the following camera; the HUD never moves.
 for(let s=Math.floor(start/30)*30;s<end;s+=30){const p=trackPoint(s);for(const side of [-1,1]){const x=p.x+side*(p.half+40+Math.abs(Math.sin(s*7))*180);ctx.fillStyle=s%60===0?'#253544':'#dba879';ctx.beginPath();ctx.moveTo(x-25,p.y+16);ctx.lineTo(x-22,p.y-9);ctx.lineTo(x-7,p.y-24);ctx.lineTo(x+15,p.y-20);ctx.lineTo(x+19,p.y-13);ctx.lineTo(x+31,p.y+16);ctx.closePath();ctx.fill();ctx.strokeStyle='#121821';ctx.lineWidth=3;ctx.stroke();}}
 ctx.beginPath();trackPath(-1,start,end);trackPath(1,end,start,true);ctx.closePath();ctx.fillStyle='#56484b';ctx.fill();
 for(const side of [-1,1]){ctx.beginPath();trackPath(side);ctx.strokeStyle='#121821';ctx.lineWidth=13;ctx.stroke();ctx.strokeStyle='#ffd348';ctx.lineWidth=3;ctx.stroke();}
 for(let s=Math.floor(start/12)*12;s<end;s+=12){const p=trackPoint(s);for(const side of [-1,1]){ctx.fillStyle='#fff1d0';ctx.fillRect(p.x+side*p.half*.94-3,p.y,6,12*camera.zoom);}if(s%36===0){ctx.strokeStyle='#b8856d';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(p.x-p.half*.8,p.y);ctx.lineTo(p.x+p.half*.6,p.y+6);ctx.stroke();}}
 for(let s=Math.floor(start/48)*48;s<end;s+=48){const p=trackPoint(s);for(const side of [-1,1]){const x=p.x+side*(p.half+8);ctx.fillStyle='#121821';ctx.fillRect(x-5,p.y-22,10,30);ctx.fillStyle='#ffd348';ctx.fillRect(x-5,p.y-22,10,8);}}
 for(const [s,label] of [[0,text('raceStart')],[race.length,text('raceFinish')]]){const p=trackPoint(s);if(p.y<-30||p.y>height+30)continue;ctx.strokeStyle='#101824';ctx.lineWidth=12;ctx.beginPath();ctx.moveTo(p.x-p.half,p.y);ctx.lineTo(p.x+p.half,p.y);ctx.stroke();ctx.fillStyle='#fff1d0';for(let n=0;n<12;n+=2)ctx.fillRect(p.x-p.half+n*p.half/6,p.y-6,p.half/6,12);ctx.font='italic 800 16px sans-serif';ctx.textAlign='center';ctx.fillText(label,p.x,p.y-16);}
  const player=race.balls[2];
  [...race.balls].sort((a,b)=>a.s-b.s).forEach(b=>{
    const i=b.id,p=trackPoint(b.s),x=p.x+p.half*b.x/2.6,groundY=p.y,r=Math.max(12,Math.min(25,width*.023))*camera.zoom;
    if(groundY<-80||groundY>height+80)return;
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
    ctx.strokeStyle='#111827';ctx.lineWidth=2;ctx.stroke();ctx.fillStyle='#101824';ctx.font='800 '+Math.max(12,r*.7)+'px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(racerName(i),x,y);ctx.textBaseline='alphabetic';
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
function frame(now){const delta=Math.min((now-previous)/1000,.1);previous=now;if(phase==='running'&&!paused&&!document.hidden){let remaining=delta;while(remaining>1e-8&&race.elapsed<raceDuration){const dt=Math.min(remaining,1/120);const hits=physics.step(race,dt,model.status(states[effectIndex('impulse')],elapsed).active);elapsed=race.elapsed;detect(hits);tickRadio();remaining-=dt;}cameraModel.step(camera,race.balls[2].s,race.length,delta,reducedMotion);if(elapsed>=raceDuration)finishRace();}if(now-lastUI>80){renderAbilities();updateHUD();updateMap();if(phase==='running')tickRadio();lastUI=now;}drawScene();requestAnimationFrame(frame);}
new ResizeObserver(resize).observe(canvas);reset();requestAnimationFrame(frame);
