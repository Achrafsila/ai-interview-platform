# Academy V2 — Synthèse pédagogique multi-besoins (lot pilote)

## Cas de référence
Candidat : « J'ai du mal avec les questions RH et les soft skills » → « entretien final DRH » → « structure, soft skills, qualités/défauts » → « et les soft skills ? ».

Le nouveau moteur `ld-synthesis.ts` extrait plusieurs axes de ces messages, donne priorité à ceux du dernier message, conserve jusqu'à quatre thèmes uniques et sélectionne un atelier par thème dans les parcours L&D existants. Il évite les exercices strictement dupliqués.

## Interface
Le chat rend une liste d'ateliers liés à ces thèmes. Le candidat peut cliquer chaque exercice, consulter le parcours proposé et préciser le programme par message. L'IA conversationnelle reste chargée de la clarification, pas du choix arbitraire de fiches. Aucun parcours inédit n'est généré.

## Limites à traiter
- La synthèse utilise des règles transparentes ; revue et amélioration par L&D requises.
- Le curriculum composite n'est pas encore enregistré comme parcours unique dans Supabase. Les clics ouvrent les exercices réellement existants.
- Pas encore de synchronisation avec la carte « Votre prochaine étape » ; pas d'affirmation de continuité automatique.
- Le chat garde un historique court côté client pendant la session, sans persistance longue durée. Le modèle Groq sert à formuler des clarifications, mais la disponibilité réelle nécessite une recette authentifiée.
- Nécessité de tester plusieurs scénarios : RH/STAR/soft skills, entretien technique seul, changement de sujet, nouveau besoin sans rapport, répétitions.
