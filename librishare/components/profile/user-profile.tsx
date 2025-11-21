"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BookOpen,
  Users,
  Star,
  Calendar,
  MapPin,
  Mail,
  Phone,
  Edit,
  Heart,
  Clock,
  CheckCircle,
  TrendingUp,
  Shield,
  User,
  Building2,
  AlertCircle, // Importamos o ícone de alerta
} from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert" // Importamos o Alerta
import { Skeleton } from "@/components/ui/skeleton" // Importamos o Skeleton

// --- INTERFACES DO FRONT-END ---
interface UserStats {
  totalBooks: number
  booksRead: number
  currentlyReading: number
  wishlist: number
  friends: number
  reviews: number
  averageRating: number
  readingGoal: number
  booksThisYear: number
}

interface ReadingActivity {
  id: string
  type: "finished" | "started" | "reviewed" | "added"
  bookTitle: string
  bookCover: string
  date: Date
  rating?: number
  review?: string
}

interface SecurityInfo {
  cpf: string
  birthDate: string
  address: {
    street: string
    number: string
    complement?: string
    neighborhood: string
    city: string
    state: string
    zipCode: string
  }
}

interface UserProfile {
  name: string
  email: string
  phone: string
  bio: string
  accountType: "individual" | "library"
  joinDate: string // <- Nosso novo campo
  libraryName?: string
  cnpj?: string
  responsiblePerson?: string
}

// --- DTO DO BACK-END ---
// Mapeamento do DTO que vem da API
interface UserResponseDTO {
  id: number
  firstName: string
  lastName: string
  email: string
  cpf: string
  dateOfBirth: string 
  biography: string
  addressStreet: string
  addressCity: string
  addressState: string
  addressZip: string
  annualReadingGoal: number
  createdAt: string // <- Nosso novo campo
}

// --- DADOS MOCKADOS (Ainda usamos para o que não vem da API) ---
const mockStats: UserStats = {
  totalBooks: 247,
  booksRead: 89,
  currentlyReading: 3,
  wishlist: 23,
  friends: 34,
  reviews: 45,
  averageRating: 4.2,
  readingGoal: 50,
  booksThisYear: 18,
}

const mockActivity: ReadingActivity[] = [
  {
    id: "1",
    type: "finished",
    bookTitle: "Sapiens",
    bookCover: "/sapiens-book-cover-history.jpg",
    date: new Date(2024, 1, 15),
    rating: 5,
    review: "Livro incrível sobre a história da humanidade!",
  },
  // ... (outras atividades mockadas)
]


