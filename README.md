# Mycorrhizal Mesh

See how trees and mycorrhizal fungi trade carbon for phosphorus and nitrogen.

This is a static progressive web app: an animated mesh shows sugars moving from tree to fungus, and phosphorus and nitrogen moving back toward the tree. You can switch between Simple and Advanced detail, and between arbuscular (AM) and ectomycorrhizal (EM) partners.

## Live demo

GitHub Pages is **not** enabled for this repo until Frank explicitly says deploy or ship. Until then, run it locally from `docs/`.

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

Push for review is fine. Do **not** turn on GitHub Pages or otherwise go public-live until Frank says deploy or ship for this project.
