"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, MessageCircle, Share2, BookOpen, Star, TrendingUp, Users, Search } from "lucide-react"
import Link from "next/link"

interface CommunityPost {
  id: string
  user: {
    name: string
    avatar: string
    username: string
  }
  type: "review" | "recommendation" | "discussion" | "achievement"
  content: string
  book?: {
    title: string
    author: string
    cover: string
  }
  rating?: number
  likes: number
  comments: number
  timestamp: Date
  isLiked: boolean
}

const mockPosts: CommunityPost[] = [
  {
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
  },
  {
    id: "2",
    user: {
      name: "Ana Costa",
      avatar: "AC",
      username: "@ana_costa",
    },
    type: "achievement",
    content:
      "🎉 Consegui atingir minha meta de leitura de 2024! 50 livros lidos este ano. Obrigada a todos que me deram ótimas recomendações!",
    likes: 45,
    comments: 12,
    timestamp: new Date(2024, 1, 14, 16, 45),
    isLiked: true,
  },
  {
    id: "3",
    user: {
      name: "Carlos Mendes",
      avatar: "CM",
      username: "@carlos_mendes",
    },
    type: "recommendation",
    content:
      "Para quem gosta de ficção científica, este livro é imperdível! Orwell criou uma distopia que infelizmente ainda é muito relevante nos dias de hoje.",
    book: {
      title: "1984",
      author: "George Orwell",
      cover: "/1984-book-cover-dystopian.jpg",
    },
    likes: 18,
    comments: 5,
    timestamp: new Date(2024, 1, 13, 10, 15),
    isLiked: false,
  },
]

export function CommunityFeed() {
  const [posts, setPosts] = useState<CommunityPost[]>(mockPosts)
  const [searchQuery, setSearchQuery] = useState("")

  const handleLike = (postId: string) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            }
          : post,
      ),
    )
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

  const getPostTypeIcon = (type: string) => {
    switch (type) {
      case "review":
        return <Star className="h-4 w-4 text-yellow-500" />
      case "recommendation":
        return <BookOpen className="h-4 w-4 text-primary" />
      case "achievement":
        return <TrendingUp className="h-4 w-4 text-secondary" />
      case "discussion":
        return <MessageCircle className="h-4 w-4 text-accent-foreground" />
      default:
        return <BookOpen className="h-4 w-4" />
    }
  }

  const getPostTypeLabel = (type: string) => {
    switch (type) {
      case "review":
        return "Avaliação"
      case "recommendation":
        return "Recomendação"
      case "achievement":
        return "Conquista"
      case "discussion":
        return "Discussão"
      default:
        return type
    }
  }

  return (
    <div className="space-y-6">
      {/* Community Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Comunidade LibriShare
          </CardTitle>
          <CardDescription>
            Conecte-se com outros leitores, compartilhe opiniões e descubra novos livros
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar discussões, livros ou usuários..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Link href="/community/new-post">
              <Button>Nova Publicação</Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="feed" className="w-full">
        <TabsList>
          <TabsTrigger value="feed">Feed</TabsTrigger>
          <TabsTrigger value="trending">Em Alta</TabsTrigger>
          <TabsTrigger value="reviews">Avaliações</TabsTrigger>
          <TabsTrigger value="discussions">Discussões</TabsTrigger>
        </TabsList>

        <TabsContent value="feed" className="space-y-4">
          {posts.map((post) => (
            <Card key={post.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Post Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{post.user.avatar}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{post.user.name}</span>
                          <span className="text-sm text-muted-foreground">{post.user.username}</span>
                          <Badge variant="outline" className="text-xs">
                            <div className="flex items-center gap-1">
                              {getPostTypeIcon(post.type)}
                              {getPostTypeLabel(post.type)}
                            </div>
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {post.timestamp.toLocaleDateString("pt-BR")} às{" "}
                          {post.timestamp.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="space-y-3">
                    <p className="text-sm leading-relaxed">{post.content}</p>

                    {/* Book Information */}
                    {post.book && (
                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <img
                          src={post.book.cover || "/placeholder.svg"}
                          alt={post.book.title}
                          className="w-12 h-16 object-cover rounded flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">{post.book.title}</h4>
                          <p className="text-sm text-muted-foreground">{post.book.author}</p>
                          {post.rating && (
                            <div className="flex items-center gap-2 mt-1">{renderStars(post.rating)}</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Post Actions */}
                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex items-center gap-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLike(post.id)}
                        className={post.isLiked ? "text-red-500" : ""}
                      >
                        <Heart className={`h-4 w-4 mr-1 ${post.isLiked ? "fill-current" : ""}`} />
                        {post.likes}
                      </Button>
                      <Link href={`/community/posts/${post.id}/comments`}>
                        <Button variant="ghost" size="sm">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          {post.comments}
                        </Button>
                      </Link>
                      <Button variant="ghost" size="sm">
                        <Share2 className="h-4 w-4 mr-1" />
                        Compartilhar
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="trending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Livros em Alta</CardTitle>
              <CardDescription>Os livros mais comentados da semana</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { title: "O Alquimista", author: "Paulo Coelho", mentions: 45 },
                  { title: "1984", author: "George Orwell", mentions: 32 },
                  { title: "Dom Casmurro", author: "Machado de Assis", mentions: 28 },
                ].map((book, index) => (
                  <div key={book.title} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{book.title}</div>
                      <div className="text-sm text-muted-foreground">{book.author}</div>
                    </div>
                    <Badge variant="secondary">{book.mentions} menções</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="space-y-4">
          {posts
            .filter((post) => post.type === "review")
            .map((post) => (
              <Card key={post.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>{post.user.avatar}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{post.user.name}</span>
                            <span className="text-sm text-muted-foreground">{post.user.username}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {post.timestamp.toLocaleDateString("pt-BR")}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <p className="text-sm leading-relaxed">{post.content}</p>

                      {post.book && (
                        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                          <img
                            src={post.book.cover || "/placeholder.svg"}
                            alt={post.book.title}
                            className="w-12 h-16 object-cover rounded flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium truncate">{post.book.title}</h4>
                            <p className="text-sm text-muted-foreground">{post.book.author}</p>
                            {post.rating && (
                              <div className="flex items-center gap-2 mt-1">{renderStars(post.rating)}</div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t">
                      <div className="flex items-center gap-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLike(post.id)}
                          className={post.isLiked ? "text-red-500" : ""}
                        >
                          <Heart className={`h-4 w-4 mr-1 ${post.isLiked ? "fill-current" : ""}`} />
                          {post.likes}
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          {post.comments}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>

        <TabsContent value="discussions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Discussões Populares</CardTitle>
              <CardDescription>Participe das conversas mais interessantes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    title: "Qual o melhor livro de ficção científica que vocês já leram?",
                    author: "Maria Santos",
                    replies: 23,
                    lastActivity: "2 horas atrás",
                  },
                  {
                    title: "Dicas para quem quer começar a ler clássicos brasileiros",
                    author: "Pedro Lima",
                    replies: 18,
                    lastActivity: "4 horas atrás",
                  },
                  {
                    title: "Como vocês organizam suas bibliotecas pessoais?",
                    author: "Julia Costa",
                    replies: 31,
                    lastActivity: "6 horas atrás",
                  },
                ].map((discussion) => (
                  <Link key={discussion.title} href="/community/discussions">
                    <div className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                      <h4 className="font-medium mb-2">{discussion.title}</h4>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Por {discussion.author}</span>
                        <div className="flex items-center gap-4">
                          <span>{discussion.replies} respostas</span>
                          <span>{discussion.lastActivity}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
