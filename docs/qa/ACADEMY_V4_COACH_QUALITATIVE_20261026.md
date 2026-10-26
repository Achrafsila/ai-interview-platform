# Academy V4 — Recette qualitative du coach, campagne du 26 octobre 2026

## Périmètre et méthode
Tests de prompts Groq réels à partir des golden cases du dépôt. Contrôles automatiques de présence de réponse/question et de formulations interdites, complétés par une revue qualitative des extraits observés. Ne pas confondre ces contrôles avec une évaluation humaine exhaustive de réponses complètes ni avec les tests E2E API.

## Observations
- Première campagne : 3/3 évalués sur 5, 2 non évalués suite au quota. Le cas `career-break` a passé un filtre trop permissif alors que le coach proposait « pause santé ».
- Correctif proposé : consigne explicite d'éviter toute formulation révélant implicitement un motif médical, même si le candidat l'a évoqué dans sa demande ; règle de test étendue à « pause santé », « congé santé », « arrêt maladie », « raison médicale ».
- Deuxième campagne : 4/4 cas évalués sur 5 passent (`salary-anxiety`, `filler-words`, `career-break`, `theory-conflict`) ; `serverless` non évalué suite au quota Groq. **Campagne incomplète, pas de validation globale**.
- La campagne teste principalement des règles de contenu à un tour, et ne mesure pas encore systématiquement la progression sur 5–10 échanges, l'absence de contradiction et la pertinence du CTA L&D.

## Risques restants
- Score ne couvre ni variabilité du modèle entre runs, ni qualité du coaching métier sur la durée, ni justesse des recommandations.
- Quota Groq coupe les campagnes : prévoir une exécution par lots avec reprise et sans contournement des limitations.
- Revue de confidentialité à compléter pour les autres cas sensibles, et revue qualitative des réponses complètes plutôt que leurs 150 premiers caractères.

## Gate de livraison
Ne pas considérer V4 coaching qualitatif validé tant qu'un benchmark complet, plusieurs conversations multi-tours et une revue manuelle des réponses n'ont pas été réalisés.
