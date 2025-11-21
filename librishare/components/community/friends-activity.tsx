"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, Share2, UserPlus, Star } from "lucide-react"
import Image from "next/image"

const friendsActivity = [
  {
    id: 1,
    user: {
      name: "Ana Silva",
      avatar: "/diverse-user-avatars.png",
      username: "@ana_leitora",
    },
    action: "finished_reading",
    book: {
      title: "Dom Casmurro",
      author: "Machado de Assis",
      cover: "/dom-casmurro-classic-book.jpg",
    },
    rating: 5,
    comment: "Uma obra-prima da literatura brasileira! A narrativa de Bentinho é envolvente e cheia de nuances.",
    timestamp: "2 horas atrás",
    likes: 12,
    comments: 3,
  },
  {
    id: 2,
    user: {
      name: "Carlos Mendes",
      avatar: "/diverse-user-avatars.png",
      username: "@carlos_books",
    },
    action: "started_reading",
    book: {
      title: "Cem Anos de Solidão",
      author: "Gabriel García Márquez",
      cover: "/cem-anos-de-solidao-book.jpg",
    },
    timestamp: "5 horas atrás",
    likes: 8,
    comments: 1,
  },
  {
    id: 3,
    user: {
      name: "Mariana Costa",
      avatar: "/diverse-user-avatars.png",
      username: "@mari_reads",
    },
    action: "added_to_wishlist",
    book: {
      title: "O Alquimista",
      author: "Paulo Coelho",
      cover: "/o-alquimista-book-cover.jpg",
    },
    timestamp: "1 dia atrás",
    likes: 5,
    comments: 2,
  },
]

const suggestedFriends = [
  {
    name: "Pedro Santos",
    avatar: "/diverse-user-avatars.png",
    username: "@pedro_leitor",
    mutualFriends: 3,
    commonBooks: 12,
  },
  {
    name: "Julia Oliveira",
    avatar: "/diverse-user-avatars.png",
    username: "@julia_books",
    mutualFriends: 5,
    commonBooks: 8,
  },
]

export function FriendsActivity() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Friends Activity Feed */}
      <div className="lg:col-span-2 space-y-4">
        <h2 className="text-2xl font-semibold">Atividade dos Amigos</h2>

        {friendsActivity.map((activity) => (
          <Card key={activity.id}>
            <CardContent className="p-6">
              <div className="flex gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={activity.user.avatar || "/placeholder.svg"} />
                  <AvatarFallback>
                    {activity.user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold">{activity.user.name}</span>
                      <span className="text-muted-foreground text-sm">{activity.user.username}</span>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-muted-foreground text-sm">{activity.timestamp}</span>
                    </div>

                    <div className="mt-1">
                      {activity.action === "finished_reading" && <span className="text-sm">terminou de ler</span>}
                      {activity.action === "started_reading" && <span className="text-sm">começou a ler</span>}
                      {activity.action === "added_to_wishlist" && (
                        <span className="text-sm">adicionou à lista de desejos</span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className="relative w-12 h-16 flex-shrink-0">
                      <Image
                        src={activity.book.cover || "/placeholder.svg"}
                        alt={activity.book.title}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{activity.book.title}</h4>
                      <p className="text-xs text-muted-foreground">{activity.book.author}</p>
                      {activity.rating && (
                        <div className="flex items-center gap-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < activity.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {activity.comment && <p className="text-sm text-muted-foreground italic">"{activity.comment}"</p>}

                  <div className="flex items-center gap-4 pt-2">
                    <Button variant="ghost" size="sm" className="h-8 px-2">
                      <Heart className="h-4 w-4 mr-1" />
                      {activity.likes}
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 px-2">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      {activity.comments}
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 px-2">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Suggested Friends Sidebar */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Sugestões de Amigos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {suggestedFriends.map((friend, index) => (
              <div key={index} className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={friend.avatar || "/placeholder.svg"} />
                  <AvatarFallback>
                    {friend.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <p className="font-medium text-sm">{friend.name}</p>
                  <p className="text-xs text-muted-foreground">{friend.username}</p>
                  <p className="text-xs text-muted-foreground">
                    {friend.mutualFriends} amigos em comum • {friend.commonBooks} livros em comum
                  </p>
                </div>

                <Button size="sm" variant="outline">
                  <UserPlus className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Estatísticas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Amigos</span>
              <span className="font-medium">24</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Seguindo</span>
              <span className="font-medium">156</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Seguidores</span>
              <span className="font-medium">89</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
