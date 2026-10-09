/* Cabina orbital: simulación visual determinista, sin motor de juego. */
const $ = id => document.getElementById(id);
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const abilities = [
  {name:'Impulso', description:'Enciende una estela ámbar detrás de tu canica durante dos segundos.', duration:2, cooldown:8},
  {name:'Escudo', description:'Activa un anillo de energía cian alrededor de tu canica durante tres segundos.', duration:3, cooldown:12},
  {name:'Enfoque', description:'Destaca tu canica y atenúa ligeramente a los rivales para seguir su posición.', duration:3, cooldown:10}
];
const conversation = [
  {who:'npc', text:'Te recibo, piloto. Mantén la vista en la pista; la curva exterior se acerca.'},
  {who:'player', text:'Recibido, Vega. Tengo el impulso listo. Buscaré un hueco en la salida.'},
  {who:'npc', text:'Consulta el recorrido si necesitas orientarte. Tu señal ámbar aparece en el minimapa.'},
  {who:'player', text:'Todo claro. Cerramos el canal; nos vemos en la meta.'}
];
const colors = ['#64dce4','#d994b7','#f4be62','#8bc8ad','#c9b3f0','#afc5df'];
let elapsed=0, paused=false, dialogIndex=0, selected=null, position=3, feedbackUntil=0, restoreDialogue=false;
let states=abilities.map(()=>({activeUntil:0, readyAt:0}));
const abilityButtons=[...document.querySelectorAll('[data-ability]')];
const route=document.querySelector('#mini-map .map-route');
const routeLength=route.getTotalLength();
for(let i=0;i<6;i++){
  const dot=document.createElementNS('http://www.w3.org/2000/svg','circle');
  dot.setAttribute('r',i===2?'6':'4');dot.setAttribute('fill',colors[i]);
  dot.setAttribute('stroke',i===2?'#fff':'#102636');dot.setAttribute('stroke-width','2');
  $('map-markers').append(dot);
}
function showDialog(){dialogIndex=0;$('dialogue').hidden=false;renderDialog();}
function renderDialog(){
  const line=conversation[dialogIndex];
  $('dialog-text').textContent=line.text;
  $('speaker').textContent=line.who==='npc'?'Vega · Control de pista':'Tú · Piloto';
  $('portrait-npc').classList.toggle('active',line.who==='npc');
  $('portrait-player').classList.toggle('active',line.who==='player');
  $('dialog-step').textContent=`${dialogIndex+1} / ${conversation.length}`;
  $('dialog-next').textContent=dialogIndex===conversation.length-1?'Cerrar canal':'Continuar ›';
}
function nextDialog(){if(dialogIndex<conversation.length-1){dialogIndex++;renderDialog();}else $('dialogue').hidden=true;}
function consultAbility(i){selected=i;if(matchMedia('(max-width:680px)').matches&&!$('dialogue').hidden){restoreDialogue=true;$('dialogue').hidden=true;}$('ability-detail').hidden=false;abilityButtons.forEach((b,j)=>b.classList.toggle('selected',j===i));renderAbilities();}
function closeAbility(){const previousSelection=selected;selected=null;$('ability-detail').hidden=true;abilityButtons.forEach(b=>b.classList.remove('selected'));if(restoreDialogue){$('dialogue').hidden=false;restoreDialogue=false;}if(previousSelection!==null)abilityButtons[previousSelection].focus();}
function activate(i){
  if(elapsed<states[i].readyAt)return;
  states[i]={activeUntil:elapsed+abilities[i].duration,readyAt:elapsed+abilities[i].duration+abilities[i].cooldown};
  $('ability-feedback').textContent=`${abilities[i].name} activado`;feedbackUntil=elapsed+1.8;
  renderAbilities();
}
function renderAbilities(){
  abilityButtons.forEach((button,i)=>{
    const active=elapsed<states[i].activeUntil, cooldown=!active&&elapsed<states[i].readyAt;
    button.classList.toggle('activated',active);button.classList.toggle('cooldown',cooldown);
    const label=active?'Activo':cooldown?`Recarga ${Math.ceil(states[i].readyAt-elapsed)} s`:'Disponible';
    button.querySelector('.ability-state').textContent=label;
    button.setAttribute('aria-label',`${abilities[i].name}: ${label}. Consultar habilidad`);
    button.setAttribute('aria-expanded',String(selected===i));
    const remaining=Math.max(0,states[i].readyAt-elapsed);
    button.querySelector('.cooldown-fill').style.width=(active?100:cooldown?100*(1-remaining/abilities[i].cooldown):0)+'%';
  });
  if(selected!==null){
    const a=abilities[selected];$('ability-name').textContent=a.name;$('ability-description').textContent=a.description;
    $('ability-timing').textContent=`${a.duration} s activo · ${a.cooldown} s de recarga`;
    $('ability-activate').disabled=elapsed<states[selected].readyAt;
    $('ability-activate').textContent=elapsed<states[selected].activeUntil?'Activo':elapsed<states[selected].readyAt?`Recarga ${Math.ceil(states[selected].readyAt-elapsed)} s`:'Activar';
  }
}
function toggleMap(){const open=$('map-content').hidden;$('map-content').hidden=!open;$('map-toggle').setAttribute('aria-expanded',String(open));$('map-chevron').textContent=open?'›':'‹';}
function updateMap(){
  [...$('map-markers').children].forEach((dot,i)=>{
    const fraction=((elapsed/45+(5-i)*.038+.2)%1+1)%1;
    const p=route.getPointAtLength(fraction*routeLength);dot.setAttribute('cx',p.x);dot.setAttribute('cy',p.y);
  });
  if($('map-dialog').open){const cloned=$('large-map').querySelector('#map-markers');cloned.innerHTML=$('map-markers').innerHTML;}
}
function openMap(){
  const clone=$('mini-map').cloneNode(true);clone.removeAttribute('id');clone.setAttribute('aria-label','Mapa ampliado del circuito con seis participantes');
  $('large-map').replaceChildren(clone);$('map-dialog').showModal();
}
function reset(){
  elapsed=0;paused=false;position=3;states=abilities.map(()=>({activeUntil:0,readyAt:0}));feedbackUntil=0;
  $('pause').textContent='Pausar carrera';$('map-content').hidden=false;$('map-toggle').setAttribute('aria-expanded','true');$('map-chevron').textContent='›';
  if($('map-dialog').open)$('map-dialog').close();closeAbility();showDialog();renderAbilities();updateHUD();updateMap();drawScene();
}
function updateHUD(){
  $('position').textContent=position;$('lap').textContent=`${Math.floor(elapsed/45)%3+1} / 3`;
  const time=elapsed%135;$('race-time').textContent=`${String(Math.floor(time/60)).padStart(2,'0')}:${(time%60).toFixed(1).padStart(4,'0')}`;
  $('race-progress').style.width=(elapsed%45/45*100)+'%';
  $('ability-feedback').classList.toggle('visible',elapsed<feedbackUntil);
}
$('dialog-next').onclick=nextDialog;$('dialog-close').onclick=()=>{$('dialogue').hidden=true;};
abilityButtons.forEach((b,i)=>b.onclick=()=>consultAbility(i));
$('ability-close').onclick=closeAbility;$('ability-activate').onclick=()=>activate(selected);
$('map-toggle').onclick=toggleMap;$('map-expand').onclick=openMap;$('map-close').onclick=()=>$('map-dialog').close();
$('controls-toggle').onclick=()=>{const open=$('demo-controls').hidden;$('demo-controls').hidden=!open;$('controls-toggle').setAttribute('aria-expanded',String(open));};
$('pause').onclick=()=>{paused=!paused;$('pause').textContent=paused?'Reanudar carrera':'Pausar carrera';};
$('show-dialog').onclick=showDialog;
$('force-cooldown').onclick=()=>{states=abilities.map(a=>({activeUntil:0,readyAt:elapsed+a.cooldown}));renderAbilities();};
$('ready-all').onclick=()=>{states=abilities.map(()=>({activeUntil:0,readyAt:0}));renderAbilities();};
$('overtake').onclick=()=>{position=position===1?6:position-1;updateHUD();};$('reset').onclick=reset;
document.addEventListener('keydown',e=>{
  if(e.repeat||e.ctrlKey||e.altKey||e.metaKey||$('map-dialog').open)return;
  if(e.target.closest('button,a,input,select,textarea')&&e.code==='Space')return;
  if(e.key==='Shift')activate(0);else if(e.key.toLowerCase()==='e')activate(1);else if(e.key.toLowerCase()==='q')activate(2);
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
  const sky=ctx.createLinearGradient(0,0,0,height);sky.addColorStop(0,'#122937');sky.addColorStop(.5,'#3e5d67');sky.addColorStop(1,'#173b4d');ctx.fillStyle=sky;ctx.fillRect(0,0,width,height);
  // Station architecture stays quiet behind the track.
  ctx.fillStyle='#163342';for(let i=0;i<8;i++){const x=width*(i/7)-40;ctx.fillRect(x,height*.14,35,height);ctx.fillStyle='#284956';ctx.fillRect(x+5,height*.14,4,height);ctx.fillStyle='#163342';}
  ctx.strokeStyle='#7295a324';ctx.lineWidth=1;for(let i=0;i<14;i++){const y=height*(.18+i*.065);ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(width,y);ctx.stroke();}
  const halo=ctx.createRadialGradient(width*.52,height*.2,4,width*.52,height*.2,width*.27);halo.addColorStop(0,'#bddce035');halo.addColorStop(1,'#bddce000');ctx.fillStyle=halo;ctx.fillRect(0,0,width,height);
  ctx.save();ctx.translate(0,18);ctx.beginPath();trackPath(-1);trackPath(1,1.05,0,true);ctx.closePath();ctx.fillStyle='#061723';ctx.fill();ctx.restore();
  ctx.beginPath();trackPath(-1);trackPath(1,1.05,0,true);ctx.closePath();const road=ctx.createLinearGradient(0,0,0,height);road.addColorStop(0,'#50666e');road.addColorStop(1,'#778a8e');ctx.fillStyle=road;ctx.fill();
  for(const side of [-1,1]){ctx.beginPath();trackPath(side);ctx.strokeStyle='#152e3c';ctx.lineWidth=15;ctx.stroke();ctx.strokeStyle='#b1cbd1';ctx.lineWidth=3;ctx.stroke();ctx.beginPath();trackPath(side*.94);ctx.strokeStyle='#64dce466';ctx.lineWidth=2;ctx.stroke();}
  const motion=reducedMotion?0:elapsed*.055;
  for(let i=0;i<22;i++){const t=((i/22+motion)%1);const p=trackPoint(t);ctx.strokeStyle='#d4e4e52a';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(p.x-p.half*.8,p.y);ctx.lineTo(p.x+p.half*.8,p.y);ctx.stroke();}
  for(let i=0;i<9;i++){const t=(i/9+motion*.4)%1,p=trackPoint(t);for(const side of [-1,1]){const x=p.x+side*p.half*.99;ctx.fillStyle='#102c3a';ctx.fillRect(x-3, p.y-13*(t+.3),6,20*(t+.3));ctx.fillStyle='#64dce4';ctx.fillRect(x-3,p.y-13*(t+.3),6,3);}}
  const balls=[{t:.24,l:-.25},{t:.35,l:.48},{t:.71,l:-.12},{t:.52,l:-.5},{t:.43,l:.06},{t:.6,l:.5}];
  balls.forEach((b,i)=>{
    const t=(b.t+(reducedMotion?0:Math.sin(elapsed*.4+i)*.012))*(width<=680?.42:1),p=trackPoint(t),x=p.x+p.half*b.l,y=p.y,r=Math.max(10,width*(.009+.022*t));
    ctx.save();if(i!==2&&elapsed<states[2].activeUntil)ctx.globalAlpha=.4;
    ctx.fillStyle='#09202b66';ctx.beginPath();ctx.ellipse(x+5,y+r*.78,r*1.13,r*.35,0,0,Math.PI*2);ctx.fill();
    if(i===2&&elapsed<states[0].activeUntil){const tail=ctx.createLinearGradient(x,y,x,y+100);tail.addColorStop(0,'#f4be6299');tail.addColorStop(1,'#f4be6200');ctx.fillStyle=tail;ctx.beginPath();ctx.moveTo(x-r*.6,y);ctx.lineTo(x+r*.6,y);ctx.lineTo(x+15,y+100);ctx.lineTo(x-15,y+100);ctx.fill();}
    const g=ctx.createRadialGradient(x-r*.35,y-r*.45,r*.05,x,y,r);g.addColorStop(0,'#f7ffff');g.addColorStop(.22,colors[i]);g.addColorStop(1,i===2?'#88572d':'#1d465b');ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle='#ffffff33';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(x,y,r*.6,r,Math.PI*.3,0,Math.PI*2);ctx.stroke();
    if(i===2){ctx.strokeStyle=elapsed<states[1].activeUntil?'#64dce4':'#f4be62aa';ctx.lineWidth=elapsed<states[1].activeUntil?3:1;ctx.beginPath();ctx.ellipse(x,y+r*.65,r*1.4,r*.5,0,0,Math.PI*2);ctx.stroke();ctx.fillStyle='#102636ee';ctx.fillRect(x-19,y-r-28,38,21);ctx.fillStyle='#f4be62';ctx.font='600 12px sans-serif';ctx.textAlign='center';ctx.fillText('Tú',x,y-r-13);}
    ctx.restore();
  });
}
let previous=performance.now(),lastUI=0;
function frame(now){const delta=Math.min((now-previous)/1000,.1);previous=now;if(!paused&&!document.hidden)elapsed+=delta;if(now-lastUI>80){renderAbilities();updateHUD();updateMap();lastUI=now;}drawScene();requestAnimationFrame(frame);}
new ResizeObserver(resize).observe(canvas);showDialog();renderAbilities();updateMap();requestAnimationFrame(frame);
