#!/bin/sh
set -e

echo ""
echo "╔══════════════════════════════════════════════╗"
echo "║    FutureKawa — Noeud Bresil  (Back BR)     ║"
echo "╚══════════════════════════════════════════════╝"
echo ""

# ── 1. Synchroniser le schéma Prisma avec la DB ──────────────────────────────
echo "[1/3] Synchronisation du schema Prisma (db push)..."
npx prisma db push --skip-generate
echo "      Schema OK."
echo ""

# ── 2. Seed des données initiales (idempotent via upsert) ───────────────────
echo "[2/3] Chargement des lots de cafe initiaux (seed)..."
npx prisma db seed \
  && echo "      Seed OK." \
  || echo "      Avertissement : seed ignore (donnees deja presentes ou erreur mineure)."
echo ""

# ── 3. Démarrage de l'API ─────────────────────────────────────────────────────
echo "[3/3] Demarrage de l'API REST..."
echo ""
echo "  Ecoute sur           : http://0.0.0.0:3001"
echo "  Documentation Swagger: http://localhost:3001/api/docs"
echo "  Health check         : http://localhost:3001/api/health"
echo ""

exec node dist/src/main
