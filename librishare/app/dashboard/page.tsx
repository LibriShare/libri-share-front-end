"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard/header"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { Sidebar } from "@/components/dashboard/sidebar"
import Link from "next/link"
import { format, isPast, parseISO } from "date-fns"
import { ptBR } from "date-fns/locale"
import { User, BookOpen, AlertCircle } from "lucide-react"

// Interface para o empréstimo (Loan)
interface Loan {
  id: number
  userBook: {
    book: {
      title: string
      coverImageUrl: string
    }
  }
  borrowerName: string
  dueDate: string
  status: string
}

export default function DashboardPage() {
  const [userName, setUserName] = useState("...")
  const [recentLoans, setRecentLoans] = useState<Loan[]>([])
  const [loadingLoans, setLoadingLoans] = useState(true)

  const API_URL = process.env.NEXT_PUBLIC_API_URL
  const USER_ID = 1 // Fixo por enquanto

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Buscar nome do usuário
        const userRes = await fetch(`${API_URL}/api/v1/users/${USER_ID}`)
        if (userRes.ok) {
          const data = await userRes.json()
          setUserName(data.firstName)
        }

        // 2. Buscar empréstimos recentes
        const loansRes = await fetch(`${API_URL}/api/v1/users/${USER_ID}/loans`)
        if (loansRes.ok) {
          const data: Loan[] = await loansRes.json()
          // Pega apenas os 2 primeiros (já vem ordenado por data do backend)
          // Filtra apenas os ativos para mostrar na home, ou mostra todos se preferir
          const active = data.filter(l => l.status === 'ACTIVE').slice(0, 3)
          setRecentLoans(active)
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error)
        setUserName("Leitor(a)")
      } finally {
        setLoadingLoans(false)
      }
    }

    fetchData()
  }, [API_URL])

  // Helper para verificar atraso
  const isOverdue = (dateStr: string) => {
    return isPast(parseISO(dateStr)) && new Date().toISOString().split('T')[0] !== dateStr
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Welcome Section */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-balance text-foreground">Boa tarde, {userName}! 📚</h1>
              <p className="text-muted-foreground text-pretty">Bem-vinda de volta à sua biblioteca pessoal.</p>
            </div>

            {/* Stats Cards */}
            <StatsCards />

            <div className="grid gap-6 md:grid-cols-2">
              {/* SEÇÃO DE EMPRÉSTIMOS RECENTES ATUALIZADA */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">Empréstimos Recentes</h2>
                
                {loadingLoans ? (
                   <div className="p-4 border rounded-lg bg-card text-muted-foreground text-center text-sm">Carregando...</div>
                ) : recentLoans.length === 0 ? (
                   <div className="p-8 border border-dashed rounded-lg text-center">
                      <BookOpen className="mx-auto h-8 w-8 text-muted-foreground mb-2 opacity-50" />
                      <p className="text-muted-foreground text-sm">Nenhum empréstimo ativo no momento.</p>
                      <Link href="/loans" className="text-primary text-sm hover:underline mt-1 block">Criar novo empréstimo</Link>
                   </div>
                ) : (
                  <div className="space-y-3">
                    {recentLoans.map((loan) => {
                      const overdue = isOverdue(loan.dueDate)
                      
                      return (
                        <Link
                          key={loan.id}
                          href="/loans"
                          className="flex items-center gap-3 p-3 border bg-card rounded-lg hover:bg-accent/50 transition-colors group"
                        >
                          {/* Capa do Livro ou Placeholder */}
                          <div className="w-10 h-14 bg-muted rounded flex-shrink-0 overflow-hidden relative">
                             {loan.userBook?.book?.coverImageUrl ? (
                                <img 
                                  src={loan.userBook.book.coverImageUrl} 
                                  alt={loan.userBook.book.title}
                                  className="w-full h-full object-cover"
                                />
                             ) : (
                                <div className="flex items-center justify-center h-full w-full text-muted-foreground">
                                  <BookOpen size={16} />
                                </div>
                             )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate text-foreground group-hover:text-primary transition-colors">
                                {loan.userBook?.book?.title || "Livro sem título"}
                            </div>
                            <div className="text-sm text-muted-foreground flex items-center gap-1">
                                <User size={12} /> {loan.borrowerName}
                            </div>
                            <div className={`text-xs mt-0.5 font-medium flex items-center gap-1 ${overdue ? "text-red-500" : "text-green-600 dark:text-green-400"}`}>
                              {overdue ? (
                                <>
                                  <AlertCircle size={10} /> Atrasado desde {format(parseISO(loan.dueDate), "dd/MM")}
                                </>
                              ) : (
                                <>Vence em {format(parseISO(loan.dueDate), "dd 'de' MMM", { locale: ptBR })}</>
                              )}
                            </div>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Atividade da Comunidade (Mantido como estático por enquanto, pois não temos endpoint ainda) */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">Atividade da Comunidade</h2>
                <div className="space-y-3">
                  <Link href="/community" className="p-3 border bg-card rounded-lg hover:bg-accent/50 transition-colors block">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 bg-pink-600 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] text-white font-bold">CM</div>
                      <span className="text-sm font-medium text-foreground">Carlos Mendes</span>
                    </div>
                    <div className="text-sm text-muted-foreground">Adicionou "Dom Casmurro" à sua biblioteca</div>
                    <div className="text-xs text-muted-foreground mt-1">há 2 horas</div>
                  </Link>
                  <Link href="/community" className="p-3 border bg-card rounded-lg hover:bg-accent/50 transition-colors block">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 bg-slate-600 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] text-white font-bold">LS</div>
                      <span className="text-sm font-medium text-foreground">Lucia Santos</span>
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