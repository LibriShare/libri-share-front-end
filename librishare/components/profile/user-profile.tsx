"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog"
import {
  BookOpen,
  Star,
  Calendar,
  // MapPin, // <-- REMOVIDO: Não precisamos mais importar o MapPin
  Edit,
  User,
  Pencil,
  Loader2,
  History,
  PlusCircle,
  ArrowRightLeft,
  CheckCircle2,
  Heart,
  Camera
} from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { format, parseISO } from "date-fns"
import { ptBR } from "date-fns/locale"

// ... (MANTENHA AS CONSTANTES E INTERFACES IGUAIS AQUI) ...
const AVATAR_OPTIONS = [
  "🦊", "🐱", "🐶", "🦁", "🐯", "🐨", "🐼", "🐸",
  "🐙", "🦄", "🐲", "👽", "🤖", "👻", "💀", "🤠",
  "👩‍🚀", "👨‍🚒", "🕵️‍♀️", "🧙‍♂️", "🧛‍♀️", "🧚‍♀️", "🧜‍♂️", "🧞‍♂️",
  "📚", "👓", "🎓", "💡", "🚀", "⭐", "🌙", "⚡"
]

interface UserStats {
  totalBooks: number
  booksRead: number
  currentlyReading: number
  wishlist: number
  readingGoal: number
  booksThisYear: number
}

interface HistoryItem {
  actionType: string
  description: string
  createdAt: string
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
  bio: string
  joinDate: string
  avatar: string
}

