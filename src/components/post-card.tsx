"use client";

import { useState } from "react";
import { Heart, MessageCircle, Bookmark } from "lucide-react";
import { PlayerAvatar } from "@/components/player-avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCourtlink } from "@/lib/store";
import type { Post } from "@/lib/types";
import { cn } from "@/lib/utils";

const visualClass: Record<string, string> = {
  "court-dusk": "post-visual-court-dusk",
  drill: "post-visual-drill",
  marina: "post-visual-marina",
  progress: "post-visual-progress",
  fresh: "post-visual-fresh",
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function PostCard({ post }: { post: Post }) {
  const { currentUser, getPlayer, toggleLike, addComment } = useCourtlink();
  const author = getPlayer(post.authorId);
  const [comment, setComment] = useState("");
  const liked = currentUser ? post.likes.includes(currentUser.id) : false;

  if (!author) return null;

  return (
    <article className="overflow-hidden rounded-3xl border border-border/70 bg-card/90 shadow-sm backdrop-blur">
      <div className="flex items-center gap-3 px-4 py-3">
        <PlayerAvatar player={author} />
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium">{author.name}</p>
          <p className="text-xs text-muted-foreground">
            @{author.username} · {timeAgo(post.createdAt)}
          </p>
        </div>
        <Badge variant="secondary">{author.skillLevel}</Badge>
      </div>

      <div
        className={cn(
          "post-visual relative aspect-[16/10] w-full",
          visualClass[post.image] ?? "post-visual-fresh"
        )}
      >
        <div className="absolute inset-0 court-grid opacity-30" />
        <div className="absolute bottom-4 left-4 right-4">
          <p className="font-display text-lg font-semibold text-line drop-shadow">
            {post.hashtags[0] ?? "#TennisLife"}
          </p>
        </div>
      </div>

      <div className="space-y-3 px-4 py-4">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className={cn(liked && "text-primary")}
            onClick={() => toggleLike(post.id)}
          >
            <Heart className={cn("size-4", liked && "fill-current")} />
            {post.likes.length}
          </Button>
          <Button variant="ghost" size="sm">
            <MessageCircle className="size-4" />
            {post.comments.length}
          </Button>
          <Button variant="ghost" size="sm" className="ml-auto">
            <Bookmark className="size-4" />
          </Button>
        </div>

        <p className="text-sm leading-relaxed">{post.caption}</p>
        <div className="flex flex-wrap gap-2">
          {post.hashtags.map((tag) => (
            <span key={tag} className="text-xs font-medium text-primary">
              {tag}
            </span>
          ))}
        </div>

        {post.comments.length > 0 && (
          <div className="space-y-2 border-t border-border/60 pt-3">
            {post.comments.map((c) => {
              const commenter = getPlayer(c.authorId);
              return (
                <p key={c.id} className="text-sm">
                  <span className="font-medium">
                    {commenter?.username ?? "player"}
                  </span>{" "}
                  <span className="text-muted-foreground">{c.content}</span>
                </p>
              );
            })}
          </div>
        )}

        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            addComment(post.id, comment);
            setComment("");
          }}
        >
          <Input
            placeholder="Add a comment…"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <Button type="submit" variant="secondary" disabled={!comment.trim()}>
            Post
          </Button>
        </form>
      </div>
    </article>
  );
}
