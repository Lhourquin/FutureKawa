# Interview 1 — Direction des Opérations / Supply Chain

## Objectif de l’interview

Comprendre les besoins de pilotage des stocks, la logique FIFO, les contraintes multi-pays et la vision opérationnelle attendue.

***

## Contexte de l’entretien

**Interlocuteur :** Responsable des opérations groupe  
**Rôle :** porte la vision stock, rotation, entrepôts, expéditions  
**Objectif :** valider les besoins de gestion des lots et de supervision

***

## Questionnaire d’interview

### 1. Quelle est la difficulté principale aujourd’hui dans le pilotage des stocks ?

**Réponse :** 
Les équipes ont une vision partielle des stocks, souvent sur des tableaux séparés ou des outils locaux. Il est difficile d’avoir une vision consolidée du stock total par pays et par entrepôt, ainsi qu’une vision fiable de l’âge des lots.

### 2. Quels sont les indicateurs les plus utiles pour le siège ?

**Réponse :**

* nombre total de lots
* nombre de lots par pays / entrepôt
* lots les plus anciens
* lots en alerte
* volume de stock par site
* historique de sortie / expédition

### 3. Quelle logique de gestion souhaitez-vous pour les lots ?

**Réponse :**
Une logique **FIFO** est indispensable : les lots les plus anciens doivent être vus en priorité afin de limiter la perte de qualité et les pertes financières.

### 4. Que doit permettre l’application à un responsable d’entrepôt ?

**Réponse :**

* visualiser les lots stockés
* trier par date de stockage
* identifier rapidement les lots à expédier
* voir les lots en anomalie
* consulter l’état du stock du site

### 5. Quel niveau de détail doit être visible dans l’interface ?

**Réponse :**
L’application doit rester simple. En première page : KPI, état global, alertes. En détail : pays, entrepôt, liste des lots, historique des mesures, statut du lot.

### 6. Avez-vous besoin d’une consolidation au siège ?

**Réponse :**
Oui, le siège doit pouvoir comparer les pays et superviser les risques globaux.

***

## Synthèse de l’interview 1

Cette interview confirme que la solution doit :

* gérer les **pays / entrepôts / lots**
* afficher les lots triés par date
* donner une vision **KPI + détail**
* permettre une supervision centralisée
* intégrer une logique FIFO
* être utilisable par le siège et par les responsables de site

### Décision issue du cadrage

On retient donc :

* un **dashboard global**
* des **pages de détail par pays / entrepôt**
* une **liste de lots triée**
* des **KPI de stock**
* une interface orientée supervision

***

# Interview 2 — Direction Qualité / Traçabilité

## Objectif de l’interview

Comprendre les seuils métiers, les attentes sur l’historique, les alertes et la valeur de la traçabilité.

***

## Contexte de l’entretien

**Interlocuteur :** Responsable qualité groupe  
**Rôle :** gestion qualité, conformité, risque de dégradation, traçabilité  
**Objectif :** valider les besoins en suivi des mesures et des alertes

***

## Questionnaire d’interview

### 1. Pourquoi le suivi température / humidité est-il important ?

**Réponse :**
Les conditions de stockage ont un impact direct sur la qualité du café vert. Une dérive de température ou d’humidité peut entraîner une perte de qualité, une dégradation du lot et une baisse de valeur commerciale.

### 2. Que faut-il tracer exactement ?

**Réponse :**

* la température
* l’humidité
* la date et l’heure des relevés
* le pays
* l’entrepôt
* le lot concerné
* les alertes générées
* l’historique des anomalies

### 3. Quels seuils faut-il surveiller ?

**Réponse :**
L’énoncé définit des valeurs cibles par pays, avec une tolérance. Il faut donc déclencher une alerte si les relevés sortent de la plage acceptable.

### 4. Que doit contenir une alerte ?

**Réponse :**

* le site concerné
* le lot concerné
* le type d’anomalie
* la valeur mesurée
* la valeur
* la date et l’heure
* l’action

### 5. Qui doit recevoir les alertes ?

**Réponse :**
Le responsable d’exploitation du pays concerné doit recevoir un email automatiquement. Le siège doit également disposer d’une vision globale des alertes.

### 6. La traçabilité doit-elle être historisée longtemps ?

