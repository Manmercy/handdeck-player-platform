// One Story export boundary for the local preview and a future same-origin backend.
// Never put Instagram access tokens in browser code or localStorage.
function storyApiAvailable(){const config=window.HANDDECK_STORY_API;return config?.enabled===true&&typeof config.endpoint==='string'&&/^\/api\/[A-Za-z0-9/_-]+$/.test(config.endpoint);}
function instagramStoryButton(kind){return storyApiAvailable()?`<button class="secondary full" data-action="publish-instagram-story" data-story-kind="${kind}">Publish to Instagram Story</button>`:'';}
async function shareStoryFile(blob,filename,title){
 const file=new File([blob],filename,{type:'image/png'});
 if(navigator.canShare?.({files:[file]})&&navigator.share){try{await navigator.share({files:[file],title});return 'shared';}catch(error){if(error.name==='AbortError')return 'cancelled';throw error;}}
 saveStoryBlob(blob,filename);return 'downloaded';
}
async function publishStoryToInstagram(blob,{kind,sourceId}){
 if(!storyApiAvailable())throw Error('Instagram publishing is not connected yet. Use Share image or Download instead.');
 if(!(blob instanceof Blob)||blob.type!=='image/png'||!['profile','badge','deck','post'].includes(kind)||typeof sourceId!=='string'||!sourceId)throw Error('Story image or source is invalid.');
 const body=new FormData();body.append('image',new File([blob],`Hand-Deck-${kind}-Story.png`,{type:'image/png'}));body.append('kind',kind);body.append('sourceId',sourceId);
 const response=await fetch(window.HANDDECK_STORY_API.endpoint,{method:'POST',credentials:'same-origin',headers:{Accept:'application/json'},body});
 const result=await response.json().catch(()=>null);
 if(!response.ok||result?.status!=='published')throw Error(result?.message||'Instagram Story publishing failed.');
 return result;
}
async function publishStoryFromPage(kind){
 if(!signedIn())throw Error('Choose your player profile first.');
 const sources={profile:()=>({blob:profileStoryBlob(),id:profile?.id}),badge:()=>({blob:welcomeStoryBlob(),id:profile?.id}),deck:()=>({blob:deckStoryBlob(),id:viewingDeckId}),post:()=>({blob:postStoryBlob(),id:viewingPostId})};
 if(!Object.hasOwn(sources,kind))throw Error('Unknown Story type.');
 const source=sources[kind](),blob=await source.blob;
 await publishStoryToInstagram(blob,{kind,sourceId:source.id});notify('Instagram Story published.');
}
