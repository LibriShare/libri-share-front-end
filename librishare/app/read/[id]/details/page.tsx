import { DashboardHeader } from "@/components/dashboard/header"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Calendar, BookOpen, ArrowLeft, Heart, MessageCircle, Share2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Mock data - in a real app, this would come from a database
const getReadBookById = (id: string) => {
  const books = {
    "1": {
      id: "1",
      title: "O Alquimista",
      author: "Paulo Coelho",
      cover: "/o-alquimista-book-cover.jpg",
      rating: 5,
      finishedDate: "2024-01-10",
      pages: 163,
      review:
        "Uma jornada inspiradora sobre seguir seus sonhos e ouvir seu coração. Paulo Coelho criou uma narrativa envolvente que nos faz refletir sobre nossos próprios sonhos e a coragem necessária para persegui-los.",
      genre: "Ficção",
      isbn: "978-85-325-1158-9",
      publisher: "Editora Rocco",
      publishedYear: 1988,
      readingTime: "3 dias",
      startDate: "2024-01-07",
      notes:
        "Frases marcantes: 'E, quando você quer alguma coisa, todo o Universo conspira para que você realize o seu desejo.' - Esta frase resume toda a filosofia do livro.",
      tags: ["Filosofia", "Aventura", "Autoajuda"],
      quotes: [
        "E, quando você quer alguma coisa, todo o Universo conspira para que você realize o seu desejo.",
        "É a possibilidade de realizar um sonho que torna a vida interessante.",
        "O medo de sofrer é pior que o próprio sofrimento.",
      ],
    },
  }
  return books[id as keyof typeof books]
}

export default function ReadBookDetailsPage({ params }: { params: { id: string } }) {
  const book = getReadBookById(params.id)

  if (!book) {
    return <div>Livro não encontrado</div>
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-5 w-5 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
          />
        ))}
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
            {/* Back Button */}
            <Link
              href="/read"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar para Livros Lidos
            </Link>

            {/* Book Header */}
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <Image
                  src={book.cover || "/placeholder.svg"}
                  alt={book.title}
                  width={200}
                  height={300}
                  className="rounded-lg shadow-lg"
                />
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <h1 className="text-3xl font-bold text-balance">{book.title}</h1>
                  <p className="text-xl text-muted-foreground">{book.author}</p>
                </div>

                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="bg-secondary/10 text-secondary-foreground border-secondary/20">
                    Lido
                  </Badge>
                  {renderStars(book.rating)}
                  <span className="text-sm text-muted-foreground">({book.rating}/5)</span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <span>{book.pages} páginas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Lido em {book.readingTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Iniciado em {new Date(book.startDate).toLocaleDateString("pt-BR")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Concluído em {new Date(book.finishedDate).toLocaleDateString("pt-BR")}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button>Reler</Button>
                  <Button variant="outline">Emprestar</Button>
                  <Button variant="outline">Editar Avaliação</Button>
                </div>
              </div>
            </div>

            {/* Review and Rating */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Minha Avaliação</span>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Heart className="h-4 w-4 mr-1" />
                      12
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MessageCircle className="h-4 w-4 mr-1" />3
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    {renderStars(book.rating)}
                    <span className="text-sm text-muted-foreground">
                      Avaliado em {new Date(book.finishedDate).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed">{book.review}</p>
                </div>
              </CardContent>
            </Card>

            {/* Book Details */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Informações do Livro</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Gênero</span>
                    <span className="text-sm font-medium">{book.genre}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">ISBN</span>
                    <span className="text-sm font-medium">{book.isbn}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Editora</span>
                    <span className="text-sm font-medium">{book.publisher}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Ano de Publicação</span>
                    <span className="text-sm font-medium">{book.publishedYear}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Páginas</span>
                    <span className="text-sm font-medium">{book.pages}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {book.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Notes and Quotes */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Minhas Anotações</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed">{book.notes}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Citações Favoritas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {book.quotes.map((quote, index) => (
                      <blockquote key={index} className="border-l-4 border-primary pl-4 italic text-sm">
                        "{quote}"
                      </blockquote>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
