"""Local Kokoro FR benchmark; use Python 3.11 + kokoro==0.9.4, soundfile, espeak-ng.

Usage: python scripts/kokoro_voice_poc.py situation --preset natural
Voice is unchanged in live interviews. Spoken substitutions must be listened to
and explicitly approved before becoming production pronunciation rules.
"""
import argparse
import re
from pathlib import Path

SAMPLES = {
    'intro': "Bonjour, merci d'être avec nous aujourd'hui. Pour commencer, pouvez-vous me parler d'une expérience dans laquelle vous avez piloté une stratégie de recrutement ?",
    'relance': "Vous avez évoqué une réduction des délais de recrutement. Comment avez-vous mesuré l'impact de vos actions ?",
    'situation': "Un manager souhaite recruter immédiatement un profil rare, sans revoir son budget. Comment abordez-vous cette demande ?",
    'vocabulaire': "En tant que manager, comment collaborez-vous avec les hiring managers ? Comment recueillez-vous leur feedback ?",
}
PRESETS = {
    'baseline': {'speed': 1.0, 'pause': 0},
    'calm': {'speed': 0.92, 'pause': 0.22},
    'natural': {'speed': 0.98, 'pause': 0.13},
    'dynamic': {'speed': 1.05, 'pause': 0.08},
}
# Candidates for listening evaluation, NOT authoritative linguistic replacements.
PRONUNCIATION_CANDIDATES = {'manager': 'manageur', 'managers': 'manageurs'}

def spoken_text(value: str, enabled: bool) -> str:
    if not enabled:
        return value
    return re.sub(r'\bmanagers?\b', lambda m: PRONUNCIATION_CANDIDATES[m.group().lower()], value, flags=re.I)

def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('scenario', choices=SAMPLES)
    parser.add_argument('--preset', choices=PRESETS, default='baseline')
    parser.add_argument('--pronunciation', action='store_true', help='Test unapproved manager->manageur substitution')
    args=parser.parse_args()
    import numpy as np
    import soundfile as sf
    from kokoro import KPipeline
    pipe=KPipeline(lang_code='f')
    preset=PRESETS[args.preset]
    text=spoken_text(SAMPLES[args.scenario],args.pronunciation)
    audio_parts=[]
    for _,_,audio in pipe(text,voice='ff_siwis',speed=preset['speed']):
        audio_parts.append(audio.numpy() if hasattr(audio,'numpy') else audio)
    if not audio_parts:
        raise RuntimeError('Kokoro returned no audio')
    # Short tail pause avoids clipping; excessive sentence splitting makes speech robotic.
    output=np.concatenate(audio_parts+[np.zeros(int(24000*preset['pause']),dtype=np.float32)])
    suffix='-lexicon' if args.pronunciation else ''
    dest=Path('/tmp')/f'interviewlab_kokoro_{args.scenario}_{args.preset}{suffix}.wav'
    sf.write(dest,output,24000)
    print(f'{dest} | {len(output)/24000:.2f}s | spoken={text}')

if __name__=='__main__': main()
