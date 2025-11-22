"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Plus, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  User, 
  Search, 
  MessageSquare, 
  Loader2, 
  Calendar,
  MoreHorizontal
} from "lucide-react"
import { format, isPast, parseISO } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

// --- Interfaces ---
interface Book {
  bookId: number
  title: string
  coverImageUrl: string
  author: string
}

interface Loan {
  id: number
  userBook: {
    book: {
      title: string
      coverImageUrl: string
      author: string
    }
  }
  borrowerName: string
  borrowerEmail: string
  loanDate: string
  dueDate: string
  returnDate?: string
  status: string // "ACTIVE" | "RETURNED"
  notes?: string
}

export function LoanManagement() {
  // --- Estados ---
  const [loans, setLoans] = useState<Loan[]>([])
  const [userBooks, setUserBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showNewLoanDialog, setShowNewLoanDialog] = useState(false)
  
  // Filtros
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("active")

  // Form States
  const [selectedBookId, setSelectedBookId] = useState("")
  const [borrowerName, setBorrowerName] = useState("")
  const [borrowerEmail, setBorrowerEmail] = useState("")
  const [borrowerPhone, setBorrowerPhone] = useState("") // Novo campo visual
  const [dueDate, setDueDate] = useState("")
  const [notes, setNotes] = useState("")

  const { toast } = useToast()
  const API_URL = process.env.NEXT_PUBLIC_API_URL
  const USER_ID = 1

  // --- Fetch Inicial ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [loansRes, booksRes] = await Promise.all([
          fetch(`${API_URL}/api/v1/users/${USER_ID}/loans`),
          fetch(`${API_URL}/api/v1/users/${USER_ID}/library`)
        ])

        if (loansRes.ok) setLoans(await loansRes.json())
        if (booksRes.ok) {
           const libraryData = await booksRes.json()
           // Precisamos mapear para extrair apenas infos do livro, pois o endpoint retorna UserBook
           const books = libraryData.map((item: any) => ({
             bookId: item.bookId,
             title: item.title,
             coverImageUrl: item.coverImageUrl,
             author: item.author
           }))
           setUserBooks(books)
        }
      } catch (error) {
        console.error("Erro:", error)
        toast({ title: "Erro de conexão", variant: "destructive" })
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [API_URL, toast])

  // --- Lógica de Negócio ---

  // Verifica se está atrasado (Status Ativo E Data de vencimento no passado)
  const isOverdue = (loan: Loan) => {
    return loan.status === 'ACTIVE' && isPast(parseISO(loan.dueDate)) && !isSameDay(parseISO(loan.dueDate), new Date())
  }

  const isSameDay = (d1: Date, d2: Date) => {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  }

