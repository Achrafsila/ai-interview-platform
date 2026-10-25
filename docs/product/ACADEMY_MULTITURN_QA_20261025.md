# Academy Coach V3 — Recette conversations multi-tours
Date : 25 octobre 2026

## Objectif
Tester les dix comportements L&D de référence dans de véritables dialogues Groq à deux tours, avec le contexte réinjecté entre la première et la deuxième réponse. Le test ne modifie aucune donnée candidat et ne prétend pas évaluer une voix ou un audio.

## Résultats observés
- Campagne initiale complète : **9/10** scénarios réussis ; unique échec `career-break` (proposition inappropriée « congé de santé »).
- Instruction L&D renforcée : ne jamais proposer de révéler une raison médicale quand le candidat souhaite garder sa vie privée ; privilégier « période d’interruption professionnelle ».
- Re-test ciblé du scénario échoué : **PASS** ; Groq recommande « interruption professionnelle » / « période d’inactivité » sans demander de justification médicale.
- **Bilan cumulé : 10 scénarios / 10 validés**. Ce résultat agrège la campagne initiale et le re-test ciblé : il ne constitue pas un unique run de 10/10 après correction.
- Les erreurs provisoires `HTTP 400 Failed to generate JSON` ont motivé une nouvelle tentative stricte (`temperature=0`, JSON concis) ; les `429` sont gérés par attente et reprise. Les résultats sont historisés scénario par scénario.

## Couverture
1. Anxiété liée au salaire : questionnement, fourchette, sans chiffre inventé.
2. Projet trop technique : traduction en impact métier et structuration.
3. Tics de langage écrits : pause sans prétendre analyser un audio.
4. Perfectionnisme : exemple concret de délégation.
5. Head of Product, petite équipe : valorisation des arbitrages.
6. Interruption de carrière : discrétion sur les motifs personnels.
7. Conflit traité théoriquement : recherche d'un cas vécu.
8. Serverless vs Kubernetes : contraintes et compromis.
9. Retard prestataire : anticipation et apprentissages.
10. Questions de fin d'entretien : projection dans le poste.

## Reproduire
Depuis la racine du dépôt sur Mac, avec `web/.env.local` configuré :
```
node scripts/test_academy_multiturn.cjs
RETEST_ALL=1 node scripts/test_academy_multiturn.cjs
START_CASE=5 node scripts/test_academy_multiturn.cjs
```
Le script évite les scénarios déjà réussis (fichier JSONL local) sauf avec `RETEST_ALL=1`. Après 429, il attend 65 secondes puis réessaie, au maximum trois fois. Le fichier `docs/product/evidence/ACADEMY_MULTITURN_RESULTS_20261025.jsonl` garde des preuves horodatées et les éventuelles erreurs provisoires.

## Limites
Ces critères automatisés comprennent des vérifications lexicales minimales et des interdits explicites ; ils ne remplacent pas une revue humaine de qualité conversationnelle ni une mesure de stabilité statistique. La publication de contenus destinés à de vrais candidats requiert toujours une approbation L&D et confidentialité.
