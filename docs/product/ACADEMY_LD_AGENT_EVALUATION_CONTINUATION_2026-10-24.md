# Academy L&D Agent — continuation des essais Groq

Le jeu comporte 29 conversations fictives annotées pour détection de besoins métier. Les 12 premiers cas avaient réussi. Une reprise via `START_CASE=12 node scripts/test_academy_groq_dialogues.cjs` a évalué 15 cas supplémentaires, tous réussis. La requête suivante, `recruiting-skills` (index 27 en base zéro), a reçu HTTP 429 ; `stress-oral` (index 28) n'a pas été exécutée.

**État : 27/27 classifications réussies parmi les cas exécutés, 2 non évalués.** Ne pas décrire ce résultat comme 29/29. Les métriques portent sur les intentions exigées/interdites après garde-fous L&D, pas sur la pertinence éditoriale des ateliers ni sur la qualité des questions de clarification.

Pour reprendre uniquement les deux cas restants : `START_CASE=27 node scripts/test_academy_groq_dialogues.cjs` depuis la racine du dépôt, après rétablissement du quota. Le banc arrête automatiquement la campagne sur 429 et affiche le nouvel index de reprise.

Les critères non encore couverts sont : qualité des clarifications, abandon/reformulation du candidat, changements d'objectif exclusifs, rémanence en session, sélection de contenus validés et persistance du curriculum. Ces éléments doivent faire partie d'une campagne séparée avec validation humaine L&D.
