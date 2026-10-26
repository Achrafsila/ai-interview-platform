"""Academy-inspired source grounding: candidate statements are not proven skills."""
import re

SENSITIVE = re.compile(r'\b(?:medical|maladie|santé|religion|politique|grossesse|handicap|sexualité)\b', re.I)

def extract_candidate_claims(history, limit=6):
    """Only candidate utterances, bounded and suitable for untrusted model context."""
    statements = []
    for turn in history[-20:]:
        answer = turn.get('answer', '')
        if not isinstance(answer, str):
            continue
        answer = answer.strip()
        if 16 <= len(answer) <= 1200 and not SENSITIVE.search(answer):
            statements.append({'quote': answer[:320], 'source': 'candidate', 'verified_competency': False})
    return statements[-limit:]


def evidence_references(history):
    """Trace utterance indexes for later verification, never manufacture a score."""
    return [{'turn': i, 'answer_excerpt': turn['answer'][:200], 'status': 'candidate_statement_unverified'}
            for i, turn in enumerate(history) if isinstance(turn.get('answer'), str) and turn['answer'].strip()]
