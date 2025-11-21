"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard/header"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Target, Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function UpdateProgressPage({ params }: { params: { id: string } }) {
  const [pagesRead, setPagesRead] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [bookTitle, setBookTitle] = useState("")
  const [bookCover, setBookCover] = useState("")
  const [loading, setLoading] = useState(true)
  
  const router = useRouter()
  const { toast } = useToast()
  const API_URL = process.env.NEXT_PUBLIC_API_URL
  const USER_ID = 1
  
  // O ID da URL aqui é o UserBook ID (vínculo)
  const userBookId = params.id

  // 1. Buscar dados atuais
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Precisamos buscar a lista para achar o livro específico (ou criar um endpoint GET /library/{id} seria melhor, mas vamos reutilizar a lista por enquanto)
        const response = await fetch(`${API_URL}/api/v1/users/${USER_ID}/library`)
        if (response.ok) {
          const library = await response.json()
          const item = library.find((b: any) => b.id.toString() === userBookId)
          
          if (item) {
            setBookTitle(item.title)
            setBookCover(item.coverImageUrl || "/placeholder.svg")
            setTotalPages(item.totalPages || 0)
            setPagesRead(item.currentPage || 0)
          }
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [userBookId, API_URL])

  // 2. Salvar progresso
  const handleSave = async () => {
    try {
      const response = await fetch(`${API_URL}/api/v1/users/${USER_ID}/library/${userBookId}/progress`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPage: pagesRead })
      })

      if (response.ok) {
        toast({ title: "Progresso salvo!", description: "Continue assim!" })
        router.push("/reading") // Volta para a lista
      } else {
        toast({ title: "Erro", description: "Não foi possível salvar.", variant: "destructive" })
      }
    } catch (error) {
        toast({ title: "Erro de conexão", variant: "destructive" })
    }
  }

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>

  const progressPercentage = totalPages > 0 ? Math.round((pagesRead / totalPages) * 100) : 0

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <div className="flex">
        <aside className="hidden lg:block border-r bg-card/50"><Sidebar /></aside>
        <main className="flex-1 px-4 py-8">
          <div className="max-w-2xl mx-auto space-y-6">
            <Link href="/reading" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" /> Voltar
            </Link>

            <Card>
              <CardContent className="p-6 flex gap-4">
                <Image src={bookCover} alt={bookTitle} width={60} height={90} className="rounded shadow object-cover" />
                <div>
                   <h1 className="text-xl font-bold">{bookTitle}</h1>
                   <p className="text-muted-foreground">{totalPages} páginas no total</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Target className="h-5 w-5" /> Atualizar Leitura</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progresso</span>
                    <span>{progressPercentage}%</span>
                  </div>
                  <Progress value={progressPercentage} className="h-3" />
                </div>

                <div className="space-y-2">
                  <Label>Páginas Lidas</Label>
                  <Input 
                    type="number" 
                    min="0" 
                    max={totalPages} 
                    value={pagesRead} 
                    onChange={(e) => setPagesRead(Number(e.target.value))} 
                  />
                  <p className="text-xs text-muted-foreground">Máximo: {totalPages}</p>
                </div>

                <Button onClick={handleSave} className="w-full">Salvar Progresso</Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}