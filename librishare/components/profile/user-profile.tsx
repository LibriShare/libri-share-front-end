"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog"
import {
  BookOpen,
  Star,
  Calendar,
  MapPin,
  Edit,
  Clock,
  CheckCircle,
  Shield,
  User,
  Building2,
  AlertCircle,
  Pencil,
  Loader2
} from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"

// --- INTERFACES ---
interface UserStats {
  totalBooks: number
  booksRead: number
  currentlyReading: number
  wishlist: number
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
  dateFormatted: string
  rating?: number
  review?: string
}

interface SecurityInfo {
  cpf: string
  birthDate: string
  address: {
    street: string
    number: string
    city: string
    state: string
    zipCode: string
  }
}

interface UserProfileData {
  firstName: string
  lastName: string
  email: string
  phone: string
  bio: string
  accountType: "individual" | "library"
  joinDate: string
}

export function UserProfile() {
  // --- ESTADOS ---
  const [profile, setProfile] = useState<UserProfileData | null>(null)
  const [securityInfo, setSecurityInfo] = useState<SecurityInfo | null>(null)
  const [activity, setActivity] = useState<ReadingActivity[]>([])
  
  const [stats, setStats] = useState<UserStats>({
    totalBooks: 0,
    booksRead: 0,
    currentlyReading: 0,
    wishlist: 0,
    reviews: 0,
    averageRating: 0,
    readingGoal: 0,
    booksThisYear: 0
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Modos de Edição
  const [isEditing, setIsEditing] = useState(false)
  const [isEditingSecurity, setIsEditingSecurity] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  
  // Modal de Meta
  const [isGoalDialogOpen, setIsGoalDialogOpen] = useState(false)
  const [newGoalValue, setNewGoalValue] = useState("")

  const { toast } = useToast()
  const API_URL = process.env.NEXT_PUBLIC_API_URL
  const USER_ID = 1

  // --- FETCH DADOS ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        const [userRes, libraryRes] = await Promise.all([
          fetch(`${API_URL}/api/v1/users/${USER_ID}`),
          fetch(`${API_URL}/api/v1/users/${USER_ID}/library`)
        ])

        if (!userRes.ok) throw new Error("Falha ao carregar usuário")
        
        const userData = await userRes.json()
        const libraryData = libraryRes.ok ? await libraryRes.json() : []

        // Processar Estatísticas
        const statsCalc = {
            totalBooks: libraryData.length,
            booksRead: libraryData.filter((b: any) => b.status === 'READ').length,
            currentlyReading: libraryData.filter((b: any) => b.status === 'READING').length,
            wishlist: libraryData.filter((b: any) => b.status === 'WANT_TO_READ').length,
            reviews: 0, 
            averageRating: 0,
            readingGoal: userData.annualReadingGoal || 12,
            booksThisYear: libraryData.filter((b: any) => b.status === 'READ').length
        }
        setStats(prev => ({...prev, ...statsCalc}))

        // Formatar Data
        let joinDateFormatted = "Data desconhecida"
        if (userData.createdAt) {
             const d = new Date(userData.createdAt)
             if(!isNaN(d.getTime())) {
               const str = d.toLocaleDateString("pt-BR", { month: "short", year: "numeric" })
               joinDateFormatted = str.charAt(0).toUpperCase() + str.slice(1).replace(".", "")
             }
        }

        // Setar Perfil
        setProfile({
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          email: userData.email,
          phone: "(11) 99999-9999", 
          bio: userData.biography || "Leitor(a) apaixonado(a).",
          accountType: "individual",
          joinDate: joinDateFormatted,
        })

        // Setar Segurança (Dados Pessoais)
        setSecurityInfo({
          cpf: userData.cpf || "",
          birthDate: userData.dateOfBirth || "",
          address: {
            street: userData.addressStreet || "",
            number: "S/N",
            city: userData.addressCity || "",
            state: userData.addressState || "",
            zipCode: userData.addressZip || "",
          },
        })

      } catch (err: any) {
        console.error(err)
        setError("Erro ao carregar perfil.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [API_URL])


  // --- SALVAR DADOS (PUT) ---
  const handleSaveAll = async () => {
    if (!profile || !securityInfo) return
    setIsSaving(true)

    // Monta o objeto completo que a API espera (UserRequestDTO)
    const payload = {
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        cpf: securityInfo.cpf,
        dateOfBirth: securityInfo.birthDate,
        biography: profile.bio,
        addressStreet: securityInfo.address.street,
        addressCity: securityInfo.address.city,
        addressState: securityInfo.address.state,
        addressZip: securityInfo.address.zipCode,
        annualReadingGoal: stats.readingGoal,
        // Não enviamos password, pois o backend agora trata null como "manter atual"
    }

    try {
        const response = await fetch(`${API_URL}/api/v1/users/${USER_ID}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })

        if (response.ok) {
            toast({ title: "Sucesso", description: "Dados atualizados com sucesso!" })
            setIsEditing(false)
            setIsEditingSecurity(false)
        } else {
            const err = await response.json()
            toast({ title: "Erro", description: err.message || "Falha ao salvar.", variant: "destructive" })
        }
    } catch (error) {
        toast({ title: "Erro", description: "Erro de conexão.", variant: "destructive" })
    } finally {
        setIsSaving(false)
    }
  }

  // Renderização segura
  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>
  if (error || !profile || !securityInfo) return <Alert variant="destructive"><AlertTitle>Erro</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>

  const readingProgress = stats.readingGoal > 0 ? Math.min(100, (stats.booksThisYear / stats.readingGoal) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20 border-2 border-border">
                <AvatarImage src="/diverse-user-avatars.png" />
                <AvatarFallback className="text-lg font-bold bg-muted">
                    {(profile.firstName || "U").charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold">
                    {profile.firstName} {profile.lastName}
                  </h1>
                  <User className="h-5 w-5 text-primary" />
                </div>
                <p className="text-muted-foreground">{profile.bio}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {securityInfo.address.city}, {securityInfo.address.state}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Membro desde {profile.joinDate}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1" />
            <Button size="sm" variant="outline" onClick={() => setIsEditing(!isEditing)}>
              <Edit className="h-4 w-4 mr-2" />
              {isEditing ? "Cancelar" : "Editar Perfil"}
            </Button>
          </div>

          {isEditing && (
             <div className="mt-4 p-4 border rounded-lg bg-muted/10 space-y-4 animate-in slide-in-from-top-2">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Nome</Label>
                        <Input value={profile.firstName} onChange={e => setProfile({...profile, firstName: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                        <Label>Sobrenome</Label>
                        <Input value={profile.lastName} onChange={e => setProfile({...profile, lastName: e.target.value})} />
                    </div>
                    <div className="space-y-2 col-span-2">
                        <Label>Bio</Label>
                        <Input value={profile.bio} onChange={e => setProfile({...profile, bio: e.target.value})} />
                    </div>
                </div>
                <Button onClick={handleSaveAll} disabled={isSaving}>{isSaving ? "Salvando..." : "Salvar Alterações"}</Button>
             </div>
          )}
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Livros</CardTitle>
            <BookOpen className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBooks}</div>
            <p className="text-xs text-muted-foreground">{stats.booksRead} lidos • {stats.currentlyReading} lendo</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Meta de Leitura</CardTitle>
            <Button variant="ghost" size="icon" className="h-6 w-6 -mr-2" onClick={() => setIsGoalDialogOpen(true)}>
                <Pencil className="h-3.5 w-3.5" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.booksThisYear} / {stats.readingGoal}</div>
            <Progress value={readingProgress} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
             <CardTitle className="text-sm font-medium">Lista de Desejos</CardTitle>
             <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
             <div className="text-2xl font-bold">{stats.wishlist}</div>
             <p className="text-xs text-muted-foreground">livros para comprar</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="activity" className="w-full">
        <TabsList>
          <TabsTrigger value="activity">Atividade</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
        </TabsList>

        <TabsContent value="activity" className="mt-6 text-center text-muted-foreground py-10">
            Sua atividade recente aparecerá aqui.
        </TabsContent>

        <TabsContent value="security" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Dados Pessoais</CardTitle>
                        <CardDescription>Edite seu CPF e endereço.</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setIsEditingSecurity(!isEditingSecurity)}>
                         {isEditingSecurity ? "Cancelar" : "Editar"}
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label>CPF</Label>
                        <Input 
                            value={securityInfo.cpf} 
                            disabled={!isEditingSecurity} 
                            onChange={e => setSecurityInfo({...securityInfo, cpf: e.target.value})} 
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Cidade</Label>
                        <Input 
                            value={securityInfo.address.city} 
                            disabled={!isEditingSecurity} 
                            onChange={e => setSecurityInfo({...securityInfo, address: {...securityInfo.address, city: e.target.value}})} 
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Endereço</Label>
                        <Input 
                            value={securityInfo.address.street} 
                            disabled={!isEditingSecurity} 
                            onChange={e => setSecurityInfo({...securityInfo, address: {...securityInfo.address, street: e.target.value}})} 
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>CEP</Label>
                        <Input 
                            value={securityInfo.address.zipCode} 
                            disabled={!isEditingSecurity} 
                            onChange={e => setSecurityInfo({...securityInfo, address: {...securityInfo.address, zipCode: e.target.value}})} 
                        />
                    </div>
                </div>
                {isEditingSecurity && (
                    <Button onClick={handleSaveAll} disabled={isSaving} className="mt-4">
                        {isSaving ? "Salvando..." : "Salvar Dados de Segurança"}
                    </Button>
                )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Modal de Meta */}
      <Dialog open={isGoalDialogOpen} onOpenChange={setIsGoalDialogOpen}>
        <DialogContent>
            <DialogHeader><DialogTitle>Meta de Leitura</DialogTitle></DialogHeader>
            <Input 
                type="number" 
                defaultValue={stats.readingGoal} 
                onChange={e => setStats({...stats, readingGoal: parseInt(e.target.value)})}
            />
            <DialogFooter><Button onClick={handleSaveAll}>Salvar</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}