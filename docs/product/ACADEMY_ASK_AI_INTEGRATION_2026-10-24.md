# Academy — Added Value + Ask Coach IA

## Livré dans l'interface
- Proposition de valeur « Nous pensons que… » : privilégier le prochain défi utile et le parcours correspondant à l'objectif, plutôt qu'une masse de cartes.
- Champ Ask inspiré du composant utilisateur, réinterprété en style InterviewLab (clair, lavande, violet), sans sélecteur de modèles ni fonctions fictives.
- Appel serveur authentifié à `/api/academy/ask`, candidat uniquement, validation de longueur et d'origine, réponse JSON avec ID de parcours existant, motif et exercice concret ; aucun contenu brut enregistré.
- Liens directs vers parcours et exercice proposés.

## Conditions d'activation
- Sur le serveur Next.js, configurer `GROQ_API_KEY` dans un environnement serveur sécurisé (jamais `NEXT_PUBLIC_`). Optionnel : `ACADEMY_AI_MODEL`.
- Clé **absente** de `web/.env.local` à la date de livraison : requête répond 503 avec explication explicite ; ne pas annoncer le coach IA comme pleinement opérationnel avant essai authentifié bout en bout.
- Le composant fourni contenait des modèles tiers non vérifiés, une dictée de démonstration simulée et de faux délais de traitement ; ils ne sont pas repris.
- L'IA n'infère pas automatiquement un bilan ou un niveau utilisateur : la requête contient le besoin saisi et la liste des parcours. La recommandation est bornée aux parcours publiés dans le prototype.

## Recette encore nécessaire
- Configurer la clé en serveur et tester trois demandes candidat sur un compte de recette.
- Vérifier erreur réseau, erreurs fournisseur, saisies invalides, pages non autorisées et affichage mobile.
- Ajouter ensuite contexte personnel contrôlé (profil et bilan) avec revue des données envoyées au fournisseur et paramètres de conformité.
