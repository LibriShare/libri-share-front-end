"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation" // Importamos o "roteador"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert" // Importamos o Alerta
import { Eye, EyeOff, Shield, AlertCircle } from "lucide-react"
import Image from "next/image"

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // --- Estados para os campos do formulário ---
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [cpf, setCpf] = useState("")
  const [birthDate, setBirthDate] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  // --- Estados de Endereço ---
  const [street, setStreet] = useState("")
  const [number, setNumber] = useState("")
  const [neighborhood, setNeighborhood] = useState("")
  const [complement, setComplement] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [zipCode, setZipCode] = useState("")

  // --- Estados de Controle da API ---
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter() // Hook para redirecionar o usuário

  // Função que será chamada ao enviar o formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault() // Impede o recarregamento da página
    setLoading(true)
    setError(null)

    if (password !== confirmPassword) {
      setError("As senhas não conferem.")
      setLoading(false)
      return
    }

    // Pegamos a URL da API da variável de ambiente que definimos no docker-compose
    const API_URL = process.env.NEXT_PUBLIC_API_URL

    // 1. Montamos o objeto (DTO) que o back-end espera
    //   
    const userRequestDTO = {
      firstName,
      lastName,
      email,
      password,
      cpf,
      dateOfBirth: birthDate || null, // Envia nulo se estiver vazio
      addressStreet: street,
      addressCity: city,
      addressState: state,
      addressZip: zipCode,
      // Você pode adicionar os campos que faltam (neighborhood, complement) no seu DTO se quiser
    }

    try {
      // 2. Fazemos a chamada "fetch" para a API
      const response = await fetch(`${API_URL}/api/v1/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userRequestDTO),
      })

      // 3. Lidamos com a resposta
      if (response.ok) {
        // Sucesso!
        alert("Conta criada com sucesso! Você será redirecionado para o login.")
        router.push("/") // Redireciona para a página de login
      } else {
        // Erro!
        const errorData = await response.json()
        
        // Pega o erro de validação (ex: email inválido) ou de duplicidade (ex: email já existe)
        //
        if (errorData.errors) {
          // Erro de validação (pega o primeiro)
          const firstErrorKey = Object.keys(errorData.errors)[0]
          setError(errorData.errors[firstErrorKey])
        } else {
          // Erro de duplicidade (ex: 409 Conflict)
          setError(errorData.message)
        }
      }
    } catch (err) {
      console.error("Erro de conexão:", err) // Adicionamos um console.error para ver o erro
      setError("Não foi possível conectar ao servidor. Verifique o console (F12) e tente novamente.")
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <Image src="/images/librishare-logo.png" alt="LibriShare" width={120} height={120} className="mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white mb-2">Criar Conta</h1>
          <p className="text-slate-300">Junte-se à comunidade LibriShare</p>
        </div>

        <Card className="border-0 shadow-2xl bg-white backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl text-center text-slate-800">Cadastre-se</CardTitle>
            <CardDescription className="text-center text-slate-600">
              Preencha os dados abaixo para criar sua conta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert className="border-emerald-200 bg-emerald-50">
              <Shield className="h-4 w-4 text-emerald-600" />
              <AlertDescription className="text-sm text-slate-700">
                <strong>Informações de Segurança:</strong> Para solicitar empréstimos de livros, é necessário fornecer
                CPF, data de nascimento e endereço completo. Seus dados são protegidos e usados apenas para fins de
                segurança.
              </AlertDescription>
            </Alert>

            {/* Mostra o erro da API aqui */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Erro no Cadastro</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Adicionamos o 'onSubmit' ao formulário */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-slate-800 border-b border-slate-200 pb-2">
                  Informações Pessoais
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-slate-700 font-medium">
                      Nome *
                    </Label>
                    <Input
                      id="firstName"
                      placeholder="Seu nome"
                      className="border-slate-300 focus:border-emerald-500"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-slate-700 font-medium">
                      Sobrenome *
                    </Label>
                    <Input
                      id="lastName"
                      placeholder="Seu sobrenome"
                      className="border-slate-300 focus:border-emerald-500"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cpf" className="text-slate-700 font-medium">
                      CPF *
                    </Label>
                    <Input
                      id="cpf"
                      placeholder="000.000.000-00"
                      className="border-slate-300 focus:border-emerald-500"
                      value={cpf}
                      onChange={(e) => setCpf(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="birthDate" className="text-slate-700 font-medium">
                      Data de Nascimento
                    </Label>
                    <Input
                      id="birthDate"
                      type="date"
                      className="border-slate-300 focus:border-emerald-500"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium text-slate-800 border-b border-slate-200 pb-2">Endereço</h3>

                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="street" className="text-slate-700 font-medium">
                      Rua
                    </Label>
                    <Input
                      id="street"
                      placeholder="Nome da rua"
                      className="border-slate-300 focus:border-emerald-500"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="number" className="text-slate-700 font-medium">
                      Número
                    </Label>
                    <Input
                      id="number"
                      placeholder="123"
                      className="border-slate-300 focus:border-emerald-500"
                      value={number}
                      onChange={(e) => setNumber(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="neighborhood" className="text-slate-700 font-medium">
                      Bairro
                    </Label>
                    <Input
                      id="neighborhood"
                      placeholder="Nome do bairro"
                      className="border-slate-300 focus:border-emerald-500"
                      value={neighborhood}
                      onChange={(e) => setNeighborhood(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="complement" className="text-slate-700 font-medium">
                      Complemento
                    </Label>
                    <Input
                      id="complement"
                      placeholder="Apto, casa, etc."
                      className="border-slate-300 focus:border-emerald-500"
                      value={complement}
                      onChange={(e) => setComplement(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-slate-700 font-medium">
                      Cidade
                    </Label>
                    <Input
                      id="city"
                      placeholder="Sua cidade"
                      className="border-slate-300 focus:border-emerald-500"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state" className="text-slate-700 font-medium">
                      Estado
                    </Label>
                    <Input
                      id="state"
                      placeholder="UF"
                      className="border-slate-300 focus:border-emerald-500"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode" className="text-slate-700 font-medium">
                      CEP
                    </Label>
                    <Input
                      id="zipCode"
                      placeholder="00000-000"
                      className="border-slate-300 focus:border-emerald-500"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium text-slate-800 border-b border-slate-200 pb-2">
                  Credenciais da Conta
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700 font-medium">
                    Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    className="border-slate-300 focus:border-emerald-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-700 font-medium">
                    Senha *
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Sua senha (mín. 8 caracteres)"
                      className="border-slate-300 focus:border-emerald-500 pr-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-slate-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-slate-500" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-slate-700 font-medium">
                    Confirmar Senha *
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirme sua senha"
                      className="border-slate-300 focus:border-emerald-500 pr-10"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-slate-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-slate-500" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Adicionamos o 'disabled={loading}' */}
              <Button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 text-base"
                disabled={loading}
              >
                {loading ? "Criando conta..." : "Criar Conta"}
              </Button>
            </form>
            
            {/* O resto do arquivo continua igual... */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-600">Ou continue com</span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full border-slate-300 hover:bg-slate-50 bg-white text-slate-700 font-medium"
              disabled={loading} // Também aqui
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 1c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Cadastrar com Google
            </Button>

            <div className="text-center text-sm">
              <span className="text-slate-600">Já tem uma conta? </span>
              <Link href="/" className="text-emerald-600 hover:text-emerald-700 font-medium">
                Fazer login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}