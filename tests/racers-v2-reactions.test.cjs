const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),model=require('../racers-v2/reaction-model');
const scope={window:{}};vm.createContext(scope);vm.runInContext(fs.readFileSync(path.join(__dirname,'../racers-v2/config.js'),'utf8'),scope);const config=scope.window.MARBLE_CONFIG.shared;
assert.equal(config.text.faction,"People's M.A.R.B.L.E. Navy");for(const [id,event] of Object.entries(config.events)){assert(event.reaction);const state=model.create(config.reactionTiming);assert(model.enqueue(state,id,event,0));assert.equal(state.current.reaction.text,event.reaction.text);assert.equal(state.current.lines,undefined);assert.equal(state.current.index,undefined);assert(!model.enqueue(state,id,event,1));assert.equal(model.tick(state,5),null);}
const state=model.create(),a={cooldown:1,reaction:{who:'npc',text:'Reaction A'}},b={cooldown:1,reaction:{who:'player',text:'Reaction B'}};model.enqueue(state,'a',a,0);model.enqueue(state,'b',b,0);assert(!model.enqueue(state,'b',b,1));assert.equal(model.tick(state,4).id,'b');assert.equal(model.tick(state,8),null);model.enqueue(state,'a',a,9);assert.equal(model.dismiss(state,10),null);assert.equal(model.create().queue.length,0);assert.equal(model.enqueue(model.create(),'old',{lines:[{text:'Not a reaction'}]},0),false);
assert.equal(model.duration({text:''},state.timing),3);assert.equal(model.duration({text:'x'.repeat(100)},state.timing),4);assert.equal(model.spaceAction({space:true,open:true,editing:false,repeat:false}),'dismiss');assert.equal(model.spaceAction({space:true,open:true,editing:true}),null);assert.equal(model.spaceAction({space:true,open:true,repeat:true}),'consume');
// View uses a persistent, tinted host and caches each asset node across shows/character switches.
let imagesCreated=0,timerId=0;const timers=new Map(),nodes={};
class Node{constructor(){this.children=[];this.hidden=true;this.attrs={};this.style={setProperty(){}};this.classes=new Set();this.classList={add:name=>this.classes.add(name),remove:name=>this.classes.delete(name)};this.animations=[];}get firstChild(){return this.children[0];}append(...children){this.children.push(...children);}replaceChildren(...children){this.children=children;}setAttribute(k,v){this.attrs[k]=v;}querySelector(selector){if(selector==='text')return this.svgText||(this.svgText=new Node());if(selector==='.reaction-portrait-art')return nodes.art;return nodes[selector.slice(1)];}animate(frames,options){const animation={frames,options,canceled:false,cancel(){this.canceled=true;}};this.animations.push(animation);return animation;}}
for(const name of ['reaction-panel','reaction-portrait','reaction-name','reaction-faction','reaction-text','reaction-emblem','scan-matrix','art'])nodes[name]=new Node();
const dock=new Node(),context={window:{},document:{createElement:tag=>{if(tag==='img')imagesCreated++;return new Node();}},setTimeout:fn=>{timers.set(++timerId,fn);return timerId;},clearTimeout:id=>timers.delete(id)};
vm.createContext(context);vm.runInContext(fs.readFileSync(path.join(__dirname,'../racers-v2/reaction-view.js'),'utf8'),context);const view=context.window.ReactionView.create(dock,config,{reducedMotion:false});assert.equal(imagesCreated,2);assert.equal(nodes['scan-matrix'].children.length,168);
const first={reaction:{who:'npc',text:'Standalone reaction'}};view.render(first);const npcImage=nodes.art.firstChild;assert.equal(npcImage.src,config.characters.npc.portrait);const motions=dock.animations.length;view.render(first);assert.equal(dock.animations.length,motions,'same reaction must not restart entry');view.render({reaction:{who:'npc',text:'A longer reaction. '.repeat(20)}});assert.equal(nodes.art.firstChild,npcImage);assert.equal(imagesCreated,2);assert.equal(nodes['reaction-text'].textContent,'A longer reaction. '.repeat(20));
view.render({reaction:{who:'player',text:'Player reaction'}});const playerImage=nodes.art.firstChild;assert.notEqual(playerImage,npcImage);assert.equal(playerImage.src,config.characters.player.portrait);assert.equal(nodes['reaction-name'].textContent,'You');view.render(null);assert.equal(nodes.art.firstChild,playerImage,'exit never resets the portrait asset');assert.equal(dock.hidden,false,'exit remains visible until animation completes');assert(!dock.classes.has('is-active'));assert.equal(timers.size,1);view.render({reaction:{who:'npc',text:'Next reaction'}});assert.equal(timers.size,1,'new entry replaces exit with one interference scheduler');assert.equal(nodes.art.firstChild,npcImage);view.clear();assert.equal(dock.hidden,true);assert.equal(nodes['reaction-panel'].hidden,true);assert.equal(timers.size,0);
const css=fs.readFileSync(path.join(__dirname,'../racers-v2/reaction.css'),'utf8');assert.match(css,/\.reaction-portrait-art\{[^}]*filter:grayscale/);assert.doesNotMatch(css,/transition\s*:[^;}]*filter/);assert.doesNotMatch(css,/is-active[^}]*filter/);
console.log('PASS: one-shot timing/queue/dismissal, persistent cached portrait nodes, actor switches, unchanged exit assets, interrupted motion and reset.');
for(const file of ['styles.css','layout.css','hud-theme.css']){const styles=fs.readFileSync(path.join(__dirname,'../racers-v2',file),'utf8');assert.doesNotMatch(styles,/\.(?:portrait|portrait-stack|portrait-art|radio-dock|dialogue|dialogue-body|dialogue-footer|terminal-title)\b/,'legacy reaction selectors must not remain in '+file);}console.log('PASS: reaction styling has one owner; legacy portrait/dialogue selectors are absent from shared HUD styles.');

