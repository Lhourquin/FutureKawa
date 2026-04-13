# FutureKawa Back Central

Premiere iteration du backend central NestJS pour le siege FutureKawa.

Cette version utilise uniquement des donnees mockees en memoire avec une separation claire entre:

- `domain`
- `application`
- `infrastructure`
- `presentation`

## Endpoints disponibles

- `GET /api/health`
- `GET /api/countries`
- `GET /api/countries/:countryCode/overview`
- `GET /api/countries/:countryCode/lots`
- `GET /api/lots/:lotId`
- `GET /api/lots/:lotId/measurements`
- `GET /api/alerts`

## Pays cibles

- `BR` = Bresil, cible `29°C / 55%`
- `EC` = Equateur, cible `31°C / 60%`
- `CO` = Colombie, cible `26°C / 80%`

Tolerances:

- temperature `+-3°C`
- humidite `+-2%`

## Demarrage

```bash
pnpm install
pnpm run start:dev
```

Serveur:

- `http://localhost:3000/api`

## Structure

```text
src/
  application/
  domain/
  infrastructure/
  presentation/
```

## Notes

Les alertes exposees par `GET /api/alerts` couvrent:

- les conditions hors plage
- les lots stockes depuis plus de 365 jours
