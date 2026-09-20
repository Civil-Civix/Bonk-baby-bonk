# Bonk Clone Repository

This repository contains the front-end and back-end structure for hosting an unblocked multiplayer arena game.

## Structure

- `server/`: Node.js + Express + Socket.IO back-end designed for deployment on Render.
- `client/`: Static HTML5 Canvas + Socket.IO client designed for GitHub Pages.

## How to Deploy

1. **Back-End (Render):**
   - Push the contents of `server/` to a GitHub repository.
   - Deploy as a **Web Service** on Render with Build Command `npm install` and Start Command `node server.js`.
   - Add a PostgreSQL instance on Render and attach `DATABASE_URL` to the web service environment variables.

2. **Front-End (GitHub Pages):**
   - In `client/app.js`, update `BACKEND_URL` to point to your live Render application URL.
   - Upload the `client/` directory to GitHub Pages.
