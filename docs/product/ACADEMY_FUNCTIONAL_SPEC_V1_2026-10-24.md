# InterviewLab Academy — Spécification fonctionnelle V1.0
**Date :** 24 octobre 2026. **Statut :** modèle fonctionnel hybride validé ; recette technique non clôturée.

## 1. Décision produit
Academy combine **un parcours de progression personnalisé prioritaire** et **une bibliothèque ouverte à l'exploration**. Chaque utilisateur peut choisir librement d'autres exercices. Aucune recommandation ne vaut évaluation de son employabilité. L'expérience doit rester cohérente avec le Design System V2.

## 2. Périmètre
Inclus : recommandation explicable, recherche/filtrage, exercices écrits et guidés, progression persistante, gestion éditoriale, enrichissement pédagogique, accès depuis le bilan.
Hors V1 : réservation effective de coach, paiement, crédits/parrainage, scores psychométriques, voix conversationnelle temps réel et certification. Les CTA futurs ne doivent pas simuler des fonctionnalités actives.

## 3. Catalogue et gouvernance
Chaque fiche publiée exige : ID stable, version, catégorie, compétence cible, objectifs, familles métiers, niveaux de séniorité, langue, difficulté, format, durée, consigne, contexte, étapes d'aide, grille d'observation **spécifique**, erreurs fréquentes, critère de complétion, statut de revue et date de mise à jour.
Statuts : brouillon → revue humaine → approuvé → retiré. Seuls les contenus approuvés sont normalement publiés ; brouillons autorisés en pilote interne clairement identifié. Contrôle par rôle et journal des modifications.
Le catalogue actuel contient **96 situations déclinées en 3 niveaux, soit 288 fiches**. Les trois niveaux partagent encore des grilles génériques : leur qualité pédagogique doit être enrichie avant homologation. Ces fiches ne constituent pas les 120 questions d'évaluation en attente de validation humaine.

## 4. Règles de gestion définitives
- **RG-01 — Hybride :** afficher une recommandation principale, jusqu'à trois alternatives, et un accès évident au catalogue intégral.
- **RG-02 — Profil :** réutiliser l'onboarding existant sans second formulaire imposé. Données absentes : repli sans blocage.
- **RG-03 — Métier :** privilégier les scénarios compatibles avec le poste ciblé tout en conservant les compétences transversales.
- **RG-04 — Séniorité :** découverte par défaut pour novice, approfondissement pour confirmé, challenges pour senior/manager ; ce sont des préférences, pas des restrictions.
- **RG-05 — Objectifs :** appliquer les préférences générales ; les modifications ponctuelles d'une simulation ne modifient jamais le profil par défaut.
- **RG-06 — Bilan :** utiliser exclusivement les observations suffisamment fiables et attribuables à une compétence. Un bilan indisponible ou une transcription incertaine ne pénalise jamais le candidat.
- **RG-07 — Recommandation :** calcul déterministe, versionné et explicable. Pondérations initiales configurables : bilan fiable 35 %, métier 25 %, séniorité 20 %, objectifs 15 %, diversité 5 %. Il s'agit d'une hypothèse produit non validée scientifiquement.
- **RG-08 — Données manquantes :** renormaliser les poids des signaux disponibles ; si aucun signal, afficher une sélection de découverte diversifiée.
- **RG-09 — Répétitions :** limiter les recommandations identiques successives sans masquer les exercices déjà pratiqués.
- **RG-10 — Explicabilité :** justifier chaque suggestion par un motif court et compréhensible, sans inférer de caractéristiques sensibles.
- **RG-11 — Accès libre :** recherche et filtres combinables par domaine, métier, niveau, langue, format, durée, compétence. Aucun verrou pédagogique arbitraire.
- **RG-12 — Complétion :** ouvrir une fiche ou saisir du texte ne suffit pas. Validation explicite nécessaire, idempotente par tentative.
- **RG-13 — Maîtrise :** distinguer « réalisé », « en cours d'apprentissage », « démontré » et « non évalué ». Ne jamais déduire un niveau du nombre de clics.
- **RG-14 — Retentative :** nouvelles tentatives distinctes, historique préservé et reprise possible.
- **RG-15 — Difficulté :** progression fondée sur des indices répétés et fiables ; aucune rétrogradation automatique à cause d'un échec isolé ou d'une erreur STT.
- **RG-16 — Données :** réponses et historique privés, rattachés au compte, avec RLS Supabase et vérifications serveur.
- **RG-17 — Accessibilité :** navigation clavier, contrastes, responsive sans défilement horizontal, mouvement réduit respecté et CTA clairement identifiables.
- **RG-18 — Intégrité :** aucun badge ou certification de compétence non mesurée ; aucun brouillon présenté comme officiellement validé.
- **RG-19 — Monétisation :** crédits et abonnements futurs séparés du score pédagogique ; fonctionnalités payantes à définir ultérieurement.
- **RG-20 — Ressources :** supports sourcés et vérifiés avec statut de validation et droits d'utilisation, sans lien fictif.

