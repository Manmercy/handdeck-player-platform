// Synthetic chart data only. Snapshot quotes remain separate from the mock series.
export function quote(card,finish='base'){
  return card.prices.find(p=>p.marketplace==='TP'&&p.variant===finish&&Number.isFinite(p.price))?.price??null;
}
export function mockHistory(card,finish='base',days=30){
  let seed=[...card.id+finish].reduce((n,c)=>(n*31+c.charCodeAt(0))>>>0,19);
  const baseline=quote(card,finish)??(finish==='foil'?4.8:2.4),points=[];
  for(let i=0;i<90;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const value=Math.max(.01,baseline*(.88+.12*i/89+.08*Math.sin(i*.25)+(seed/4294967296-.5)*.07));points.push({day:i-89,value:Number(value.toFixed(2))});}
  return points.slice(-days);
}
export function trend(card,finish='base',days=30){
  const points=mockHistory(card,finish,days),first=points[0]?.value,last=points.at(-1)?.value;
  if(!Number.isFinite(first)||!Number.isFinite(last)||first<=0)return {direction:'flat',percent:0};
  const change=Number((((last-first)/first)*100).toFixed(1));
  return {direction:change>0.5?'up':change< -0.5?'down':'flat',percent:Math.abs(change)};
}
