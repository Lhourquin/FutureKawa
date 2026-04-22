# FutureKawa — Nœud Brésil (Back Brazil)

Backend local du pays Brésil. Reçoit les relevés IoT via MQTT, les persiste en
PostgreSQL et expose une API REST consommée par le backend central (siège).

## Architecture du nœud

```
ESP32 (DHT11)
    │  MQTT  futurekawa/br/entrepotA/sensors/temperature
    ▼
Mosquitto Broker (:1883)
    │  subscribe
    ▼
API NestJS (:3001)  ←──► PostgreSQL (:5432 interne / :5433 hôte)
    │  REST
    ▼
Back Central (siège)
```

## Prérequis

| Outil | Version minimale |
|---|---|
| Docker | 24.x |
| Docker Compose | 2.x (plugin `docker compose`) |

Aucune autre dépendance n'est nécessaire pour lancer le stack complet.

---

## Démarrage rapide

### 1. Configurer les variables d'environnement

```bash
cp .env.example .env
```

Les valeurs par défaut fonctionnent immédiatement pour une démo locale.
Modifier `POSTGRES_PASSWORD` pour un déploiement réel.

### 2. Lancer le stack complet

```bash
docker compose up -d
```

Docker Compose démarre dans cet ordre :
1. **PostgreSQL** — attend le healthcheck `pg_isready`
2. **Mosquitto** — attend le healthcheck broker
3. **API NestJS** — synchronise le schéma Prisma, charge les lots initiaux, démarre l'API

### 3. Vérifier que tout est opérationnel

```bash
docker compose ps
```

Tous les services doivent afficher `Up` ou `Up (healthy)`.

```bash
# Health check de l'API
curl http://localhost:3001/api/health
# → {"status":"ok"}
```

---

## Accès aux services

| Service | URL / Adresse | Description |
|---|---|---|
| API REST | http://localhost:3001/api | Racine de l'API |
| **Swagger UI** | **http://localhost:3001/api/docs** | Documentation interactive |
| PostgreSQL | `127.0.0.1:5433` | Inspection directe (ex : DBeaver) |
| MQTT Broker | `127.0.0.1:1883` | Réception des relevés ESP32 |

> Les ports PostgreSQL et MQTT sont publiés uniquement sur `127.0.0.1` pour
> limiter l'exposition sur le réseau local.

---

## Documentation Swagger

L'interface Swagger génère automatiquement la documentation à partir des
décorateurs NestJS et permet de **tester tous les endpoints directement dans
le navigateur** sans outil supplémentaire.

Accès : **http://localhost:3001/api/docs**

Endpoints disponibles :

| Méthode | Route | Description |
|---|---|---|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/lots` | Liste tous les lots (triés FIFO) |
| `POST` | `/api/lots` | Créer un nouveau lot |
| `GET` | `/api/lots/:id` | Détail d'un lot |
| `PATCH` | `/api/lots/:id` | Modifier un lot |
| `DELETE` | `/api/lots/:id` | Supprimer un lot + historique IoT |
| `GET` | `/api/lots/:id/measurements` | Historique des mesures IoT d'un lot |
| `GET` | `/api/lots/warehouses` | Vue agrégée par entrepôt |
| `GET` | `/api/alerts` | Alertes actives (hors plage / périmés) |

---

## Format des messages MQTT (ESP32 → Broker)

### Topic

```
futurekawa/<pays>/<entrepot>/sensors/<capteur>
```

Exemples :
```
futurekawa/br/entrepotA/sensors/temperature
futurekawa/br/entrepotA/sensors/humidity
```

### Payload (JSON)

```json
{
  "value": 28.5,
  "unit": "C",
  "timeserie": 1718000000
}
```

| Champ | Type | Description |
|---|---|---|
| `value` | `float` | Valeur mesurée |
| `unit` | `string` | `"C"` pour °C, `"%"` pour humidité |
| `timeserie` | `int` | Timestamp Unix (secondes) |

### Tester manuellement avec `mosquitto_pub`

```bash
# Publier une mesure de température
mosquitto_pub -h 127.0.0.1 -p 1883 \
  -t "futurekawa/br/entrepotA/sensors/temperature" \
  -m '{"value":28.5,"unit":"C","timeserie":1718000000}'

