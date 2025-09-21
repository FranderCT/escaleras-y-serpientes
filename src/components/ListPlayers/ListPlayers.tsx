// src/components/Lobby/ListPlayers.tsx
import type {  Player1 } from "../../models/Player";
import { User } from "lucide-react"; // icono simple de usuario

type Props = {
  players: Player1[];
 
};

export default function ListPlayers({ players }: Props) {
  return (
    <div className="w-full rounded-lg p-4 text-white">
     
      {/* igual que en TopGlobals → alto fijo + scroll */}
      <div className="mt-4 flex h-64 flex-col gap-3 overflow-y-auto pr-2 nice-scroll">
        {players.map((p) => (
          <div
            key={p.Id}
            className="flex items-center justify-between rounded-lg bg-[#22232b] px-4 py-3 shadow-md ring-1 ring-white/10"
          >
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-indigo-400" />
              <span className="text-white/90">
                {p.NamePlayer}
              </span>
            </div>
            
          </div>
        ))}
      </div>
    </div>
  );
}
