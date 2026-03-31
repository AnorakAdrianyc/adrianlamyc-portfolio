/**
 * monitor-data.js
 * Static snapshot of the HK/China portfolio situation monitor data.
 * Source: AnorakAdrianyc/hk-portfolio-situation-monitor (Week of 2026-03-30)
 * Update this file weekly or connect to live DB for automation.
 */

const WEEK = '2026-03-30';

const modules = [
  { id: 'rates_hk_us',   name: 'HK–US Rates',      category: 'rates'   },
  { id: 'capital_flow',  name: 'Capital Flows',     category: 'capital' },
  { id: 'china_esg_bonds', name: 'China Green Finance', category: 'esg' },
  { id: 'asia_esg',      name: 'Asia ESG',          category: 'esg'     },
  { id: 'europe_esg',    name: 'Europe ESG',        category: 'esg'     },
  { id: 'americas_esg',  name: 'Americas ESG',      category: 'esg'     },
  { id: 'hk_china_tech', name: 'HK–China Tech',     category: 'tech'    },
  { id: 'macro_risk',    name: 'Macro Risk',         category: 'macro'   },
];

const snapshots = [
  // ── RATES ────────────────────────────────────────────────────────────────
  { mod: 'rates_hk_us', label: 'HKMA Base Rate',      value: '4.00%',          prev: '4.25%',          trend: 'down',    signal: 'hold',  risk: 'low',    note: 'Held Jan 29 2026. Next cut H2 2026.',                                          src: 'HKMA Mar 2026' },
  { mod: 'rates_hk_us', label: 'US Fed Funds',         value: '3.50–3.75%',     prev: '3.75–4.00%',     trend: 'down',    signal: 'hold',  risk: 'low',    note: 'Held Mar 19. 1 cut signalled by year-end. Powell term ends May 2026.',          src: 'Fed FOMC Mar 2026' },
  { mod: 'rates_hk_us', label: '1M HIBOR',             value: '3.18%',          prev: '3.45%',          trend: 'down',    signal: 'hold',  risk: 'low',    note: 'Forecast 2.26% by end-2026 if Fed cuts 75bps.',                                src: 'SCMP / Shanghai Commercial Bank' },
  { mod: 'rates_hk_us', label: 'HK–US Spread',         value: '+25 bps',        prev: '+25 bps',        trend: 'neutral', signal: 'hold',  risk: 'low',    note: 'HKD peg 7.75–7.85 stable. HKMA reserves ample.',                              src: 'HKMA LERS' },
  // ── CAPITAL FLOWS ────────────────────────────────────────────────────────
  { mod: 'capital_flow', label: 'Southbound Flows',    value: 'HK$1.4T',        prev: 'HK$800B',        trend: 'up',      signal: 'buy',   risk: 'low',    note: 'Record 2025. China seeking overseas yield vs 1.82% domestic 10Y.',            src: 'KCIF Mar 2026' },
  { mod: 'capital_flow', label: 'China Capital Outflow', value: 'USD 357.7B',   prev: 'USD ~250B',      trend: 'up',      signal: 'watch', risk: 'medium', note: 'PBoC tolerating for RMB internationalisation.',                                src: 'Bloomberg / KCIF' },
  { mod: 'capital_flow', label: 'HK IPO Q1 2026',      value: 'USD 11.64B',     prev: 'USD 2.4B',       trend: 'up',      signal: 'buy',   risk: 'low',    note: '+385% YoY. AI and new economy listings dominating.',                          src: 'Reuters Mar 2026' },
  { mod: 'capital_flow', label: 'WMC Quota',            value: 'RMB 3M/person', prev: 'RMB 1M/person',  trend: 'up',      signal: 'buy',   risk: 'low',    note: 'WMC 2.0 Feb 2024. GBA residents can invest up to RMB 3M in HK.',            src: 'HKMA WMC 2.0' },
  // ── CHINA GREEN ──────────────────────────────────────────────────────────
  { mod: 'china_esg_bonds', label: 'Green Bond Issuance 2025', value: 'USD 140.6B', prev: 'USD 90B', trend: 'up', signal: 'buy', risk: 'low', note: 'Record. China = 20% of global market. +56.5% YoY rebound.',                   src: 'Bloomberg / greenfdc Jan 2026' },
  { mod: 'china_esg_bonds', label: 'Green Finance Outstanding', value: 'USD 6.8T', prev: 'USD 5.8T', trend: 'up', signal: 'buy', risk: 'low', note: 'Bonds + loans + equity. 15th FYP dual-carbon 30-60 goals.',                   src: 'Bloomberg Jan 2026' },
  { mod: 'china_esg_bonds', label: 'ETS Coverage',      value: 'Steel+Cement+Al', prev: 'Power only',   trend: 'up',      signal: 'buy',   risk: 'low',    note: '2025 expansion. Moving to cap-and-trade. CCER credits restarted.',           src: 'Griffith Asia / greenfdc 2026' },
  // ── ASIA ESG ─────────────────────────────────────────────────────────────
  { mod: 'asia_esg', label: 'China Solar/Wind Added',   value: '+951GW / +359GW', prev: '—',            trend: 'up',      signal: 'buy',   risk: 'low',    note: '15th FYP: 25% non-fossil by 2030. Anti-involution reduces overcapacity.',    src: 'greenfdc 15th FYP' },
  { mod: 'asia_esg', label: 'Green H₂ Cost (China)',    value: 'USD 3.70–5.20/kg', prev: 'USD 5–7/kg',  trend: 'down',    signal: 'buy',   risk: 'medium', note: '60% of global electrolyser capacity. IEA: 5x growth 2026–2030.',            src: 'greenfdc / IEA' },
  { mod: 'asia_esg', label: 'Asia Sustainable Investment', value: 'Epicentre shift', prev: 'US/EU led', trend: 'up',      signal: 'buy',   risk: 'low',    note: 'LSEG 2026: Asia new epicentre. India as swing factor.',                     src: 'LSEG Sustainable Trends 2026' },
  // ── EUROPE ESG ───────────────────────────────────────────────────────────
  { mod: 'europe_esg', label: 'EU ETS',                 value: 'Tightening 2026', prev: 'Oversupplied', trend: 'up',      signal: 'watch', risk: 'medium', note: 'MSR cuts effective supply sharply. Maritime sector added.',                  src: 'ING THINK Jan 2026' },
  { mod: 'europe_esg', label: 'EU Utility Green Bonds', value: 'EUR 70B expected', prev: 'EUR 62B',     trend: 'up',      signal: 'watch', risk: 'medium', note: 'Capex at 164% of EBITDA. Cost-plus regulatory shift.',                      src: 'ING THINK Jan 2026' },
  // ── AMERICAS ESG ─────────────────────────────────────────────────────────
  { mod: 'americas_esg', label: 'US Grid — Renewables', value: '90%+ additions',  prev: '~85%',         trend: 'up',      signal: 'hold',  risk: 'medium', note: 'FEOC rules effective 2026 restrict China-linked supply chains.',            src: 'Franklin Templeton 2026' },
  { mod: 'americas_esg', label: 'US Clean Energy Invest.', value: 'Flat H1 → surge H2', prev: 'Rising', trend: 'neutral', signal: 'hold',  risk: 'medium', note: 'H1 paused on IRA uncertainty. H2 surge before credit expiry.',             src: 'Deloitte 2026 Renewables' },
  // ── HK–CHINA TECH ────────────────────────────────────────────────────────
  { mod: 'hk_china_tech', label: 'Hang Seng Tech',      value: '−20% from Oct peak', prev: 'Rally 2025', trend: 'down',   signal: 'watch', risk: 'high',   note: 'VAT fears on internet services. Healthy correction per Morningstar.',        src: 'CNBC / Bloomberg Feb 2026' },
  { mod: 'hk_china_tech', label: 'China AI vs US',      value: 'Near-parity',     prev: 'Significant gap', trend: 'up', signal: 'buy',   risk: 'medium', note: 'Language, image, video parity per Jefferies Nov 2025. DeepSeek + LLMs.',    src: 'Barings Jan 2026' },
  { mod: 'hk_china_tech', label: 'HK Tech IPO Pipeline', value: '+385% QoQ',      prev: 'Depressed',    trend: 'up',      signal: 'buy',   risk: 'medium', note: 'Q1 2026: $11.64B. AI, semiconductor, new economy listings.',               src: 'Reuters Mar 2026' },
  // ── MACRO RISK ───────────────────────────────────────────────────────────
  { mod: 'macro_risk', label: 'US–China Tensions',      value: 'Elevated',        prev: 'Moderate',     trend: 'up',      signal: 'watch', risk: 'high',   note: 'FEOC rules + chip export controls. Entity list expanding.',                 src: 'Yahoo Finance / 247WallSt Mar 2026' },
  { mod: 'macro_risk', label: 'Middle East Energy',     value: 'Active conflict', prev: 'Stable',       trend: 'down',    signal: 'watch', risk: 'high',   note: 'Oil volatility. Accelerating Asia renewables pivot.',                       src: 'S&P Global Mar 2026' },
  { mod: 'macro_risk', label: 'HKD Peg',                value: '7.75–7.85 stable', prev: 'Stable',      trend: 'neutral', signal: 'hold',  risk: 'low',    note: 'HKMA reserves strong. Housing +3% in 2025.',                               src: 'Trading Economics Jan 2026' },
];

