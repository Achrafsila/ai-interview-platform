# Nouveau frontend — onboarding interactif V0

Le composant `src/components/ui/onboarding-stages.tsx` adapte le composant React / Framer Motion partagé par le porteur du projet (« onboarding-stages.tsx ») : structure en étapes, progression visuelle, animations avec respect de `prefers-reduced-motion`, styles Tailwind et icônes Lucide. Les listes d'exemple du composant original (logo, paiement, livraison) ont été remplacées par **les décisions produit S2-01**.

## Tester

```bash
cd web
npm install
npm run dev
```

- Landing provisoire : http://localhost:3000/
- Onboarding interactif : http://localhost:3000/onboarding

Aucun autre service ni compte n'est requis pour le prototype UX.

## Parcours du prototype

1. Prénom et nom : identification personnalisée, pas de CV.
2. Objectif professionnel : premier emploi / changer de poste / évoluer.
3. Préparation : 1 à 3 priorités parmi cinq, chacune avec explication.
4. Langue de préparation : français / anglais.
5. Écran de confirmation personnalisé.

La progression est calculée sur les étapes réelles ; les choix ne sont pas considérés « terminés » par défaut. Le champ `onComplete(profile)` reçoit les données validées, typées et prêtes à être transmises ultérieurement à un service de profil authentifié.

## Limites délibérées

**Ce frontend est un prototype UX distinct du laboratoire Python Groq/Supabase** (port 8765). À ce stade, aucune donnée n'est enregistrée dans Supabase, aucune authentification n'est simulée, aucun entretien IA n'est connecté. Le texte de confirmation l'indique clairement. Le schéma actuel `public.candidate_profiles` ne contient pas `first_name` ni `last_name` : ajouter ces colonnes avec migration RLS testée sera une évolution backend avant d'ouvrir une inscription réelle.

L'interface d'accueil est provisoire ; la marque, le nom définitif et la charte font encore l'objet du chantier Product & Branding. La version FR est un point de départ, l'UI anglaise complète reste à réaliser. La contrainte des trois priorités est une simplification proposée pour l'UX et reste à valider.

## Dépendances et qualité

Next.js 16, React 19, TypeScript, Tailwind CSS 4, shadcn et structure `src/components/ui`, Framer Motion, Lucide. Vérification : `npx tsc --noEmit && npm run lint && npm run build`.

L'installation initiale de packages a affiché **5 vulnérabilités signalées par npm audit**. Elles sont à trier et corriger avant toute mise en production ; ne pas exécuter `npm audit fix --force` sans revue des changements majeurs.

Le composant de référence fourni par l'utilisateur est adapté et non copié à l'identique, car son contenu métier concernait un onboarding e-commerce. La confidentialité, la logique de profil et la personnalisation candidat prennent le pas sur cette démonstration.
