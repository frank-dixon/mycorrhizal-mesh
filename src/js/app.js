/**
 * Mycorrhizal Mesh — UI wiring for Simple/Advanced, AM/EM, season.
 * Depends on Mesh from mesh.js (loaded first).
 */
(function () {
  'use strict';

  const state = {
    mode: 'simple',
    type: 'am',
    season: 'growing',
  };

  function $(sel) {
    return document.querySelector(sel);
  }

  function setPressed(group, value) {
    document.querySelectorAll('[data-group="' + group + '"]').forEach((btn) => {
      const on = btn.getAttribute('data-value') === value;
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  function applyState() {
    setPressed('mode', state.mode);
    setPressed('type', state.type);
    setPressed('season', state.season);

    const advanced = state.mode === 'advanced';
    const panel = $('#advanced-panel');
    const seasonWrap = $('#season-wrap');
    if (panel) panel.hidden = !advanced;
    if (seasonWrap) seasonWrap.hidden = !advanced;

    const blurb = $('#trade-blurb');
    if (blurb) {
      if (state.type === 'am') {
        blurb.textContent =
          'Arbuscular mycorrhizal fungi grow into root cells and trade soil phosphorus and nitrogen for sugars the tree fixed from sunlight.';
      } else {
        blurb.textContent =
          'Ectomycorrhizal fungi wrap fine roots in a mantle and Hartig net, moving nitrogen and phosphorus toward the tree while taking plant carbon in return.';
      }
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
    state[group === 'mode' ? 'mode' : group === 'type' ? 'type' : 'season'] = value;
    applyState();
  }

  function boot() {
    const canvas = $('#mesh');
    if (canvas && window.Mesh) {
      window.Mesh.init(canvas);
    }

    document.querySelectorAll('.toggle-track').forEach((track) => {
      track.addEventListener('click', onToggleClick);
    });

    applyState();

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js').catch(function () {
        /* offline shell is best-effort */
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
