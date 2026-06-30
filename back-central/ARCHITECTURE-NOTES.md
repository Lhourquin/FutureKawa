# Architecture du backend central — positionnement des flux

## Rôle du backend central

Le backend central est un **agrégateur et proxy** : il ne stocke aucune donnée métier et délègue
toutes les opérations (lecture et écriture) aux nœuds pays via leurs clients HTTP dédiés
(ex. `BrazilBackendClient`).

## Endpoints exposés

Le backend central expose des endpoints **GET et d'écriture (POST/PATCH/DELETE)** au frontend :

- **GET** — consultation : lots FIFO, mesures, alertes, entrepôts
- **POST** — création de lots (proxifié vers le nœud pays concerné)
- **PATCH** — modification de lots (proxifié vers le nœud pays concerné)
- **DELETE** — suppression de lots (proxifié vers le nœud pays concerné)

L'interface React (page *Gestion des stocks*) utilise ces endpoints pour permettre aux
opérateurs de créer et modifier des lots sans accès direct aux nœuds pays.

## Flux d'écriture

```
Frontend (React)
  → POST/PATCH/DELETE /api/lots   [back-central, authentifié JWT]
    → BrazilBackendClient.create/update/delete()
      → POST/PATCH/DELETE /api/lots   [back-brazil, port 3001]
        → Prisma → PostgreSQL
```

Les données sont toujours **écrites dans la base du nœud pays** ; le central ne fait que
relayer la requête après vérification du rôle (opérateur lié au pays concerné).
