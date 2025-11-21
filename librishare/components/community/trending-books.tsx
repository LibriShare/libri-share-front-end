"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, Star, MessageCircle, Share2, BookOpen } from "lucide-react"
import Image from "next/image"

const trendingBooks = [
  {
    id: 1,
    title: "Atomic Habits",
    author: "James Clear",
    cover: "/atomic-habits-cover.png",
    rating: 4.7,
    discussions: 45,
    shares: 128,
    trend: "+15%",
    category: "Mais Discutido",
  },
  {
    id: 2,
    title: "1984",
    author: "George Orwell",
    cover: "/1984-book-cover-dystopian.jpg",
    rating: 4.4,
    discussions: 67,
    shares: 89,
    trend: "+8%",
    category: "Clássico em Alta",
  },
  {
    id: 3,
    title: "O Pequeno Príncipe",
    author: "Antoine de Saint-Exupéry",
    cover: "/o-pequeno-principe-book.jpg",
    rating: 4.8,
    discussions: 23,
    shares: 156,
    trend: "+22%",
    category: "Mais Compartilhado",
  },
]

export function TrendingBooks() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <TrendingUp className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-semibold">Livros em Alta</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {trendingBooks.map((book) => (
          <Card key={book.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Badge variant="secondary">{book.category}</Badge>
                <div className="flex items-center gap-1 text-green-600">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm font-medium">{book.trend}</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <div className="relative w-20 h-28 flex-shrink-0">
                  <Image
                    src={book.cover || "/placeholder.svg"}
                    alt={book.title}
                    fill
                    className="object-cover rounded"
                  />
                </div>

                <div className="flex-1 space-y-2">
                  <div>
                    <h3 className="font-semibold line-clamp-2">{book.title}</h3>
                    <p className="text-sm text-muted-foreground">{book.author}</p>
                  </div>

                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">{book.rating}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4" />
                  <span>{book.discussions} discussões</span>
                </div>
                <div className="flex items-center gap-1">
                  <Share2 className="h-4 w-4" />
                  <span>{book.shares} compartilhamentos</span>
                </div>
              </div>

              <Button className="w-full" size="sm">
                <BookOpen className="h-4 w-4 mr-2" />
                Ver Detalhes
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
