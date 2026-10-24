"""Authenticated candidate profile persistence, with guaranteed original-value restoration."""
from pathlib import Path
from playwright.sync_api import sync_playwright

root = Path(__file__).resolve().parents[2]
line = next(x for x in (root/'.demo-credentials/test-accounts.txt').read_text().splitlines() if x.startswith('user@user.com'))
email, password = (v.strip() for v in line.split('|')[:2])
with sync_playwright() as pw:
    browser = pw.chromium.launch(headless=True, channel='chrome')
    context = browser.new_context()
    page = context.new_page()
    page.goto('http://localhost:3000/login', wait_until='networkidle')
    page.get_by_label('Adresse e-mail').fill(email)
    page.get_by_label('Mot de passe', exact=True).fill(password)
    page.get_by_role('button', name='Se connecter', exact=True).click()
    page.wait_for_url('**/dashboard', timeout=20000)
    page.goto('http://localhost:3000/onboarding', wait_until='networkidle')
    first = page.get_by_placeholder('Votre prénom')
    first.wait_for()
    original = first.input_value()
    assert original, 'Test profile has no first name; abort before writing'
    marker = original + 'TestS301'
    assert len(marker) <= 80
    changed = False
    try:
        first.fill(marker)
        for i in range(4):
            page.get_by_role('button', name='Continuer', exact=True).click()
        page.get_by_role('button', name='C’est parti !').click()
        page.get_by_text('L’enregistrement n’a pas fonctionné').wait_for(state='hidden', timeout=12000)
        changed = True
        page.goto('http://localhost:3000/onboarding', wait_until='networkidle')
        assert page.get_by_placeholder('Votre prénom').input_value() == marker, 'Profile not persisted after reload'
        page.goto('http://localhost:3000/dashboard', wait_until='networkidle')
        page.get_by_role('button', name='Se déconnecter').first.click()
        page.wait_for_url('**/login', timeout=15000)
        page.get_by_label('Adresse e-mail').fill(email)
        page.get_by_label('Mot de passe', exact=True).fill(password)
        page.get_by_role('button', name='Se connecter', exact=True).click()
        page.wait_for_url('**/dashboard', timeout=20000)
        page.goto('http://localhost:3000/onboarding', wait_until='networkidle')
        assert page.get_by_placeholder('Votre prénom').input_value() == marker, 'Profile not persisted after relogin'
        print('PASS profile persisted after reload and relogin', flush=True)
    finally:
        if changed:
            page.goto('http://localhost:3000/onboarding', wait_until='networkidle')
            page.get_by_placeholder('Votre prénom').fill(original)
            for i in range(4):
                page.get_by_role('button', name='Continuer', exact=True).click()
            page.get_by_role('button', name='C’est parti !').click()
            page.goto('http://localhost:3000/onboarding', wait_until='networkidle')
            assert page.get_by_placeholder('Votre prénom').input_value() == original, 'RESTORE FAILED: investigate immediately'
            print('PASS original first name restored', flush=True)
        browser.close()
