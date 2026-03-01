# ── Stage 1: Build the SPA ──────────────────────────────────────
# Node does the heavy lifting — installs deps, runs Vite,
# produces a /dist folder of static assets, then gets discarded
# like a booster rocket that's served its purpose.
FROM node:22-alpine AS builder

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build-only

# ── Stage 2: PocketBase + SPA ──────────────────────────────────
# The final image is just PocketBase with the SPA baked into
# its public directory. One port, one process, one truth.
# API at /api, admin panel at /_/, the site at /.
FROM ghcr.io/muchobien/pocketbase:latest

# Vue dist → PocketBase's public directory
COPY --from=builder /app/dist /pb_public

# Auto-migrations — runs once on first boot, then never again
COPY pb_migrations /pb_migrations

EXPOSE 8090
