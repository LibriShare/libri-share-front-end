"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Grid, List, Star, Clock, CheckCircle, BookOpen, Loader2, Bookmark } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"

interface Book {
  id: string
  bookId: string
  title: string
  author: string
  cover: string
  status: "read" | "reading" | "tbr" // Adicionado "tbr" (To Be Read)
  rating?: number
  genre: string
  pages: number
}

export function LibraryGrid() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const { toast } = useToast()
  
  const API_URL = process.env.NEXT_PUBLIC_API_URL

  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${API_URL}/api/v1/users/1/library`)
        if (response.ok) {
          const data = await response.json()
          
          // Filtra: Mostra tudo que NÃO é Lista de Desejos (ou seja: Lidos, Lendo e Para Ler)
          const myBooks = data.filter((item: any) => item.status !== "WANT_TO_READ");

          const mappedBooks: Book[] = myBooks.map((item: any) => ({
            id: item.id.toString(),
            bookId: item.bookId.toString(),
            title: item.title,
            author: item.author,
            cover: item.coverImageUrl || "/placeholder.svg",
            status: mapStatus(item.status),
            rating: item.rating,
            genre: "Geral",
            pages: 0
          }))
          setBooks(mappedBooks)
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchLibrary()
  }, [])

  const mapStatus = (backendStatus: string): "read" | "reading" | "tbr" => {
    switch (backendStatus) {
      case "READ": return "read"
      case "READING": return "reading"
      case "TO_READ": return "tbr" // Mapeia o novo status do backend
      default: return "tbr"
    }
  }

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || book.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "read": return <CheckCircle className="h-4 w-4 text-secondary" />
      case "reading": return <Clock className="h-4 w-4 text-primary" />
      case "tbr": return <Bookmark className="h-4 w-4 text-indigo-500" /> // Ícone para "Para Ler"
      default: return null
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "read": return "Lido"
      case "reading": return "Lendo"
      case "tbr": return "Para Ler"
      default: return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "read": return "bg-secondary/10 text-secondary-foreground border-secondary/20"
      case "reading": return "bg-primary/10 text-primary-foreground border-primary/20"
      case "tbr": return "bg-indigo-500/10 text-indigo-600 border-indigo-500/20" // Cor distinta
      default: return "bg-muted"
    }
  }

  const renderStars = (rating?: number) => {
    if (!rating) return null
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-3 w-3 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
          />
        ))}
      </div>
    )
  }

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar na sua estante..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Filtrar por Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Livros</SelectItem>
              <SelectItem value="reading">📖 Lendo Agora</SelectItem>
              <SelectItem value="tbr">📚 Para Ler</SelectItem>
              <SelectItem value="read">✅ Lidos</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button variant={viewMode === "grid" ? "default" : "outline"} size="sm" onClick={() => setViewMode("grid")}>
            <Grid className="h-4 w-4" />
          </Button>
          <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")}>
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="text-sm text-muted-foreground">
        {filteredBooks.length} {filteredBooks.length === 1 ? "livro encontrado" : "livros encontrados"}
      </div>

      {viewMode === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredBooks.map((book) => (
            <div key={book.id} className="group">
              <Link href={`/books/${book.bookId}`}>
                <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer h-full">
                  <CardContent className="p-3">
                    <div className="space-y-3">
                      <div className="relative w-full aspect-[2/3]">
                        <Image
                          src={book.cover}
                          alt={book.title}
                          fill
                          className="object-cover rounded-md"
                        />
                        <div className="absolute top-2 right-2">{getStatusIcon(book.status)}</div>
                      </div>

                      <div className="space-y-2">
                        <div>
                          <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                            {book.title}
                          </h3>
                          <p className="text-xs text-muted-foreground line-clamp-1">{book.author}</p>
                        </div>

                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className={`text-[10px] px-1 ${getStatusColor(book.status)}`}>
                            {getStatusLabel(book.status)}
                          </Badge>
                          {renderStars(book.rating)}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredBooks.map((book) => (
            <div key={book.id}>
              <Link href={`/books/${book.bookId}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-12 h-16 flex-shrink-0">
                        <Image
                            src={book.cover}
                            alt={book.title}
                            fill
                            className="object-cover rounded-md"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0 flex-1">
                            <h3 className="font-medium truncate hover:text-primary transition-colors">{book.title}</h3>
                            <p className="text-sm text-muted-foreground">{book.author}</p>
                            <div className="flex items-center gap-3 mt-2">
                              <Badge variant="outline" className={`text-xs ${getStatusColor(book.status)}`}>
                                {getStatusLabel(book.status)}
                              </Badge>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 flex-shrink-0">
                            {renderStars(book.rating)}
                            {getStatusIcon(book.status)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          ))}
        </div>
      )}
      
      {filteredBooks.length === 0 && !loading && (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p className="text-muted-foreground">Nenhum livro encontrado com este filtro.</p>
        </div>
      )}
    </div>
  )
}