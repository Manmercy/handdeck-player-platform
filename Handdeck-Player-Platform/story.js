// Native canvas artwork: local-only export, no external image or font requests.
function drawWelcomeStory(canvas,player){
 if(!canvas||!player)return;
 const c=canvas.getContext('2d'),w=1080,h=1920;
 c.clearRect(0,0,w,h);
 const bg=c.createLinearGradient(0,0,w,h);bg.addColorStop(0,'#14152f');bg.addColorStop(.55,'#2f245b');bg.addColorStop(1,'#141830');c.fillStyle=bg;c.fillRect(0,0,w,h);
 const glow=c.createRadialGradient(540,790,50,540,790,650);glow.addColorStop(0,'#7153bb88');glow.addColorStop(1,'#7153bb00');c.fillStyle=glow;c.fillRect(0,100,w,1450);
 c.strokeStyle='#a995ed25';c.lineWidth=2;
 for(const radius of [330,430,560]){c.beginPath();c.arc(540,760,radius,0,Math.PI*2);c.stroke();}
 c.strokeStyle='#a995ed44';c.lineWidth=2;c.beginPath();c.roundRect(42,42,996,1836,38);c.stroke();
 c.textAlign='left';c.fillStyle='#fff';c.font='900 64px system-ui, sans-serif';c.fillText('Hand Deck',90,155);
 c.fillStyle='#bfb6df';c.font='600 19px system-ui, sans-serif';c.fillText('TCG PLAYER PLATFORM',92,198);
 c.textAlign='right';c.fillStyle='#d9fb76';c.font='700 20px system-ui, sans-serif';c.fillText('MY FIRST BADGE',988,165);
 c.textAlign='center';c.fillStyle='#c9b9f1';c.font='700 24px system-ui, sans-serif';c.fillText('A NEW CHAPTER BEGINS',540,355);
 c.fillStyle='#fff';c.font='800 78px system-ui, sans-serif';c.fillText('You belong',540,455);c.fillText('at the table.',540,545);
 // Serrated collectible seal, based on the Platform Welcome badge.
 c.save();c.translate(540,890);c.shadowColor='#8a63ef77';c.shadowBlur=75;c.beginPath();
 for(let i=0;i<64;i++){const angle=(i/64)*Math.PI*2-Math.PI/2,r=i%2===0?228:209;const x=Math.cos(angle)*r,y=Math.sin(angle)*r;i?c.lineTo(x,y):c.moveTo(x,y);}c.closePath();
 const seal=c.createLinearGradient(-230,-230,230,230);seal.addColorStop(0,'#e5ff9b');seal.addColorStop(.5,'#baf069');seal.addColorStop(1,'#81c2a5');c.fillStyle=seal;c.fill();c.shadowBlur=0;
 c.fillStyle='#29214f';c.beginPath();c.arc(0,0,181,0,Math.PI*2);c.fill();c.strokeStyle='#d9fb7680';c.lineWidth=2;c.beginPath();c.arc(0,0,166,0,Math.PI*2);c.stroke();
 c.fillStyle='#d9fb76';c.beginPath();c.moveTo(0,-110);c.quadraticCurveTo(16,-33,70,-28);c.quadraticCurveTo(17,-13,0,54);c.quadraticCurveTo(-17,-13,-70,-28);c.quadraticCurveTo(-16,-33,0,-110);c.fill();c.fillStyle='#e6ddff';c.font='700 22px system-ui, sans-serif';c.fillText('Hand Deck',0,72);c.font='900 39px system-ui, sans-serif';c.fillText('WELCOME',0,118);c.restore();
 c.fillStyle='#d9fb76';c.font='700 22px system-ui, sans-serif';c.fillText('PLAYER PROFILE CREATED',540,1200);
 let nameSize=74;c.font=`800 ${nameSize}px system-ui, sans-serif`;while(c.measureText(player.name).width>890&&nameSize>30){nameSize-=2;c.font=`800 ${nameSize}px system-ui, sans-serif`;}c.fillStyle='#fff';c.fillText(player.name,540,1305);
 const names=(player.games||[]).map(id=>tcgCatalog.find(g=>g.id===id)?.name).filter(Boolean);
 c.font='600 25px system-ui, sans-serif';let rows=[[]],rowWidth=0;
 for(const name of names){const width=c.measureText(name).width+42;if(rowWidth&&rowWidth+width+12>884){rows.push([]);rowWidth=0;}rows.at(-1).push({name,width});rowWidth+=width+12;}
 for(let ri=0;ri<rows.length;ri++){const row=rows[ri],total=row.reduce((a,t)=>a+t.width,0)+Math.max(0,row.length-1)*12;let x=(1080-total)/2;for(const tag of row){const y=1380+ri*60;c.fillStyle='#ffffff10';c.strokeStyle='#c4b3ec44';c.lineWidth=1;c.beginPath();c.roundRect(x,y,tag.width,46,23);c.fill();c.stroke();c.fillStyle='#e3dcf7';c.fillText(tag.name,x+tag.width/2,y+31);x+=tag.width+12;}}
 c.fillStyle='#cabfe4';c.font='500 24px system-ui, sans-serif';c.fillText('Every game. Every card. Every story.',540,1740);
 c.strokeStyle='#a995ed44';c.beginPath();c.moveTo(90,1805);c.lineTo(990,1805);c.stroke();c.fillStyle='#e1d9f5';c.font='700 18px system-ui, sans-serif';c.fillText('PLAY. COLLECT. CONNECT.',540,1845);
}
function welcomeStoryBlob(){return new Promise((resolve,reject)=>{const canvas=document.getElementById('story-canvas');if(!canvas){reject(Error('Open the badge Story first'));return;}canvas.toBlob(blob=>blob?resolve(blob):reject(Error('Image export failed')),'image/png');});}
function saveStoryBlob(blob,filename='Hand-Deck-Welcome-Story.png'){const url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=filename;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);}
async function downloadWelcomeStory(){const blob=await welcomeStoryBlob();saveStoryBlob(blob);notify('Story image downloaded. Add it to your Instagram Story.');}
async function shareWelcomeStory(){const result=await shareStoryFile(await welcomeStoryBlob(),'Hand-Deck-Welcome-Story.png','My Hand Deck Welcome badge');if(result==='downloaded')notify('Story image downloaded. Sharing is not supported on this browser.');}

