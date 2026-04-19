# Sky Striker

A vertical scrolling shoot-em-up built with React + TypeScript + HTML5 Canvas. No external game engine, no image or audio assets — every visual is drawn with Canvas 2D primitives.

## Demo

Live build: <https://YOUR_GITHUB_USERNAME.github.io/sky-striker/>

Replace `YOUR_GITHUB_USERNAME` once the repo is pushed and `npm run deploy` has been run.

## Controls

| Action | Keys |
| --- | --- |
| Move | Arrow keys / WASD |
| Fire | Auto (200 ms cadence) |
| Pause / Resume | Space |
| Return to menu | Esc (with confirm) |

The player is locked to the bottom quarter of the play field. Three lives, with brief invincibility + blink after each respawn. High score persists in `localStorage`.

## Tech stack

- React 19 + TypeScript (strict)
- Vite 8
- Zustand (UI state only)
- Tailwind CSS 3 (overlay UI)
- HTML5 Canvas 2D (all gameplay rendering)
- gh-pages (deployment)

## Architecture

- [src/components/](src/components/) — React UI overlays (menu, HUD, modals)
- [src/store/gameStore.ts](src/store/gameStore.ts) — Zustand store (phase, score, lives, high score, quit-confirm flag)
- [src/game/](src/game/) — Pure TypeScript game core
  - [src/game/GameEngine.ts](src/game/GameEngine.ts) — rAF loop, phase transitions, render layering
  - [src/game/entities/](src/game/entities/) — Player, Bullet, Enemy (Small/Medium/Boss), Particle
  - [src/game/systems/](src/game/systems/) — Spawn, Collision, Particle, Effect (stars + screen shake), Input
  - [src/game/constants.ts](src/game/constants.ts) — Tunable gameplay numbers

React never re-renders the canvas. The engine reads the store imperatively via `useGameStore.getState()` and writes back through actions.

## Local development

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # type-check + production bundle
npm run lint
npm run preview   # serve dist/
```

## Deployment (GitHub Pages)

1. Create a public repo named `sky-striker` on GitHub and push this project to it.
2. Confirm the production base path in [vite.config.ts](vite.config.ts) matches the repo name (`/sky-striker/`).
3. Run:

   ```bash
   npm run deploy
   ```

   `predeploy` builds `dist/`, then `gh-pages` pushes it to the `gh-pages` branch.
4. In the repo's **Settings → Pages**, set the source to the `gh-pages` branch (root).
