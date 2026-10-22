# Checklist de livraison / démonstration POC

**Ne pas utiliser cette checklist pour déclarer que le POC est déjà prêt.** Elle s'appliquera quand un environnement applicatif aura été retenu et déployé.

## Produit
- [ ] Parcours candidat complet démontré avec données synthétiques
- [ ] Objectifs de préparation S2-01 persistés sans altérer les préférences permanentes
- [ ] Banque S2-03 validée et publiée de manière contrôlée
- [ ] Relances et déroulement S2-04 opérationnels
- [ ] Feedback et scoring du Sprint 3 expliqués avec éléments observables

## Technique
- [ ] Architecture, décisions, environnements et propriétaires approuvés
- [ ] Migrations, rollback, backups et reprise testés
- [ ] Authentification, rôles, RLS et séparation des secrets validés
- [ ] Contrôles automatiques et tests de régression réussis
- [ ] Logs, alertes, limites de quota/coût documentés

## Sécurité et conformité
- [ ] Pas de données de candidats réels dans les tests / GitHub
- [ ] Traitements, finalité, consentement, rétention et effacement validés
- [ ] Fournisseurs et localisation des données évalués
- [ ] Aucune réponse attendue interne exposée au navigateur candidat

## Gouvernance
- [ ] Changements documentés dans CHANGELOG et ADR
- [ ] Statuts ClickUp mis à jour sur preuves
- [ ] Critères d'acceptation signés par le Product Owner
- [ ] Go/No-Go consigné et rollback défini
