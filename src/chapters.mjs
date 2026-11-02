import { readFileSync } from 'node:fs';
import { renderDiagram, renderInteractive } from './diagrams.mjs';
import { maskWords, maskHTML, countWords } from './editorial.mjs';

const sections = [
  ['hu1-first.json', 'Start the engine', 'Speed, first deals, cheap starts, people, and finding the money.'],
  ['hu1-second.json', 'Sell and take control', 'Closing, cash, speaking, trust, customers, and fixing what goes wrong.'],
  ['hu2-first.json', 'Get paid. Keep moving.', 'Payment, backup routes, leadership, and a harder look at the mechanics.'],
  ['hu2-second.json', 'Make the whole thing work', 'Buyer thinking, staff, loyalty, positioning, and a reason to act now.']
];
const symbols=['steps','circles','network','orbit'];
const labels=['I','II','III','IV'];
let cursor=1;
const slug=value=>maskWords(value).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
export const parts=[];
export const chapters=[];
for(const [partIndex,[file,name,subtitle]] of sections.entries()) {
  const data=JSON.parse(readFileSync(new URL(`./content/${file}`,import.meta.url),'utf8'));
  const start=cursor;
  for(const raw of data.chapters) {
    const figures=raw.figures.map(f=>({...f,id:slug(f.id)}));
    const chapter={...raw,id:`p${partIndex+1}-${slug(raw.id||raw.title)}`,part:partIndex,
      title:maskWords(raw.title),short:maskWords(raw.short||raw.title),intro:maskHTML(raw.intro),
      takeaway:maskHTML(raw.takeaway),prose:maskHTML(raw.body),figures,
      sources:`${raw.source.file} ${raw.source.start}–${raw.source.end}`,
      legacyAnchors:[]};
    chapters.push(chapter);cursor++;
  }
  parts.push({name,subtitle,label:labels[partIndex],symbol:symbols[partIndex],start,end:cursor-1});
}

// Keep old shared chapter links useful after the expansion.
const oldLinks=[
 ['move-with-purpose',/move fast|speed/i],['validate-before-building',/start small|money coming/i],
 ['understand-the-economics',/margin/i],['design-the-exchange',/money moves|follow the money/i],
 ['see-through-the-buyers-eyes',/buyer|sell the need/i],['price-for-a-reason',/price|cheap/i],
 ['make-attention-useful',/attention/i],['trust-and-the-decision',/definite|maybe|pay/i],
 ['earn-the-next-sale',/sell to the people|resell|already trust/i],['choose-the-right-people',/find your people|relationship/i],
 ['build-a-capable-team',/staff|small team/i],['share-the-capability',/knowledge|irreplaceable/i],
 ['invest-in-the-constraint',/before i spend|spend/i],['protect-the-cash',/owner|business.*pay|cash/i],
 ['recover-with-intent',/broke|fixes|excuses/i],['keep-your-options-open',/bridge.*payment|one door/i],
 ['find-the-changing-need',/new need|chaos|old route/i],['keep-building-your-judgment',/next attempt|listen|learn/i]
];
for(const [old,pattern] of oldLinks) (chapters.find(c=>pattern.test(c.title))||chapters[0]).legacyAnchors.push(old);

// Retain two optional numerical illustrations alongside the much larger reading.
const pricing=chapters.find(c=>/\$300/.test(c.prose))||chapters.find(c=>/price/i.test(c.title));
pricing.prose+='\n<p><strong>Run the numbers yourself.</strong> Keep the delivery cost in view while you move the price.</p><!--figure:interactive-price-->';
pricing.figures.push({id:'interactive-price',kind:'interactive-price'});
const reserve=chapters.find(c=>/owner|look after yourself/i.test(c.title))||chapters.find(c=>/spend/i.test(c.title));
reserve.prose+='\n<p>Let me put the cash question into a simple example. <strong>Money buys you time. How much time have you got?</strong></p><!--figure:interactive-runway-->';
reserve.figures.push({id:'interactive-runway',kind:'interactive-runway'});

let figureNumber=0;
for(const chapter of chapters) {
  chapter.body=chapter.prose.replace(/<!--figure:([^>]+)-->/g,(_,rawId)=>{
    const id=slug(rawId);const figure=chapter.figures.find(f=>f.id===id);
    if(!figure)throw new Error(`Missing figure ${rawId} in ${chapter.id}`);
    const number=++figureNumber;
    let rendered=figure.kind.startsWith('interactive-')?renderInteractive(figure.kind.slice(12),id):renderDiagram(figure);
    rendered=rendered.replace('class="visual ',`data-tone="${number%4}" class="visual `).replace('>FIG.</span>',`>FIG. ${String(number).padStart(2,'0')}</span>`);
    return rendered;
  });
}
export const figureCount=figureNumber;
export const proseWordCount=chapters.reduce((n,c)=>n+countWords(c.prose)+countWords(c.intro)+countWords(c.takeaway),0);
