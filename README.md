# FutureKawa — PoC supervision lots café vert

Monorepo NestJS / React. Architecture distribuée : nœud Brésil ↔ back-central siège ↔ frontend.

## Prérequis

- Node.js ≥ 20 (`node -v`)
- pnpm 9 (`npm i -g pnpm@9`, même version que la CI Jenkins)
- Docker + Docker Compose (Docker Desktop sous Windows / macOS)

Les commandes ci-dessous fonctionnent dans un terminal bash/zsh (macOS, Linux) comme dans PowerShell (Windows).
Toutes se lancent depuis la racine du dépôt.

Ports utilisés : 3000, 3001, 5173, 5433, 1883, 1025, 8025. S'ils sont déjà pris (ex : Grafana utilise 3000 par défaut, un Mosquitto installé localement utilise 1883), libérer le port avant de lancer. Pour 1883, voir [Test réel avec l'ESP32](#test-réel-avec-lesp32).

---

## Démarrage rapide

### 1. Lancer PostgreSQL + Mosquitto + Mailhog (Docker)

```bash
cd back-brazil
cp .env.example .env
docker compose up -d postgres mosquitto mailhog
docker compose ps
cd ..
```

postgres et mosquitto doivent être `healthy`. Le service `api` n'est pas lancé ici : l'API est démarrée avec pnpm à l'étape 4 (sinon conflit sur le port 3001). Pour lancer tout le nœud Brésil dans Docker, voir `back-brazil/README.md`.

### 2. Installer les dépendances

```bash
pnpm install
```

### 3. Créer le schéma et seeder la base

```bash
cd back-brazil/server
cp .env.example .env
pnpm prisma:db:push   # applique schema.prisma
pnpm prisma:seed      # insère 2 lots + mesures de démonstration
cd ../..
```

### 4. Lancer les services (3 terminaux, depuis la racine du dépôt)

```bash
# Terminal 1 — nœud Brésil (port 3001)
cd back-brazil/server
pnpm start:dev

# Terminal 2 — back-central siège (port 3000)
cd back-central
pnpm start:dev

# Terminal 3 — frontend (port 5173)
cd frontend
pnpm dev
```

Ouvrir : **http://localhost:5173**

Si la page de connexion se recharge sans message après avoir cliqué sur « Connexion », back-central ne tourne pas sur le port 3000 (vérifier le terminal 2, souvent une erreur `EADDRINUSE`).

---

## Test réel avec l'ESP32

Par défaut, le broker n'accepte que les connexions de la machine elle-même (`127.0.0.1`). Pour qu'un vrai ESP32 envoie ses mesures, suivre la section **« Test réel avec un ESP32 »** de [`back-brazil/README.md`](back-brazil/README.md#test-réel-avec-un-esp32) (réseau, pare-feu Windows / macOS, configuration du firmware).

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
     → NotificationService.send*Alert() → e-mail via Nodemailer (Mailhog en local : http://localhost:8025)
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
- SMTP de production : Nodemailer envoie aujourd'hui vers Mailhog (test local) — configurer un serveur SMTP réel (TLS, authentification)
