const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const model=require('../ability-model.js');
const sandbox={window:{}};vm.runInNewContext(fs.readFileSync('prototype-config.js','utf8'),sandbox);
const config=sandbox.window.MARBLE_CONFIG.shared;
const expected={impulse:[3,10],jump:[1,8],ghost:[3,12]};
for(const ability of config.abilityDefaults){
  const [duration,cooldown]=expected[ability.id];
  assert.equal(ability.duration,duration);assert.equal(ability.cooldown,cooldown);
  const state=model.activate(model.idle(),ability,20);
  assert.equal(state.activeUntil,20+duration);
  assert.equal(state.readyAt,20+duration+cooldown,'cooldown starts after effect');
  assert.equal(model.activate(state,ability,20.2),null,'active duplicate blocked');
  assert.equal(model.status(state,20+duration-.001).active,true);
  assert.equal(model.status(state,20+duration).active,false);
  assert.equal(model.status(state,20+duration).remaining,cooldown,'full cooldown at effect boundary');
  assert.equal(model.status(state,20).remaining,duration+cooldown,'duration added exactly once');
  assert.equal(model.activate(state,ability,20+duration+cooldown-.001),null,'last instant of cooldown blocked');
  assert.notEqual(model.activate(state,ability,20+duration+cooldown),null,'exact cooldown boundary is ready');
  assert.equal(model.status(model.idle(),21).active,false,'reset has no active effect');
  assert.equal(model.status(model.idle(),21).remaining,0,'reset has no timer');
}
const jump=config.abilityDefaults.find(a=>a.id==='jump');
const jumping=model.activate(model.idle(),jump,10);
assert.equal(model.jumpHeight(jumping,jump,10),0);
assert.equal(model.jumpHeight(jumping,jump,10.5),1);
assert.equal(model.jumpHeight(jumping,jump,11),0);
for(let t=11;t<=18;t+=.1)assert.equal(model.jumpHeight(jumping,jump,t),0,'no repeated jumps during cooldown');
let peaks=0,last=0,rising=true;
for(let n=0;n<=100;n++){
  const h=model.jumpHeight(jumping,jump,10+n/100);
  if(h<last&&rising){peaks++;rising=false;}
  last=h;
}
assert.equal(peaks,1,'exactly one apex per activation');
const ghost=config.abilityDefaults.find(a=>a.id==='ghost');
const ghosting=model.activate(model.idle(),ghost,10);
assert.equal(model.ghostOpacity(ghosting,ghost,10),1);
assert.ok(model.ghostOpacity(ghosting,ghost,10.2)<1);
assert.ok(Math.abs(model.ghostOpacity(ghosting,ghost,11)-ghost.minOpacity)<1e-10);
assert.ok(model.ghostOpacity(ghosting,ghost,12.8)>ghost.minOpacity);
assert.equal(model.ghostOpacity(ghosting,ghost,13),1);
assert.equal(model.ghostOpacity(model.idle(),ghost,10),1);
// Per-prototype overrides are resolved without mutating shared defaults.
sandbox.document={documentElement:{style:{setProperty:()=>{}}},body:{dataset:{prototype:'prototype-01'}},querySelectorAll:()=>[],querySelector:()=>null,getElementById:()=>null};
sandbox.window.MARBLE_CONFIG.prototypes['prototype-01'].text.next='Keep going ›';
sandbox.window.MARBLE_CONFIG.prototypes['prototype-01'].abilityOverrides.impulse={duration:4,cooldown:11};
sandbox.window.MARBLE_CONFIG.prototypes['prototype-01'].iconRoles.map='ghost';
vm.runInNewContext(fs.readFileSync('content.js','utf8'),sandbox);
const resolved=sandbox.window.MarbleContent;
assert.equal(resolved.text('next'),'Keep going ›');
assert.equal(resolved.config.abilities[0].duration,4);
assert.equal(resolved.config.abilities[0].cooldown,11);
assert.equal(config.abilityDefaults[0].duration,3,'shared defaults remain untouched');
assert.equal(resolved.iconMarkup('map').includes('Q11 7 24 7'),true,'icon role replacement applies');
console.log('PASS: activation deadlines, duplicate blocking, reset, one jump, Ghost recovery and per-prototype overrides.');
