"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  BookOpen, 
  ArrowRightLeft, 
  CheckCircle2, 
  History, 
  PlusCircle,
  Clock,
  Heart // Importe o Heart
} from "lucide-react"
import { format, parseISO } from "date-fns"
import { ptBR } from "date-fns/locale"

interface HistoryItem {
  actionType: string
  description: string
  createdAt: string
}

export function RecentActivity() {
  const [activities, setActivities] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  
  const API_URL = process.env.NEXT_PUBLIC_API_URL
  const USER_ID = 1

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch(`${API_URL}/api/v1/users/${USER_ID}/history`)
        if (response.ok) {
          setActivities(await response.json())
        }
      } catch (error) {
        console.error("Erro histórico", error)
      } finally {
        setLoading(false)
      }
    }
    fetchHistory()
  }, [API_URL])

  const getIcon = (type: string) => {
    switch (type) {
      // Adicionado case para LISTA DE DESEJOS
      case "LISTA DE DESEJOS": return <Heart className="h-4 w-4 text-rose-500" />
      case "BIBLIOTECA": return <PlusCircle className="h-4 w-4 text-emerald-500" />
      case "EMPRÉSTIMO": return <ArrowRightLeft className="h-4 w-4 text-orange-500" />
      case "DEVOLUÇÃO": return <CheckCircle2 className="h-4 w-4 text-blue-500" />
      case "LEITURA": return <BookOpen className="h-4 w-4 text-primary" />
      default: return <History className="h-4 w-4 text-muted-foreground" />
    }
  }

  if (loading) return <div className="h-32 flex items-center justify-center text-sm text-muted-foreground">Carregando...</div>

  return (
    <Card className="h-full border-muted/60 bg-card">
      <CardHeader className="pb-3 border-b border-border/40">
        <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <History className="h-4 w-4" /> 
          Últimas Atividades
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {activities.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-2">Nenhuma atividade recente.</p>
        ) : (
          <div className="space-y-5">
            {activities.map((item, i) => (
              <div key={i} className="flex gap-3">
                <div className="mt-0.5 bg-muted/40 p-2 rounded-full shrink-0 border border-border/50 h-fit">
                  {getIcon(item.actionType)}
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-snug text-foreground">
                    {item.description}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground/70">
                    <Clock className="h-3 w-3" />
                    {format(parseISO(item.createdAt), "dd 'de' MMM, HH:mm", { locale: ptBR })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}