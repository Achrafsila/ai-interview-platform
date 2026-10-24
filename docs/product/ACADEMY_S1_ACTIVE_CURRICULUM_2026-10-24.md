# Academy S1 — Curriculum actif et progression

Date : 24 octobre 2026. Statut : fonctionnalité développée, recette multi-profils à compléter.

## Inclus
- Le candidat peut choisir un des 47 parcours ; un seul parcours actif par compte est mémorisé dans `academy_active_paths` (Supabase, RLS propriétaire).
- Dans la vue Parcours, un bloc « Votre parcours actif » montre les étapes effectuées, un pourcentage d'activité et la prochaine étape non réalisée.
- Dans le détail d'un parcours, les exercices déjà pratiqués sont signalés par une coche et peuvent être refaits librement ; l'activation et le changement de parcours nécessitent un clic volontaire.
- Les étapes réalisées proviennent de `academy_attempts` ; un parcours est complété sur la base d'une tentative validée pour chaque exercice prévu, pas d'une maîtrise démontrée.
- Aucune restriction d'accès aux autres parcours et à la bibliothèque.

## Limites
- Le pourcentage mesure la complétion d'activités, pas une compétence acquise.
- Les parcours conservent leur sélection éditoriale de fiches et une adaptation limitée par priorité du bilan.
- Les tentatives chargées sont limitées aux 500 plus récentes ; à paginer pour des utilisateurs intensifs.
- Les bilans et la progression ne réévaluent pas encore automatiquement la difficulté ; c'est le sprint S2/S3.
- RLS contrôlée dans le schéma ; tests d'isolement entre deux comptes et tests navigateur à exécuter avant homologation.

## Tests minimum requis
1. Choisir un parcours, déconnexion/reconnexion : parcours actif conservé.
2. Réaliser une étape et revenir : activité cochée, prochain exercice actualisé.
3. Refaire une activité : une nouvelle tentative créée, total des étapes inchangé.
4. Changer de parcours : ancien historique conservé, nouveau parcours actif.
5. Tenter une modification cross-user depuis API Supabase : refus RLS.
6. Pas de faux score de maîtrise.
