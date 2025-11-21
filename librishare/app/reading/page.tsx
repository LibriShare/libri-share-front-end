"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard/header"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Clock, BookOpen, Calendar, Loader2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

interface ReadingBook {
  id: number
  bookId: number
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
  const API_URL = process.env.NEXT_PUBLIC_API_URL
  const USER_ID = 1

  useEffect(() => {
    const fetchReadingBooks = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${API_URL}/api/v1/users/${USER_ID}/library`)
        
        if (response.ok) {
          const data = await response.json()
          
          const readingBooks = data
            .filter((item: any) => item.status === "READING")
            .map((item: any) => ({
              id: item.id,
              bookId: item.bookId,
              title: item.title,
              author: item.author,
              cover: item.coverImageUrl || "/placeholder.svg",
              status: "reading",
              // AGORA PEGAMOS OS DADOS REAIS DO BACK-END ATUALIZADO
              totalPages: item.totalPages || 0,
              pagesRead: item.currentPage || 0,
              startDate: item.addedAt // Usando addedAt por enquanto
            }))
          
          setBooks(readingBooks)
        }
      } catch (error) {
        console.error(error)
        toast({ title: "Erro", description: "Falha ao carregar livros.", variant: "destructive" })
      } finally {
        setLoading(false)
      }
    }
    fetchReadingBooks()
  }, [API_URL, toast])

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Lendo Agora 📖</h1>

            {books.length === 0 ? (
               <div className="text-center py-12 text-muted-foreground">Nenhum livro em leitura.</div>
            ) : (
              <div className="grid gap-6">
                {books.map((book) => {
                  const percentage = book.totalPages > 0 ? Math.round((book.pagesRead / book.totalPages) * 100) : 0;
                  
                  return (
                  <Card key={book.id} className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row gap-6">
                        <div className="flex-shrink-0 mx-auto sm:mx-0">
                          <div className="relative w-[100px] h-[150px]">
                             <Image src={book.cover} alt={book.title} fill className="object-cover rounded-lg shadow-md" />
                          </div>
                        </div>

                        <div className="flex-1 space-y-4 w-full">
                          <div>
                              <h3 className="text-xl font-semibold">{book.title}</h3>
                              <p className="text-muted-foreground">{book.author}</p>
                          </div>

                          <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Progresso: {book.pagesRead} de {book.totalPages} páginas</span>
                                <span className="font-bold">{percentage}%</span>
                              </div>
                              <Progress value={percentage} className="h-2" />
                          </div>

                          <div className="flex gap-2">
                            <Link href={`/reading/${book.id}/progress`}>
                                <Button>Atualizar Progresso</Button>
                            </Link>
                            <Link href={`/books/${book.bookId}`}>
                                <Button variant="outline">Ver Detalhes</Button>
                            </Link>
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