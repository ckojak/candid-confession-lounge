import { useState } from "react";
import { Flag, Heart, MessageCircle, VenetianMask } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { VerifiedBadge } from "@/components/common/VerifiedBadge";
import { MoodChip } from "@/components/common/MoodChip";
import { Comments } from "./Comments";
import { ReportModal } from "./ReportModal";
import { usePosts, type Post } from "@/context/PostsContext";
import { timeAgo } from "@/lib/time";
import { cn } from "@/lib/utils";

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function PostCard({ post }: { post: Post }) {
  const { toggleLike, reportPost } = usePosts();
  const [showComments, setShowComments] = useState(false);
  const [reporting, setReporting] = useState(false);

  return (
    <Card className="space-y-3 border-border/60 bg-card p-4">
      <header className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
        <Avatar className="h-10 w-10 shrink-0">
          {post.anonymous ? (
            <AvatarFallback className="bg-muted text-muted-foreground">
              <VenetianMask className="h-5 w-5" />
            </AvatarFallback>
          ) : (
            <AvatarFallback className="bg-secondary text-foreground">
              {initials(post.authorName)}
            </AvatarFallback>
          )}
        </Avatar>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="truncate font-semibold text-foreground">{post.authorName}</span>
            {!post.anonymous && post.authorVerified && <VerifiedBadge />}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{timeAgo(post.createdAt)}</span>
            <span>·</span>
            <MoodChip moodId={post.mood} />
          </div>
        </div>
      </header>

      <p className="whitespace-pre-wrap break-words text-[0.95rem] leading-relaxed text-foreground">
        {post.text}
      </p>

      <footer className="flex items-center justify-between border-t border-border/60 pt-2">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleLike(post.id)}
            className={cn("h-8 gap-1.5", post.likedByMe && "text-primary")}
          >
            <Heart className={cn("h-4 w-4", post.likedByMe && "fill-current")} />
            <span className="tabular-nums">{post.likes}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowComments((v) => !v)}
            className="h-8 gap-1.5"
            aria-expanded={showComments}
          >
            <MessageCircle className="h-4 w-4" />
            <span className="tabular-nums">{post.comments.length}</span>
          </Button>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setReporting(true)}
          disabled={post.reportedByMe}
          className="h-8 text-destructive/80 hover:bg-destructive/10 hover:text-destructive"
          aria-label="Denunciar"
        >
          <Flag className="h-4 w-4" />
          <span className="ml-1 text-xs">
            {post.reportedByMe ? "Denunciado" : "Denunciar"}
          </span>
        </Button>
      </footer>

      {showComments && <Comments post={post} />}

      <ReportModal
        open={reporting}
        onOpenChange={setReporting}
        onConfirm={() => reportPost(post.id)}
      />
    </Card>
  );
}