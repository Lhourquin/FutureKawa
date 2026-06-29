# ─── FutureKawa — Back Brazil ────────────────────────────────────────────────
# Contexte de build : racine du workspace pnpm (backend/)
# Ce Dockerfile est référencé depuis back-brazil/docker-compose.yml avec :
#   context: ..                              (= backend/)
#   dockerfile: back-brazil/server/Dockerfile
# ─────────────────────────────────────────────────────────────────────────────
FROM node:22-alpine

WORKDIR /app

# pnpm via corepack (inclus dans Node 22)
RUN corepack enable && corepack prepare pnpm@latest --activate

# ── Dépendances (couche cachée tant que les fichiers de lock ne changent pas)
# On copie uniquement le nécessaire pour résoudre le workspace avant les sources.
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json* ./
COPY back-brazil/server/package.json ./back-brazil/server/package.json

# Installe les dépendances du paquet back-brazil.
# --ignore-scripts : évite l'erreur ERR_PNPM_IGNORED_BUILDS sur Prisma/scarf.
# Le client Prisma est généré explicitement à l'étape suivante (prisma generate).
RUN pnpm install --frozen-lockfile --filter back-brazil --ignore-scripts

# ── Sources NestJS
COPY back-brazil/server/ ./back-brazil/server/

WORKDIR /app/back-brazil/server

# Génère le client Prisma AVANT le build (postinstall skippé par --ignore-scripts)
RUN npx prisma generate

# Build NestJS (la compilation TS nécessite le client Prisma généré)
RUN pnpm build

COPY back-brazil/server/docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 3001

ENTRYPOINT ["/docker-entrypoint.sh"]
