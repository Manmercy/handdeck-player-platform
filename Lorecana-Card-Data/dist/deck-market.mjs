import {quote} from './market.mjs';
export function deckValue(deck,byId){
  let total=0,priced=0,missing=0;const types={};
  for(const [id,n] of Object.entries(deck.cards)){const c=byId.get(id);if(!c)continue;const p=quote(c,'base');if(p===null)missing+=n;else{total+=p*n;priced+=n;}types[c.type]=(types[c.type]||0)+n;}
  return {total,priced,missing,types};
}
