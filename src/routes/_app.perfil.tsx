import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useSession } from "@/context/SessionContext";
import { usePosts } from "@/context/PostsContext";
import { PostCard } from "@/components/feed/PostCard";

export const Route = createFileRoute("/_app/perfil")({
  head: () => ({
    meta: [
      { title: "Meu perfil · Kojak" },
      { name: "description", content: "Seu perfil no Kojak." },
    ],
  }),
  component: ProfilePage,
});

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function ProfilePage() {
  const { user } = useSession();
  const { posts } = usePosts();
  if (!user) return null;

  const mine = posts.filter((p) => p.authorId === user.id);

  return (
    <div className="space-y-5">
      <Card className="flex items-center gap-4 border-border/60 bg-card p-5">
        <Avatar className="h-16 w-16 shrink-0">
          <AvatarFallback className="bg-secondary text-lg text-foreground">
            {initials(user.name)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h1 className="truncate font-display text-xl font-semibold">{user.name}</h1>
            {user.verified && <ShieldCheck className="h-5 w-5 shrink-0 text-primary" />}
          </div>
          <p className="truncate text-sm text-muted-foreground">{user.email}</p>
          <p className="text-xs text-muted-foreground">
            {mine.length} {mine.length === 1 ? "publicação" : "publicações"}
          </p>
        </div>
        {!user.verified && (
          <Button asChild size="sm" variant="outline">
            <Link to="/verificar">Verificar</Link>
          </Button>
        )}
      </Card>

      <h2 className="font-display text-lg font-semibold">Meus desabafos</h2>
      {mine.length === 0 ? (
        <p className="text-sm text-muted-foreground">Você ainda não publicou nada.</p>
      ) : (
        <div className="space-y-3">
          {mine.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
        </div>
      )}
    </div>
  );
}