function drawProfileStory(canvas,player,decks,matches=0){
 if(!canvas||!player)return;
 const c=canvas.getContext('2d'),w=1080,h=1920;
 canvas.dataset.imageReady='false';
 const load=src=>new Promise(resolve=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=()=>resolve(null);image.src=src;});
 const drawCover=(image,x,y,width,height)=>{const scale=Math.max(width/image.width,height/image.height),sourceW=width/scale,sourceH=height/scale;c.drawImage(image,(image.width-sourceW)/2,(image.height-sourceH)/2,sourceW,sourceH,x,y,width,height);};
 Promise.all([load('assets/handdeck-spirit-'+player.mascot+'.webp'),player.background==='custom'&&player.backgroundImage?load(player.backgroundImage):Promise.resolve(null)]).then(([mascotImage,coverImage])=>{
  const palettes={aurora:['#26204d','#44417e','#243966','#a87bf066'],midnight:['#111a33','#1b3150','#0d2237','#6ca8c855'],sunset:['#54325e','#a75a70','#654269','#ffc99777'],mint:['#153e47','#3a7470','#233e60','#a9f9bf55']};
  const colors=palettes[player.background]||palettes.aurora;
  const bg=c.createLinearGradient(0,0,w,h);bg.addColorStop(0,colors[0]);bg.addColorStop(.65,colors[1]);bg.addColorStop(1,colors[2]);c.fillStyle=bg;c.fillRect(0,0,w,h);
  if(coverImage){drawCover(coverImage,0,0,w,h);c.fillStyle='#11162dbb';c.fillRect(0,0,w,h);}
  else{const glow=c.createRadialGradient(850,270,30,850,270,690);glow.addColorStop(0,colors[3]);glow.addColorStop(1,'#ffffff00');c.fillStyle=glow;c.fillRect(0,0,w,h);}
  c.strokeStyle='#ffffff55';c.lineWidth=3;c.beginPath();c.roundRect(45,45,990,1830,42);c.stroke();
  c.fillStyle='#d9fb76';c.fillRect(90,90,64,8);c.fillStyle='#fff';c.textAlign='left';c.font='900 70px system-ui, sans-serif';c.fillText('Hand Deck',90,192);c.fillStyle='#e4def5';c.font='700 21px system-ui, sans-serif';c.fillText('TCG PLAYER PLATFORM',94,230);
  c.textAlign='right';c.fillStyle='#d9fb76';c.font='700 20px system-ui, sans-serif';c.fillText('PLAYER CARD',990,175);c.textAlign='center';
  c.fillStyle='#ffffff16';c.beginPath();c.roundRect(100,330,880,970,48);c.fill();c.strokeStyle='#ffffff50';c.stroke();
  c.fillStyle='#d9fb76';c.font='700 23px system-ui, sans-serif';c.fillText('PLAY · COLLECT · CONNECT',540,405);
  c.fillStyle='#241b4d';c.beginPath();c.roundRect(260,475,560,560,100);c.fill();
  if(mascotImage){c.save();c.beginPath();c.roundRect(260,475,560,560,100);c.clip();drawCover(mascotImage,260,475,560,560);c.restore();}
  c.strokeStyle='#ffffffaa';c.lineWidth=5;c.beginPath();c.roundRect(260,475,560,560,100);c.stroke();
  let size=78;c.font='800 '+size+'px system-ui, sans-serif';while(c.measureText(player.name).width>780&&size>34){size-=2;c.font='800 '+size+'px system-ui, sans-serif';}c.fillStyle='#fff';c.fillText(player.name,540,1160);
  const names=(player.games||[]).map(id=>tcgCatalog.find(game=>game.id===id)?.name).filter(Boolean).slice(0,6);c.font='600 25px system-ui, sans-serif';let row=0,x=0;
  for(const name of names){const label=name.length>22?name.slice(0,20)+'…':name,width=c.measureText(label).width+50;if(x+width>800){row++;x=0;}const left=140+x;c.fillStyle='#ffffff24';c.beginPath();c.roundRect(left,1215+row*58,width,46,23);c.fill();c.fillStyle='#fff';c.fillText(label,left+width/2,1247+row*58);x+=width+12;}
  c.fillStyle='#ffffff22';c.beginPath();c.roundRect(100,1360,880,220,28);c.fill();c.fillStyle='#d9fb76';c.font='800 62px system-ui, sans-serif';c.fillText(String(decks),320,1458);c.fillText(String(matches),760,1458);c.fillStyle='#f0eafa';c.font='700 20px system-ui, sans-serif';c.fillText('SAVED DECKS',320,1500);c.fillText('MATCHES',760,1500);
  c.strokeStyle='#ffffff55';c.beginPath();c.moveTo(100,1775);c.lineTo(980,1775);c.stroke();c.fillStyle='#d9fb76';c.font='800 21px system-ui, sans-serif';c.fillText('Hand Deck',540,1830);
  canvas.dataset.imageReady='true';
 }).catch(()=>{canvas.dataset.imageReady='false';});
}
function profileStoryBlob(){return new Promise((resolve,reject)=>{const canvas=document.getElementById('profile-story-canvas');if(!canvas){reject(Error('Open the profile Story first'));return;}const img=canvas.dataset.imageReady;if(img!=='true'){reject(Error('Story image is loading'));return;}canvas.toBlob(blob=>blob?resolve(blob):reject(Error('Image export failed')),'image/png');});}
async function downloadProfileStory(){const blob=await profileStoryBlob();saveStoryBlob(blob,'Hand-Deck-Profile-Story.png');notify('Profile Story image downloaded.');}
async function shareProfileStory(){const result=await shareStoryFile(await profileStoryBlob(),'Hand-Deck-Profile-Story.png','My Hand Deck player card');if(result==='downloaded')notify('Profile Story image downloaded. Sharing is not supported on this browser.');}

