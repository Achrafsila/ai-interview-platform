# S2-03 → S2-04 — Intégration sécurisée du catalogue

**Projet Supabase :** `ai-interview-platform` (`aqybktqgoartjiqoqcfg`), région Paris.

## Composants livrés

- Edge Function `question-bank`, déployée avec `verify_jwt=true`.
- Point de terminaison : `https://aqybktqgoartjiqoqcfg.supabase.co/functions/v1/question-bank`.
- Client serveur S2-04 : `src/integrations/s2-04/question-bank-client.mjs`.
- Tests unitaires d'adaptateur : `tests/test_s2_04_bridge.mjs`.
- Vérification TypeScript Deno et Node dans GitHub Actions.

### Contrat

| Route | Identité nécessaire | Réponse |
|---|---|---|
| `GET /questions?locale=fr&family=rh&limit=20` | utilisateur Supabase Auth connecté (JWT) | questions courantes publiées uniquement, sans attendus |
| `GET /engine/snapshot/RH-004?locale=fr` | rôle serveur `interview_engine` ou `admin` dans `app_metadata.ai_interview_role` | identifiants immuables version de question/grille et formulation |
| `GET /evaluator/questions/RH-004?locale=fr` | rôle `evaluator` ou `admin` dans `app_metadata.ai_interview_role` | références internes d'évaluation ; jamais à communiquer au navigateur |

Les rôles proviennent exclusivement de `app_metadata` maintenu côté serveur, **jamais** de `user_metadata`, ni d'un paramètre libre envoyé par le client. La fonction valide également l'utilisateur via Supabase Auth. Chaque requête au catalogue lit uniquement `question_bank.published_questions_safe`. Les champs sensibles ne sont joints qu'après contrôle du rôle `evaluator` ou `admin`.

**Aujourd'hui : 120 questions `draft`, donc l'API répond avec un catalogue vide.** Aucun mode test ne contourne la publication.

## Exemple côté serveur S2-04

```js
import { createQuestionBankClient } from "./src/integrations/s2-04/question-bank-client.mjs";

const bank = createQuestionBankClient({
  baseUrl: "https://aqybktqgoartjiqoqcfg.supabase.co/functions/v1/question-bank",
  // Fournir le JWT de la session/service authentifié côté serveur.
  // Ne PAS placer un service-role key dans le navigateur.
  tokenProvider: async () => obtainVerifiedServerSideAccessToken(),
});
const { items } = await bank.listPublished({ locale: "fr", family: "technical" });
// Le moteur S2-04 implémentera sa propre sélection dynamique.
```

## Conditions pour une intégration S2-04 de bout en bout

1. Implémenter le moteur d'entretien proprement dit et son authentification serveur, non présents dans cette tranche.
2. Définir et attribuer des rôles de service avec une procédure administrateur. **Aucun utilisateur n'est promu automatiquement.**
3. Persister un snapshot par tour (question_version_id, rubric_version_id, locale, prompt réellement posé).
4. Valider toutes les questions destinées à être distribuées, puis publier explicitement le lot approuvé.
5. Effectuer une recette avec utilisateurs de test autorisés (candidat / engine / evaluator), vrais JWT, tentatives non autorisées et vérification que les attendus ne quittent pas le serveur.

## Sécurité et limites

- Edge Function utilise `SUPABASE_DB_URL` uniquement dans le runtime serveur. Les connexions DB ne doivent jamais figurer dans Git.
- Elle ouvre une connexion côté serveur avec les permissions de l'URL fournie par Supabase ; **ce n'est pas encore une identité DB à privilèges SELECT uniquement**. Un rôle DB dédié, les limites de débit, la revue de logs et l'isolation multi-session seront nécessaires avant production.
- Le connecteur GitHub peut vérifier le code et les tests unitaires ; les tests réels d'autorisation via des comptes Auth ne sont pas encore prouvés.
- Les endpoints évaluateur ne doivent jamais être exposés directement à l'application navigateur, même lorsqu'un utilisateur est administrateur.

**Statut :** service S2-03 déployé, adaptateur S2-04 livré en branche ; parcours d'entretien réel à développer et tester avant clôture de S2-04.
