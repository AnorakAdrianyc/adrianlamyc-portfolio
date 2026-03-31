/**
 * main.js — Adrian Lam Portfolio
 * Uses @chenglou/pretext for all text measurement & layout
 * Loaded as an ES module (type="module" in HTML)
 */

// ─── Import pretext from esm.sh CDN ──────────────────────────────────────────
import {
  prepare,
  layout,
  prepareWithSegments,
  layoutWithLines,
} from 'https://esm.sh/@chenglou/pretext@0.0.3';
import { initMonitor } from './monitor.js';

// ─── Fetch profile data from our backend API ──────────────────────────────────
const res = await fetch('/api/profile');
const profile = await res.json();

// ─── Small utility: device pixel ratio-aware canvas setup ────────────────────
function setupCanvas(canvas, cssWidth, cssHeight) {
  const dpr = window.devicePixelRatio || 1;
  canvas.width  = cssWidth  * dpr;
  canvas.height = cssHeight * dpr;
  canvas.style.width  = cssWidth  + 'px';
  canvas.style.height = cssHeight + 'px';
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  return ctx;
}

// ─── 1. HERO CANVAS — draw the name using pretext ────────────────────────────
function renderHero() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const containerW = canvas.parentElement.getBoundingClientRect().width
    || canvas.parentElement.offsetWidth
    || 800;

  const FONT_SIZE = Math.max(38, Math.min(88, containerW * 0.098));
  const LINE_H    = FONT_SIZE * 1.18;
  // Use a stack that always resolves — Inter with system fallbacks
  const FONT_FAMILY = `Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;
  const FONT_STR  = `700 ${FONT_SIZE}px ${FONT_FAMILY}`;
  const TEXT      = profile.name; // "Adrian Lam"

  // Use prepareWithSegments + layoutWithLines for precise control
  const prepared = prepareWithSegments(TEXT, FONT_STR);
  const { height, lines } = layoutWithLines(prepared, containerW - 4, LINE_H);

  const canvasH = Math.max(height, LINE_H) + 8;
  const ctx = setupCanvas(canvas, containerW, canvasH);

  // Explicit background so canvas is never transparent
  ctx.fillStyle = '#fafaf8';
  ctx.fillRect(0, 0, containerW, canvasH);

  ctx.font = FONT_STR;
  ctx.fillStyle = '#0f0f0f';

  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i].text, 0, (i + 1) * LINE_H - FONT_SIZE * 0.18);
  }
}

// ─── 2. POPULATE HERO META ────────────────────────────────────────────────────
document.getElementById('hero-tagline').textContent    = profile.tagline;
document.getElementById('hero-university').textContent = profile.university;
document.getElementById('hero-location').textContent   = profile.location;
document.getElementById('github-link').href            = profile.links.github;

// ─── 3. ABOUT SECTION ────────────────────────────────────────────────────────
document.getElementById('about-p1').textContent =
  `I'm a Year ${profile.year} ${profile.university} student based in ${profile.location}. ` +
  `My major combines Green Energy & Smart Technology from the Physics Department ` +
  `with Digital Entertainment — covering AI/IoT, ESG FinTech, renewable energy ` +
  `systems, and engineering applications in society.`;

// Interests
const interestList = document.getElementById('interest-list');
for (const interest of profile.interests) {
  const li = document.createElement('li');
  li.textContent = interest;
  interestList.appendChild(li);
}

// Certifications
const certRow = document.getElementById('cert-row');
for (const cert of profile.certifications) {
  const pill = document.createElement('span');
  pill.className = 'cert-pill';
  pill.textContent = cert;
  certRow.appendChild(pill);
}

// ─── 4. PROJECTS GRID ────────────────────────────────────────────────────────
const grid = document.getElementById('projects-grid');
for (const [i, proj] of profile.projects.entries()) {
  const card = document.createElement('a');
  card.href      = proj.url;
  card.target    = '_blank';
  card.rel       = 'noopener';
  card.className = `project-card fade-up delay-${Math.min(i + 1, 4)}`;

  const nameEl = document.createElement('div');
  nameEl.className = 'project-name';
  nameEl.innerHTML = `${proj.name}<span class="arrow">↗</span>`;

  const descEl = document.createElement('p');
  descEl.className = 'project-desc';
  descEl.textContent = proj.desc;

  const tagsEl = document.createElement('div');
  tagsEl.className = 'project-tags';
  for (const tag of proj.tags) {
    const t = document.createElement('span');
    t.className = 'tag';
    t.textContent = tag;
    tagsEl.appendChild(t);
  }

  card.appendChild(nameEl);
  card.appendChild(descEl);
  card.appendChild(tagsEl);
  grid.appendChild(card);
}

