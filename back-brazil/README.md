# FutureKawa Brazil Infra

Infrastructure locale minimale pour le backend pays Bresil:

- PostgreSQL
- Eclipse Mosquitto

## Demarrage

```bash
cp .env.example .env
docker compose up -d
```

## Acces local

- PostgreSQL: `127.0.0.1:5433`
- Mosquitto MQTT: `127.0.0.1:1883`

Les ports sont volontairement publies uniquement sur `127.0.0.1` pour limiter l'exposition en developpement local.

## Choix de versions

- `postgres:17.9-bookworm`
- `eclipse-mosquitto:2.1.2-alpine`

Ces deux images viennent des repositories Docker Official Images:

- PostgreSQL: https://hub.docker.com/_/postgres
- Eclipse Mosquitto: https://hub.docker.com/_/eclipse-mosquitto

## Notes de securite

- Les tags sont epingles a une version precise, pas a `latest`.
- PostgreSQL est initialise avec `scram-sha-256` pour les connexions host.
- `POSTGRES_INITDB_ARGS=--data-checksums` active les checksums de pages des la creation du cluster.
- Mosquitto est laisse en `allow_anonymous true` uniquement parce que le port est lie a `127.0.0.1` pour le dev local.
- Si vous deplacez ce stack sur une VM, un LAN partage ou un environnement de staging, remplacez immediatement l'acces anonyme par une authentification MQTT et, idealement, du TLS.

## Etape suivante

Ajouter le conteneur `backend-brazil` dans le meme reseau Docker pour:

- s'abonner au broker MQTT local
- persister les mesures en base locale
- exposer l'API REST du Bresil au backend central
