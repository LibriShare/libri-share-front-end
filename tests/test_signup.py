import unittest
import time
import uuid 
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager

class TesteCadastroLibriShare(unittest.TestCase):

    def setUp(self):
        service = Service(ChromeDriverManager().install())
        self.driver = webdriver.Chrome(service=service)
        self.driver.maximize_window()

        self.BASE_URL = "http://localhost:3000/signup" 

    def test_cadastro_sucesso(self):
        """Teste de criação de conta com dados válidos"""
        driver = self.driver
        driver.get(self.BASE_URL)

        email_aleatorio = f"teste.{str(uuid.uuid4())[:5]}@exemplo.com"
        senha_padrao = "SenhaForte123"

        print(f"\n📧 Tentando cadastrar com: {email_aleatorio}")

        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "firstName"))
        ).send_keys("Teste")

        driver.find_element(By.ID, "lastName").send_keys("Automacao")
        driver.find_element(By.ID, "email").send_keys(email_aleatorio)
        driver.find_element(By.ID, "password").send_keys(senha_padrao)
        driver.find_element(By.ID, "confirmPassword").send_keys(senha_padrao)

        driver.find_element(By.XPATH, "//button[@type='submit']").click()

        try:
            WebDriverWait(driver, 10).until(EC.alert_is_present())
            alerta = driver.switch_to.alert
            texto_alerta = alerta.text
            print(f"🔔 Alerta recebido: {texto_alerta}")
            
            self.assertIn("sucesso", texto_alerta.lower())
            
            alerta.accept()
            
        except Exception as e:
            self.fail(f"❌ Falha: O alerta de sucesso não apareceu. Erro: {e}")

        try:
            WebDriverWait(driver, 10).until(
                EC.url_to_be("http://localhost:3000/")
            )
            print("✅ Sucesso: Redirecionado para a tela de login!")
        except:
            self.fail("❌ Falha: Não redirecionou para a home após o cadastro.")

    def test_senhas_nao_conferem(self):
        """Teste validação de senhas diferentes"""
        driver = self.driver
        driver.get(self.BASE_URL)

        driver.find_element(By.ID, "firstName").send_keys("Erro")
        driver.find_element(By.ID, "lastName").send_keys("Senha")
        driver.find_element(By.ID, "email").send_keys("erro@teste.com")
        driver.find_element(By.ID, "password").send_keys("123456")
        driver.find_element(By.ID, "confirmPassword").send_keys("000000") 

        driver.find_element(By.XPATH, "//button[@type='submit']").click()

        try:
            mensagem_erro = WebDriverWait(driver, 5).until(
                EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'As senhas não conferem')]"))
            )
            print("\n✅ Validação funcionando: Detectou senhas diferentes.")
        except:
            self.fail("❌ Falha: Mensagem de erro de senha não apareceu.")

    def tearDown(self):
        if self.driver:
            self.driver.quit()

if __name__ == "__main__":
    unittest.main()