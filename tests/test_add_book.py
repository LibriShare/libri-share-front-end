import unittest
import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager

class TesteAdicionarLivro(unittest.TestCase):

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
            self.fail("❌ Falha no Setup: Não logou.")

    def test_adicionar_livro_manual(self):
        """Teste: Adicionar livro e verificar se ele aparece na listagem"""
        driver = self.driver
        print("\n📚 Iniciando teste de adicionar livro manual...")

        driver.get(f"{self.BASE_URL}/library")

        WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//button[contains(., 'Adicionar Livro')]"))
        ).click()

        WebDriverWait(driver, 5).until(
            EC.element_to_be_clickable((By.XPATH, "//button[contains(., 'Manual')]"))
        ).click()

        time.sleep(1) 
        
        timestamp = int(time.time())

        titulo_livro = f"Selenium Book {timestamp}"
        isbn_valido = f"900{timestamp}" 
        
        driver.find_element(By.ID, "title").send_keys(titulo_livro)
        driver.find_element(By.ID, "author").send_keys("Robô Automação")
        driver.find_element(By.ID, "isbn").send_keys(isbn_valido)
        driver.find_element(By.ID, "pages").send_keys("300")
        
        print(f"📝 Salvando livro: {titulo_livro} ...")
        
        driver.find_element(By.XPATH, "//button[contains(., 'Salvar e Adicionar')]").click()

        try:
            print("⏳ Aguardando recarregamento da página e aparição do livro...")
            
            WebDriverWait(driver, 15).until(
                EC.text_to_be_present_in_element((By.TAG_NAME, "body"), titulo_livro)
            )
            print(f"✅ SUCESSO! O livro '{titulo_livro}' foi encontrado na sua biblioteca.")

        except Exception as e:
            driver.save_screenshot("erro_validacao_livro.png")
            
            try:
                msg = driver.find_element(By.XPATH, "//*[contains(@class, 'destructive')]").text
                print(f"❌ O sistema mostrou erro: {msg}")
            except:
                pass
                
            self.fail(f"❌ Falha: O livro não apareceu na lista após salvar. (Veja erro_validacao_livro.png)")

    def tearDown(self):
        if self.driver:
            self.driver.quit()

if __name__ == "__main__":
    unittest.main()