async function drawDeckStory(canvas,entry,byId,ownerName){
 if(!canvas||!entry||!byId)return;
 canvas.dataset.imageReady='false';
 const ctx=canvas.getContext('2d'),appearance=deckAppearance(entry.id),theme=deckThemes[appearance.theme],model=deckPreviewModel(entry,byId),rows=model.rows.slice(0,24);
 const load=src=>new Promise(resolve=>{if(!src){resolve(null);return;}const image=new Image();image.onload=()=>resolve(image);image.onerror=()=>resolve(null);image.src=src;});
 const images=await Promise.all([load(appearance.coverImage),...rows.map(row=>load(deckCardImage(row.card)))]);
 const bg=ctx.createLinearGradient(0,0,1080,1920);bg.addColorStop(0,theme.dark);bg.addColorStop(.55,theme.mid);bg.addColorStop(1,theme.dark);ctx.fillStyle=bg;ctx.fillRect(0,0,1080,1920);
 const glow=ctx.createRadialGradient(760,330,30,760,330,650);glow.addColorStop(0,theme.light+'bb');glow.addColorStop(1,theme.light+'00');ctx.fillStyle=glow;ctx.fillRect(0,0,1080,1000);
 ctx.strokeStyle='#ffffff66';ctx.lineWidth=3;ctx.beginPath();ctx.roundRect(40,40,1000,1840,38);ctx.stroke();
 ctx.fillStyle=theme.accent;ctx.fillRect(83,88,70,8);ctx.textAlign='left';ctx.font='900 67px system-ui,sans-serif';ctx.fillStyle='#fff';ctx.fillText('Hand Deck',84,178);ctx.font='750 20px system-ui,sans-serif';ctx.fillStyle='#ffffffcc';ctx.fillText('DECK STUDIO  /  DISNEY LORCANA',88,215);
 ctx.font='800 22px system-ui,sans-serif';ctx.fillStyle=theme.accent;ctx.fillText('PLAYER DECK',85,315);
 let titleSize=72;ctx.font=`900 ${titleSize}px system-ui,sans-serif`;const title=entry.deck.name||'Untitled deck';while(ctx.measureText(title).width>610&&titleSize>38){titleSize-=2;ctx.font=`900 ${titleSize}px system-ui,sans-serif`;}ctx.fillStyle='#fff';ctx.fillText(title,83,405);
 ctx.font='600 25px system-ui,sans-serif';ctx.fillStyle='#ffffffd9';ctx.fillText('Built by '+ownerName,85,460);
 const hero=images[0];ctx.save();ctx.translate(830,360);ctx.rotate(.13);ctx.shadowColor='#060620aa';ctx.shadowBlur=35;ctx.fillStyle=theme.dark;ctx.beginPath();ctx.roundRect(-145,-202,290,405,22);ctx.fill();ctx.shadowBlur=0;ctx.beginPath();ctx.roundRect(-145,-202,290,405,22);ctx.clip();if(hero){const scale=Math.max(290/hero.width,405/hero.height),sourceW=290/scale,sourceH=405/scale;ctx.drawImage(hero,(hero.width-sourceW)/2,(hero.height-sourceH)/2,sourceW,sourceH,-145,-202,290,405);}else{const art=ctx.createLinearGradient(-145,-202,145,203);art.addColorStop(0,theme.mid);art.addColorStop(1,theme.dark);ctx.fillStyle=art;ctx.fillRect(-145,-202,290,405);ctx.strokeStyle=theme.light;ctx.lineWidth=4;for(let i=-5;i<8;i++){ctx.beginPath();ctx.moveTo(-250+i*75,-202);ctx.lineTo(70+i*75,203);ctx.stroke();}ctx.fillStyle='#ffffffdd';ctx.textAlign='center';ctx.font='900 34px system-ui,sans-serif';ctx.fillText('Hand Deck',0,26);ctx.font='700 17px system-ui,sans-serif';ctx.fillText('DECK STUDIO',0,60);ctx.textAlign='left';}ctx.restore();
 ctx.fillStyle='#ffffff21';ctx.beginPath();ctx.roundRect(78,555,924,94,18);ctx.fill();ctx.fillStyle=theme.accent;ctx.font='900 48px system-ui,sans-serif';ctx.fillText(String(model.total),108,617);ctx.fillStyle='#fff';ctx.font='750 19px system-ui,sans-serif';ctx.fillText('CARDS',188,608);ctx.fillText(String(model.rows.length)+' UNIQUE',490,608);ctx.fillText(model.inks.map(ink=>String(ink).toUpperCase()).slice(0,2).join(' + ')||'LORCANA',700,608);
 ctx.fillStyle=theme.accent;ctx.font='800 22px system-ui,sans-serif';ctx.fillText('THE DECK LIST',85,715);
 const width=143,height=200,gapX=22,gapY=40,left=82,top=750,cols=6;
 for(let i=0;i<rows.length;i++){const x=left+(i%cols)*(width+gapX),y=top+Math.floor(i/cols)*(height+gapY),image=images[i+1];ctx.fillStyle='#ffffff22';ctx.beginPath();ctx.roundRect(x,y,width,height,8);ctx.fill();if(image){ctx.save();ctx.beginPath();ctx.roundRect(x,y,width,height,8);ctx.clip();ctx.drawImage(image,x,y,width,height);ctx.restore();}ctx.fillStyle=theme.dark;ctx.beginPath();ctx.roundRect(x+width-42,y-10,48,42,9);ctx.fill();ctx.fillStyle='#fff';ctx.textAlign='center';ctx.font='900 24px system-ui,sans-serif';ctx.fillText(String(rows[i].quantity),x+width-18,y+19);ctx.textAlign='left';}
 if(model.rows.length>24){ctx.fillStyle='#fff';ctx.font='600 23px system-ui,sans-serif';ctx.fillText(`+ ${model.rows.length-24} more unique cards in the full deck`,85,1745);}
 ctx.strokeStyle='#ffffff66';ctx.beginPath();ctx.moveTo(82,1808);ctx.lineTo(998,1808);ctx.stroke();ctx.fillStyle=theme.accent;ctx.font='800 21px system-ui,sans-serif';ctx.fillText('PLAY  ·  COLLECT  ·  CONNECT',84,1851);ctx.textAlign='right';ctx.fillText('Hand Deck',994,1851);
 canvas.dataset.imageReady='true';
}
function deckStoryBlob(){return new Promise((resolve,reject)=>{const canvas=document.getElementById('deck-story-canvas');if(!canvas||canvas.dataset.imageReady!=='true'){reject(Error('Deck Story is still loading'));return;}canvas.toBlob(blob=>blob?resolve(blob):reject(Error('Image export failed')),'image/png');});}
async function downloadDeckStory(){const blob=await deckStoryBlob();saveStoryBlob(blob,'Hand-Deck-Deck-Story.png');notify('Deck Story image downloaded.');}
async function shareDeckStory(){const result=await shareStoryFile(await deckStoryBlob(),'Hand-Deck-Deck-Story.png','My Hand Deck deck');if(result==='downloaded')notify('Story image downloaded. Share it to Instagram Stories from your device.');}

