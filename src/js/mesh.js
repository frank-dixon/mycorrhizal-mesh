/**
 * Mycorrhizal Mesh — lived-in teaching canvas.
 * Organic strands, diggable nodes, nutrient-path follow.
 * Carbon flows plant → fungus; P and N (and water cues) flow fungus → plant.
 */
(function (global) {
  'use strict';

  const COLORS = {
    carbon: '#B87A3A',
    phos: '#0B8A8F',
    nitro: '#3D6A9A',
    water: '#5A8FB5',
    tree: '#2F6B4F',
    fungus: '#6B4A8A',
    soilNode: '#8B7355',
    link: 'rgba(60, 74, 66, 0.2)',
    linkHot: 'rgba(11, 138, 143, 0.55)',
    soil: '#F4EFE4',
    elev: '#FFFBF3',
    ink: '#1C2420',
    mute: '#5C6B62',
    dim: 'rgba(28, 36, 32, 0.12)',
  };

  /** Catalog keyed by type — real partners, roles, seasonality, soil context */
  const CATALOGS = {
    am: {
      title: 'Arbuscular (endo) mesh',
      nodes: [
        {
          id: 'maple',
          kind: 'tree',
          x: 0.5,
          y: 0.2,
          r: 24,
          label: 'Sugar maple',
          sci: 'Acer saccharum',
          role: 'Host canopy',
          trades: 'Offers photosynthate (sugars) into fine roots; receives phosphorus, some nitrogen, and drought-buffering water via fungal hyphae.',
          season: 'Trade peaks in the leafy growing season. Winter dormancy slows carbon export, but perennial hyphal networks can persist in soil.',
          soil: 'Common on temperate mineral soils; AM associations dominate most herbaceous plants and many hardwoods outside dense EM forests.',
          partners: 'Glomeromycota (arbuscular mycorrhizal fungi)',
        },
        {
          id: 'glomus',
          kind: 'fungus',
          x: 0.18,
          y: 0.58,
          r: 17,
          label: 'Rhizophagus',
          sci: 'Rhizophagus irregularis (AM)',
          role: 'Intraradical + extraradical hyphae',
          trades: 'Scavenges soil phosphate beyond the root depletion zone; delivers P (and some N) into arbuscules inside root cortical cells in exchange for plant carbon.',
          season: 'Active whenever roots are metabolically alive and soil is warm/moist enough for hyphal growth.',
          soil: 'Thrives in many agricultural and woodland soils; spores and hyphal fragments act as inoculum.',
          partners: 'Colonizes ~80% of land plant families as an endomycorrhizal partner.',
        },
        {
          id: 'arb',
          kind: 'fungus',
          x: 0.5,
          y: 0.72,
          r: 18,
          label: 'Arbuscule',
          sci: 'Exchange organ inside root cells',
          role: 'Nutrient handshake',
          trades: 'Highly branched fungal structures push into the root cell without breaking the plant membrane — the main interface where P/N move plant-ward and sugars move fungus-ward.',
          season: 'Arbuscules turn over in days to weeks; colonization rises with active growth.',
          soil: 'Forms only inside living root cortex; not a free-living soil structure.',
          partners: 'Defines arbuscular (endo) mycorrhizae versus ecto mantles.',
        },
        {
          id: 'funnel',
          kind: 'fungus',
          x: 0.82,
          y: 0.58,
          r: 17,
          label: 'Funneliformis',
          sci: 'Funneliformis mosseae (AM)',
          role: 'Extraradical forager',
          trades: 'Extends the effective root surface for immobile nutrients; moves phosphate and can assist with micronutrient and water uptake under mild drought.',
          season: 'Hyphal foraging tracks soil moisture pulses after rain.',
          soil: 'Frequent in grasslands and disturbed soils; wide host range.',
          partners: 'Often co-occurs with Rhizophagus in mixed AM communities.',
        },
        {
          id: 'soil-p',
          kind: 'soil',
          x: 0.28,
          y: 0.88,
          r: 13,
          label: 'Soil P pool',
          sci: 'Orthophosphate / organic P',
          role: 'Immobile nutrient store',
          trades: 'Phosphate diffuses poorly in soil; fungal hyphae bridge the gap plants cannot span alone.',
          season: 'Availability shifts with pH, moisture, and microbial mineralization.',
          soil: 'Clay and organic matter bind P; hyphae explore microsites roots miss.',
          partners: 'Accessed primarily via AM extraradical mycelium in AM systems.',
        },
        {
          id: 'soil-n',
          kind: 'soil',
          x: 0.72,
          y: 0.88,
          r: 13,
          label: 'Soil N pool',
          sci: 'NH₄⁺ / NO₃⁻ / organic N',
          role: 'Mobile–semi-mobile nutrients',
          trades: 'AM fungi can transfer ammonium and some organic N forms; amounts vary by species and soil.',
          season: 'Spring flushes and mineralization pulses raise plant-available N.',
          soil: 'Nitrate moves with water; ammonium is more localized — hyphae still help.',
          partners: 'Shared among roots and AM networks in the rhizosphere.',
        },
      ],
      edges: [
        { a: 'maple', b: 'glomus', nutrient: 'c', path: 'carbon' },
        { a: 'maple', b: 'arb', nutrient: 'c', path: 'carbon' },
        { a: 'maple', b: 'funnel', nutrient: 'c', path: 'carbon' },
        { a: 'glomus', b: 'maple', nutrient: 'p', path: 'phosphorus' },
        { a: 'funnel', b: 'maple', nutrient: 'p', path: 'phosphorus' },
        { a: 'arb', b: 'maple', nutrient: 'n', path: 'nitrogen' },
        { a: 'soil-p', b: 'glomus', nutrient: 'p', path: 'phosphorus' },
        { a: 'soil-p', b: 'funnel', nutrient: 'p', path: 'phosphorus' },
        { a: 'soil-n', b: 'arb', nutrient: 'n', path: 'nitrogen' },
        { a: 'glomus', b: 'arb', nutrient: 'p', path: 'phosphorus' },
      ],
    },
    em: {
      title: 'Ectomycorrhizal mesh',
      nodes: [
        {
          id: 'pine',
          kind: 'tree',
          x: 0.5,
          y: 0.2,
          r: 24,
          label: 'Eastern white pine',
          sci: 'Pinus strobus',
          role: 'EM host canopy',
          trades: 'Exports substantial carbon to fungal partners; receives nitrogen (often organic N), phosphorus, and drought resilience through a sheathing mantle.',
          season: 'Strong summer carbon flow; autumn litter and cooler soils reshape N demand.',
          soil: 'Classic on acidic, sandy, or forest soils where EM trees dominate.',
          partners: 'Basidiomycete and ascomycete EM fungi (not Glomeromycota).',
        },
        {
          id: 'boletus',
          kind: 'fungus',
          x: 0.18,
          y: 0.55,
          r: 17,
          label: 'Suillus',
          sci: 'Suillus spp. (EM)',
          role: 'Pine specialist mantle',
          trades: 'Forms a mantle and Hartig net around fine roots; moves N and P plant-ward while taking sugars. Many Suillus species prefer Pinaceae.',
          season: 'Fruiting often late summer–fall; mycelial trade continues under litter.',
          soil: 'Common in conifer stands; mycelium explores litter and mineral horizons.',
          partners: 'Strong host preference for pines and related conifers.',
        },
        {
          id: 'hartig',
          kind: 'fungus',
          x: 0.5,
          y: 0.7,
          r: 18,
          label: 'Hartig net',
          sci: 'Intercellular exchange lattice',
          role: 'EM exchange organ',
          trades: 'Fungal hyphae weave between root cortical cells (not into them like arbuscules). This is where the carbon-for-nutrient handshake concentrates in EM systems.',
          season: 'Present on active fine roots year-round in mild climates.',
          soil: 'Sits under the fungal mantle on short roots.',
          partners: 'Defines ectomycorrhizae versus arbuscular endomycorrhizae.',
        },
        {
          id: 'lactarius',
          kind: 'fungus',
          x: 0.82,
          y: 0.55,
          r: 17,
          label: 'Lactarius',
          sci: 'Lactarius / Russula group (EM)',
          role: 'Forest generalist EM',
          trades: 'Links multiple trees into broader mycelial networks; contributes to N and P foraging and can shuttle carbon among connected hosts in experimental systems.',
          season: 'Mycelial activity tracks host photosynthesis; mushrooms appear after wet spells.',
          soil: 'Widespread in temperate forests on organic-rich horizons.',
          partners: 'Often forms common mycorrhizal networks among EM trees.',
        },
        {
          id: 'litter',
          kind: 'soil',
          x: 0.28,
          y: 0.88,
          r: 13,
          label: 'Litter / organic N',
          sci: 'Proteins, peptides, amino acids',
          role: 'Organic nitrogen store',
          trades: 'Many EM fungi excel at mining organic N from litter — a key difference from typical AM phosphate focus.',
          season: 'Autumn litterfall feeds winter–spring fungal foraging.',
          soil: 'Forest floor and Oe/Oa horizons are primary EM foraging theaters.',
          partners: 'Accessed by EM extramatrical mycelium.',
        },
        {
          id: 'mineral',
          kind: 'soil',
          x: 0.72,
          y: 0.88,
          r: 13,
          label: 'Mineral P',
          sci: 'Weathered / adsorbed phosphate',
          role: 'Phosphorus store',
          trades: 'EM hyphae still forage mineral P, though organic N foraging is often the headline EM skill.',
          season: 'Steady background supply modulated by moisture.',
          soil: 'Mineral soil below the litter layer.',
          partners: 'Shared with roots and competing microbes.',
        },
      ],
      edges: [
        { a: 'pine', b: 'boletus', nutrient: 'c', path: 'carbon' },
        { a: 'pine', b: 'hartig', nutrient: 'c', path: 'carbon' },
        { a: 'pine', b: 'lactarius', nutrient: 'c', path: 'carbon' },
        { a: 'boletus', b: 'pine', nutrient: 'n', path: 'nitrogen' },
        { a: 'lactarius', b: 'pine', nutrient: 'n', path: 'nitrogen' },
        { a: 'hartig', b: 'pine', nutrient: 'p', path: 'phosphorus' },
        { a: 'litter', b: 'boletus', nutrient: 'n', path: 'nitrogen' },
        { a: 'litter', b: 'lactarius', nutrient: 'n', path: 'nitrogen' },
        { a: 'mineral', b: 'hartig', nutrient: 'p', path: 'phosphorus' },
        { a: 'boletus', b: 'hartig', nutrient: 'n', path: 'nitrogen' },
        { a: 'lactarius', b: 'boletus', nutrient: 'c', path: 'carbon' },
      ],
    },
  };

  let canvas = null;
  let ctx = null;
  let raf = 0;
  let width = 0;
  let height = 0;
  let dpr = 1;
  let t0 = performance.now();
  let reduceMotion = false;
  /** @type {(detail: object|null) => void} */
  let onSelect = function () {};

  let state = { mode: 'simple', type: 'am', season: 'growing', path: 'all' };
  let nodes = [];
  let edges = [];
  let particles = [];
  let selectedId = null;
  let hoverId = null;
  let strandPhase = 0;

  function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function indexOfId(id) {
    for (let i = 0; i < nodes.length; i++) if (nodes[i].id === id) return i;
    return -1;
  }

  function rebuildGraph() {
    const cat = CATALOGS[state.type] || CATALOGS.am;
    nodes = cat.nodes.map(function (n) {
      return Object.assign({}, n);
    });
    edges = cat.edges.map(function (e) {
      return {
        a: indexOfId(e.a),
        b: indexOfId(e.b),
        nutrient: e.nutrient,
        path: e.path,
        idA: e.a,
        idB: e.b,
      };
    }).filter(function (e) {
      return e.a >= 0 && e.b >= 0;
    });

    particles = [];
    const dormantSlow = state.season === 'dormant' ? 0.32 : 1;
    const density = state.mode === 'advanced' ? 6 : 4;
    edges.forEach(function (e, i) {
      if (state.path !== 'all' && e.path !== state.path) return;
      for (let k = 0; k < density; k++) {
        particles.push({
          edge: i,
          u: Math.random(),
          speed: (0.00028 + Math.random() * 0.0005) * dormantSlow,
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
    height = Math.max(320, rect.height);
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function nutrientColor(n) {
    if (n === 'c') return COLORS.carbon;
    if (n === 'p') return COLORS.phos;
    if (n === 'w') return COLORS.water;
    return COLORS.nitro;
  }

  function kindColor(kind) {
    if (kind === 'tree') return COLORS.tree;
    if (kind === 'soil') return COLORS.soilNode;
    return COLORS.fungus;
  }

  function edgeControl(A, B, i) {
    const ax = A.x * width;
    const ay = A.y * height;
    const bx = B.x * width;
    const by = B.y * height;
    const mx = (ax + bx) / 2;
    const my = (ay + by) / 2;
    const dx = bx - ax;
    const dy = by - ay;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    const nx = -dy / len;
    const ny = dx / len;
    const wobble = (i % 2 === 0 ? 1 : -1) * (22 + (i % 3) * 8);
    return { ax: ax, ay: ay, bx: bx, by: by, cx: mx + nx * wobble, cy: my + ny * wobble };
  }

  function pointOnQuad(c, t) {
    const u = 1 - t;
    return {
      x: u * u * c.ax + 2 * u * t * c.cx + t * t * c.bx,
      y: u * u * c.ay + 2 * u * t * c.cy + t * t * c.by,
    };
  }

  function drawOrganicStrand(c, hot, nutrient, elapsed) {
    const steps = 18;
    ctx.beginPath();
    for (let s = 0; s <= steps; s++) {
      const t = s / steps;
      const p = pointOnQuad(c, t);
      const sway = reduceMotion ? 0 : Math.sin(elapsed / 700 + t * 6 + strandPhase) * (hot ? 2.2 : 1.2);
      const x = p.x + sway;
      const y = p.y;
      if (s === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = hot ? nutrientColor(nutrient) : COLORS.link;
    ctx.globalAlpha = hot ? 0.55 : 0.35;
    ctx.lineWidth = hot ? 3.2 : state.mode === 'advanced' ? 2.1 : 1.5;
    ctx.lineCap = 'round';
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Soft under-glow for hot strands
    if (hot) {
      ctx.beginPath();
      for (let s = 0; s <= steps; s++) {
        const t = s / steps;
        const p = pointOnQuad(c, t);
        if (s === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      ctx.strokeStyle = nutrientColor(nutrient);
      ctx.globalAlpha = 0.12;
      ctx.lineWidth = 8;
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
  }

  function edgeIsHot(e) {
    if (state.path !== 'all' && e.path !== state.path) return false;
    if (!selectedId) return state.path !== 'all';
    return e.idA === selectedId || e.idB === selectedId;
  }

  function draw(now) {
    if (!ctx) return;
    const elapsed = now - t0;
    if (!reduceMotion) strandPhase += 0.012;
    ctx.clearRect(0, 0, width, height);

    const g = ctx.createRadialGradient(width * 0.5, height * 0.4, 30, width * 0.5, height * 0.55, Math.max(width, height) * 0.7);
    g.addColorStop(0, COLORS.elev);
    g.addColorStop(0.55, '#F7F1E6');
    g.addColorStop(1, '#EBE4D6');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, width, height);

    // Soft litter texture dots
    ctx.fillStyle = 'rgba(139, 115, 85, 0.06)';
    for (let i = 0; i < 40; i++) {
      const px = (i * 97) % width;
      const py = height * 0.62 + ((i * 53) % Math.floor(height * 0.35));
      ctx.beginPath();
      ctx.arc(px, py, 1.2 + (i % 3) * 0.4, 0, Math.PI * 2);
      ctx.fill();
    }

    edges.forEach(function (e, i) {
      if (state.path !== 'all' && e.path !== state.path && !(selectedId && (e.idA === selectedId || e.idB === selectedId))) {
        // dim non-path edges lightly still drawn
      }
      const A = nodes[e.a];
      const B = nodes[e.b];
      const c = edgeControl(A, B, i);
      const hot = edgeIsHot(e);
      const dimmed = state.path !== 'all' && e.path !== state.path && !hot;
      if (dimmed) {
        ctx.globalAlpha = 0.2;
      }
      drawOrganicStrand(c, hot, e.nutrient, elapsed);
      ctx.globalAlpha = 1;
    });

    if (!reduceMotion) {
      particles.forEach(function (p) {
        const e = edges[p.edge];
        if (!e) return;
        if (state.path !== 'all' && e.path !== state.path) return;
        p.u += p.speed * 16;
        if (p.u > 1) p.u -= 1;
        const c = edgeControl(nodes[e.a], nodes[e.b], p.edge);
        const pt = pointOnQuad(c, p.u);
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, p.nutrient === 'c' ? 3.4 : 2.7, 0, Math.PI * 2);
        ctx.fillStyle = nutrientColor(p.nutrient);
        ctx.globalAlpha = 0.9;
        ctx.fill();
        ctx.globalAlpha = 1;
      });
    }

    nodes.forEach(function (n) {
      const x = n.x * width;
      const y = n.y * height;
      const selected = n.id === selectedId;
      const hovered = n.id === hoverId;

      // Layered depth halo
      ctx.beginPath();
      ctx.arc(x, y + 3, n.r * 1.15, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(28, 36, 32, 0.08)';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x, y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = kindColor(n.kind);
      ctx.fill();
      ctx.lineWidth = selected || hovered ? 3 : 1.5;
      ctx.strokeStyle = selected ? COLORS.phos : 'rgba(28, 36, 32, 0.2)';
      ctx.stroke();

      if (selected || (state.mode === 'advanced' && n.kind === 'tree')) {
        const pulse = reduceMotion ? 1 : 1 + Math.sin(elapsed / 850) * 0.05;
        ctx.beginPath();
        ctx.arc(x, y, n.r * 1.45 * pulse, 0, Math.PI * 2);
        ctx.strokeStyle = selected ? 'rgba(11, 138, 143, 0.45)' : 'rgba(47, 107, 79, 0.3)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      ctx.fillStyle = COLORS.ink;
      ctx.font = '600 12px "Source Sans 3", system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(n.label, x, y + n.r + 16);
      if (state.mode === 'advanced') {
        ctx.font = 'italic 10px "Fraunces", Georgia, serif';
        ctx.fillStyle = COLORS.mute;
        const sci = n.sci.length > 28 ? n.sci.slice(0, 26) + '…' : n.sci;
        ctx.fillText(sci, x, y + n.r + 28);
      }
    });

    // Legend
    const legendY = height - 22;
    const items = [
      { c: COLORS.carbon, t: 'Carbon → fungus' },
      { c: COLORS.phos, t: 'Phosphorus → plant' },
      { c: COLORS.nitro, t: 'Nitrogen → plant' },
    ];
    let lx = 14;
    ctx.font = '500 11px "Source Sans 3", system-ui, sans-serif';
    ctx.textAlign = 'left';
    items.forEach(function (it) {
      ctx.beginPath();
      ctx.arc(lx, legendY, 4, 0, Math.PI * 2);
      ctx.fillStyle = it.c;
      ctx.fill();
      ctx.fillStyle = COLORS.mute;
      ctx.fillText(it.t, lx + 10, legendY + 4);
      lx += ctx.measureText(it.t).width + 26;
    });

    ctx.fillStyle = COLORS.mute;
    ctx.font = '500 10px "IBM Plex Mono", monospace';
    ctx.textAlign = 'right';
    const typeLabel = state.type === 'am' ? 'Endo · arbuscular' : 'Ecto · mantle + Hartig';
    const seasonLabel = state.season === 'growing' ? 'growing' : 'dormant';
    ctx.fillText(typeLabel + ' · ' + seasonLabel + ' · tap a node', width - 14, 18);

    raf = requestAnimationFrame(draw);
  }

  function hitTest(clientX, clientY) {
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    for (let i = nodes.length - 1; i >= 0; i--) {
      const n = nodes[i];
      const nx = n.x * width;
      const ny = n.y * height;
      const dx = x - nx;
      const dy = y - ny;
      if (dx * dx + dy * dy <= (n.r + 8) * (n.r + 8)) return n;
    }
    return null;
  }

  function selectNode(n) {
    selectedId = n ? n.id : null;
    onSelect(n);
  }

  function bindPointer() {
    if (!canvas) return;
    canvas.style.cursor = 'pointer';
    canvas.addEventListener('pointermove', function (e) {
      const n = hitTest(e.clientX, e.clientY);
      hoverId = n ? n.id : null;
      canvas.style.cursor = n ? 'pointer' : 'default';
    });
    canvas.addEventListener('pointerdown', function (e) {
      const n = hitTest(e.clientX, e.clientY);
      if (n) selectNode(n);
      else selectNode(null);
    });
    canvas.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') selectNode(null);
    });
    canvas.setAttribute('tabindex', '0');
  }

  function init(el, opts) {
    canvas = el;
    ctx = canvas.getContext('2d');
    if (opts && typeof opts.onSelect === 'function') onSelect = opts.onSelect;
    reduceMotion = prefersReducedMotion();
    rebuildGraph();
    resize();
    bindPointer();
    window.addEventListener('resize', resize);
    if (window.matchMedia) {
      window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', function (e) {
        reduceMotion = e.matches;
        rebuildGraph();
      });
    }
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(draw);
  }

  function setState(next) {
    const prevType = state.type;
    state = Object.assign({}, state, next);
    if (next.type && next.type !== prevType) selectedId = null;
    rebuildGraph();
  }

  function getCatalogMeta() {
    const cat = CATALOGS[state.type] || CATALOGS.am;
    return { title: cat.title, type: state.type };
  }

  global.Mesh = {
    init: init,
    setState: setState,
    selectNode: selectNode,
    getCatalogMeta: getCatalogMeta,
    CATALOGS: CATALOGS,
  };
})(typeof window !== 'undefined' ? window : globalThis);
