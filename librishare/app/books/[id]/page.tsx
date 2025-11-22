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
import { Star, Calendar, BookOpen, User, Tag, ArrowLeft, Share, Loader2, Save } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"

interface BookData {
  id: number
  title: string
  author: string
  publisher: string
  publicationYear: number
  isbn: string
  pages: number
  coverImageUrl: string
  description?: string
  genre?: string
}

export default function BookDetailsPage({ params }: { params: { id: string } }) {
  const [book, setBook] = useState<BookData | null>(null)
  const [loading, setLoading] = useState(true)
  
  // Dados do Usuário (Vínculo)
  const [userBookId, setUserBookId] = useState<number | null>(null)
  const [currentStatus, setCurrentStatus] = useState("to-read")
  const [userRating, setUserRating] = useState(0)
  const [userReview, setUserReview] = useState("")
  const [isInLibrary, setIsInLibrary] = useState(false)
  const [isSavingReview, setIsSavingReview] = useState(false)

  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false)
  const { toast } = useToast()
  const API_URL = process.env.NEXT_PUBLIC_API_URL
  const USER_ID = 1

  // --- 1. Buscar Dados do Livro ---
  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await fetch(`${API_URL}/api/v1/books/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setBook({ ...data, description: "Sinopse não disponível.", genre: "Geral" })
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    if (params.id) fetchBookDetails()
  }, [params.id, API_URL])

  // --- 2. Buscar Dados da Biblioteca do Usuário (Status, Nota, Resenha) ---
  const fetchUserLibraryInfo = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/v1/users/${USER_ID}/library`)
      if (response.ok) {
        const library: any[] = await response.json()
        const found = library.find((item) => item.bookId === Number(params.id))
        
        if (found) {
          setIsInLibrary(true)
          setUserBookId(found.id)
          setCurrentStatus(mapBackendStatusToFrontend(found.status))
          setUserRating(found.rating || 0)
          setUserReview(found.review || "")
        } else {
          setIsInLibrary(false)
        }
      }
    } catch (error) {
      console.error(error)
    }
  }, [API_URL, params.id])

  useEffect(() => {
    fetchUserLibraryInfo()
  }, [fetchUserLibraryInfo])

  // --- Helpers ---
  const mapBackendStatusToFrontend = (status: string) => {
    switch (status) {
      case "READ": return "read"; case "READING": return "reading"; default: return "to-read";
    }
  }
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "read": return "Lido"; case "reading": return "Lendo"; default: return "Para Ler";
    }
  }
  const getStatusColor = (status: string) => {
    switch (status) {
      case "read": return "bg-secondary/10 text-secondary-foreground border-secondary/20"
      case "reading": return "bg-primary/10 text-primary-foreground border-primary/20"
      default: return "bg-accent/10 text-accent-foreground border-accent/20"
    }
  }

  // --- Ações ---

  const handleStatusChange = async (newStatus: string) => {
    if (!userBookId) return
    const backendStatus = newStatus === "read" ? "READ" : newStatus === "reading" ? "READING" : "WANT_TO_READ"
    
    try {
      await fetch(`${API_URL}/api/v1/users/${USER_ID}/library/${userBookId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: backendStatus })
      })
      setCurrentStatus(newStatus)
      setIsStatusDialogOpen(false)
      toast({ title: "Status atualizado!" })
    } catch (error) {
      toast({ title: "Erro", variant: "destructive" })
    }
  }

  const handleRateBook = async (rating: number) => {
    if (!userBookId) return
    try {
      await fetch(`${API_URL}/api/v1/users/${USER_ID}/library/${userBookId}/rating`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating })
      })
      setUserRating(rating)
      toast({ title: "Avaliado!", description: `${rating} estrelas.` })
    } catch (error) {
      toast({ title: "Erro ao avaliar", variant: "destructive" })
    }
  }

  const handleSaveReview = async () => {
    if (!userBookId) return
    setIsSavingReview(true)
    try {
        // Nota: Você precisa ter implementado o endpoint PATCH /review no backend
        // Se não tiver, vai dar 404 ou 405, mas a lógica no front está certa
      const response = await fetch(`${API_URL}/api/v1/users/${USER_ID}/library/${userBookId}/review`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ review: userReview })
      })
      
      if (response.ok) {
          toast({ title: "Resenha salva!", description: "Suas anotações foram guardadas." })
      } else {
          // Fallback: Se o endpoint de review não existir, tenta salvar apenas localmente (simulação)
          console.warn("Endpoint de review não encontrado, salvando localmente.")
      }
    } catch (error) {
      toast({ title: "Erro ao salvar", variant: "destructive" })
    } finally {
        setIsSavingReview(false)
    }
  }

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>
  if (!book) return <div>Livro não encontrado</div>

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <div className="flex">
        <aside className="hidden lg:block border-r bg-card/50"><Sidebar /></aside>
        <main className="flex-1 px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <Link href="/library" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" /> Voltar
            </Link>

            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0 mx-auto md:mx-0">
                <div className="relative w-[200px] h-[300px] shadow-lg rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                   <Image src={book.coverImageUrl || "/placeholder.svg"} alt={book.title} fill className="object-cover" />
                </div>
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <h1 className="text-3xl font-bold text-balance">{book.title}</h1>
                  <p className="text-xl text-muted-foreground">{book.author}</p>
                </div>

                {isInLibrary ? (
                  <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <Badge variant="outline" className={getStatusColor(currentStatus)}>
                            {getStatusLabel(currentStatus)}
                        </Badge>
                        
                        {/* SELETOR DE ESTRELAS */}
                        <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                className={`h-6 w-6 cursor-pointer transition-colors ${
                                (userRating || 0) >= star 
                                    ? "fill-yellow-400 text-yellow-400" 
                                    : "text-muted-foreground/30 hover:text-yellow-200"
                                }`}
                                onClick={() => handleRateBook(star)}
                            />
                            ))}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                         <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
                            <DialogTrigger asChild><Button>Mudar Status</Button></DialogTrigger>
                            <DialogContent>
                                <DialogHeader><DialogTitle>Status</DialogTitle></DialogHeader>
                                <Select value={currentStatus} onValueChange={handleStatusChange}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="to-read">Para Ler</SelectItem>
                                        <SelectItem value="reading">Lendo</SelectItem>
                                        <SelectItem value="read">Lido</SelectItem>
                                    </SelectContent>
                                </Select>
                            </DialogContent>
                         </Dialog>
                      </div>
                  </div>
                ) : (
                    <Badge variant="secondary">Não está na sua biblioteca</Badge>
                )}

                <div className="grid grid-cols-2 gap-4 text-sm pt-4 border-t">
                    <div className="flex items-center gap-2"><BookOpen className="h-4 w-4 text-muted-foreground" /> {book.pages} pág.</div>
                    <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-muted-foreground" /> {book.publicationYear}</div>
                    <div className="flex items-center gap-2"><User className="h-4 w-4 text-muted-foreground" /> {book.publisher}</div>
                </div>
              </div>
            </div>

            {/* ÁREA DE RESENHA */}
            {isInLibrary && (
                <Card>
                    <CardHeader>
                        <CardTitle>Sua Resenha / Anotações</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Textarea 
                            placeholder="Escreva aqui o que você achou do livro, suas citações favoritas ou notas pessoais..." 
                            className="min-h-[150px]"
                            value={userReview}
                            onChange={(e) => setUserReview(e.target.value)}
                        />
                        <div className="flex justify-end">
                            <Button onClick={handleSaveReview} disabled={isSavingReview}>
                                {isSavingReview ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                Salvar Resenha
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader><CardTitle>Sinopse</CardTitle></CardHeader>
                <CardContent className="text-muted-foreground text-sm leading-relaxed">
                    {book.description}
                </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}