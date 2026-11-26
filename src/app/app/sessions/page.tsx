"use client";

import { FormEvent, useMemo, useState } from "react";
import { PlayerAvatar } from "@/components/player-avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCourtlink } from "@/lib/store";
import type { SkillLevel } from "@/lib/types";

export default function SessionsPage() {
  const {
    data,
    currentUser,
    joinSession,
    leaveSession,
    createSession,
    getPlayer,
    ready,
  } = useCourtlink();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    courtId: data.courts[0]?.id ?? "",
    date: "2026-11-30",
    time: "18:00",
    format: "Doubles" as "Singles" | "Doubles",
    skillLevel: "Intermediate" as SkillLevel,
    capacity: 4,
    notes: "",
  });

  const sessions = useMemo(
    () =>
      [...data.sessions].sort((a, b) =>
        `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`)
      ),
    [data.sessions]
  );

  function onCreate(e: FormEvent) {
    e.preventDefault();
    createSession(form);
    setOpen(false);
    setForm((f) => ({ ...f, title: "", notes: "" }));
  }

  if (!ready || !currentUser) {
    return (
      <div className="rounded-2xl border border-border/70 bg-card/80 p-8 text-center text-muted-foreground">
        Loading sessions…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">
            Sessions
          </h1>
          <p className="mt-1 text-muted-foreground">
            Create a hit, fill the open slots, and meet on court.
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={<Button />}>Create session</DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>New tennis session</DialogTitle>
            </DialogHeader>
            <form onSubmit={onCreate} className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, title: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="court">Court</Label>
                <select
                  id="court"
                  className="h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm"
                  value={form.courtId}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, courtId: e.target.value }))
                  }
                >
                  {data.courts.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={form.date}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, date: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={form.time}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, time: e.target.value }))
                    }
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="format">Format</Label>
                  <select
                    id="format"
                    className="h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm"
                    value={form.format}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        format: e.target.value as "Singles" | "Doubles",
                        capacity: e.target.value === "Singles" ? 2 : 4,
                      }))
                    }
                  >
                    <option>Singles</option>
                    <option>Doubles</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="skill">Skill</Label>
                  <select
                    id="skill"
                    className="h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm"
                    value={form.skillLevel}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        skillLevel: e.target.value as SkillLevel,
                      }))
                    }
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={form.notes}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, notes: e.target.value }))
                  }
                  rows={2}
                />
              </div>
              <Button type="submit" className="w-full">
                Publish session
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      <div className="grid gap-4">
        {sessions.map((session) => {
          const court = data.courts.find((c) => c.id === session.courtId);
          const creator = getPlayer(session.creatorId);
          const joined = session.participantIds.includes(currentUser.id);
          const full = session.participantIds.length >= session.capacity;

          return (
            <article
              key={session.id}
              className="rounded-3xl border border-border/70 bg-card/90 p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-xl font-semibold">
                    {session.title}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {court?.name} · {session.date} at {session.time}
                  </p>
                </div>
                <Badge className="bg-court-deep text-ball hover:bg-court-deep">
                  {session.participantIds.length}/{session.capacity} players
                </Badge>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <Badge variant="secondary">{session.format}</Badge>
                <Badge variant="secondary">{session.skillLevel}</Badge>
                {court && <Badge variant="outline">{court.surface}</Badge>}
              </div>

              {session.notes && (
                <p className="mt-3 text-sm text-foreground/85">{session.notes}</p>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <div className="flex -space-x-2">
                  {session.participantIds.map((id) => {
                    const p = getPlayer(id);
                    return p ? (
                      <PlayerAvatar
                        key={id}
                        player={p}
                        className="size-8 border-2 border-card"
                      />
                    ) : null;
                  })}
                </div>
                <p className="text-xs text-muted-foreground">
                  Hosted by {creator?.name ?? "player"}
                </p>
                <div className="ml-auto">
                  {joined ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => leaveSession(session.id)}
                    >
                      Leave
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      disabled={full}
                      onClick={() => {
                        const err = joinSession(session.id);
                        setError(err);
                      }}
                    >
                      {full ? "Full" : "Join"}
                    </Button>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