**Réponse :**
Oui, il faut conserver l’historique des mesures et des alertes pour les audits, la preuve qualité et l’analyse des dérives.

### 7. Faut-il distinguer les différents types d’alertes ?

**Réponse :**
Oui :

* alerte conditions stockage
* alerte lot trop ancien
* éventuellement alerte capteur / absence de mesure / problème technique

***

## Synthèse de l’interview 2

Cette interview montre que la solution doit être pensée comme un outil de **traçabilité qualité**, pas seulement comme un outil de stock.

### Décisions issues du cadrage

On retient :

* stockage de l’historique des mesures
* historisation des alertes
* règles métier de seuils par pays
* génération automatique d’emails
* tableau de bord des anomalies
* possibilité d’analyse a posteriori

### Conséquence technique

Cela justifie :

* une **base relationnelle PostgreSQL**
* un modèle de données horodaté
* des API d’historique
* des graphiques front-end
* une logique serveur de contrôle des seuils

***

# Interview 3 — Direction SI / Architecture / Exploitation

## Objectif de l’interview

Valider les contraintes techniques, la faisabilité, les choix d’architecture, la maintenabilité et l’évolutivité.

***

## Contexte de l’entretien

**Interlocuteur :** Responsable SI / architecture  
**Rôle :** gouvernance technique, déploiement, robustesse, intégration  
**Objectif :** cadrer la solution technique et le niveau d’industrialisation attendu

***

## Questionnaire d’interview

### 1. Quel type d’architecture souhaitez-vous ?

**Réponse :**
Une architecture distribuée avec une logique **pays → siège**, capable de fonctionner localement et d’être consolidée au siège.

### 2. Pourquoi ne pas faire une application monolithique unique ?

**Réponse :**
Parce que le besoin est multi-sites, avec des contraintes locales. Une architecture distribuée permet d’isoler les pays, d’absorber les variations réseau et de préparer une montée en charge.

### 3. Quel niveau de robustesse est attendu ?

**Réponse :**
L’objectif est un prototype avancé, mais il doit être suffisamment solide pour démontrer :

* la persistance
* la consultation
* l’alerte
* la reprise
* la traçabilité
* la reproductibilité du déploiement

### 4. Quelles technologies semblent les plus pertinentes ?

**Réponse :**

* PostgreSQL pour la donnée métier
* Node.js pour le backend
* React pour le frontend
* MQTT pour l’IoT
* Docker / Docker Compose pour la conteneurisation
* Jenkins pour la CI/CD
* éventuellement une documentation OpenAPI pour les contrats d’API

### 5. Quelle contrainte d’exploitation doit être prise en compte ?

**Réponse :**
Les sites terrain ont un réseau variable et des ressources limitées. La solution doit donc être légère, simple à déployer, documentée et maintenable.

### 6. Le projet doit-il préparer une phase d’automatisation ?

**Réponse :**
Oui. Il faut une base qui permette plus tard d’ajouter des actionneurs et des scénarios de décision automatique.

### 7. Quels sont les risques principaux ?

**Réponse :**

* complexité du multi-pays
* qualité des données IoT
* indisponibilité réseau
* mauvaise gestion des alertes
* manque de lisibilité côté métier
* faible maintenabilité si l’architecture est mal découpée

***

## Synthèse de l’interview 3

Cette interview confirme le besoin d’une architecture :

* **distribuée**
* **conteneurisée**
* **documentée**
* **évolutive**
* **simple à déployer**
* **orientée API**

### Décisions issues du cadrage

On retient :

* un **backend local par pays**
* un **backend central siège**
* un **broker MQTT local**
* un **frontend central**
* une **base PostgreSQL**
* une **architecture REST**
* une **conteneurisation Docker**
* une **CI/CD Jenkins**

***

## Compte rendu de cadrage — FutureKawa

### 4.1. Contexte

FutureKawa est une entreprise de culture et de stockage de café vert répartie sur plusieurs pays d’Amérique du Sud. Le besoin exprimé porte sur la mise en place d’une solution applicative permettant de superviser les stocks de lots et les conditions de conservation des entrepôts, avec une composante IoT pour la remontée de température et d’humidité.

### 4.2. Objectifs métiers

Les objectifs principaux identifiés sont les suivants :

