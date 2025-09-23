// src/components/Lobby/ListPlayers.tsx
import { User } from "lucide-react"; // icono simple de usuario
import type { Room } from "../../models/Room";

type Props = {
  room: Room;
};

export default function ListPlayers({ room }: Props) {
  return (
    <div className="w-full rounded-lg p-4 text-white">
      {/* igual que en TopGlobals → alto fijo + scroll */}
      <div className="mt-4 flex h-64 flex-col gap-3 overflow-y-auto pr-2 nice-scroll">
        {room.roomPlayers.map((rp) => (
          <div
            key={rp.id}
            className="flex items-center justify-between rounded-lg bg-[#22232b] px-4 py-3 shadow-md ring-1 ring-white/10"
          >
            <div className="flex items-center gap-2">
              <User size={20} className="text-blue-400" />
               <span>{rp.player?.name ?? 'no se'}</span>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
