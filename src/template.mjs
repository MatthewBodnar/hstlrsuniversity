import { chapters, parts } from './chapters.mjs';

const paths = {
  arrow: '<path d="M4 12h15m-5-5 5 5-5 5"/>',
  down: '<path d="M12 4v15m-5-5 5 5 5-5"/>',
  up: '<path d="M12 20V5m-5 5 5-5 5 5"/>',
  diagonal: '<path d="M5 19 19 5M6 5h13v13"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4.5 4.5"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
  chevron: '<path d="m9 5 7 7-7 7"/>',
  focus: '<path d="M8 4H4v4m12-4h4v4M4 16v4h4m12-4v4h-4"/>',
  list: '<path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"/>',
  link: '<path d="m10 13 4-4m-5 7-1 1a4 4 0 0 1-6-6l4-4a4 4 0 0 1 6 0m0 3 1-1a4 4 0 0 1 6 6l-4 4a4 4 0 0 1-6 0"/>',
  book: '<path d="M4 4h7a3 3 0 0 1 3 3v14a4 4 0 0 0-4-3H4V4Zm10 3a3 3 0 0 1 3-3h3v14h-2a4 4 0 0 0-4 3"/>'
};
export const icon = name => `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${paths[name] || paths.arrow}</svg>`;
const wordmark = `<a class="wordmark" href="#top" aria-label="Fieldnotes, back to top"><svg viewBox="0 0 28 32" aria-hidden="true"><path d="M3 3v26M8 3h17v6H14v6h9v5h-9v9H8z" fill="currentColor"/><path d="M3 3v26" stroke="#ac4528" stroke-width="2"/></svg>fieldnotes<span aria-hidden="true">.</span></a>`;
const text = html => html.replace(/<[^>]*>/g,' ').replace(/&[^;]+;/g,' ');
export const wordCount = chapters.reduce((n,c) => n + (text(c.body) + ' ' + c.intro + ' ' + c.takeaway).split(/\s+/).filter(Boolean).length,0);
const minutes = body => Math.max(1,Math.ceil(text(body).split(/\s+/).filter(Boolean).length/200));
const symbols = {
  steps: '<path d="M5 43h12V31h12V19h12V7h10v44H5Z" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="45" cy="7" r="5" fill="#ac4528"/>',
  circles: '<circle cx="28" cy="28" r="22" fill="none" stroke="currentColor" stroke-width="1.3"/><circle cx="28" cy="28" r="14" fill="none" stroke="currentColor" stroke-width="1.3"/><circle cx="28" cy="28" r="5" fill="#ac4528"/><path d="M28 1v11m0 32v11M1 28h11m32 0h11" stroke="currentColor"/>',
  network: '<path d="m28 6-20 34h40L28 6Zm0 0v34M8 40 38 23M48 40 18 23" fill="none" stroke="currentColor" stroke-width="1.2"/><g fill="#223d31"><circle cx="28" cy="6" r="4"/><circle cx="8" cy="40" r="4"/><circle cx="48" cy="40" r="4"/></g><circle cx="28" cy="29" r="5" fill="#ac4528"/>',
  orbit: '<ellipse cx="28" cy="28" rx="24" ry="12" fill="none" stroke="currentColor" stroke-width="1.3" transform="rotate(-35 28 28)"/><ellipse cx="28" cy="28" rx="24" ry="12" fill="none" stroke="currentColor" stroke-width="1.3" transform="rotate(35 28 28)"/><circle cx="28" cy="28" r="5" fill="#ac4528"/>'
};
const toc = () => parts.map((part,i)=>`<div class="toc-part"><h3>${part.label}. ${part.name}</h3><ol class="toc-list">${chapters.map((c,j)=>c.part===i?`<li><a class="toc-link" href="#${c.id}"><span>${String(j+1).padStart(2,'0')}</span>${c.short}</a></li>`:'').join('')}</ol></div>`).join('');

