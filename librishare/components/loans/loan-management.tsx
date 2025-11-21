"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Plus, Clock, AlertTriangle, CheckCircle, User, CalendarIcon, Search, MessageSquare, Phone } from "lucide-react"
import { format, addDays, differenceInDays } from "date-fns"
import { ptBR } from "date-fns/locale"

interface Loan {
  id: string
  bookTitle: string
  bookCover: string
  borrowerName: string
  borrowerEmail: string
  borrowerPhone?: string
  loanDate: Date
  dueDate: Date
  returnDate?: Date
  status: "active" | "overdue" | "returned"
  notes?: string
}

const mockLoans: Loan[] = [
  {
    id: "1",
    bookTitle: "O Alquimista",
    bookCover: "/o-alquimista-book-cover.jpg",
    borrowerName: "João Silva",
    borrowerEmail: "joao@exemplo.com",
    borrowerPhone: "(11) 99999-9999",
    loanDate: new Date(2024, 1, 1),
    dueDate: new Date(2024, 1, 15),
    status: "overdue",
    notes: "Primeiro empréstimo para João",
  },
  {
    id: "2",
    bookTitle: "1984",
    bookCover: "/1984-book-cover-dystopian.jpg",
    borrowerName: "Ana Costa",
    borrowerEmail: "ana@exemplo.com",
    loanDate: new Date(2024, 1, 10),
    dueDate: addDays(new Date(), 5),
    status: "active",
  },
  {
    id: "3",
    bookTitle: "Dom Casmurro",
    bookCover: "/dom-casmurro-classic-book.jpg",
    borrowerName: "Carlos Mendes",
    borrowerEmail: "carlos@exemplo.com",
    loanDate: new Date(2024, 0, 15),
    dueDate: new Date(2024, 0, 29),
    returnDate: new Date(2024, 0, 28),
    status: "returned",
    notes: "Devolvido em perfeito estado",
  },
]

export function LoanManagement() {
  const [loans, setLoans] = useState<Loan[]>(mockLoans)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [showNewLoanDialog, setShowNewLoanDialog] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>()

  const filteredLoans = loans.filter((loan) => {
    const matchesSearch =
      loan.bookTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loan.borrowerName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || loan.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-primary/10 text-primary-foreground border-primary/20"
      case "overdue":
        return "bg-destructive/10 text-destructive-foreground border-destructive/20"
      case "returned":
        return "bg-secondary/10 text-secondary-foreground border-secondary/20"
      default:
        return "bg-muted"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Ativo"
      case "overdue":
        return "Atrasado"
      case "returned":
        return "Devolvido"
      default:
        return status
    }
  }

  const getStatusIcon = (loan: Loan) => {
    if (loan.status === "returned") {
      return <CheckCircle className="h-4 w-4 text-secondary" />
    }
    if (loan.status === "overdue") {
      return <AlertTriangle className="h-4 w-4 text-destructive" />
    }
    return <Clock className="h-4 w-4 text-primary" />
  }

  const getDaysUntilDue = (dueDate: Date) => {
    const days = differenceInDays(dueDate, new Date())
    if (days < 0) {
      return `${Math.abs(days)} dias atrasado`
    }
    if (days === 0) {
      return "Vence hoje"
    }
    return `${days} dias restantes`
  }

  const handleNewLoan = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle new loan creation
    setShowNewLoanDialog(false)
  }

  const handleReturnBook = (loanId: string) => {
    setLoans(
      loans.map((loan) =>
        loan.id === loanId ? { ...loan, status: "returned" as const, returnDate: new Date() } : loan,
      ),
    )
  }

  const activeLoans = loans.filter((loan) => loan.status === "active").length
  const overdueLoans = loans.filter((loan) => loan.status === "overdue").length
  const totalLoans = loans.length

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Empréstimos Ativos</CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeLoans}</div>
            <p className="text-xs text-muted-foreground">
              {overdueLoans > 0 && `${overdueLoans} atrasado${overdueLoans > 1 ? "s" : ""}`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Atrasados</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{overdueLoans}</div>
            <p className="text-xs text-muted-foreground">Requer atenção</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Empréstimos</CardTitle>
            <CheckCircle className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLoans}</div>
            <p className="text-xs text-muted-foreground">Histórico completo</p>
          </CardContent>
        </Card>
      </div>

      {/* Actions and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por livro ou pessoa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="active">Ativos</SelectItem>
              <SelectItem value="overdue">Atrasados</SelectItem>
              <SelectItem value="returned">Devolvidos</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Dialog open={showNewLoanDialog} onOpenChange={setShowNewLoanDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Empréstimo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Registrar Novo Empréstimo</DialogTitle>
              <DialogDescription>Registre um novo empréstimo de livro</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleNewLoan} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="book">Livro</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um livro" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alquimista">O Alquimista</SelectItem>
                    <SelectItem value="1984">1984</SelectItem>
                    <SelectItem value="dom-casmurro">Dom Casmurro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="borrower">Nome do Emprestário</Label>
                <Input id="borrower" placeholder="Digite o nome completo" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="email@exemplo.com" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone (opcional)</Label>
                <Input id="phone" placeholder="(11) 99999-9999" />
              </div>

              <div className="space-y-2">
                <Label>Data de Devolução</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP", { locale: ptBR }) : "Selecione a data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Observações (opcional)</Label>
                <Input id="notes" placeholder="Adicione observações sobre o empréstimo" />
              </div>

              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setShowNewLoanDialog(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Registrar Empréstimo</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Loans List */}
      <Tabs defaultValue="active" className="w-full">
        <TabsList>
          <TabsTrigger value="active">Ativos ({activeLoans})</TabsTrigger>
          <TabsTrigger value="overdue">Atrasados ({overdueLoans})</TabsTrigger>
          <TabsTrigger value="all">Todos ({totalLoans})</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {filteredLoans
            .filter((loan) => loan.status === "active")
            .map((loan) => (
              <LoanCard key={loan.id} loan={loan} onReturn={handleReturnBook} />
            ))}
        </TabsContent>

        <TabsContent value="overdue" className="space-y-4">
          {filteredLoans
            .filter((loan) => loan.status === "overdue")
            .map((loan) => (
              <LoanCard key={loan.id} loan={loan} onReturn={handleReturnBook} />
            ))}
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          {filteredLoans.map((loan) => (
            <LoanCard key={loan.id} loan={loan} onReturn={handleReturnBook} />
          ))}
        </TabsContent>
      </Tabs>

      {filteredLoans.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenhum empréstimo encontrado</p>
            <p className="text-sm">Tente ajustar os filtros ou registre um novo empréstimo</p>
          </div>
        </div>
      )}
    </div>
  )
}

