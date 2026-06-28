# Use Cases du SI FutureKawa

## 1.1. Acteurs identifiés

| Acteur                            | Description                          |
| --------------------------------- | ------------------------------------ |
| Responsable d’exploitation (pays) | Gère les opérations locales          |
| Responsable entrepôt              | Gère les stocks et les lots          |
| Responsable qualité               | Surveille les conditions de stockage |
| Supply chain / siège              | Supervise les flux globaux           |
| Direction SI                      | Exploitation technique               |
| Système IoT                       | Capteurs temp/humidité               |
| Backend central                   | Consolidation des données            |

***

## 1.2. Use Case global (vue simplifiée)

### Acteurs → SI → Fonctionnalités

***

## 1.3. Use cases détaillés

***

## UC1 — Consulter les stocks (Responsable entrepôt)

**Acteur :** Responsable entrepôt

**Description :**  
L’utilisateur consulte les lots présents dans son entrepôt.

**Scénario principal :**

1. L’utilisateur sélectionne son entrepôt
2. Le système affiche la liste des lots
3. Les lots sont triés par date (FIFO)
4. L’utilisateur consulte les détails d’un lot

**Résultat :**
→ Vision claire des stocks et priorisation des sorties

***

## UC2 — Superviser un pays (Responsable exploitation)

**Acteur :** Responsable exploitation

**Description :**  
Supervision globale des entrepôts d’un pays

**Scénario :**

1. Sélection d’un pays
2. Consultation des KPI :
   * nombre de lots
   * état des stocks
   * alertes
3. Visualisation des entrepôts
4. Accès aux alertes

**Résultat :**
→ Pilotage des opérations locales

***

## UC3 — Suivre la qualité des lots (Responsable qualité)

**Acteur :** Responsable qualité

**Description :**  
Consultation des conditions de stockage et des anomalies

**Scénario :**

1. Sélection d’un lot
2. Visualisation des courbes température / humidité
3. Consultation de l’historique
4. Vérification des alertes

**Résultat :**
→ Contrôle qualité et traçabilité

***

## UC4 — Remonter les données IoT (Capteur)

**Acteur :** Système IoT

**Description :**  
Le capteur envoie les données vers le système

**Scénario :**

1. Mesure de température et humidité
2. Publication MQTT vers le broker
3. Backend récupère les données
4. Données enregistrées en base

**Résat :**
→ Alimentation automatique du SI

***

## UC5 — Générer une alerte

**Acteur :** Système

**Description :**  
Détection automatique des anomalies

**Scénario :**

1. Comparaison des mesures avec seuils
2. Détection anomalie
3. Création alerte
4. Envoi email

**Résultat :**
→ Réactivité face aux risques

***

## UC6 — Supervision globale (Siège)

**Acteur :** Supply chain / Direction

**Description :**
Pilotage multi-pays

**Scénario :**

1. Accès dashboard global
2. Visualisation :
   * stocks globaux
   * alertes
   * performance
3. Comparaison des pays

**Résultat :**
→ Vision stratégique

***

## UC7 — Administration du système (DSI)

**Acteur :** SI

**Description :**
Gestion technique

**Scénario :**

1. Déploiement (Docker)
2. Supervision services
3. Logs
4. Maintenance

**Résultat :**
→ Maintenabilité

***

## 1.4. Résumé des Use Cases

Le système permet :

* Gestion des stocks
* Supervision multi-pays
* Suivi qualité
* IoT automatisé
* Alertes
* Pilotage stratégique

***