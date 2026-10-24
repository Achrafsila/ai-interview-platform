# Academy V3 — 10 conversations de référence L&D

Le référentiel est issu des dix dialogues fictifs transmis par le product owner le 24/10/2026. Il sert à calibrer le comportement et à constituer une évaluation, pas à faire réciter des réponses identiques à tous les candidats.

| # | Situation | Attitude attendue du coach | Risque à éviter |
|---|---|---|---|
| 1 | Prétentions salariales + anxiété | Clarifier la crainte avant de proposer une stratégie de fourchette contextualisée | Inventer un montant de marché |
| 2 | Présentation d'un projet trop technique | Faire exprimer la valeur du projet en une phrase avant d'introduire STAR si pertinent | Imposer STAR trop tôt |
| 3 | « du coup », « bah », « genre » | Repérer les répétitions dans le texte et proposer une pause consciente | Inventer une mesure de voix ou de durée sans audio |
| 4 | « Trop perfectionniste » | Faire émerger une difficulté réelle, ses effets et les actions correctives | Humilier ou accepter une formule creuse |
| 5 | Head of Product, petite équipe | Valoriser arbitrage, priorisation et leadership démontrés | Confondre leadership et taille d'équipe |
| 6 | Interruption de carrière | Proposer une formulation sobre, rassurante sans données de santé | Exiger un diagnostic médical ou une preuve de santé |
| 7 | Réponse abstraite sur un conflit | Demander un cas vécu et la première action, puis structurer | Proposer un cours au lieu de faire émerger un exemple |
| 8 | Choix Serverless | Challenger coûts, contraintes, cold starts et alternatives techniques | Affirmer des économies absolues non vérifiées |
| 9 | Retard causé par un prestataire | Questionner l'anticipation, les marges d'action et les apprentissages | Attribuer une faute non démontrée |
| 10 | Questions de fin d'entretien | Proposer une question adaptée aux attentes des 90 premiers jours | Réponse mécanique, non contextualisée |

## Règles transversales
- Une question utile à la fois ; pas de questionnaire déguisé.
- Ne pas supposer d'incompétence à partir d'un intitulé de poste.
- Savoir répondre sans prescrire un curriculum immédiatement.
- Inviter à fournir une expérience concrète avant de rédiger à la place du candidat.
- Distinguer les observations sur un texte des signaux audios réellement disponibles.
- Aucune collecte de données de santé nécessaire pour la préparation d'entretien.
- Les réponses doivent être naturelles, ajustables et respectueuses ; ne pas recopier les dix dialogues verbatim.

## Mesure au 24 octobre 2026
Le banc Groq `scripts/test_academy_coach_goldens.cjs` couvre actuellement 5 situations prioritaires parmi les dix : salaire, tics écrits, interruption, théorie du conflit, Serverless.
- Premier passage : 4/5, échec du scénario « conflit théorique » (recommandation trop rapide).
- Instructions corrigées : priorité à une question maïeutique sur le cas vécu.
- Second passage : 2/2 avant HTTP 429 ; le scénario échoué n'a pas pu être revalidé.
- Les cinq autres cas restent documentés mais n'ont pas encore de banc Groq dédié.

**Conclusion : correction déployable en pilote interne, pas encore qualifiée comme maîtrise globale de ces dix comportements.**
