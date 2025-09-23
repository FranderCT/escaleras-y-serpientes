import TopGlobals from "../components/Lobby/TopGlobals";
import type { Player, Player1 } from "../models/Player";
import binariosFoto from "../assets/binariosFoto.png";
import PlayerHost from "../components/Lobby/RoomInfo/PlayerHost";
import ListPlayers from "../components/ListPlayers/ListPlayers";
import { useGetRoomByCode } from "../Hooks/RoomHooks";
import { roomByCodeRoute, roomGameRoute } from "../Routes";
import { useMessagesStore } from "../stores/messagesStore";
import { useNavigate } from "@tanstack/react-router";
import { useInitGame } from "../Hooks/ResumeHooks";



const playersData: Player1[] = [
  { Id: 1, NamePlayer: "Frander", TurnOrder: 1, Position: 5, Wins: 3 },
  { Id: 2, NamePlayer: "Brenda", TurnOrder: 2, Position: 10, Wins: 5 },
  { Id: 3, NamePlayer: "Luis", TurnOrder: 3, Position: 2, Wins: 1 },
  { Id: 4, NamePlayer: "Samuel", TurnOrder: 4, Position: 7, Wins: 2 },
  { Id: 5, NamePlayer: "Katherine", TurnOrder: 5, Position: 8, Wins: 4 },
];

const playerhost: Player = { id: 1, name: "Frander", turnOrder: 1, position: 5, wins: 3 };

export default function RoomGame() {
  const messages = useMessagesStore(s => s.messages);
  const { code } = roomByCodeRoute.useParams();
  const navigate = useNavigate();
  const initMutation = useInitGame();

  const  onStart = async () => {
    const roomCodeNum = Number(code);
    if (!Number.isFinite(roomCodeNum)) return;
    // 1) iniciar partida en backend
    await initMutation.mutateAsync(roomCodeNum, {
      onSuccess: () => {
        // 2) redirigir al tablero
        navigate({
        to: roomGameRoute.to,
        params: { code: String(roomCodeNum) }, // asegúrate de string
      });
      },
    });
  };

  const codeNum = Number(code)
  const { Room, isLoading, error } = useGetRoomByCode(
    Number.isFinite(codeNum) ? codeNum : undefined
  )
  
  // const data = await res.json();
  //   // Tu backend devuelve algo como: { roomId, roomCode, group, playersCount, capacity }
  //   // El GameHub usa el roomId como string de grupo (en tu caso estás usando room.Name en el servicio:
  //   // usa el mismo valor aquí. Si tu API te devuelve `group`, úsalo.
  //   const groupToJoin: string = String(data.group ?? data.roomId ?? data.roomCode ?? numericCode);

  //   // 2) Join en SignalR con playerName
  //   await joinSignalRRoom(groupToJoin, userName);

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p>Error: {String(error)}</p>;  
  if (!Room) return <p>No se encontró la sala.</p>;

  return (
    <main className="min-h-screen bg-[#0e0f13] text-white flex items-center justify-center">
      <div className="w-full max-w-5xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
      
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
          <div className="flex-1 rounded-2xl border border-white/10 bg-white/5  to-transparent p-4 sm:p-6 shadow-2xl shadow-indigo-900/10">
            <TopGlobals players={playersData} maxItems={10} />
          </div>
        </section>

        
        {/* Info de la sala / Host */}
        <section className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6 shadow-2xl shadow-indigo-900/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <PlayerHost player={playerhost} />
            <span>Codigo de la Sala # {Room?.code}</span>
        </section>

        <section className="rounded-2xl w-full max-w-5xl px-4 sm:px-6 border border-white/10 bg-white/5  lg:px- py-3 flex flex-col items-center justify-center">
            <span className="text-2xl font-semibold text-center text-white/90">
                Jugadores en la Sala
            </span>
            <ListPlayers room={Room} />
            <button
            onClick={onStart}
            disabled={initMutation.isPending}
            className="px-6 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 
                       text-white font-semibold text-lg shadow-lg shadow-emerald-700/30
                       hover:brightness-110 active:scale-95 transition disabled:opacity-60"
          >
            {initMutation.isPending ? "Iniciando…" : "Iniciar Partida"}
          </button>

          {/* opcional: feedback de error */}
          {initMutation.isError && (
            <p className="mt-2 text-sm text-red-400">
              {String(initMutation.error)}
            </p>
          )}
            
        </section>

        <div className="w-full max-w-5xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
        {/* ... tu UI arriba ... */}

          {/* Lobby */}
          <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <h3 className="text-xl font-semibold mb-2">Lobby</h3>
            <ul className="mt-4 space-y-1">
              {messages.map((message, index) => (
                <li key={index}>{message}</li>
              ))}
            </ul>
          </section>

          {/* (Opcional) Chat */}
          {/* <section> ... </section> */}
        </div>

      </div>
    </main>
  );
}
