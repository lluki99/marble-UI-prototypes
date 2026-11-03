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
const racerLabel=i=>config.race.labels[i];
const leaderboard=window.RaceLeaderboard.create($('live-leaderboard'),config.race,reducedMotion);
const effectiveAbility=i=>elapsed<states[i].readyAt?(states[i].settings||abilities[i]):abilities[i];
let race=physics.create(config.race),phase='preparing',previousRank=3,reactions=window.MarbleReactions.create(config.reactionTiming),enabled=new Set(Object.keys(config.events));
let elapsed=0, paused=false, selected=null, position=config.race.initialPosition;
let states=abilities.map(()=>model.idle());
const abilityButtons=[...document.querySelectorAll('[data-ability]')];
abilityButtons.forEach((button,i)=>{
  button.querySelector('.ability-icon').innerHTML=iconMarkup(abilities[i].icon);
  button.querySelector('.ability-key').textContent=abilities[i].key;
});
const route=document.querySelector('#mini-map .map-route');
const routeLength=route.getTotalLength();
for(let i=0;i<colors.length;i++){
 const dot=document.createElementNS('http://www.w3.org/2000/svg','circle');dot.dataset.racer=String(i);const title=document.createElementNS('http://www.w3.org/2000/svg','title');title.textContent=racerName(i)+' · '+config.race.colorNames[i];dot.append(title);dot.setAttribute('r',i===2?'8':'6');dot.setAttribute('fill',colors[i]);dot.setAttribute('stroke',i===2?'#eaf8ff':'#102536');dot.setAttribute('stroke-width',i===2?'3':'2');$('map-markers').append(dot);
}
$('map-markers').append($('map-markers').querySelector('[data-racer="2"]'));
const reactionView=window.ReactionView.create($('reaction-dock'),config,{reducedMotion});
function clearReactions(){reactionSpaceHeld=false;reactions=window.MarbleReactions.create(config.reactionTiming);reactionView.clear();}
function triggerReaction(id){if(!enabled.has(id)||phase!=='running')return;window.MarbleReactions.enqueue(reactions,id,config.events[id],elapsed);tickReactions();}
function tickReactions(){reactionView.render(window.MarbleReactions.tick(reactions,elapsed));}
function detect(hits){position=physics.ranking(race).findIndex(b=>b.id===2)+1;if(position===2&&previousRank!==2)triggerReaction('second');previousRank=position;if(hits.some(pair=>pair.includes(2)))triggerReaction('collision');}
function consultAbility(i){selected=i;$('ability-detail').hidden=false;abilityButtons.forEach((b,j)=>b.classList.toggle('selected',j===i));renderAbilities();}
function closeAbility(){const previousSelection=selected;selected=null;$('ability-detail').hidden=true;abilityButtons.forEach(b=>b.classList.remove('selected'));if(previousSelection!==null)abilityButtons[previousSelection].focus();}
function activate(i){
  if(phase!=='running')return;
  const next=model.activate(states[i],abilities[i],elapsed);if(!next)return;
  states[i]=next;
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
}
function setBench(open){$('demo-controls').hidden=!open;$('controls-toggle').setAttribute('aria-expanded',String(open));$('controls-toggle').textContent=text(open?'hideTools':'showTools');}
function reset(){document.querySelector('.race').classList.remove('results-open');camera=cameraModel.create();race=physics.create(config.race);elapsed=0;phase='preparing';paused=false;position=physics.ranking(race).findIndex(b=>b.id===2)+1;previousRank=position;states=abilities.map(()=>model.idle());clearReactions();closeAbility();setMapVisible(mapInitiallyVisible,false);$('preparation').hidden=false;$('live-tools').hidden=true;$('pause').textContent=text('pause');setBench(true);renderAbilities();updateHUD();updateMap();drawScene();}
const raceDuration=config.race.duration;
function racerProgress(i){return Math.max(0,Math.min(1,race.balls[i].s/race.length));}
function finishRace(){const final= race.result||physics.ranking(race).map((b,index)=>({id:b.id,rank:index+1,distance:b.s,finishedAt:b.finishedAt}));position=final.find(b=>b.id===2).rank;phase='finished';clearReactions();states=abilities.map(()=>model.idle());closeAbility();renderResults(final);document.querySelector('.race').classList.add('results-open');}
function renderResults(final){
 const marble=id=>'<span class="result-marble" style="--racer-color:'+colors[id]+'">'+racerLabel(id)+'</span>';
 $('result').textContent=text('resultsPlayer',{rank:position,count:final.length});
 $('results-podium').innerHTML=[final[1],final[0],final[2]].map(b=>'<div class="podium-place place-'+b.rank+'" aria-label="'+b.rank+' · '+racerName(b.id)+'"><span class="podium-rank">'+b.rank+'</span>'+marble(b.id)+'<strong>'+racerName(b.id)+'</strong></div>').join('');
 $('results-ranking').innerHTML=final.map(b=>'<li'+(b.id===2?' class="player-row"':'')+'><span class="result-ident"><b>'+b.rank+'</b>'+marble(b.id)+'<strong>'+racerName(b.id)+'</strong><span>'+config.race.colorNames[b.id]+(b.id===2?' · '+text('you'):'')+'</span></span><span>'+Math.floor(b.distance/race.length*100)+'%</span><span>'+(b.finishedAt===null?text('resultsPending'):b.finishedAt.toFixed(2)+' s')+'</span></li>').join('');
}
function updateHUD(){
  leaderboard.render(race.result||physics.ranking(race));
  const ordinal=window.RacePosition.ordinal(position);$('position').textContent=ordinal;$('position').setAttribute('aria-label','Your current position: '+ordinal);
  $('sim-status').textContent=text('simulationStatus',{phase:text(phase),time:elapsed.toFixed(1)});
  $('finish-banner').hidden=elapsed<raceDuration;
}
abilityButtons.forEach((b,i)=>b.onclick=()=>consultAbility(i));
$('ability-close').onclick=closeAbility;$('ability-activate').onclick=()=>activate(selected);

