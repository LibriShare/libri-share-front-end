import { DashboardHeader } from "@/components/dashboard/header"
import { Sidebar } from "@/components/dashboard/sidebar"
import { UserProfile } from "@/components/profile/user-profile"

export default function ProfilePage() {
  return (
    <div className="flex h-screen bg-background w-full">
      
      {/* Sidebar fixa à esquerda */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Área de Conteúdo */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <DashboardHeader />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto">
            <UserProfile />
          </div>
        </main>
      </div>
    </div>
  )
}