export function renderPage() {
return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Business, from the inside — Fieldnotes</title>
  <meta name="description" content="An illustrated business field guide: 18 chapters on starting lean, understanding customers, selling clearly, building a capable team and staying resilient.">
  <meta name="theme-color" content="#f7f5ee">
  <meta property="og:type" content="article">
  <meta property="og:title" content="Business, from the inside — Fieldnotes">
  <meta property="og:description" content="8½ hours of business thinking, distilled into a thoughtful, illustrated field guide.">
  <meta property="og:image" content="../assets/operator-still-life.webp">
  <link rel="icon" href="../assets/favicon.svg" type="image/svg+xml">
  <link rel="preload" href="../assets/fonts/field-sans.woff" as="font" type="font/woff" crossorigin>
  <link rel="preload" href="../assets/fonts/field-serif.woff" as="font" type="font/woff" crossorigin>
  <link rel="stylesheet" href="../assets/style.css">
  <script defer src="../assets/reader.js"></script>
</head>
<body id="top">
<a class="skip-link" href="#reading">Skip to the chapters</a>
<header class="site-header">
  <div class="shell header-inner">${wordmark}
    <nav class="header-nav" aria-label="Main navigation"><a href="#top" class="is-active">The field guide</a><a href="#contents">Chapters</a></nav>
    <div class="header-right"><span class="edition-label">IDEAS WORTH UNDERSTANDING</span><button class="search-trigger" data-open="search-dialog" aria-label="Search the field guide">${icon('search')}<span>Find an idea</span><kbd>⌘ K</kbd></button></div>
  </div><div class="header-progress" aria-hidden="true"></div>
</header>
<main id="main">
<div class="shell">
  <div class="breadcrumb"><a href="#contents">Reading collection</a>${icon('chevron')}<span>Field guide 001</span></div>
  <section class="hero" aria-labelledby="hero-title">
    <div class="hero-copy">
      <p class="eyebrow">The business edition <span aria-hidden="true">&nbsp;/&nbsp;</span> Vol. 001</p>
      <h1 id="hero-title">Build a business.<br>Think like<br>an <em>operator.</em></h1>
      <p class="hero-lead">The ideas behind starting lean, selling with clarity, and building something that lasts. One long conversation, thoughtfully unpacked.</p>
      <div class="hero-meta"><span>8½ hours, distilled</span><span class="dot" aria-hidden="true"></span><span>18 chapters</span><span class="dot" aria-hidden="true"></span><span>${Math.ceil(wordCount/200)} min read</span></div>
      <div class="hero-actions"><a class="button-primary" href="#move-with-purpose">Start reading ${icon('arrow')}</a><a class="text-link" href="#contents">Explore the chapters ${icon('down')}</a></div>
    </div>
    <figure class="hero-art"><img class="hero-photo" src="../assets/operator-still-life.webp" width="1122" height="1402" fetchpriority="high" alt="A sculptural staircase of pale stone, a curved metal ribbon and an orange sphere in warm light."><span class="art-label">SMALL STEPS. STRONG FOUNDATIONS.</span><span class="hero-sticker" aria-hidden="true"><strong>18</strong>CHAPTERS</span><figcaption class="art-caption"><span>Start small. Build deliberately.</span>${icon('diagonal')}</figcaption></figure>
  </section>
  <div class="intro-strip" aria-label="The guide in three ideas"><div class="intro-item"><span>01</span><div><strong>Start with real demand.</strong><p>A clear buyer and a useful promise come first.</p></div></div><div class="intro-item"><span>02</span><div><strong>Understand the mechanics.</strong><p>Cash, customers, people and the work in between.</p></div></div><div class="intro-item"><span>03</span><div><strong>Keep getting better.</strong><p>Turn each attempt into something you can reuse.</p></div></div></div>
  <section class="contents" id="contents" aria-labelledby="contents-title">
    <div class="section-top"><div><p class="eyebrow">The complete reading path</p><h2 id="contents-title">The whole picture.<br>One idea at a time.</h2></div><p>Read from the beginning or follow a question. Each chapter brings the principle, the example, and the practical distinction into focus.</p></div>
    <div class="chapter-map">${parts.map((p,i)=>`<div class="map-part"><svg class="part-symbol" viewBox="0 0 56 56" aria-hidden="true">${symbols[p.symbol]}</svg><p class="eyebrow">Part ${p.label} <span aria-hidden="true">/</span> ${String(p.start).padStart(2,'0')}–${String(p.end).padStart(2,'0')}</p><h3>${p.name}</h3><ol>${chapters.map((c,j)=>c.part===i?`<li><a href="#${c.id}"><span>${String(j+1).padStart(2,'0')}</span>${c.short}</a></li>`:'').join('')}</ol></div>`).join('')}</div>
  </section>
</div>
<section class="reading-intro" aria-labelledby="reading-intro-title"><div class="shell"><div><p class="eyebrow">A little context before we begin</p><h2 id="reading-intro-title">Keep the principle.<br>Look closely at the example.</h2></div><p>This is an edited synthesis of the full supplied discussion. Repeated ideas are brought together. Anecdotes, hypothetical figures and added illustrations are identified as you read.</p></div></section>
<div class="mobile-reading-nav"><button data-open="contents-dialog">${icon('list')} Chapters ${icon('chevron')}</button><span id="mobile-current">Speed &amp; execution</span></div>
<div class="shell reading-layout" id="reading">
  <aside class="reader-sidebar" aria-label="Chapter navigation"><div class="sidebar-title"><p class="eyebrow">On this page</p><span id="current-chapter">01 / 18</span></div><nav aria-label="Reading contents">${toc()}</nav><div class="sidebar-bottom"><span><span class="progress-ring" aria-hidden="true"></span> Reading progress</span><span id="progress-number">0%</span></div></aside>
  <div class="reader-main">
    <a class="resume-link" id="resume-link" href="#move-with-purpose" hidden>${icon('book')}<span id="resume-title">Continue reading</span>${icon('arrow')}</a>
    <div class="reading-toolbar"><p class="eyebrow">The reading room</p><div class="reading-controls"><div class="type-controls" role="group" aria-label="Reading text size"><button type="button" data-size="small" aria-pressed="false" aria-label="Smaller reading text">A</button><button type="button" data-size="normal" aria-pressed="true" aria-label="Default reading text">A</button><button type="button" data-size="large" aria-pressed="false" aria-label="Larger reading text">A</button></div><button class="focus-toggle" id="focus-toggle" aria-pressed="false">${icon('focus')}<span id="focus-label">Focus</span></button></div></div>
    <noscript><p class="noscript-note">All chapters are available below. Search, saved position and adjustable illustrations use scripting.</p></noscript>
    ${chapters.map((c,i)=>`<article class="chapter" id="${c.id}" data-number="${String(i+1).padStart(2,'0')}" data-topic="${c.short}" aria-labelledby="heading-${c.id}"><header class="chapter-heading"><span class="chapter-number" aria-hidden="true">${String(i+1).padStart(2,'0')}</span><div><p class="eyebrow">${parts[c.part].name} <span aria-hidden="true">&nbsp;·&nbsp;</span> ${minutes(c.body+c.intro)} min read</p><h2 id="heading-${c.id}" tabindex="-1">${c.title}</h2></div></header><p class="chapter-intro">${c.intro}</p><div class="chapter-content">${c.body}</div><div class="principle"><p class="eyebrow">The idea to keep</p><p>${c.takeaway}</p></div><footer class="chapter-footer"><button type="button" class="copy-button" data-copy="${c.id}" aria-label="Copy link to chapter ${i+1}">${icon('link')}<span>Copy link</span></button></footer></article>`).join('\n')}
    <section class="closing-note" aria-labelledby="closing-title"><p class="eyebrow">The last page, for now</p><h2 id="closing-title">Good ideas get stronger<br>when they meet reality.</h2><p>Start with something useful. Know what it costs. Keep your promises. Then use what happens to make the next decision better.</p><details class="source-note"><summary>About this reading guide</summary><p>This page synthesizes two supplied transcripts from an approximately 8½-hour business discussion. Their repeated passages and inconsistent lesson numbers have been consolidated into eighteen editorial chapters; the chapter numbers are this guide’s reading order.</p><p>The figures in source anecdotes are self-reported, not independently verified accounts. Hypothetical examples and added calculations are labeled. The guide distinguishes practical principles from deceptive tactics, unsupported absolutes and unsafe operating claims in the discussion. All organizations and individuals have been anonymized.</p><p>The supplied text ends mid-example. No missing conclusion has been invented. The still-life artwork is an original conceptual image; it does not depict a real business or event. Reading preferences and the last chapter are saved only in this browser.</p></details><a class="text-link closing-link" href="#contents">Return to the chapter map ${icon('up')}</a></section>
  </div>
</div>
</main>
<footer class="site-footer"><div class="shell footer-inner">${wordmark}<p>A collection for curious minds.<br>Field guide 001 · The business edition</p><a class="text-link" href="#top">Back to the beginning ${icon('up')}</a></div></footer>
<a class="back-top" id="back-top" href="#top" aria-label="Back to top" hidden>${icon('up')}</a>
<dialog id="search-dialog" aria-labelledby="search-title"><div class="dialog-heading"><h2 id="search-title">Find an idea.</h2><button class="icon-button" data-close aria-label="Close search">${icon('close')}</button></div><label class="search-field" for="search-input">${icon('search')}<input id="search-input" type="search" placeholder="Cash flow, customers, pricing…" autocomplete="off" aria-label="Search chapter text"></label><p class="search-count" id="search-count" aria-live="polite"></p><div id="search-results"></div><p class="dialog-foot">Search the complete guide. Press Esc to return to reading.</p></dialog>
<dialog id="contents-dialog" class="mobile-toc-dialog" aria-labelledby="mobile-contents-title"><div class="dialog-heading"><h2 id="mobile-contents-title">The reading path.</h2><button class="icon-button" data-close aria-label="Close chapter menu">${icon('close')}</button></div><nav aria-label="Mobile chapter navigation">${toc()}</nav></dialog>
</body></html>`;
}

export function renderEntry() {
return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#f7f5ee"><title>Fieldnotes — The business field guide</title><meta name="description" content="Read the illustrated business field guide."><meta http-equiv="refresh" content="0;url=./business-fieldguide/"><link rel="icon" href="./assets/favicon.svg" type="image/svg+xml"><style>body{background:#f7f5ee;color:#223d31;font:18px/1.7 system-ui,sans-serif;margin:0;min-height:100vh;display:grid;place-items:center}main{max-width:450px;padding:35px}a{color:inherit;text-underline-offset:5px}h1{font-size:40px;letter-spacing:-2px}</style></head><body><main><h1>Fieldnotes.</h1><p>A thoughtful, illustrated guide to the mechanics of business.</p><a href="./business-fieldguide/">Open the field guide →</a></main><script>location.replace('./business-fieldguide/'+location.search+location.hash);</script></body></html>`;
}
