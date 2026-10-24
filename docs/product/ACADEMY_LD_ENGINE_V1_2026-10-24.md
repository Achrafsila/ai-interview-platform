# Academy — moteur de recommandation L&D V1.1

Statut : moteur de sélection pédagogique fondé sur des règles et des données réelles disponibles, **non adaptatif au sens maîtrise mesurée / séquencement par acquis**.

## Sources exploitées
- Profil Supabase : expérience, objectif professionnel, objectifs de préparation.
- Dernier résultat d'entretien **terminé**, éligible au retour et contenant une priorité pédagogique explicite : catégorie de compétence reconnue par dictionnaire prudent ; rejet si ambiguë ou absente.
- Métier : dernier titre de poste renseigné dans un entretien terminé ; dictionnaire métier. Pas de déduction d'un métier depuis le nom ou les données personnelles.
- Aucun faux historique d'entraînement ; la table de tentatives Academy n'existe pas encore.

## Arbitrages L&D
- 35 points maximum pour priorité du bilan, 25 pour métier, 20 pour adéquation de difficulté, 15 pour objectifs de préparation, 15 pour intention de carrière. Ces points sont des heuristiques internes et ne correspondent ni à une note candidat ni à une probabilité de réussite.
- Les suggestions présentent une raison simple ; diversification par famille de parcours ; choix libre de tout autre parcours.
- Dans un parcours recommandé, le module correspondant à la priorité du bilan est proposé d'abord ; l'ordre éditorial des autres étapes reste stable.
- Si aucun bilan fiable, ne pas exploiter la transcription comme diagnostic ; si aucune donnée, proposition généraliste de découverte.
- Ne pas affirmer de progression mesurée, ni attribuer « maîtrisé » sans évidence pédagogique suffisante.

## Recette L&D et dette technique
- V1.1 vérifiée par typecheck, lint et build. Avant diffusion : tests scénarisés d'utilisateurs junior, senior, mobilité, bilans absents et bilan ambigu.
- Métier ciblé actuellement inféré du titre du dernier entretien et non du profil permanent (le profil n'a pas ce champ).
- Les bilans de la simulation locale non sauvegardés ne peuvent pas encore personnaliser la sélection après la séance.
- À construire ensuite : ontology de compétences/métiers, provenance et confiance des observations, tracking réel des tentatives Supabase/RLS, algorithme « practice → evidence → feedback → spaced retrieval → transfer → reassess », versionnage et mesure d'efficacité par cohortes.