interface LoanCardProps {
  loan: Loan
  onReturn: (loanId: string) => void
}

function LoanCard({ loan, onReturn }: LoanCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-primary/10 text-primary-foreground border-primary/20"
      case "overdue":
        return "bg-destructive/10 text-destructive-foreground border-destructive/20"
      case "returned":
        return "bg-secondary/10 text-secondary-foreground border-secondary/20"
      default:
        return "bg-muted"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Ativo"
      case "overdue":
        return "Atrasado"
      case "returned":
        return "Devolvido"
      default:
        return status
    }
  }

  const getStatusIcon = (loan: Loan) => {
    if (loan.status === "returned") {
      return <CheckCircle className="h-4 w-4 text-secondary" />
    }
    if (loan.status === "overdue") {
      return <AlertTriangle className="h-4 w-4 text-destructive" />
    }
    return <Clock className="h-4 w-4 text-primary" />
  }

  const getDaysUntilDue = (dueDate: Date) => {
    const days = differenceInDays(dueDate, new Date())
    if (days < 0) {
      return `${Math.abs(days)} dias atrasado`
    }
    if (days === 0) {
      return "Vence hoje"
    }
    return `${days} dias restantes`
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <img
            src={loan.bookCover || "/placeholder.svg"}
            alt={loan.bookTitle}
            className="w-16 h-20 object-cover rounded flex-shrink-0"
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-lg truncate">{loan.bookTitle}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{loan.borrowerName}</span>
                </div>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <span>Emprestado em {format(loan.loanDate, "dd/MM/yyyy")}</span>
                  <span>•</span>
                  <span>Vence em {format(loan.dueDate, "dd/MM/yyyy")}</span>
                </div>
                {loan.returnDate && (
                  <div className="text-sm text-muted-foreground mt-1">
                    Devolvido em {format(loan.returnDate, "dd/MM/yyyy")}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="text-right">
                  <Badge variant="outline" className={`${getStatusColor(loan.status)} mb-2`}>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(loan)}
                      {getStatusLabel(loan.status)}
                    </div>
                  </Badge>
                  {loan.status !== "returned" && (
                    <div
                      className={`text-xs ${loan.status === "overdue" ? "text-destructive" : "text-muted-foreground"}`}
                    >
                      {getDaysUntilDue(loan.dueDate)}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {loan.notes && (
              <div className="mt-3 p-2 bg-muted/50 rounded text-sm">
                <strong>Observações:</strong> {loan.notes}
              </div>
            )}

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>{loan.borrowerEmail}</span>
                {loan.borrowerPhone && (
                  <>
                    <span>•</span>
                    <span>{loan.borrowerPhone}</span>
                  </>
                )}
              </div>

              {loan.status !== "returned" && (
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Lembrar
                  </Button>
                  {loan.borrowerPhone && (
                    <Button variant="outline" size="sm">
                      <Phone className="h-4 w-4 mr-1" />
                      Ligar
                    </Button>
                  )}
                  <Button size="sm" onClick={() => onReturn(loan.id)}>
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Marcar como Devolvido
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
