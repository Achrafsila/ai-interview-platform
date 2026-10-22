# Conventions de contribution

## Branches et commits

- Branche de référence : `main`. Préférer les branches `feat/<ticket>-<sujet>`, `fix/<ticket>-<sujet>`, `docs/<ticket>-<sujet>`.
- Commits Conventional Commits (`feat:`, `fix:`, `docs:`, `test:`, `chore:`).
- Lier les livrables aux tickets ClickUp et fournir les preuves de test dans la description.

## Flux recommandé

1. Vérifier le README, le registre des décisions et le ticket ClickUp.
2. Effectuer la modification sur une branche dédiée quand c'est pertinent et ouvrir une PR pour revue.
3. Vérifier les tests concernés et la sécurité, puis documenter ce qui a réellement été testé.
4. Fusionner selon les permissions et règles **effectivement configurées**. Une revue est recommandée, mais non réputée techniquement obligatoire sans ruleset.
5. Mettre à jour les décisions et les statuts ClickUp **uniquement après vérification des livrables**.

## Banque de questions S2-03

- Lancer `python scripts/validate_question_bank.py` après modification du JSON.
- Ce validateur vérifie la structure et la couverture, **pas** l'exactitude métier ou la fiabilité des notes.
- Les 120 questions sont `draft`. Aucun agent ne doit les déclarer publiées ou approuvées métier.
- Ne jamais transformer automatiquement une proposition IA en question publiée.
- Après modification d'une question publiée (quand le système existera), créer une nouvelle version au lieu d'écraser l'historique.
- Pour le statut, consulter `docs/S2-03_Implementation_Tracker.md` et `docs/S2-03_120_Questions_Status.md`.

## Definition of Done

Démonstration fonctionnelle, critères d'acceptation vérifiés, tests appropriés passés, risques de données/sécurité évalués, documentation à jour et décision du responsable métier. **Une spécification complète ne constitue pas une implémentation terminée.**

## Responsabilités indicatives

Product Owner : Achraf. Référents techniques : Othmane / Mehdi, sous réserve de confirmation de l'équipe.
