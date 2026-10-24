# Academy IA — activation et recette

## Activation locale (sur le Mac autorisé)
Exécuter `~/ai-interview-platform/scripts/activate_academy_ai.command` dans le Finder ou terminal et saisir une clé Groq personnelle sous saisie invisible. Le script conserve les paramètres Supabase existants, ajoute seulement `GROQ_API_KEY` et `ACADEMY_AI_MODEL` dans `web/.env.local`, définit des permissions 600. Ce fichier est ignoré par Git.

Redémarrer Next.js : le process déjà lancé ne prend pas automatiquement les variables de `.env.local` modifiées. Ne jamais communiquer la clé par chat ni la committer. L'API reste authentifiée et réservée au rôle candidat.

## Scénarios d'acceptation manuels
1. Connecté en `user` : ouvrir `/exercises`, démarrer un atelier et rédiger 50+ caractères.
2. Cliquer « Analyser ma réponse ». Une réussite doit produire trois éléments précis : observation, amélioration, prochaine tentative. Les refus fournisseur doivent afficher un état d'erreur explicite.
3. Modifier la réponse : l'analyse précédente doit être invalidée ; analyser à nouveau si besoin.
4. « Terminer et enregistrer » doit créer une tentative, avec feedback facultatif correspondant à la réponse exacte ; vérifier les RLS sur deux comptes.
5. Vérifier que le moteur ne produit aucune note de maîtrise non justifiée.
6. Le Ask Academy envoie la demande au même fournisseur et propose uniquement des liens d'exercices/parcours existants.

## État au moment de la rédaction
La variable GROQ_API_KEY était absente de `web/.env.local`. Le script d'activation est prêt mais il reste à renseigner une clé et à effectuer un essai réel. La présence d'une clé dans un autre processus local n'a pas été consultée ou copiée. Aucune validation fonctionnelle du fournisseur ne peut être annoncée à ce stade.
