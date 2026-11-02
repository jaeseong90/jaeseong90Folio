# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static resume/portfolio page (이력서·경력기술서) for 박재성 (JaeSeong Park), a Java Full-Stack Developer. Deployed via GitHub Pages at https://jaeseong90.github.io/jaeseong90Folio/. Designed to read like a printed resume: no decorative animation, document-style sections, print/PDF support.

## Architecture

Plain HTML/CSS/JS — no build tools, no frameworks, no package manager.

- `index.html` — Single page: nav, header (name/title/summary + meta table), 01 소개 (one short present-tense paragraph + 핵심 역량 bullets — no school/certs/military here, those live only in 04), 02 기술 스택, 03 경력 사항 (company blocks, each with summary bullets + project rows), 04 학력·자격·병역, 05 연락처·링크
- `css/style.css` — All styles, dark theme using CSS custom properties (`:root` vars), responsive breakpoints at 768px and 480px (scoped to `screen`), plus a `@media print` block that switches to a light palette and shows all projects. All sizes are `rem`, so print density is tuned with `html { font-size }` in that block (target: A4, 3 pages). Don't put `break-inside: avoid` on `.company` — Chrome then pushes the whole block to a new page and leaves the section title orphaned.
- To check print output: `chrome.exe --headless=new --print-to-pdf=... file:///.../index.html` with a fresh `--user-data-dir` (it caches CSS), then rasterize pages with PyMuPDF (`page.get_pixmap(dpi=80).save(...)`) and view the PNGs, or open the PDF in a Chrome tab via a local HTTP server (the browser extension can't open `file://`). Column headers (`.project-head`) and titles carry `break-after: avoid` so they never sit alone at a page bottom.
- `js/main.js` — Vanilla JS: mobile menu toggle, active nav link on scroll, project category filter (with count + hiding empty company lists), print button, automatic 재직기간/총 경력 calculation from `data-start`/`data-end`

## Development

Open `index.html` directly in a browser or use any static file server. No build step required.

## Key Conventions

- Language: Korean for content, English for code/class names
- Design system: Dark theme with CSS variables (`--bg`, `--surface`, `--border`, `--primary`, `--accent`, etc.), flat borders, 4px radius. No gradients, shadows, transitions, or scroll animations — keep it crisp and document-like
- Fonts: Noto Sans KR (body), JetBrains Mono (periods, labels, tags) via Google Fonts
- Layout: Max-width 960px container, CSS Grid rows (`.project-row`, `.skill-row`, `.edu-row`) that collapse to one column on mobile
- Project rows use `data-category` attributes (`pm`, `dev`, `support`) for JS filtering; a company's `.project-list` gets `.empty` when no rows match
- Career periods: `<span class="period" data-start="YYYY-MM" data-end="YYYY-MM">` — omit `data-end` for the current job; JS appends the duration (inclusive month count) and fills `#totalCareer`
- Projects are listed newest-first under their company; add new projects as `.project-row` entries at the top of the company's list
- The 세정아이앤씨 `.company-summary` first bullet states the project count by category ("14건 (PM/PL 5 · AA/기술지원 2 · 개발 7)") — recount from the rows' `data-category` whenever a row is added or removed
- Content rules: 핵심 역량 (01) lists capabilities; a company summary lists facts specific to that company — don't repeat the same bullets in both. Keep tags in English except product names (전자정부 표준프레임워크, FORMA); use the full name "전자정부 표준프레임워크" everywhere
