# Academy — Campagne d'évaluation L&D Agent (24 octobre 2026)

## Objectif
Évaluer la compréhension des besoins et le contexte métier en conditions réelles, avec des scénarios fictifs, sans modifier les poids du modèle Groq.

## Protocole
- Banc d'essai : `scripts/test_academy_groq_dialogues.cjs`
- 29 cas annotés : RH et qualités/défauts, soft skills, commercial / entretien technique, métiers IT, stage PFE, stress, salaire, leadership, communication et conversations à plusieurs tours.
- Critères : intentions exigées présentes, intentions interdites absentes, sans inventer de parcours hors référentiel. L'évaluation passe par Groq puis les garde-fous L&D.
- Le banc d'essai arrête les appels en cas de 429 : les cas non exécutés restent **non évalués**.

## Résultats observés
- 12 premiers scénarios évalués, 12 réussis.
- Le 13e appel a retourné HTTP 429 (quota/rate limit). Les 17 derniers cas n'ont pas été évalués.
- Le score « 12/29 » serait incorrect : c'est **12/12 évalués** avec **17 non évalués**.
- Les 9 tests locaux de non-régression ont également réussi.

## Améliorations nécessaires avant qualification
1. Réexécuter les 17 scénarios restants après renouvellement du quota, idéalement à cadence contrôlée.
2. Évaluer séparément la qualité des clarifications et leur fréquence : une classification correcte ne garantit pas un bon dialogue.
3. Faire relire les contenus et la correspondance compétence → exercice par un expert L&D ; le référentiel actuel est une V1 éditoriale.
4. Tester le parcours authentifié de bout en bout, y compris la continuité de la recommandation entre Ask, Parcours, Exercice et sauvegarde.
5. Compléter un audit de confidentialité des conversations avant usage avec de vrais candidats.

## Terminologie
L'amélioration concerne les prompts, la validation des besoins et l'évaluation des décisions. Ce n'est pas un fine-tuning des poids du modèle `openai/gpt-oss-120b`.
