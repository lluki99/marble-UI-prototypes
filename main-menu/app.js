(() => {
 const c=window.MAIN_MENU_CONFIG,t=c.text,model=window.MainMenuModel;
 const root=document.getElementById('terminal-content'),screen=document.querySelector('.screen'),modal=document.getElementById('modal-layer');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 let state=model.create(c),transitionTimer=null,transitioning=false;
 const esc=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
 document.title=t.pageTitle;
 
 document.querySelector('.computer').style.backgroundImage=`url("${c.computer}")`;
 document.getElementById('hub-link').textContent=t.back;document.getElementById('reset-demo').textContent=t.reset;
 const button=(label,kind,index,highlight=false)=>`<button class="menu-button${highlight?' highlighted':''}" data-kind="${kind}" data-index="${index}">${esc(label)}</button>`;
 const windowHTML=(title,body)=>`<section class="window"><h2 class="window-title">${esc(title)}</h2><div class="window-body">${body}</div></section>`;
 function hints(){return `<div class="footer-hints"><span><b class="pad-key">A</b>${esc(t.confirm)}</span><span><b class="pad-key">B</b>${esc(t.return)}</span><span>↑ ↓ ${esc(t.navigate)}</span><span class="keyboard-hint">${esc(t.keyboard)}</span></div>`;}
 function previewHTML(){
  if(state.zone!=='sub'||state.branch!==0)return '';
  if(state.sub===1)return `<div class="preview">${windowHTML(t.alert,`<p>${esc(t.newWarning)}</p>`)}</div>`;
  return `<div class="preview"><div class="save-info"><img class="save-portrait" src="${esc(c.portrait)}" alt="Saved character portrait"><div class="affinity">${windowHTML(t.affinity,`<strong>${esc(c.save.faction)}</strong>`)}</div></div><div class="progress-row"><progress max="100" value="${state.progress}" aria-label="${esc(t.progress)}"></progress><strong>${state.progress}%</strong></div><div class="progress-caption">${esc(t.progress)}</div></div>`;
 }
 function panelHTML(){
  const panel=state.panel;let title,body;
  if(panel==='Video'||panel==='Audio'){
   title=panel;body=`<p class="small-note">${esc(t.settingsHint)}</p>`+state.settings[panel].map((value,index)=>`<label class="setting-row"><span>${esc(t.setting)} ${index+1}</span><input type="range" min="0" max="100" value="${value}" data-group="${panel}" data-setting="${index}"><output>${value}</output></label>`).join('');
  }else if(panel==='controls'){
   title=c.menu[2];body=`<div class="controls-grid"><section><h3>${esc(t.xbox)}</h3><p>${esc(t.xboxInfo)}</p></section><section><h3>${esc(t.keyboardTitle)}</h3><p>${esc(t.keyboardInfo)}</p></section></div><p class="small-note">${esc(t.gamepadNote)}</p>`;
  }else{title=c.menu[3];body=c.credits.map(([role,name])=>`<div class="credits-row"><strong>${esc(role)}</strong><span>${esc(name)}</span></div>`).join('');}
  return `<div class="panel-view">${windowHTML(title,body+`<button class="panel-close" data-command="back">← ${esc(t.return)}</button>`)}</div>`;
 }
 function render(focus=true){
  screen.classList.toggle('modal-open',!!state.modal);
  if(state.screen==='start')root.innerHTML=`<div class="boot"><h1>${esc(c.title)}</h1><button class="start-button" data-command="confirm">${esc(t.start).replace(/\bA\b/,'<b class="pad-key">A</b>')}</button></div>`;
  else if(state.screen==='simulation')root.innerHTML=`<div class="simulation-view"><h1>${esc(state.simulationKind==='new'?t.newStart:t.resume)}</h1><p>${esc(t.simulationHint)}</p>${button(t.close,'return',0,true)}</div>`;
  else root.innerHTML=`<div class="menu-shell"><div class="ghost-brand" aria-hidden="true">${esc(c.title)}</div>${state.panel?panelHTML():`<div class="menu-columns"><nav class="main-options" aria-label="Main menu">${c.menu.map((label,index)=>button(label,'main',index,index===state.main)).join('')}</nav><section class="secondary" aria-label="Menu options">${state.branch===null?'':`<div class="branch-list">${c.branches[state.branch].map((label,index)=>button(label,'sub',index,state.zone==='sub'&&index===state.sub)).join('')}</div>${previewHTML()}`}</section></div>`}${hints()}</div>`;
  root.inert=!!state.modal;modal.hidden=!state.modal;
  if(state.modal){
   modal.innerHTML=`<section class="window modal-window" role="dialog" aria-modal="true" aria-labelledby="alert-title" aria-describedby="alert-copy"><h2 class="window-title" id="alert-title">${esc(t.alert)}</h2><div class="window-body"><p id="alert-copy">${esc(state.modal==='quit'?t.quitWarning:t.newWarning)}</p></div><div class="modal-actions">${[t.yes,t.no].map((label,index)=>button(label,'choice',index,state.choice===index)).join('')}</div></section>`;
  }else modal.innerHTML='';
  if(!focus)return;
  const selector=state.modal?`[data-kind="choice"][data-index="${state.choice}"]`:state.screen==='start'?'[data-command="confirm"]':state.screen==='simulation'?'[data-kind="return"]':state.panel?'[data-command="back"]':`[data-kind="${state.zone==='sub'?'sub':'main'}"][data-index="${state.zone==='sub'?state.sub:state.main}"]`;
  (modal.querySelector(selector)||root.querySelector(selector))?.focus({preventScroll:true});
 }
 function send(type,extra={}){
  if(transitioning&&type!=='reset')return;
  const boot=state.screen==='start'&&type==='confirm';
  if(type==='reset'){clearTimeout(transitionTimer);screen.classList.remove('transitioning');transitioning=false;}
  state=model.dispatch(state,{type,...extra},c);render();
  if(boot&&!reduced){
   transitioning=true;screen.classList.add('transitioning');
   transitionTimer=setTimeout(()=>{screen.classList.remove('transitioning');transitioning=false;transitionTimer=null;},340);
  }
 }
 function highlight(kind,index){
  if(transitioning)return;
  if(kind==='choice'){if(state.choice===index)return;send('choice',{index});return;}
  if(kind==='main'){
   if(state.modal||state.panel||state.screen!=='menu')return;
   if(state.main===index){if(state.zone==='main')return;state.zone='main';state.sub=null;render();}
   else send('main',{index});
  }else if(kind==='sub'&&(state.sub!==index||state.zone!=='sub'))send('sub',{index});
 }
 screen.addEventListener('pointermove',event=>{const item=event.target.closest('[data-kind]');if(item)highlight(item.dataset.kind,Number(item.dataset.index));});
 screen.addEventListener('focusin',event=>{const item=event.target.closest('[data-kind]');if(item)highlight(item.dataset.kind,Number(item.dataset.index));});
 screen.addEventListener('click',event=>{
  const command=event.target.closest('[data-command]');if(command){send(command.dataset.command);return;}
  const item=event.target.closest('[data-kind]');if(!item)return;
  if(item.dataset.kind==='return')send('back');else{highlight(item.dataset.kind,Number(item.dataset.index));send('confirm');}
 });
 screen.addEventListener('input',event=>{if(!event.target.matches('[data-setting]'))return;state=model.dispatch(state,{type:'setting',group:event.target.dataset.group,index:Number(event.target.dataset.setting),value:event.target.value},c);event.target.nextElementSibling.textContent=event.target.value;});
 // Preserve native slider focus/value changes; updating a slider never rebuilds its panel.
 
 document.addEventListener('keydown',event=>{
  if(event.target.closest('.external-header'))return;
  if(event.key==='Escape'){event.preventDefault();if(!event.repeat)send('back');return;}
  if(event.target.matches('input[type="range"]'))return;
  if(state.modal&&event.key==='Tab'){event.preventDefault();send('choice',{index:1-state.choice});return;}
  const command={Enter:'confirm',ArrowRight:'right',ArrowLeft:'left',ArrowUp:'up',ArrowDown:'down'}[event.key];
  if(!command||event.ctrlKey||event.altKey||event.metaKey)return;
  event.preventDefault();if(event.repeat)return;
  if(event.key==='Enter'&&state.panel&&event.target.closest('[data-command="back"]'))send('back');else send(command);
 });
 document.getElementById('reset-demo').onclick=()=>send('reset');
 render(false);
})();
