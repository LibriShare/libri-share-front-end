import { DashboardHeader } from "@/components/dashboard/header"
import { Sidebar } from "@/components/dashboard/sidebar"
import { LibraryGrid } from "@/components/dashboard/library-grid"
import { AddBookDialog } from "@/components/books/add-book-dialog"

export default function LibraryPage() {
  return (
    // Layout Flex de Altura Total (h-screen)
    <div className="flex h-screen bg-background w-full">
      
      {/* Sidebar fixa à esquerda */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Área de Conteúdo Principal (Cabeçalho + Página) */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <DashboardHeader />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Cabeçalho da Página Interna */}
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h1 className="text-3xl font-bold tracking-tight">Minha Biblioteca</h1>
                  <p className="text-muted-foreground">Gerencie sua coleção pessoal de livros</p>
                </div>
                
                <AddBookDialog />
            </div>

            <LibraryGrid />
          </div>
        </main>
      </div>
    </div>
  )
}