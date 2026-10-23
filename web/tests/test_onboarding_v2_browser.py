"""Real Chromium smoke test of immersive onboarding, editing and mobile layout."""
from playwright.sync_api import sync_playwright, expect


def run():
    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True, channel="chrome")
        for viewport in [{"width": 1440, "height": 900}, {"width": 390, "height": 844}]:
            page = browser.new_page(viewport=viewport, reduced_motion="reduce")
            page.goto("http://localhost:3000/onboarding", wait_until="networkidle")
            page.wait_for_timeout(1300)
            expect(page.get_by_role("heading", name="D’abord, vous.")).to_be_visible()
            assert page.locator(".onboarding-glass").count() == 1
            assert page.locator(".onboarding-atmosphere").count() == 1
            page.get_by_label("Prénom", exact=True).fill("Camille")
            page.get_by_label("Nom", exact=True).fill("Martin")
            page.get_by_role("button", name="Continuer").click()
            expect(page.get_by_role("heading", name="Camille, on vise quoi ensuite ?")).to_be_visible()
            page.get_by_role("radio", name="Évoluer professionnellement").click()
            page.get_by_role("button", name="Continuer").click()
            expect(page.get_by_role("heading", name="Quel est votre prochain déclic ?")).to_be_visible()
            page.get_by_role("button", name="Mieux communiquer").click()
            page.get_by_role("button", name="Donner des réponses plus claires").click()
            page.get_by_role("button", name="Continuer").click()
            expect(page.get_by_role("heading", name="On se parle dans quelle langue ?")).to_be_visible()
            page.get_by_role("radio", name="English").click()
            page.get_by_role("button", name="C’est parti !").click()
            expect(page.get_by_role("heading", name="Bienvenue, Camille !")).to_be_visible()
            expect(page.get_by_text("Évoluer professionnellement")).to_be_visible()
            expect(page.get_by_text("Mieux communiquer")).to_be_visible()
            # Targeted edit of a completed profile retains all other answers.
            page.get_by_role("button", name="VOTRE LANGUE English").click()
            expect(page.get_by_role("radio", name="English")).to_have_attribute("aria-checked", "true")
            page.get_by_role("radio", name="Français").click()
            page.get_by_role("button", name="Enregistrer et revenir").click()
            expect(page.get_by_role("heading", name="Bienvenue, Camille !")).to_be_visible()
            expect(page.get_by_text("Français", exact=True)).to_be_visible()
            expect(page.get_by_text("Mieux communiquer")).to_be_visible()
            # Edit priority and navigate Back to summary without destroying changes.
            page.get_by_role("button", name="Modifier mes priorités").click()
            expect(page.get_by_role("heading", name="Quel est votre prochain déclic ?")).to_be_visible()
            page.get_by_role("button", name="Retour", exact=True).click()
            expect(page.get_by_role("heading", name="Bienvenue, Camille !")).to_be_visible()
            # No horizontal scrolling at mobile width.
            assert page.evaluate("document.documentElement.scrollWidth <= window.innerWidth"), viewport
            print("PASS", viewport["width"], "completion and targeted editing; no horizontal overflow")
            page.close()
        browser.close()


if __name__ == "__main__":
    run()
