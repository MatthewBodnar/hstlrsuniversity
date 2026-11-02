import { chapters, parts, figureCount, proseWordCount } from './chapters.mjs';
import { maskHTML, plainText, countWords, escapeText } from './editorial.mjs';

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
const text = plainText;
export const wordCount = chapters.reduce((n,c) => n + countWords(c.body) + countWords(c.intro) + countWords(c.takeaway),0);
export { figureCount, proseWordCount };
const minutes = body => Math.max(1,Math.ceil(text(body).split(/\s+/).filter(Boolean).length/200));
const symbols = {
  steps: '<path d="M5 43h12V31h12V19h12V7h10v44H5Z" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="45" cy="7" r="5" fill="#ac4528"/>',
  circles: '<circle cx="28" cy="28" r="22" fill="none" stroke="currentColor" stroke-width="1.3"/><circle cx="28" cy="28" r="14" fill="none" stroke="currentColor" stroke-width="1.3"/><circle cx="28" cy="28" r="5" fill="#ac4528"/><path d="M28 1v11m0 32v11M1 28h11m32 0h11" stroke="currentColor"/>',
  network: '<path d="m28 6-20 34h40L28 6Zm0 0v34M8 40 38 23M48 40 18 23" fill="none" stroke="currentColor" stroke-width="1.2"/><g fill="#223d31"><circle cx="28" cy="6" r="4"/><circle cx="8" cy="40" r="4"/><circle cx="48" cy="40" r="4"/></g><circle cx="28" cy="29" r="5" fill="#ac4528"/>',
  orbit: '<ellipse cx="28" cy="28" rx="24" ry="12" fill="none" stroke="currentColor" stroke-width="1.3" transform="rotate(-35 28 28)"/><ellipse cx="28" cy="28" rx="24" ry="12" fill="none" stroke="currentColor" stroke-width="1.3" transform="rotate(35 28 28)"/><circle cx="28" cy="28" r="5" fill="#ac4528"/>'
};
const toc = () => parts.map((part,i)=>`<div class="toc-part"><h3>${part.label}. ${part.name}</h3><ol class="toc-list">${chapters.map((c,j)=>c.part===i?`<li><a class="toc-link" href="#${c.id}"><span>${String(j+1).padStart(2,'0')}</span>${escapeText(c.short)}</a></li>`:'').join('')}</ol></div>`).join('');

