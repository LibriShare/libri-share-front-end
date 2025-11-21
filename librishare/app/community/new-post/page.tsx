"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard/header"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Star, ImageIcon, Hash } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function NewPostPage() {
  const [postType, setPostType] = useState<string>("")
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [selectedBook, setSelectedBook] = useState<any>(null)
  const [rating, setRating] = useState(0)
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")

  const mockBooks = [
    {
      id: "1",
      title: "O Alquimista",
      author: "Paulo Coelho",
      cover: "/o-alquimista-book-cover.jpg",
    },
    {
      id: "2",
      title: "1984",
      author: "George Orwell",
      cover: "/1984-book-cover-dystopian.jpg",
    },
    {
      id: "3",
      title: "Dom Casmurro",
      author: "Machado de Assis",
      cover: "/dom-casmurro-classic-book.jpg",
    },
  ]

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleSubmit = () => {
    // Here you would submit the post to your backend
    console.log("Submitting post:", {
      postType,
      title,
      content,
      selectedBook,
      rating,
      tags,
    })
    // Redirect back to community page
  }

  const renderStars = (currentRating: number, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-5 w-5 cursor-pointer transition-colors ${
              i < currentRating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground hover:text-yellow-400"
            }`}
            onClick={() => onRatingChange && onRatingChange(i + 1)}
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
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Back Button */}
            <Link
              href="/community"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar para LibriConnect
            </Link>

            {/* New Post Form */}
            <Card>
              <CardHeader>
                <CardTitle>Nova Publicação</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Post Type */}
                <div className="space-y-2">
                  <Label>Tipo de Publicação</Label>
                  <Select value={postType} onValueChange={setPostType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo de publicação" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="review">Avaliação de Livro</SelectItem>
                      <SelectItem value="recommendation">Recomendação</SelectItem>
                      <SelectItem value="discussion">Discussão</SelectItem>
                      <SelectItem value="achievement">Conquista</SelectItem>
                      <SelectItem value="general">Publicação Geral</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Title (for discussions) */}
                {(postType === "discussion" || postType === "general") && (
                  <div className="space-y-2">
                    <Label htmlFor="title">Título</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Digite o título da sua publicação"
                    />
                  </div>
                )}

                {/* Book Selection (for reviews and recommendations) */}
                {(postType === "review" || postType === "recommendation") && (
                  <div className="space-y-2">
                    <Label>Selecionar Livro</Label>
                    <div className="grid grid-cols-1 gap-2">
                      {mockBooks.map((book) => (
                        <div
                          key={book.id}
                          className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                            selectedBook?.id === book.id ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                          }`}
                          onClick={() => setSelectedBook(book)}
                        >
                          <Image
                            src={book.cover || "/placeholder.svg"}
                            alt={book.title}
                            width={40}
                            height={60}
                            className="rounded object-cover"
                          />
                          <div>
                            <h4 className="font-medium text-sm">{book.title}</h4>
                            <p className="text-xs text-muted-foreground">{book.author}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Rating (for reviews) */}
                {postType === "review" && (
                  <div className="space-y-2">
                    <Label>Sua Avaliação</Label>
                    <div className="flex items-center gap-2">
                      {renderStars(rating, setRating)}
                      <span className="text-sm text-muted-foreground">
                        {rating > 0 ? `${rating}/5 estrelas` : "Clique para avaliar"}
                      </span>
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className="space-y-2">
                  <Label htmlFor="content">
                    {postType === "review"
                      ? "Sua Resenha"
                      : postType === "recommendation"
                        ? "Por que você recomenda?"
                        : postType === "discussion"
                          ? "Inicie a discussão"
                          : postType === "achievement"
                            ? "Compartilhe sua conquista"
                            : "Conteúdo"}
                  </Label>
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={
                      postType === "review"
                        ? "Compartilhe sua opinião sobre o livro..."
                        : postType === "recommendation"
                          ? "Conte por que outros leitores deveriam ler este livro..."
                          : postType === "discussion"
                            ? "Faça uma pergunta ou inicie uma discussão..."
                            : postType === "achievement"
                              ? "Conte sobre sua conquista de leitura..."
                              : "Escreva sua publicação..."
                    }
                    rows={6}
                  />
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Adicionar tag"
                      onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                    />
                    <Button type="button" variant="outline" onClick={handleAddTag}>
                      <Hash className="h-4 w-4" />
                    </Button>
                  </div>
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="cursor-pointer"
                          onClick={() => handleRemoveTag(tag)}
                        >
                          {tag} ×
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button onClick={handleSubmit} className="flex-1" disabled={!postType || !content.trim()}>
                    Publicar
                  </Button>
                  <Button variant="outline">
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Adicionar Imagem
                  </Button>
                  <Link href="/community">
                    <Button variant="outline">Cancelar</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
