"""Authenticated smoke checks for interview voice gateway route mapping; no audio uploaded."""
from pathlib import Path
from playwright.sync_api import sync_playwright

source = Path(__file__).resolve().parents[2] / '.demo-credentials/test-accounts.txt'
line = next(line for line in source.read_text().splitlines() if line.startswith('user@user.com'))
email, password = (part.strip() for part in line.split('|')[:2])
with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True, channel='chrome')
    page = browser.new_page()
    page.goto('http://localhost:3000/login', wait_until='networkidle')
    page.get_by_label('Adresse e-mail').fill(email)
    page.get_by_label('Mot de passe', exact=True).fill(password)
    page.get_by_role('button', name='Se connecter', exact=True).click()
    page.wait_for_url('**/dashboard', timeout=20000)
    for action, expected_error in [('transcribe', 'invalid_audio'), ('tts', 'Texte vocal invalide')]:
        result = page.evaluate('''async (action) => {
          const response = await fetch('/api/interview/' + action, {
            method: 'POST', headers: {'Content-Type': 'application/json'}, body: '{}'
          });
          return {status: response.status, data: await response.json()};
        }''', action)
        assert result['status'] == 400 and result['data'].get('error') == expected_error, (action, result)
        print('PASS voice gateway upstream validation:', action, flush=True)
    browser.close()