const portfolio = [
  { name: 'HKMA Exchange Fund Bills (3M)', region: 'HK',     alloc: 20, risk: 'low',    asset: 'bond',   rationale: 'Risk-free HKD; HIBOR easing tailwind' },
  { name: 'China Sovereign Green Bond',    region: 'China',  alloc: 15, risk: 'low',    asset: 'bond',   rationale: 'Record issuance; <2% coupon; 15th FYP backed' },
  { name: 'HK Southbound Global ETF',      region: 'HK',     alloc: 12, risk: 'low',    asset: 'etf',    rationale: 'Record HK$1.4T southbound capital demand' },
  { name: 'MSCI China ESG Screened ETF',   region: 'China',  alloc: 10, risk: 'low',    asset: 'etf',    rationale: 'Diversified; green taxonomy aligned' },
  { name: 'China Renewable Energy Select', region: 'China',  alloc: 10, risk: 'medium', asset: 'equity', rationale: 'Anti-involution; controls 60-90% of solar/battery chain' },
  { name: 'Asia Clean Energy ETF (ex-CN)', region: 'Asia',   alloc: 8,  risk: 'low',    asset: 'etf',    rationale: 'India/SEA accelerating; Middle East shock tailwind' },
  { name: 'EU Green Sovereign Bonds',      region: 'Europe', alloc: 8,  risk: 'low',    asset: 'bond',   rationale: 'EUR 70B expected; CBAM/CSRD demand drivers' },
  { name: 'HK-listed AI Ecosystem',        region: 'HK',     alloc: 7,  risk: 'medium', asset: 'equity', rationale: 'Post-correction entry; China AI near-parity' },
  { name: 'RMB Panda Bonds (Inv. Grade)',  region: 'China',  alloc: 7,  risk: 'low',    asset: 'bond',   rationale: 'Below-market coupon; RMB internationalisation tailwind' },
  { name: 'Green Hydrogen & Battery ETF',  region: 'Asia',   alloc: 3,  risk: 'medium', asset: 'etf',    rationale: 'China controls 60% of electrolysers; 5x IEA growth' },
];

