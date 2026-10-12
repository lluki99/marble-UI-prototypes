/* Bind editable content to structural HTML. No network fetch or framework. */
(() => {
  const source=window.MARBLE_CONFIG;
  const variant=source.prototypes[document.body.dataset.prototype]||{};
  const config={...source.shared,...variant,
    text:{...source.shared.text,...variant.text},icons:{...source.shared.icons,...variant.icons},
    iconRoles:{...source.shared.iconRoles,...variant.iconRoles},
    assets:{...source.shared.assets,...variant.assets},race:{...source.shared.race,...variant.race},
    events:{...source.shared.events,...variant.events},
    theme:{...source.shared.theme,...variant.theme},
    map:{...source.shared.map,...variant.map},
    abilities:source.shared.abilityDefaults.map(a=>({...a,...variant.abilityOverrides?.[a.id]}))};
  const text=(key,values={})=>{
    if(!(key in config.text))throw new Error(`Unknown copy key: ${key}`);
    return config.text[key].replace(/\{(\w+)\}/g,(_,name)=>String(values[name]??`{${name}}`));
  };
  const iconMarkup=key=>{
    const icon=config.icons[config.iconRoles[key]||key];if(!icon)throw new Error(`Unknown icon: ${key}`);
    if(icon.src)return `<img src="${icon.src}" alt="" aria-hidden="true">`;
    return `<svg viewBox="${icon.viewBox||'0 0 48 48'}" aria-hidden="true">${icon.markup}</svg>`;
  };
  config.abilities.forEach(a=>{
    if(!(a.duration>0&&a.cooldown>0))throw new Error(`Ability ${a.id}: effect duration and cooldown must both be positive`);
  });
  Object.entries(config.theme).forEach(([key,value])=>document.documentElement.style.setProperty(`--${key}`,value));
  document.querySelectorAll('[data-text]').forEach(el=>el.textContent=text(el.dataset.text));
  document.querySelectorAll('[data-label]').forEach(el=>el.setAttribute('aria-label',text(el.dataset.label)));
  document.querySelectorAll('[data-title]').forEach(el=>el.title=text(el.dataset.title));
  document.querySelectorAll('[data-icon]').forEach(el=>el.innerHTML=iconMarkup(el.dataset.icon));
  document.querySelectorAll('[data-asset]').forEach(el=>el.src=config.assets[el.dataset.asset]);
  document.querySelectorAll('[data-prototype-name]').forEach(el=>el.textContent=variant.name);
  document.querySelectorAll('.map-route,.map-route-shadow').forEach(el=>el.setAttribute('d',config.map.path));
  const start=document.querySelector('.start-marker');
  if(start){start.setAttribute('cx',config.map.start.x);start.setAttribute('cy',config.map.start.y);}
  const finish=document.querySelector('.finish-line');
  if(finish){const {x,y}=config.map.finish;finish.setAttribute('d',`M${x} ${y-12}V${y+12}M${x} ${y-12}H${x+18}V${y-1}H${x}`);}
  const scene=document.querySelector('.race');
  if(scene)scene.style.backgroundImage=`url('${config.assets.landscape}')`;
  const wordmark=document.querySelector('.wordmark');
  if(wordmark){wordmark.innerHTML=iconMarkup('brand');const name=document.createElement('span');name.textContent=text('brand');wordmark.append(name);}
  const hub=document.getElementById('prototype-list');
  if(hub)Object.values(source.prototypes).forEach(p=>{
    const card=document.createElement('article');card.className='trail-card'+(p.cardClass?' '+p.cardClass:'');
    card.innerHTML='<a class="trail-art"><img><span class="trail-road" aria-hidden="true"></span><span class="trail-marble" aria-hidden="true"></span><span class="trail-stamp"></span></a><div class="trail-copy"><p class="version"></p><h2></h2><p class="card-description"></p><a class="play-link"></a></div>';
    const art=card.querySelector('.trail-art');art.href=p.file;art.setAttribute('aria-label',text('playLabel',{name:p.name}));
    const image=art.querySelector('img');image.src=p.assets?.landscape||source.shared.assets.landscape;image.alt=p.previewLabel||text('previewLabel');
    card.querySelector('.trail-stamp').textContent=p.number;card.querySelector('.version').textContent=p.versionLabel||text('cardVersion',{number:p.number});
    card.querySelector('h2').textContent=p.name;card.querySelector('.card-description').textContent=p.description;
    const play=card.querySelector('.play-link');play.href=p.file;play.textContent=text('play');play.insertAdjacentHTML('beforeend',iconMarkup('arrow'));hub.append(card);
  });
  window.MarbleContent={config,text,iconMarkup};
})();
