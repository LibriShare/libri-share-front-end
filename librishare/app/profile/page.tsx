import { DashboardHeader } from "@/components/dashboard/header"
import { Sidebar } from "@/components/dashboard/sidebar"
import { UserProfile } from "@/components/profile/user-profile"

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <div className="flex">
        <aside className="hidden lg:block border-r bg-card/50">
          <Sidebar />
        </aside>

        <main className="flex-1 px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <UserProfile />
          </div>
        </main>
      </div>
    </div>
  )
}
