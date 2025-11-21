"use client"

import { DashboardHeader } from "@/components/dashboard/header"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, BookOpen, User } from "lucide-react"
import { useState } from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export default function NewLoanPage() {
  const [dueDate, setDueDate] = useState<Date>()

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <div className="flex">
        <aside className="hidden lg:block border-r bg-card/50">
          <Sidebar />
        </aside>

        <main className="flex-1 px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">Registrar Empréstimo</h1>
              <p className="text-muted-foreground">Registre um novo empréstimo de livro</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Novo Empréstimo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      Informações do Livro
                    </h3>

                    <div className="space-y-2">
                      <Label htmlFor="book">Selecionar Livro</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Escolha um livro da sua biblioteca" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="alquimista">O Alquimista - Paulo Coelho</SelectItem>
                          <SelectItem value="1984">1984 - George Orwell</SelectItem>
                          <SelectItem value="dom-casmurro">Dom Casmurro - Machado de Assis</SelectItem>
                          <SelectItem value="cem-anos">Cem Anos de Solidão - Gabriel García Márquez</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="condition">Estado do Livro</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o estado" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="novo">Novo</SelectItem>
                          <SelectItem value="otimo">Ótimo</SelectItem>
                          <SelectItem value="bom">Bom</SelectItem>
                          <SelectItem value="regular">Regular</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Informações do Mutuário
                    </h3>

                    <div className="space-y-2">
                      <Label htmlFor="borrower-name">Nome Completo</Label>
                      <Input id="borrower-name" placeholder="Digite o nome do mutuário" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="borrower-contact">Contato</Label>
                      <Input id="borrower-contact" placeholder="Telefone ou email" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="borrower-document">CPF</Label>
                      <Input id="borrower-document" placeholder="000.000.000-00" />
                    </div>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Data de Devolução</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dueDate ? format(dueDate, "PPP", { locale: ptBR }) : "Selecione a data"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deposit">Valor da Caução (opcional)</Label>
                    <Input id="deposit" placeholder="R$ 0,00" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Observações</Label>
                  <Textarea id="notes" placeholder="Adicione observações sobre o empréstimo (opcional)" rows={3} />
                </div>

                <div className="flex gap-4 pt-4">
                  <Button className="flex-1">Registrar Empréstimo</Button>
                  <Button variant="outline" className="flex-1 bg-transparent">
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