// ─── 5. SKILLS PILLS — widths measured precisely by pretext ──────────────────
function renderSkills() {
  const container = document.getElementById('skills-pills');
  if (!container) return;
  container.innerHTML = '';

  const FONT_STR  = `500 14px Inter, -apple-system, BlinkMacSystemFont, sans-serif`;
  const PAD_H     = 32; // 1rem * 2 sides in px
  const PAD_V     = 9;  // .4rem * 2

  for (const skill of profile.skills) {
    const prepared       = prepare(skill, FONT_STR);
    const { height }     = layout(prepared, 9999, 20);
    const measureCanvas  = document.getElementById('skills-canvas');
    const mctx           = measureCanvas.getContext('2d');
    mctx.font            = FONT_STR;
    const textW          = mctx.measureText(skill).width;

    const pill       = document.createElement('span');
    pill.className   = 'skill-pill';
    pill.textContent = skill;
    // Set explicit pixel width so pill never wraps mid-word
    pill.style.width = Math.ceil(textW + PAD_H) + 'px';
    container.appendChild(pill);
  }
}

// ─── 6. CONTACT LINKS ────────────────────────────────────────────────────────
const contactLinks = document.getElementById('contact-links');
const links = [
  { label: 'GitHub ↗',        href: profile.links.github,          emoji: '' },
  { label: profile.links.email, href: `mailto:${profile.links.email}`, emoji: '' },
];
for (const lk of links) {
  const a = document.createElement('a');
  a.href      = lk.href;
  a.className = 'contact-link';
  a.textContent = lk.label;
  if (lk.href.startsWith('http')) { a.target = '_blank'; a.rel = 'noopener'; }
  contactLinks.appendChild(a);
}

// ─── 7. PRETEXT LIVE DEMO ────────────────────────────────────────────────────
function renderDemo() {
  const input     = document.getElementById('demo-input');
  const widthSlider = document.getElementById('demo-width');
  const sizeSlider  = document.getElementById('demo-size');
  const canvas    = document.getElementById('demo-canvas');
  const statsEl   = document.getElementById('demo-stats');

  if (!input || !canvas) return;

  function draw() {
    const text    = input.value || ' ';
    const maxW    = Number(widthSlider.value);
    const size    = Number(sizeSlider.value);
    const lineH   = Math.round(size * 1.5);
    const fontStr = `${size}px Inter, -apple-system, BlinkMacSystemFont, sans-serif`;

    const t0      = performance.now();
    const prepared = prepareWithSegments(text, fontStr, { whiteSpace: 'pre-wrap' });
    const tPrep    = performance.now() - t0;

    const t1      = performance.now();
    const { height, lineCount, lines } = layoutWithLines(prepared, maxW, lineH);
    const tLayout  = performance.now() - t1;

    const PAD = 16;
    const canvasW = maxW + PAD * 2;
    const canvasH = Math.max(height + PAD * 2, 80);

    const ctx = setupCanvas(canvas, canvasW, canvasH);
    ctx.clearRect(0, 0, canvasW, canvasH);

    // Width boundary line
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = 'rgba(255,255,255,.12)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(maxW + PAD, 0);
    ctx.lineTo(maxW + PAD, canvasH);
    ctx.stroke();
    ctx.setLineDash([]);

    // Render text line by line
    ctx.font      = fontStr;
    ctx.fillStyle = '#fafaf8';

    for (let i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i].text, PAD, PAD + (i + 1) * lineH - size * 0.18);
    }

    // Stats
    statsEl.innerHTML = `
      <span><span class="stat-key">prepare()  </span><span class="stat-val">${tPrep.toFixed(2)} ms</span></span>
      <span><span class="stat-key">layout()   </span><span class="stat-val">${tLayout.toFixed(3)} ms</span></span>
      <span><span class="stat-key">lineCount  </span><span class="stat-val">${lineCount}</span></span>
      <span><span class="stat-key">height     </span><span class="stat-val">${height.toFixed(1)} px</span></span>
      <span><span class="stat-key">font       </span><span class="stat-val">${fontStr}</span></span>
      <span><span class="stat-key">maxWidth   </span><span class="stat-val">${maxW} px</span></span>
    `;
  }

  input.addEventListener('input',  draw);
  widthSlider.addEventListener('input', draw);
  sizeSlider.addEventListener('input',  draw);
  draw(); // initial render
}

// ─── 8. INIT & RESIZE ────────────────────────────────────────────────────────
// Wait for Inter to load before measuring — pretext uses canvas font engine
document.fonts.ready.then(() => {
  renderHero();
  renderSkills();
  renderDemo();
});

// Init monitor (runs in parallel, doesn't need fonts)
initMonitor();

// Re-render hero on resize (debounced)
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    renderHero();
    renderSkills();
  }, 80);
});
