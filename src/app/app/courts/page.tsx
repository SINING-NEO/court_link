"use client";

import { useMemo, useState } from "react";
import { MapPinned, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCourtlink } from "@/lib/store";
import type { Surface } from "@/lib/types";

const surfaces: Array<Surface | "All"> = ["All", "Hard", "Clay", "Grass"];

export default function CourtsPage() {
  const { data, ready } = useCourtlink();
  const [query, setQuery] = useState("");
  const [surface, setSurface] = useState<Surface | "All">("All");
  const [favorites, setFavorites] = useState<string[]>(["court3"]);

  const courts = useMemo(
    () =>
      data.courts.filter((c) => {
        const q = query.trim().toLowerCase();
        const matchesQuery =
          !q ||
          c.name.toLowerCase().includes(q) ||
          c.address.toLowerCase().includes(q);
        const matchesSurface = surface === "All" || c.surface === surface;
        return matchesQuery && matchesSurface;
      }),
    [data.courts, query, surface]
  );

  if (!ready) {
    return (
      <div className="rounded-2xl border border-border/70 bg-card/80 p-8 text-center text-muted-foreground">
        Loading courts…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">
          Courts
        </h1>
        <p className="mt-1 text-muted-foreground">
          Discover nearby courts, surfaces, and facilities. Bookings stay with
          the venue for now.
        </p>
      </div>

      <div className="overflow-hidden rounded-3xl border border-border/70 bg-court-deep shadow-sm">
        <div className="relative aspect-[21/9] min-h-40 court-grid">
          <div className="absolute inset-0 bg-gradient-to-tr from-court-deep via-[#145c3f]/80 to-[#1a6b48]" />
          {data.courts.map((c, i) => (
            <div
              key={c.id}
              className="absolute flex flex-col items-center"
              style={{
                left: `${18 + i * 18}%`,
                top: `${30 + (i % 2) * 22}%`,
              }}
            >
              <span className="flex size-8 items-center justify-center rounded-full bg-ball text-court-deep shadow-lg">
                <MapPinned className="size-4" />
              </span>
              <span className="mt-1 max-w-28 truncate rounded-md bg-black/35 px-2 py-0.5 text-[10px] text-line backdrop-blur">
                {c.name}
              </span>
            </div>
          ))}
          <div className="absolute bottom-3 left-4 text-xs text-line/70">
            Map preview · Singapore courts
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          placeholder="Search courts"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="sm:max-w-sm"
        />
        <div className="flex flex-wrap gap-2">
          {surfaces.map((s) => (
            <Button
              key={s}
              size="sm"
              variant={surface === s ? "default" : "outline"}
              onClick={() => setSurface(s)}
            >
              {s}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {courts.map((court) => {
          const fav = favorites.includes(court.id);
          return (
            <article
              key={court.id}
              className="overflow-hidden rounded-3xl border border-border/70 bg-card/90 shadow-sm"
            >
              <div className="post-visual-marina relative h-28">
                <div className="absolute inset-0 court-grid opacity-25" />
                <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                  <Badge className="bg-ball text-court-deep hover:bg-ball">
                    {court.surface}
                  </Badge>
                  <span className="inline-flex items-center gap-1 text-sm text-line">
                    <Star className="size-3.5 fill-ball text-ball" />
                    {court.rating.toFixed(1)}
                  </span>
                </div>
              </div>
              <div className="space-y-3 p-5">
                <div>
                  <h2 className="font-display text-xl font-semibold">
                    {court.name}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {court.address}
                  </p>
                </div>
                <p className="text-sm font-medium text-primary">
                  {court.priceHint}
                </p>
                <div className="flex flex-wrap gap-2">
                  {court.facilities.map((f) => (
                    <Badge key={f} variant="secondary">
                      {f}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={fav ? "secondary" : "outline"}
                    onClick={() =>
                      setFavorites((prev) =>
                        fav
                          ? prev.filter((id) => id !== court.id)
                          : [...prev, court.id]
                      )
                    }
                  >
                    {fav ? "Favourited" : "Favourite"}
                  </Button>
                  <Button size="sm" variant="ghost">
                    Directions
                  </Button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
