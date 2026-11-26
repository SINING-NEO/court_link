"use client";

import { FormEvent, useMemo, useState } from "react";
import { PostCard } from "@/components/post-card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCourtlink } from "@/lib/store";

export default function FeedPage() {
  const { data, currentUser, createPost, ready } = useCourtlink();
  const [caption, setCaption] = useState("");

  const posts = useMemo(() => {
    if (!currentUser) return [];
    const following = new Set([...currentUser.following, currentUser.id]);
    return [...data.posts]
      .filter((p) => following.has(p.authorId))
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }, [data.posts, currentUser]);

  function onCreate(e: FormEvent) {
    e.preventDefault();
    const tags = Array.from(caption.matchAll(/#[\w]+/g)).map((m) => m[0]);
    createPost(caption, tags.length ? tags : ["#TennisLife"]);
    setCaption("");
  }

  if (!ready || !currentUser) {
    return (
      <div className="rounded-2xl border border-border/70 bg-card/80 p-8 text-center text-muted-foreground">
        Loading your feed…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Feed</h1>
        <p className="mt-1 text-muted-foreground">
          Tennis moments from players you follow.
        </p>
      </div>

      <form
        onSubmit={onCreate}
        className="space-y-3 rounded-3xl border border-border/70 bg-card/90 p-4 shadow-sm"
      >
        <Textarea
          placeholder="Share a court moment, drill tip, or open invite…"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          rows={3}
        />
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            Tip: add hashtags like #TennisTraining
          </p>
          <Button type="submit" disabled={!caption.trim()}>
            Share
          </Button>
        </div>
      </form>

      {posts.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-card/60 p-8 text-center">
          <p className="font-display text-lg font-semibold">Your feed is quiet</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Follow players in Discover to fill this space with match stories.
          </p>
        </div>
      ) : (
        posts.map((post) => <PostCard key={post.id} post={post} />)
      )}
    </div>
  );
}
