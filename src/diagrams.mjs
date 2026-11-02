import { escapeText as e } from './editorial.mjs';

const item = raw => typeof raw === 'string' ? {label:raw,text:''} : {label:raw.label ?? raw.title ?? '',text:raw.text ?? raw.description ?? '',value:raw.value ?? ''};
const cells = entries => entries.map((raw,i) => {
  const x=item(raw);
  return `<li class="viz-item" style="--item:${i}"><span class="viz-step" aria-hidden="true">${String(i+1).padStart(2,'0')}</span>${x.value!==''?`<strong class="viz-value ${String(x.value).length>15?'viz-value-long':''}">${e(x.value)}</strong>`:''}<h4>${e(x.label)}</h4>${x.text?`<p>${e(x.text)}</p>`:''}</li>`;
}).join('');

export function renderDiagram(figure) {
  const id=figure.id;
  const kind=figure.kind || 'comparison';
  const entries=figure.items || [];
  let html='';
  if(kind==='ledger') {
    const rows=figure.rows || entries;
    html=`<dl class="viz-ledger">${rows.map(row=>{const [label,value]=Array.isArray(row)?row:[row.label,row.value];return `<div><dt>${e(label)}</dt><dd class="${String(value).length>15?'long-value':''}">${e(value)}</dd></div>`;}).join('')}${figure.total?`<div class="viz-ledger-total"><dt>${e(figure.total.label)}</dt><dd>${e(figure.total.value)}</dd></div>`:''}</dl>`;
  } else if(kind==='matrix') {
    const columns=figure.columns || ['Point','What it means'];
    const rows=figure.rows || entries.map(x=>[item(x).label,item(x).text]);
    html=`<div class="viz-table-wrap"><table class="viz-table"><thead><tr>${columns.map(c=>`<th scope="col">${e(c)}</th>`).join('')}</tr></thead><tbody>${rows.map(row=>`<tr>${(Array.isArray(row)?row:[row.label,row.text??row.value]).map((cell,i)=>`<td data-label="${e(columns[i]||'')}">${e(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  } else if(kind==='network') {
    html=`<div class="viz-network"><div class="viz-center">${e(figure.center || figure.title)}</div><ul class="viz-items" style="--columns:${Math.min(entries.length,3)||1}">${cells(entries)}</ul></div>`;
  } else if(kind==='timeline' || kind==='ladder' || kind==='steps') {
    html=`<ol class="viz-items viz-vertical">${cells(entries)}</ol>`;
  } else {
    html=`<ol class="viz-items" style="--columns:${Math.min(entries.length,kind==='flow'?5:3)||1}">${cells(entries)}</ol>`;
  }
  return `<figure class="visual infographic viz-${e(kind)}" id="figure-${e(id)}" aria-labelledby="figure-title-${e(id)}"><div class="figure-top"><span class="eyebrow">See the mechanism</span><span class="figure-index">FIG.</span></div><h3 class="viz-title" id="figure-title-${e(id)}">${e(figure.title)}</h3>${html}${figure.caption?`<figcaption>${e(figure.caption)}</figcaption>`:''}</figure>`;
}

export function renderInteractive(kind,id) {
  const head=title=>`<figure class="visual infographic visual-peach" id="figure-${id}"><div class="figure-top"><span class="eyebrow">Run the numbers</span><span class="figure-index">FIG.</span></div><h3 class="viz-title">${title}</h3>`;
  if(kind==='price')return head('Same work. Different price. Different money.')+`<label class="range-label" for="price-per-job"><span>Website project price</span><output id="job-price-value" for="price-per-job">$300</output></label><input class="range-control" id="price-per-job" type="range" min="150" max="600" step="25" value="300"><div class="range-ends"><span>$150</span><span>$600</span></div><div class="range-results" aria-live="polite"><div><strong id="job-profit-value">$200</strong><small>Left after a fixed $100 delivery cost, before other expenses</small></div><div><strong id="job-margin-value">67%</strong><small>That contribution as a share of the price</small></div></div><figcaption>Start with a $300 website and $100 of delivery. Move the price. Watch what is left. This calculation holds delivery cost fixed; the buyer still has to want the offer.</figcaption></figure>`;
  return head('Cash buys time. How much time have you got?')+`<div class="runway-number" aria-live="polite"><strong id="runway-value">5.0</strong><span>months<br>of runway</span></div><div class="runway-track" aria-hidden="true"><span id="runway-fill" style="width:50%"></span></div><label class="range-label" for="monthly-cost"><span>Monthly cash outflow</span><output id="cost-value" for="monthly-cost">£2,000</output></label><input class="range-control" id="monthly-cost" type="range" min="1000" max="10000" step="250" value="2000"><div class="range-ends"><span>£1,000 / month</span><span>£10,000 / month</span></div><figcaption>Let's say you have £10,000 available after existing commitments, no new income, and steady monthly outflow. Divide the cash by the outflow. That is how long this example can keep going.</figcaption></figure>`;
}
