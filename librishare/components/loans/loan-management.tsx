"use client"

import React, { useState, useEffect, useCallback } from "react"
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
  Calendar as CalendarIcon,
  Mail,
  RefreshCcw
} from "lucide-react"
import { format, isPast, parseISO, differenceInDays } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

// --- Interfaces ---
interface BookOption {
  bookId: number
  title: string
  author?: string 
}

interface Loan {
  id: number
  bookId: number       
  bookTitle: string   
  bookAuthor?: string // Tornado opcional para evitar quebra se o backend não enviar
  bookCoverUrl: string 
  borrowerName: string
  borrowerEmail: string
  loanDate: string
  dueDate: string
  returnDate?: string
  status: string 
  notes?: string
}

export function LoanManagement() {
  // --- Estados ---
  const [loans, setLoans] = useState<Loan[]>([])
  const [availableBooks, setAvailableBooks] = useState<BookOption[]>([])
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
  const [dueDate, setDueDate] = useState("")
  const [notes, setNotes] = useState("")

  const { toast } = useToast()
  const API_URL = process.env.NEXT_PUBLIC_API_URL
  const USER_ID = 1

  // Função de busca isolada para permitir recarregamento manual
  const fetchLoans = useCallback(async () => {
    setLoading(true)
    try {
      // Adicionado headers para evitar cache do navegador
      const response = await fetch(`${API_URL}/api/v1/users/${USER_ID}/loans`, {
        headers: { 'Cache-Control': 'no-cache' } 
      })
      if (response.ok) {
        const data = await response.json()
        setLoans(data)
      }
    } catch (error) {
      console.error("Erro ao buscar empréstimos:", error)
      toast({ title: "Erro de conexão", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }, [API_URL, USER_ID, toast])

  // --- Fetch Inicial ---
  useEffect(() => {
    const fetchInitialData = async () => {
      await fetchLoans()
      
      // Buscar livros disponíveis para empréstimo
      try {
        const libraryRes = await fetch(`${API_URL}/api/v1/users/${USER_ID}/library`)
        if (libraryRes.ok) {
           const libraryData = await libraryRes.json()
           const myBooks = libraryData
                .filter((item: any) => item.status !== 'WANT_TO_READ')
                .map((item: any) => ({
                    bookId: item.bookId,
                    title: item.title,
                    author: item.author
                }))
           setAvailableBooks(myBooks)
        }
      } catch (error) {
        console.error("Erro ao buscar biblioteca:", error)
      }
    }
    fetchInitialData()
  }, [fetchLoans, API_URL, USER_ID])

  // --- Lógica de Negócio ---

  const isOverdue = (loan: Loan) => {
    if (!loan.dueDate) return false
    return loan.status === 'ACTIVE' && 
           isPast(parseISO(loan.dueDate)) && 
           new Date().toISOString().split('T')[0] !== loan.dueDate
  }

  const filteredLoans = loans.filter(loan => {
    // Proteção contra valores nulos/undefined
    const borrower = loan.borrowerName?.toLowerCase() || "";
    const bookTitle = loan.bookTitle?.toLowerCase() || ""; 
    const query = searchQuery.toLowerCase();

    const matchesSearch = borrower.includes(query) || bookTitle.includes(query);
    if (!matchesSearch) return false

    if (activeTab === 'active') return loan.status === 'ACTIVE' && !isOverdue(loan)
    if (activeTab === 'overdue') return isOverdue(loan)
    if (activeTab === 'returned') return loan.status === 'RETURNED'
    
    return true 
  })

  const stats = {
    active: loans.filter(l => l.status === 'ACTIVE' && !isOverdue(l)).length,
    overdue: loans.filter(l => isOverdue(l)).length,
    total: loans.length
  }

  // --- Handlers ---

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
          notes
        })
      })

      if (response.ok) {
        toast({ title: "Sucesso", description: "Empréstimo registrado!" })
        setShowNewLoanDialog(false)
        setBorrowerName("")
        setBorrowerEmail("")
        setDueDate("")
        setNotes("")
        setSelectedBookId("")
        fetchLoans() // Recarrega a lista sem reload da página
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
         fetchLoans()
       }
    } catch (error) {
        console.error(error)
        toast({ title: "Erro", variant: "destructive" })
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
            <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={() => fetchLoans()} title="Atualizar lista">
                    <RefreshCcw className="h-4 w-4" />
                </Button>
                <Dialog open={showNewLoanDialog} onOpenChange={setShowNewLoanDialog}>
                    <DialogTrigger asChild>
                        <Button className="bg-primary hover:bg-primary/90 text-white">
                            <Plus className="mr-2 h-4 w-4"/> Novo Empréstimo
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>Registrar Novo Empréstimo</DialogTitle>
                            <DialogDescription>Preencha os dados abaixo</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleNewLoan} className="space-y-4 mt-4">
                            <div className="space-y-2">
                                <Label>Qual livro será emprestado?</Label>
                                <Select onValueChange={setSelectedBookId} value={selectedBookId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione um livro..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableBooks.map((book) => (
                                            <SelectItem key={book.bookId} value={book.bookId.toString()}>
                                                {book.title}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Quem vai pegar?</Label>
                                <Input placeholder="Nome completo" value={borrowerName} onChange={e => setBorrowerName(e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <Label>Email de contato</Label>
                                <Input type="email" placeholder="email@exemplo.com" value={borrowerEmail} onChange={e => setBorrowerEmail(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>Data Limite de Devolução</Label>
                                <Input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>Observações</Label>
                                <Input placeholder="Ex: Cuidar da capa..." value={notes} onChange={e => setNotes(e.target.value)} />
                            </div>
                            <div className="flex justify-end gap-2 pt-4">
                                <Button variant="outline" type="button" onClick={() => setShowNewLoanDialog(false)}>Cancelar</Button>
                                <Button type="submit" disabled={submitting}>
                                    {submitting ? <Loader2 className="h-4 w-4 animate-spin"/> : "Confirmar"}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </div>

        {/* Cards de Resumo */}
        <div className="grid gap-4 md:grid-cols-3">
            <Card className="bg-card border-muted">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Empréstimos Ativos</CardTitle>
                    <Clock className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.active}</div>
                </CardContent>
            </Card>
            <Card className="bg-card border-muted">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Atrasados</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-red-500">{stats.overdue}</div>
                </CardContent>
            </Card>
            <Card className="bg-card border-muted">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Histórico</CardTitle>
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.total}</div>
                </CardContent>
            </Card>
        </div>

        {/* Filtros e Lista */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Buscar por livro ou pessoa..." 
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            
            <Tabs defaultValue="active" className="w-full md:w-auto" onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4 md:w-auto">
                    <TabsTrigger value="active">Ativos</TabsTrigger>
                    <TabsTrigger value="overdue">Atrasados</TabsTrigger>
                    <TabsTrigger value="returned">Devolvidos</TabsTrigger>
                    <TabsTrigger value="all">Todos</TabsTrigger>
                </TabsList>
            </Tabs>
        </div>

        <div className="grid gap-4">
            {filteredLoans.length === 0 ? (
                <div className="text-center py-16 border-2 border-dashed rounded-lg bg-muted/10">
                    <p className="text-muted-foreground">Nenhum empréstimo encontrado nesta categoria.</p>
                </div>
            ) : (
                filteredLoans.map((loan) => {
                    const overdue = isOverdue(loan)
                    
                    return (
                    <Card key={loan.id} className={`overflow-hidden transition-all hover:border-primary/50 ${overdue ? 'border-red-500/30 bg-red-500/5' : ''}`}>
                        <CardContent className="p-0">
                            <div className="flex flex-col sm:flex-row">
                                {/* --- CAPA DO LIVRO --- */}
                                <div className="relative w-full sm:w-32 h-48 sm:h-auto flex-shrink-0 bg-transparent flex items-center justify-center sm:ml-2 sm:my-2">
                                    <div className="relative w-24 h-36 shadow-sm">
                                        <Image 
                                            src={loan.bookCoverUrl || "/placeholder.svg"} 
                                            alt={loan.bookTitle}
                                            fill
                                            className="object-contain rounded-sm"
                                        />
                                    </div>
                                </div>

                                {/* --- DETALHES --- */}
                                <div className="flex-1 p-6 flex flex-col justify-between">
                                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-foreground mb-1">{loan.bookTitle}</h3>
                                            
                                            {/* Renderiza autor apenas se existir */}
                                            {loan.bookAuthor && (
                                              <p className="text-sm text-muted-foreground mb-2">{loan.bookAuthor}</p>
                                            )}
                                            
                                            <div className="flex items-center gap-2 mt-3">
                                                <User className="h-4 w-4 text-muted-foreground" />
                                                <span className="font-medium">{loan.borrowerName}</span>
                                            </div>
                                            
                                            {loan.borrowerEmail && (
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                                    <Mail className="h-3 w-3" />
                                                    <span>{loan.borrowerEmail}</span>
                                                </div>
                                            )}

                                            <div className="mt-4 space-y-1 text-sm">
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <CalendarIcon className="h-3 w-3" />
                                                    Emprestado em: {format(parseISO(loan.loanDate), "dd/MM/yyyy")}
                                                </div>
                                                <div className={`flex items-center gap-2 ${overdue ? 'text-red-500 font-bold' : 'text-muted-foreground'}`}>
                                                    <Clock className="h-3 w-3" />
                                                    Vence em: {format(parseISO(loan.dueDate), "dd/MM/yyyy")}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Status Badge */}
                                        <div className="flex flex-col items-end gap-2">
                                            {loan.status === 'RETURNED' ? (
                                                <Badge className="bg-green-500/15 text-green-600 border-green-500/20 hover:bg-green-500/25">
                                                    Devolvido
                                                </Badge>
                                            ) : overdue ? (
                                                <Badge variant="destructive">
                                                    Atrasado ({differenceInDays(new Date(), parseISO(loan.dueDate))} dias)
                                                </Badge>
                                            ) : (
                                                <Badge variant="secondary" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                                                    Ativo
                                                </Badge>
                                            )}
                                        </div>
                                    </div>

                                    {/* Ações */}
                                    <div className="flex justify-end gap-3 border-t pt-4 mt-2">
                                        <Button variant="outline" size="sm" className="gap-2">
                                            <MessageSquare className="h-4 w-4" /> Cobrar
                                        </Button>
                                        
                                        {loan.status === 'ACTIVE' && (
                                            <Button 
                                                size="sm" 
                                                className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
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