export function renderPage() {
return maskHTML(`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>How to Hustle - Business 101</title>
  <meta name="description" content="A detailed first-person business read: ${chapters.length} chapters, ${figureCount} infographics, stories, numbers, mistakes, sales, staff, and getting paid.">
  <meta name="theme-color" content="#f7f5ee">
  <meta property="og:type" content="article">
  <meta property="og:title" content="How to Hustle - Business 101">
  <meta property="og:description" content="Money in is a business. Money out is vanity. Get the mechanics into your head, then get something done.">
  <meta property="og:image" content="../assets/operator-still-life.webp">
  <link rel="icon" href="../assets/favicon.svg" type="image/svg+xml">
  <link rel="preload" href="../assets/fonts/field-sans.woff" as="font" type="font/woff" crossorigin>
  <link rel="preload" href="../assets/fonts/field-serif.woff" as="font" type="font/woff" crossorigin>
  <link rel="stylesheet" href="../assets/style.css">
  <link rel="stylesheet" href="../assets/infographics.css">
  <script defer src="../assets/reader.js"></script>
</head>
<body id="top">
<a class="skip-link" href="#reading">Skip to the chapters</a>
<header class="site-header">
  <div class="shell header-inner">${wordmark}
    <nav class="header-nav" aria-label="Main navigation"><a href="#top" class="is-active">Business 101</a><a href="#contents">Chapters</a></nav>
    <div class="header-right"><span class="edition-label">BUSINESS. NO BULLSHIT.</span><button class="search-trigger" data-open="search-dialog" aria-label="Search the field guide">${icon('search')}<span>Find an idea</span><kbd>⌘ K</kbd></button></div>
  </div><div class="header-progress" aria-hidden="true"></div>
</header>
<main id="main">
<div class="shell">
  <div class="breadcrumb"><a href="#contents">Reading collection</a>${icon('chevron')}<span>Field guide 001</span></div>
  <section class="hero" aria-labelledby="hero-title">
    <div class="hero-copy">
      <p class="eyebrow">Business &amp; hustling <span aria-hidden="true">&nbsp;/&nbsp;</span> Vol. 001</p>
      <h1 id="hero-title">How to <em>Hustle</em><span class="hero-course-name">- Business 101</span></h1>
      <p class="hero-lead"><strong>I’ve run businesses. I’ve made money. I’ve made mistakes.</strong> Let me walk you through the deals, the staff, the selling, and the things I had to learn the hard way.</p>
      <div class="hero-meta"><span>The full read</span><span class="dot" aria-hidden="true"></span><span>${chapters.length} chapters</span><span class="dot" aria-hidden="true"></span><span>${figureCount} infographics</span><span class="dot" aria-hidden="true"></span><span>${Math.ceil(wordCount/200)} min read</span></div>
      <div class="hero-actions"><a class="button-primary" href="#${chapters[0].id}">Start reading ${icon('arrow')}</a><a class="text-link" href="#contents">Explore the chapters ${icon('down')}</a></div>
    </div>
    <figure class="hero-art"><img class="hero-photo" src="../assets/operator-still-life.webp" width="1122" height="1402" fetchpriority="high" alt="A sculptural staircase of pale stone, a curved metal ribbon and an orange sphere in warm light."><span class="art-label">SPEED. SALES. CASH.</span><span class="hero-sticker" aria-hidden="true"><strong>${chapters.length}</strong>CHAPTERS</span><figcaption class="art-caption"><span>Get it done. Get paid. Go again.</span>${icon('diagonal')}</figcaption></figure>
  </section>
  <div class="intro-strip" aria-label="The guide in three ideas"><div class="intro-item"><span>01</span><div><strong>Move faster.</strong><p>The idea in your head isn’t a business.</p></div></div><div class="intro-item"><span>02</span><div><strong>Get the money in.</strong><p>No one’s paid you? Start there.</p></div></div><div class="intro-item"><span>03</span><div><strong>Keep going.</strong><p>Yesterday’s win doesn’t do today’s work.</p></div></div></div>
  <section class="contents" id="contents" aria-labelledby="contents-title">
    <div class="section-top"><div><p class="eyebrow">${chapters.length} chapters. Get into it.</p><h2 id="contents-title">Get this<br>into your head.</h2></div><p>Start at the beginning and keep going. The deals, the small decisions, the mistakes, and the examples are all here. Or jump straight to the thing you need to work on.</p></div>
    <div class="chapter-map">${parts.map((p,i)=>`<div class="map-part"><svg class="part-symbol" viewBox="0 0 56 56" aria-hidden="true">${symbols[p.symbol]}</svg><p class="eyebrow">Part ${p.label} <span aria-hidden="true">/</span> ${String(p.start).padStart(2,'0')}–${String(p.end).padStart(2,'0')}</p><h3>${p.name}</h3><p class="part-subtitle">${p.subtitle}</p><ol>${chapters.map((c,j)=>({c,j})).filter(x=>x.c.part===i).slice(0,4).map(({c,j})=>`<li><a href="#${c.id}"><span>${String(j+1).padStart(2,'0')}</span>${escapeText(c.short)}</a></li>`).join('')}</ol><details class="map-more"><summary>The remaining ${p.end-p.start-3} chapters</summary><ol>${chapters.map((c,j)=>({c,j})).filter(x=>x.c.part===i).slice(4).map(({c,j})=>`<li><a href="#${c.id}"><span>${String(j+1).padStart(2,'0')}</span>${escapeText(c.short)}</a></li>`).join('')}</ol></details></div>`).join('')}</div>
  </section>
</div>
<section class="reading-intro" aria-labelledby="reading-intro-title"><div class="shell"><div><p class="eyebrow">Stop sitting on it.</p><h2 id="reading-intro-title">It’s been a week.<br>Where’s your fucking company?</h2></div><p>“I have a business idea.” Good. What have you done with it? Somebody has to make the call, put the offer out, and do the work. That somebody is you.</p></div></section>
<div class="mobile-reading-nav"><button data-open="contents-dialog">${icon('list')} Chapters ${icon('chevron')}</button><span id="mobile-current">${chapters[0].short}</span></div>
<div class="shell reading-layout" id="reading">
  <aside class="reader-sidebar" aria-label="Chapter navigation"><div class="sidebar-title"><p class="eyebrow">On this page</p><span id="current-chapter">01 / ${String(chapters.length).padStart(2,'0')}</span></div><nav aria-label="Reading contents">${toc()}</nav><div class="sidebar-bottom"><span><span class="progress-ring" aria-hidden="true"></span> Reading progress</span><span id="progress-number">0%</span></div></aside>
  <div class="reader-main">
    <a class="resume-link" id="resume-link" href="#${chapters[0].id}" hidden>${icon('book')}<span id="resume-title">Continue reading</span>${icon('arrow')}</a>
    <div class="reading-toolbar"><p class="eyebrow">Read it. Use it.</p><div class="reading-controls"><div class="type-controls" role="group" aria-label="Reading text size"><button type="button" data-size="small" aria-pressed="false" aria-label="Smaller reading text">A</button><button type="button" data-size="normal" aria-pressed="true" aria-label="Default reading text">A</button><button type="button" data-size="large" aria-pressed="false" aria-label="Larger reading text">A</button></div><button class="focus-toggle" id="focus-toggle" aria-pressed="false">${icon('focus')}<span id="focus-label">Focus</span></button></div></div>
    <noscript><p class="noscript-note">All chapters are available below. Search, saved position and adjustable illustrations use scripting.</p></noscript>
    ${chapters.map((c,i)=>`${i===0||chapters[i-1].part!==c.part?`<section class="part-break" id="part-${c.part+1}" aria-labelledby="part-heading-${c.part}"><p class="eyebrow">Part ${parts[c.part].label}</p><h2 id="part-heading-${c.part}">${parts[c.part].name}</h2><p>${parts[c.part].subtitle}</p></section>`:''}<article class="chapter" id="${c.id}" data-number="${String(i+1).padStart(2,'0')}" data-topic="${escapeText(c.short)}" aria-labelledby="heading-${c.id}">${c.legacyAnchors.map(id=>`<span class="chapter-alias" id="${id}" aria-hidden="true"></span>`).join('')}<header class="chapter-heading"><span class="chapter-number" aria-hidden="true">${String(i+1).padStart(2,'0')}</span><div><p class="eyebrow">${parts[c.part].name} <span aria-hidden="true">&nbsp;·&nbsp;</span> ${minutes(c.body+c.intro)} min read</p><h2 id="heading-${c.id}" tabindex="-1">${escapeText(c.title)}</h2></div></header><p class="chapter-intro">${c.intro}</p><div class="chapter-content">${c.body}</div><div class="principle"><p class="eyebrow">Get this in your head.</p><p>${c.takeaway}</p></div><footer class="chapter-footer"><button type="button" class="copy-button" data-copy="${c.id}" aria-label="Copy link to chapter ${i+1}">${icon('link')}<span>Copy link</span></button></footer></article>`).join('\n')}
    <section class="closing-note" aria-labelledby="closing-title"><p class="eyebrow">Enough reading.</p><h2 id="closing-title">You know enough<br>to make <em>one move.</em></h2><p>Call the buyer. Finish the offer. Fix the checkout. Send the advert. <strong>Pick the thing you’ve been putting off and get it done.</strong></p><details class="source-note"><summary>Your reading settings</summary><p>Change the text size, switch to focus mode, or jump to any chapter. Your last chapter and text-size preference stay in this browser. Nothing is sent anywhere.</p></details><a class="text-link closing-link" href="#contents">Return to the chapter map ${icon('up')}</a></section>
  </div>
</div>
</main>
<footer class="site-footer"><div class="shell footer-inner">${wordmark}<p>Business. No bullshit.<br>How to Hustle - Business 101</p><a class="text-link" href="#top">Back to the beginning ${icon('up')}</a></div></footer>
<a class="back-top" id="back-top" href="#top" aria-label="Back to top" hidden>${icon('up')}</a>
<dialog id="search-dialog" aria-labelledby="search-title"><div class="dialog-heading"><h2 id="search-title">Find an idea.</h2><button class="icon-button" data-close aria-label="Close search">${icon('close')}</button></div><label class="search-field" for="search-input">${icon('search')}<input id="search-input" type="search" placeholder="Cash flow, customers, pricing…" autocomplete="off" aria-label="Search chapter text"></label><p class="search-count" id="search-count" aria-live="polite"></p><div id="search-results"></div><p class="dialog-foot">Search the complete guide. Press Esc to return to reading.</p></dialog>
<dialog id="contents-dialog" class="mobile-toc-dialog" aria-labelledby="mobile-contents-title"><div class="dialog-heading"><h2 id="mobile-contents-title">The reading path.</h2><button class="icon-button" data-close aria-label="Close chapter menu">${icon('close')}</button></div><nav aria-label="Mobile chapter navigation">${toc()}</nav></dialog>
</body></html>`);
}

export function renderEntry() {
return maskHTML(`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#f7f5ee"><title>How to Hustle - Business 101</title><meta name="description" content="Read How to Hustle - Business 101: a detailed first-person business read with stories, worked numbers, and infographics."><meta http-equiv="refresh" content="0;url=./business-fieldguide/"><link rel="icon" href="./assets/favicon.svg" type="image/svg+xml"><style>body{background:#f7f5ee;color:#223d31;font:18px/1.7 system-ui,sans-serif;margin:0;min-height:100vh;display:grid;place-items:center}main{max-width:450px;padding:35px}a{color:inherit;text-underline-offset:5px}h1{font-size:40px;letter-spacing:-2px}</style></head><body><main><h1>How to Hustle - Business 101</h1><p>Money in is a business. Money out is vanity. Speed, sales, cash—and getting something done.</p><a href="./business-fieldguide/">Open the field guide →</a></main><script>location.replace('./business-fieldguide/'+location.search+location.hash);</script></body></html>`);
}
