import { useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ComposePost } from "@/components/feed/ComposePost";
import { PostCard } from "@/components/feed/PostCard";
import { useSession } from "@/context/SessionContext";
import { usePosts } from "@/context/PostsContext";

export const Route = createFileRoute("/_app/feed")({
  head: () => ({
    meta: [
      { title: "Feed · Kojak" },
      { name: "description", content: "Seu feed de desabafos no Kojak." },
    ],
  }),
  component: FeedPage,
});

function FeedPage() {
  const { user } = useSession();
  const { posts } = usePosts();

  const mine = useMemo(
    () => (user ? posts.filter((p) => p.authorId === user.id) : []),
    [posts, user],
  );

  return (
    <div className="space-y-5">
      <ComposePost />

      <Tabs defaultValue="all">
        <TabsList className="grid h-10 w-full grid-cols-2 bg-secondary/60">
          <TabsTrigger value="all">Feed Geral</TabsTrigger>
          <TabsTrigger value="mine">Minha Mente</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4 space-y-3">
          {posts.length === 0 && <EmptyState text="O feed está em silêncio. Seja o primeiro." />}
          {posts.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
        </TabsContent>
        <TabsContent value="mine" className="mt-4 space-y-3">
          {mine.length === 0 && (
            <EmptyState text="Você ainda não publicou. Quando quiser, comece por aí em cima." />
          )}
          {mine.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border/60 p-8 text-center text-sm text-muted-foreground">
      {text}
    </div>
  );
}