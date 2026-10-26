"""Deterministic adaptive coverage and bounded follow-up strategy."""

def choose_move(state, answer):
    text = answer.strip().lower()
    if text.endswith('?') or text.startswith(('pouvez-vous préciser', 'can you clarify', 'what do you mean')):
        return 'ANSWER_CANDIDATE'
    if state.get('followups', 0) >= 2:
        return 'TRANSITION'
    if len(text.split()) < 9:
        return 'CLARIFY'
    return 'FOLLOW_UP'


def choose_topic(state, move):
    topics = state['competencies']
    if not topics:
        return None
    if move == 'TRANSITION':
        return topics[min(state.get('topic_index', 0) + 1, len(topics) - 1)]['name']
    return topics[min(state.get('topic_index', 0), len(topics) - 1)]['name']
