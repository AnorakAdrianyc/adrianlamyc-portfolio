/**
 * monitor.js — minimalist market situation monitor
 * Fetches from /api/monitor and renders into the #monitor section.
 * Integrated from: AnorakAdrianyc/hk-portfolio-situation-monitor
 */

// Portfolio segment colours (one per position, intentionally muted/distinct)
const PORTFOLIO_COLORS = [
  '#1e3a8a','#1d4ed8','#0e7490','#0369a1',
  '#166534','#15803d','#4d7c0f','#7c3aed',
  '#b45309','#9a3412',
];

const TREND_ARROWS = { up: '↑', down: '↓', neutral: '–' };
const TREND_CLASS  = { up: 'trend-up', down: 'trend-down', neutral: 'trend-neutral' };

async function initMonitor() {
  let data;
  try {
    const res = await fetch('/api/monitor');
    data = await res.json();
  } catch {
    document.getElementById('monitor-headline').textContent =
      'Monitor data unavailable — check API connection.';
    return;
  }

  const { modules, snapshots, portfolio, alerts, summary } = data;

  // ── Week & risk badge ──────────────────────────────────────────────────────
  document.getElementById('monitor-week').textContent = `W/O ${summary.weekOf}`;
  const badge = document.getElementById('monitor-risk-badge');
  badge.textContent = `${summary.portfolioRisk} risk`;
  badge.className = `monitor-risk-badge risk-${summary.portfolioRisk}`;

  // ── Headline ───────────────────────────────────────────────────────────────
  document.getElementById('monitor-headline').textContent = summary.headline;

  // ── Alerts ─────────────────────────────────────────────────────────────────
  const alertsEl = document.getElementById('monitor-alerts');
  for (const a of alerts) {
    const div = document.createElement('div');
    div.className = `m-alert ${a.severity}`;
    div.innerHTML = `
      <span class="m-alert-icon">${a.severity === 'warning' ? '⚠' : 'ℹ'}</span>
      <div>
        <div class="m-alert-title">${esc(a.title)}</div>
        <div class="m-alert-body">${esc(a.body)}</div>
      </div>`;
    alertsEl.appendChild(div);
  }

  // ── KPI strip — pick the 4 most headline-worthy snapshots ──────────────────
  const kpis = [
    snapshots.find(s => s.mod === 'rates_hk_us' && s.label === 'HKMA Base Rate'),
    snapshots.find(s => s.mod === 'rates_hk_us' && s.label === 'US Fed Funds'),
    snapshots.find(s => s.mod === 'capital_flow' && s.label === 'HK IPO Q1 2026'),
    snapshots.find(s => s.mod === 'china_esg_bonds' && s.label === 'Green Bond Issuance 2025'),
  ].filter(Boolean);

  const kpisEl = document.getElementById('monitor-kpis');
  for (const k of kpis) {
    const cell = document.createElement('div');
    cell.className = 'kpi-cell';
    const changeText = k.prev && k.prev !== '—'
      ? `${TREND_ARROWS[k.trend]} prev: ${k.prev}` : '';
    cell.innerHTML = `
      <span class="kpi-label">${esc(k.label)}</span>
      <span class="kpi-value">${esc(k.value)}</span>
      ${changeText ? `<span class="kpi-change ${k.trend}"><span class="trend-arrow">${TREND_ARROWS[k.trend]}</span>${esc(k.prev)}</span>` : ''}
    `;
    kpisEl.appendChild(cell);
  }

  // ── Tabs + Panel ───────────────────────────────────────────────────────────
  const tabsEl  = document.getElementById('monitor-tabs');
  const panelEl = document.getElementById('monitor-panel');
  let activeModId = modules[0].id;

  function renderPanel(modId) {
    activeModId = modId;
    panelEl.innerHTML = '';
    const rows = snapshots.filter(s => s.mod === modId);
    for (const row of rows) {
      const div = document.createElement('div');
      div.className = `panel-row ${TREND_CLASS[row.trend]}`;
      div.innerHTML = `
        <div class="panel-row-left">
          <div class="panel-label">
            <span class="trend-arrow">${TREND_ARROWS[row.trend]}</span>${esc(row.label)}
          </div>
          <div class="panel-value">${esc(row.value)}${row.prev && row.prev !== '—' ? ` <span style="color:var(--ink-faint);font-size:.8em;font-weight:400">← ${esc(row.prev)}</span>` : ''}</div>
          ${row.note ? `<div class="panel-note">${esc(row.note)} <span style="opacity:.5">· ${esc(row.src)}</span></div>` : ''}
        </div>
        <div class="panel-row-right">
          <span class="signal-badge signal-${row.signal}">${row.signal}</span>
          <span class="risk-badge-sm ${row.risk}">${row.risk}</span>
        </div>
      `;
      panelEl.appendChild(div);
    }
  }

  for (const mod of modules) {
    const btn = document.createElement('button');
    btn.className = `m-tab${mod.id === activeModId ? ' active' : ''}`;
    btn.dataset.cat = mod.category;
    btn.textContent = mod.name;
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-selected', mod.id === activeModId ? 'true' : 'false');
    btn.addEventListener('click', () => {
      tabsEl.querySelectorAll('.m-tab').forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      renderPanel(mod.id);
    });
    tabsEl.appendChild(btn);
  }

  renderPanel(activeModId);

  // ── Portfolio allocation bar ────────────────────────────────────────────────
  const barEl    = document.getElementById('portfolio-bar');
  const legendEl = document.getElementById('portfolio-legend');
  const total    = portfolio.reduce((s, p) => s + p.alloc, 0);

  portfolio.forEach((pos, i) => {
    const pct  = (pos.alloc / total) * 100;
    const color = PORTFOLIO_COLORS[i % PORTFOLIO_COLORS.length];

    // Bar segment
    const seg = document.createElement('div');
    seg.className = 'portfolio-segment';
    seg.style.cssText = `width:${pct}%;background:${color};`;
    seg.title = `${pos.name} — ${pos.alloc}%`;
    seg.textContent = pct > 5 ? `${pos.alloc}%` : '';
    barEl.appendChild(seg);

    // Legend item
    const li = document.createElement('div');
    li.className = 'legend-item';
    li.innerHTML = `
      <span class="legend-dot" style="background:${color}"></span>
      <span>${esc(pos.name)}</span>
      <span class="legend-alloc">${pos.alloc}%</span>
      <span class="risk-badge-sm ${pos.risk}" style="font-size:.6rem;padding:.1rem .4rem">${pos.risk}</span>
    `;
    legendEl.appendChild(li);
  });

  // ── Opportunities & Risks ──────────────────────────────────────────────────
  const outlookEl = document.getElementById('monitor-outlook');
  outlookEl.innerHTML = `
    <div>
      <div class="outlook-col-title green">Opportunities</div>
      <div class="outlook-list" id="opp-list"></div>
    </div>
    <div>
      <div class="outlook-col-title red">Key Risks</div>
      <div class="outlook-list" id="risk-list"></div>
    </div>
  `;

  for (const o of summary.opportunities) {
    const item = document.createElement('div');
    item.className = 'outlook-item';
    item.innerHTML = `<span class="outlook-bullet green">+</span><span>${esc(o)}</span>`;
    document.getElementById('opp-list').appendChild(item);
  }
  for (const r of summary.risks) {
    const item = document.createElement('div');
    item.className = 'outlook-item';
    item.innerHTML = `<span class="outlook-bullet red">!</span><span>${esc(r)}</span>`;
    document.getElementById('risk-list').appendChild(item);
  }
}

// HTML escape helper
function esc(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export { initMonitor };
