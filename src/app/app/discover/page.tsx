"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PlayerAvatar } from "@/components/player-avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCourtlink } from "@/lib/store";
import type { SkillLevel } from "@/lib/types";

const skills: Array<SkillLevel | "All"> = [
  "All",
  "Beginner",
  "Intermediate",
  "Advanced",
];

export default function DiscoverPage() {
  const {
    data,
    currentUser,
    toggleFollow,
    sendFriendRequest,
    startConversation,
    ready,
  } = useCourtlink();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [skill, setSkill] = useState<SkillLevel | "All">("All");

  const players = useMemo(() => {
    if (!currentUser) return [];
    return data.players
      .filter((p) => p.id !== currentUser.id)
      .filter((p) => (skill === "All" ? true : p.skillLevel === skill))
      .filter((p) => {
        const q = query.trim().toLowerCase();
        if (!q) return true;
        return (
          p.name.toLowerCase().includes(q) ||
          p.username.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q)
        );
      });
  }, [data.players, currentUser, query, skill]);

  if (!ready || !currentUser) {
    return (
      <div className="rounded-2xl border border-border/70 bg-card/80 p-8 text-center text-muted-foreground">
        Finding players…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">
          Discover
        </h1>
        <p className="mt-1 text-muted-foreground">
          Match partners by skill, style, and neighborhood.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          placeholder="Search name, username, or area"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="sm:max-w-sm"
        />
        <div className="flex flex-wrap gap-2">
          {skills.map((s) => (
            <Button
              key={s}
              size="sm"
              variant={skill === s ? "default" : "outline"}
              onClick={() => setSkill(s)}
            >
              {s}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {players.map((player) => {
          const following = currentUser.following.includes(player.id);
          const friendship = data.friendships.find(
            (f) =>
              (f.senderId === currentUser.id && f.receiverId === player.id) ||
              (f.senderId === player.id && f.receiverId === currentUser.id)
          );
          const compatible =
            player.skillLevel === currentUser.skillLevel ||
            player.availability === currentUser.availability;

          return (
            <div
              key={player.id}
              className="rounded-3xl border border-border/70 bg-card/90 p-5 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <PlayerAvatar player={player} className="size-12" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-display text-lg font-semibold">
                      {player.name}
                    </p>
                    {compatible && (
                      <Badge className="bg-ball text-court-deep hover:bg-ball">
                        Compatible
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    @{player.username} · {player.location}
                  </p>
                </div>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-foreground/85">
                {player.bio}
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <Badge variant="secondary">{player.skillLevel}</Badge>
                <Badge variant="secondary">{player.playingStyle}</Badge>
                <Badge variant="secondary">{player.availability}</Badge>
                {player.surfaces.map((s) => (
                  <Badge key={s} variant="outline">
                    {s}
                  </Badge>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant={following ? "secondary" : "default"}
                  onClick={() => toggleFollow(player.id)}
                >
                  {following ? "Following" : "Follow"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={
                    friendship?.status === "accepted" ||
                    friendship?.status === "pending"
                  }
                  onClick={() => sendFriendRequest(player.id)}
                >
                  {friendship?.status === "accepted"
                    ? "Friends"
                    : friendship?.status === "pending"
                      ? "Request sent"
                      : "Add friend"}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    const id = startConversation(player.id);
                    router.push(`/app/messages?c=${id}`);
                  }}
                >
                  Message
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {players.length === 0 && (
        <div className="rounded-3xl border border-dashed border-border bg-card/60 p-8 text-center">
          <p className="font-display text-lg font-semibold">No players found</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Try another skill filter or clear your search.
          </p>
        </div>
      )}
    </div>
  );
}
