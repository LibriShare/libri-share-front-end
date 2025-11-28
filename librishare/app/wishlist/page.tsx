"use client"

import { useState, useEffect, useCallback } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  ShoppingCart, 
  Trash2,
  BookOpen,
  Plus,
  Loader2,
  ExternalLink,
  DollarSign,
  Link as LinkIcon,
  ImageIcon
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { useUserId } from "@/hooks/use-user-id" 

interface WishlistBook {
  id: number
  bookId: number
  title: string
  author: string
  cover: string
  addedDate: string
  price?: number
  purchaseUrl?: string
}

export default function WishlistPage() {
  const [books, setBooks] = useState<WishlistBook[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [newTitle, setNewTitle] = useState("")
  const [newAuthor, setNewAuthor] = useState("")
  const [newImage, setNewImage] = useState("") 
  const [newPrice, setNewPrice] = useState("")
  const [newLink, setNewLink] = useState("")

  const { toast } = useToast()
  const { userId } = useUserId() 
  const API_URL = process.env.NEXT_PUBLIC_API_URL

  const fetchWishlist = useCallback(async () => {
    if (!userId) return 

    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/api/v1/users/${userId}/library`)
      
      if (response.ok) {
        const data = await response.json()
        
        const wishlist = data
          .filter((item: any) => item.status === 'WANT_TO_READ')
          .map((item: any) => ({
            id: item.id,
            bookId: item.bookId,
            title: item.title,
            author: item.author,
            cover: item.coverImageUrl || "/placeholder.svg",
            addedDate: item.addedAt,
            price: 0, 
            purchaseUrl: ""
          }))
          
        const enrichedWishlist = await Promise.all(wishlist.map(async (book: any) => {
            try {
                const bookRes = await fetch(`${API_URL}/api/v1/books/${book.bookId}`)
                if(bookRes.ok) {
                    const bookDetails = await bookRes.json()
                    return { ...book, price: bookDetails.price, purchaseUrl: bookDetails.purchaseUrl }
                }
            } catch(e) { return book }
            return book
        }))

        setBooks(enrichedWishlist)
      }
    } catch (error) {
      console.error("Erro wishlist:", error)
    } finally {
      setLoading(false)
    }
  }, [API_URL, userId])

  useEffect(() => {
    fetchWishlist()
  }, [fetchWishlist])

  const handleAddWish = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!userId) {
        toast({ title: "Erro", description: "Você precisa estar logado.", variant: "destructive" })
        return
    }

    setIsSubmitting(true)
    try {
      const bookRes = await fetch(`${API_URL}/api/v1/books`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            title: newTitle,
            author: newAuthor || "Desconhecido",
            coverImageUrl: newImage || "/placeholder.svg", 
            price: newPrice ? parseFloat(newPrice) : null,
            purchaseUrl: newLink
        })
      })

      let bookId;
      if (bookRes.ok) {
         const bookData = await bookRes.json()
         bookId = bookData.id
      } else {
          const err = await bookRes.json()
          if(bookRes.status !== 409) { 
             toast({ title: "Erro", description: err.message || "Falha ao criar livro.", variant: "destructive" })
             setIsSubmitting(false)
             return;
          }

          toast({ title: "Aviso", description: "Livro já existe no catálogo. Use a busca para adicionar.", variant: "warning" })
          setIsSubmitting(false)
          return;
      }

      if (bookId) {
          const libRes = await fetch(`${API_URL}/api/v1/users/${userId}/library`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ bookId: bookId, status: "WANT_TO_READ" })
          })
          
          if (libRes.ok) {
              toast({ title: "Adicionado à Lista de Desejos!" })
              setNewTitle("")
              setNewAuthor("")
              setNewImage("")
              setNewPrice("")
              setNewLink("")
              setIsDialogOpen(false)
              fetchWishlist()
          } else {
              toast({ title: "Erro", description: "Falha ao adicionar à lista.", variant: "destructive" })
          }
      }
    } catch (error) {
      toast({ title: "Erro de conexão", variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (e: React.MouseEvent, id: number) => {
      e.preventDefault()
      e.stopPropagation()
      if (!userId) return

      try {
        await fetch(`${API_URL}/api/v1/users/${userId}/library/${id}`, { method: "DELETE" })
        fetchWishlist()
        toast({ title: "Removido da lista." })
      } catch (error) {
        toast({ title: "Erro ao remover", variant: "destructive" })
      }
  }

  const handleBuyClick = (e: React.MouseEvent, url?: string) => {
      e.preventDefault()
      e.stopPropagation()
      if (url) window.open(url, '_blank')
      else toast({ title: "Sem link de compra", variant: "secondary" })
  }

  return (
    <div className="flex h-screen bg-background w-full">
      <div className="hidden lg:block">
        <Sidebar />
      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold tracking-tight">Lista de Desejos</h1>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4"/> Novo Desejo</Button></DialogTrigger>
                <DialogContent className="sm:max-w-[500px] w-[95vw]">
                    <DialogHeader>
                        <DialogTitle>Adicionar Desejo</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddWish} className="space-y-4 py-4">
                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <Label>Título *</Label>
                                <Input value={newTitle} onChange={e=>setNewTitle(e.target.value)} required placeholder="Ex: Harry Potter" />
                            </div>
                            <div className="space-y-2">
                                <Label>Autor *</Label>
                                <Input value={newAuthor} onChange={e=>setNewAuthor(e.target.value)} required placeholder="Ex: J.K. Rowling" />
                            </div>
                            <div className="space-y-2">
                                <Label>URL da Capa (Opcional)</Label>
                                <div className="relative">
                                    <ImageIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input 
                                        className="pl-8"
                                        value={newImage} 
                                        onChange={e=>setNewImage(e.target.value)} 
                                        placeholder="https://exemplo.com/capa.jpg" 
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Preço (R$)</Label>
                                <div className="relative">
                                    <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input 
                                        className="pl-8" 
                                        type="number" 
                                        step="0.01" 
                                        placeholder="0.00" 
                                        value={newPrice} 
                                        onChange={e => setNewPrice(e.target.value)} 
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Link de Compra</Label>
                                <div className="relative">
                                    <LinkIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input 
                                        className="pl-8" 
                                        placeholder="https://amazon..." 
                                        value={newLink} 
                                        onChange={e => setNewLink(e.target.value)} 
                                    />
                                </div>
                            </div>
                        </div>
                        <Button type="submit" disabled={isSubmitting} className="w-full mt-4">
                            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Adicionar à Lista"}
                        </Button>
                    </form>
                </DialogContent>
              </Dialog>
            </div>

            {loading ? <div className="flex justify-center p-10"><Loader2 className="animate-spin text-primary h-8 w-8"/></div> : 
             books.length === 0 ? 
             <div className="text-center py-20 border-2 border-dashed rounded-lg border-muted"><BookOpen className="h-12 w-12 mx-auto opacity-20"/><p className="text-muted-foreground mt-2">Sua lista está vazia.</p></div> 
             : 
             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {books.map(book => (
                    <Link href={`/books/${book.bookId}`} key={book.id} className="block group">
                        <Card className="flex flex-row overflow-hidden min-h-[12rem] hover:shadow-lg transition-all duration-200 cursor-pointer relative border-muted/60 bg-card hover:bg-accent/5">
                            
                            <div className="w-32 relative flex-shrink-0 flex items-center justify-center bg-transparent ml-3 my-3 rounded-md overflow-hidden">
                                <Image 
                                    src={book.cover} 
                                    alt={book.title} 
                                    fill 
                                    className="object-contain rounded-sm" 
                                />
                            </div>
                            
                            <CardContent className="flex-1 p-5 flex flex-col justify-between min-w-0">
                                <div>
                                    <h3 className="font-bold line-clamp-2 text-lg text-foreground group-hover:text-primary transition-colors leading-tight mb-1">{book.title}</h3>
                                    <p className="text-sm text-muted-foreground line-clamp-1">{book.author}</p>
                                    
                                    {book.price ? (
                                        <div className="pt-2">
                                            <span className="text-lg font-bold text-emerald-500">R$ {Number(book.price).toFixed(2).replace('.', ',')}</span>
                                        </div>
                                    ) : (
                                        <p className="text-xs text-muted-foreground pt-2 italic">Preço não definido</p>
                                    )}
                                </div>
                                
                                <div className="flex gap-3 mt-4">
                                    <Button 
                                        size="sm" 
                                        className={`flex-1 h-9 font-medium ${!book.purchaseUrl ? 'opacity-50' : ''}`} 
                                        onClick={(e) => handleBuyClick(e, book.purchaseUrl)}
                                        variant={book.purchaseUrl ? "default" : "secondary"}
                                    >
                                        {book.purchaseUrl ? <ShoppingCart className="mr-2 h-4 w-4"/> : <ExternalLink className="mr-2 h-4 w-4"/>}
                                        {book.purchaseUrl ? "Comprar" : "Sem Link"}
                                    </Button>
                                    <Button size="icon" variant="ghost" className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10" onClick={(e) => handleDelete(e, book.id)}>
                                        <Trash2 className="h-4 w-4"/>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
             </div>
            }
          </div>
        </main>
      </div>
    </div>
  )
}