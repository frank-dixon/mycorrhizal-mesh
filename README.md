# Mycorrhizal Mesh

See how trees and mycorrhizal fungi trade carbon for phosphorus and nitrogen.

This is a static progressive web app: an animated mesh shows sugars moving from tree to fungus, and phosphorus and nitrogen moving back toward the tree. You can switch between Simple and Advanced detail, and between arbuscular (AM) and ectomycorrhizal (EM) partners.

## Live demo

**https://frank-dixon.github.io/mycorrhizal-mesh/**

Portfolio micro-projects commit, push, and deploy GitHub Pages from `/docs` on `main`. LinkedIn, hub content, and resume.pdf still need those surfaces named when they are the target.

## What this is not

- Not Hyphaneural’s gene-follow / DNA → mRNA → protein teaching
- Not Cambium’s maple sap run or fruit-tree physiology
- Not a cultivation guide or a general soil-pathogen atlas

## Stack

- Tailwind CSS 3 utility classes in HTML
- Plain JavaScript (commented sources under `src/js/`, minified into `docs/js/` on save)
- `npm run watch` compiles CSS and minifies JS together
- Installable PWA shell (`manifest.webmanifest` + service worker)

## Local edit

```bash
git clone https://github.com/frank-dixon/mycorrhizal-mesh.git
cd mycorrhizal-mesh
npm i
npm run watch   # or: npm start
```

In another terminal:

```bash
cd docs && python3 -m http.server 8765
```

Open http://127.0.0.1:8765/

Ship with committed built artifacts under `docs/css/` and `docs/js/` so a static host needs no Node at runtime.

```bash
npm run build
```

## Hub

The masthead links back to [frank-dixon.github.io](https://frank-dixon.github.io/).

## Deploy policy

For this portfolio micro-project: commit updates, push to `main`, and keep GitHub Pages on `/docs`. Do not treat hub LinkedIn/resume surfaces as covered by this default.
