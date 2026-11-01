const $ = (s, parent = document) => parent.querySelector(s);
const $$ = (s, parent = document) => [...parent.querySelectorAll(s)];
const chapters = $$('.chapter');
const storage = {
  get(key) { try { return JSON.parse(localStorage.getItem(`fieldnotes:${key}`)); } catch { return null; } },
  set(key, value) { try { localStorage.setItem(`fieldnotes:${key}`, JSON.stringify(value)); } catch {} }
};

// Native dialogs keep keyboard focus inside the open surface and make the page inert.
for (const button of $$('[data-open]')) button.addEventListener('click', () => {
  const modal = document.getElementById(button.dataset.open);
  modal.showModal();
  if (modal.id === 'search-dialog') $('#search-input').focus();
});
for (const button of $$('[data-close]')) button.addEventListener('click', () => button.closest('dialog').close());
for (const dialog of $$('dialog')) {
  dialog.addEventListener('click', (event) => { if (event.target === dialog) {
    const r = dialog.getBoundingClientRect();
    if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close();
  }});
  for (const link of $$('a[href^="#"]', dialog)) link.addEventListener('click', () => dialog.close());
}
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    const openDialog = $('dialog[open]');
    if (openDialog) { event.preventDefault(); openDialog.close(); }
    return;
  }
  const editing = event.target.matches('input, textarea, [contenteditable="true"]');
  if ((event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)) || (event.key === '/' && !editing)) {
    event.preventDefault();
    if (!$('#search-dialog').open) $('#search-dialog').showModal();
    $('#search-input').focus();
  }
});

// Search the actual, pre-rendered reading content; the content is available without JS.
const searchIndex = chapters.map(chapter => ({
  id: chapter.id, title: $('h2', chapter).textContent,
  number: chapter.dataset.number, topic: chapter.dataset.topic,
  text: $$('.chapter-intro, .chapter-content, .principle p:last-child', chapter).map(el => el.innerText).join(' ').replace(/\s+/g, ' ').trim()
}));
function renderSearch() {
  const query = $('#search-input').value.trim();
  const words = query.toLocaleLowerCase().split(/\s+/).filter(Boolean);
  const results = query ? searchIndex.filter(c => words.every(word => `${c.title} ${c.topic} ${c.text}`.toLocaleLowerCase().includes(word))) : searchIndex.slice(0, 6);
  const container = $('#search-results');
  container.replaceChildren();
  $('#search-count').textContent = query ? `${results.length} ${results.length === 1 ? 'chapter' : 'chapters'} found` : 'A few places to begin';
  if (!results.length) {
    const p = document.createElement('p');
    p.className = 'search-empty';
    p.textContent = 'No chapters found. Try “cash”, “pricing”, “team”, or “sales”.';
    container.append(p);
  }
  for (const result of results) {
    const a = document.createElement('a');
    a.href = `#${result.id}`;
    a.className = 'search-result';
    const number = document.createElement('span'); number.className = 'search-number'; number.textContent = result.number;
    const body = document.createElement('span');
    const title = document.createElement('strong'); title.textContent = result.title;
    const snippet = document.createElement('span');
    let start = 0;
    if (words.length) start = Math.max(0, result.text.toLocaleLowerCase().indexOf(words[0]) - 50);
    snippet.textContent = (start ? '…' : '') + result.text.slice(start, start + 150) + '…';
    body.append(title, snippet); a.append(number, body);
    a.addEventListener('click', () => {
      $('#search-dialog').close();
      setTimeout(() => { const heading = $(`#${result.id} h2`); heading.focus({preventScroll:true}); }, 50);
    });
    container.append(a);
  }
}
$('#search-input').addEventListener('input', renderSearch);
renderSearch();

// Reading preferences are local to this browser and never sent anywhere.
function setSize(size) {
  document.documentElement.dataset.readSize = size;
  for (const button of $$('[data-size]')) button.setAttribute('aria-pressed', String(button.dataset.size === size));
  storage.set('type-size', size);
}
setSize(['small','normal','large'].includes(storage.get('type-size')) ? storage.get('type-size') : 'normal');
for (const button of $$('[data-size]')) button.addEventListener('click', () => setSize(button.dataset.size));
$('#focus-toggle').addEventListener('click', () => {
  const focused = document.body.classList.toggle('focus-reading');
  $('#focus-toggle').setAttribute('aria-pressed', String(focused));
  $('#focus-label').textContent = focused ? 'Exit focus' : 'Focus';
  updateReading();
});

