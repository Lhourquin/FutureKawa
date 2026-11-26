// ─── FutureKawa — configuration du module ESP32 ─────────────────────────────
// Copier ce fichier en config.h (même dossier) puis renseigner les valeurs.
// config.h est ignoré par git : les identifiants Wi-Fi ne sont jamais publiés.
// ─────────────────────────────────────────────────────────────────────────────
#pragma once

// Réseau Wi-Fi 2,4 GHz (l'ESP32 ne capte pas le 5 GHz)
#define WIFI_SSID     "nom-du-reseau"
#define WIFI_PASSWORD "mot-de-passe"

// Adresse IP de la machine qui fait tourner le broker Mosquitto (docker compose)
// Windows : ipconfig  —  macOS : ipconfig getifaddr en0  —  Linux : hostname -I
#define MQTT_SERVER   "192.168.1.10"

// Doit correspondre à MQTT_PORT dans back-brazil/.env (1883 par défaut)
#define MQTT_PORT     1883
