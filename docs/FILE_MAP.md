File map for Company-website

Pages
- index.html — Home / landing page (keep at root)
- main.html — Alternate/main layout (possibly a template)
- about.html — About page
- contact.html — Contact page
- projects.html — Projects listing
- services.html — Services page
- skills.html — Skills page
- workflow.html — Workflow explanation
- palette-preview.html — Palette preview (dev)
- buttons.html — Button component preview (dev)
- pixelated-modal.js — (misplaced JS?) — verify
- splash and other helpers: splash documentation in SPLASH_UNLOCK_MECHANISM.md

Styles
- styles.css — main stylesheet
- hyperspeed.css
- interactive-button.css
- themed-button.css
- auth-modal.css

Scripts
- scripts.js — main JS
- hyperspeed.js
- timeline.js
- flip-words.js
- theme-toggler.js
- smoke-test.js
- noise-button.js
- pixelated-modal.js
- noise-button.js
- webcam-pixel-grid.js
- border-beam.js
- world-map.js
- test-server.js — simple dev server (use to smoke-test)

Config / Metadata
- manifest.json
- vercel.json
- package.json
- desktop.ini (Windows metadata)

Docs / Misc
- SPLASH_UNLOCK_MECHANISM.md — special notes
- README.md — (this file)

Suggested destination folders
- `pages/`: about.html, contact.html, projects.html, services.html, skills.html, workflow.html, palette-preview.html, buttons.html, etc.
- `css/`: all .css files
- `js/`: all .js files (scripts, utils, components)
- `assets/`: manifest.json, images, icons (create if needed)
- `docs/`: this file and any future docs

Notes
- I will not move `index.html` unless you ask — keeping the landing page at root is conventional for hosting.
- Many filenames suggest they belong in `css/` or `js/` — moving them will require updating references in HTML files. I can automate that after you approve.

Next steps
- Reply "approve" to let me reorganize files and update references automatically (I will keep backups), or tell me which files to exclude from moving.