async function drawPostStory(canvas,post,author){
 if(!canvas||!post||!author)return;
 canvas.dataset.imageReady='false';
 const ctx=canvas.getContext('2d'),w=1080,h=1920;
 let image=null;
 if(post.image){image=await new Promise(resolve=>{const picture=new Image();picture.onload=()=>resolve(picture);picture.onerror=()=>resolve(null);picture.src=post.image;});}
 const bg=ctx.createLinearGradient(0,0,w,h);bg.addColorStop(0,'#111746');bg.addColorStop(.55,'#3d3276');bg.addColorStop(1,'#0e375d');ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);
 const glow=ctx.createRadialGradient(760,310,30,760,310,730);glow.addColorStop(0,'#eb79e255');glow.addColorStop(1,'#eb79e200');ctx.fillStyle=glow;ctx.fillRect(0,0,w,1200);
 ctx.strokeStyle='#ffffff55';ctx.lineWidth=3;ctx.beginPath();ctx.roundRect(42,42,996,1836,40);ctx.stroke();
 ctx.textAlign='left';ctx.fillStyle='#fff';ctx.font='900 72px system-ui, sans-serif';ctx.fillText('Hand Deck',90,165);ctx.fillStyle='#e7daf9';ctx.font='700 24px system-ui, sans-serif';ctx.fillText(post.type==='match'?'MATCH STORY':'PLAYER MOMENT',94,205);
 ctx.fillStyle='#ffffff20';ctx.beginPath();ctx.roundRect(80,265,920,1180,30);ctx.fill();
 if(image){
  // Contain preserves the uploaded image's aspect ratio. The surrounding frame
  // absorbs any empty space; no source pixels are cropped or stretched.
  const box={x:110,y:292,width:860,height:1125},scale=Math.min(box.width/image.width,box.height/image.height),drawWidth=image.width*scale,drawHeight=image.height*scale;
  ctx.fillStyle='#10142d';ctx.beginPath();ctx.roundRect(box.x,box.y,box.width,box.height,18);ctx.fill();
  ctx.drawImage(image,box.x+(box.width-drawWidth)/2,box.y+(box.height-drawHeight)/2,drawWidth,drawHeight);
 }else{
  ctx.textAlign='center';ctx.fillStyle='#ffffff12';ctx.font='900 255px system-ui, sans-serif';ctx.fillText('✦',540,890);ctx.fillStyle='#fff';ctx.font='900 72px system-ui, sans-serif';ctx.fillText(post.type==='match'?'MATCH RECORDED':'A MOMENT',540,1010);ctx.textAlign='left';
 }
 ctx.fillStyle='#fff';ctx.font='800 42px system-ui, sans-serif';ctx.fillText(author.name.slice(0,35),90,1530);
 if(post.type==='match'&&post.match){ctx.fillStyle='#ffd27d';ctx.font='800 32px system-ui, sans-serif';ctx.fillText(`${gameName(post.match.game)} · ${String(post.match.result).toUpperCase()} · ${post.match.myScore}–${post.match.opponentScore}`,90,1592);}
 const caption=String(post.caption||'').trim(),words=caption.split(/\s+/).filter(Boolean);ctx.fillStyle='#f6f2ff';ctx.font='600 31px system-ui, sans-serif';let line='',y=post.type==='match'?1660:1600;
 for(const word of words){const next=line?line+' '+word:word;if(ctx.measureText(next).width>890&&line){ctx.fillText(line,90,y);y+=43;line=word;if(y>1770)break;}else line=next;}
 if(line&&y<=1770)ctx.fillText(line,90,y);
 ctx.strokeStyle='#ffffff66';ctx.beginPath();ctx.moveTo(90,1812);ctx.lineTo(990,1812);ctx.stroke();ctx.fillStyle='#ffd27d';ctx.font='800 21px system-ui, sans-serif';ctx.fillText('DISCOVER · EXPRESS · CONNECT',90,1851);
 canvas.dataset.imageReady='true';
}
function postStoryBlob(){return new Promise((resolve,reject)=>{const canvas=document.getElementById('post-story-canvas');if(!canvas||canvas.dataset.imageReady!=='true'){reject(Error('Story image is still loading. Please try again.'));return;}canvas.toBlob(blob=>blob?resolve(blob):reject(Error('Image export failed')),'image/png');});}
async function downloadPostStory(){const blob=await postStoryBlob();saveStoryBlob(blob,'Hand-Deck-Post-Story.png');notify('Story image downloaded.');}
async function sharePostStory(){const result=await shareStoryFile(await postStoryBlob(),'Hand-Deck-Post-Story.png','Hand Deck Story');if(result==='downloaded')notify('Story image downloaded. Share it to Instagram Stories from your device.');}
