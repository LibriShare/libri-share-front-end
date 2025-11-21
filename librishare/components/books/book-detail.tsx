"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Star,
  Heart,
  Share2,
  BookOpen,
  Clock,
  CheckCircle,
  Calendar,
  Edit,
  MessageSquare,
  ThumbsUp,
  ArrowLeft,
} from "lucide-react"

interface Book {
  id: string
  title: string
  author: string
  cover: string
  isbn: string
  pages: number
  genre: string
  publisher: string
  publishYear: number
  description: string
  averageRating: number
  totalRatings: number
  status: "to-read" | "reading" | "read"
  userRating?: number
  userReview?: string
  dateAdded: Date
  dateStarted?: Date
  dateFinished?: Date
  personalNotes?: string
}

interface Review {
  id: string
  user: {
    name: string
    avatar: string
  }
  rating: number
  review: string
  date: Date
  likes: number
  isLiked: boolean
}

const mockBook: Book = {
  id: "1",
  title: "O Alquimista",
  author: "Paulo Coelho",
  cover: "/o-alquimista-book-cover.jpg",
  isbn: "9788576654285",
  pages: 163,
  genre: "Ficção",
  publisher: "Planeta",
  publishYear: 1988,
  description:
    "Santiago é um jovem pastor andaluz que viaja de sua terra natal na Espanha para o mercado egípcio. Lá ele encontra o alquimista. O encontro resulta numa jornada pelo deserto, em direção às Pirâmides do Egito, que se transforma numa jornada de autodescoberta. Uma fábula sobre seguir os próprios sonhos e sobre os mistérios e surpresas que encontramos pelo caminho.",
  averageRating: 4.2,
  totalRatings: 1247,
  status: "read",
  userRating: 5,
  userReview:
    "Um livro transformador que me fez refletir sobre meus próprios sonhos e objetivos. A narrativa é envolvente e cheia de sabedoria.",
  dateAdded: new Date(2024, 0, 15),
  dateStarted: new Date(2024, 0, 20),
  dateFinished: new Date(2024, 1, 5),
  personalNotes: "Livro recomendado pela Ana. Gostei muito da mensagem sobre perseguir os sonhos.",
}

const mockReviews: Review[] = [
  {
    id: "1",
    user: {
      name: "João Silva",
      avatar: "JS",
    },
    rating: 5,
    review:
      "Uma obra-prima da literatura contemporânea. Coelho consegue transmitir mensagens profundas de forma simples e acessível. Recomendo para todos!",
    date: new Date(2024, 1, 10),
    likes: 12,
    isLiked: false,
  },
  {
    id: "2",
    user: {
      name: "Maria Santos",
      avatar: "MS",
    },
    rating: 4,
    review:
      "Livro inspirador que me fez refletir sobre minha jornada pessoal. Algumas partes são um pouco repetitivas, mas a mensagem central é poderosa.",
    date: new Date(2024, 1, 8),
    likes: 8,
    isLiked: true,
  },
  {
    id: "3",
    user: {
      name: "Carlos Mendes",
      avatar: "CM",
    },
    rating: 3,
    review:
      "Achei o livro interessante, mas esperava mais profundidade. A história é boa, mas senti que poderia ter sido mais desenvolvida.",
    date: new Date(2024, 1, 5),
    likes: 3,
    isLiked: false,
  },
]

