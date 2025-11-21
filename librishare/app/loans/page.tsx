import { DashboardHeader } from "@/components/dashboard/header"
import { Sidebar } from "@/components/dashboard/sidebar"
import { LoanManagement } from "@/components/loans/loan-management"

export default function LoansPage() {
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
              <h1 className="text-3xl font-bold">Gerenciar Empréstimos</h1>
              <p className="text-muted-foreground">Controle todos os seus empréstimos de livros</p>
            </div>

            <LoanManagement />
          </div>
        </main>
      </div>
    </div>
  )
}
