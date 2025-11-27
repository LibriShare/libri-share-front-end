"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users, Clock, TrendingUp, Loader2, Heart } from "lucide-react" // Importei Heart

export function StatsCards() {
  const [stats, setStats] = useState({
    totalBooks: 0,
    booksRead: 0,
    booksReading: 0,
    booksToRead: 0 // Isso vem do backend correspondendo a WANT_TO_READ
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL
        const response = await fetch(`${API_URL}/api/v1/users/1/library/stats`)
        
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error("Erro ao carregar estatísticas", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return <div className="flex justify-center p-4"><Loader2 className="animate-spin text-primary" /></div>
  }

  const statItems = [
    {
      title: "Total de Livros",
      value: stats.totalBooks,
      description: "Na sua estante",
      icon: BookOpen,
      color: "text-primary",
    },
    {
      title: "Livros Lidos",
      value: stats.booksRead,
      description: "Concluídos",
      icon: TrendingUp,
      color: "text-secondary",
    },
    {
      title: "Lendo Agora",
      value: stats.booksReading,
      description: "Em andamento",
      icon: Clock,
      color: "text-accent-foreground",
    },
    {
      // --- ALTERAÇÃO AQUI: Mudado de "Para Ler" para "Lista de Desejos" ---
      title: "Lista de Desejos",
      value: stats.booksToRead,
      description: "Livros que quero", // Descrição mais adequada
      icon: Heart, // Ícone de coração faz mais sentido para desejos
      color: "text-chart-4",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statItems.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}