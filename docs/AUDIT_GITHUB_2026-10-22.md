# Mini-audit GitHub & suivi du backlog — 22 octobre 2026

**Périmètre :** dépôt `Achrafsila/ai-interview-platform`, branche `main`, documentation, corpus S2-03 et représentation des tâches. Audit documentaire et structurel, pas audit d'exécution applicative ni audit de cybersécurité exhaustif.

## Constats vérifiés et actions

| Domaine | Observation | Action |
|---|---|---|
| État général | README indiquait encore Sprint 1 et omettait S2-03 | README actualisé |
| Visibilité | Dépôt GitHub **public**, tandis que SECURITY le disait privé | SECURITY corrigé ; prudence sur les données |
| Gouvernance | CONTRIBUTING suggérait revue/PR obligatoires malgré absence de protection confirmée | Clarification des recommandations vs règles actives |
| Décisions | ADR ne couvraient pas les choix produit S2-03 | ADR-005 à ADR-010 documentés |
| Handoff IA | Absence de guide racine pour Claude/autres agents | `CLAUDE.md` créé |
| Corpus | 120 questions (50 RH / 70 techniques), tous `draft` | Aucun statut `published` modifié |
| Contenu | 100 nouvelles questions IA sans revue humaine ; relances génériques | Réserve explicite, revue métier prioritaire |
| Grilles | Calibration manuelle de 12 cas, grilles encore draft | Test documenté, calibration automatique future toujours ouverte |
| Automatisation | Validation structurale présente, pas de workflow spécifique retrouvé au chemin standard testé | Workflow de validation JSON ajouté |
| État technique | Aucune implémentation Supabase ou intégration S2-04 démontrée par les documents examinés | Garder ces tâches ouvertes ; confirmer avec le code/équipe |

## À surveiller

- Taxonomie RH : codes de catégories anciens et nouveaux partiellement différents ; établir un dictionnaire canonique avant migration.
- Attributions : distinguer validation éditoriale, audit IA, validation experte et publication.
- Grilles spécialisées (notamment questions conceptuelles L1), cohérence des critères et seuil N/E de 60 % à arbitrer.
- Traduire/localiser attendus et ancrages si le moteur évaluateur doit fonctionner indépendamment en anglais.
- Choix de stack et politiques de sécurité : **ouverts**, ne pas supposer Supabase installé.
- Les règles de protection de branche doivent être vérifiées avant d'affirmer une obligation PR.

## Registre des tâches à synchroniser vers ClickUp

Parent : [S2-03 — Créer banques de questions RH et techniques](https://app.clickup.com/t/123ru7uztgq).

Sous-tâches existantes constatées dans les captures utilisateur : `Conception & spécifications`, `Intégrer le Markdown dans GitHub`, `Implémentation & validation`. **Ne pas en recréer d'autres sans nécessité**.

À conserver terminées :
- Conception & spécifications — terminée.
- Intégrer le Markdown dans GitHub — terminé.
- Créer le corpus pilote 20 questions — terminé.
- Valider les 10 questions RH — revue éditoriale terminée.
- Auditer/corriger les 10 questions techniques avec l'IA — pré-audit terminé ; expertise encore ouverte.
- Intégrer le corpus pilote / documents sur GitHub — terminé.
- Tester les grilles sur réponses simulées — **test manuel documentaire terminé**, pas de moteur de scoring testé.
- Créer les 100 questions complémentaires — **rédaction brouillon terminée**, validation humaine encore ouverte.

À conserver ouvertes :
- Validation qualité métier du corpus complet (100 nouveaux brouillons + 10 techniques pré-auditées).
- Adaptation des relances génériques et harmonisation des catégories (à **ajouter dans la description/checklist de validation qualité**, pas nouvelle tâche parent).
- Localisation des attendus et critères d'évaluation si nécessaire (à **ajouter dans la même checklist**).
- Implémentation de la banque, stockage/versioning/migrations selon stack retenue.
- Autorisations et sécurité, y compris séparation interne/candidat.
- Connexion au moteur S2-04 et tests.
- Calibration définitive avec moteur réel en Sprint 3 (ne pas clore S3-01/S3-02 sur la seule base des 12 cas synthétiques).

**Synchronisation ClickUp : non réalisée lors de cet audit**. La connexion ClickUp a répondu `RATE_LIMIT_EXCEEDED`. Ne pas annoncer de changement de statut dans ClickUp ; appliquer le registre ci-dessus dès disponibilité.

## Conditions de clôture

S2-03 reste ouverte jusqu'à validation métier, banque effectivement implémentée, accès protégé, moteur connecté et tests acceptés. La documentation achevée n'équivaut pas à une livraison logicielle.
