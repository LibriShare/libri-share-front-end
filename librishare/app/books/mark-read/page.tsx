"use client"

import { DashboardHeader } from "@/components/dashboard/header"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Star, CheckCircle } from "lucide-react"
import { useState } from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export default function MarkAsReadPage() {
  const [finishedDate, setFinishedDate] = useState<Date>()
  const [rating, setRating] = useState(0)

  const myBooks = [
    { id: 1, title: "O Alquimista", author: "Paulo Coelho", cover: "/o-alquimista-book-cover.jpg" },
    { id: 2, title: "1984", author: "George Orwell", cover: "/1984-book-cover.jpg" },
    { id: 3, title: "Dom Casmurro", author: "Machado de Assis", cover: "/dom-casmurro-classic-book.jpg" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <div className="flex">
        <aside className="hidden lg:block border-r bg-card/50">
          <Sidebar />
        </aside>

        <main className="flex-1 px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">Marcar como Lido</h1>
              <p className="text-muted-foreground">Registre um livro como concluído e adicione sua avaliação</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Registrar Leitura Concluída
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="book">Selecionar Livro</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Escolha um livro da sua biblioteca" />
                    </SelectTrigger>
                    <SelectContent>
                      {myBooks.map((book) => (
                        <SelectItem key={book.id} value={book.id.toString()}>
                          {book.title} - {book.author}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Data de Conclusão</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {finishedDate ? format(finishedDate, "PPP", { locale: ptBR }) : "Selecione a data"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={finishedDate} onSelect={setFinishedDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pages">Número de Páginas</Label>
                    <Input id="pages" placeholder="Ex: 250" type="number" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Sua Avaliação</Label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} type="button" onClick={() => setRating(star)} className="transition-colors">
                        <Star
                          className={`h-8 w-8 ${
                            star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300 hover:text-yellow-200"
                          }`}
                        />
                      </button>
                    ))}
                    <span className="ml-2 text-sm text-muted-foreground">
                      {rating > 0 ? `${rating} estrela${rating > 1 ? "s" : ""}` : "Clique para avaliar"}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="review">Sua Resenha (opcional)</Label>
                  <Textarea id="review" placeholder="Compartilhe seus pensamentos sobre o livro..." rows={4} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="favorite-quote">Citação Favorita (opcional)</Label>
                  <Textarea id="favorite-quote" placeholder="Alguma frase que marcou você..." rows={2} />
                </div>

                <div className="flex gap-4 pt-4">
                  <Button className="flex-1">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Marcar como Lido
                  </Button>
                  <Button variant="outline" className="flex-1 bg-transparent">
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
