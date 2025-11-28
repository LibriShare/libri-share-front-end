from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
import time

def criar_usuario_padrao():
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service)
    driver.maximize_window()
    
    EMAIL = "usuario.teste@librishare.com"
    SENHA = "Password123!" 
    
    try:
        print("🚀 Abrindo página de cadastro...")
        driver.get("http://localhost:3000/signup")
        
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "firstName"))
        ).send_keys("Usuario")
        
        driver.find_element(By.ID, "lastName").send_keys("Teste")
        driver.find_element(By.ID, "email").send_keys(EMAIL)
        driver.find_element(By.ID, "password").send_keys(SENHA)
        driver.find_element(By.ID, "confirmPassword").send_keys(SENHA)
        
        print(f"📝 Tentando cadastrar: {EMAIL} ...")
        driver.find_element(By.XPATH, "//button[@type='submit']").click()
        
        try:
            WebDriverWait(driver, 5).until(EC.alert_is_present())
            alerta = driver.switch_to.alert
            texto = alerta.text
            alerta.accept()
            print(f"🔔 Resultado do Alerta: {texto}")
            
            if "sucesso" in texto.lower():
                print("✅ Usuário CRIADO com sucesso!")
            else:
                print("⚠️  Aviso: O usuário provavelmente já existe (isso é bom).")
                
        except:
            print("ℹ️  Nenhum alerta nativo detectado. Verificando se houve redirecionamento...")

    except Exception as e:
        print(f"❌ Erro ao tentar criar usuário: {e}")
    finally:
        driver.quit()

if __name__ == "__main__":
    criar_usuario_padrao()