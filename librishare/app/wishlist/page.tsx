import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, ShoppingCart, Star, DollarSign } from "lucide-react"
import Image from "next/image"

export default function WishlistPage() {
  const wishlistBooks = [
    {
      id: 1,
      title: "Atomic Habits",
      author: "James Clear",
      cover: "/atomic-habits-cover.png",
      price: "R$ 45,90",
      rating: 4.8,
      priority: "alta",
      addedDate: "2024-01-05",
    },
    {
      id: 2,
      title: "The Psychology of Money",
      author: "Morgan Housel",
      cover: "/psychology-of-money-book-cover.jpg",
      price: "R$ 38,50",
      rating: 4.6,
      priority: "média",
      addedDate: "2024-01-03",
    },
    {
      id: 3,
      title: "Educated",
      author: "Tara Westover",
      cover: "/educated-book-cover-memoir.jpg",
      price: "R$ 42,00",
      rating: 4.9,
      priority: "baixa",
      addedDate: "2023-12-28",
    },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "alta":
        return "bg-red-100 text-red-800"
      case "média":
        return "bg-yellow-100 text-yellow-800"
      case "baixa":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Lista de Desejos</h1>
              <p className="text-muted-foreground">Livros que você deseja ler no futuro</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistBooks.map((book) => (
                <Card key={book.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="space-y-4">
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

                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm">{book.rating}</span>
                            </div>
                            <Badge className={getPriorityColor(book.priority)}>{book.priority}</Badge>
                          </div>

                          <div className="flex items-center gap-1 text-lg font-semibold text-green-600">
                            <DollarSign className="h-4 w-4" />
                            <span>{book.price}</span>
                          </div>

                          <p className="text-xs text-muted-foreground">
                            Adicionado em {new Date(book.addedDate).toLocaleDateString("pt-BR")}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1">
                          <ShoppingCart className="h-4 w-4 mr-1" />
                          Comprar
                        </Button>
                        <Button size="sm" variant="outline">
                          <Heart className="h-4 w-4 text-red-500" />
                        </Button>
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
