# InterviewLab Academy — Recette et décision de livraison
Date : 24 octobre 2026
Statut : GO technique pour pilote interne sur données fictives. Validation humaine nécessaire avant ouverture à de vrais candidats.

## Périmètre livré
Le candidat décrit son objectif au coach conversationnel. L'API Next vérifie session, rôle, origine, format de requête et quota. Groq identifie le besoin et peut poser une clarification ciblée ; le référentiel L&D contrôle strictement les compétences et sélectionne des exercices du catalogue existant.

Les objectifs, un contexte court et les ateliers ordonnés sont enregistrés dans la table Supabase academy_learning_plans. Les vues Bibliothèque, Prochaine étape et Parcours réutilisent le programme. Les demandes « Et pour… » reprennent les objectifs enregistrés ; un changement explicite « Finalement, uniquement… » remplace les anciens besoins. Une discussion peut être relancée via « Nouvelle discussion ». Le contenu complet des échanges n'est pas persisté.

Chaque atelier comporte un objectif et une explication pédagogique. Des compétences différentes peuvent disposer d'exercices distincts, y compris quand elles appartiennent au même domaine. Si Groq est indisponible, la réponse signale le mode L&D de secours.

## Sécurité
- Projet Supabase : aqybktqgoartjiqoqcfg
- academy_learning_plans : RLS activée, politiques propriétaire uniquement (SELECT, INSERT, UPDATE, DELETE)
- academy_chat_limits : RLS activée, aucun accès direct aux comptes candidats
- Limitation via fonction academy_claim_chat_quota : 12 requêtes par minute et par utilisateur
- Validation serveur des identifiants d'exercices, contrôle de session et du rôle candidat
- GROQ_API_KEY uniquement serveur ; pas de secrets dans les logs de recette
- Données de test sur compte démo restaurées ou nettoyées après exécution

## Résultats et preuves
| Vérification | Résultat | Script |
|---|---|---|
| Intentions Groq, campagne antérieure après correction | 29/29 scénarios évalués | scripts/test_academy_groq_dialogues.cjs |
| Comportement et clarifications Groq (recette actuelle) | 6/6 | scripts/test_academy_ld_behavior.cjs |
| Règles L&D et cas métier | 9/9 | scripts/test_academy_matching.cjs |
| Validité du curriculum | 233 étapes, 12 thèmes, 5 cas, 0 échec | scripts/test_academy_curriculum.cjs |
| Intégrité du catalogue | 288 exercices, 47 parcours, 0 défaut structurel | scripts/test_academy_content.cjs |
| Lecture, écriture, isolation entre comptes | Succès | scripts/test_academy_db.cjs |
| API authentifiée : sécurité, continuité, sauvegarde | 11/11 | scripts/test_academy_api.cjs |
| Interface Chrome candidat | 5/5 | scripts/test_academy_browser.cjs |
| Quota : 13e demande refusée | 2/2 | scripts/test_academy_quota.cjs |
| TypeScript, ESLint et Next build | Validation requise | Console build |

Preuves techniques : docs/product/evidence/ACADEMY_QA_ACCEPTANCE_20261024.log et docs/product/evidence/ACADEMY_GROQ_BEHAVIOR_20261024.log. La campagne 29/29 a été effectuée lors des itérations précédentes ; elle ne doit pas être présentée comme une performance universelle statistiquement représentative.

## Reproduction
Depuis la racine du dépôt, avec le serveur Next sur http://localhost:3000 et les accès de démonstration locaux :
1. node scripts/test_academy_matching.cjs
2. node scripts/test_academy_curriculum.cjs
3. node scripts/test_academy_content.cjs
4. node scripts/test_academy_db.cjs
5. node scripts/test_academy_api.cjs
6. node scripts/test_academy_browser.cjs
7. node scripts/test_academy_ld_behavior.cjs
8. START_CASE=0 node scripts/test_academy_groq_dialogues.cjs (quotas Groq)
9. node scripts/test_academy_quota.cjs, sur un compteur démo réinitialisé

## Critères de release
GO pour pilote technique interne avec données fictives : authentification, protection, recommandations, progression et continuité testées.

NO-GO temporaire pour candidats réels : les exercices et questions restent des contenus pilotes nécessitant une validation éditoriale humaine L&D ; le traitement externe des conversations par Groq nécessite une revue confidentialité/conformité, puis des tests utilisateurs et un suivi qualité/quotas. Aucune maîtrise de compétence n'est certifiée automatiquement. La voix, les pièces jointes et la persistance intégrale de la conversation ne sont pas incluses.

Le modèle Groq n'a pas été fine-tuné dans ses poids : ce lot livre une orchestration pédagogique encadrée, des garde-fous, des tests et des outils de validation.
