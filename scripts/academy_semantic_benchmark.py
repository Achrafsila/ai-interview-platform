"""Offline semantic retrieval smoke test; zero paid API calls.

Setup: python3 -m venv .academy-embedding-venv && .academy-embedding-venv/bin/pip install fastembed==0.9.1
Run: .academy-embedding-venv/bin/python scripts/academy_semantic_benchmark.py
Note: This is a local proof of concept, not a deployed Vercel query encoder.
"""
import numpy as np
from fastembed import TextEmbedding

MODEL = 'sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2'
corpus = [
    ('staffing', 'Staffing Manager en SSII ESN. Allocation des consultants, suivi des missions, gestion des disponibilités et arbitrage des ressources.'),
    ('salary', 'Prétentions salariales et négociation de rémunération. Proposer une fourchette selon le contexte et le package.'),
    ('break', 'Interruption de carrière. Préserver la confidentialité du candidat sur les motifs médicaux ou personnels.'),
    ('star', 'Présenter une réalisation avec la méthode STAR : Situation, Tâche, Action et Résultat.'),
    ('conflict', 'Gérer un conflit ou désaccord entre collègues, résoudre une tension relationnelle en équipe, pratiquer l’écoute active et raconter un exemple concret de médiation.'),
]
tests = [
    ('Je vais piloter l’affectation des consultants aux missions dans un cabinet de conseil', 'staffing'),
    ('Combien devrais-je demander pour mon prochain poste sans être trop gourmand ?', 'salary'),
    ('Comment justifier un long trou sur mon CV en gardant ma vie privée ?', 'break'),
    ('Je veux raconter un projet selon situation tâche action résultat', 'star'),
    ('Comment parler d’un désaccord entre collègues en entretien ?', 'conflict'),
]
encoder = TextEmbedding(model_name=MODEL, cache_dir='.academy-model-cache')
embeddings = list(encoder.embed([d for _, d in corpus] + [q for q, _ in tests]))
docs = np.asarray(embeddings[:len(corpus)])
queries = np.asarray(embeddings[len(corpus):])
docs = docs / np.linalg.norm(docs, axis=1, keepdims=True)
queries = queries / np.linalg.norm(queries, axis=1, keepdims=True)
score = queries @ docs.T
correct = 0
for i, (question, expected) in enumerate(tests):
    index = int(np.argmax(score[i]))
    predicted = corpus[index][0]
    ok = predicted == expected
    correct += int(ok)
    print(('PASS' if ok else 'FAIL'), expected, 'got', predicted, 'cosine', round(float(score[i,index]),3))
print('SEMANTIC_TOP1', f'{correct}/{len(tests)}', 'dimension', len(embeddings[0]))
raise SystemExit(0 if correct == len(tests) else 1)
