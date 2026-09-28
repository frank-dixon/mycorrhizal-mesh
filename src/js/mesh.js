/**
 * Mycorrhizal Mesh — canvas renderer for tree↔fungus nutrient trade.
 * Carbon flows tree → fungus; phosphorus and nitrogen flow fungus → tree.
 * Plain JS, no framework. Call Mesh.init / Mesh.setState from app.js.
 */
(function (global) {
  'use strict';

  const COLORS = {
    carbon: '#B87A3A',
    phos: '#0B8A8F',
    nitro: '#3D6A9A',
    tree: '#2F6B4F',
    fungus: '#6B4A8A',
    link: 'rgba(60, 74, 66, 0.22)',
    soil: '#F4EFE4',
    elev: '#FFFBF3',
    ink: '#1C2420',
    mute: '#5C6B62',
  };

  /** @type {HTMLCanvasElement | null} */
  let canvas = null;
  /** @type {CanvasRenderingContext2D | null} */
  let ctx = null;
  let raf = 0;
  let width = 0;
  let height = 0;
  let dpr = 1;
  let t0 = performance.now();
  let reduceMotion = false;

  /** @type {{ mode: 'simple'|'advanced', type: 'am'|'em', season: 'growing'|'dormant' }} */
  let state = { mode: 'simple', type: 'am', season: 'growing' };

  /** @type {{ x: number, y: number, r: number, label: string, kind: 'tree'|'fungus' }[]} */
  let nodes = [];
  /** @type {{ a: number, b: number, nutrient: 'c'|'p'|'n' }[]} */
  let edges = [];
  /** @type {{ edge: number, u: number, speed: number, nutrient: string }[]} */
  let particles = [];

  function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function rebuildGraph() {
    const am = state.type === 'am';
    // Layout: one canopy tree above, fungal partners below in an arc.
    nodes = [
      { x: 0.5, y: 0.28, r: 22, label: am ? 'Host tree' : 'Host tree (EM)', kind: 'tree' },
      { x: 0.22, y: 0.68, r: 16, label: am ? 'AM hyphae' : 'EM mantle', kind: 'fungus' },
      { x: 0.5, y: 0.78, r: 16, label: am ? 'Arbuscule zone' : 'Hartig net', kind: 'fungus' },
      { x: 0.78, y: 0.68, r: 16, label: am ? 'AM partner' : 'EM partner', kind: 'fungus' },
    ];
    edges = [
      { a: 0, b: 1, nutrient: 'c' },
      { a: 0, b: 2, nutrient: 'c' },
      { a: 0, b: 3, nutrient: 'c' },
      { a: 1, b: 0, nutrient: 'p' },
      { a: 2, b: 0, nutrient: 'n' },
      { a: 3, b: 0, nutrient: 'p' },
    ];
    particles = [];
    const dormantSlow = state.season === 'dormant' ? 0.35 : 1;
    edges.forEach((e, i) => {
      const count = state.mode === 'advanced' ? 5 : 3;
      for (let k = 0; k < count; k++) {
        particles.push({
          edge: i,
          u: Math.random(),
          speed: (0.00035 + Math.random() * 0.00045) * dormantSlow,
          nutrient: e.nutrient,
        });
      }
    });
  }

  function resize() {
    if (!canvas || !ctx) return;
    const parent = canvas.parentElement || canvas;
    const rect = parent.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = Math.max(320, rect.width);
    height = Math.max(280, rect.height);
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function nutrientColor(n) {
    if (n === 'c') return COLORS.carbon;
    if (n === 'p') return COLORS.phos;
    return COLORS.nitro;
  }

  function draw(now) {
    if (!ctx) return;
    const elapsed = now - t0;
    ctx.clearRect(0, 0, width, height);

    // Soft soil vignette
    const g = ctx.createRadialGradient(width * 0.5, height * 0.45, 40, width * 0.5, height * 0.5, Math.max(width, height) * 0.65);
    g.addColorStop(0, COLORS.elev);
    g.addColorStop(1, COLORS.soil);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, width, height);

    // Links
    edges.forEach((e) => {
      const A = nodes[e.a];
      const B = nodes[e.b];
      const ax = A.x * width;
      const ay = A.y * height;
      const bx = B.x * width;
      const by = B.y * height;
      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.quadraticCurveTo((ax + bx) / 2, (ay + by) / 2 + 18, bx, by);
      ctx.strokeStyle = COLORS.link;
      ctx.lineWidth = state.mode === 'advanced' ? 2.2 : 1.6;
      ctx.stroke();
    });

    // Particles along edges
    if (!reduceMotion) {
      particles.forEach((p) => {
        p.u += p.speed * 16;
        if (p.u > 1) p.u -= 1;
        const e = edges[p.edge];
        const A = nodes[e.a];
        const B = nodes[e.b];
        const ax = A.x * width;
        const ay = A.y * height;
        const bx = B.x * width;
        const by = B.y * height;
        const cx = (ax + bx) / 2;
        const cy = (ay + by) / 2 + 18;
        const t = p.u;
        const x = (1 - t) * (1 - t) * ax + 2 * (1 - t) * t * cx + t * t * bx;
        const y = (1 - t) * (1 - t) * ay + 2 * (1 - t) * t * cy + t * t * by;
        ctx.beginPath();
        ctx.arc(x, y, p.nutrient === 'c' ? 3.2 : 2.6, 0, Math.PI * 2);
        ctx.fillStyle = nutrientColor(p.nutrient);
        ctx.globalAlpha = 0.85;
        ctx.fill();
        ctx.globalAlpha = 1;
      });
    } else {
      // Static chevrons mid-edge to show direction without motion
      edges.forEach((e) => {
        const A = nodes[e.a];
        const B = nodes[e.b];
        const x = ((A.x + B.x) / 2) * width;
        const y = ((A.y + B.y) / 2) * height + 8;
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fillStyle = nutrientColor(e.nutrient);
        ctx.fill();
      });
    }

    // Nodes
    nodes.forEach((n) => {
      const x = n.x * width;
      const y = n.y * height;
      ctx.beginPath();
      ctx.arc(x, y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = n.kind === 'tree' ? COLORS.tree : COLORS.fungus;
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgba(28, 36, 32, 0.18)';
      ctx.stroke();

      if (state.mode === 'advanced' && n.kind === 'tree') {
        const pulse = reduceMotion ? 1 : 1 + Math.sin(elapsed / 900) * 0.04;
        ctx.beginPath();
        ctx.arc(x, y, n.r * 1.55 * pulse, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(47, 107, 79, 0.35)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      ctx.fillStyle = COLORS.ink;
      ctx.font = '600 12px "Source Sans 3", system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(n.label, x, y + n.r + 18);
    });

    // Legend chip
    const legendY = height - 28;
    const items = [
      { c: COLORS.carbon, t: 'Carbon → fungus' },
      { c: COLORS.phos, t: 'Phosphorus → tree' },
      { c: COLORS.nitro, t: 'Nitrogen → tree' },
    ];
    let lx = 16;
    ctx.font = '500 11px "Source Sans 3", system-ui, sans-serif';
    ctx.textAlign = 'left';
    items.forEach((it) => {
      ctx.beginPath();
      ctx.arc(lx, legendY, 4, 0, Math.PI * 2);
      ctx.fillStyle = it.c;
      ctx.fill();
      ctx.fillStyle = COLORS.mute;
      ctx.fillText(it.t, lx + 10, legendY + 4);
      lx += ctx.measureText(it.t).width + 28;
    });

    if (state.mode === 'advanced') {
      ctx.fillStyle = COLORS.mute;
      ctx.font = '500 11px "IBM Plex Mono", monospace';
      ctx.textAlign = 'right';
      const seasonLabel = state.season === 'growing' ? 'Season: growing · trade active' : 'Season: dormant · trade slowed';
      const typeLabel = state.type === 'am' ? 'Type: arbuscular (AM)' : 'Type: ecto (EM)';
      ctx.fillText(typeLabel + '  ·  ' + seasonLabel, width - 16, 22);
    }

    raf = requestAnimationFrame(draw);
  }

  function init(el) {
    canvas = el;
    ctx = canvas.getContext('2d');
    reduceMotion = prefersReducedMotion();
    rebuildGraph();
    resize();
    window.addEventListener('resize', resize);
    if (window.matchMedia) {
      window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
        reduceMotion = e.matches;
        rebuildGraph();
      });
    }
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(draw);
  }

  function setState(next) {
    state = Object.assign({}, state, next);
    rebuildGraph();
  }

  global.Mesh = { init: init, setState: setState };
})(typeof window !== 'undefined' ? window : globalThis);
