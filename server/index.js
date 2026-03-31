const express = require('express');
const path = require('path');
const monitor = require('./monitor-data');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from /public
app.use(express.static(path.join(__dirname, '..', 'public')));

// API: return portfolio data as JSON (easy to extend)
app.get('/api/profile', (_req, res) => {
  res.json({
    name: 'Adrian Lam',
    tagline: 'Green Energy · Smart Tech · AI · Physics',
    university: 'HKBU — BSc Green Energy & Smart Technology + Digital Entertainment',
    year: 'Year 2',
    location: 'Hong Kong / Zhuhai',
    links: {
      github: 'https://github.com/AnorakAdrianyc',
      email: 'adrianlamyc@gmail.com',
    },
    skills: [
      'Python', 'JavaScript', 'C++', 'Go', 'HTML/CSS',
      'Machine Learning', 'React', 'Node.js', 'Docker',
      'Renewable Energy Systems', 'IoT', 'Web3',
    ],
    projects: [
      {
        name: 'DeerFlow v2.0',
        desc: 'Self-improving AI research dashboard with Obsidian integration, Asimov safety guardrails, and feedback loop for prompt evolution.',
        tags: ['AI', 'Python', 'GLM-5', 'DeepSeek R1'],
        url: 'https://github.com/AnorakAdrianyc/BNBU-AI-integrated-learning-and-tasks',
      },
      {
        name: 'HK Portfolio Monitor',
        desc: 'Modular long-term market situation monitor for HK/China ESG + energy investments. Tracks rates, capital flows, green finance.',
        tags: ['Finance', 'React', 'Express', 'SQLite'],
        url: 'https://github.com/AnorakAdrianyc/hk-portfolio-situation-monitor',
      },
      {
        name: 'Scrapling',
        desc: 'Adaptive web scraping framework handling everything from single requests to full-scale crawls with anti-detection.',
        tags: ['Python', 'Web Scraping', 'Automation'],
        url: 'https://github.com/AnorakAdrianyc/Scrapling',
      },
      {
        name: 'OpenShell',
        desc: 'Safe, private runtime for autonomous AI agents with sandboxed execution and permission controls.',
        tags: ['AI Agents', 'Security', 'Go'],
        url: 'https://github.com/AnorakAdrianyc/OpenShell',
      },
      {
        name: 'MiroThinker',
        desc: 'Deep research agent optimised for complex research and prediction. MiroThinker-H1 achieves 88.2 on BrowseComp benchmark.',
        tags: ['LLM', 'Research Agent', 'Benchmarks'],
        url: 'https://github.com/AnorakAdrianyc/MiroThinker',
      },
      {
        name: 'Chandra OCR',
        desc: 'OCR model handling complex tables, forms, and handwriting with full layout preservation.',
        tags: ['Computer Vision', 'OCR', 'ML'],
        url: 'https://github.com/AnorakAdrianyc/chandra',
      },
    ],
    interests: [
      'Quantum Computing & Mechanics',
      'Nuclear Fusion (ITER, tokamaks)',
      'Advanced LLM Architectures',
      'Nanotechnology & Medical Applications',
      'Game Development (C++ / Unreal)',
      'Fourier Analysis & Signal Processing',
    ],
    certifications: [
      "Google Introduction to Generative AI",
      "Inspirit AI",
      "HKU FinTech & Big Data",
      "Google Cloud (Introductory)",
    ],
  });
});

// ── Monitor API ─────────────────────────────────────────────────────────────
app.get('/api/monitor', (_req, res) => {
  res.json(monitor);
});

// SPA fallback
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Portfolio server running on http://localhost:${PORT}`);
});