const alerts = [
  { severity: 'warning', title: 'HSTEC Bear Correction',      body: '−20% from Oct 2025 peak on VAT fears for internet services. Morningstar: healthy correction, no systemic issues.' },
  { severity: 'warning', title: 'FEOC Rules Active 2026',      body: 'China solar/battery supply chain creates compliance risk for US-listed renewable plays. Prefer HK/onshore instruments.' },
  { severity: 'info',    title: 'Fed Chair Transition May 2026', body: "Powell's term ends May. New chair expected more dovish — forecast 75bps total cuts in 2026." },
  { severity: 'info',    title: '15th FYP Green Finance',      body: 'Green finance embedded in 2026–2030 national plan. Dual-carbon 30-60 goals underpin green bond demand.' },
  { severity: 'info',    title: 'HK IPO Record Q1 2026',       body: 'USD 11.64B raised in Q1 — +385% YoY. AI and new economy pipeline driving revival.' },
];

const summary = {
  weekOf: WEEK,
  portfolioRisk: 'medium',
  headline: 'HK rates stable; capital flows surging; green finance accelerating globally. Tech correction healthy. Macro risks elevated but contained.',
  opportunities: [
    'China green bonds — record issuance, policy tailwind, low coupon',
    'HK Southbound ETFs — structural mainland capital demand',
    'HK IPO market revival — AI/new economy pipeline strong',
    'WMC 2.0 — expanded GBA quota for HK product access',
    'Asia renewable acceleration — Middle East shock driving urgency',
    'Green hydrogen — China controls 60%+ of supply chain',
  ],
  risks: [
    'US–China trade tensions / chip export controls',
    'Middle East conflict → oil price spike → inflation surprise',
    'VAT increase risk on Chinese internet/tech companies',
    'Fed policy uncertainty (chair transition May 2026)',
    'China property sector spillover to financial system',
  ],
};

module.exports = { modules, snapshots, portfolio, alerts, summary, WEEK };