export function BookDetail() {
  const [book, setBook] = useState<Book>(mockBook)
  const [reviews, setReviews] = useState<Review[]>(mockReviews)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [newReview, setNewReview] = useState("")
  const [newRating, setNewRating] = useState<number>(0)

  const renderStars = (rating: number, interactive = false, onRate?: (rating: number) => void) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
            } ${interactive ? "cursor-pointer hover:text-yellow-400" : ""}`}
            onClick={interactive && onRate ? () => onRate(i + 1) : undefined}
          />
        ))}
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "read":
        return "bg-secondary/10 text-secondary-foreground border-secondary/20"
      case "reading":
        return "bg-primary/10 text-primary-foreground border-primary/20"
      case "to-read":
        return "bg-accent/10 text-accent-foreground border-accent/20"
      default:
        return "bg-muted"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "read":
        return "Lido"
      case "reading":
        return "Lendo"
      case "to-read":
        return "Para Ler"
      default:
        return status
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "read":
        return <CheckCircle className="h-4 w-4" />
      case "reading":
        return <Clock className="h-4 w-4" />
      case "to-read":
        return <BookOpen className="h-4 w-4" />
      default:
        return <BookOpen className="h-4 w-4" />
    }
  }

  const handleStatusChange = (newStatus: string) => {
    setBook({ ...book, status: newStatus as any })
  }

  const handleReviewSubmit = () => {
    if (newReview.trim() && newRating > 0) {
      const review: Review = {
        id: Date.now().toString(),
        user: {
          name: "Maria Ribeiro",
          avatar: "MR",
        },
        rating: newRating,
        review: newReview,
        date: new Date(),
        likes: 0,
        isLiked: false,
      }
      setReviews([review, ...reviews])
      setBook({ ...book, userRating: newRating, userReview: newReview })
      setNewReview("")
      setNewRating(0)
    }
  }

  const handleLikeReview = (reviewId: string) => {
    setReviews(
      reviews.map((review) =>
        review.id === reviewId
          ? {
              ...review,
              isLiked: !review.isLiked,
              likes: review.isLiked ? review.likes - 1 : review.likes + 1,
            }
          : review,
      ),
    )
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Voltar à Biblioteca
      </Button>

      {/* Book Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Book Cover */}
            <div className="flex-shrink-0">
              <img
                src={book.cover || "/placeholder.svg"}
                alt={book.title}
                className="w-48 h-64 object-cover rounded-lg shadow-lg mx-auto lg:mx-0"
              />
            </div>

            {/* Book Information */}
            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-3xl font-bold text-balance mb-2">{book.title}</h1>
                <p className="text-xl text-muted-foreground mb-4">por {book.author}</p>

                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    {renderStars(Math.round(book.averageRating))}
                    <span className="text-sm text-muted-foreground">
                      {book.averageRating} ({book.totalRatings} avaliações)
                    </span>
                  </div>
                  <Badge variant="outline" className={getStatusColor(book.status)}>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(book.status)}
                      {getStatusLabel(book.status)}
                    </div>
                  </Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Páginas:</span>
                    <div className="font-medium">{book.pages}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Gênero:</span>
                    <div className="font-medium">{book.genre}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Editora:</span>
                    <div className="font-medium">{book.publisher}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Ano:</span>
                    <div className="font-medium">{book.publishYear}</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <Select value={book.status} onValueChange={handleStatusChange}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="to-read">Para Ler</SelectItem>
                    <SelectItem value="reading">Lendo</SelectItem>
                    <SelectItem value="read">Lido</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline">
                  <Heart className="h-4 w-4 mr-2" />
                  Favoritar
                </Button>

                <Button variant="outline">
                  <Share2 className="h-4 w-4 mr-2" />
                  Compartilhar
                </Button>

                <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Editar Informações do Livro</DialogTitle>
                      <DialogDescription>Atualize as informações pessoais sobre este livro</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Notas Pessoais</label>
                        <Textarea
                          placeholder="Adicione suas notas sobre o livro..."
                          defaultValue={book.personalNotes}
                          rows={3}
                        />
                      </div>
                      <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                          Cancelar
                        </Button>
                        <Button onClick={() => setShowEditDialog(false)}>Salvar</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Reading Progress */}
              {book.status === "reading" && (
                <Card className="bg-muted/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Progresso de Leitura</span>
                      <span className="text-sm text-muted-foreground">120 / {book.pages} páginas</span>
                    </div>
                    <Progress value={(120 / book.pages) * 100} className="h-2" />
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Book Details Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="reviews">Avaliações ({reviews.length})</TabsTrigger>
          <TabsTrigger value="notes">Minhas Notas</TabsTrigger>
          <TabsTrigger value="activity">Atividade</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sinopse</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-pretty">{book.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Detalhes do Livro</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ISBN:</span>
                    <span className="font-medium">{book.isbn}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Páginas:</span>
                    <span className="font-medium">{book.pages}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Gênero:</span>
                    <span className="font-medium">{book.genre}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Editora:</span>
                    <span className="font-medium">{book.publisher}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ano de Publicação:</span>
                    <span className="font-medium">{book.publishYear}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Adicionado em:</span>
                    <span className="font-medium">{book.dateAdded.toLocaleDateString("pt-BR")}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="space-y-6">
          {/* Add Review Section */}
          <Card>
            <CardHeader>
              <CardTitle>Sua Avaliação</CardTitle>
              <CardDescription>{book.userRating ? "Edite sua avaliação" : "Avalie este livro"}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Nota</label>
                {renderStars(newRating || book.userRating || 0, true, setNewRating)}
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Sua opinião</label>
                <Textarea
                  placeholder="Compartilhe sua opinião sobre o livro..."
                  value={newReview || book.userReview || ""}
                  onChange={(e) => setNewReview(e.target.value)}
                  rows={4}
                />
              </div>
              <Button onClick={handleReviewSubmit}>
                {book.userRating ? "Atualizar Avaliação" : "Publicar Avaliação"}
              </Button>
            </CardContent>
          </Card>

          {/* Reviews List */}
          <div className="space-y-4">
            {reviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>{review.user.avatar}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{review.user.name}</div>
                          <div className="flex items-center gap-2 mt-1">
                            {renderStars(review.rating)}
                            <span className="text-sm text-muted-foreground">
                              {review.date.toLocaleDateString("pt-BR")}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm leading-relaxed">{review.review}</p>

                    <div className="flex items-center gap-4 pt-2 border-t">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLikeReview(review.id)}
                        className={review.isLiked ? "text-red-500" : ""}
                      >
                        <ThumbsUp className={`h-4 w-4 mr-1 ${review.isLiked ? "fill-current" : ""}`} />
                        {review.likes}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Responder
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="notes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Minhas Notas Pessoais</CardTitle>
              <CardDescription>Suas anotações e reflexões sobre este livro</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Adicione suas notas pessoais sobre o livro..."
                defaultValue={book.personalNotes}
                rows={6}
              />
              <Button>Salvar Notas</Button>
            </CardContent>
          </Card>

          {book.status === "read" && (
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Leitura</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Adicionado à biblioteca em {book.dateAdded.toLocaleDateString("pt-BR")}</span>
                  </div>
                  {book.dateStarted && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span>Começou a ler em {book.dateStarted.toLocaleDateString("pt-BR")}</span>
                    </div>
                  )}
                  {book.dateFinished && (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-secondary" />
                      <span>Terminou de ler em {book.dateFinished.toLocaleDateString("pt-BR")}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Atividade do Livro</CardTitle>
              <CardDescription>Histórico de interações com este livro</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    action: "Marcou como lido",
                    date: book.dateFinished || new Date(),
                    icon: <CheckCircle className="h-4 w-4 text-secondary" />,
                  },
                  {
                    action: "Adicionou uma avaliação",
                    date: new Date(2024, 1, 6),
                    icon: <Star className="h-4 w-4 text-yellow-500" />,
                  },
                  {
                    action: "Começou a ler",
                    date: book.dateStarted || new Date(),
                    icon: <Clock className="h-4 w-4 text-primary" />,
                  },
                  {
                    action: "Adicionou à biblioteca",
                    date: book.dateAdded,
                    icon: <BookOpen className="h-4 w-4 text-accent-foreground" />,
                  },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                    {activity.icon}
                    <div className="flex-1">
                      <div className="text-sm font-medium">{activity.action}</div>
                      <div className="text-xs text-muted-foreground">
                        {activity.date.toLocaleDateString("pt-BR")} às{" "}
                        {activity.date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
