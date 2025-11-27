"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Search, BookOpen, Link as LinkIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

interface AddBookDialogProps {
  trigger?: React.ReactNode
}

export function AddBookDialog({ trigger }: AddBookDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()
  const API_URL = process.env.NEXT_PUBLIC_API_URL

  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    setIsLoading(true)

    try {
      const response = await fetch(`${API_URL}/api/v1/books`)
      if (response.ok) {
        const allBooks = await response.json()
        const filtered = allBooks.filter((book: any) => 
          book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (book.isbn && book.isbn.includes(searchQuery))
        )
        setSearchResults(filtered)
      }
    } catch (error) {
      console.error("Erro na busca:", error)
      toast({ title: "Erro", description: "Falha ao buscar livros.", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const addToLibrary = async (bookId: number) => {
    try {
      const response = await fetch(`${API_URL}/api/v1/users/1/library`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookId: bookId,
          status: "TO_READ" // <--- MUDAR DE "WANT_TO_READ" PARA "TO_READ"
        })
      })

      if (response.ok) {
        toast({ title: "Sucesso!", description: "Livro adicionado à sua biblioteca." })
        setOpen(false)
        window.location.reload() 
      } else if (response.status === 409) {
        toast({ title: "Aviso", description: "Você já tem este livro.", variant: "warning" })
      } else {
        toast({ title: "Erro", description: "Falha ao adicionar livro.", variant: "destructive" })
      }
    } catch (error) {
      console.error(error)
    }
  } 

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    
    const bookData = {
      title: formData.get("title"),
      author: formData.get("author"),
      isbn: formData.get("isbn") || null,
      pages: formData.get("pages") ? Number(formData.get("pages")) : null,
      publisher: formData.get("publisher"),
      publicationYear: formData.get("year") ? Number(formData.get("year")) : null,
      // Agora pegamos a URL digitada ou usamos o placeholder
      coverImageUrl: formData.get("coverUrl") || "/placeholder.svg"
    }

    try {
      const createResponse = await fetch(`${API_URL}/api/v1/books`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookData)
      })

      if (createResponse.ok) {
        const newBook = await createResponse.json()
        await addToLibrary(newBook.id)
      } else {
        const err = await createResponse.json()
        toast({ 
            title: "Erro ao criar", 
            description: err.message || "Verifique os dados.", 
            variant: "destructive" 
        })
      }
    } catch (error) {
      toast({ title: "Erro de conexão", description: "Tente novamente.", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Livro
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Livro</DialogTitle>
          <DialogDescription>Escolha como deseja adicionar o livro à sua biblioteca</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="search" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="search">Buscar Online</TabsTrigger>
            <TabsTrigger value="manual">Manual</TabsTrigger>
            <TabsTrigger value="scan" disabled>Escanear (Em breve)</TabsTrigger>
          </TabsList>

           <TabsContent value="search" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Buscar no Catálogo
                </CardTitle>
                <CardDescription>Pesquise pelos livros cadastrados</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Digite o título..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  />
                  <Button onClick={handleSearch} disabled={isLoading}>
                    {isLoading ? "..." : <Search className="h-4 w-4" />}
                  </Button>
                </div>

                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {searchResults.length > 0 ? (
                    searchResults.map((book) => (
                      <div key={book.id} className="flex items-center gap-4 p-3 border rounded-lg hover:bg-muted/50">
                        <div className="relative w-10 h-14 flex-shrink-0">
                          <Image
                            src={book.coverImageUrl || "/placeholder.svg"}
                            alt={book.title}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="font-medium truncate">{book.title}</h5>
                          <p className="text-sm text-muted-foreground">{book.author}</p>
                        </div>
                        <Button size="sm" onClick={() => addToLibrary(book.id)}>
                          Adicionar
                        </Button>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground text-sm py-4">
                        {isLoading ? "Buscando..." : "Digite algo para buscar."}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manual" className="space-y-4">
            <form onSubmit={handleManualSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Campo de URL da Capa */}
                <div className="space-y-4">
                    <div className="flex flex-col items-center justify-center py-6 border-2 border-dashed border-muted-foreground/25 rounded-lg bg-muted/10 text-center p-4">
                        <BookOpen className="h-12 w-12 text-muted-foreground mb-2" />
                        <p className="text-xs text-muted-foreground mb-2">Cole a URL de uma imagem (ex: Google Imagens)</p>
                        <div className="flex gap-2 w-full">
                            <LinkIcon className="h-4 w-4 mt-2 text-muted-foreground" />
                            <Input name="coverUrl" placeholder="https://site.com/imagem.jpg" className="text-xs" />
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título *</Label>
                    <Input id="title" name="title" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="author">Autor *</Label>
                    <Input id="author" name="author" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="isbn">ISBN</Label>
                      <Input id="isbn" name="isbn" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pages">Páginas</Label>
                      <Input id="pages" name="pages" type="number" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="publisher">Editora</Label>
                      <Input id="publisher" name="publisher" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="year">Ano</Label>
                      <Input id="year" name="year" type="number" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Salvando..." : "Salvar e Adicionar"}
                </Button>
              </div>
            </form>
          </TabsContent>
          
          <TabsContent value="scan">
             <div className="p-4 text-center text-muted-foreground">Funcionalidade futura.</div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}