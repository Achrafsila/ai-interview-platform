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
            expect(page.get_by_role("heading", name="Qu’est-ce qu’on peut améliorer ensemble ?")).to_be_visible()
            page.get_by_role("button", name="Mieux communiquer").click()
            page.get_by_role("button", name="Donner des réponses plus claires").click()
            page.get_by_role("button", name="Continuer").click()
            expect(page.get_by_role("heading", name="Dans quelle langue on s’entraîne ?")).to_be_visible()
            page.get_by_role("radio", name="English").click()
            page.get_by_role("button", name="C’est parti !").click()
            expect(page.get_by_role("heading", name="Bienvenue, Camille !")).to_be_visible()
            expect(page.get_by_text("Évoluer professionnellement")).to_be_visible()
            expect(page.get_by_text("Mieux communiquer")).to_be_visible()
            # Targeted edit of a completed profile retains all other answers.
            page.get_by_role("button", name="ON S’ENTRAÎNE EN English").click()
            expect(page.get_by_role("radio", name="English")).to_have_attribute("aria-checked", "true")
            page.get_by_role("radio", name="Français").click()
            page.get_by_role("button", name="Enregistrer et revenir").click()
            expect(page.get_by_role("heading", name="Bienvenue, Camille !")).to_be_visible()
            expect(page.get_by_text("Français", exact=True)).to_be_visible()
            expect(page.get_by_text("Mieux communiquer")).to_be_visible()
            # The single footer Previous button returns to step 4 with answers intact.
            page.get_by_role("button", name="Précédent").click()
            expect(page.get_by_role("heading", name="Dans quelle langue on s’entraîne ?")).to_be_visible()
            expect(page.get_by_role("radio", name="Français")).to_have_attribute("aria-checked", "true")
            page.get_by_role("button", name="Retour", exact=True).click()
            expect(page.get_by_role("heading", name="Qu’est-ce qu’on peut améliorer ensemble ?")).to_be_visible()
            page.get_by_role("button", name="Continuer").click()
            page.get_by_role("button", name="C’est parti !").click()
            expect(page.get_by_role("heading", name="Bienvenue, Camille !")).to_be_visible()
            # Edit priority and navigate Back to summary without destroying changes.
            page.get_by_role("button", name="CE QU’ON VA TRAVAILLER").click()
            expect(page.get_by_role("heading", name="Qu’est-ce qu’on peut améliorer ensemble ?")).to_be_visible()
            page.get_by_role("button", name="Retour", exact=True).click()
            expect(page.get_by_role("heading", name="Bienvenue, Camille !")).to_be_visible()
            # No horizontal scrolling at mobile width.
            assert page.evaluate("document.documentElement.scrollWidth <= window.innerWidth"), viewport
            # Onboarding completion must now lead to the personalized dashboard.
            page.get_by_role("button", name="Découvrir mon espace").click()
            expect(page.get_by_role("heading", name="Bonjour, Camille. On prépare la suite ?")).to_be_visible()
            expect(page.get_by_role("heading", name="Évoluer professionnellement")).to_be_visible()
            expect(page.locator('section[aria-label="Notre programme"]').get_by_text("Mieux communiquer")).to_be_visible()
            expect(page.get_by_text("Nous n’avons pas encore d’entraînement enregistré.", exact=False)).to_be_visible()
            assert page.evaluate("document.documentElement.scrollWidth <= window.innerWidth"), viewport
            page.get_by_role("link", name="Préparer notre entretien").click()
            expect(page.get_by_role("heading", name="On commence par quoi ?")).to_be_visible()
            page.get_by_role("radio", name="Entretien technique").click()
            expect(page.get_by_role("radio", name="Entretien technique")).to_have_attribute("aria-checked", "true")
            assert page.evaluate("document.documentElement.scrollWidth <= window.innerWidth"), viewport
            page.get_by_role("link", name="Mon espace").click()
            expect(page.get_by_role("heading", name="Bonjour, Camille. On prépare la suite ?")).to_be_visible()
            page.get_by_role("link", name="Mon profil").click()
            page.wait_for_url("**/onboarding")
            # Client-side navigation preserves the completed onboarding recap;
            # edit the identity directly without restarting the whole journey.
            expect(page.get_by_role("heading", name="Bienvenue, Camille !")).to_be_visible()
            if viewport["width"] >= 1024:
                page.get_by_role("button", name="Modifier : Faisons connaissance").click()
            else:
                page.get_by_role("button", name="Précédent").click()
                for _ in range(3):
                    page.get_by_role("button", name="Retour", exact=True).click()
            expect(page.get_by_label("Prénom", exact=True)).to_have_value("Camille")
            expect(page.get_by_label("Nom", exact=True)).to_have_value("Martin")
            print("PASS", viewport["width"], "onboarding → dashboard → preparation → profile; no overflow")
            page.close()
        browser.close()


if __name__ == "__main__":
    run()
