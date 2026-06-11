import { useMemo, useState } from "react";
import { AlertTriangle, Send } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MoodPicker } from "./MoodPicker";
import { IdentitySwitch } from "./IdentitySwitch";
import { useSession } from "@/context/SessionContext";
import { usePosts } from "@/context/PostsContext";
import { containsProfanity } from "@/lib/profanity";
import type { MoodId } from "@/lib/mood";
import { toast } from "sonner";

const MAX = 500;

export function ComposePost() {
  const { user } = useSession();
  const { addPost } = usePosts();
  const [text, setText] = useState("");
  const [mood, setMood] = useState<MoodId | null>(null);
  const [anonymous, setAnonymous] = useState(false);

  const flagged = useMemo(() => containsProfanity(text), [text]);
  const empty = text.trim().length === 0;
  const disabled = empty || !mood || flagged || text.length > MAX;

  if (!user) return null;

  function publish() {
    if (disabled || !user || !mood) return;
    addPost({
      authorId: user.id,
      authorName: anonymous ? "Anônimo" : user.name,
      authorVerified: user.verified,
      anonymous,
      mood,
      text: text.trim(),
    });
    setText("");
    setMood(null);
    setAnonymous(false);
    toast.success(anonymous ? "Desabafo publicado anonimamente." : "Desabafo publicado.");
  }

  return (
    <Card className="space-y-3 border-border/60 bg-card p-4">
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="O que você está sentindo agora?"
        maxLength={MAX + 50}
        rows={3}
        className="resize-none border-0 bg-transparent p-0 text-base shadow-none focus-visible:ring-0"
      />
      {flagged && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/10 p-2.5 text-sm text-destructive"
        >
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            Sua mensagem contém termos que violam nossas diretrizes da comunidade. Reformule para
            publicar.
          </span>
        </div>
      )}
      <MoodPicker value={mood} onChange={setMood} />
      <IdentitySwitch anonymous={anonymous} onChange={setAnonymous} userName={user.name} />
      <div className="flex items-center justify-between gap-2 pt-1">
        <span
          className={
            text.length > MAX ? "text-xs text-destructive" : "text-xs text-muted-foreground"
          }
        >
          {text.length}/{MAX}
        </span>
        <Button onClick={publish} disabled={disabled} size="sm">
          <Send className="mr-1.5 h-4 w-4" />
          Publicar
        </Button>
      </div>
    </Card>
  );
}