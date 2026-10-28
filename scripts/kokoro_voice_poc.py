"""Generate one French Kokoro speech sample locally (never a Vercel endpoint).

Requirements: use a Python version supported by the Kokoro and Misaki packages
(for example Python 3.11 with compatible releases), then pip install kokoro soundfile.
Python 3.13 on the current Mac failed dependency resolution during this POC.
System phonemizer: install espeak-ng (e.g. brew install espeak-ng).
Run: python scripts/kokoro_voice_poc.py intro
Output: local file under /tmp, upload it in /dev/voice-lab.
"""
import sys
from pathlib import Path

SAMPLES = {
    'intro': "Bonjour, merci d'être avec nous aujourd'hui. Pour commencer, pouvez-vous me parler d'une expérience dans laquelle vous avez piloté une stratégie de recrutement ?",
    'relance': "Vous avez évoqué une réduction des délais de recrutement. Comment avez-vous mesuré l'impact de vos actions ?",
    'situation': "Un manager souhaite recruter immédiatement un profil rare, sans revoir son budget. Comment abordez-vous cette demande ?",
}

def main():
    choice=sys.argv[1] if len(sys.argv)>1 else 'intro'
    if choice not in SAMPLES:
        raise SystemExit('Choose: intro, relance, situation')
    import soundfile as sf
    from kokoro import KPipeline
    pipe=KPipeline(lang_code='f')
    parts=[]
    for _,_,audio in pipe(SAMPLES[choice],voice='ff_siwis',speed=1.0):
        parts.append(audio.numpy() if hasattr(audio,'numpy') else audio)
    if not parts:
        raise RuntimeError('No Kokoro audio generated')
    import numpy as np
    destination=Path('/tmp')/f'interviewlab_kokoro_{choice}.wav'
    sf.write(destination,np.concatenate(parts),24000)
    print(destination)

if __name__=='__main__': main()
