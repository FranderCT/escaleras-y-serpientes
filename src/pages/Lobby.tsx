import TopGlobals from "../components/Lobby/TopGlobals";
import type { Player } from "../models/Player";
import binariosFoto from "../assets/binariosFoto.png";
import PlayerHost from "../components/Lobby/RoomInfo/PlayerHost";
import RoomCode from "../components/Lobby/RoomInfo/RoomCode";
import type { Room } from "../models/Room";

const playersData: Player[] = [
  { Id: 1, NamePlayer: "Frander", TurnOrder: 1, Position: 5, Wins: 3 },
  { Id: 2, NamePlayer: "Brenda", TurnOrder: 2, Position: 10, Wins: 5 },
  { Id: 3, NamePlayer: "Luis", TurnOrder: 3, Position: 2, Wins: 1 },
  { Id: 4, NamePlayer: "Samuel", TurnOrder: 4, Position: 7, Wins: 2 },
  { Id: 5, NamePlayer: "Katherine", TurnOrder: 5, Position: 8, Wins: 4 },
];

const playerhost: Player = { Id: 1, NamePlayer: "Frander", TurnOrder: 1, Position: 5, Wins: 3 };

const roomCode : Room = {IdRoom: 1, Code: "ABC-123"}

export default function Lobby() {
  return (
    <main className="min-h-screen bg-[#0e0f13] text-white flex items-center justify-center">
      <div className="w-full max-w-5xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
        {/* Header (igual línea visual que StartGame) */}
        <header className="text-center">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Lobby</h1>
          <p className="text-white/70 mt-2">Gestiona tu sala y revisa el ranking</p>
        </header>

        {/* Imagen + Ranking (flex responsive) */}
        <section className="flex flex-col md:flex-row gap-6">
          {/* Imagen */}
          <div className="flex-1 rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6 shadow-2xl shadow-indigo-900/10 flex items-center justify-center">
            <img
              src={binariosFoto}
              alt="Binarios"
              className="h-56 md:h-72 lg:h-72 w-auto object-contain rounded-md shadow-lg shadow-black/30"
              loading="lazy"
            />
          </div>

          {/* Ranking (mismo look de tarjetas StartGame) */}
          <div className="flex-1 rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-4 sm:p-6 shadow-2xl shadow-indigo-900/10">
            <TopGlobals players={playersData} maxItems={10} />
          </div>
        </section>

        
        {/* Info de la sala / Host */}
        <section className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6 shadow-2xl shadow-indigo-900/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <PlayerHost player={playerhost} />
            <RoomCode room={roomCode} />
        </section>

      </div>
    </main>
  );
}
