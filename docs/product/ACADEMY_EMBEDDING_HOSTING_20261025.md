# Academy embeddings — déploiement du service d'inférence

## Livré
- `services/academy-embedder/`: service Python FastAPI/FastEmbed, endpoint `POST /embed`, modèle MiniLM multilingue 384 dimensions et jeton Bearer obligatoire d'au moins 32 caractères.
- Conteneur Docker prêt à construire sur un hébergeur HTTPS choisi par le propriétaire du projet. Aucune clé Supabase ni Groq requise dans le conteneur.
- Academy API Next.js peut consulter ce service en HTTPS avec `ACADEMY_EMBEDDING_URL` et `ACADEMY_EMBEDDING_TOKEN` configurés uniquement côté serveur ; si absent ou indisponible, recherche lexicale conservée.
- Limitation : un hébergeur distant n'est PAS encore provisionné et les variables Vercel de production n'ont PAS été renseignées. Ne pas annoncer une recherche sémantique active sur Vercel à ce stade.

## Configuration
1. Choisir une infrastructure HTTPS et contrôler le lieu de traitement, coût, quotas, latence, sécurité et licence du modèle.
2. Déployer `services/academy-embedder` sur cette infrastructure avec `ACADEMY_EMBEDDING_TOKEN` fort, distinct des autres secrets.
3. Restreindre le trafic et le journal des requêtes : des textes candidats peuvent contenir des informations personnelles.
4. Dans Vercel, définir `ACADEMY_EMBEDDING_URL=https://<hôte-approuvé>` et `ACADEMY_EMBEDDING_TOKEN` (même jeton côté service), redéployer, puis exécuter les tests authentifiés Academy.
5. Mesurer pertinence (le benchmark vectoriel précédent était 4/5 Top-1), latence et fallback avant activation pour les candidats.

## Tests effectifs
- Test FastAPI local : `/health` HTTP 200, `/embed` sans jeton HTTP 401, `/embed` authentifié HTTP 200 avec vecteur 384 dimensions.
- TypeScript et ESLint Academy : réussis.

## Contraintes
Le service distant doit être considéré comme un sous-traitant du traitement de données candidat ; il faut vérifier conformité, politiques de rétention, protection du jeton et localisation avant usage réel. Les services gratuits peuvent avoir un temps de réveil ou des limites ; le timeout de 3,5 s entraîne alors le repli lexical. Ne pas exposer le port local du Mac.
