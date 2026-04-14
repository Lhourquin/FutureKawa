# Positionnement des flux d'ecriture

Dans notre prototype, le frontend siege est un outil de consultation et de supervision.  
Le backend central joue un role d'agregateur: il interroge les backends pays et expose uniquement des endpoints `GET` au frontend.  
Nous ne prevoyons donc pas de `POST`, `PATCH` ou `DELETE` exposes cote siege, car aucun client HTTP metier n'en a besoin dans le perimetre retenu.  
Les ecritures de donnees ont lieu au niveau des backends pays, de maniere interne, apres reception des mesures IoT via MQTT ou via leurs traitements locaux.  
Autrement dit, les creations et mises a jour existent bien dans le systeme, mais elles ne passent pas par des controllers REST d'ecriture dans cette phase de la MSPR.  
Ce choix nous permet de rester alignes avec l'usage reel de la solution: le siege consulte, les pays produisent et maintiennent la donnee.  
Si besoin, des endpoints d'ecriture pourront etre ajoutes plus tard dans les backends pays, sans remettre en cause l'architecture du backend central.
