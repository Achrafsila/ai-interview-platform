# Academy — Audit ergonomique et harmonisation V1
Date : 2026-10-24. Périmètre : `/exercises`, `/exercises/paths`, shell commun desktop/mobile.

## Constats
- Plusieurs grands espacements s'additionnaient verticalement (header, marge du hero, cartes, recherche).
- La taille et l'arrondi des cartes variaient sans nécessité fonctionnelle.
- Les cartes du catalogue étaient plus larges visuellement que leur contenu utile et les boutons plus hauts que nécessaire.
- Des textes d'aide secondaires sur fonds lavande avaient déjà nécessité des ajustements de contraste : veiller à conserver des couleurs lisibles.

## Standards retenus dans ce lot
- Navigation latérale : largeur 248 px ; éléments de navigation 48 px minimum, zones confortables.
- Header : hauteur minimale 72 px ; onglets avec état actif violet et ombre, 40 px minimum.
- Contenu principal : padding horizontal adaptatif 20/28/36 px ; padding supérieur 28 px.
- Titre de page : environ 30 px mobile / 36 px desktop ; introduction de 14-16 px et interligne confortable.
- KPI : carte sobre, titre 12 px, métrique 30 px, texte secondaire cohérent ; espacement uniforme.
- Cards : rayon principal 24 px, grilles à 16 px entre cartes, padding 20 px pour les cartes de catalogue.
- Filtres : champs de 48 px de hauteur minimum, disposition responsive 1/2/4 colonnes ; reset à 44 px.
- CTA des cartes : 44 px minimum, dégradé violet contrasté ; liens retour : 44 px minimum.
- Pied de page Academy : contenu court, séparateur subtil, marge réduite ; pas de nouveau footer décoratif.

## Vérifications effectuées
- TypeScript sans erreur ; ESLint pages concernées sans erreur ; build Next.js réussi.
- Ces contrôles ne remplacent **pas** un audit navigateur multi-breakpoint, un contrôle automatisé WCAG AA ou une revue visuelle humaine. À prévoir avant validation finale : 360, 390, 768, 1024 et 1440 px, zoom 200 %, clavier et préférence reduced-motion.
- Aucun modèle de données ou règle de recommandation modifié par ce lot.
