# Gouvernance GitHub — AI Interview Platform

## Sources de vérité

- **ClickUp** : Sprint, responsable, statut, priorité et échéance.
- **GitHub** : code, historique des modifications, documentation technique, corpus et résultats des contrôles.
- **README / docs/PROJECT_STATUS.md** : point d'entrée et instantané documenté, non remplacement de ClickUp.

Ne pas maintenir deux backlogs concurrents : les issues GitHub servent à détailler des bugs/travaux techniques **en lien avec un ticket ClickUp**.

## Branches, contributions et livraison

- `main` porte la référence partagée, aujourd'hui sans protection bloquante confirmée.
- Pour le développement futur, préférer une branche courte `feat/S2-03-...`, `fix/...` ou `docs/...` et une Pull Request.
- Les changements importants doivent être vérifiés via CI, revue de pairs lorsque disponible, et description du risque.
- **Ne pas activer de règle bloquante ni de protection de branche sans décision explicite**, pour éviter de bloquer les agents et contributeurs.
- Ne pas modifier des questions officiellement publiées en place ; versionner une nouvelle révision.

## Matrice légère de responsabilités (proposée)

| Activité | Rôles |
|---|---|
| Priorisation & validation fonctionnelle | Product Owner |
| Architecture, modèle de données, sécurité | Référent technique et reviewer |
| Qualité du corpus RH | Reviewer RH |
| Exactitude technique | Expert métier |
| Génération IA | Auteur de proposition, jamais approbateur automatique |
| Publication | Responsable explicitement habilité |

Les noms de responsables doivent être confirmés dans ClickUp ; ne pas supposer une délégation permanente.

## Statuts et critères qualité

- `Draft` : contenu préparé, non exploitable en production.
- `In review` : revues éditoriale ou technique en cours.
- `Approved` : revue validée mais pas nécessairement publié.
- `Published` : publication autorisée, immuable et disponible au moteur.
- `Archived` : exclu des nouvelles simulations, historique préservé.

Pour toute PR : lien ClickUp, portée, commandes de validation, risques, changement documentaire et absence de données personnelles/secrets.

## Gestion des changements et décisions

Les arbitrages structurants doivent être enregistrés dans `docs/DECISIONS.md`. En cas de conflit entre un état documenté et ClickUp, vérifier le statut courant de ClickUp avant toute mise à jour.

## Sécurité

Le dépôt est actuellement **public** : n'y stocker aucune donnée réelle de candidat, clé d'API ou donnée interne sensible. Pour la politique de sécurité opérationnelle et les choix encore ouverts, lire [SECURITY](SECURITY.md).