// Signal frames grow upwards from a fixed bottom row, loop continuously and stop on dismissal/reset.
view.render({reaction:{who:'npc',text:'Signal lifecycle'}});
const cells=nodes['scan-matrix'].children;
for(let column=0;column<24;column++){
 const top=cells[column].animations.at(-1).frames,bottom=cells[144+column].animations.at(-1).frames;
 assert(bottom.every(frame=>frame.opacity===.84),'bottom row must stay illuminated');
 for(let row=0;row<6;row++){const upper=cells[row*24+column].animations.at(-1).frames,lower=cells[(row+1)*24+column].animations.at(-1).frames;assert(upper.every((frame,i)=>frame.opacity<=lower[i].opacity),'columns must grow only upwards without gaps');}
 assert(Math.abs(top[0].opacity-top.at(-1).opacity)<1e-10,'loop must join without a jump');
 assert(top.every(frame=>frame.opacity>=.12&&frame.opacity<=.84));
}
const running=cells.map(cell=>cell.animations.at(-1));view.render(null);assert(running.every(motion=>motion.canceled));
view.render({reaction:{who:'player',text:'Reset signal'}});const resetMotions=cells.map(cell=>cell.animations.at(-1));view.clear();assert(resetMotions.every(motion=>motion.canceled));
console.log('PASS: bottom-anchored square waveform, seamless loop, bounded opacity and animation cleanup.');

// Portrait effects never touch the base image or its permanent tint, and cancel all work.
const effectArt=new Node(),effect=context.window.PortraitTransmission.create(effectArt,{intensity:.6,minIntervalMs:1000,maxIntervalMs:2000},false);
effect.start(config.characters.npc.portrait);assert.equal(timers.size,1);
const overlays=effectArt.children;assert.equal(overlays.length,14);assert(overlays.every(layer=>layer.animations.length>0));
effect.stop();assert.equal(timers.size,0);assert(overlays.every(layer=>layer.animations.every(motion=>motion.canceled)));
const reducedArt=new Node(),reduced=context.window.PortraitTransmission.create(reducedArt,{},true);reduced.start(config.characters.player.portrait);assert.equal(timers.size,0);assert(reducedArt.children.every(layer=>layer.animations.length===0));
console.log('PASS: transmission burst lifecycle, scheduler cancellation and reduced motion.');

const aggressiveArt=new Node(),aggressiveHost=new Node(),aggressive=context.window.PortraitTransmission.create(aggressiveArt,{intensity:1},false,aggressiveHost);
aggressive.start('assets/radio-caller.png');assert.equal(aggressiveArt.children.length,11);assert.equal(aggressiveHost.children.length,3);
const displaced=aggressiveArt.children[0].animations.at(-1);assert.equal(displaced.options.easing,'linear','effect timing must visit intermediate burst frames');assert(displaced.frames.some(frame=>Math.abs(Number((frame.transform||'').match(/translateX\(([-.\d]+)/)?.[1]||0))>=13),'connection must tear noticeably at actual portrait resolution');
assert(aggressiveHost.children.every(layer=>layer.animations.at(-1).frames.some(frame=>frame.opacity>.75)),'all RGB echoes must be visible during connection');
aggressive.stop();assert.equal(timers.size,0);assert(aggressiveHost.children.every(layer=>layer.animations.every(motion=>motion.canceled)));
console.log('PASS: strong strip displacement, three visible RGB echoes and complete channel cleanup.');
