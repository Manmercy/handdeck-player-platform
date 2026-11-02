export const colors = {amber:'#edb849',amethyst:'#aa77df',emerald:'#47bb8c',ruby:'#db6174',sapphire:'#59a8df',steel:'#aab4c4'};
export const cardKey = c => `${c.name}\u0000${c.title || ''}`;
export const price = c => { const p=c.prices.filter(x=>x.variant==='base'&&x.marketplace==='TP'&&Number.isFinite(x.price)).map(x=>x.price); return p.length?Math.min(...p):null; };
export function filterCards(cards, f) {
  let result=cards.filter(c=>{
    if(f.query&&!c.searchText.includes(f.query.toLowerCase().trim()))return false;
    if(f.colors.length&&(f.colorMode==='only'?!c.colors.length||!c.colors.every(x=>f.colors.includes(x)):!c.colors.some(x=>f.colors.includes(x))))return false;
    if(f.costs.length&&!f.costs.some(x=>x==='9+'?c.cost>=9:c.cost===Number(x)))return false;
    if(f.inkable!==f.uninkable&&c.ink!==f.inkable)return false;
    if(f.types.length&&!f.types.includes(c.type))return false;
    if(f.set&&c.setId!==f.set)return false;
    if(f.rarity&&c.rarity!==f.rarity)return false;
    if(f.keyword&&!Object.hasOwn(c.keywords||{},f.keyword))return false;
    if(f.characteristic&&!c.characteristics.includes(f.characteristic))return false;
    if(f.franchise&&c.franchise!==f.franchise)return false;
    if(f.finish&&!c.variants.includes(f.finish))return false;
    if(f.lore!==''&&(c.lore==null||c.lore<Number(f.lore)))return false;
    return true;
  });
  result.sort((a,b)=>f.sort==='name'?a.displayName.localeCompare(b.displayName):f.sort==='cost'?a.cost-b.cost||a.displayName.localeCompare(b.displayName):f.sort==='lore'?(b.lore??-1)-(a.lore??-1):f.sort==='price'?(price(a)??Infinity)-(price(b)??Infinity):b.setId.localeCompare(a.setId)||a.ordinal-b.ordinal);
  if(f.group){const seen=new Set();result=result.filter(c=>{const key=cardKey(c);if(seen.has(key))return false;seen.add(key);return true;});}
  return result;
}
export function validateDeck(input, byId){
  if(!input||typeof input!=='object'||!input.cards||typeof input.cards!=='object'||Array.isArray(input.cards))throw Error('Choose a Hand Deck deck JSON file.');
  const entries=Object.entries(input.cards);
  if(entries.length>byId.size)throw Error('This deck contains too many entries.');
  const cards={};for(const [id,n] of entries){if(!byId.has(id)||!Number.isInteger(n)||n<1||n>99)throw Error('The deck contains an unknown card or invalid quantity.');cards[id]=n;}
  const settings=normalizeSettings(input.settings);
  return {name:typeof input.name==='string'?input.name.slice(0,100):'Untitled deck',cards,...(input.settings?{settings}:{})};
}
export function normalizeSettings(s={}){
  return {mode:s?.mode==='free'?'free':'constructed',inks:[...new Set(Array.isArray(s?.inks)?s.inks:[])].filter(x=>Object.hasOwn(colors,x)).slice(0,2)};
}
export function copyLimit(card){
  const text=(card.abilities||[]).map(a=>a.description||'').join(' ');
  if(/any number of cards named/i.test(text))return Infinity;
  const match=text.match(/(?:up to|only have) (\d+) copies/i);
  return match?Number(match[1]):4;
}
export function copyCount(card,deck,byId){return Object.entries(deck.cards).reduce((n,[id,q])=>n+(cardKey(byId.get(id))===cardKey(card)?q:0),0);}
export function countedInks(deck,byId,extra){
  const entries=Object.keys(deck.cards).map(id=>byId.get(id)).filter(Boolean);if(extra)entries.push(extra);
  const hunny=entries.some(c=>c.name==='Christopher Robin'&&c.title==='Hunny Sage');
  return [...new Set(entries.filter(c=>!(hunny&&c.type==='character'&&c.characteristics.includes('hunny')&&c.name!=='Christopher Robin')).flatMap(c=>c.colors))];
}
export function additionIssue(card,deck,byId){
  if((deck.cards[card.id]||0)>=99)return 'Maximum 99 per printing in this workspace';
  const s=normalizeSettings(deck.settings);if(s.mode==='free')return '';
  if(copyCount(card,deck,byId)>=copyLimit(card))return `Limit ${copyLimit(card)} copies across printings`;
  const inks=countedInks(deck,byId,card);
  if(inks.length>2)return 'Constructed decks use up to 2 ink colors';
  if(s.inks.length&&inks.some(x=>!s.inks.includes(x)))return 'Outside your selected deck inks';
  return '';
}
export function deckChecks(deck,byId){
  const s=deckStats(deck,byId),settings=normalizeSettings(deck.settings),inks=countedInks(deck,byId);
  const seen=new Set(),over=[];
  for(const id of Object.keys(deck.cards)){const c=byId.get(id),key=cardKey(c);if(seen.has(key))continue;seen.add(key);if(copyCount(c,deck,byId)>copyLimit(c))over.push(c.displayName);}
  return {total:s.total,minimum:s.total>=60,inks:inks.length<=2,inkCount:inks.length,copies:over.length===0,over,selection:!settings.inks.length||inks.every(x=>settings.inks.includes(x)),free:settings.mode==='free'};
}
export function deckStats(deck,byId){
  let total=0,inkable=0,cost=0;const inks=new Set(),curve=Array(10).fill(0),copies=new Map();
  for(const [id,n] of Object.entries(deck.cards)){const c=byId.get(id);if(!c)continue;total+=n;inkable+=c.ink?n:0;cost+=c.cost*n;c.colors.forEach(x=>inks.add(x));curve[Math.min(9,c.cost)]+=n;const key=cardKey(c);copies.set(key,(copies.get(key)||0)+n);}
  return {total,inkable,average:total?cost/total:0,inks:[...inks],curve,overFour:[...copies.values()].some(n=>n>4)};
}