// Scroll tracking runs once per animation frame and only stores a compact chapter position.
let active = chapters[0];
let scheduled = false;
let lastSaved = 0;
function updateReading() {
  scheduled = false;
  const reading = $('#reading');
  const top = reading.getBoundingClientRect().top + window.scrollY;
  const height = reading.offsetHeight - window.innerHeight;
  const progress = Math.min(100, Math.max(0, (window.scrollY - top) / Math.max(1, height) * 100));
  document.documentElement.style.setProperty('--read-progress', `${progress}%`);
  $('#progress-number').textContent = `${Math.round(progress)}%`;
  let current = chapters[0];
  for (const chapter of chapters) {
    if (chapter.getBoundingClientRect().top <= window.innerHeight * 0.30) current = chapter;
    else break;
  }
  if (current !== active || !document.body.dataset.tracked) {
    active = current;
    document.body.dataset.tracked = 'true';
    for (const link of $$('.toc-link')) {
      if (link.hash === `#${active.id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
    $('#current-chapter').textContent = `${active.dataset.number} / ${String(chapters.length).padStart(2,'0')}`;
    $('#mobile-current').textContent = $('h2', active).textContent;
  }
  if (window.scrollY >= top - 100 && Date.now() - lastSaved > 1500) {
    storage.set('position', { id: active.id, progress: Math.round(progress) });
    lastSaved = Date.now();
  }
  $('#back-top').hidden = window.scrollY < 1400;
}
window.addEventListener('scroll', () => {
  if (!scheduled) { scheduled = true; requestAnimationFrame(updateReading); }
}, { passive: true });
window.addEventListener('resize', updateReading);
window.addEventListener('load', updateReading);
const saved = storage.get('position');
if (saved && saved.progress > 2 && saved.progress < 99 && chapters.some(c => c.id === saved.id)) {
  const link = $('#resume-link');
  link.href = `#${saved.id}`; link.hidden = false;
  $('#resume-title').textContent = `Continue at chapter ${$(`#${saved.id}`).dataset.number}`;
}
updateReading();

// Small, optional demonstrations support the prose; no assessment or scoring.
for (const group of $$('[data-switcher]')) {
  for (const button of $$('[data-panel]', group)) button.addEventListener('click', () => {
    for (const tab of $$('[data-panel]', group)) tab.setAttribute('aria-pressed', String(tab === button));
    for (const panel of $$('[data-view]', group)) panel.hidden = panel.dataset.view !== button.dataset.panel;
  });
}
const runway = $('#monthly-cost');
if (runway) {
  const update = () => {
    const cost = Number(runway.value);
    $('#cost-value').textContent = `£${cost.toLocaleString('en-GB')}`;
    $('#runway-value').textContent = (10000 / cost).toFixed(1);
    $('#runway-fill').style.width = `${Math.min(100, 10000 / cost / 10 * 100)}%`;
    runway.setAttribute('aria-valuetext', `£${cost.toLocaleString('en-GB')} per month, ${(10000 / cost).toFixed(1)} months of runway`);
  };
  runway.addEventListener('input', update); update();
}
const price = $('#price-per-job');
if (price) {
  const update = () => {
    const p = Number(price.value);
    $('#job-price-value').textContent = `$${p}`;
    $('#job-profit-value').textContent = `$${p - 100}`;
    $('#job-margin-value').textContent = `${Math.round((p - 100) / p * 100)}%`;
    price.setAttribute('aria-valuetext', `$${p} price, $${p - 100} gross contribution before other costs`);
  };
  price.addEventListener('input', update); update();
}
for (const button of $$('[data-copy]')) button.addEventListener('click', async () => {
  const label = $('span', button);
  const url = new URL(location.href); url.hash = button.dataset.copy;
  try {
    await navigator.clipboard.writeText(url.href);
    label.textContent = 'Link copied';
  } catch {
    // The chapter permalink remains a normal anchor when clipboard access is unavailable.
    location.hash = button.dataset.copy;
    label.textContent = 'Link selected';
  }
  setTimeout(() => { label.textContent = 'Copy link'; }, 2200);
});
