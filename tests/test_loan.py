import unittest
import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager

class TesteEmprestimoLibriShare(unittest.TestCase):

    def setUp(self):
        service = Service(ChromeDriverManager().install())
        self.driver = webdriver.Chrome(service=service)
        self.driver.maximize_window()
        self.BASE_URL = "http://localhost:3000"
        self.fazer_login()

    def fazer_login(self):
        """Faz login para acessar a área restrita"""
        driver = self.driver
        driver.get(self.BASE_URL)
        try:
            WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "email"))).send_keys("usuario.teste@librishare.com")
            driver.find_element(By.ID, "password").send_keys("Password123!")
            driver.find_element(By.XPATH, "//button[@type='submit']").click()
            WebDriverWait(driver, 10).until(EC.url_contains("/dashboard"))
        except:
            self.fail("❌ Falha crítica: Não conseguiu logar. Verifique se o usuário existe.")

    def test_criar_emprestimo_via_modal(self):
        """Teste: Criar empréstimo usando o Modal na tela de listagem"""
        driver = self.driver
        print("\n💸 Iniciando teste de Novo Empréstimo (Modal)...")

        driver.get(f"{self.BASE_URL}/loans")

        try:
            print("1. Abrindo modal...")
            btn_novo = WebDriverWait(driver, 10).until(
                EC.element_to_be_clickable((By.XPATH, "//button[contains(., 'Novo Empréstimo')]"))
            )
            btn_novo.click()
        except Exception as e:
            self.fail(f"❌ Não encontrei o botão 'Novo Empréstimo': {e}")

        try:
            print("2. Selecionando o livro...")
            trigger_select = WebDriverWait(driver, 5).until(
                EC.element_to_be_clickable((By.XPATH, "//button[span[contains(text(), 'Selecione um livro')]]"))
            )
            trigger_select.click()

            primeira_opcao = WebDriverWait(driver, 5).until(
                EC.element_to_be_clickable((By.XPATH, "//div[@role='option']"))
            )
            nome_livro = primeira_opcao.text
            primeira_opcao.click()
            print(f"   -> Livro selecionado: {nome_livro}")

        except Exception as e:
            self.fail(f"❌ Falha ao selecionar livro. Você tem livros disponíveis na biblioteca? Erro: {e}")

        try:
            print("3. Preenchendo formulário...")
            
            driver.find_element(By.XPATH, "//input[@placeholder='Nome completo']").send_keys("Amigo Teste Selenium")
            
            driver.find_element(By.XPATH, "//input[@placeholder='email@exemplo.com']").send_keys("amigo@teste.com")
            
            data_input = driver.find_element(By.XPATH, "//input[@type='date']")
            data_input.send_keys("30122025") 
            
            driver.find_element(By.XPATH, "//input[contains(@placeholder, 'Ex: Cuidar')]").send_keys("Teste automatizado.")

        except Exception as e:
            self.fail(f"❌ Erro ao preencher campos de texto: {e}")

        print("4. Clicando em Confirmar...")
        driver.find_element(By.XPATH, "//button[contains(., 'Confirmar')]").click()

        try:
            toast = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'Sucesso')]"))
            )
            print("✅ Sucesso! Toast de confirmação apareceu.")
            
            time.sleep(1)
            
        except:
            try:
                erro = driver.find_element(By.XPATH, "//*[contains(@class, 'destructive')]").text
                self.fail(f"❌ O sistema retornou erro: {erro}")
            except:
                self.fail("❌ Falha: O toast de sucesso não apareceu.")

    def tearDown(self):
        if self.driver:
            self.driver.quit()

if __name__ == "__main__":
    unittest.main()