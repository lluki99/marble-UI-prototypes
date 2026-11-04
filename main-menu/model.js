/* Explicit navigation state: highlighting never implicitly activates a menu item. */
(function(root){
 function create(config){return {screen:'start',main:0,branch:null,sub:null,zone:'main',panel:null,modal:null,choice:1,progress:config.save.progress,settings:JSON.parse(JSON.stringify(config.settings))};}
 function dispatch(s,event,config){
  const branches=config.branches;
  if(event.type==='reset')return create(config);
  if(event.type==='setting'){s.settings[event.group][event.index]=Math.max(0,Math.min(100,Number(event.value)||0));return s;}
  if(event.type==='main'&&!s.modal&&s.screen==='menu'){s.main=event.index;s.zone='main';s.sub=null;s.panel=null;s.branch=null;return s;}
  if(event.type==='sub'&&!s.modal&&s.branch!==null){s.sub=event.index;s.zone='sub';s.panel=null;return s;}
  if(s.screen==='start'){if(event.type==='confirm')s.screen='menu';return s;}
  if(s.screen==='simulation'){if(['back','confirm'].includes(event.type)){s.screen='menu';s.zone='sub';}return s;}
  if(s.modal){
   if(event.type==='choice')s.choice=event.index;
   if(['left','right','up','down'].includes(event.type))s.choice=1-s.choice;
   if(event.type==='back'){s.modal=null;return s;}
   if(event.type==='confirm'){
    const modal=s.modal;s.modal=null;
    if(s.choice===0){if(modal==='quit'){s.screen='start';s.main=0;s.branch=null;s.sub=null;s.panel=null;s.zone='main';}else{s.progress=0;s.simulationKind='new';s.screen='simulation';}}
   }return s;
  }
  if(event.type==='back'||event.type==='left'){
   if(s.panel){s.panel=null;s.zone=s.branch===null?'main':'sub';}
   else if(s.zone==='sub'){s.zone='main';s.sub=null;}
   else if(s.branch!==null){s.branch=null;s.sub=null;}
   return s;
  }
  if(s.panel)return s;
  if(event.type==='right'&&s.branch!==null){s.zone='sub';s.sub??=0;return s;}
  if(event.type==='up'||event.type==='down'){
   const delta=event.type==='down'?1:-1;
   if(s.zone==='sub')s.sub=(s.sub+delta+branches[s.branch].length)%branches[s.branch].length;
   else {s.main=(s.main+delta+config.menu.length)%config.menu.length;s.branch=null;s.sub=null;}
  }
  if(event.type==='confirm'){
   if(s.zone==='main'){
    if(s.main<2){s.branch=s.main;s.sub=null;}
    else if(s.main===4){s.modal='quit';s.choice=1;}
    else s.panel=s.main===2?'controls':'credits';
   }else if(s.branch===0){if(s.sub===0){s.simulationKind='resume';s.screen='simulation';}else{s.modal='new';s.choice=1;}}
   else s.panel=branches[1][s.sub];
  }
  return s;
 }
 const api={create,dispatch};if(typeof module==='object'&&module.exports)module.exports=api;else root.MainMenuModel=api;
})(typeof window==='object'?window:globalThis);
