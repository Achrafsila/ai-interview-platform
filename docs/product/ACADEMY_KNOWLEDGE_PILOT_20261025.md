# Academy Coach V3 — Base de connaissances pilote

Date : 25 octobre 2026

## Fonctionnement livré
- Supabase : table `academy_knowledge` avec titre, domaine, contenu, provenance, statut draft/approved et colonne vector(1536) réservée.
- Les comptes candidats n'ont aucun droit de lecture directe sur la table ; seul un appel RPC authentifié retourne des extraits de statut `approved`.
- Première récupération **textuelle** via recherche plein texte française, limitée à 5 documents, avant l'appel à Groq.
- Contexte documentaire ajouté aux instructions du modèle comme information non fiable et non comme consigne à exécuter.
- Les références internes (titre et provenance) sont renvoyées par l'API et visibles sous la conversation lorsque des documents ont été utilisés.
- Aucun document en statut draft ne doit être exposé dans les résultats de recherche.

## Corpus pilote
- Trois fiches approuvées pour usage **interne** sur la méthode STAR, la confidentialité en cas d'interruption de carrière, et le cadrage du périmètre Staffing Manager/ESN. Ces fiches dérivent des scénarios de référence du produit, elles ne constituent pas un référentiel externe certifié.
- Une fiche de comparaison Serverless en statut `draft`, volontairement exclue de la recherche.
- Pas de nouvelles données personnelles de candidats ajoutées au corpus.

## Résultats
- API Next.js authentifiée : 14/14 tests, dont la référence Staffing Manager renvoyée par l'API.
- Régression métier : 9/9 ; vérification de cohérence du curriculum réussie.
- TypeScript, ESLint sur les fichiers Academy et build Next.js : réussis.
- Vérification Supabase des statuts : 3 documents `approved`, 1 document `draft`.

## Limites et étapes requises
1. **Pas encore de recherche vectorielle sémantique** : la colonne `embedding` est vide ; aucun fournisseur d'embeddings ni index vectoriel n'est intégré. Le moteur actuel est un RAG lexical à corpus limité.
2. Le corpus doit être étoffé avec des fiches métiers, compétences et contenus L&D dont la provenance et les droits d'usage sont vérifiés. L'approbation actuelle désigne uniquement les guides internes fournis par le projet, pas une certification professionnelle externe.
3. Tester explicitement depuis un compte candidat l'accès direct interdit à la table et l'exclusion de la fiche draft ; approfondir les tests de pertinence, couverture des questions et résistance aux instructions injectées dans les documents.
4. Introduire une recherche hybride lexicale/vectorielle après choix et configuration d'un modèle d'embeddings, puis benchmarker avec les conversations multi-tours existantes.
5. Obtenir les validations L&D et confidentialité requises avant usage avec des candidats réels.
