"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PlayerAvatar } from "@/components/player-avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCourtlink } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Suspense } from "react";

function MessagesInner() {
  const { data, currentUser, sendMessage, getPlayer, ready } = useCourtlink();
  const searchParams = useSearchParams();
  const initial = searchParams.get("c");
  const [activeId, setActiveId] = useState<string | null>(initial);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    if (initial) setActiveId(initial);
  }, [initial]);

  const conversations = useMemo(() => {
    if (!currentUser) return [];
    return data.conversations.filter((c) =>
      c.participantIds.includes(currentUser.id)
    );
  }, [data.conversations, currentUser]);

  useEffect(() => {
    if (!activeId && conversations[0]) setActiveId(conversations[0].id);
  }, [conversations, activeId]);

  const active = conversations.find((c) => c.id === activeId) ?? null;
  const other = active
    ? getPlayer(
        active.participantIds.find((id) => id !== currentUser?.id) ?? ""
      )
    : null;

  function onSend(e: FormEvent) {
    e.preventDefault();
    if (!active || !draft.trim()) return;
    sendMessage(active.id, draft);
    setDraft("");
  }

  if (!ready || !currentUser) {
    return (
      <div className="rounded-2xl border border-border/70 bg-card/80 p-8 text-center text-muted-foreground">
        Loading messages…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">
          Messages
        </h1>
        <p className="mt-1 text-muted-foreground">
          Coordinate hits, share courts, and send session invites.
        </p>
      </div>

      <div className="grid min-h-[28rem] overflow-hidden rounded-3xl border border-border/70 bg-card/90 shadow-sm md:grid-cols-[240px_1fr]">
        <aside className="border-b border-border/70 md:border-b-0 md:border-r">
          {conversations.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground">
              No conversations yet. Message someone from Discover.
            </p>
          ) : (
            <ul className="divide-y divide-border/60">
              {conversations.map((c) => {
                const peer = getPlayer(
                  c.participantIds.find((id) => id !== currentUser.id) ?? ""
                );
                if (!peer) return null;
                const last = c.messages[c.messages.length - 1];
                return (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => setActiveId(c.id)}
                      className={cn(
                        "flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-secondary/70",
                        activeId === c.id && "bg-secondary"
                      )}
                    >
                      <PlayerAvatar player={peer} className="size-9" />
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium">
                          {peer.name}
                        </span>
                        <span className="block truncate text-xs text-muted-foreground">
                          {last?.content ?? "Say hello"}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </aside>

        <section className="flex min-h-[22rem] flex-col">
          {!active || !other ? (
            <div className="flex flex-1 items-center justify-center p-6 text-sm text-muted-foreground">
              Select a conversation
            </div>
          ) : (
            <>
              <header className="flex items-center gap-3 border-b border-border/70 px-4 py-3">
                <PlayerAvatar player={other} />
                <div>
                  <p className="font-medium">{other.name}</p>
                  <p className="text-xs text-muted-foreground">
                    @{other.username}
                  </p>
                </div>
              </header>
              <div className="flex-1 space-y-3 overflow-y-auto p-4">
                {active.messages.length === 0 && (
                  <p className="text-center text-sm text-muted-foreground">
                    No messages yet — start the rally.
                  </p>
                )}
                {active.messages.map((m) => {
                  const mine = m.senderId === currentUser.id;
                  return (
                    <div
                      key={m.id}
                      className={cn(
                        "flex",
                        mine ? "justify-end" : "justify-start"
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[80%] rounded-2xl px-3.5 py-2 text-sm",
                          mine
                            ? "bg-court-deep text-line"
                            : "bg-secondary text-foreground"
                        )}
                      >
                        {m.content}
                      </div>
                    </div>
                  );
                })}
              </div>
              <form
                onSubmit={onSend}
                className="flex gap-2 border-t border-border/70 p-3"
              >
                <Input
                  placeholder="Write a message…"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                />
                <Button type="submit" disabled={!draft.trim()}>
                  Send
                </Button>
              </form>
            </>
          )}
        </section>
      </div>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense
      fallback={
        <div className="rounded-2xl border border-border/70 bg-card/80 p-8 text-center text-muted-foreground">
          Loading messages…
        </div>
      }
    >
      <MessagesInner />
    </Suspense>
  );
}