// Filtragem Segura
  const filteredLoans = loans.filter(loan => {
    // Tratamento seguro para evitar erro se o dado vier nulo do banco
    const borrower = loan.borrowerName?.toLowerCase() || "";
    const bookTitle = loan.userBook?.book?.title?.toLowerCase() || "";
    const query = searchQuery.toLowerCase();

    // Verifica se o termo de busca existe no nome da pessoa OU no título do livro
    const matchesSearch = borrower.includes(query) || bookTitle.includes(query);

    if (!matchesSearch) return false

    if (activeTab === 'active') return loan.status === 'ACTIVE' && !isOverdue(loan)
    if (activeTab === 'overdue') return isOverdue(loan)
    if (activeTab === 'returned') return loan.status === 'RETURNED'
    
    return true // tab 'all'
  })

  // Estatísticas
  const stats = {
    active: loans.filter(l => l.status === 'ACTIVE' && !isOverdue(l)).length,
    overdue: loans.filter(l => isOverdue(l)).length,
    total: loans.length
  }

  // Handlers
  const handleNewLoan = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedBookId) {
        toast({ title: "Selecione um livro", variant: "destructive" })
        return
    }
    setSubmitting(true)
    try {
      const response = await fetch(`${API_URL}/api/v1/users/${USER_ID}/loans`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookId: Number(selectedBookId),
          borrowerName,
          borrowerEmail,
          dueDate: dueDate || undefined,
          notes // Enviando notas
        })
      })

      if (response.ok) {
        toast({ title: "Sucesso", description: "Empréstimo registrado!" })
        setShowNewLoanDialog(false)
        window.location.reload()
      } else {
        toast({ title: "Erro ao criar", variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "Erro de conexão", variant: "destructive" })
    } finally {
      setSubmitting(false)
    }
  }

  const handleReturnBook = async (loanId: number) => {
    try {
       const response = await fetch(`${API_URL}/api/v1/users/${USER_ID}/loans/${loanId}/return`, {
        method: "PATCH"
       })
       if (response.ok) {
         toast({ title: "Livro Devolvido!", description: "O status foi atualizado." })
         window.location.reload()
       }
    } catch (error) {
        console.error(error)
    }
  }

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-primary h-10 w-10" /></div>

  return (
    <div className="space-y-8">
        {/* Header da Página */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Gerenciar Empréstimos</h2>
                <p className="text-muted-foreground">Controle todos os seus empréstimos de livros</p>
            </div>
            <Dialog open={showNewLoanDialog} onOpenChange={setShowNewLoanDialog}>
                <DialogTrigger asChild>
                    <Button className="bg-primary hover:bg-primary/90 text-white">
                        <Plus className="mr-2 h-4 w-4"/> Novo Empréstimo
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Registrar Novo Empréstimo</DialogTitle>
                        <DialogDescription>Registre um novo empréstimo de livro</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleNewLoan} className="space-y-4 mt-4">
                        <div className="space-y-2">
                            <Label>Livro</Label>
                            <Select onValueChange={setSelectedBookId} value={selectedBookId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione um livro" />
                                </SelectTrigger>
                                <SelectContent>
                                    {userBooks.map((book) => (
                                        <SelectItem key={book.bookId} value={book.bookId.toString()}>
                                            {book.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Nome do Empréstário</Label>
                            <Input placeholder="Digite o nome completo" value={borrowerName} onChange={e => setBorrowerName(e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                            <Label>Email</Label>
                            <Input type="email" placeholder="email@exemplo.com" value={borrowerEmail} onChange={e => setBorrowerEmail(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Telefone (opcional)</Label>
                            <Input placeholder="(11) 99999-9999" value={borrowerPhone} onChange={e => setBorrowerPhone(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Data de Devolução</Label>
                            <Input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Observações (opcional)</Label>
                            <Input placeholder="Adicione observações..." value={notes} onChange={e => setNotes(e.target.value)} />
                        </div>
                        <div className="flex justify-end gap-2 pt-4">
                            <Button variant="outline" type="button" onClick={() => setShowNewLoanDialog(false)}>Cancelar</Button>
                            <Button type="submit" className="bg-primary text-white" disabled={submitting}>
                                {submitting ? "Registrando..." : "Registrar Empréstimo"}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>

        {/* Cards de Resumo (Stats) */}
        <div className="grid gap-4 md:grid-cols-3">
            <Card className="bg-card border-muted">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Empréstimos Ativos</CardTitle>
                    <Clock className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.active}</div>
                    <p className="text-xs text-muted-foreground">{stats.overdue} atrasado(s)</p>
                </CardContent>
            </Card>
            <Card className="bg-card border-muted">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Atrasados</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-red-500">{stats.overdue}</div>
                    <p className="text-xs text-muted-foreground">Requer atenção</p>
                </CardContent>
            </Card>
            <Card className="bg-card border-muted">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total de Empréstimos</CardTitle>
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.total}</div>
                    <p className="text-xs text-muted-foreground">Histórico completo</p>
                </CardContent>
            </Card>
        </div>

        {/* Barra de Ferramentas e Abas */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Buscar por livro ou pessoa..." 
                    className="pl-10 bg-card border-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            
            <Tabs defaultValue="active" className="w-full md:w-auto" onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4 md:w-auto">
                    <TabsTrigger value="active">Ativos ({stats.active})</TabsTrigger>
                    <TabsTrigger value="overdue">Atrasados ({stats.overdue})</TabsTrigger>
                    <TabsTrigger value="returned">Devolvidos</TabsTrigger>
                    <TabsTrigger value="all">Todos</TabsTrigger>
                </TabsList>
            </Tabs>
        </div>

        {/* Lista de Cards de Empréstimo */}
        <div className="grid gap-4">
            {filteredLoans.length === 0 ? (
                <div className="text-center py-16 border-2 border-dashed rounded-lg bg-muted/10">
                    <p className="text-muted-foreground">Nenhum empréstimo encontrado nesta categoria.</p>
                </div>
            ) : (
                filteredLoans.map((loan) => {
                    const overdue = isOverdue(loan)
                    
                    return (
                    <Card key={loan.id} className={`overflow-hidden transition-all hover:shadow-md ${overdue ? 'border-red-500/30 bg-red-500/5' : 'border-muted bg-card'}`}>
                        <CardContent className="p-0">
                            <div className="flex flex-col md:flex-row">
                                {/* Capa do Livro */}
                                <div className="relative w-full md:w-32 h-48 md:h-auto flex-shrink-0">
                                    <Image 
                                        src={loan.userBook?.book?.coverImageUrl || "/placeholder.svg"} 
                                        alt={loan.userBook?.book?.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                {/* Detalhes */}
                                <div className="flex-1 p-6 flex flex-col justify-between">
                                    <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-foreground mb-1">{loan.userBook?.book?.title}</h3>
                                            <div className="flex items-center gap-2 text-muted-foreground mb-2">
                                                <User className="h-4 w-4" />
                                                <span>{loan.borrowerName}</span>
                                            </div>
                                            <div className="text-sm text-muted-foreground space-y-1">
                                                <p>Emprestado em: {format(parseISO(loan.loanDate), "dd/MM/yyyy")}</p>
                                                <p className={`${overdue ? 'text-red-500 font-semibold' : ''}`}>
                                                    Vence em: {format(parseISO(loan.dueDate), "dd/MM/yyyy")}
                                                </p>
                                                {loan.borrowerEmail && <p className="text-primary/80">{loan.borrowerEmail}</p>}
                                            </div>
                                        </div>

                                        {/* Status Badge */}
                                        <div className="flex flex-col items-end gap-2">
                                            {loan.status === 'RETURNED' ? (
                                                <Badge className="bg-green-500/15 text-green-600 hover:bg-green-500/25 border-green-500/20 gap-1">
                                                    <CheckCircle2 className="h-3 w-3" /> Devolvido
                                                </Badge>
                                            ) : overdue ? (
                                                <Badge variant="destructive" className="gap-1">
                                                    <AlertTriangle className="h-3 w-3" /> Atrasado
                                                </Badge>
                                            ) : (
                                                <Badge className="bg-blue-500/15 text-blue-600 hover:bg-blue-500/25 border-blue-500/20 gap-1">
                                                    <Clock className="h-3 w-3" /> Ativo
                                                </Badge>
                                            )}
                                            
                                            {overdue && (
                                                <span className="text-xs text-red-500 font-medium">
                                                    {differenceInDays(new Date(), parseISO(loan.dueDate))} dias de atraso
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Ações */}
                                    <div className="flex justify-end gap-3 border-t pt-4 mt-2">
                                        <Button variant="outline" size="sm" className="gap-2">
                                            <MessageSquare className="h-4 w-4" /> Lembrar
                                        </Button>
                                        
                                        {loan.status === 'ACTIVE' && (
                                            <Button 
                                                size="sm" 
                                                className="bg-primary hover:bg-primary/90 text-white gap-2"
                                                onClick={() => handleReturnBook(loan.id)}
                                            >
                                                <CheckCircle2 className="h-4 w-4" /> 
                                                Marcar como Devolvido
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )})
            )}
        </div>
    </div>
  )
}