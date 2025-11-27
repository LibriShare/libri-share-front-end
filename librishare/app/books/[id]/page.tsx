"use client"

import { useState, useEffect, useCallback } from "react"
import { DashboardHeader } from "@/components/dashboard/header"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Star, Calendar, BookOpen, User, ArrowLeft, Save, Loader2, Pencil, X, ImageIcon, 
  Edit, DollarSign, Link as LinkIcon, ExternalLink 
} from "lucide-react"
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
  synopsis?: string
  genre?: string
  price?: number        // --- NOVO ---
  purchaseUrl?: string  // --- NOVO ---
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

  // Edição de Sinopse
  const [isEditingSynopsis, setIsEditingSynopsis] = useState(false)
  const [synopsisText, setSynopsisText] = useState("")
  const [isSavingSynopsis, setIsSavingSynopsis] = useState(false)

  // Edição de Imagem de Capa
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false)
  const [newImageUrl, setNewImageUrl] = useState("")
  const [isSavingImage, setIsSavingImage] = useState(false)

  // --- NOVO: Estados para Edição de Informações Gerais ---
  const [isInfoDialogOpen, setIsInfoDialogOpen] = useState(false)
  const [editTitle, setEditTitle] = useState("")
  const [editAuthor, setEditAuthor] = useState("")
  const [editPrice, setEditPrice] = useState("")
  const [editLink, setEditLink] = useState("")
  const [isSavingInfo, setIsSavingInfo] = useState(false)
  // ------------------------------------------------------

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
          setBook({ ...data, genre: "Geral" })
          
          // Preenche estados de edição
          setSynopsisText(data.synopsis || "")
          setNewImageUrl(data.coverImageUrl || "")
          
          // --- NOVO: Preenche estados de edição info ---
          setEditTitle(data.title || "")
          setEditAuthor(data.author || "")
          setEditPrice(data.price || "")
          setEditLink(data.purchaseUrl || "")
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    if (params.id) fetchBookDetails()
  }, [params.id, API_URL])

  // --- 2. Buscar Dados da Biblioteca do Usuário ---
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
  }, [API_URL, params.id, USER_ID])

  useEffect(() => {
    fetchUserLibraryInfo()
  }, [fetchUserLibraryInfo])

  // --- Helpers ---
  const mapBackendStatusToFrontend = (status: string) => {
    switch (status) {
      case "READ": return "read"; 
      case "READING": return "reading"; 
      case "TO_READ": return "tbr"; 
      default: return "to-read";
    }
  }
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "read": return "Lido"; 
      case "reading": return "Lendo"; 
      case "tbr": return "Para Ler"; 
      default: return "Lista de Desejos";
    }
  }
  const getStatusColor = (status: string) => {
    switch (status) {
      case "read": return "bg-secondary/10 text-secondary-foreground border-secondary/20"
      case "reading": return "bg-primary/10 text-primary-foreground border-primary/20"
      case "tbr": return "bg-indigo-500/10 text-indigo-500 border-indigo-500/20"
      default: return "bg-accent/10 text-accent-foreground border-accent/20"
    }
  }

  // --- Ações ---

  const handleStatusChange = async (newStatus: string) => {
    if (!userBookId) return
    let backendStatus = "WANT_TO_READ";
    if (newStatus === "read") backendStatus = "READ";
    else if (newStatus === "reading") backendStatus = "READING";
    else if (newStatus === "tbr") backendStatus = "TO_READ";
    
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
      const response = await fetch(`${API_URL}/api/v1/users/${USER_ID}/library/${userBookId}/review`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ review: userReview })
      })
      if (response.ok) toast({ title: "Resenha salva!" })
    } catch (error) {
      toast({ title: "Erro ao salvar", variant: "destructive" })
    } finally {
        setIsSavingReview(false)
    }
  }

  // --- Função Genérica para Atualizar dados do Livro (PUT) ---
  const updateBookData = async (dataToUpdate: Partial<BookData>) => {
    if (!book) return;
    try {
        const body = {
            title: book.title,
            author: book.author,
            synopsis: book.synopsis,
            coverImageUrl: book.coverImageUrl,
            price: book.price,
            purchaseUrl: book.purchaseUrl,
            ...dataToUpdate // Sobrescreve com os novos valores
        };

        const response = await fetch(`${API_URL}/api/v1/books/${book.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        })

        if (response.ok) {
            const updatedBookRes = await response.json();
            setBook({ ...book, ...updatedBookRes });
            toast({ title: "Livro atualizado com sucesso!" });
            return true;
        } else {
            throw new Error("Falha na atualização");
        }
    } catch (error) {
        console.error(error);
        toast({ title: "Erro ao atualizar livro", variant: "destructive" });
        return false;
    }
  }

  // Salvar Sinopse
  const handleSaveSynopsis = async () => {
    setIsSavingSynopsis(true)
    const success = await updateBookData({ synopsis: synopsisText });
    if (success) setIsEditingSynopsis(false);
    setIsSavingSynopsis(false)
  }

  // Salvar Imagem
  const handleSaveImage = async () => {
    if (!newImageUrl.trim()) {
        toast({ title: "A URL da imagem não pode estar vazia", variant: "destructive" });
        return;
    }
    setIsSavingImage(true)
    const success = await updateBookData({ coverImageUrl: newImageUrl });
    if (success) setIsImageDialogOpen(false);
    setIsSavingImage(false)
  }

  // --- NOVO: Salvar Informações Gerais (Título, Autor, Preço, Link) ---
  const handleSaveInfo = async () => {
    setIsSavingInfo(true)
    const success = await updateBookData({ 
        title: editTitle,
        author: editAuthor,
        price: editPrice ? parseFloat(editPrice) : undefined,
        purchaseUrl: editLink
    });
    if (success) setIsInfoDialogOpen(false);
    setIsSavingInfo(false)
  }
  // --------------------------------------------------------------------


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
              
              {/* --- ÁREA DA IMAGEM COM EDIÇÃO --- */}
              <div className="flex-shrink-0 mx-auto md:mx-0">
                <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
                    <DialogTrigger asChild>
                        <div className="relative w-[200px] h-[300px] shadow-lg rounded-lg overflow-hidden bg-muted group cursor-pointer">
                           <Image src={book.coverImageUrl || "/placeholder.svg"} alt={book.title} fill className="object-cover transition-opacity group-hover:opacity-75" />
                           <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <div className="text-white flex flex-col items-center font-medium">
                                    <ImageIcon className="h-8 w-8 mb-2" />
                                    Alterar Capa
                                </div>
                           </div>
                        </div>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Alterar Capa do Livro</DialogTitle>
                            <DialogDescription>Insira a nova URL da imagem.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                             <div className="space-y-2">
                                <Input 
                                    id="image-url"
                                    placeholder="https://exemplo.com/nova-capa.jpg"
                                    value={newImageUrl}
                                    onChange={(e) => setNewImageUrl(e.target.value)}
                                />
                            </div>
                            {newImageUrl && (
                                <div className="relative h-[200px] w-full rounded-md overflow-hidden border mt-2 bg-muted">
                                     <img src={newImageUrl} alt="Pré-visualização" className="h-full w-full object-contain" 
                                          onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }} />
                                </div>
                            )}
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsImageDialogOpen(false)}>Cancelar</Button>
                            <Button onClick={handleSaveImage} disabled={isSavingImage}>
                                {isSavingImage ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Salvar Nova Capa
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <h1 className="text-3xl font-bold text-balance">{book.title}</h1>
                  <p className="text-xl text-muted-foreground">{book.author}</p>
                  
                  {/* --- NOVO: Exibição de Preço e Link --- */}
                  <div className="flex flex-wrap gap-4 mt-3 text-sm items-center">
                    {book.price && (
                        <span className="text-emerald-500 font-bold text-lg bg-emerald-500/10 px-2 py-1 rounded">
                            R$ {Number(book.price).toFixed(2).replace('.', ',')}
                        </span>
                    )}
                    {book.purchaseUrl && (
                        <a href={book.purchaseUrl} target="_blank" className="text-primary hover:underline flex items-center gap-1 bg-primary/5 px-2 py-1 rounded">
                            <LinkIcon className="h-3 w-3" /> Link de Compra <ExternalLink className="h-3 w-3 ml-1 opacity-50" />
                        </a>
                    )}
                  </div>
                  {/* ------------------------------------- */}
                </div>

                {isInLibrary ? (
                  <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <Badge variant="outline" className={getStatusColor(currentStatus)}>
                            {getStatusLabel(currentStatus)}
                        </Badge>
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
                      
                      <div className="flex flex-wrap gap-2">
                         <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
                            <DialogTrigger asChild><Button>Mudar Status</Button></DialogTrigger>
                            <DialogContent>
                                <DialogHeader><DialogTitle>Status</DialogTitle></DialogHeader>
                                <Select value={currentStatus} onValueChange={handleStatusChange}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="to-read">Lista de Desejos</SelectItem>
                                        <SelectItem value="tbr">Para Ler (Estante)</SelectItem>
                                        <SelectItem value="reading">Lendo</SelectItem>
                                        <SelectItem value="read">Lido</SelectItem>
                                    </SelectContent>
                                </Select>
                            </DialogContent>
                         </Dialog>

                         {/* --- NOVO: BOTÃO DE EDITAR INFORMAÇÕES GERAIS --- */}
                         <Dialog open={isInfoDialogOpen} onOpenChange={setIsInfoDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline">
                                    <Edit className="h-4 w-4 mr-2" />
                                    Editar Info
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Editar Informações</DialogTitle>
                                    <DialogDescription>Atualize os dados principais do livro.</DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-2">
                                    <div className="space-y-2">
                                        <Label>Título</Label>
                                        <Input value={editTitle} onChange={e => setEditTitle(e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Autor</Label>
                                        <Input value={editAuthor} onChange={e => setEditAuthor(e.target.value)} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Preço (R$)</Label>
                                            <div className="relative">
                                                <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                                <Input className="pl-8" type="number" step="0.01" value={editPrice} onChange={e => setEditPrice(e.target.value)} placeholder="0.00" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Link de Compra</Label>
                                            <div className="relative">
                                                <LinkIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                                <Input className="pl-8" value={editLink} onChange={e => setEditLink(e.target.value)} placeholder="https://..." />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsInfoDialogOpen(false)}>Cancelar</Button>
                                    <Button onClick={handleSaveInfo} disabled={isSavingInfo}>
                                        {isSavingInfo ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Salvar Alterações"}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                        {/* -------------------------------------------------- */}

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

            {isInLibrary && (
                <Card>
                    <CardHeader>
                        <CardTitle>Sua Resenha / Anotações</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Textarea 
                            placeholder="Escreva aqui o que você achou do livro, suas citações favoritas ou notas pessoais..." 
                            className="min-h-[100px]"
                            value={userReview}
                            onChange={(e) => setUserReview(e.target.value)}
                        />
                        <div className="flex justify-end">
                            <Button onClick={handleSaveReview} disabled={isSavingReview} size="sm">
                                {isSavingReview ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                Salvar Resenha
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle>Sinopse</CardTitle>
                    {!isEditingSynopsis ? (
                        <Button variant="ghost" size="sm" onClick={() => setIsEditingSynopsis(true)}>
                            <Pencil className="h-4 w-4 mr-2" /> Editar
                        </Button>
                    ) : (
                        <Button variant="ghost" size="sm" onClick={() => setIsEditingSynopsis(false)}>
                            <X className="h-4 w-4" /> Cancelar
                        </Button>
                    )}
                </CardHeader>
                <CardContent className="mt-4">
                    {isEditingSynopsis ? (
                        <div className="space-y-4">
                            <Textarea 
                                value={synopsisText} 
                                onChange={(e) => setSynopsisText(e.target.value)} 
                                className="min-h-[150px]"
                                placeholder="Cole ou digite a sinopse do livro aqui..."
                            />
                            <div className="flex justify-end">
                                <Button onClick={handleSaveSynopsis} disabled={isSavingSynopsis}>
                                    {isSavingSynopsis ? "Salvando..." : "Salvar Sinopse"}
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap">
                            {book.synopsis || "Sinopse não disponível. Clique em editar para adicionar."}
                        </p>
                    )}
                </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}