$('controls-toggle').onclick=()=>setBench($('demo-controls').hidden);
$('pause').onclick=()=>{paused=!paused;$('pause').textContent=text(paused?'resume':'pause');};
$('header-reset').onclick=reset;$('results-reset').onclick=reset;
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
let reactionSpaceHeld=false;
document.addEventListener('keyup',e=>{if(e.code==='Space'&&reactionSpaceHeld){e.preventDefault();reactionSpaceHeld=false;}});
window.addEventListener('blur',()=>reactionSpaceHeld=false);
document.addEventListener('keydown',e=>{
const editing=e.target.closest('input,select,textarea,[contenteditable]:not([contenteditable="false"])');
if(e.code==='Space'&&reactionSpaceHeld&&!editing){e.preventDefault();return;}
const action=window.MarbleReactions.spaceAction({space:e.code==='Space',open:!!reactions.current,editing:!!editing,repeat:e.repeat});
if(action){e.preventDefault();reactionSpaceHeld=true;if(action==='dismiss'){window.MarbleReactions.dismiss(reactions,elapsed);tickReactions();}return;}
if(e.repeat||e.ctrlKey||e.altKey||e.metaKey||editing)return;
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
    // The shadow stays on the road and shrinks as the single hop rises.
    ctx.globalAlpha=1-lift*.45;ctx.fillStyle='#5f624744';ctx.beginPath();ctx.ellipse(x+5,groundY+r*.78,r*(1.13-lift*.25),r*.35,0,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
    if(i===2&&model.status(states[impulseIndex],elapsed).active){const tail=ctx.createLinearGradient(x,y,x,y-100);tail.addColorStop(0,'#9fdefc99');tail.addColorStop(1,'#9fdefc00');ctx.fillStyle=tail;ctx.beginPath();ctx.moveTo(x-r*.6,y);ctx.lineTo(x+r*.6,y);ctx.lineTo(x+15,y-100);ctx.lineTo(x-15,y-100);ctx.fill();}
    if(i===2)ctx.globalAlpha=model.ghostOpacity(states[ghostIndex],abilities[ghostIndex],elapsed);
    ctx.fillStyle=colors[i];ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();ctx.fillStyle='#12182177';ctx.beginPath();ctx.arc(x,y,r,.15,Math.PI+.15);ctx.quadraticCurveTo(x-r*.1,y+r*.4,x+r,y);ctx.fill();ctx.fillStyle='#fff6daaa';ctx.beginPath();ctx.ellipse(x-r*.35,y-r*.4,r*.26,r*.14,-.6,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle='#ffffff33';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(x,y,r*.6,r,Math.PI*.3,0,Math.PI*2);ctx.stroke();
    ctx.strokeStyle='#111827';ctx.lineWidth=2;ctx.stroke();ctx.fillStyle='#101824';ctx.font='800 '+Math.max(9,r*.5)+'px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(racerLabel(i),x,y);ctx.textBaseline='alphabetic';
    if(i===2){
      ctx.globalAlpha=1;
      if(model.status(states[ghostIndex],elapsed).active){ctx.fillStyle=config.race.colors[2];ctx.beginPath();ctx.moveTo(x,groundY+r+3);ctx.lineTo(x+4,groundY+r+7);ctx.lineTo(x,groundY+r+11);ctx.lineTo(x-4,groundY+r+7);ctx.closePath();ctx.fill();}
      ctx.font='600 12px sans-serif';const labelWidth=Math.max(38,ctx.measureText(text('you')).width+12);
      ctx.fillStyle='#102536b3';ctx.fillRect(x-labelWidth/2,y-r-28,labelWidth,21);ctx.fillStyle=config.race.colors[2];ctx.textAlign='center';ctx.fillText(text('you'),x,y-r-13);
    }
    ctx.restore();
  });
}
let previous=performance.now(),lastUI=0;
function frame(now){const delta=Math.min((now-previous)/1000,.1);previous=now;if(phase==='running'&&!paused&&!document.hidden){let remaining=delta;while(remaining>1e-8&&race.elapsed<raceDuration){const dt=Math.min(remaining,1/120);const hits=physics.step(race,dt,model.status(states[effectIndex('impulse')],elapsed).active);elapsed=race.elapsed;detect(hits);tickReactions();remaining-=dt;}cameraModel.step(camera,race.balls[2].s,race.length,delta,reducedMotion);if(elapsed>=raceDuration)finishRace();}if(now-lastUI>80){renderAbilities();updateHUD();updateMap();if(phase==='running')tickReactions();lastUI=now;}drawScene();requestAnimationFrame(frame);}
new ResizeObserver(resize).observe(canvas);reset();requestAnimationFrame(frame);
