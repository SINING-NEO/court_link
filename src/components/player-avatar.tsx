import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { Player } from "@/lib/types";

const tones = [
  "bg-[#145c3f] text-[#d8f26a]",
  "bg-[#0b3d2e] text-[#f7fff0]",
  "bg-[#2f7f5f] text-white",
  "bg-[#1a4d3a] text-[#d8f26a]",
  "bg-[#0f4a35] text-[#e8f5a0]",
];

export function PlayerAvatar({
  player,
  className,
}: {
  player: Pick<Player, "id" | "avatar" | "name">;
  className?: string;
}) {
  const tone = tones[player.id.charCodeAt(player.id.length - 1) % tones.length];
  return (
    <Avatar className={cn("size-10 border border-white/20 shadow-sm", className)}>
      <AvatarFallback className={cn("font-display text-sm font-semibold", tone)}>
        {player.avatar || player.name.slice(0, 2).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
}
