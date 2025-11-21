"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard/header"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Heart, MessageCircle, Share2, Star, ArrowLeft, Send } from "lucide-react"
import Link from "next/link"

interface Comment {
  id: string
  user: {
    name: string
    avatar: string
    username: string
  }
  content: string
  timestamp: Date
  likes: number
  isLiked: boolean
  replies?: Comment[]
}

const mockPost = {
  id: "1",
  user: {
    name: "João Silva",
    avatar: "JS",
    username: "@joao_silva",
  },
  type: "review",
  content:
    "Acabei de terminar este livro incrível! A narrativa de Coelho é simplesmente envolvente e cheia de sabedoria. Recomendo para quem busca inspiração e reflexão sobre os sonhos da vida.",
  book: {
    title: "O Alquimista",
    author: "Paulo Coelho",
    cover: "/o-alquimista-book-cover.jpg",
  },
  rating: 5,
  likes: 24,
  comments: 8,
  timestamp: new Date(2024, 1, 15, 14, 30),
  isLiked: false,
}

const mockComments: Comment[] = [
  {
    id: "1",
    user: {
      name: "Maria Santos",
      avatar: "MS",
      username: "@maria_santos",
    },
    content:
      "Concordo totalmente! Este livro mudou minha perspectiva sobre seguir sonhos. A jornada do Santiago é inspiradora.",
    timestamp: new Date(2024, 1, 15, 15, 30),
    likes: 5,
    isLiked: false,
  },
  {
    id: "2",
    user: {
      name: "Pedro Lima",
      avatar: "PL",
      username: "@pedro_lima",
    },
    content: "Paulo Coelho tem uma forma única de escrever sobre filosofia de vida. Já leu 'O Zahir' também?",
    timestamp: new Date(2024, 1, 15, 16, 15),
    likes: 3,
    isLiked: true,
  },
  {
    id: "3",
    user: {
      name: "Ana Costa",
      avatar: "AC",
      username: "@ana_costa",
    },
    content: "Que avaliação perfeita! Estou na minha lista de leitura há tempos, acho que chegou a hora de ler.",
    timestamp: new Date(2024, 1, 15, 17, 45),
    likes: 2,
    isLiked: false,
  },
]

export default function PostCommentsPage({ params }: { params: { id: string } }) {
  const [comments, setComments] = useState<Comment[]>(mockComments)
  const [newComment, setNewComment] = useState("")
  const [isLiked, setIsLiked] = useState(mockPost.isLiked)
  const [likes, setLikes] = useState(mockPost.likes)

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikes(isLiked ? likes - 1 : likes + 1)
  }

  const handleCommentLike = (commentId: string) => {
    setComments(
      comments.map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              isLiked: !comment.isLiked,
              likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
            }
          : comment,
      ),
    )
  }

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now().toString(),
        user: {
          name: "Você",
          avatar: "VC",
          username: "@voce",
        },
        content: newComment,
        timestamp: new Date(),
        likes: 0,
        isLiked: false,
      }
      setComments([...comments, comment])
      setNewComment("")
    }
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
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
              href="/community"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar para Comunidade
            </Link>

            {/* Original Post */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Post Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{mockPost.user.avatar}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{mockPost.user.name}</span>
                          <span className="text-sm text-muted-foreground">{mockPost.user.username}</span>
                          <Badge variant="outline" className="text-xs">
                            Avaliação
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {mockPost.timestamp.toLocaleDateString("pt-BR")} às{" "}
                          {mockPost.timestamp.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="space-y-3">
                    <p className="text-sm leading-relaxed">{mockPost.content}</p>

                    {/* Book Information */}
                    {mockPost.book && (
                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <img
                          src={mockPost.book.cover || "/placeholder.svg"}
                          alt={mockPost.book.title}
                          className="w-12 h-16 object-cover rounded flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">{mockPost.book.title}</h4>
                          <p className="text-sm text-muted-foreground">{mockPost.book.author}</p>
                          {mockPost.rating && (
                            <div className="flex items-center gap-2 mt-1">{renderStars(mockPost.rating)}</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Post Actions */}
                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex items-center gap-4">
                      <Button variant="ghost" size="sm" onClick={handleLike} className={isLiked ? "text-red-500" : ""}>
                        <Heart className={`h-4 w-4 mr-1 ${isLiked ? "fill-current" : ""}`} />
                        {likes}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        {comments.length}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Share2 className="h-4 w-4 mr-1" />
                        Compartilhar
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Add Comment */}
            <Card>
              <CardHeader>
                <CardTitle>Adicionar Comentário</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Compartilhe sua opinião sobre este post..."
                  rows={3}
                />
                <div className="flex justify-end">
                  <Button onClick={handleAddComment} disabled={!newComment.trim()}>
                    <Send className="h-4 w-4 mr-2" />
                    Comentar
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Comments */}
            <Card>
              <CardHeader>
                <CardTitle>Comentários ({comments.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {comments.map((comment) => (
                  <div key={comment.id} className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Avatar className="flex-shrink-0">
                        <AvatarFallback>{comment.user.avatar}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{comment.user.name}</span>
                          <span className="text-sm text-muted-foreground">{comment.user.username}</span>
                          <span className="text-sm text-muted-foreground">
                            {comment.timestamp.toLocaleDateString("pt-BR")} às{" "}
                            {comment.timestamp.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                        <p className="text-sm leading-relaxed mb-2">{comment.content}</p>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCommentLike(comment.id)}
                            className={comment.isLiked ? "text-red-500" : ""}
                          >
                            <Heart className={`h-3 w-3 mr-1 ${comment.isLiked ? "fill-current" : ""}`} />
                            {comment.likes}
                          </Button>
                          <Button variant="ghost" size="sm">
                            Responder
                          </Button>
                        </div>
                      </div>
                    </div>
                    {comment !== comments[comments.length - 1] && <div className="border-b" />}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
