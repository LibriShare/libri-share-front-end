"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard/header"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { Sidebar } from "@/components/dashboard/sidebar"
import Link from "next/link"

export default function DashboardPage() {
  const [userName, setUserName] = useState("...") // Estado para o nome

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL
        // Buscamos o usuário de ID 1 (o primeiro que você criou)
        const response = await fetch(`${API_URL}/api/v1/users/1`)
        
        if (response.ok) {
          const data = await response.json()
          // Pegamos o firstName do DTO do Java
          setUserName(data.firstName) 
        } else {
          setUserName("Visitante")
        }
      } catch (error) {
        console.error("Erro ao buscar usuário:", error)
        setUserName("Leitor(a)")
      }
    }

    fetchUserData()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <div className="flex">
        <aside className="hidden lg:block border-r bg-card/50">
          <Sidebar />
        </aside>

        <main className="flex-1 px-4 py-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Welcome Section */}
            <div className="space-y-2">
              {/* AQUI ESTÁ A MUDANÇA: Usamos a variável {userName} */}
              <h1 className="text-3xl font-bold text-balance">Boa tarde, {userName}! 📚</h1>
              <p className="text-muted-foreground text-pretty">Bem-vinda de volta à sua biblioteca pessoal.</p>
            </div>

            {/* Stats Cards */}
            <StatsCards />

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Empréstimos Recentes</h2>
                <div className="space-y-3">
                  <Link
                    href="/loans"
                    className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="w-10 h-14 bg-primary/10 rounded flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">O Alquimista</div>
                      <div className="text-sm text-muted-foreground">Para: João Silva</div>
                      <div className="text-xs text-accent-foreground">Vence em 5 dias</div>
                    </div>
                  </Link>
                  <Link
                    href="/loans"
                    className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="w-10 h-14 bg-secondary/10 rounded flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">1984</div>
                      <div className="text-sm text-muted-foreground">Para: Ana Costa</div>
                      <div className="text-xs text-destructive">Atrasado 2 dias</div>
                    </div>
                  </Link>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Atividade da Comunidade</h2>
                <div className="space-y-3">
                  <Link href="/community" className="p-3 border rounded-lg hover:bg-muted/50 transition-colors block">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 bg-primary rounded-full flex-shrink-0"></div>
                      <span className="text-sm font-medium">Carlos Mendes</span>
                    </div>
                    <div className="text-sm text-muted-foreground">Adicionou "Dom Casmurro" à sua biblioteca</div>
                    <div className="text-xs text-muted-foreground mt-1">há 2 horas</div>
                  </Link>
                  <Link href="/community" className="p-3 border rounded-lg hover:bg-muted/50 transition-colors block">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 bg-secondary rounded-full flex-shrink-0"></div>
                      <span className="text-sm font-medium">Lucia Santos</span>
                    </div>
                    <div className="text-sm text-muted-foreground">Avaliou "Cem Anos de Solidão" com 5 estrelas</div>
                    <div className="text-xs text-muted-foreground mt-1">há 4 horas</div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}