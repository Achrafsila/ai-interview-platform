# Simulation IA locale — S2-04 (prévisualisation de brouillons)

## Ce qui est livré

Le parcours [E2E nouveau candidat](NEW_USER_E2E.md) peut désormais fonctionner avec **un véritable modèle IA** pour générer une relance en fonction de la réponse du candidat, puis un bilan qualitatif sans score. Cette branche ajoute le mode « Entretien avec relances IA » et des objectifs qui se mettent à jour selon le type d'entretien.

### Objectifs RH

Motivation/projet, présentation du parcours, communication et structure des réponses comportementales, collaboration, leadership, conflits, mises en situation, confiance et stress. Les objectifs du profil restent les préférences par défaut.

### Objectifs techniques

Fondamentaux, résolution de problèmes, architecture, débogage, bonnes pratiques, raisonnement, communication technique et gestion d'incident. Les sujets supplémentaires dépendent de la spécialité :

| Spécialité | Thèmes disponibles |
|---|---|
| Software Engineering | API / backend, architecture système |
| Data & IA | SQL, pipelines/qualité des données, machine learning |
| Cloud & DevOps | Cloud/infra, CI/CD, observabilité |
| Cybersécurité | Vulnérabilités, modèles de menace, IAM |
| Testing & QA | Automatisation, stratégie et qualité des tests |
| Business Analysis | Cadrage des besoins, user stories, parties prenantes |

Les objectifs RH n'apparaissent pas dans un entretien technique et inversement. Chaque sélection vaut **pour une simulation** et ne modifie jamais les préférences de l'onboarding.

## Démarrage sur Mac

À la racine du dépôt GitHub à jour :

\`\`\`bash
git pull origin main
export OPENAI_API_KEY="votre_cle_api_personnelle"
# Facultatif :
export OPENAI_MODEL="gpt-4.1-mini"
python3 dev/local-preview/server.py
\`\`\`

Ouvrir <http://127.0.0.1:8765/e2e>, puis **Tester le parcours complet**. Terminer l'onboarding de démonstration, configurer RH ou technique et choisir **Entretien avec relances IA**. Accepter explicitement l'envoi des réponses au fournisseur IA avant de démarrer.

**Sans \`OPENAI_API_KEY\`** : l'option IA est désactivée ; le mode guidé sans IA reste disponible.

Une souscription ChatGPT ne fournit pas automatiquement une clé API. Les appels à l'API OpenAI peuvent être facturés séparément. Créer la clé dans [OpenAI API Keys](https://platform.openai.com/api-keys) et consulter les [tarifs API](https://platform.openai.com/pricing).

### Ce que fait le moteur IA

1. Sélectionne localement des questions issues du corpus de développement selon la famille RH/technique, la spécialité et le niveau.
2. Montre une question et recueille une réponse.
3. Envoie la **question, la réponse, les objectifs de préparation et l'éventuelle description du poste** à l'API Responses d'OpenAI via **le serveur Python**.
4. Affiche une **relance générée par un modèle** à partir de la réponse et permet de répondre.
5. Passe à la question suivante ; en fin d'entretien, génère un **bilan qualitatif prudent**, sans barème, décision de recrutement ni note automatisée.

Le navigateur ne reçoit jamais la clé API. Le serveur ne transmet aucun attendu de réponse ou barème interne au modèle ni au candidat. Les requêtes utilisent \`store: false\` et les réponses ne sont conservées qu'en mémoire du serveur pendant la simulation. Quitter le serveur supprime cette mémoire.

Pour respecter la confidentialité, **ne pas utiliser de données personnelles sensibles ou de vraies réponses de candidats** dans le laboratoire. Une case de consentement à l'envoi des réponses doit être cochée pour démarrer le mode IA.

## Statut du référentiel : disponible en test, non publié officiellement

Les **120 questions** sont utilisables dans le laboratoire local à partir des fichiers JSON GitHub, avec un badge \`draft_preview\`. Cela ne modifie pas leurs statuts dans le projet Supabase.

Dans Supabase, les 120 restent **\`draft\`**, \`approved_for_publication=false\`. La publication officielle est conditionnée à la validation humaine de chaque question et des grilles ; on ne déclare pas fictivement un expert relecteur ou une approbation globale. Le service sécurisé de production reste inaccessible aux questions non publiées.

Cette distinction est intentionnelle : l'utilisateur peut commencer **tout de suite** à tester la qualité d'un entretien IA et demander des corrections, avant d'autoriser une publication finale du corpus.

## Vérifications

\`\`\`bash
python3 -m unittest discover -s tests -p 'test_ai_interview_lab.py' -v
python3 -m unittest discover -s tests/e2e -v
\`\`\`

Les tests du mode IA utilisent un **faux fournisseur** (aucun coût, aucune requête externe) : validation RH/tech, isolation des familles, générateur de relance, conformité des arguments au contrat OpenAI, refus d'une simulation sans clé, consentement et parcours navigateur. La **vraie génération OpenAI** exige une clé valide et une connexion depuis le Mac et n'est pas revendiquée par la CI.

### Hors périmètre de ce test

- Il ne s'agit pas du moteur conversationnel de production S2-04, de transcription, d'avatar ou de synthèse vocale.
- Aucun entretien n'est sauvegardé dans Supabase.
- Aucune note/scoring automatique n'est attribuée.
- Aucune question n'est officiellement publiée dans le référentiel privé sans validation humaine.

## Problèmes courants

- **Option IA grisée** : arrêter le serveur, définir \`OPENAI_API_KEY\` dans le Terminal qui le lance, puis redémarrer.
- **Réponse HTTP 401 du fournisseur** : vérifier que la clé possède accès au modèle demandé et que la facturation de l'API est configurée.
- **Réponse HTTP 429** : vérifier les quotas API. Ne pas relancer en boucle.
- **Le domaine ne change pas** : la spécialité est visible uniquement quand \`Entretien technique\` est sélectionné.
- **Aucun résultat** : choisir une difficulté plus large. Toutes les catégories n'ont pas des questions à chaque niveau.
