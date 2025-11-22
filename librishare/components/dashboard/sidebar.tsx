"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { 
  LayoutDashboard, 
  Book, 
  Clock, 
  CheckCircle, 
  Heart, 
  Users, 
  Settings, 
  User 
} from "lucide-react"
import { useEffect, useState } from "react"

interface LibraryStats {
  totalBooks: number
  booksRead: number
  booksReading: number
  booksToRead: number
  activeLoans: number
}

export function Sidebar() {
  const pathname = usePathname()
  const [stats, setStats] = useState<LibraryStats>({
    totalBooks: 0,
    booksRead: 0,
    booksReading: 0,
    booksToRead: 0,
    activeLoans: 0
  })

  const API_URL = process.env.NEXT_PUBLIC_API_URL
  const USER_ID = 1 

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${API_URL}/api/v1/users/${USER_ID}/library/stats`)
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error("Erro ao buscar estatísticas:", error)
      }
    }

    fetchStats()
  }, [API_URL])

  const sidebarItems = [
    {
      title: "Biblioteca",
      items: [
        {
          title: "Dashboard",
          href: "/dashboard",
          icon: LayoutDashboard,
          variant: "default",
        },
        {
          title: "Minha Biblioteca",
          href: "/library",
          icon: Book,
          variant: "ghost",
          count: stats.totalBooks, 
        },
        {
          title: "Lendo Agora",
          href: "/reading",
          icon: Clock,
          variant: "ghost",
          count: stats.booksReading,
        },
        {
          title: "Livros Lidos",
          href: "/read",
          icon: CheckCircle,
          variant: "ghost",
          count: stats.booksRead,
        },
        {
          title: "Lista de Desejos",
          href: "/wishlist",
          icon: Heart,
          variant: "ghost",
          count: stats.booksToRead,
        },
        {
          title: "Empréstimos",
          href: "/loans",
          icon: Users,
          variant: "ghost",
          count: stats.activeLoans,
        },
      ],
    },
    {
      title: "Conta", // Nome alterado de "Social" para "Conta"
      items: [
        {
          title: "Perfil",
          href: "/profile",
          icon: User,
          variant: "ghost",
        },
        {
          title: "Configurações",
          href: "/settings",
          icon: Settings,
          variant: "ghost",
        },
      ],
    },
  ]

  return (
    <nav className="pb-12 w-64 flex-shrink-0 border-r bg-card/50 h-screen overflow-y-auto">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          {sidebarItems.map((group, i) => (
            <div key={i} className="mb-8">
              <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">{group.title}</h2>
              <div className="space-y-1">
                {group.items.map((item, j) => (
                  <Link key={j} href={item.href}>
                    <Button
                      variant={pathname === item.href ? "secondary" : "ghost"}
                      className={cn("w-full justify-start relative", pathname === item.href && "bg-secondary")}
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.title}
                      {item.count !== undefined && (
                        <span className={cn(
                          "ml-auto text-xs rounded-full px-2 py-0.5",
                          pathname === item.href 
                            ? "bg-background text-foreground" 
                            : "bg-primary/10 text-primary"
                        )}>
                          {item.count}
                        </span>
                      )}
                    </Button>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </nav>
  )
}