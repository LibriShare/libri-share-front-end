"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Heart, BookOpen, Users } from "lucide-react"
import Image from "next/image"

const discoverBooks = [
  {
    id: 1,
    title: "A Sutil Arte de Ligar o F*da-se",
    author: "Mark Manson",
    cover: "/a-sutil-arte-de-ligar-o-foda-se-book-cover.jpg",
    rating: 4.2,
    genre: "Autoajuda",
    description: "Um livro revolucionário sobre como viver uma vida mais autêntica",
    readers: 1250,
    trending: true,
  },
  {
    id: 2,
    title: "Mindset: A Nova Psicologia do Sucesso",
    author: "Carol S. Dweck",
    cover: "/mindset-book-cover-psychology.jpg",
    rating: 4.5,
    genre: "Psicologia",
    description: "Como a mentalidade pode transformar sua vida pessoal e profissional",
    readers: 890,
    trending: false,
  },
  {
    id: 3,
    title: "O Poder do Hábito",
    author: "Charles Duhigg",
    cover: "/o-poder-do-habito-book-cover.jpg",
    rating: 4.3,
    genre: "Produtividade",
    description: "Por que fazemos o que fazemos na vida e nos negócios",
    readers: 2100,
    trending: true,
  },
  {
    id: 4,
    title: "Sapiens: Uma Breve História da Humanidade",
    author: "Yuval Noah Harari",
    cover: "/sapiens-book-cover-history.jpg",
    rating: 4.6,
    genre: "História",
    description: "Uma jornada fascinante pela história da espécie humana",
    readers: 3200,
    trending: true,
  },
]

export function DiscoverBooks() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Livros Recomendados</h2>
        <Button variant="outline">Ver Mais</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {discoverBooks.map((book) => (
          <Card key={book.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
              <div className="flex">
                <div className="relative w-32 h-48 flex-shrink-0">
                  <Image src={book.cover || "/placeholder.svg"} alt={book.title} fill className="object-cover" />
                  {book.trending && (
                    <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">Em Alta</Badge>
                  )}
                </div>

                <div className="flex-1 p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg line-clamp-2">{book.title}</h3>
                    <p className="text-sm text-muted-foreground">por {book.author}</p>
                  </div>

                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{book.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{book.readers.toLocaleString()} leitores</span>
                    </div>
                  </div>

                  <Badge variant="secondary">{book.genre}</Badge>

                  <p className="text-sm text-muted-foreground line-clamp-2">{book.description}</p>

                  <div className="flex gap-2 pt-2">
                    <Button size="sm" className="flex-1">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Adicionar
                    </Button>
                    <Button size="sm" variant="outline">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