* centraliser la vision des stocks au siège
* assurer la traçabilité complète des lots
* surveiller automatiquement les conditions de stockage
* déclencher des alertes en cas de dérive ou de lot trop ancien
* préparer une future phase d’automatisation des entrepôts

### 4.3. Besoins fonctionnels validés

À l’issue du cadrage, les besoins suivants ont été retenus :

* gestion des pays, entrepôts et lots
* consultation des lots triés par date de stockage
* visualisation de l’historique température / humidité
* affichage d’indicateurs de pilotage
* gestion des alertes qualité et vieillissement
* envoi d’emails automatiques aux responsables pays
* consultation centralisée au siège

### 4.4. Contraintes métiers et techniques

Les principales contraintes identifiées sont :

* environnement multi-pays
* besoin de fonctionnement local par site
* réseau potentiellement variable
* besoin de simplicité pour les équipes terrain
* nécessité d’une solution démontrable, documentée et industrialisable
* préparation à une évolution vers des actionneurs

### 4.5. Choix technologiques justifiés

#### PostgreSQL

Choisi pour la persistance car les données sont fortement relationnelles : pays, entrepôts, lots, mesures, alertes. PostgreSQL répond bien au besoin de traçabilité, d’historisation et de requêtes de supervision.

#### JavaScript / Node.js / React

Choisi pour homogénéiser le développement front et back. Ce choix facilite la rapidité de prototypage, la maintenance et les échanges API. Il convient bien à une solution Web de supervision métier.

#### MQTT

Choisi pour la communication IoT car c’est un protocole léger, adapté à des capteurs embarqués, fiable pour des transmissions régulières de mesures et standard dans les architectures IoT.

#### Architecture distribuée

Choisie car elle correspond au besoin réel : chaque pays doit disposer d’une autonomie technique locale tout en remontant ses données vers le siège. Cette architecture améliore la résilience et la cohérence du système.

#### Docker / Docker Compose

Choisi pour rendre la solution reproductible, simple à lancer en démonstration et plus proche d’une logique de déploiement professionnelle.

#### Jenkins

Choisi pour montrer une démarche d’industrialisation avec build, tests et packaging automatisés. Ce point répond directement aux attendus MSPR.

### 4.6. Justification des choix de réalisation

Les maquettes validées orientent une application centrée sur :

* un dashboard global
* une navigation par pays
* un détail par entrepôt
* la liste des lots
* les graphiques de température / humidité
* les zones alertes

Cette logique répond bien aux besoins métiers car elle permet :

* une vision rapide pour le siège
* une lecture simple pour les utilisateurs terrain
* une consultation détaillée des risques
* une approche progressive du pilotage qualité et stock

### 4.7. Conclusion du cadrage

Le projet doit être traité comme une **solution applicative métier de supervision multi-sites**, intégrant :

* une couche IoT de remontée de mesures
* une couche API de traitement / exposition des données
* une base relationnelle pour la traçabilité
* une interface web de supervision
* une logique d’alerte automatisée
* une architecture évolutive vers la phase 2

Les interviews montrent que le besoin n’est pas seulement technique : il est aussi métier, organisationnel et opérationnel. Les choix retenus sont donc justifiés par la nécessité de proposer une solution :

* cohérente avec les contraintes terrain
* lisible pour les métiers
* robuste pour la traçabilité
* évolutive pour l’automatisation future

***

Nous avons reconstitué trois interviews de cadrage avec les métiers : une interview avec la direction des opérations pour valider la gestion des stocks et la logique FIFO, une avec la qualité pour préciser les besoins de traçabilité, d’historisation des mesures et d’alertes, et une avec la DSI pour valider l’architecture distribuée, les contraintes d’exploitation et les choix techniques.

Ces échanges nous ont permis de confirmer que la solution devait être multi-pays, orientée supervision, avec un backend local par pays, un backend central au siège, un broker MQTT pour l’IoT, une base PostgreSQL pour la persistance et un frontend Web permettant la consultation des stocks, des courbes et des alertes.

Les maquettes montrent une logique de navigation claire : vue globale, sélection du pays, détail entrepôt, consultation des lots et des historiques. Les technologies choisies — JavaScript côté front et back, PostgreSQL, MQTT, Docker et Jenkins — sont cohérentes avec le besoin, le contexte pédagogique et la volonté de démontrer une architecture réaliste, maintenable et évolutive.

***