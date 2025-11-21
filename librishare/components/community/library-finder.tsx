"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  MapPin,
  Clock,
  Phone,
  Globe,
  Star,
  Navigation,
  Users,
  Lock,
  BookOpen,
  UserPlus,
  Search,
  Filter,
} from "lucide-react"

const personalLibraries = [
  {
    id: 1,
    owner: {
      name: "Ana Silva",
      avatar: "/placeholder.svg?height=40&width=40",
      location: "São Paulo, SP",
      rating: 4.8,
      totalBooks: 342,
    },
    name: "Biblioteca da Ana",
    description: "Coleção focada em ficção científica, fantasia e literatura brasileira contemporânea",
    isPrivate: false,
    members: 23,
    categories: ["Ficção Científica", "Fantasia", "Literatura Brasileira"],
    recentBooks: ["Dune", "O Nome do Vento", "Cidade de Deus"],
    distance: "1.2 km",
    joinRequests: 0,
  },
  {
    id: 2,
    owner: {
      name: "Carlos Mendes",
      avatar: "/placeholder.svg?height=40&width=40",
      location: "Rio de Janeiro, RJ",
      rating: 4.6,
      totalBooks: 156,
    },
    name: "Círculo Literário do Carlos",
    description: "Grupo privado para discussão de clássicos da literatura mundial",
    isPrivate: true,
    members: 8,
    categories: ["Clássicos", "Filosofia", "História"],
    recentBooks: ["1984", "Dom Casmurro", "A República"],
    distance: "2.8 km",
    joinRequests: 3,
  },
  {
    id: 3,
    owner: {
      name: "Maria Santos",
      avatar: "/placeholder.svg?height=40&width=40",
      location: "Belo Horizonte, MG",
      rating: 4.9,
      totalBooks: 289,
    },
    name: "Biblioteca Infantil da Maria",
    description: "Especializada em literatura infantil e juvenil, perfeita para pais e educadores",
    isPrivate: false,
    members: 45,
    categories: ["Infantil", "Juvenil", "Educação"],
    recentBooks: ["Harry Potter", "O Pequeno Príncipe", "Turma da Mônica"],
    distance: "3.5 km",
    joinRequests: 0,
  },
  {
    id: 4,
    owner: {
      name: "João Oliveira",
      avatar: "/placeholder.svg?height=40&width=40",
      location: "Porto Alegre, RS",
      rating: 4.7,
      totalBooks: 198,
    },
    name: "Tech Books & More",
    description: "Livros técnicos, programação, negócios e desenvolvimento pessoal",
    isPrivate: true,
    members: 12,
    categories: ["Tecnologia", "Negócios", "Autoajuda"],
    recentBooks: ["Clean Code", "O Poder do Hábito", "Lean Startup"],
    distance: "4.1 km",
    joinRequests: 7,
  },
]

const nearbyLibraries = [
  {
    id: 1,
    name: "Biblioteca Central Municipal",
    address: "Rua das Flores, 123 - Centro",
    distance: "0.8 km",
    rating: 4.5,
    hours: "08:00 - 18:00",
    phone: "(11) 3456-7890",
    website: "biblioteca-central.gov.br",
    features: ["WiFi Gratuito", "Sala de Estudos", "Computadores", "Acervo Digital"],
    type: "Pública",
  },
  {
    id: 2,
    name: "Biblioteca Universitária UNESP",
    address: "Campus Universitário - Vila Universitária",
    distance: "1.2 km",
    rating: 4.7,
    hours: "07:00 - 22:00",
    phone: "(11) 3456-7891",
    website: "biblioteca.unesp.br",
    features: ["Acesso 24h", "Salas Privativas", "Laboratório", "Acervo Especializado"],
    type: "Universitária",
  },
  {
    id: 3,
    name: "Biblioteca Comunitária Monteiro Lobato",
    address: "Av. Paulista, 456 - Bela Vista",
    distance: "2.1 km",
    rating: 4.2,
    hours: "09:00 - 17:00",
    phone: "(11) 3456-7892",
    website: "monteiro-lobato.org.br",
    features: ["Atividades Infantis", "Clube do Livro", "Eventos Culturais"],
    type: "Comunitária",
  },
]

