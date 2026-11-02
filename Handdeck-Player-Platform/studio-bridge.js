// Shared local workspace adapter. Google account authentication is not enabled.
(()=>{
 if(!new URLSearchParams(location.search).has('platform'))return;
 const read=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))??fallback;}catch{return fallback;}};
 try{
  // Preserve every Lorcana deck and draft before bridge requests can replace the active draft.
  const backupKey='handdeck-lorcana-pre-lorcanajson-backup-v1';
  if(!localStorage.getItem(backupKey)){
   const decks={};for(let i=0;i<localStorage.length;i++){const key=localStorage.key(i);if(key==='handdeck-lorcana-deck-v1'||key==='handdeck-lorcana-saved-decks-v1'||key?.startsWith('handdeck-lorcana-draft-'))decks[key]=localStorage.getItem(key);}
   localStorage.setItem(backupKey,JSON.stringify({savedAt:new Date().toISOString(),decks}));
  }
  const player=read('handdeck-player-preview-v1',null),session=read('handdeck-local-session-v1',null),ownerId=session?.active&&session.userId===player?.id?player.id:null;
  const requested=read('handdeck-studio-open-request',null);
  if(requested&&typeof requested.cards==='object'){
   const draft=read('handdeck-lorcana-deck-v1',null),draftOwner=read('handdeck-lorcana-draft-owner-id',null),library=read('handdeck-lorcana-saved-decks-v1',[]);
   if(ownerId&&draft&&(!draftOwner||draftOwner===ownerId)&&Object.keys(draft.cards||{}).length&&JSON.stringify(draft)!==JSON.stringify(requested)&&Array.isArray(library)&&!library.some(e=>e.ownerId===ownerId&&JSON.stringify(e.deck)===JSON.stringify(draft))){library.push({id:crypto.randomUUID(),ownerId,date:new Date().toISOString(),deck:draft});localStorage.setItem('handdeck-lorcana-saved-decks-v1',JSON.stringify(library));}
   const openedId=read('handdeck-studio-open-id',null);if(openedId)localStorage.setItem('handdeck-lorcana-active-deck-id',openedId);else localStorage.removeItem('handdeck-lorcana-active-deck-id');localStorage.removeItem('handdeck-studio-open-id');
   localStorage.setItem('handdeck-lorcana-deck-v1',JSON.stringify(requested));if(ownerId){localStorage.setItem('handdeck-lorcana-draft-owner-id',JSON.stringify(ownerId));localStorage.setItem(`handdeck-lorcana-draft-${ownerId}`,JSON.stringify(requested));}localStorage.removeItem('handdeck-studio-open-request');
  }
  const theme=localStorage.getItem('handdeck-theme')||'light';localStorage.setItem('handdeck-lorcana-theme',theme);document.documentElement.dataset.theme=theme;
 }catch{}
 const activeProfile=()=>{const player=read('handdeck-player-preview-v1',null),session=read('handdeck-local-session-v1',null);return session?.active&&session.userId===player?.id?player:null;};
 const parentOrigin=location.origin==='null'?'*':location.origin;
 const send=data=>{if(parent!==window)parent.postMessage(data,parentOrigin);};
 const context=value=>{
  const theme=value.theme==='dark'?'dark':'light';
  // Use the studio's own toggle so its logo, labels, and color tokens stay consistent.
  if(document.documentElement.dataset.theme!==theme){const toggle=document.getElementById('theme-toggle');if(toggle)toggle.click();else document.documentElement.dataset.theme=theme;}
  const account=document.querySelector('.user-menu-content');if(account){account.replaceChildren();const name=document.createElement('strong'),status=document.createElement('span');name.textContent=value.profile?.name||'Hand Deck Player';status.textContent=value.profile?'Local profile · Google not linked':'Local workspace · Not signed in';account.append(name,status);}
  const summary=document.querySelector('.user-menu summary');if(summary){summary.setAttribute('aria-label','Player preview');summary.title='Player preview';}
  const avatar=document.querySelector('.user-avatar');if(avatar){avatar.replaceChildren();if(['hello','win','peek'].includes(value.profile?.mascot)){const image=document.createElement('img');image.src='../../Handdeck-Player-Platform/assets/handdeck-spirit-'+value.profile.mascot+'.webp';image.alt='';image.style.cssText='width:100%;height:100%;object-fit:cover;border-radius:50%';avatar.append(image);}else avatar.textContent='T';}
 };
 window.addEventListener('message',event=>{if(event.source!==parent||(location.origin!=='null'&&event.origin!==location.origin))return;if(event.data?.type==='handdeck-context')context(event.data);if(event.data?.type==='handdeck-theme')context({theme:event.data.theme,profile:activeProfile()});});
 window.addEventListener('DOMContentLoaded',()=>{
  document.documentElement.classList.add('platform-connected');
  const css=document.createElement('link');css.rel='stylesheet';css.href='../../Handdeck-Player-Platform/studio-integration.css';document.head.append(css);
  const brand=document.querySelector('.brand');if(brand){brand.href='../../Handdeck-Player-Platform/index.html#decks';brand.setAttribute('aria-label','Back to My Deck');brand.onclick=e=>{if(parent!==window){e.preventDefault();send({type:'handdeck-return'});}};}
  const exit=document.createElement('a');exit.className='studio-exit';exit.href='../../Handdeck-Player-Platform/index.html#decks';exit.textContent='← My Deck';exit.setAttribute('aria-label','Exit Studio and return to My Deck');exit.onclick=e=>{if(parent!==window){e.preventDefault();send({type:'handdeck-return'});}};document.querySelector('.topbar')?.prepend(exit);
  const label=document.querySelector('.local-label');if(label)label.textContent='SHARED LOCAL PREVIEW';
  const toggle=document.getElementById('theme-toggle');if(toggle)toggle.addEventListener('click',()=>{const theme=document.documentElement.dataset.theme;try{localStorage.setItem('handdeck-theme',theme);}catch{}send({type:'handdeck-theme',theme});});
  let currentTheme='light';try{currentTheme=localStorage.getItem('handdeck-theme')||'light';}catch{}context({theme:currentTheme,profile:activeProfile()});
  const detailId=read('handdeck-studio-detail-card-id',null);
  if(typeof detailId==='string'&&detailId){location.hash='cards';let attempts=0;const timer=setInterval(()=>{attempts++;if(typeof window.versoStudioOpenCard==='function'&&window.versoStudioOpenCard(detailId)){localStorage.removeItem('handdeck-studio-detail-card-id');localStorage.removeItem('handdeck-studio-detail-card-name');clearInterval(timer);send({type:'handdeck-studio-ready'});return;}if(attempts>=60){clearInterval(timer);send({type:'handdeck-studio-ready'});}},200);}
  else send({type:'handdeck-studio-ready'});
 });
})();
