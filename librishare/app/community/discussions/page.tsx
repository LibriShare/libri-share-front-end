"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard/header"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageCircle, Users, TrendingUp, Clock, Search, Plus, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface Discussion {
  id: string
  title: string
  author: {
    name: string
    avatar: string
    username: string
  }
  category: string
  replies: number
  views: number
  lastActivity: Date
  isPopular: boolean
  isPinned: boolean
}

const mockDiscussions: Discussion[] = [
  {
    id: "1",
    title: "Qual o melhor livro de ficção científica que vocês já leram?",
    author: {
      name: "Maria Santos",
      avatar: "MS",
      username: "@maria_santos",
    },
    category: "Recomendações",
    replies: 23,
    views: 156,
    lastActivity: new Date(2024, 1, 15, 14, 30),
    isPopular: true,
    isPinned: false,
  },
  {
    id: "2",
    title: "Dicas para quem quer começar a ler clássicos brasileiros",
    author: {
      name: "Pedro Lima",
      avatar: "PL",
      username: "@pedro_lima",
    },
    category: "Dicas de Leitura",
    replies: 18,
    views: 89,
    lastActivity: new Date(2024, 1, 15, 10, 15),
    isPopular: true,
    isPinned: true,
  },
  {
    id: "3",
    title: "Como vocês organizam suas bibliotecas pessoais?",
    author: {
      name: "Julia Costa",
      avatar: "JC",
      username: "@julia_costa",
    },
    category: "Organização",
    replies: 31,
    views: 203,
    lastActivity: new Date(2024, 1, 15, 8, 45),
    isPopular: true,
    isPinned: false,
  },
  {
    id: "4",
    title: "Discussão sobre o final de '1984' - spoilers!",
    author: {
      name: "Carlos Mendes",
      avatar: "CM",
      username: "@carlos_mendes",
    },
    category: "Análise Literária",
    replies: 12,
    views: 67,
    lastActivity: new Date(2024, 1, 14, 16, 20),
    isPopular: false,
    isPinned: false,
  },
  {
    id: "5",
    title: "Clube do livro: vamos ler 'Dom Casmurro' juntos?",
    author: {
      name: "Ana Rodrigues",
      avatar: "AR",
      username: "@ana_rodrigues",
    },
    category: "Clube do Livro",
    replies: 45,
    views: 298,
    lastActivity: new Date(2024, 1, 14, 12, 10),
    isPopular: true,
    isPinned: false,
  },
]

export default function DiscussionsPage() {
  const [discussions] = useState<Discussion[]>(mockDiscussions)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")

  const filteredDiscussions = discussions.filter((discussion) => {
    const matchesSearch = discussion.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "all" || discussion.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const categories = [...new Set(discussions.map((d) => d.category))]

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Agora há pouco"
    if (diffInHours < 24) return `${diffInHours}h atrás`

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d atrás`

    return date.toLocaleDateString("pt-BR")
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <div className="flex">
        <aside className="hidden lg:block border-r bg-card/50">
          <Sidebar />
        </aside>

        <main className="flex-1 px-4 py-8">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Back Button */}
            <Link
              href="/community"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar para Comunidade
            </Link>

            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Discussões</h1>
                <p className="text-muted-foreground">Participe das conversas mais interessantes da comunidade</p>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nova Discussão
              </Button>
            </div>

            {/* Search and Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar discussões..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="all" className="w-full">
              <TabsList>
                <TabsTrigger value="all">Todas</TabsTrigger>
                <TabsTrigger value="popular">Populares</TabsTrigger>
                <TabsTrigger value="recent">Recentes</TabsTrigger>
                <TabsTrigger value="pinned">Fixadas</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                {filteredDiscussions.map((discussion) => (
                  <Card key={discussion.id} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Avatar className="flex-shrink-0">
                          <AvatarFallback>{discussion.author.avatar}</AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                {discussion.isPinned && (
                                  <Badge variant="secondary" className="text-xs">
                                    Fixada
                                  </Badge>
                                )}
                                {discussion.isPopular && (
                                  <Badge variant="outline" className="text-xs">
                                    <TrendingUp className="h-3 w-3 mr-1" />
                                    Popular
                                  </Badge>
                                )}
                                <Badge variant="outline" className="text-xs">
                                  {discussion.category}
                                </Badge>
                              </div>

                              <h3 className="font-semibold text-lg mb-2 hover:text-primary transition-colors">
                                {discussion.title}
                              </h3>

                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span>Por {discussion.author.name}</span>
                                <div className="flex items-center gap-1">
                                  <MessageCircle className="h-4 w-4" />
                                  <span>{discussion.replies} respostas</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Users className="h-4 w-4" />
                                  <span>{discussion.views} visualizações</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  <span>{formatTimeAgo(discussion.lastActivity)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="popular" className="space-y-4">
                {filteredDiscussions
                  .filter((d) => d.isPopular)
                  .map((discussion) => (
                    <Card key={discussion.id} className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <Avatar className="flex-shrink-0">
                            <AvatarFallback>{discussion.author.avatar}</AvatarFallback>
                          </Avatar>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline" className="text-xs">
                                <TrendingUp className="h-3 w-3 mr-1" />
                                Popular
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {discussion.category}
                              </Badge>
                            </div>

                            <h3 className="font-semibold text-lg mb-2 hover:text-primary transition-colors">
                              {discussion.title}
                            </h3>

                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>Por {discussion.author.name}</span>
                              <div className="flex items-center gap-1">
                                <MessageCircle className="h-4 w-4" />
                                <span>{discussion.replies} respostas</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                <span>{discussion.views} visualizações</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </TabsContent>

              <TabsContent value="recent" className="space-y-4">
                {filteredDiscussions
                  .sort((a, b) => b.lastActivity.getTime() - a.lastActivity.getTime())
                  .map((discussion) => (
                    <Card key={discussion.id} className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <Avatar className="flex-shrink-0">
                            <AvatarFallback>{discussion.author.avatar}</AvatarFallback>
                          </Avatar>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline" className="text-xs">
                                {discussion.category}
                              </Badge>
                            </div>

                            <h3 className="font-semibold text-lg mb-2 hover:text-primary transition-colors">
                              {discussion.title}
                            </h3>

                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>Por {discussion.author.name}</span>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>{formatTimeAgo(discussion.lastActivity)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </TabsContent>

              <TabsContent value="pinned" className="space-y-4">
                {filteredDiscussions
                  .filter((d) => d.isPinned)
                  .map((discussion) => (
                    <Card key={discussion.id} className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <Avatar className="flex-shrink-0">
                            <AvatarFallback>{discussion.author.avatar}</AvatarFallback>
                          </Avatar>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="secondary" className="text-xs">
                                Fixada
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {discussion.category}
                              </Badge>
                            </div>

                            <h3 className="font-semibold text-lg mb-2 hover:text-primary transition-colors">
                              {discussion.title}
                            </h3>

                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>Por {discussion.author.name}</span>
                              <div className="flex items-center gap-1">
                                <MessageCircle className="h-4 w-4" />
                                <span>{discussion.replies} respostas</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
