import { DashboardHeader } from "@/components/dashboard/header"
import { Sidebar } from "@/components/dashboard/sidebar"
import { LibraryGrid } from "@/components/dashboard/library-grid"

export default function LibraryPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <div className="flex">
        <aside className="hidden lg:block border-r bg-card/50">
          <Sidebar />
        </aside>

        <main className="flex-1 px-4 py-8">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">Minha Biblioteca</h1>
              <p className="text-muted-foreground">Gerencie sua coleção pessoal de livros</p>
            </div>

            <LibraryGrid />
          </div>
        </main>
      </div>
    </div>
  )
}
