# Academy V4 — Orchestration conversationnelle, tranche 1

Objectif : séparer le constat du candidat, les décisions d'orientation et la prescription du référentiel L&D.

## Livré
- Module `diagnostic.ts` séparé de l'API : états `exploration`, `coaching`, `training`, objectif, rôle, preuves exactes du candidat et questions ouvertes.
- La sortie structurée Groq inclut un bloc `diagnostic`; une preuve n'est acceptée que si sa phrase existe réellement dans l'historique du candidat. Les hypothèses ne deviennent pas des faits.
- Une recommandation nécessite conjointement un besoin concret exprimé, une intention d'entraînement et la décision `recommend` du LLM. Le simple intitulé du poste ne suffit plus.
- Lorsque Groq ne répond pas, l'API conserve la conversation mais **ne crée plus automatiquement de programme en mode secours**.
- Tests unitaires de décisions de diagnostic : 9/9.

## Limites et validation avant généralisation
- Première tranche **sans stockage durable du diagnostic**, ni machine à états persistée dans Supabase. Le contexte est reconstruit sur les tours transmis par l'interface.
- La qualité sémantique des preuves reste limitée : l'extraction structurée n'est pas une vérification de la véracité du candidat.
- Les tests d'intégration Groq ont été irréguliers lors de la campagne (15/18 puis 6/18), ce qui empêche de considérer la régression globale comme validée. Investiguer les codes HTTP/quota avant de confirmer la stabilité.
- Valider les parcours d'exercices déjà précis (stage PFE, RH final, etc.), les conversations longues et la continuité entre sessions avant activation complète.
- La recherche sémantique vectorielle sur Vercel reste un chantier distinct.
