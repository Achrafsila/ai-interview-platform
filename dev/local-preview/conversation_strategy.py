"""Conservative conversation strategy for the rehearsal lab.

This is a bounded routing heuristic, NOT semantic proof of skills. The model
still composes the next utterance. Ambiguous candidate text is never scored.
"""
import re

CLARIFICATION_OPENERS = ('pouvez-vous préciser', 'pourriez-vous préciser', 'que voulez-vous dire', 'can you clarify', 'what do you mean', 'could you clarify', 'can you repeat')


def candidate_question(answer):
    text = answer.strip().casefold()
    return any(text.startswith(opener) for opener in CLARIFICATION_OPENERS) or (text.endswith('?') and len(text.split()) <= 22)


def choose_move(state, answer):
    text = answer.strip()
    if candidate_question(text):
        return 'ANSWER_CANDIDATE'
    if state.get('followups', 0) >= state.get('max_followups', 2):
        return 'TRANSITION'
    if len(re.findall(r'\b[\wÀ-ÿ]+\b', text)) < 9:
        return 'CLARIFY'
    return 'FOLLOW_UP'


def choose_topic(state, move):
    topics = state['competencies']
    if not topics:
        return None
    index = state.get('topic_index', 0)
    if move == 'TRANSITION':
        index += 1
    return topics[min(index, len(topics) - 1)]['name']
