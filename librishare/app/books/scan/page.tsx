"use client"

import { DashboardHeader } from "@/components/dashboard/header"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Camera, Search, BookOpen } from "lucide-react"
import { useState } from "react"

export default function ScanISBNPage() {
  const [isScanning, setIsScanning] = useState(false)
  const [isbn, setIsbn] = useState("")

  const handleScan = () => {
    setIsScanning(true)
    // Simular escaneamento
    setTimeout(() => {
      setIsbn("9788535902778")
      setIsScanning(false)
    }, 2000)
  }

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
              <h1 className="text-3xl font-bold">Escanear ISBN</h1>
              <p className="text-muted-foreground">Adicione livros rapidamente escaneando o código ISBN</p>
            </div>

            <Tabs defaultValue="scan" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="scan">Escanear Código</TabsTrigger>
                <TabsTrigger value="manual">Inserir Manualmente</TabsTrigger>
              </TabsList>

              <TabsContent value="scan" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Camera className="h-5 w-5" />
                      Scanner de ISBN
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg">
                      {isScanning ? (
                        <div className="text-center space-y-4">
                          <div className="animate-pulse">
                            <Camera className="h-16 w-16 mx-auto text-primary" />
                          </div>
                          <p className="text-lg font-medium">Escaneando...</p>
                          <p className="text-sm text-muted-foreground">Posicione o código ISBN na câmera</p>
                        </div>
                      ) : (
                        <div className="text-center space-y-4">
                          <Camera className="h-16 w-16 mx-auto text-muted-foreground" />
                          <div>
                            <p className="text-lg font-medium">Pronto para escanear</p>
                            <p className="text-sm text-muted-foreground">Clique no botão abaixo para iniciar</p>
                          </div>
                          <Button onClick={handleScan} size="lg">
                            <Camera className="h-4 w-4 mr-2" />
                            Iniciar Scanner
                          </Button>
                        </div>
                      )}
                    </div>

                    {isbn && (
                      <Card className="bg-green-50 border-green-200">
                        <CardContent className="pt-6">
                          <div className="flex items-center gap-3">
                            <BookOpen className="h-5 w-5 text-green-600" />
                            <div>
                              <p className="font-medium text-green-800">ISBN detectado!</p>
                              <p className="text-sm text-green-600">{isbn}</p>
                            </div>
                          </div>
                          <Button className="mt-4 w-full" variant="default">
                            Adicionar à Biblioteca
                          </Button>
                        </CardContent>
                      </Card>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="manual" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Search className="h-5 w-5" />
                      Inserir ISBN Manualmente
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="manual-isbn">Código ISBN</Label>
                      <Input
                        id="manual-isbn"
                        placeholder="Digite o código ISBN (ex: 9788535902778)"
                        value={isbn}
                        onChange={(e) => setIsbn(e.target.value)}
                      />
                    </div>
                    <Button className="w-full" disabled={!isbn}>
                      <Search className="h-4 w-4 mr-2" />
                      Buscar Livro
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
