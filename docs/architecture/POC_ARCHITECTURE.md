# S1-02 — Architecture cible du POC (proposition à valider)

**Statut : proposition / non implémentée.** Architecture logique indépendante de la stack et des fournisseurs. Ne constitue pas une approbation d'hébergement, de sécurité ou de traitement de données.

## Objectifs et périmètre
POC en quatre sprints : onboarding candidat adaptatif, entretien IA avec avatar/voix/vidéo, transcription, évaluation post-entretien par grille versionnée, coaching IA, coaching humain optionnel, suivi candidat et administration. FR/EN. Aucun scoring définitif en cours de conversation.

## Composants logiques
1. **Client candidat** : consentement, profil, préparation, session entretien, résultats/coaching.
2. **Console admin / coach** : configuration des parcours, questions, rubriques, ressources, revues autorisées.
3. **API applicative** : authentification, autorisations RBAC, validation, orchestration et audit.
4. **Orchestrateur d'entretien** : état de session, sélection adaptative des questions, contraintes de durée, gestion des interruptions et reprise.
5. **Adaptateurs fournisseur** : avatar temps réel, STT, TTS, LLM; interfaces interchangeables et timeouts/retry contrôlés. Vérifier très tôt latence, qualité FR/EN, compatibilité navigateur et coût.
6. **Pipeline post-session** : finalisation transcript, scoring explicable selon version de rubric, recommandations et coaching. Statut « en attente » si données insuffisantes.
7. **Persistance** : données relationnelles, références aux objets médias séparés, événements/audit, politiques de rétention.
8. **Observabilité** : erreurs, latences, quotas et coûts; aucun contenu sensible dans les logs par défaut.

## Parcours principaux
- **Onboarding** : compte -> notice et consentement explicite -> profil -> objectifs -> parcours conseillé.
- **Entretien** : autorisation -> création session -> questions -> réponse multimodale -> transcript -> fin explicite -> évaluation asynchrone -> rapport.
- **Coaching** : rapport -> axes d'amélioration -> ressources -> exercices IA -> éventuelle demande de coach humain.
- **Admin** : configuration questions/rubrics versionnées -> publication -> consultation de métriques agrégées selon rôle.

## Frontières de confiance et confidentialité
- Vérifier identité côté serveur et autorisation **à chaque accès** aux sessions, transcripts, évaluations et médias.
- Consentement distinct pour capture audio/vidéo et éventuels transferts vers fournisseurs; retrait et suppression à concevoir.
- Ne pas enregistrer de média avant consentement; éviter données personnelles dans prompts/logs.
- Stockage privé et URL médias temporaires; chiffrement transit/repos, séparation des environnements et secrets gérés hors Git.
- Évaluer conformité juridique applicable (dont Maroc), transferts internationaux, contrats sous-traitants, durée de conservation et suppression.
- L'IA fournit un feedback d'entraînement, pas une décision d'embauche automatisée.

## Résilience et qualité
- États explicites : draft, ready, in_progress, interrupted, completed, processing, evaluated, failed.
- Idempotence des événements de fin et des jobs de scoring; retry borné, circuit breaker/fallback si fournisseur indisponible.
- Tests contractuels adaptateurs, RBAC, isolation entre candidats, consentement, scoring reproductible par version.
- Mesurer coût/session, latence voix-avatar, taux d'échec et qualité de transcription FR/EN sur scénarios synthétiques.

## Décisions ouvertes / gates
- Stack frontend/backend, base de données, hébergement, stockage média, auth, services temps réel et budget : **non décidés**.
- POC fournisseur avatar/voix avant engagement d'architecture.
- Valider schéma, matrice d'accès, politique de rétention et limites fonctionnelles avec l'équipe.
- Définir seuils mesurables d'acceptation (latence, fiabilité, coût, qualité FR/EN) avant intégration.
