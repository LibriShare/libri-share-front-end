"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { ArrowLeft, Save, BookOpen, Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import { useUserId } from "@/hooks/use-user-id" 

interface BookProgress {
  id: number
  title: string
  author: string
  cover: string
  totalPages: number
  currentPage: number
}

export default function UpdateProgressPage({ params }: { params: { id: string } }) {
  const [book, setBook] = useState<BookProgress | null>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  const router = useRouter()
  const { toast } = useToast()
  const { userId } = useUserId() 
  const API_URL = process.env.NEXT_PUBLIC_API_URL
  const userBookId = params.id

  useEffect(() => {
    if (!userId) return

    const fetchBookData = async () => {
      try {
        const response = await fetch(`${API_URL}/api/v1/users/${userId}/library`)
        
        if (response.ok) {
          const data = await response.json()
          const foundBook = data.find((item: any) => item.id === Number(userBookId))

          if (foundBook) {
            setBook({
              id: foundBook.id,
              title: foundBook.title,
              author: foundBook.author,
              cover: foundBook.coverImageUrl || "/placeholder.svg",
              totalPages: foundBook.totalPages || 300, 
              currentPage: foundBook.currentPage || 0
            })
            setCurrentPage(foundBook.currentPage || 0)
          } else {
            toast({ title: "Livro não encontrado", variant: "destructive" })
            router.push("/reading")
          }
        }
      } catch (error) {
        console.error("Erro ao carregar:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchBookData()
  }, [API_URL, userId, userBookId, router, toast])

  const handleSave = async () => {
    if (!userId) return
    setSaving(true)

    try {
      const response = await fetch(`${API_URL}/api/v1/users/${userId}/library/${userBookId}/progress`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            currentPage: currentPage 
        })
      })

      if (response.ok) {
        if (book && currentPage >= book.totalPages) {
            await fetch(`${API_URL}/api/v1/users/${userId}/library/${userBookId}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "READ" })
            })
            toast({ title: "Livro Concluído!", description: "Parabéns, você terminou a leitura." })
            router.push("/read") 
        } else {
            toast({ title: "Progresso salvo!" })
            router.push("/reading") 
        }
      } else {
        toast({ title: "Erro ao salvar", variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "Erro de conexão", variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  const handleSliderChange = (value: number[]) => {
    setCurrentPage(value[0])
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value)
    if (!isNaN(val) && book) {
      const cleanVal = Math.min(Math.max(val, 0), book.totalPages)
      setCurrentPage(cleanVal)
    }
  }

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>
  if (!book) return null

  const percentage = Math.round((currentPage / book.totalPages) * 100)

  return (
    <div className="min-h-screen bg-background flex flex-col p-6 items-center justify-center">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <div className="flex items-center gap-4 mb-4">
            <Link href="/reading">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
                <CardTitle>Atualizar Progresso</CardTitle>
                <CardDescription>Registre sua leitura de hoje</CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-8">
          <div className="flex gap-4 p-4 bg-muted/30 rounded-lg border">
             <div className="relative w-16 h-24 flex-shrink-0">
                <Image src={book.cover} alt={book.title} fill className="object-cover rounded shadow-sm" />
             </div>
             <div>
                <h3 className="font-bold text-lg leading-tight">{book.title}</h3>
                <p className="text-sm text-muted-foreground">{book.author}</p>
                <div className="flex items-center gap-2 mt-2 text-xs font-medium bg-primary/10 text-primary w-fit px-2 py-1 rounded">
                    <BookOpen className="h-3 w-3" />
                    {book.totalPages} páginas
                </div>
             </div>
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div className="space-y-1.5">
                    <Label htmlFor="pages">Página Atual</Label>
                    <Input 
                        id="pages" 
                        type="number" 
                        value={currentPage} 
                        onChange={handleInputChange}
                        className="w-24 text-lg font-bold"
                    />
                </div>
                <div className="text-right pb-1">
                    <span className="text-3xl font-bold text-primary">{percentage}%</span>
                    <span className="text-sm text-muted-foreground block">concluído</span>
                </div>
            </div>

            <Slider
              value={[currentPage]}
              max={book.totalPages}
              step={1}
              onValueChange={handleSliderChange}
              className="py-4"
            />
            
            <div className="flex justify-between text-xs text-muted-foreground px-1">
                <span>Página 0</span>
                <span>Página {book.totalPages}</span>
            </div>
          </div>

          <Button className="w-full" onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Salvar Progresso
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}