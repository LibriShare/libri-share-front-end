"use client"

import { useState, useEffect, useCallback } from "react"
import { DashboardHeader } from "@/components/dashboard/header"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Clock, BookOpen, Calendar, Loader2, CheckCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { useUserId } from "@/hooks/use-user-id" // <--- 1. Importar o Hook

interface ReadingBook {
  id: number       // ID do UserBook (vínculo)
  bookId: number   // ID do Livro
  title: string
  author: string
  cover: string
  status: string
  totalPages: number
  pagesRead: number
  startDate: string
}

export default function ReadingPage() {
  const [books, setBooks] = useState<ReadingBook[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  
  const { userId } = useUserId() // <--- 2. Pegar o ID real
  const API_URL = process.env.NEXT_PUBLIC_API_URL

  // Envolve a função em useCallback para usar no useEffect
  const fetchReadingBooks = useCallback(async () => {
    if (!userId) return // <--- 3. Só busca se tiver ID

    try {
      setLoading(true)
      // Usa userId dinâmico
      const response = await fetch(`${API_URL}/api/v1/users/${userId}/library`)
      
      if (response.ok) {
        const data = await response.json()
        
        // Filtra APENAS os livros com status "READING"
        const readingBooks = data
          .filter((item: any) => item.status === "READING")
          .map((item: any) => ({
            id: item.id,
            bookId: item.bookId,
            title: item.title,
            author: item.author,
            cover: item.coverImageUrl || "/placeholder.svg",
            status: "reading",
            totalPages: item.totalPages || 0,
            pagesRead: item.currentPage || 0,
            startDate: item.startedReadingAt || item.addedAt // Usa a data de início ou de adição
          }))
        
        setBooks(readingBooks)
      }
    } catch (error) {
      console.error("Erro ao carregar livros:", error)
      toast({ title: "Erro", description: "Não foi possível carregar sua lista de leitura.", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }, [API_URL, userId, toast])

  useEffect(() => {
    fetchReadingBooks()
  }, [fetchReadingBooks])

  // Função para marcar como lido
  const handleMarkAsRead = async (userBookId: number) => {
    if (!userId) return

    try {
      const response = await fetch(`${API_URL}/api/v1/users/${userId}/library/${userBookId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "READ" })
      })

      if (response.ok) {
        toast({ title: "Parabéns!", description: "Livro marcado como lido." })
        fetchReadingBooks() // Recarrega a lista
      } else {
        toast({ title: "Erro", description: "Não foi possível atualizar o status.", variant: "destructive" })
      }
    } catch (error) {
      console.error(error)
      toast({ title: "Erro de conexão", variant: "destructive" })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
         <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <div className="hidden lg:block">
        <Sidebar />
      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Lendo Agora 📖</h1>
              <p className="text-muted-foreground">Acompanhe o progresso dos seus livros atuais</p>
            </div>

            {books.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed rounded-lg">
                <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <h3 className="text-lg font-medium">Nenhum livro em andamento</h3>
                <p className="text-muted-foreground mb-4">Vá até sua biblioteca e comece a ler um livro!</p>
                <Link href="/library">
                  <Button>Ir para Minha Biblioteca</Button>
                </Link>
              </div>
            ) : (
              <div className="grid gap-6">
                {books.map((book) => {
                  const percentage = book.totalPages > 0 ? Math.round((book.pagesRead / book.totalPages) * 100) : 0;
                  
                  return (
                  <Card key={book.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row gap-6">
                        <div className="flex-shrink-0 mx-auto sm:mx-0">
                          <div className="relative w-[100px] h-[150px]">
                             <Image
                               src={book.cover}
                               alt={book.title}
                               fill
                               className="object-cover rounded-lg shadow-md"
                             />
                          </div>
                        </div>

                        <div className="flex-1 space-y-4 w-full">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-xl font-semibold text-foreground mb-1">{book.title}</h3>
                              <p className="text-muted-foreground">{book.author}</p>
                            </div>
                            <div className="flex items-center gap-2 text-primary bg-primary/10 px-2 py-1 rounded text-xs font-medium">
                               <Clock className="h-3 w-3" />
                               Lendo Agora
                            </div>
                          </div>

                          {/* Barra de Progresso */}
                          <div className="space-y-3">
                            <div>
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium">Progresso</span>
                                <span className="text-sm text-muted-foreground">{percentage}% ({book.pagesRead} / {book.totalPages})</span>
                              </div>
                              <Progress value={percentage} className="h-2" />
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div className="flex items-center gap-2">
                                <BookOpen className="h-4 w-4 text-muted-foreground" />
                                <span>{book.totalPages} páginas</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span>Iniciado em {new Date(book.startDate).toLocaleDateString("pt-BR")}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2 flex-wrap">
                            <Link href={`/reading/${book.id}/progress`}>
                                <Button size="sm">Atualizar Progresso</Button>
                            </Link>
                            <Link href={`/books/${book.bookId}`}>
                                <Button size="sm" variant="outline">Ver Detalhes</Button>
                            </Link>
                             <Button size="sm" variant="ghost" onClick={() => handleMarkAsRead(book.id)}>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Marcar como Lido
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )})}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}