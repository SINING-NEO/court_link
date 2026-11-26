# Courtlink

**Connect. Discover. Play.**

Courtlink is a tennis social network for finding partners, courts, and sessions. This repo ships a working Phase 1 MVP inspired by the Courtlink system design: feed, player discovery, messaging, court map preview, and session matchmaking — all running locally in the browser.

## Features in this demo

- Landing + email/password auth (local demo accounts)
- Player profiles with skill, style, surfaces, and availability
- Instagram-style feed (posts, likes, comments, hashtags)
- Discover players with filters, follow, friend requests, and chat
- Court discovery with surface filters and favourites
- Create / join tennis sessions
- Private messaging

Data persists in `localStorage`. Use **Reset demo data** on the Profile page to restore the seed dataset.

## Quick start

```bash
npm install
npm run dev -- --port 4317
```

Open [http://localhost:4317](http://localhost:4317).

### Demo login

- Email: `maya@courtlink.app`
- Password: `demo1234`

Other seed players use the same password (`jordan@courtlink.app`, `sofia@courtlink.app`, …).

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Next.js dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

## Stack

Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui.
