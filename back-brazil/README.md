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
> limiter l'exposition sur le réseau local. Pour un test avec un vrai ESP32,
> voir [Test réel avec un ESP32](#test-réel-avec-un-esp32).

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

Exemples publiés par l'ESP32 :
```
futurekawa/brasil/entrepotA/sensors/temperature
futurekawa/brasil/entrepotA/sensors/humidity
```

Le backend s'abonne à `futurekawa/+/+/sensors/+`. Le capteur, l'entrepôt et
le pays sont lus dans le **payload**, pas dans le topic.

### Payload (JSON)

```json
{
  "country": "brasil",
  "warehouse": "entrepotA",
  "sensor": "temperature",
  "value": 28.5,
  "unit": "C",
  "timeserie": 123456
}
```

| Champ | Type | Description |
|---|---|---|
| `country` | `string` | Pays du module (trace dans `SensorLog`) |
| `warehouse` | `string` | Identifiant de l'entrepôt — **obligatoire** : la mesure est rattachée à tous les lots de cet entrepôt (`warehouseId`, ex : `entrepotA`) |
| `sensor` | `string` | `"temperature"` ou `"humidity"` (noms lus par le backend et le frontend) |
| `value` | `float` | Valeur mesurée |
| `unit` | `string` | `"C"` pour °C, `"%"` pour humidité |
| `timeserie` | `int` | `millis()` depuis le démarrage de l'ESP32 (NTP non activé) |

### Tester manuellement sans ESP32

Le client `mosquitto_pub` est inclus dans le conteneur : rien à installer.

```bash
# bash / zsh (macOS, Linux)
docker compose exec mosquitto mosquitto_pub -t "futurekawa/brasil/entrepotA/sensors/temperature" \
  -m '{"country":"brasil","warehouse":"entrepotA","sensor":"temperature","value":28.5,"unit":"C","timeserie":1}'

# S'abonner à tous les relevés en direct
docker compose exec mosquitto mosquitto_sub -t "futurekawa/#" -v
```

```powershell
# PowerShell (Windows) — passer par un fichier évite que PowerShell retire les guillemets du JSON
'{"country":"brasil","warehouse":"entrepotA","sensor":"humidity","value":54.2,"unit":"%","timeserie":2}' | Set-Content msg.json -Encoding ascii
Get-Content msg.json | docker compose exec -T mosquitto mosquitto_pub -t "futurekawa/brasil/entrepotA/sensors/humidity" -s
```

Le terminal de l'API affiche `[MQTT] futurekawa/brasil/...` à chaque message reçu.

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
| `MQTT_BIND` | `127.0.0.1` | Adresse d'écoute du broker sur l'hôte (`0.0.0.0` pour un ESP32 du réseau) |
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
# Prérequis : Docker pour postgres + mosquitto, Node ≥ 20, pnpm 9
cp .env.example .env
docker compose up -d postgres mosquitto mailhog

cd server
cp .env.example .env
pnpm install
pnpm prisma:db:push   # Synchronise le schéma
pnpm prisma:seed      # Charge les données initiales
pnpm start:dev        # Démarre en mode watch sur :3001
```

Le fichier `server/.env` (copié depuis `server/.env.example`) pointe vers
`127.0.0.1:5433` (postgres) et `127.0.0.1:1883` (mosquitto) exposés par Docker.
Si `MQTT_PORT` ou le mot de passe PostgreSQL sont modifiés dans `.env`, reporter
les mêmes valeurs dans `server/.env`.

---

## Test réel avec un ESP32

Le firmware se trouve dans [`futurkawa_capt/`](../futurkawa_capt) (ESP32 + DHT11, broche DATA → GPIO25).

### 1. Ouvrir le broker au réseau local

Dans `back-brazil/.env` :

```
MQTT_BIND=0.0.0.0
```

Puis recréer le conteneur Mosquitto :

```bash
docker compose up -d mosquitto
docker compose ps        # mosquitto doit afficher 0.0.0.0:1883->1883/tcp
```

Si un autre broker utilise déjà le port 1883 sur la machine (ex : Mosquitto
installé sous Windows), choisir un autre port, par exemple `MQTT_PORT=1885`, et
reporter ce port dans `server/.env` (`MQTT_URL="mqtt://127.0.0.1:1885"`) et dans
le `config.h` du firmware. Redémarrer ensuite l'API.

### 2. Trouver l'adresse IP de la machine

| Système | Commande |
|---|---|
| Windows | `ipconfig` (adresse IPv4 de la carte Wi-Fi) |
| macOS | `ipconfig getifaddr en0` |
| Linux | `hostname -I` |

Cette adresse change selon le réseau : la vérifier à chaque nouvelle connexion.

### 3. Autoriser le port dans le pare-feu (une seule fois)

- **Windows** — PowerShell en administrateur :
  ```powershell
  New-NetFirewallRule -DisplayName "FutureKawa MQTT" -Direction Inbound -Protocol TCP -LocalPort 1883 -Action Allow -Profile Any
  ```
  (adapter `-LocalPort` si `MQTT_PORT` a été changé)
- **macOS** — si le pare-feu est activé, accepter les connexions entrantes
  pour Docker Desktop lorsque macOS le demande (Réglages Système → Réseau → Pare-feu).

### 4. Configurer et téléverser le firmware

```bash
cd futurkawa_capt
cp config.example.h config.h
```

Renseigner dans `config.h` le Wi-Fi, l'IP de l'étape 2 (`MQTT_SERVER`) et le
port (`MQTT_PORT`). `config.h` est ignoré par git : les identifiants ne sont
pas publiés. Téléverser ensuite avec l'IDE Arduino (bibliothèques PubSubClient
et DHT sensor library).

### 5. Vérifier

- Moniteur série (115200 bauds) : `WiFi connected` puis `connecté au serveur MQTT`.
  Code `-2` = l'ESP32 n'atteint pas la machine (IP, pare-feu ou réseau).
- Terminal de l'API : une ligne `[MQTT] futurekawa/brasil/entrepotA/...` toutes les 4 à 6 s.
- `GET http://localhost:3001/api/mqtt/status` : `receivedMessagesCount` augmente.
- Frontend : courbes température / humidité d'un lot de l'entrepôt A.

### Contraintes réseau

- L'ESP32 et la machine doivent être sur le **même réseau**, en **Wi-Fi 2,4 GHz**
  (l'ESP32 ne capte pas le 5 GHz).
- Beaucoup de Wi-Fi d'école, d'entreprise ou publics isolent les appareils entre
  eux : l'ESP32 ne voit alors pas la machine. Solution fiable partout : un
  **partage de connexion depuis un téléphone** (sur iPhone, activer « Maximiser
  la compatibilité » pour forcer le 2,4 GHz).
- Après la démo, remettre `MQTT_BIND=127.0.0.1` et relancer `docker compose up -d mosquitto`.

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
- Mosquitto est en accès anonyme car le port est lié par défaut à `127.0.0.1`
  uniquement. `MQTT_BIND=0.0.0.0` ouvre le broker au réseau local : à réserver
  aux démos sur un réseau de confiance. En environnement partagé ou staging,
  configurer l'authentification MQTT et TLS.
- Les images sont épinglées à des versions précises (pas de `latest`).
- Le mot de passe par défaut est prévu pour la démo — le changer en production.
