# FutureKawa — PoC supervision lots café vert

Monorepo NestJS / React. Architecture distribuée : nœud Brésil ↔ back-central siège ↔ frontend.

## Prérequis

- Node.js ≥ 20
- pnpm ≥ 9 (`npm i -g pnpm`)
- Docker + Docker Compose

---

## Démarrage rapide

### 1. Lancer PostgreSQL + Mosquitto (Docker)

```bash
cd back-brazil
docker compose up -d
```

Vérifier : `docker compose ps` — postgres et mosquitto doivent être `healthy`.

### 2. Installer les dépendances

```bash
# Depuis le dossier backend/
pnpm install
```

### 3. Créer le schéma et seeder la base

```bash
cd back-brazil/server
pnpm prisma:db:push   # applique schema.prisma
pnpm prisma:seed      # insère 2 lots + mesures de démonstration
```

### 4. Lancer les services (3 terminaux)

```bash
# Terminal 1 — nœud Brésil (port 3001)
cd back-brazil/server && pnpm start:dev

# Terminal 2 — back-central siège (port 3000)
cd back-central && pnpm start:dev

# Terminal 3 — frontend (port 5173)
cd frontend && pnpm dev
```

Ouvrir : **http://localhost:5173**

---

## Credentials de démonstration

| Rôle | Email | Mot de passe |
|------|-------|-------------|
| Admin | admin@futurekawa.com | admin123 |
| Opérateur Brésil | brazil@futurekawa.com | brazil123 |

---

## Documentation API Swagger

| Service | URL |
|---------|-----|
| Back-Brazil | http://localhost:3001/api/docs |
| Back-Central | http://localhost:3000/api/docs |

---

## Endpoints principaux

### Back-Brazil (nœud pays — port 3001)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | /api/health | Santé |
| GET | /api/lots | Liste lots (ordre FIFO) |
| GET | /api/lots/:id | Détail lot |
| GET | /api/lots/:id/measurements | Historique mesures IoT |
| GET | /api/alerts | Alertes actives |
| GET | /api/mqtt/status | Statut connexion MQTT |

### Back-Central (siège — port 3000) — endpoints JWT protégés

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | /api/auth/login | Auth → JWT Bearer |
| GET | /api/countries | Liste pays |
| GET | /api/countries/:code/overview | Vue consolidée |
| GET | /api/countries/:code/lots | Lots d'un pays |
| GET | /api/lots/:id | Détail lot (proxy) |
| GET | /api/lots/:id/measurements | Mesures (proxy) |
| GET | /api/alerts | Alertes agrégées |

---

## Flux MQTT → Alertes

```
ESP32 → topic futurekawa/{country}/{warehouse}/sensors/{sensor}
         ↓
   MqttDebugService.ingest()
         ↓
   SensorLog (trace brute) + Measurement (par lot dans l'entrepôt)
         ↓
   EventEmitter.emit('measurement.ingested', { lotId })
         ↓
   AlertsService.handleMeasurementIngested()
     → vérif conditions (±3°C / ±2%) + péremption (>365 j)
     → NotificationService.send*Alert() → log console (SMTP mock)
```

---

## Tests

```bash
cd back-brazil/server && pnpm test    # MonitoringService + LotsService FIFO
cd back-central && pnpm test
```

---

## Architecture décisions

**MQTT transport** : `mqtt` npm direct — le nœud ne fait que consommer, le microservice bidirectionnel NestJS `Transport.MQTT` n'est pas nécessaire.

**Schéma Measurement** : chaque message MQTT = une ligne individuelle `(sensor, value, unit, receivedAt)` liée au lot. Aligné sur le payload ESP32 (temp et humidity envoyés séparément).

**Alertes** : double mécanisme — temps réel via EventEmitter (email) + calcul à la demande sur `GET /alerts` (REST).

**BrazilBackendClient** : cache 30 s + timeout 5 s + 1 retry + "dernière valeur connue" si le nœud est temporairement injoignable.

---

## Non implémenté (évolutions documentées)

- Multi-pays réels (EC, CO) : instancier `backend-pays` par pays + registre CountryClient dans back-central
- CQRS / Event Sourcing, Kafka/NATS : non justifiés au volume actuel
- Strategy pattern (règles d'alerte) : non justifié à 2 règles
- CASL : si les rôles deviennent granulaires
- Email SMTP réel : remplacer `SmtpMockNotificationService` par impl Nodemailer
