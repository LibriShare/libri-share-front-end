"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Trash2, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function SettingsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isDeleting, setIsDeleting] = useState(false)

  const API_URL = process.env.NEXT_PUBLIC_API_URL

  const handleDeleteAccount = async () => {
    const userId = localStorage.getItem("librishare_user_id")

    if (!userId) {
        toast({ title: "Erro", description: "Usuário não autenticado.", variant: "destructive" })
        return
    }

    setIsDeleting(true)
    try {
      const response = await fetch(`${API_URL}/api/v1/users/${userId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        localStorage.removeItem("librishare_user_id")
        
        toast({ title: "Conta excluída", description: "Sua conta foi removida permanentemente." })
        router.push("/")
      } else {
        toast({ title: "Erro", description: "Não foi possível excluir a conta.", variant: "destructive" })
      }
    } catch (error) {
      console.error("Erro ao excluir:", error)
      toast({ title: "Erro de conexão", variant: "destructive" })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="flex h-screen bg-background w-full">
      <div className="hidden lg:block">
        <Sidebar />
      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Configurações</h1>
              <p className="text-muted-foreground">Gerencie suas preferências da conta</p>
            </div>

            <div className="space-y-6">
              <Card className="border-red-900/50 bg-red-950/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-500">
                    <Trash2 className="h-5 w-5" />
                    Zona de Perigo
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Excluir Conta</Label>
                    <p className="text-sm text-muted-foreground">
                      Esta ação não pode ser desfeita. Todos os seus dados serão permanentemente removidos.
                    </p>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" disabled={isDeleting}>
                          {isDeleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                          Excluir Conta
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Essa ação não pode ser desfeita. Isso excluirá permanentemente sua conta, seus livros e seu histórico de leitura.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDeleteAccount} className="bg-red-600 hover:bg-red-700">
                            Sim, excluir minha conta
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}