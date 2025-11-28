"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const { toast } = useToast()
  const API_URL = process.env.NEXT_PUBLIC_API_URL

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // CHAMADA REAL DE LOGIN
      const response = await fetch(`${API_URL}/api/v1/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      })

      if (response.ok) {
        const userData = await response.json()
        
        localStorage.setItem("librishare_user_id", userData.id.toString())
        
        toast({ title: "Login realizado!", description: `Bem-vindo(a), ${userData.firstName}.` })
        window.location.href = "/dashboard"
      } else {
        // Erro 401 (Bad Credentials)
        const err = await response.json()
        toast({ 
          title: "Erro de acesso", 
          description: err.message || "Email ou senha incorretos.", 
          variant: "destructive" 
        })
        setIsLoading(false)
      }
    } catch (error) {
      console.error("Erro de conexão:", error)
      toast({ title: "Erro de conexão", variant: "destructive" })
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Image
              src="/images/librishare-logo.png"
              alt="LibriShare"
              width={120}
              height={120}
              className="rounded-2xl"
            />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-balance">Bem-vindo ao LibriShare</h1>
            <p className="text-muted-foreground text-pretty">Conecte-se, catalogue e descubra novos livros</p>
          </div>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl text-center">Entrar na sua conta</CardTitle>
            <CardDescription className="text-center">
              Digite suas credenciais para acessar sua biblioteca
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="seu@email.com" 
                    className="pl-10" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10 pr-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Entrando...
                  </div>
                ) : (
                  "Entrar"
                )}
              </Button>
            </form>

            <div className="text-center text-sm mt-4">
              <span className="text-muted-foreground">Não tem uma conta? </span>
              <Link href="/signup" className="text-primary hover:underline font-medium">
                Criar conta
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-xs text-muted-foreground">
          <p>Ao continuar, você concorda com nossos</p>
          <div className="flex justify-center gap-4 mt-1">
            <button className="hover:text-foreground">Termos de Uso</button>
            <span>•</span>
            <button className="hover:text-foreground">Política de Privacidade</button>
          </div>
        </div>
      </div>
    </div>
  )
}