## 5. Logique recommandation V1
1. Filtrer les exercices publiés et accessibles, compatibles avec la langue.
2. Croiser compétences issues de bilans fiables, famille métier, séniorité et objectifs.
3. Calculer une affinité sur les dimensions disponibles, en repondérant les dimensions absentes.
4. Diversifier les recommandations, expliquer leur motif et permettre les choix alternatifs.
5. Enregistrer version de règle, horodatage et justification sans dupliquer le texte brut des réponses.
6. Pour profil vierge : recommandations de découverte sans questionnaire supplémentaire.

## 6. Expérience Academy V1
Accueil : priorité d'apprentissage + exercice recommandé + durée + difficulté + motif + alternatives + « Explorer tous les exercices ».
Catalogue : recherche, filtres combinables, état vide, retour arrière préservant les filtres.
Exercice : objectif, contexte, réponse, indices, grille spécifique, validation explicite, suggestion suivante.
Historique : exercices réalisés, tentatives, reprises et compétences travaillées, sans score inventé.
Bilan : recommandation vers Academy uniquement si interprétation suffisamment fiable ; sinon suggestions basées sur objectifs.

## 7. Modèle de données cible
Tables proposées : academy_exercises, academy_exercise_revisions, academy_attempts, academy_recommendations, academy_competency_progress, academy_content_reviews.
Tentative : attempt_id, user_id, exercise_id, revision, status, started_at, completed_at, answer_reference, self_review, session_goal_overrides.
RLS candidat : ses seules tentatives. Publication réservée aux rôles habilités. Accès coach aux réponses soumis à permissions explicites. Prévoir rétention, effacement et revue conformité avant vrais utilisateurs.

## 8. Critères de recette exécutables
| ID | Scénario | Attendu |
|---|---|---|
| REC-01 | Junior Data, pas de bilan | Recommandations accessibles de niveau découverte, liées à Data/PFE ou transversales |
| REC-02 | Manager senior, bilan fiable sur structuration | Challenge pertinent, explication visible et alternatives proposées |
| REC-03 | Transcription incertaine | Aucun faux point faible attribué, recommandations basées sur profil/objectifs |
| REC-04 | Profil vierge | Catalogue et découverte accessibles sans erreur |
| REC-05 | Métier inconnu | Repli transversal, recherche fonctionnelle |
| REC-06 | Objectif modifié seulement pour session | Préférences permanentes inchangées |
| REC-07 | Exploration hors recommandation | Tout exercice publié et autorisé accessible |
| REC-08 | Filtres combinés | Résultats exacts, compteur et état vide cohérents |
| REC-09 | Ouverture sans terminaison | Statut jamais marqué « terminé » |
| REC-10 | Validation exercice | Statut mis à jour une seule fois, sans doublon |
| REC-11 | Reconnexion | Historique et progression restaurés depuis Supabase |
| REC-12 | Reprise d'exercice | Nouvelle tentative distincte, historique conservé |
| REC-13 | Maîtrise | Aucune maîtrise ou note déduite d'une seule tentative non évaluée |
| REC-14 | Justification | Raison explicite pour chaque recommandation, source non sensible |
| REC-15 | Catalogue éditorial | Fiche approuvée dotée de critères propres ; fiche retirée non recommandée |
| REC-16 | Corpus brouillon 120 questions | Aucune présentation comme questions validées |
| REC-17 | Isolation utilisateurs | User A ne peut lire/altérer les données de User B, côté UI et API |
| REC-18 | A11y | Clavier, focus, contraste, mobile, reduced motion testés |
| REC-19 | Erreurs réseau | Message clair, possibilité de retry, pas de perte silencieuse |
| REC-20 | Réservation coach | Aucun faux booking possible dans Academy V1 |
| REC-21 | Gouvernance | Publication refusée aux rôles non autorisés et journalisée |
| REC-22 | Non-régression | Auth, onboarding, simulation, bilan, TypeScript, ESLint et build passent |

## 9. Définition de clôture
**Cadrage fonctionnel : validé.** Academy n'est **pas techniquement clôturée** avant implémentation des métadonnées, revues du contenu, recommandations effectives, persistance/RLS, progression et réussite documentée des REC-01 à REC-22 sur données fictives.
Restent à calibrer en recette : seuil de confiance des bilans, taxonomie métiers détaillée, rétention et droits Premium.

## 10. Ordre de livraison
A. Enrichir les contenus et grilles propres à chaque scénario. B. Ajouter tags métiers/niveaux et moteur de recommandation explicable. C. Persister tentatives/progression dans Supabase avec RLS. D. Recette multi-profils et contrôle qualité. E. Plus tard : formats vocaux évolués, plan 7/14 jours, gamification et commercialisation.
