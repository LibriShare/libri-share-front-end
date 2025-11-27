import { Sidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Bell, Palette, Trash2 } from "lucide-react" // Removi Shield

export default function SettingsPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Configurações</h1>
              <p className="text-muted-foreground">Gerencie suas preferências da conta</p>
            </div>

            <div className="space-y-6">
            

              {/* Danger Zone */}
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
                    <Button variant="destructive">Excluir Conta</Button>
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