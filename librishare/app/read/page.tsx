"use client"

import { useState, useEffect, useCallback } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, Calendar, BookOpen, Loader2, RotateCcw } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { useUserId } from "@/hooks/use-user-id" 

interface ReadBook {
  id: number    
  bookId: number  
  title: string
  author: string
  cover: string
  rating: number
  finishedDate: string
  pages: number
  review: string
}

export default function ReadPage() {
  const [books, setBooks] = useState<ReadBook[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  
  const { userId } = useUserId() 
  const API_URL = process.env.NEXT_PUBLIC_API_URL

  const fetchReadBooks = useCallback(async () => {
    if (!userId) return 

    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/api/v1/users/${userId}/library`)
      
      if (response.ok) {
        const data = await response.json()
        
        const readBooks = data
          .filter((item: any) => item.status === "READ")
          .map((item: any) => ({
            id: item.id,
            bookId: item.bookId,
            title: item.title,
            author: item.author,
            cover: item.coverImageUrl || "/placeholder.svg",
            rating: item.rating || 0,
            finishedDate: item.finishedReadingAt || item.addedAt, 
            pages: item.totalPages || 0,
            review: item.review || "Sem resenha.",
          }))
        
        setBooks(readBooks)
      }
    } catch (error) {
      console.error("Erro ao carregar livros lidos:", error)
    } finally {
      setLoading(false)
    }
  }, [API_URL, userId])

  useEffect(() => {
    fetchReadBooks()
  }, [fetchReadBooks])

  const handleReread = async (userBookId: number) => {
    if (!userId) return

    try {
       const responseStatus = await fetch(`${API_URL}/api/v1/users/${userId}/library/${userBookId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "READING" })
      })

      if (responseStatus.ok) {
         await fetch(`${API_URL}/api/v1/users/${userId}/library/${userBookId}/progress`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ currentPage: 0 })
         })

         toast({ title: "Boa leitura!", description: "Livro movido para 'Lendo Agora'." })
         fetchReadBooks() 
      }
    } catch (error) {
        toast({ title: "Erro", description: "Não foi possível iniciar releitura.", variant: "destructive" })
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
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Livros Lidos 🏆</h1>
              <p className="text-muted-foreground">Sua coleção de livros concluídos</p>
            </div>

            {books.length === 0 ? (
               <div className="text-center py-12 border-2 border-dashed rounded-lg">
                 <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-20" />
                 <p className="text-muted-foreground">Você ainda não terminou nenhum livro.</p>
               </div>
            ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {books.map((book) => (
                <Card key={book.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <Image
                          src={book.cover}
                          alt={book.title}
                          width={80}
                          height={120}
                          className="rounded-lg shadow-sm object-cover"
                        />
                      </div>

                      <div className="flex-1 space-y-2">
                        <div>
                          <h3 className="font-semibold text-foreground line-clamp-2">{book.title}</h3>
                          <p className="text-sm text-muted-foreground">{book.author}</p>
                        </div>

                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < book.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                              }`}
                            />
                          ))}
                        </div>

                        <div className="space-y-1 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>Concluído em {new Date(book.finishedDate).toLocaleDateString("pt-BR")}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <BookOpen className="h-3 w-3" />
                            <span>{book.pages} páginas</span>
                          </div>
                        </div>

                        <div className="flex gap-2 mt-2">
                          <Link href={`/books/${book.bookId}`} className="flex-1">
                            <Button size="sm" variant="outline" className="w-full text-xs bg-transparent">
                              Ver Detalhes
                            </Button>
                          </Link>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="text-xs px-2"
                            onClick={() => handleReread(book.id)}
                            title="Reler este livro"
                          >
                            <RotateCcw className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}