export function UserProfile() {
  const [stats] = useState<UserStats>(mockStats)
  const [activity] = useState<ReadingActivity[]>(mockActivity)
  
  // --- NOSSOS NOVOS ESTADOS ---
  const [profile, setProfile] = useState<UserProfile | null>(null) // Começa como nulo
  const [securityInfo, setSecurityInfo] = useState<SecurityInfo | null>(null) // Começa como nulo
  const [loading, setLoading] = useState(true) // Começa carregando
  const [error, setError] = useState<string | null>(null) // Começa sem erro
  // --- Fim dos novos estados ---

  const [isEditing, setIsEditing] = useState(false)
  const [isEditingSecurity, setIsEditingSecurity] = useState(false)

  // --- A MÁGICA DA INTEGRAÇÃO ACONTECE AQUI ---
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // 1. Pegamos a URL da API
        const API_URL = process.env.NEXT_PUBLIC_API_URL
        
        // 2. Chamamos o endpoint do back-end (ID 1 está fixo por enquanto)
        const response = await fetch(`${API_URL}/api/v1/users/1`) // Buscando Usuário 1
        
        if (!response.ok) {
          throw new Error(`Erro ${response.status}: Não foi possível buscar os dados do usuário.`)
        }
        
        const userData: UserResponseDTO = await response.json()

        // 3. Mapeamos os dados do DTO do back-end para as interfaces do front-end
        
        // Formata a data de criação
        const joinDate = new Date(userData.createdAt).toLocaleDateString("pt-BR", {
          month: "short",
          year: "numeric",
        });

        const userProfile: UserProfile = {
          name: `${userData.firstName} ${userData.lastName}`,
          email: userData.email,
          phone: "(11) 99999-9999", // Este campo não vem da API ainda
          bio: userData.biography || "Apaixonada por livros...",
          accountType: "individual", // Este campo não vem da API ainda
          // DADO REAL (NOVO):
          joinDate: joinDate.charAt(0).toUpperCase() + joinDate.slice(1).replace(".", ""),
        }
        
        const userInfoSeguranca: SecurityInfo = {
          cpf: userData.cpf,
          birthDate: userData.dateOfBirth,
          address: {
            street: userData.addressStreet || "",
            number: "42", // Este campo não vem da API ainda
            complement: "", // Este campo não vem da API ainda
            neighborhood: "Bairro", // Este campo não vem da API ainda
            city: userData.addressCity || "",
            state: userData.addressState || "",
            zipCode: userData.addressZip || "",
          },
        }

        // 4. Salvamos os dados REAIS nos estados
        setProfile(userProfile)
        setSecurityInfo(userInfoSeguranca)

      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProfileData()
  }, []) // O array vazio [] faz isso rodar só uma vez, quando o componente carrega

  // --- Lógica de renderização (o resto do arquivo) ---

  const readingProgress = (stats.booksThisYear / stats.readingGoal) * 100

  // (As funções getActivityIcon, getActivityText, renderStars continuam iguais)
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "finished":
        return <CheckCircle className="h-4 w-4 text-secondary" />
      case "started":
        return <Clock className="h-4 w-4 text-primary" />
      case "reviewed":
        return <Star className="h-4 w-4 text-yellow-500" />
      case "added":
        return <BookOpen className="h-4 w-4 text-accent-foreground" />
      default:
        return <BookOpen className="h-4 w-4" />
    }
  }

  const getActivityText = (activity: ReadingActivity) => {
    switch (activity.type) {
      case "finished":
        return "terminou de ler"
      case "started":
        return "começou a ler"
      case "reviewed":
        return "avaliou"
      case "added":
        return "adicionou à biblioteca"
      default:
        return "interagiu com"
    }
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-3 w-3 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
          />
        ))}
      </div>
    )
  }

  const handleSaveProfile = () => {
    setIsEditing(false)
    // TODO: Aqui faremos a chamada `PUT /api/v1/users/{id}` para salvar
    console.log("Profile saved:", profile)
  }

  const handleSaveSecurity = () => {
    setIsEditingSecurity(false)
    // TODO: Aqui faremos a chamada `PUT /api/v1/users/{id}` para salvar
    console.log("Security info saved:", securityInfo)
  }
  
  // --- TELAS DE CARREGAMENTO E ERRO ---

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <Skeleton className="h-20 w-20 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-64" />
                <Skeleton className="h-4 w-56" />
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Falha ao Carregar Perfil</AlertTitle>
        <AlertDescription>
          {error}
          <br />
          Verifique se o back-end está rodando e se o usuário com ID 1 existe (crie um no /signup se necessário).
        </AlertDescription>
      </Alert>
    )
  }
  
  if (!profile || !securityInfo) {
    return <p>Não foi possível carregar o perfil.</p>
  }

  // --- O SEU COMPONENTE ORIGINAL (agora com dados reais) ---
  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src="/diverse-user-avatars.png" alt={profile.name} />
                <AvatarFallback className="text-lg">{profile.accountType === "library" ? "LIB" : "MR"}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold">
                    {/* DADO REAL */}
                    {profile.accountType === "library" ? profile.libraryName || profile.name : profile.name}
                  </h1>
                  {profile.accountType === "library" ? (
                    <Building2 className="h-5 w-5 text-primary" />
                  ) : (
                    <User className="h-5 w-5 text-primary" />
                  )}
                </div>
                <p className="text-muted-foreground">
                  {profile.accountType === "library" ? "Biblioteca" : "Leitora apaixonada"}
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {/* DADO REAL */}
                    {securityInfo.address.city}, {securityInfo.address.state}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {/* DADO REAL (NOVO) */}
                    Membro desde {profile.joinDate}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1" />

            <div className="flex items-center gap-2">
              <Button size="sm" onClick={() => setIsEditing(!isEditing)}>
                <Edit className="h-4 w-4 mr-2" />
                {isEditing ? "Salvar" : "Editar Perfil"}
              </Button>
            </div>
          </div>

          {/* Bio */}
          <div className="mt-6">
            {isEditing ? (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="accountType">Tipo de Conta</Label>
                    <Select
                      value={profile.accountType}
                      onValueChange={(value: "individual" | "library") =>
                        setProfile({ ...profile, accountType: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="individual">Pessoa Física</SelectItem>
                        <SelectItem value="library">Biblioteca</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      {profile.accountType === "library" ? "Nome da Biblioteca" : "Nome Completo"}
                    </Label>
                    <Input
                      id="name"
                      value={profile.accountType === "library" ? profile.libraryName || "" : profile.name}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          [profile.accountType === "library" ? "libraryName" : "name"]: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                {profile.accountType === "library" && (
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="cnpj">CNPJ</Label>
                      <Input
                        id="cnpj"
                        value={profile.cnpj || ""}
                        onChange={(e) => setProfile({ ...profile, cnpj: e.target.value })}
                        placeholder="00.000.000/0000-00"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="responsiblePerson">Responsável</Label>
                      <Input
                        id="responsiblePerson"
                        value={profile.responsiblePerson || ""}
                        onChange={(e) => setProfile({ ...profile, responsiblePerson: e.target.value })}
                        placeholder="Nome do responsável"
                      />
                    </div>
                  </div>
                )}

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Biografia</Label>
                  <Textarea
                    id="bio"
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    rows={3}
                  />
                </div>

                <Button onClick={handleSaveProfile}>Salvar Alterações</Button>
              </div>
            ) : (
              <p className="text-muted-foreground">{profile.bio}</p> /* DADO REAL */
            )}
          </div>

          {/* Contact Info */}
          {!isEditing && (
            <div className="flex items-center gap-6 mt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Mail className="h-4 w-4" />
                {profile.email} {/* DADO REAL */}
              </div>
              <div className="flex items-center gap-1">
                <Phone className="h-4 w-4" />
                {profile.phone} {/* DADO REAL (mockado) */}
              </div>
              {profile.accountType === "library" && profile.responsiblePerson && (
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  Responsável: {profile.responsiblePerson}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats Grid (Ainda mockado, podemos integrar depois) */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Livros</CardTitle>
            <BookOpen className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBooks}</div>
            <p className="text-xs text-muted-foreground">
              {stats.booksRead} lidos • {stats.currentlyReading} lendo
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avaliação Média</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageRating}</div>
            <div className="flex items-center gap-2 mt-1">
              {renderStars(Math.round(stats.averageRating))}
              <span className="text-xs text-muted-foreground">({stats.reviews} avaliações)</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Meta de Leitura</CardTitle>
            <TrendingUp className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.booksThisYear}/{stats.readingGoal}
            </div>
            <div className="mt-2">
              <Progress value={readingProgress} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">{Math.round(readingProgress)}% da meta anual</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Amigos</CardTitle>
            <Users className="h-4 w-4 text-chart-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.friends}</div>
            <p className="text-xs text-muted-foreground">{stats.wishlist} na lista de desejos</p>
          </CardContent>
        </Card>
      </div>

      {/* Profile Tabs */}
      <Tabs defaultValue="activity" className="w-full">
        <TabsList>
          <TabsTrigger value="activity">Atividade Recente</TabsTrigger>
          <TabsTrigger value="library">Biblioteca</TabsTrigger>
          <TabsTrigger value="reviews">Avaliações</TabsTrigger>
          <TabsTrigger value="friends">Amigos</TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-2" />
            Segurança
          </TabsTrigger>
        </TabsList>

        {/* ... (As abas de Atividade, Biblioteca, Avaliações, Amigos continuam com dados mockados) ... */}
        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Atividade Recente</CardTitle>
              <CardDescription>Suas últimas interações com livros</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {activity.map((item) => (
                <div key={item.id} className="flex items-start gap-4 p-3 border rounded-lg">
                  <img
                    src={item.bookCover || "/placeholder.svg"}
                    alt={item.bookTitle}
                    className="w-12 h-16 object-cover rounded flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {getActivityIcon(item.type)}
                      <span className="text-sm">
                        Você {getActivityText(item)} <strong>{item.bookTitle}</strong>
                      </span>
                    </div>
                    {item.rating && <div className="flex items-center gap-2 mb-2">{renderStars(item.rating)}</div>}
                    {item.review && <p className="text-sm text-muted-foreground mb-2">"{item.review}"</p>}
                    <p className="text-xs text-muted-foreground">{item.date.toLocaleDateString("pt-BR")}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="library" className="space-y-4">
          {/* ... */}
        </TabsContent>
        <TabsContent value="reviews" className="space-y-4">
          {/* ... */}
        </TabsContent>
        <TabsContent value="friends" className="space-y-4">
          {/* ... */}
        </TabsContent>

        {/* ABA DE SEGURANÇA (AGORA COM DADOS REAIS) */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Informações de Segurança
              </CardTitle>
              <CardDescription>
                Dados necessários para empréstimos de livros. Essas informações são privadas e usadas apenas para
                segurança.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Dados Pessoais
                </h3>
                <Button variant="outline" size="sm" onClick={() => setIsEditingSecurity(!isEditingSecurity)}>
                  <Edit className="h-4 w-4 mr-2" />
                  {isEditingSecurity ? "Salvar" : "Editar"}
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF</Label>
                  <Input
                    id="cpf"
                    value={securityInfo.cpf} /* DADO REAL */
                    disabled={!isEditingSecurity}
                    onChange={(e) => {
                      setSecurityInfo({ ...securityInfo, cpf: e.target.value })
                    }}
                    placeholder="000.000.000-00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birthDate">Data de Nascimento</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={securityInfo.birthDate} /* DADO REAL */
                    disabled={!isEditingSecurity}
                    onChange={(e) => setSecurityInfo({ ...securityInfo, birthDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="street">Rua/Avenida</Label>
                  <Input
                    id="street"
                    value={securityInfo.address.street} /* DADO REAL */
                    disabled={!isEditingSecurity}
                    onChange={(e) =>
                      setSecurityInfo({
                        ...securityInfo,
                        address: { ...securityInfo.address, street: e.target.value },
                      })
                    }
                    placeholder="Nome da rua"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="number">Número</Label>
                  <Input
                    id="number"
                    value={securityInfo.address.number} /* DADO REAL (mockado) */
                    disabled={!isEditingSecurity}
                    onChange={(e) =>
                      setSecurityInfo({
                        ...securityInfo,
                        address: { ...securityInfo.address, number: e.target.value },
                      })
                    }
                    placeholder="123"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="complement">Complemento (opcional)</Label>
                  <Input
                    id="complement"
                    value={securityInfo.address.complement || ""} /* DADO REAL (mockado) */
                    disabled={!isEditingSecurity}
                    onChange={(e) =>
                      setSecurityInfo({
                        ...securityInfo,
                        address: { ...securityInfo.address, complement: e.target.value },
                      })
                    }
                    placeholder="Apto, casa, etc."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="neighborhood">Bairro</Label>
                  <Input
                    id="neighborhood"
                    value={securityInfo.address.neighborhood} /* DADO REAL (mockado) */
                    disabled={!isEditingSecurity}
                    onChange={(e) =>
                      setSecurityInfo({
                        ...securityInfo,
                        address: { ...securityInfo.address, neighborhood: e.target.value },
                      })
                    }
                    placeholder="Nome do bairro"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="city">Cidade</Label>
                  <Input
                    id="city"
                    value={securityInfo.address.city} /* DADO REAL */
                    disabled={!isEditingSecurity}
                    onChange={(e) =>
                      setSecurityInfo({
                        ...securityInfo,
                        address: { ...securityInfo.address, city: e.target.value },
                      })
                    }
                    placeholder="Nome da cidade"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">Estado</Label>
                  <Input
                    id="state"
                    value={securityInfo.address.state} /* DADO REAL */
                    disabled={!isEditingSecurity}
                    onChange={(e) =>
                      setSecurityInfo({
                        ...securityInfo,
                        address: { ...securityInfo.address, state: e.target.value },
                      })
                    }
                    placeholder="SP"
                    maxLength={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zipCode">CEP</Label>
                  <Input
                    id="zipCode"
                    value={securityInfo.address.zipCode} /* DADO REAL */
                    disabled={!isEditingSecurity}
                    onChange={(e) =>
                      setSecurityInfo({
                        ...securityInfo,
                        address: { ...securityInfo.address, zipCode: e.target.value },
                      })
                    }
                    placeholder="00000-000"
                  />
                </div>
              </div>

              {isEditingSecurity && <Button onClick={handleSaveSecurity}>Salvar Informações de Segurança</Button>}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}