# Publier une mesure d'humidité
mosquitto_pub -h 127.0.0.1 -p 1883 \
  -t "futurekawa/br/entrepotA/sensors/humidity" \
  -m '{"value":54.2,"unit":"%","timeserie":1718000001}'

# S'abonner à tous les relevés en direct
mosquitto_sub -h 127.0.0.1 -p 1883 -t "futurekawa/#" -v
```

> `mosquitto_pub` et `mosquitto_sub` sont disponibles via le paquet
> `mosquitto-clients` (Linux/macOS) ou inclus dans l'installation Windows.

---

## Tester l'API avec curl

```bash
# Lister les lots
curl http://localhost:3001/api/lots | jq

# Détail du lot BR-2025-001
curl http://localhost:3001/api/lots/lot-br-001 | jq

# Historique des mesures IoT
curl http://localhost:3001/api/lots/lot-br-001/measurements | jq

# Vue entrepôts
curl http://localhost:3001/api/lots/warehouses | jq

# Alertes actives
curl http://localhost:3001/api/alerts | jq

# Créer un lot
curl -X POST http://localhost:3001/api/lots \
  -H "Content-Type: application/json" \
  -d '{
    "reference": "BR-2025-TEST",
    "productName": "Catuai Vermelho",
    "producer": "Fazenda Teste",
    "harvestDate": "2025-03-01",
    "storedAt": "2025-04-01",
    "quantityKg": 500
  }' | jq
```

---

## Variables d'environnement

| Variable | Valeur par défaut | Description |
|---|---|---|
| `POSTGRES_DB` | `futurekawa_br` | Nom de la base de données |
| `POSTGRES_USER` | `futurekawa_br_user` | Utilisateur PostgreSQL |
| `POSTGRES_PASSWORD` | `futurekawa-demo-2025` | Mot de passe PostgreSQL |
| `POSTGRES_PORT` | `5433` | Port hôte pour PostgreSQL |
| `MQTT_PORT` | `1883` | Port hôte pour MQTT |
| `ALERT_RECIPIENT_EMAIL` | `ops-brazil@futurekawa.com` | Destinataire des alertes |

> `DATABASE_URL` et `MQTT_URL` sont construits automatiquement par le
> docker-compose pour pointer vers les services internes Docker.
> Ne pas les définir dans `.env` — ils seraient ignorés.

---

## Commandes utiles

```bash
# Voir les logs en temps réel
docker compose logs -f api

# Relancer uniquement l'API (après une modification)
docker compose up -d --build api

# Réinitialiser complètement (supprime les données)
docker compose down -v && docker compose up -d

# Injecter le seed manuellement (si nécessaire)
docker compose exec api npx prisma db seed

# Ouvrir un shell dans le conteneur API
docker compose exec api sh

# Arrêter le stack
docker compose down
```

---

## Développement local (sans Docker)

Pour développer l'API en mode watch (avec rechargement automatique) :

```bash
# Prérequis : Docker pour postgres + mosquitto, Node 22, pnpm
docker compose up -d postgres mosquitto

cd server
pnpm install
pnpm prisma:db:push   # Synchronise le schéma
pnpm prisma:seed      # Charge les données initiales
pnpm start:dev        # Démarre en mode watch sur :3001
```

Le fichier `server/.env` pointe vers `127.0.0.1:5433` (postgres exposé par Docker).

---

## Données initiales (seed)

Le seed charge automatiquement 2 lots de démonstration au premier démarrage :

| ID | Référence | Produit | Producteur | Quantité |
|---|---|---|---|---|
| `lot-br-001` | BR-2025-001 | Arabica Santos | Cooperativa Vale Verde | 1 200 kg |
| `lot-br-002` | BR-2024-014 | Bourbon Jaune | Fazenda Aurora | 860 kg |

Le seed est **idempotent** (upsert) : le relancer ne crée pas de doublons et
ne supprime pas les mesures IoT déjà enregistrées.

---

## Notes de sécurité

- PostgreSQL utilise `scram-sha-256` et les data checksums.
- Mosquitto est en accès anonyme car le port est lié à `127.0.0.1` uniquement.
  En environnement partagé ou staging, configurer l'authentification MQTT et TLS.
- Les images sont épinglées à des versions précises (pas de `latest`).
- Le mot de passe par défaut est prévu pour la démo — le changer en production.
