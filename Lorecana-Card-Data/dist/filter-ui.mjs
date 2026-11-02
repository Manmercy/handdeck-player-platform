export function enhanceFilters(icon){
  const root=document.querySelector('#filters');
  root.setAttribute('aria-label','Card filters');
  root.querySelector('h2').innerHTML=icon('filter')+' Filters <span id="filter-count" hidden></span>';
  root.querySelectorAll('[data-color] img').forEach(img=>img.alt='');
  root.querySelectorAll('[data-cost]').forEach(button=>{button.innerHTML=`<img src="assets/ink/inkcost.svg" alt=""><span class="cost-number">${button.dataset.cost}</span>`;button.title=`Ink cost ${button.dataset.cost}`;});
  const inkwell=document.createElement('section');inkwell.innerHTML='<h3>Inkwell</h3>';inkwell.append(root.querySelector('.inkable-options'));root.querySelectorAll(':scope > section')[1].after(inkwell);
  root.querySelectorAll('.inkable-options label').forEach(label=>{const input=label.querySelector('input'),img=label.querySelector('img');label.replaceChildren(input,img);input.setAttribute('aria-label',input.id==='inkable'?'Inkable':'Uninkable');label.title=input.getAttribute('aria-label');});
  root.querySelectorAll('#types label').forEach(label=>{const input=label.querySelector('input'),svg=label.querySelector('svg'),name=input.value;input.setAttribute('aria-label',name[0].toUpperCase()+name.slice(1));label.title=input.getAttribute('aria-label');label.replaceChildren(input,svg);});
  const groups=[['Colors','cards',''],['Cost','deck',''],['Inkwell','deck',''],['Types','person',''],['Set','cards',''],['Rarity','item','']];
  [...root.querySelectorAll(':scope > section')].forEach((section,i)=>{
    const [name,symbol,hint]=groups[i];
    const heading=section.querySelector('h3');
    const details=document.createElement('details');details.className='filter-group';details.open=i<4;
    details.innerHTML=`<summary>${icon(symbol)}<span>${name}</span><span class="group-count" hidden></span><span class="filter-chevron" aria-hidden="true">⌄</span></summary><div class="filter-group-body">${hint?`<p class="filter-hint">${hint}</p>`:''}</div>`;
    heading.remove();while(section.firstChild)details.lastElementChild.append(section.firstChild);
    section.replaceWith(details);
  });
  const advanced=root.querySelector('details:not(.filter-group)');
  advanced.classList.add('filter-group','advanced-group');
  advanced.querySelector('summary').innerHTML=icon('filter')+'<span>More filters</span><span class="group-count" hidden></span><span class="filter-chevron" aria-hidden="true">⌄</span>';
  const body=document.createElement('div');body.className='filter-group-body';
  while(advanced.children.length>1)body.append(advanced.children[1]);advanced.append(body);

  // Keep every text-based option behind the same disclosure.
  const mode=root.querySelector('#color-mode');const modeLabel=mode.previousElementSibling;modeLabel.textContent='Color matching';body.prepend(modeLabel,mode);
  root.querySelectorAll(':scope > .filter-group:not(.advanced-group)').forEach(group=>{const select=group.querySelector('#set,#rarity');if(!select)return;const label=group.querySelector('label');label.className='small-label';body.prepend(label,select);group.remove();});
  const close=document.querySelector('#close-filters');close.title='Hide filters';
  [...body.children].forEach(child=>{
    if(child.tagName!=='LABEL')return;
    const field=document.createElement('div');field.className='more-filter-field';child.parentNode.insertBefore(field,child);field.append(child);
    const next=field.nextElementSibling;if(next&&(next.tagName==='SELECT'||next.tagName==='INPUT'))field.append(next);
  });

  const settings=document.querySelector('.deck-settings');const disclosure=document.createElement('details');disclosure.className='deck-settings-disclosure';disclosure.innerHTML='<summary>Deck settings <span aria-hidden="true">＋</span></summary>';settings.before(disclosure);disclosure.append(settings);
  document.querySelectorAll('.settings-hint').forEach(el=>el.remove());

  root.insertAdjacentHTML('beforeend','<div class="filter-drawer-footer"><button id="show-filter-results" class="primary-button">Show cards</button></div>');
  document.querySelector('#show-filter-results').onclick=()=>{root.classList.remove('open');document.body.classList.remove('filters-open');document.body.classList.add('filters-collapsed');document.querySelector('#filter-toggle').setAttribute('aria-expanded','false');document.querySelector('#filter-toggle').focus();};
}

export function updateFilterUI(total,active){
  const root=document.querySelector('#filters');
  let count=0;
  root.querySelectorAll('.filter-group').forEach(group=>{
    const n=group.querySelectorAll('button[aria-pressed=true],input:checked').length+[...group.querySelectorAll('select,input[type=number]')].filter(el=>el.id!=='color-mode'&&el.value!=='').length;
    count+=n;const badge=group.querySelector('.group-count');badge.textContent=n;badge.hidden=!n;group.classList.toggle('has-selection',n>0);
  });
  const badge=document.querySelector('#filter-count');if(!badge)return;
  badge.textContent=count;badge.hidden=!count;
  document.querySelector('#reset').disabled=!active;
  document.querySelector('#show-filter-results').textContent=`Show ${total.toLocaleString()} cards`;
  const mode=document.querySelector('#color-mode');mode.disabled=!root.querySelector('[data-color][aria-pressed=true]');
}
