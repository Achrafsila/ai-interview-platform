"""S3-01 authenticated role isolation smoke. Reads local-only test secrets; never logs them."""
from pathlib import Path
from playwright.sync_api import sync_playwright

credentials = {}
for line in (Path(__file__).resolve().parents[2] / '.demo-credentials/test-accounts.txt').read_text().splitlines():
    if '|' not in line or line.lstrip().startswith('#'):
        continue
    email, password = [segment.strip() for segment in line.split('|', 1)]
    if email in ('user@user.com', 'admin@admin.com', 'coach@coach.com'):
        credentials[email] = password
assert len(credentials) == 3, 'Test credentials missing'

with sync_playwright() as pw:
    browser = pw.chromium.launch(headless=True, channel='chrome')
    for email, expected in [('user@user.com', 'user'), ('admin@admin.com', 'admin'), ('coach@coach.com', 'coach')]:
        context = browser.new_context(viewport={'width': 1280, 'height': 840})
        page = context.new_page()
        page.goto('http://localhost:3000/login', wait_until='domcontentloaded')
        page.get_by_label('Adresse e-mail').fill(email)
        page.get_by_label('Mot de passe', exact=True).fill(credentials[email])
        page.get_by_role('button', name='Se connecter', exact=True).click()

        try:
            page.wait_for_url('**/dashboard' if expected == 'user' else '**/role-preview', timeout=14000)
        except Exception:
            print('FAIL authenticated login:', expected, 'route=',page.url.split('?')[0], 'error_visible=',bool(page.locator('[role=alert]').filter(has_text='Connexion impossible').count()), flush=True)
            raise
        if expected != 'user':
            page.get_by_text('Espace administrateur' if expected == 'admin' else 'Espace coach').wait_for()
            for path in ['/dashboard', '/onboarding', '/preparation', '/interview']:
                page.goto('http://localhost:3000' + path)
                page.wait_for_url('**/role-preview', timeout=12000)
            page.get_by_role('button', name='Se déconnecter').click()
        else:
            page.get_by_text('Vue d’ensemble').first.wait_for(timeout=15000)
            page.goto('http://localhost:3000/role-preview')
            page.wait_for_url('**/dashboard', timeout=12000)
            page.goto('http://localhost:3000/onboarding')
            page.get_by_role('status').first.wait_for(state='hidden', timeout=15000)
            page.reload()
            page.get_by_role('status').first.wait_for(state='hidden', timeout=15000)
            page.goto('http://localhost:3000/dashboard')
            page.get_by_role('button', name='Se déconnecter').first.click()
        page.wait_for_url('**/login', timeout=15000)
        page.goto('http://localhost:3000/dashboard')
        page.wait_for_url('**/login?next=*', timeout=12000)
        print('PASS authenticated role isolation + sign out:', expected, flush=True)
        context.close()
    browser.close()
