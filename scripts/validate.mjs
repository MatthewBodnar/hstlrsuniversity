import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { chapters, parts } from '../src/chapters.mjs';
import { swearPattern } from '../src/editorial.mjs';
import { renderPage, renderEntry, wordCount, figureCount, proseWordCount } from '../src/template.mjs';

const root = resolve(import.meta.dirname,'..');
assert(chapters.length>=50,'Expected the expanded chronological reading');
assert(figureCount>=54,'Expected substantially more infographics');
assert.equal(new Set(chapters.map(c=>c.id)).size,chapters.length,'Duplicate chapter anchor');
assert(wordCount>=5704*3 && proseWordCount>=5704*3,'At least three times the previous length, including enough actual prose');
for(const [i,c] of chapters.entries()) {
  assert(/^[a-z][a-z0-9-]+$/.test(c.id),'Invalid chapter slug');
  assert(c.title && c.intro && c.body && c.takeaway && c.sources,'Incomplete chapter');
  assert.equal(parts[c.part].start<=i+1 && parts[c.part].end>=i+1,true,'Incorrect part mapping');
}

// Encoded editorial exclusion list: kept out of the shipped page and reading assets.
// It covers the expressly excluded identities plus the named brands in the source.
const exclusions = JSON.parse(Buffer.from('WyJIdXN0bGVycyBVbml2ZXJzaXR5IiwgIkh1c3RsZXJcdTIwMTlzIFVuaXZlcnNpdHkiLCAiSHVzdGxlcidzIFVuaXZlcnNpdHkiLCAiQW5kcmV3IFRhdGUiLCAiVHJpc3RhbiBUYXRlIiwgIkNvYnJhIFRhdGUiLCAiQ29icmFUYXRlIiwgIlRyaVN0YXIiLCAiVDIgVGVsZXZpc2lvbiIsICJNY0RvbmFsZFx1MjAxOXMiLCAiTWNEb25hbGQncyIsICJCb2VpbmciLCAiQmxhY2tCZXJyeSIsICJQYXlQYWwiLCAiU3RyaXBlIiwgIlNwb3RpZnkiLCAiQXBwbGUgTXVzaWMiLCAiaVR1bmVzIiwgIlNvdW5kQ2xvdWQiLCAiTXlTcGFjZSIsICJDb3N0YSBDb2ZmZWUiLCAiU3RhcmJ1Y2tzIiwgIllvdVR1YmUiLCAiSW5zdGFncmFtIiwgIlRpa1RvayIsICJUd2l0dGVyIiwgIkZhY2Vib29rIiwgIkJ1Z2F0dGkiLCAiRmVycmFyaSIsICJMYW1ib3JnaGluaSIsICJBc3RvbiBNYXJ0aW4iLCAiQmVudGxleSIsICJQb3JzY2hlIiwgIkF1ZGkiLCAiTWVyY2VkZXMiLCAiQk1XIiwgIldvb2x3b3J0aHMiLCAiQmxvY2tidXN0ZXIiLCAiTmV0ZmxpeCIsICJMZWhtYW4gQnJvdGhlcnMiLCAiVGFpIExvcGV6IiwgIldhciBSb29tIl0=','base64').toString('utf8'));
const pages = [['index.html',renderEntry()],['business-fieldguide/index.html',renderPage()]];
for(const [file,expected] of pages) {
  const html=await readFile(resolve(root,file),'utf8');
  assert.equal(html,expected,`Generated page is stale: ${file}. Run npm run build.`);
  const visibleCopy = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,' ').replace(/<[^>]*>/g,' ');
  assert(!/\b(according to (?:the source|the speaker|the transcript)|the (?:speaker|narrator) (?:says|claims|argues|explains)|the source (?:says|claims|argues|describes)|supplied transcripts?|editorial synthesis|self.reported)\b/i.test(visibleCopy),'Keep the page in a direct voice');
  assert(!new RegExp(swearPattern.source,'i').test(visibleCopy),'Mask a vowel in every swearword');
  assert(html.includes('<title>How to Hustle - Business 101</title>'),'Use the requested page title');
  assert.equal((html.match(/<h1\b/g)||[]).length,1,'Each page needs exactly one main heading');
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  assert.equal(new Set(ids).size,ids.length,`Duplicate ID in ${file}`);
  for(const term of exclusions) assert(!new RegExp(`\\b${term.replace(/[.*+?^\${}()|[\]\\]/g,'\\$&')}\\b`,'iu').test(html),`Excluded identity found in ${file}`);
  for(const match of html.matchAll(/\b(?:src|href)="([^"]+)"/g)) {
    const ref=match[1];
    if(ref.startsWith('#')) { assert(ids.includes(ref.slice(1)),`Broken anchor ${ref}`); continue; }
    if(/^(https?:|data:|mailto:)/.test(ref)) continue;
    let path=resolve(dirname(resolve(root,file)),ref.split(/[?#]/)[0]);
    if(ref.endsWith('/')) path=resolve(path,'index.html');
    assert((await stat(path)).isFile(),`Missing local asset ${ref}`);
  }
}
const css=await readFile(resolve(root,'assets/style.css'),'utf8');
for(const match of css.matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g)) assert((await stat(resolve(root,'assets',match[1]))).isFile(),`Missing CSS asset ${match[1]}`);
for(const file of ['assets/reader.js','assets/style.css','assets/infographics.css','assets/favicon.svg']) {
  const source=await readFile(resolve(root,file),'utf8');
  for(const term of exclusions) assert(!new RegExp(`\\b${term.replace(/[.*+?^\${}()|[\]\\]/g,'\\$&')}\\b`,'iu').test(source),`Excluded identity found in ${file}`);
}
assert.equal(5000-4500,500,'Barter example');
assert.equal(Math.round((40/17-1)*100),135,'Bundle arithmetic');
assert.equal(300-100,200,'Project contribution');
assert.equal(Math.round((300-100)/300*100),67,'Project margin');
console.log(`Verified ${chapters.length} chapters, ${figureCount} figures, ${wordCount.toLocaleString('en-GB')} words, identity exclusions, generated output, local assets and chapter links.`);

let lastFile='HU1';const clocks={HU1:-1,HU2:-1};
const seconds=value=>String(value).split(':').reduce((n,x)=>n*60+Number(x),0);
const figureIds=[];
for(const c of chapters){
  assert(['HU1','HU2'].includes(c.source.file),'Unknown source file');
  assert(!(lastFile==='HU2'&&c.source.file==='HU1'),'HU1 must come before HU2');
  assert(seconds(c.source.start)>=clocks[c.source.file],'Preserve the sequence within each file');
  assert(seconds(c.source.end)>=seconds(c.source.start),'Invalid chapter range');
  clocks[c.source.file]=seconds(c.source.start);lastFile=c.source.file;
  const markers=[...c.prose.matchAll(/<!--figure:([^>]+)-->/g)].map(x=>x[1]);
  assert.equal(markers.length,c.figures.length,'Every planned figure must appear');
  assert.equal(new Set(markers).size,markers.length,'Do not duplicate a figure in a chapter');
  figureIds.push(...c.figures.map(x=>x.id));
}
assert.equal(new Set(figureIds).size,figureIds.length,'Figure IDs must be unique');
assert.equal(figureIds.length,figureCount,'Every figure must render');
console.log(`Prose: ${proseWordCount.toLocaleString('en-GB')} words; correct HU1 → HU2 sequence; masked language.`);
