// Search only user-created records. Empty categories stay empty until publishing exists.
function searchableItems(){
 const local=profiles.filter(item=>item.id!==profile?.id).map(item=>({id:item.id,type:'player',name:item.name,detail:(item.games||[]).map(id=>tcgCatalog.find(game=>game.id===id)?.name||id).join(' · ')||'TCG player',tags:(item.games||[]).map(id=>tcgCatalog.find(game=>game.id===id)?.name||id),description:'Local profile on this browser.',mascot:item.mascot,local:true}));
 const records=(key,type)=>{const saved=store.read(key,[]);return (Array.isArray(saved)?saved:[]).filter(item=>item&&typeof item.name==='string'&&item.name.trim()&&typeof item.ownerId==='string'&&profiles.some(player=>player.id===item.ownerId)).map(item=>({id:String(item.id||''),type,name:item.name.trim(),detail:[item.game,item.location].filter(value=>typeof value==='string').join(' · ')||(type==='event'?'Event':'Shop'),tags:Array.isArray(item.tags)?item.tags.filter(value=>typeof value==='string').slice(0,3):[],description:typeof item.description==='string'?item.description:'Created by a Hand Deck player.',local:false}));};
 return [...local,...records('handdeck-player-events-v1','event'),...records('handdeck-player-shops-v1','shop')];
}
function searchMatches(item,term){return !term||[item.name,item.detail,item.description,...item.tags].join(' ').toLocaleLowerCase().includes(term.toLocaleLowerCase());}
function searchResultCard(item){
 const icon=item.type==='player'?`<img src="assets/handdeck-spirit-${esc(item.mascot||'hello')}.webp" alt="">`:svg(item.type==='event'?'explore':'profile');
 const type=item.type==='player'?'PLAYER':item.type==='event'?'EVENT':'SHOP';
 return `<article class="search-result search-result-${item.type}"><div class="search-result-icon">${icon}</div><div class="search-result-body"><div class="search-result-kicker"><span>${type}</span><span class="search-demo-label">${item.local?'THIS DEVICE':'CREATED'}</span></div><h2>${esc(item.name)}</h2><p>${esc(item.detail)}</p><div class="search-result-tags">${item.tags.slice(0,3).map(tag=>`<span>${esc(tag)}</span>`).join('')}</div>${item.type==='player'?`<button type="button" class="secondary search-view-player" data-view-player-id="${esc(item.id)}">View profile ${svg('arrow')}</button>`:`<details><summary>View details ${svg('arrow')}</summary><p>${esc(item.description)}</p></details>`}</div></article>`;
}
function renderSearchResults(){
 const term=searchQuery.trim(),matches=searchableItems().filter(item=>searchMatches(item,term));
 const counts={all:matches.length,player:matches.filter(item=>item.type==='player').length,event:matches.filter(item=>item.type==='event').length,shop:matches.filter(item=>item.type==='shop').length};
 const visible=searchType==='all'?matches:matches.filter(item=>item.type===searchType);
 const tabs=[['all','All'],['player','Players'],['event','Events'],['shop','Shops']].map(([id,label])=>`<button type="button" data-search-type="${id}" aria-pressed="${searchType===id}">${label} <span>${counts[id]}</span></button>`).join('');
 const content=visible.length?`<div class="search-results-grid">${visible.map(searchResultCard).join('')}</div>`:`<div class="search-no-results">${svg('explore')}<h2>No ${searchType==='all'?'results':searchType+'s'} found</h2><p>${term?'Try another name, game or location.':'Only profiles, events and shops created by users will appear here.'}</p></div>`;
 return `<div class="search-filter-tabs" role="group" aria-label="Search result type">${tabs}</div><div class="search-result-count">${visible.length} ${visible.length===1?'result':'results'}${term?` for “${esc(term)}”`:''}</div>${content}`;
}
function renderSearchPage(){return `<div class="search-page">${head('','Search','Find players, events and shops across Hand Deck.')}<p class="search-preview-note">Results include only profiles, events and shops created by users. Online search will become available when public accounts launch.</p><div id="search-results">${renderSearchResults()}</div></div>`;}
function updateSearchResults(){const target=document.getElementById('search-results');if(target)target.innerHTML=renderSearchResults();}
