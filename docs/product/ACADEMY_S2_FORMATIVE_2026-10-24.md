# Academy S2 — Première boucle formative

Livré : bouton d'analyse de la réponse, retour « ce qui fonctionne / à renforcer / prochaine tentative », via API serveur candidate-only et exercice identifié. Pas de score ni de maîtrise prétendue. La réponse peut être retravaillée avant la validation explicite de l'exercice.

Persistance : le feedback est sauvegardé avec la tentative uniquement s'il correspond à la version exacte de la réponse validée ; colonne facultative academy_attempts.formative_feedback, migration appliquée sur Supabase.

Limitations : GROQ_API_KEY n'est pas encore configurée pour Next.js, donc retour 503 transparent et usage de la grille d'auto-évaluation. L'interface est développée, mais pas de test IA bout en bout validé. Le feedback enregistré n'est pas encore disponible dans un écran d'historique détaillé. Le moteur de recommandation S3 n'en tient pas encore compte. Validation qualité humaine et conformité de traitement des réponses nécessaires avant usage avec de vrais candidats.
