import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users, Clock, TrendingUp } from "lucide-react"

export function StatsCards() {
  const stats = [
    {
      title: "Total de Livros",
      value: "247",
      description: "+12 este mês",
      icon: BookOpen,
      color: "text-primary",
    },
    {
      title: "Livros Lidos",
      value: "89",
      description: "+5 este mês",
      icon: TrendingUp,
      color: "text-secondary",
    },
    {
      title: "Empréstimos Ativos",
      value: "8",
      description: "3 vencem esta semana",
      icon: Clock,
      color: "text-accent-foreground",
    },
    {
      title: "Amigos Conectados",
      value: "34",
      description: "+2 novos seguidores",
      icon: Users,
      color: "text-chart-4",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
