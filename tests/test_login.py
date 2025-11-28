import unittest
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager

class TesteLoginLibriShare(unittest.TestCase):

    def setUp(self):
        service = Service(ChromeDriverManager().install())
        self.driver = webdriver.Chrome(service=service)
        self.driver.maximize_window()
        self.BASE_URL = "http://localhost:3000" 

    def test_login_sucesso(self):
        """Teste de login com credenciais válidas"""
        driver = self.driver
        driver.get(self.BASE_URL)

        EMAIL_CORRETO = "usuario.teste@librishare.com"  
        SENHA_CORRETA = "Password123!"

        print(f"\n🔑 Tentando logar com: {EMAIL_CORRETO} ...")

        try:
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.ID, "email"))
            ).send_keys(EMAIL_CORRETO)

            driver.find_element(By.ID, "password").send_keys(SENHA_CORRETA)
            driver.find_element(By.XPATH, "//button[@type='submit']").click()

            WebDriverWait(driver, 10).until(
                EC.url_contains("/dashboard")
            )
            print("✅ Sucesso: Login realizado e redirecionado para Dashboard!")

        except Exception as e:
            self.fail(f"❌ Falha no Login: {e}")

    def test_login_falha(self):
        """Teste de login com senha incorreta"""
        driver = self.driver
        driver.get(self.BASE_URL)

        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "email"))
        ).send_keys("usuario.teste@librishare.com")

        driver.find_element(By.ID, "password").send_keys("SenhaErrada123")
        driver.find_element(By.XPATH, "//button[@type='submit']").click()

        try:
            WebDriverWait(driver, 5).until(
                EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'Erro') or contains(text(), 'incorret')]"))
            )
            print("✅ Sucesso: Sistema bloqueou senha errada corretamente.")
        except:
            self.fail("❌ Falha: O sistema não mostrou mensagem de erro para senha inválida.")

    def tearDown(self):
        if self.driver:
            self.driver.quit()

if __name__ == "__main__":
    unittest.main()