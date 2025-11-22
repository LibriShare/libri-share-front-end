"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog"
import { 
  ShoppingCart, 
  Trash2,
  BookOpen,
  Plus,
  Loader2
} from "lucide-react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"

interface WishlistBook {
  id: number
  bookId: number
  title: string
  author: string
  cover: string
  addedDate: string
  price?: string 
}

export default function WishlistPage() {
  const [books, setBooks] = useState<WishlistBook[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Formulário
  const [newTitle, setNewTitle] = useState("")
  const [newAuthor, setNewAuthor] = useState("")

  const { toast } = useToast()
  const API_URL = process.env.NEXT_PUBLIC_API_URL
  const USER_ID = 1

  const fetchWishlist = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/api/v1/users/${USER_ID}/library`)
      
      if (response.ok) {
        const data = await response.json()
        // Filtra APENAS status 'WANT_TO_READ'
        const wishlist = data
          .filter((item: any) => item.status === 'WANT_TO_READ')
          .map((item: any) => ({
            id: item.id,
            bookId: item.bookId,
            title: item.title,
            author: item.author,
            cover: item.coverImageUrl || "/placeholder.svg",
            addedDate: item.addedAt,
            price: "0,00" // Mock visual
          }))
        setBooks(wishlist)
      }
    } catch (error) {
      console.error("Erro wishlist:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWishlist()
  }, [API_URL])

  const handleAddWish = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // 1. Cria Livro no Catálogo
      const bookRes = await fetch(`${API_URL}/api/v1/books`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            title: newTitle,
            author: newAuthor || "Desconhecido",
            isbn: null, 
            coverImageUrl: "/placeholder.svg"
        })
      })

      let bookId;
      if (bookRes.ok) {
         const bookData = await bookRes.json()
         bookId = bookData.id
      } else if (bookRes.status === 409) {
          // Se já existe, não temos como pegar o ID fácil aqui sem busca. 
          // Simplificação: Avisar erro. (Ideal seria buscar pelo título)
          toast({ title: "Erro", description: "Livro já existe no catálogo, tente buscar.", variant: "destructive" })
          setIsSubmitting(false)
          return;
      }

      // 2. Adiciona à Biblioteca como WANT_TO_READ
      if (bookId) {
          const libRes = await fetch(`${API_URL}/api/v1/users/${USER_ID}/library`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ bookId: bookId, status: "WANT_TO_READ" })
          })
          
          if (libRes.ok) {
              toast({ title: "Adicionado!", description: "Livro na lista de desejos." })
              setNewTitle("")
              setNewAuthor("")
              setIsDialogOpen(false)
              fetchWishlist() // RECARREGA A LISTA
          }
      }

    } catch (error) {
      toast({ title: "Erro", variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
      await fetch(`${API_URL}/api/v1/users/${USER_ID}/library/${id}`, { method: "DELETE" })
      fetchWishlist()
      toast({ title: "Removido." })
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold">Lista de Desejos</h1>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4"/> Novo Desejo</Button></DialogTrigger>
                <DialogContent>
                    <DialogHeader><DialogTitle>Adicionar Desejo</DialogTitle></DialogHeader>
                    <form onSubmit={handleAddWish} className="space-y-4">
                        <div><Label>Título</Label><Input value={newTitle} onChange={e=>setNewTitle(e.target.value)} required/></div>
                        <div><Label>Autor</Label><Input value={newAuthor} onChange={e=>setNewAuthor(e.target.value)} required/></div>
                        <Button type="submit" disabled={isSubmitting} className="w-full">{isSubmitting ? "Salvando..." : "Adicionar"}</Button>
                    </form>
                </DialogContent>
              </Dialog>
            </div>

            {loading ? <div className="flex justify-center p-10"><Loader2 className="animate-spin"/></div> : 
             books.length === 0 ? 
             <div className="text-center py-20 border-2 border-dashed rounded-lg"><BookOpen className="h-12 w-12 mx-auto opacity-20"/><p>Sua lista está vazia.</p></div> 
             : 
             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {books.map(book => (
                    <Card key={book.id} className="flex flex-row overflow-hidden h-40">
                        <div className="w-28 relative bg-muted">
                            <Image src={book.cover} alt={book.title} fill className="object-cover"/>
                        </div>
                        <CardContent className="flex-1 p-4 flex flex-col justify-between">
                            <div>
                                <h3 className="font-bold line-clamp-1">{book.title}</h3>
                                <p className="text-sm text-muted-foreground">{book.author}</p>
                            </div>
                            <div className="flex gap-2">
                                <Button size="sm" className="flex-1"><ShoppingCart className="mr-2 h-4 w-4"/> Comprar</Button>
                                <Button size="icon" variant="ghost" onClick={() => handleDelete(book.id)}><Trash2 className="h-4 w-4 text-red-500"/></Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
             </div>
            }
          </div>
        </main>
      </div>
    </div>
  )
}