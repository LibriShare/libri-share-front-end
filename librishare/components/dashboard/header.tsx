"use client"

// O Header agora é minimalista, pois a Logo foi movida para a Sidebar
export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 h-16 border-b md:border-b-0">
        {/* Mantemos o header vazio ou com itens apenas à direita.
           A borda inferior (border-b) pode ser removida em telas maiores (md:border-b-0) 
           para integrar melhor com o conteúdo se desejar um visual mais limpo.
        */}
      <div className="container flex h-full items-center justify-end px-4">
        {/* Ações (Lado Direito) - Logout, Perfil, etc podem vir aqui no futuro */}
        <div className="flex items-center gap-2">
           
        </div>
      </div>
    </header>
  )
}

export const DashboardHeader = Header