# UX-06 — Bienvenue cinématique & règle de reconnexion

**État : prototype UX V4, 23 octobre 2026.** Frontend Next.js, non lié à Supabase Auth.

## Deux moments différents

| Moment | Parcours cible | État |
|---|---|---|
| Première inscription | Auth → onboarding 5 étapes → bouton « C'est parti ! » → **une seule scène de bienvenue animée** → « Découvrir notre espace » → dashboard | Scène implémentée en frontend ; Auth encore à intégrer |
| Connexion d'une personne dont l'onboarding est terminé | Auth → **« Bon retour parmi nous, [prénom] »**, bref accueil → **dashboard directement** | Règle UX validée, composant Auth/route encore à créer après réception de la référence sign-in |
| Compte créé mais onboarding incomplet | Auth → reprise de l'étape non complétée, avec réponses précédentes préremplies | À implémenter avec état profil en base |

**La décision de routage ne doit pas dépendre de sessionStorage ou d'une simple adresse email :** dans la vraie version, lire la session Supabase authentifiée et l'état de complétion du profil utilisateur. Pas de redirection vers l'onboarding à chaque reconnexion, pas de faux login côté navigateur.

## Scène cinématique V4

La séquence est intégrée **dans le même parcours**, sans seconde page/rubrique et sans répétition de l'ancien récapitulatif.

1. Le panneau d'onboarding laisse place à une scène plein cadre bleu nuit, verre, halo et profondeur.
2. « Bienvenue, [prénom]. » apparaît avec une entrée douce.
3. « Votre objectif est clair. Maintenant, on va le préparer ensemble. » est révélé mot par mot.
4. Trois cartes se révèlent successivement : **NOTRE OBJECTIF**, **CE QU'ON VA TRAVAILLER**, **ON S'ENTRAÎNE EN**. Ce sont les vrais choix du formulaire, sans statistiques fictives.
5. Bouton unique « Découvrir notre espace » → dashboard (seul écran suivant). « Précédent » → dernière étape, réponses conservées.
6. « Passer l'animation » coupe l'attente, mais pas les informations ; le CTA reste utilisable. `prefers-reduced-motion` rend tout immédiatement, sans motion inutile.

Fichiers : `web/src/components/ui/welcome-sequence.tsx`, `web/src/components/ui/onboarding-stages.tsx`, `web/src/app/globals.css`. La scène est en `motion/react`.

## Outils de design installés sur le Mac

### Scroll Craft — nateherkai/scroll-craft

Le dépôt MIT a été cloné dans `~/.cache/ai-interview-tools/scroll-craft`, la skill a été copiée dans **`.agents/skills/scroll-craft` et `.claude/skills/scroll-craft`** pour l'utiliser avec les agents locaux du projet. Fichiers de référence, scripts et engine conservés. Réinstallation :

```bash
git clone --depth 1 https://github.com/nateherkai/scroll-craft.git /tmp/scroll-craft
cp -R /tmp/scroll-craft/plugins/nateherk-design/skills/scroll-craft .agents/skills/scroll-craft
cp -R /tmp/scroll-craft/plugins/nateherk-design/skills/scroll-craft .claude/skills/scroll-craft
node .agents/skills/scroll-craft/scripts/doctor.mjs
```

Le `doctor` a constaté : Node, ffmpeg et Chrome compatibles. Avertissements **non bloquants** : encodeur WebP absent, playwright-core absent dans le dossier Scroll Craft, `KIE_AI_API_KEY` absent (utile uniquement pour générer des vidéos/photos). La skill a été lue et exploitée **comme direction artistique**, pas en lançant un moteur de scrollytelling inadapté à notre formulaire : séparation du fond, de la scène, du texte et de ses états, une seule culmination émotionnelle, interactions de sortie, composition mobile distincte, vérification sur navigateur.

### Motion — motiondivision/motion

Le dépôt MIT est une **bibliothèque React/JS**, pas une skill d'instructions. Installation : `cd web && npm install motion`. Les imports Framer Motion du frontend ont été migrés vers `motion/react` et l'ancien paquet `framer-motion` a été retiré. Nous utilisons les variantes de transitions, springs et `useReducedMotion`.

## Vérifications

- `cd web && npx tsc --noEmit && npm run lint && npm run build`.
- `python3 web/tests/test_onboarding_v2_browser.py` : parcours métier complet desktop 1440/mobile 390, préférences, contexte, validation.
- `python3 web/tests/test_welcome_motion_browser.py` : motion active desktop + bouton skip, `prefers-reduced-motion` mobile + accès dashboard, sans scroll horizontal.
- Tests locaux Chrome ; **aucune sauvegarde en base**. L'Auth sign-in est à concevoir lorsque la référence utilisateur sera disponible.

## Décisions à prendre plus tard

Le libellé et la durée de l'accueil de reconnexion (« Bon retour parmi nous, [prénom] ») seront affinés avec la maquette sign-in. Le routage dépendra strictement de `is_authenticated` et d'un indicateur serveur `onboarding_completed`. Aucune logique d'authentification réelle n'a été implémentée dans cette livraison.
