/**
 * Mycorrhizal Mesh — teaching desk UI.
 * Wires Simple/Advanced, AM/EM, season, nutrient-path follow, diggable detail.
 */
(function () {
  'use strict';

  const state = {
    mode: 'simple',
    type: 'am',
    season: 'growing',
    path: 'all',
  };

  function $(sel) {
    return document.querySelector(sel);
  }

  function setPressed(group, value) {
    document.querySelectorAll('[data-group="' + group + '"]').forEach(function (btn) {
      const on = btn.getAttribute('data-value') === value;
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  function fillDetail(n) {
    const empty = $('#detail-empty');
    const body = $('#detail-body');
    if (!empty || !body) return;
    if (!n) {
      empty.hidden = false;
      body.hidden = true;
      return;
    }
    empty.hidden = true;
    body.hidden = false;
    $('#detail-kind').textContent = n.kind === 'tree' ? 'Plant host' : n.kind === 'soil' ? 'Soil context' : 'Fungal partner';
    $('#detail-label').textContent = n.label;
    $('#detail-sci').textContent = n.sci;
    $('#detail-role').textContent = n.role;
    $('#detail-trades').textContent = n.trades;
    $('#detail-season').textContent = n.season;
    $('#detail-soil').textContent = n.soil;
    $('#detail-partners').textContent = n.partners;
  }

  function overviewCopy() {
    const blurb = $('#trade-blurb');
    const lead = $('#desk-lead');
    if (state.type === 'am') {
      if (lead) {
        lead.textContent =
          'Endomycorrhizae (arbuscular): fungal hyphae enter root cells and build arbuscules — the intimate handshake where sugars meet soil nutrients.';
      }
      if (blurb) {
        blurb.textContent =
          state.mode === 'simple'
            ? 'Tap a node on the mesh. Plants pay carbon; Rhizophagus and Funneliformis forage phosphorus beyond the root’s reach and deliver it through arbuscules. Nitrogen moves too, though phosphate scavenging is the classic AM story.'
            : 'In Advanced view, follow a single nutrient path, watch season slow the trade, and dig into species-level roles. Arbuscules turn over quickly; extraradical hyphae keep exploring mineral soil for immobile phosphate while the maple canopy fuels the network.';
      }
    } else {
      if (lead) {
        lead.textContent =
          'Ectomycorrhizae: fungi sheath fine roots in a mantle and weave a Hartig net between cells — common on pines and many temperate forest trees.';
      }
      if (blurb) {
        blurb.textContent =
          state.mode === 'simple'
            ? 'Tap a node. Suillus and Russulaceae partners take pine carbon and return nitrogen (often from litter) plus phosphorus through the Hartig net. This is a different architecture from arbuscular endomycorrhizae.'
            : 'Advanced mode highlights organic-N foraging from litter — a signature EM strength — alongside mineral P. Common mycelial links can stitch multiple EM trees into a wider forest mesh.';
      }
    }
  }

  function applyState() {
    setPressed('mode', state.mode);
    setPressed('type', state.type);
    setPressed('season', state.season);
    setPressed('path', state.path);

    const advanced = state.mode === 'advanced';
    const panel = $('#advanced-panel');
    const seasonWrap = $('#season-wrap');
    const pathWrap = $('#path-wrap');
    if (panel) panel.hidden = !advanced;
    if (seasonWrap) seasonWrap.hidden = !advanced;
    if (pathWrap) pathWrap.hidden = !advanced;

    overviewCopy();

    const meta = $('#mesh-meta');
    if (meta && window.Mesh) {
      const info = window.Mesh.getCatalogMeta();
      meta.textContent = info.title + ' · cream teaching desk';
    }

    if (window.Mesh) {
      window.Mesh.setState(state);
    }
  }

  function onToggleClick(e) {
    const btn = e.target.closest('button[data-group]');
    if (!btn) return;
    const group = btn.getAttribute('data-group');
    const value = btn.getAttribute('data-value');
    if (!group || !value) return;
    if (group === 'mode') state.mode = value;
    else if (group === 'type') state.type = value;
    else if (group === 'season') state.season = value;
    else if (group === 'path') state.path = value;
    if (group === 'type' && window.Mesh) {
      window.Mesh.selectNode(null);
      fillDetail(null);
    }
    applyState();
  }

  function boot() {
    const canvas = $('#mesh');
    if (canvas && window.Mesh) {
      window.Mesh.init(canvas, {
        onSelect: function (n) {
          fillDetail(n);
        },
      });
    }

    document.querySelectorAll('.toggle-track').forEach(function (track) {
      track.addEventListener('click', onToggleClick);
    });

    const clearBtn = $('#detail-clear');
    if (clearBtn) {
      clearBtn.addEventListener('click', function () {
        if (window.Mesh) window.Mesh.selectNode(null);
        fillDetail(null);
      });
    }

    fillDetail(null);
    applyState();

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js').catch(function () {});
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
