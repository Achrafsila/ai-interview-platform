# Sécurité et confidentialité — état constaté le 22 octobre 2026

**État vérifié du dépôt : PUBLIC.** Ce dépôt est un dépôt documentaire/POC, sans autorisation de stocker des données réelles de candidats. Le passage en privé est une décision de gouvernance à prendre séparément.

## Règles minimales

- Aucun secret, clé API, jeton, identifiant opérationnel, fichier `.env`, CV réel, transcription, enregistrement ou donnée candidate réelle dans Git, les tickets ou les logs CI.
- Conserver les clés côté serveur et utiliser un gestionnaire de secrets ; jamais de clé `service_role` dans le navigateur.
- N'utiliser que des données fictives ou anonymisées et légalement réutilisables dans les corpus et tests.
- Faire valider finalité, consentement, durée de conservation, hébergement, accès, suppression et conformité locale avant toute collecte réelle.
- Appliquer le moindre privilège et les contrôles d'accès serveur ; les attendus/réponses de référence de la banque de questions ne doivent pas être exposés à l'interface candidat.
- Une question générée par IA reste `draft`/proposition jusqu'à revue humaine, puis publication explicitement autorisée.
- Une fuite de secret impose révocation/rotation immédiate, évaluation de l'exposition et nettoyage adapté de l'historique.

## État des protections GitHub

Les Pull Requests et la revue sont **recommandées**, mais les règles de branche ne sont **pas considérées comme obligatoires ni configurées** tant qu'un contrôle GitHub explicite ne le confirme. L'équipe peut décider d'activer un ruleset ultérieurement. Ne pas écrire qu'une protection existe avant vérification.

## Points de décision ouverts

1. Public ou privé à terme, et politique de collaborateurs.
2. Architecture d'hébergement/stockage et données traitées, notamment au Maroc.
3. Autorisations détaillées pour candidat, éditeur, réviseur et administrateur.
4. Rétention, export, effacement et audit des données et enregistrements.
5. Threat modeling et tests de sécurité avant exposition du POC.
