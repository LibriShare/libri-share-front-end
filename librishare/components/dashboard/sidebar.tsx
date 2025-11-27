"use client"

import Link from "next/link"
import Image from "next/image"
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

  // --- CORREÇÃO AQUI ---
  // Verifica se é a rota exata OU se é uma sub-rota real (ex: /books/1 é sub de /books, mas /reading NÃO é sub de /read)
  const isActive = (href: string) => {
      if (href === "/dashboard") return pathname === "/dashboard"
      // A lógica abaixo garante que só ativa se for exato ou se tiver uma barra depois (ex: /read/123)
      return pathname === href || pathname.startsWith(`${href}/`)
  }

  const sidebarItems = [
    {
      title: "Biblioteca",
      items: [
        {
          title: "Dashboard",
          href: "/dashboard",
          icon: LayoutDashboard,
        },
        {
          title: "Minha Biblioteca",
          href: "/library",
          icon: Book,
          count: stats.totalBooks, 
        },
        {
          title: "Lendo Agora",
          href: "/reading",
          icon: Clock,
          count: stats.booksReading,
        },
        {
          title: "Livros Lidos",
          href: "/read",
          icon: CheckCircle,
          count: stats.booksRead,
        },
        {
          title: "Lista de Desejos",
          href: "/wishlist",
          icon: Heart,
          count: stats.booksToRead,
        },
        {
          title: "Empréstimos",
          href: "/loans",
          icon: Users,
          count: stats.activeLoans,
        },
      ],
    },
    {
      title: "Conta",
      items: [
        {
          title: "Perfil",
          href: "/profile",
          icon: User,
        },
        {
          title: "Configurações",
          href: "/settings",
          icon: Settings,
        },
      ],
    },
  ]

  return (
    <nav className="w-80 flex-shrink-0 border-r bg-card/95 h-full overflow-y-auto flex flex-col shadow-lg z-50">
      <div className="px-8 py-10 flex flex-col items-center gap-4 border-b border-border/40 mb-4">
          <div className="flex items-center gap-4">
            <div className="relative h-16 w-16 rounded-xl overflow-hidden shadow-md shrink-0">
                <Image 
                    src="/images/librishare-logo.png" 
                    alt="LibriShare" 
                    fill
                    className="object-cover"
                />
            </div>
            <div className="flex flex-col justify-center">
                <h1 className="text-3xl font-extrabold tracking-tight text-foreground leading-none">
                    LibriShare
                </h1>
                <p className="text-sm text-muted-foreground font-medium mt-1">
                    Sua biblioteca pessoal
                </p>
            </div>
          </div>
      </div>

      <div className="flex-1 px-6 space-y-8 py-4">
        {sidebarItems.map((group, i) => (
          <div key={i}>
            <h2 className="mb-4 px-2 text-xs font-bold uppercase tracking-widest text-muted-foreground/70">
              {group.title}
            </h2>
            <div className="space-y-1.5">
              {group.items.map((item, j) => (
                <Link key={j} href={item.href} className="block">
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start relative h-12 text-base font-medium transition-all duration-200",
                      isActive(item.href) 
                        ? "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary shadow-sm border border-primary/10" 
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <item.icon 
                        className={cn(
                            "mr-4 h-5 w-5 shrink-0",
                            isActive(item.href) ? "text-primary" : "text-muted-foreground"
                        )} 
                    />
                    <span className="flex-1 truncate text-left">{item.title}</span>
                    
                    {item.count !== undefined && item.count > 0 && (
                      <span className={cn(
                        "ml-auto text-xs font-bold rounded-full px-2.5 py-0.5 min-w-[1.5rem] text-center flex items-center justify-center",
                        isActive(item.href) 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-muted-foreground/20 text-foreground"
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
      
      <div className="p-6 text-xs text-muted-foreground/50 text-center border-t border-border/40 mt-auto">
        LibriShare v1.0.0
      </div>
    </nav>
  )
}