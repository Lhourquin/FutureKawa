# FutureKawa Back Central

Premiere iteration du backend central NestJS pour le siege FutureKawa.

Cette version utilise uniquement des donnees mockees en memoire avec une structure NestJS simple par modules:

- `health`
- `countries`
- `lots`
- `alerts`
- `shared`

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

## Structure simplifiee

```text
src/
  health/
  countries/
  lots/
  alerts/
  shared/
```

## Notes

Les alertes exposees par `GET /api/alerts` couvrent:

- les conditions hors plage
- les lots stockes depuis plus de 365 jours

Le dossier `shared` contient uniquement ce qui est utile a plusieurs modules:

- enums et modeles
- repositories abstraits
- implementations in-memory
- service commun de monitoring
