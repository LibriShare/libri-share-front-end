import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, Calendar, BookOpen } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function ReadPage() {
  const readBooks = [
    {
      id: 1,
      title: "O Alquimista",
      author: "Paulo Coelho",
      cover: "/o-alquimista-book-cover.jpg",
      rating: 5,
      finishedDate: "2024-01-10",
      pages: 163,
      review: "Uma jornada inspiradora sobre seguir seus sonhos.",
    },
    {
      id: 2,
      title: "Dom Casmurro",
      author: "Machado de Assis",
      cover: "/dom-casmurro-classic-book.jpg",
      rating: 4,
      finishedDate: "2023-12-15",
      pages: 256,
      review: "Clássico brasileiro que explora ciúme e dúvida.",
    },
    {
      id: 3,
      title: "Cem Anos de Solidão",
      author: "Gabriel García Márquez",
      cover: "/cem-anos-de-solidao-book.jpg",
      rating: 5,
      finishedDate: "2023-11-20",
      pages: 432,
      review: "Realismo mágico em sua forma mais pura.",
    },
  ]

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Livros Lidos</h1>
              <p className="text-muted-foreground">Sua coleção de livros concluídos</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {readBooks.map((book) => (
                <Card key={book.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <Image
                          src={book.cover || "/placeholder.svg"}
                          alt={book.title}
                          width={80}
                          height={120}
                          className="rounded-lg shadow-sm"
                        />
                      </div>

                      <div className="flex-1 space-y-2">
                        <div>
                          <h3 className="font-semibold text-foreground line-clamp-2">{book.title}</h3>
                          <p className="text-sm text-muted-foreground">{book.author}</p>
                        </div>

                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < book.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>

                        <div className="space-y-1 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>Concluído em {new Date(book.finishedDate).toLocaleDateString("pt-BR")}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <BookOpen className="h-3 w-3" />
                            <span>{book.pages} páginas</span>
                          </div>
                        </div>

                        <p className="text-xs text-muted-foreground line-clamp-2">{book.review}</p>

                        <div className="flex gap-1">
                          <Link href={`/read/${book.id}/details`}>
                            <Button size="sm" variant="outline" className="text-xs bg-transparent">
                              Ver Detalhes
                            </Button>
                          </Link>
                          <Button size="sm" variant="outline" className="text-xs bg-transparent">
                            Reler
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
