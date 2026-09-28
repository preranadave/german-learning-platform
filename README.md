# German Learning Platform
A structured, interactive German course (A0 → B2/C1) built with React + Vite. Progress and notes are stored in the browser (localStorage).

## Features
Daily lessons (5 words/day) · pronunciation audio (normal/slow) · speaking practice with speech recognition · sentence builder · digital notebook · pocket diary · mini tests · English/Hindi toggles · light/dark/reading modes

## Run
    npm install
    npm run dev
    npm run build

## Add content
Add a lesson object to `src/data/lessons.js` (same shape as Day 1). No component changes needed.

## Deployment
GitHub Actions (`.github/workflows/deploy.yml`) builds and deploys to GitHub Pages on every push to `main`. In the repo: Settings → Pages → Source: **GitHub Actions**. The app uses `HashRouter`, so refreshing on any route works on Pages. If you rename the repo, update `base` in `vite.config.js`.

Live site: _add URL after first deploy_
