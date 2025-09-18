// src/components/Lobby/TopGlobals.tsx
import type { Player } from "../../models/Player";
import { Trophy } from "lucide-react";

type Props = {
  players: Player[];
  maxItems?: number; // opcional: limitar cuantos muestra
};

export default function TopGlobals({ players, maxItems = 10 }: Props) {
  const ordered = [...players].sort((a, b) => b.Wins - a.Wins).slice(0, maxItems);

  return (
    <div className="w-full rounded-lg border border-white/10 bg-[#1b1c22] p-4 text-white">
      <h2 className="text-xl font-semibold text-center text-white/90">🏆 Top Jugadores</h2>

      {/* alto fijo con scroll; suficiente para laptops 1366/1440/1080 */}
      <div className="mt-4 flex h-64 flex-col gap-3 overflow-y-auto pr-2 nice-scroll">
        {ordered.map((p, i) => (
          <div
            key={p.Id}
            className="flex items-center justify-between rounded-lg bg-[#22232b] px-4 py-3 shadow-md ring-1 ring-white/10"
          >
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-indigo-400" />
              <span className="text-white/90">#{i + 1} {p.NamePlayer}</span>
            </div>
            <span className="rounded-full bg-black/30 px-3 py-1 text-sm font-semibold text-indigo-300">
              🏆 {p.Wins}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
