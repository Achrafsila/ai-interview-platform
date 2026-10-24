# InterviewLab Academy — Curriculum V1 : architecture pédagogique
Date : 24 octobre 2026. Statut : **proposition structurée à implémenter**, complément de la spécification fonctionnelle Academy validée.

## Principe
Le curriculum est un **parcours guidé mais non imposé**. Academy conserve son catalogue exploratoire. Les 288 fiches représentent 96 scénarios multipliés par 3 niveaux, **pas 288 cas indépendants**. Chaque module du curriculum utilise des exercices du catalogue, mais pourra à terme inclure audio, vidéo, micro-défis et retours d'experts.

## Architecture des apprentissages
| Module | Compétence visée | Contenu principal | Prérequis conseillés |
|---|---|---|---|
| C01 — Se présenter | Pitch, récit professionnel, proposition de valeur | Présentation & pitch, stages/premier emploi | Aucun |
| C02 — Se positionner | Motivation, objectifs, cohérence poste/entreprise | Motivation & projet | C01 conseillé |
| C03 — Structurer | STAR, synthèse, impact, preuves | Structure des réponses | C01 |
| C04 — Communiquer | Clarté, écoute, reformulation, éloquence | Communication & éloquence | C01 |
| C05 — Gérer la pression | Question surprise, objection, confiance | Confiance & stress | C03 conseillé |
| C06 — Raconter ses comportements | Éthique, collaboration, conflits, apprentissage | Comportemental & soft skills | C03 |
| C07 — Convaincre | Négociation, questions difficiles, projection | Négociation | C02 et C05 conseillés |
| C08 — Résoudre | Problèmes, priorités, arbitrages, décisions | Résolution de problèmes | C03 |
| C09 — Adapter au métier | Cas techniques, métier et contexte du poste | Techniques & métiers | C03 et C08 conseillés |
| C10 — Manager | Vision, délégation, influence, décisions complexes | Leadership & management | C06, séniorité suggérée mais non bloquante |
| C11 — Décrocher une première opportunité | Stages, PFE, premier emploi | Stages & premier emploi | C01 |
| C12 — Réussir à l’international | Anglais pro, collaboration, contextes multiculturels | Entretiens internationaux | C01 et C04 conseillés |

## Trois niveaux d'un module
- Découverte : une seule compétence par exercice, indices visibles, exemple d'entrée de gamme.
- Approfondissement : plusieurs compétences reliées, autonomie partielle, preuve et justification.
- Mise en situation : scénario plus exigeant, objection, compromis, gestion de relance.
- Les niveaux sont conseillés et **jamais verrouillés**.
- « Exercice réalisé » ≠ « compétence maîtrisée ». Aucun passage de niveau automatique sans indices fiables de qualité.

## Règles de séquencement
1. Accueil : afficher **un objectif prioritaire**, 3 exercices maximum pour commencer, et accès « Explorer tout Academy ».
2. Onboarding : profil junior → privilégier C01, C03, C11 ; expérimenté → C02, C06, C09 ; manager → C07, C08, C10. Les compétences faibles fiables sont prioritaires.
3. Bilan fiable : mapper un axe d'amélioration vers le module correspondant ; bilan incertain → profil et objectifs uniquement.
4. Démarrage sans profil : suggérer C01, C03 et C04, sans prise de décision opaque.
5. Si le candidat choisit un module manuellement, ne pas altérer ses préférences générales.
6. Répétition : éviter de proposer systématiquement un exercice terminé ; permettre de le refaire volontairement.
7. Diversification : après 2-3 exercices ciblés, proposer une application dans un nouveau contexte métier.
8. Mesure : enregistrer complétion explicite, auto-évaluation, tentative, compétence pratiquée et difficultés déclarées ; la maîtrise exige une évaluation ultérieure fiable, non déduite du simple clic.
9. Tout module peut proposer une « simulation de consolidation » hors Academy ; ne pas modifier l'algorithme d'entretien existant.
10. Langue : respecter la langue de session ; l'exercice international peut autoriser l'anglais explicitement.

## Parcours types (illustratifs)
**Junior Data Analyst** : C01 présentation de PFE → C03 STAR → C11 valoriser un stage → C09 expliquer un projet Data → C04 vulgariser → simulation RH.
**Senior manager** : C02 positionnement → C06 situations de leadership → C10 délégation et influence → C08 arbitrages → C07 négociation → simulation senior.
**Transition de carrière** : C01 récit de transition → C02 motivations → C03 compétences transférables → C05 objections → C09 métier ciblé.
Chaque parcours est dynamique et modifiable : aucun « curriculum unique » ne doit s'appliquer à tous.

## Livrables techniques suivants
1. Taxonomie normalisée métier/séniorité/compétence et tags par exercice.
2. Modèle de données curriculum : modules, séquences, prérequis conseillés, objectifs mesurables, statut éditorial, correspondances avec fiches.
3. Moteur de recommandations transparent, testable avec profils fictifs.
4. Vue « Mon parcours » : étape courante, raison de la suggestion, alternatives, progression (sans score artificiel).
5. Persistance Supabase + RLS et recette fonctionnelle complète.

## Critères de validation curriculum
- Junior/senior/mobilité : parcours différents et cohérents, justification visible.
- Pas de blocage des autres exercices ; parcours modifiable.
- Bilan douteux ne génère pas de baisse de niveau.
- Réalisation explicite, reprise et historique fiable.
- Pas de curriculum inventé comme « certifié » ou « validé par un expert ».
- Accessibilité et responsive, aucune régression de la simulation ni du bilan.

## Réserves de qualité sur l'enrichissement A2
- A2 couvre maintenant 12 domaines, soit 96 scénarios et 288 déclinaisons avec guidage par situation/niveau.
- Les exemples d'A2 hors six pilotes restent essentiellement des **trames de réponse** ; ce n'est pas équivalent à des 288 corrections individuelles premium.
- Les critères et méthodes sont adaptés au thème mais encore partiellement construits sur un cadre commun. Aucune homologation humaine ou publication à de vrais candidats ne doit être inférée de cet enrichissement automatisé.
