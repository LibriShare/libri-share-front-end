"use client"

import { useState, useEffect, useCallback } from "react"
import { DashboardHeader } from "@/components/dashboard/header"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Star, Calendar, BookOpen, User, Tag, ArrowLeft, Share, Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"

// Interface dos dados que vêm da API (Catálogo)
interface BookData {
  id: number
  title: string
  author: string
  publisher: string
  publicationYear: number
  isbn: string
  pages: number
  coverImageUrl: string
  googleBooksId: string
  description?: string
  genre?: string
}

export default function BookDetailsPage({ params }: { params: { id: string } }) {
  const [book, setBook] = useState<BookData | null>(null)
  const [loading, setLoading] = useState(true)
  
  // Estados de Vínculo com o Usuário
  const [userBookId, setUserBookId] = useState<number | null>(null) // ID do vínculo (UserBook)
  const [currentStatus, setCurrentStatus] = useState("to-read")
  const [isInLibrary, setIsInLibrary] = useState(false)

  // Estados dos Modais
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false)
  const [isLendDialogOpen, setIsLendDialogOpen] = useState(false)
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)
  
  // Estados dos Formulários
  const [borrowerName, setBorrowerName] = useState("")
  const [borrowerEmail, setBorrowerEmail] = useState("")
  const [lendDate, setLendDate] = useState("")
  const [returnDate, setReturnDate] = useState("")
  const [shareMessage, setShareMessage] = useState("")
  
  const { toast } = useToast()
  const API_URL = process.env.NEXT_PUBLIC_API_URL
  const USER_ID = 1 // Fixo por enquanto

  // --- 1. BUSCAR DADOS DO LIVRO (CATÁLOGO) ---
  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${API_URL}/api/v1/books/${params.id}`)
        
        if (response.ok) {
          const data = await response.json()
          setBook({
            ...data,
            description: "Sinopse não disponível.",
            genre: "Geral",
          })
        } else {
          setBook(null)
        }
      } catch (error) {
        console.error("Erro ao carregar livro:", error)
        setBook(null)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchBookDetails()
    }
  }, [params.id, API_URL])

  // --- 2. VERIFICAR SE O LIVRO ESTÁ NA BIBLIOTECA DO USUÁRIO ---
  const fetchUserLibraryInfo = useCallback(async () => {
    try {
      // Busca a biblioteca inteira do usuário (não é o ideal para muitos livros, mas funciona agora)
      const response = await fetch(`${API_URL}/api/v1/users/${USER_ID}/library`)
      if (response.ok) {
        const library: any[] = await response.json()
        
        // Procura se o livro atual (params.id) está na lista
        const found = library.find((item) => item.bookId === Number(params.id))
        
        if (found) {
          setIsInLibrary(true)
          setUserBookId(found.id) // Guarda o ID do vínculo para usar no UPDATE
          setCurrentStatus(mapBackendStatusToFrontend(found.status))
        } else {
          setIsInLibrary(false)
          setUserBookId(null)
        }
      }
    } catch (error) {
      console.error("Erro ao buscar informações da biblioteca:", error)
    }
  }, [API_URL, params.id])

  useEffect(() => {
    fetchUserLibraryInfo()
  }, [fetchUserLibraryInfo])


  // --- FUNÇÕES DE TRADUÇÃO DE STATUS ---
  const mapBackendStatusToFrontend = (status: string) => {
    switch (status) {
      case "READ": return "read"
      case "READING": return "reading"
      case "WANT_TO_READ": return "to-read"
      default: return "to-read"
    }
  }

  const mapFrontendStatusToBackend = (status: string) => {
    switch (status) {
      case "read": return "READ"
      case "reading": return "READING"
      case "to-read": return "WANT_TO_READ"
      default: return "WANT_TO_READ"
    }
  }

  // --- AÇÃO: ATUALIZAR STATUS ---
  const handleStatusChange = async (newStatus: string) => {
    // Se o livro não estiver na biblioteca, precisamos adicionar primeiro (implementação futura)
    if (!isInLibrary || !userBookId) {
      toast({ title: "Erro", description: "Você precisa adicionar este livro à biblioteca primeiro.", variant: "destructive" })
      return
    }

    const backendStatus = mapFrontendStatusToBackend(newStatus)

    try {
      const response = await fetch(`${API_URL}/api/v1/users/${USER_ID}/library/${userBookId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: backendStatus }),
      })

      if (response.ok) {
        setCurrentStatus(newStatus)
        setIsStatusDialogOpen(false)
        toast({ title: "Sucesso", description: `Status atualizado para: ${getStatusLabel(newStatus)}` })
        fetchUserLibraryInfo() // Recarrega dados para garantir
      } else {
        toast({ title: "Erro", description: "Não foi possível atualizar o status.", variant: "destructive" })
      }
    } catch (error) {
      console.error("Erro ao atualizar status:", error)
      toast({ title: "Erro de conexão", description: "Tente novamente.", variant: "destructive" })
    }
  }

  const handleLendBook = () => {
    setIsLendDialogOpen(false)
    toast({ title: "Empréstimo Registrado", description: `Emprestado para ${borrowerName}` })
    setBorrowerName(""); setBorrowerEmail(""); setLendDate(""); setReturnDate("")
  }

  const handleShareBook = () => {
    setIsShareDialogOpen(false)
    setShareMessage("")
    toast({ title: "Compartilhado", description: "Link copiado!" })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "read": return "bg-secondary/10 text-secondary-foreground border-secondary/20"
      case "reading": return "bg-primary/10 text-primary-foreground border-primary/20"
      default: return "bg-accent/10 text-accent-foreground border-accent/20"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "read": return "Lido"
      case "reading": return "Lendo"
      case "to-read": return "Para Ler"
      default: return status
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <div className="flex h-[calc(100vh-64px)]">
          <Sidebar className="hidden lg:block border-r" />
          <main className="flex-1 p-8 flex flex-col items-center justify-center text-center">
             <h2 className="text-2xl font-bold mb-4">Livro não encontrado 😕</h2>
             <Link href="/library"><Button>Voltar para a Biblioteca</Button></Link>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <div className="flex">
        <aside className="hidden lg:block border-r bg-card/50">
          <Sidebar />
        </aside>
        <main className="flex-1 px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <Link href="/library" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              Voltar para Biblioteca
            </Link>

            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0 mx-auto md:mx-0">
                <div className="relative w-[200px] h-[300px] shadow-lg rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                  {book.coverImageUrl && book.coverImageUrl !== "/placeholder.svg" ? (
                      <Image src={book.coverImageUrl} alt={book.title} fill className="object-cover" />
                  ) : (
                      <BookOpen className="h-16 w-16 text-muted-foreground/50" />
                  )}
                </div>
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <h1 className="text-3xl font-bold text-balance">{book.title}</h1>
                  <p className="text-xl text-muted-foreground">{book.author}</p>
                </div>

                {isInLibrary ? (
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className={getStatusColor(currentStatus)}>
                      {getStatusLabel(currentStatus)}
                    </Badge>
                  </div>
                ) : (
                   <Badge variant="secondary">Não está na sua biblioteca</Badge>
                )}

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <span>{book.pages || "?"} páginas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <span>{book.genre}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{book.publicationYear || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{book.publisher || "N/A"}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                   {/* Botão Editar Status (Só aparece se estiver na biblioteca) */}
                   {isInLibrary && (
                     <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="bg-primary hover:bg-primary/90">Editar Status</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader><DialogTitle>Alterar Status</DialogTitle></DialogHeader>
                        <div className="space-y-4">
                            <Label>Para qual status deseja mudar?</Label>
                            <Select value={currentStatus} onValueChange={handleStatusChange}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="to-read">Para Ler</SelectItem>
                                <SelectItem value="reading">Lendo</SelectItem>
                                <SelectItem value="read">Lido</SelectItem>
                              </SelectContent>
                            </Select>
                        </div>
                      </DialogContent>
                    </Dialog>
                   )}

                   {/* Botão Emprestar */}
                   <Dialog open={isLendDialogOpen} onOpenChange={setIsLendDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline">Emprestar</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader><DialogTitle>Emprestar Livro</DialogTitle></DialogHeader>
                      <div className="space-y-4">
                        <Input placeholder="Nome do Mutuário" value={borrowerName} onChange={(e) => setBorrowerName(e.target.value)} />
                        <Button onClick={handleLendBook} className="w-full bg-primary">Confirmar</Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                   <Button variant="outline" onClick={() => setIsShareDialogOpen(true)}>Compartilhar</Button>
                   
                   <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
                    <DialogContent>
                      <DialogHeader><DialogTitle>Compartilhar</DialogTitle></DialogHeader>
                      <Textarea placeholder="Mensagem..." value={shareMessage} onChange={(e) => setShareMessage(e.target.value)} />
                      <Button onClick={handleShareBook} className="w-full bg-primary">Enviar</Button>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
            
            {/* ... Resto dos Cards (Descrição, Detalhes) ... */}
            <Card>
                <CardHeader><CardTitle>Descrição</CardTitle></CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {book.description}
                  </p>
                </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}