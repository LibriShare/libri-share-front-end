import { DashboardHeader } from "@/components/dashboard/header"
import { Sidebar } from "@/components/dashboard/sidebar"
import { LoanManagement } from "@/components/loans/loan-management"

export default function LoansPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* Removemos o título daqui porque ele já está dentro do LoanManagement */}
            <LoanManagement />
          </div>
        </main>
      </div>
    </div>
  )
}