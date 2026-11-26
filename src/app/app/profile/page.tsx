"use client";

import { FormEvent, useState } from "react";
import { PlayerAvatar } from "@/components/player-avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCourtlink } from "@/lib/store";
import type {
  Availability,
  Hand,
  PlayingStyle,
  SkillLevel,
  Surface,
} from "@/lib/types";

export default function ProfilePage() {
  const {
    currentUser,
    data,
    updateProfile,
    respondFriendRequest,
    resetDemo,
    ready,
  } = useCourtlink();
  const [saved, setSaved] = useState(false);

  if (!ready || !currentUser) {
    return (
      <div className="rounded-2xl border border-border/70 bg-card/80 p-8 text-center text-muted-foreground">
        Loading profile…
      </div>
    );
  }

  const pending = data.friendships.filter(
    (f) => f.receiverId === currentUser.id && f.status === "pending"
  );

  function onSave(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const surfaces = fd.getAll("surfaces") as Surface[];
    updateProfile({
      name: String(fd.get("name") || currentUser!.name),
      bio: String(fd.get("bio") || ""),
      location: String(fd.get("location") || ""),
      skillLevel: String(fd.get("skillLevel")) as SkillLevel,
      playingStyle: String(fd.get("playingStyle")) as PlayingStyle,
      hand: String(fd.get("hand")) as Hand,
      availability: String(fd.get("availability")) as Availability,
      surfaces: surfaces.length ? surfaces : currentUser!.surfaces,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">
          Profile
        </h1>
        <p className="mt-1 text-muted-foreground">
          Your tennis identity on Courtlink.
        </p>
      </div>

      <section className="rounded-3xl border border-border/70 bg-card/90 p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <PlayerAvatar player={currentUser} className="size-16 text-lg" />
          <div>
            <p className="font-display text-2xl font-semibold">
              {currentUser.name}
            </p>
            <p className="text-sm text-muted-foreground">
              @{currentUser.username}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge variant="secondary">
                {currentUser.followers.length} followers
              </Badge>
              <Badge variant="secondary">
                {currentUser.following.length} following
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {pending.length > 0 && (
        <section className="rounded-3xl border border-border/70 bg-card/90 p-5 shadow-sm">
          <h2 className="font-display text-lg font-semibold">
            Friend requests
          </h2>
          <ul className="mt-3 space-y-3">
            {pending.map((f) => {
              const sender = data.players.find((p) => p.id === f.senderId);
              if (!sender) return null;
              return (
                <li
                  key={f.id}
                  className="flex flex-wrap items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <PlayerAvatar player={sender} />
                    <div>
                      <p className="font-medium">{sender.name}</p>
                      <p className="text-xs text-muted-foreground">
                        @{sender.username}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => respondFriendRequest(f.id, true)}
                    >
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => respondFriendRequest(f.id, false)}
                    >
                      Decline
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <form
        onSubmit={onSave}
        className="space-y-4 rounded-3xl border border-border/70 bg-card/90 p-6 shadow-sm"
      >
        <h2 className="font-display text-lg font-semibold">Edit details</h2>
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" defaultValue={currentUser.name} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea id="bio" name="bio" defaultValue={currentUser.bio} rows={3} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            name="location"
            defaultValue={currentUser.location}
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="skillLevel">Skill level</Label>
            <select
              id="skillLevel"
              name="skillLevel"
              defaultValue={currentUser.skillLevel}
              className="h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm"
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="playingStyle">Playing style</Label>
            <select
              id="playingStyle"
              name="playingStyle"
              defaultValue={currentUser.playingStyle}
              className="h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm"
            >
              <option>Singles</option>
              <option>Doubles</option>
              <option>Both</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="hand">Hand</Label>
            <select
              id="hand"
              name="hand"
              defaultValue={currentUser.hand}
              className="h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm"
            >
              <option>Right</option>
              <option>Left</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="availability">Availability</Label>
            <select
              id="availability"
              name="availability"
              defaultValue={currentUser.availability}
              className="h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm"
            >
              <option>Weekdays</option>
              <option>Weekends</option>
              <option>Flexible</option>
            </select>
          </div>
        </div>
        <fieldset className="space-y-2">
          <LegendLike>Preferred surfaces</LegendLike>
          <div className="flex flex-wrap gap-3">
            {(["Hard", "Clay", "Grass"] as Surface[]).map((s) => (
              <label key={s} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="surfaces"
                  value={s}
                  defaultChecked={currentUser.surfaces.includes(s)}
                  className="size-4 rounded border-input"
                />
                {s}
              </label>
            ))}
          </div>
        </fieldset>
        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit">Save profile</Button>
          {saved && (
            <span className="text-sm text-primary">Profile updated.</span>
          )}
        </div>
      </form>

      <div className="rounded-3xl border border-dashed border-border bg-card/60 p-5">
        <p className="text-sm text-muted-foreground">
          This demo stores data in your browser. Reset to reload seed players,
          posts, courts, and sessions.
        </p>
        <Button
          variant="outline"
          className="mt-3"
          onClick={() => resetDemo()}
        >
          Reset demo data
        </Button>
      </div>
    </div>
  );
}

function LegendLike({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
      {children}
    </div>
  );
}