export function LibraryFinder() {
  const [searchLocation, setSearchLocation] = useState("")
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [searchPersonal, setSearchPersonal] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const filteredLibraries = nearbyLibraries.filter((library) => (selectedType ? library.type === selectedType : true))

  const filteredPersonalLibraries = personalLibraries.filter((library) => {
    const matchesSearch =
      searchPersonal === "" ||
      library.name.toLowerCase().includes(searchPersonal.toLowerCase()) ||
      library.owner.name.toLowerCase().includes(searchPersonal.toLowerCase()) ||
      library.description.toLowerCase().includes(searchPersonal.toLowerCase())

    const matchesCategory = selectedCategory === null || library.categories.includes(selectedCategory)

    return matchesSearch && matchesCategory
  })

  const libraryTypes = ["Pública", "Universitária", "Comunitária", "Cultural"]
  const personalCategories = [
    "Ficção Científica",
    "Fantasia",
    "Literatura Brasileira",
    "Clássicos",
    "Filosofia",
    "História",
    "Infantil",
    "Juvenil",
    "Educação",
    "Tecnologia",
    "Negócios",
    "Autoajuda",
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Bibliotecas</h2>
        <p className="text-muted-foreground">
          Descubra bibliotecas pessoais de outros usuários ou encontre bibliotecas físicas na sua região
        </p>
      </div>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="personal">Bibliotecas Pessoais</TabsTrigger>
          <TabsTrigger value="physical">Bibliotecas Físicas</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-6">
          {/* Search and Filters for Personal Libraries */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome, dono ou descrição..."
                  value={searchPersonal}
                  onChange={(e) => setSearchPersonal(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
            >
              Todas Categorias
            </Button>
            {personalCategories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Personal Libraries List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredPersonalLibraries.map((library) => (
              <Card key={library.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={library.owner.avatar || "/placeholder.svg"} alt={library.owner.name} />
                      <AvatarFallback>
                        {library.owner.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-lg">{library.name}</CardTitle>
                        {library.isPrivate && <Lock className="h-4 w-4 text-muted-foreground" />}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {library.owner.name} • {library.owner.location}
                      </p>
                      <div className="flex items-center gap-4 mt-1">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">{library.owner.rating}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{library.owner.totalBooks} livros</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{library.members} membros</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-primary">{library.distance}</p>
                      <p className="text-xs text-muted-foreground">de distância</p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{library.description}</p>

                  <div>
                    <p className="text-sm font-medium mb-2">Categorias:</p>
                    <div className="flex flex-wrap gap-1">
                      {library.categories.map((category, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-2">Livros recentes:</p>
                    <p className="text-sm text-muted-foreground">{library.recentBooks.join(", ")}</p>
                  </div>

                  <div className="flex gap-2 pt-2">
                    {library.isPrivate ? (
                      <Button className="flex-1" size="sm">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Solicitar Acesso
                      </Button>
                    ) : (
                      <Button className="flex-1" size="sm">
                        <Users className="h-4 w-4 mr-2" />
                        Entrar no Grupo
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      Ver Perfil
                    </Button>
                  </div>

                  {library.isPrivate && library.joinRequests > 0 && (
                    <div className="bg-muted p-3 rounded-lg">
                      <p className="text-sm">
                        <span className="font-medium">{library.joinRequests}</span> pessoas solicitaram acesso
                        recentemente
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="physical" className="space-y-6">
          {/* Search and Filters for Physical Libraries */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Digite seu endereço ou CEP..."
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button>
              <Navigation className="h-4 w-4 mr-2" />
              Usar Localização Atual
            </Button>
          </div>

          {/* Library Type Filters */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedType === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedType(null)}
            >
              Todas
            </Button>
            {libraryTypes.map((type) => (
              <Button
                key={type}
                variant={selectedType === type ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType(type)}
              >
                {type}
              </Button>
            ))}
          </div>

          {/* Physical Libraries List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredLibraries.map((library) => (
              <Card key={library.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{library.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary">{library.type}</Badge>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">{library.rating}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-primary">{library.distance}</p>
                      <p className="text-xs text-muted-foreground">de distância</p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <p className="text-sm">{library.address}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm">{library.hours}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm">{library.phone}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <a href={`https://${library.website}`} className="text-sm text-primary hover:underline">
                        {library.website}
                      </a>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-2">Recursos disponíveis:</p>
                    <div className="flex flex-wrap gap-1">
                      {library.features.map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button className="flex-1" size="sm">
                      <Navigation className="h-4 w-4 mr-2" />
                      Como Chegar
                    </Button>
                    <Button variant="outline" size="sm">
                      <Phone className="h-4 w-4 mr-2" />
                      Contato
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Map Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle>Mapa das Bibliotecas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">Mapa interativo será carregado aqui</p>
                  <p className="text-sm text-muted-foreground">Integração com Google Maps em desenvolvimento</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
