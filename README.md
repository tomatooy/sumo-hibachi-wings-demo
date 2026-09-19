# SUMO Hibachi & Wings redesign

[Public demo](https://sumo-hibachi-wings-demo.ouou8386.chatgpt.site) · [GitHub repository](https://github.com/tomatooy/sumo-hibachi-wings-demo)

A responsive, static restaurant website using the restaurant's existing logo and food photography. No package installation is required. Run `npm run build` to copy the deployable website into `dist/`.

## Preview

Serve this directory with any static web server, for example:

```sh
python3 -m http.server 50726 --bind 127.0.0.1
```

Open http://127.0.0.1:50726. `index.html` also opens directly from disk.

## Files

- `index.html`: page content, restaurant information, and existing Chowbus ordering links.
- `styles.css`: desktop and mobile layouts, bundled fonts, and reduced-motion support.
- `app.js`: three rotating menu groups, a featured-dish slideshow, synchronized item captions, and pause/previous/next controls.
- `assets/`: locally saved and compressed existing restaurant photos, logo, and fonts.
- `assets/sources.json`: image and font source URLs.

## Content provenance

Restaurant content, logo, 12 gallery photos, address, hours, phone number, email, ordering URL, and legal links were taken from https://50726-sumo-hibachi-and-wings.multiscreensite.com/ on 2026-09-19. The original logo's incorrect alternative text was replaced with an accurate description. No prices, customer ratings, or promotions were invented. Phone number `670-520-7777` is preserved exactly as displayed on the source site.

This repository contains a public demo of the redesign. The restaurant’s existing website and ordering service remain independent. The demo’s ordering buttons open the existing Chowbus store.

## Checks

Checked desktop and mobile layouts, including 390px and 320px widths; original ordering link destinations; image loading; menu group selection and wrapping; synchronized slideshow captions; and JavaScript syntax.
