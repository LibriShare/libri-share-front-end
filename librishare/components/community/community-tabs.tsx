"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CommunityFeed } from "./community-feed"
import { DiscoverBooks } from "./discover-books"
import { TrendingBooks } from "./trending-books"
import { FriendsActivity } from "./friends-activity"
import { LibraryFinder } from "./library-finder"

export function CommunityTabs() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-balance">LibriConnect</h1>
        <p className="text-muted-foreground text-pretty">
          Conecte-se com outros leitores, descubra novos livros e compartilhe suas experiências
        </p>
      </div>

      <Tabs defaultValue="feed" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="feed">Feed</TabsTrigger>
          <TabsTrigger value="discover">Descobrir</TabsTrigger>
          <TabsTrigger value="trending">Em Alta</TabsTrigger>
          <TabsTrigger value="friends">Amigos</TabsTrigger>
          <TabsTrigger value="libraries">Bibliotecas</TabsTrigger>
        </TabsList>

        <TabsContent value="feed" className="mt-6">
          <CommunityFeed />
        </TabsContent>

        <TabsContent value="discover" className="mt-6">
          <DiscoverBooks />
        </TabsContent>

        <TabsContent value="trending" className="mt-6">
          <TrendingBooks />
        </TabsContent>

        <TabsContent value="friends" className="mt-6">
          <FriendsActivity />
        </TabsContent>

        <TabsContent value="libraries" className="mt-6">
          <LibraryFinder />
        </TabsContent>
      </Tabs>
    </div>
  )
}
