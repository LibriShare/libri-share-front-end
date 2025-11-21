"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Clock, CheckCircle, Heart, Users, Settings, Plus, Home, User } from "lucide-react"
import { AddBookDialog } from "@/components/books/add-book-dialog"
import { cn } from "@/lib/utils"

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Home,
      count: null,
      href: "/dashboard",
    },
    {
      id: "library",
      label: "Minha Biblioteca",
      icon: BookOpen,
      count: 247,
      href: "/library",
    },
    {
      id: "reading",
      label: "Lendo Agora",
      icon: Clock,
      count: 3,
      href: "/reading",
    },
    {
      id: "read",
      label: "Livros Lidos",
      icon: CheckCircle,
      count: 89,
      href: "/read",
    },
    {
      id: "wishlist",
      label: "Lista de Desejos",
      icon: Heart,
      count: 23,
      href: "/wishlist",
    },
    {
      id: "loans",
      label: "Empréstimos",
      icon: Users,
      count: 8,
      href: "/loans",
    },
  ]

  const communityItems = [
    {
      id: "community",
      label: "LibriConnect",
      icon: Users,
      count: null,
      href: "/community",
    },
  ]

  return (
    <div className={cn("pb-12 w-64", className)}>
      <div className="space-y-4 py-4">
        {/* Quick Actions */}
        <div className="px-3 py-2">
          <AddBookDialog
            trigger={
              <Button className="w-full justify-start" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Livro
              </Button>
            }
          />
        </div>

        {/* Main Navigation */}
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Biblioteca</h2>
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link key={item.id} href={item.href}>
                  <Button variant={isActive ? "secondary" : "ghost"} className="w-full justify-start">
                    <Icon className="mr-2 h-4 w-4" />
                    {item.label}
                    {item.count && (
                      <Badge variant="secondary" className="ml-auto">
                        {item.count}
                      </Badge>
                    )}
                  </Button>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Community Section */}
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Social</h2>
          <div className="space-y-1">
            {communityItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link key={item.id} href={item.href}>
                  <Button variant={isActive ? "secondary" : "ghost"} className="w-full justify-start">
                    <Icon className="mr-2 h-4 w-4" />
                    {item.label}
                    {item.count && (
                      <Badge variant="secondary" className="ml-auto">
                        {item.count}
                      </Badge>
                    )}
                  </Button>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Settings */}
        <div className="px-3 py-2">
          <Link href="/profile">
            <Button variant={pathname === "/profile" ? "secondary" : "ghost"} className="w-full justify-start mb-2">
              <User className="mr-2 h-4 w-4" />
              Perfil
            </Button>
          </Link>
          <Link href="/settings">
            <Button variant={pathname === "/settings" ? "secondary" : "ghost"} className="w-full justify-start">
              <Settings className="mr-2 h-4 w-4" />
              Configurações
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
