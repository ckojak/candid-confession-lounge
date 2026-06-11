import { useMemo, useState } from "react";
import { AlertTriangle, Send, VenetianMask } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { VerifiedBadge } from "@/components/common/VerifiedBadge";
import { useSession } from "@/context/SessionContext";
import { usePosts, type Post } from "@/context/PostsContext";
import { containsProfanity } from "@/lib/profanity";
import { timeAgo } from "@/lib/time";

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function Comments({ post }: { post: Post }) {
  const { user } = useSession();
  const { addComment } = usePosts();
  const [text, setText] = useState("");
  const [anonymous, setAnonymous] = useState(false);

  const flagged = useMemo(() => containsProfanity(text), [text]);
  const disabled = !user || text.trim().length === 0 || flagged;

  function submit() {
    if (disabled || !user) return;
    addComment(post.id, {
      authorId: user.id,
      authorName: anonymous ? "Anônimo" : user.name,
      anonymous,
      authorVerified: user.verified,
      text: text.trim(),
    });
    setText("");
  }

  return (
    <div className="space-y-3 border-t border-border/60 pt-3">
      {post.comments.length === 0 && (
        <p className="text-sm text-muted-foreground">Nenhum comentário ainda. Seja gentil.</p>
      )}
      {post.comments.map((c) => (
        <div key={c.id} className="flex gap-2.5">
          <Avatar className="h-7 w-7 shrink-0">
            {c.anonymous ? (
              <AvatarFallback className="bg-muted text-muted-foreground">
                <VenetianMask className="h-3.5 w-3.5" />
              </AvatarFallback>
            ) : (
              <AvatarFallback className="bg-secondary text-xs text-foreground">
                {initials(c.authorName)}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="min-w-0 flex-1 rounded-lg bg-secondary/40 px-3 py-2">
            <div className="flex items-center gap-1.5 text-xs">
              <span className="font-semibold text-foreground">{c.authorName}</span>
              {!c.anonymous && c.authorVerified && <VerifiedBadge />}
              <span className="text-muted-foreground">· {timeAgo(c.createdAt)}</span>
            </div>
            <p className="mt-0.5 whitespace-pre-wrap break-words text-sm">{c.text}</p>
          </div>
        </div>
      ))}

      {user && (
        <div className="space-y-2 pt-1">
          <div className="flex items-center gap-2">
            <Input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Escreva um comentário..."
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  submit();
                }
              }}
            />
            <Button size="icon" onClick={submit} disabled={disabled} aria-label="Enviar comentário">
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center justify-between gap-3">
            <Label
              htmlFor={`anon-${post.id}`}
              className="flex cursor-pointer items-center gap-2 text-xs text-muted-foreground"
            >
              <Switch id={`anon-${post.id}`} checked={anonymous} onCheckedChange={setAnonymous} />
              Comentar anonimamente
            </Label>
            {flagged && (
              <span className="flex items-center gap-1 text-xs text-destructive">
                <AlertTriangle className="h-3.5 w-3.5" />
                Termo bloqueado pela comunidade.
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}