export function UserProfile() {
  // ... (MANTENHA TODOS OS ESTADOS E O USEEFFECT IGUAIS AQUI) ...
  const [profile, setProfile] = useState<UserProfileData | null>(null)
  const [securityInfo, setSecurityInfo] = useState<SecurityInfo | null>(null)
  const [activity, setActivity] = useState<HistoryItem[]>([])
  
  const [stats, setStats] = useState<UserStats>({
    totalBooks: 0,
    booksRead: 0,
    currentlyReading: 0,
    wishlist: 0,
    readingGoal: 0,
    booksThisYear: 0
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [isEditing, setIsEditing] = useState(false)
  const [isEditingSecurity, setIsEditingSecurity] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  
  const [isGoalDialogOpen, setIsGoalDialogOpen] = useState(false)
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false)

  const { toast } = useToast()
  const API_URL = process.env.NEXT_PUBLIC_API_URL
  const USER_ID = 1

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        const [userRes, libraryRes, historyRes] = await Promise.all([
          fetch(`${API_URL}/api/v1/users/${USER_ID}`),
          fetch(`${API_URL}/api/v1/users/${USER_ID}/library`),
          fetch(`${API_URL}/api/v1/users/${USER_ID}/history`)
        ])

        if (!userRes.ok) throw new Error("Falha ao carregar usuário")
        
        const userData = await userRes.json()
        const libraryData = libraryRes.ok ? await libraryRes.json() : []
        
        if (historyRes.ok) {
            setActivity(await historyRes.json())
        }

        const statsCalc = {
            totalBooks: libraryData.length,
            booksRead: libraryData.filter((b: any) => b.status === 'READ').length,
            currentlyReading: libraryData.filter((b: any) => b.status === 'READING').length,
            wishlist: libraryData.filter((b: any) => b.status === 'WANT_TO_READ').length,
            readingGoal: userData.annualReadingGoal || 12,
            booksThisYear: libraryData.filter((b: any) => b.status === 'READ').length
        }
        setStats(statsCalc)

        let joinDateFormatted = "Data desconhecida"
        if (userData.createdAt) {
             const d = new Date(userData.createdAt)
             if(!isNaN(d.getTime())) {
               const str = d.toLocaleDateString("pt-BR", { month: "short", year: "numeric" })
               joinDateFormatted = str.charAt(0).toUpperCase() + str.slice(1).replace(".", "")
             }
        }

        setProfile({
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          email: userData.email,
          bio: userData.biography || "Leitor(a) apaixonado(a).",
          joinDate: joinDateFormatted,
          avatar: userData.avatar || "🦊"
        })

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

  const handleSaveAll = async () => {
    if (!profile || !securityInfo) return
    setIsSaving(true)

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
        avatar: profile.avatar 
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
            setIsGoalDialogOpen(false)
            setIsAvatarDialogOpen(false)
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

  const handleAvatarSelect = (emoji: string) => {
      if(profile) {
          setProfile({ ...profile, avatar: emoji })
          setIsAvatarDialogOpen(false) 
      }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "LISTA DE DESEJOS": return <Heart className="h-4 w-4 text-rose-500" />
      case "BIBLIOTECA": return <PlusCircle className="h-4 w-4 text-emerald-500" />
      case "EMPRÉSTIMO": return <ArrowRightLeft className="h-4 w-4 text-orange-500" />
      case "DEVOLUÇÃO": return <CheckCircle2 className="h-4 w-4 text-blue-500" />
      case "LEITURA": return <BookOpen className="h-4 w-4 text-primary" />
      default: return <History className="h-4 w-4 text-muted-foreground" />
    }
  }

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>
  if (error || !profile || !securityInfo) return <Alert variant="destructive"><AlertTitle>Erro</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>

  const readingProgress = stats.readingGoal > 0 ? Math.min(100, (stats.booksThisYear / stats.readingGoal) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            
            {/* --- ÁREA DO AVATAR --- */}
            <div className="relative group">
                <Avatar className="h-24 w-24 border-4 border-muted bg-secondary cursor-pointer hover:opacity-90 transition-opacity">
                    <AvatarFallback className="text-4xl bg-transparent">
                        {profile.avatar || (profile.firstName || "U").charAt(0)}
                    </AvatarFallback>
                </Avatar>
                
                {/* --- MUDANÇA 1: Dialog só abre se isEditing for true --- */}
                <Dialog open={isAvatarDialogOpen} onOpenChange={setIsAvatarDialogOpen}>
                    {isEditing && (
                      <DialogTrigger asChild>
                          <Button 
                              size="icon" 
                              variant="secondary" 
                              className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full shadow-md border border-white dark:border-slate-900 opacity-100 transition-opacity"
                          >
                              <Camera className="h-4 w-4" />
                          </Button>
                      </DialogTrigger>
                    )}
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Escolha seu Avatar</DialogTitle>
                            <DialogDescription>Selecione um emoji para representar você.</DialogDescription>
                        </DialogHeader>
                        <div className="grid grid-cols-8 gap-2 py-4">
                            {AVATAR_OPTIONS.map((emoji) => (
                                <button
                                    key={emoji}
                                    onClick={() => handleAvatarSelect(emoji)}
                                    className={`text-2xl p-2 rounded-md hover:bg-muted transition-colors ${profile.avatar === emoji ? 'bg-primary/20 ring-2 ring-primary' : ''}`}
                                >
                                    {emoji}
                                </button>
                            ))}
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold">
                    {profile.firstName} {profile.lastName}
                  </h1>
                  <User className="h-5 w-5 text-primary" />
                </div>
                <p className="text-muted-foreground">{profile.bio}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                  {/* --- MUDANÇA 2: REMOVIDO DIV DE CIDADE, UF --- */}
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Membro desde {profile.joinDate}
                  </div>
                </div>
            </div>

            <div className="flex-1 md:flex-none" />
            
            <Button size="sm" variant="outline" onClick={() => setIsEditing(!isEditing)}>
              <Edit className="h-4 w-4 mr-2" />
              {isEditing ? "Cancelar" : "Editar Perfil"}
            </Button>
          </div>

          {/* ... (RESTANTE DO CÓDIGO PERMANECE IGUAL) ... */}
          {isEditing && (
             <div className="mt-6 p-4 border rounded-lg bg-muted/10 space-y-4 animate-in slide-in-from-top-2">
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

        <TabsContent value="activity" className="mt-6">
            <Card>
                <CardHeader>
                    <CardTitle>Histórico Recente</CardTitle>
                    <CardDescription>Suas últimas interações na plataforma</CardDescription>
                </CardHeader>
                <CardContent>
                    {activity.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">Nenhuma atividade registrada ainda.</p>
                    ) : (
                        <div className="space-y-4">
                            {activity.map((item, index) => (
                                <div key={index} className="flex items-start gap-4 border-b last:border-0 pb-4 last:pb-0">
                                    <div className="mt-1 bg-muted/50 p-2 rounded-full border">
                                        {getActivityIcon(item.actionType)}
                                    </div>
                                    <div className="space-y-1">
                                        <p className="font-medium text-sm">{item.description}</p>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <Calendar className="h-3 w-3" />
                                            {format(parseISO(item.createdAt), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
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