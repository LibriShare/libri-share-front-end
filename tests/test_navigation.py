import unittest
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager

class TesteNavegacaoLibriShare(unittest.TestCase):

    def setUp(self):
        service = Service(ChromeDriverManager().install())
        self.driver = webdriver.Chrome(service=service)
        self.driver.maximize_window()
        self.BASE_URL = "http://localhost:3000"
        self.fazer_login()

    def fazer_login(self):
        driver = self.driver
        driver.get(self.BASE_URL)

        try:
            WebDriverWait(driver, 5).until(EC.presence_of_element_located((By.ID, "email"))).send_keys("usuario.teste@librishare.com")
            driver.find_element(By.ID, "password").send_keys("Password123!")
            driver.find_element(By.XPATH, "//button[@type='submit']").click()
            WebDriverWait(driver, 10).until(EC.url_contains("/dashboard"))
        except:
            self.fail("❌ Falha crítica: Não conseguiu logar para iniciar o teste.")

    def test_navegacao_sidebar(self):
        """Teste: Navegar pelos menus laterais usando links (href)"""
        driver = self.driver
        print("\n🧭 Testando navegação da Sidebar...")

        menus = [
            ("Minha Biblioteca", "/library"),
            ("Lendo Agora", "/reading"),
            ("Livros Lidos", "/read"),  
            ("Lista de Desejos", "/wishlist"),
            ("Empréstimos", "/loans"),
            ("Perfil", "/profile")
        ]

        for nome_menu, url_esperada in menus:
            try:
                botao = WebDriverWait(driver, 10).until(
                    EC.element_to_be_clickable((By.XPATH, f"//nav//a[contains(@href, '{url_esperada}')]"))
                )
                
                driver.execute_script("arguments[0].scrollIntoView(true);", botao)
                
                botao.click()
                
                WebDriverWait(driver, 5).until(EC.url_contains(url_esperada))
                print(f"✅ Navegou corretamente para: {nome_menu} ({url_esperada})")
                
            except Exception as e:
                print(f"❌ Falha ao navegar para {nome_menu}: {e}")
                self.fail(f"Menu '{nome_menu}' não funcionou.")

    def tearDown(self):
        self.driver.quit()

if __name__ == "__main__":
    unittest.main()