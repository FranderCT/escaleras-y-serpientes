// src/pages/GameBoard.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { roomByCodeRoute, roomGameRoute } from "../Routes";
import { useGetPlayer } from "../Hooks/PlayerHooks";
import { useGetRoomByCode } from "../Hooks/RoomHooks";
import { useInitGame, usePlayTurn } from "../Hooks/ResumeHooks";
import { ensureStarted, getConnection, joinSignalRRoom, leaveSignalRRoom } from "../signalRConnection";
import SnakesLaddersBoard from "../components/GameBoard/SnakeLadderBoard";
import { useMessagesStore } from "../stores/messagesStore";
import { useNavigate } from "@tanstack/react-router";
import { useSessionStore } from "../stores/sessionStore";


export type UIPlayer = { id: number; name: string; color: string; turnOrder: number };

function colorFromName(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue} 70% 50%)`;
}

// Debe coincidir con el mapa del backend para que las flechas coincidan visualmente
const jumps = { 3: 22, 5: 8, 11: 26, 20: 29, 27: 1, 21: 9, 17: 4, 19: 7 };

export default function GameBoard() {
  const messages = useMessagesStore(s => s.messages);
  const navigate = useNavigate();
  // 1) Parámetro de ruta y mis datos
  const { code } = roomGameRoute.useParams();
  const roomCode = Number(code);

  const { UserPlayer } = useGetPlayer();
  const myId = UserPlayer?.id ?? 0;

  // 2) Hooks de API (init/turn) y consulta de sala
  const initMutation = useInitGame();
  const playMutation = usePlayTurn();
  const { Room, isLoading, error } = useGetRoomByCode(
    Number.isFinite(roomCode) ? roomCode : undefined
  );

  // 3) Estado UI sincronizado con servidor
  const [players, setPlayers] = useState<UIPlayer[]>([]);
  const [positions, setPositions] = useState<number[]>([]);
  const [currentTurnOrder, setCurrentTurnOrder] = useState(0);
  const [winnerName, setWinnerName] = useState<string | null>(null);
  const [diceFace, setDiceFace] = useState<number | undefined>(undefined);
  const [diceSpinning, setDiceSpinning] = useState(false);


  // 4) Cuando llega la sala por REST, hidrata jugadores y posiciones
  useEffect(() => {
    if (!Room) return;

    // Room.RoomPlayers: [{ playerId, player { name }, turnOrder, position }]
    const mapped: UIPlayer[] =
      (Room.roomPlayers ?? []).map((rp: any) => ({
        id: rp.playerId ?? rp.PlayerId,
        name: rp.player?.name ?? rp.Player?.Name ?? "Player",
        turnOrder: rp.turnOrder ?? rp.TurnOrder ?? 0,
        color: colorFromName(rp.player?.name ?? rp.Player?.Name ?? "P"),
      })) ?? [];

    const ordered = [...mapped].sort((a, b) => a.turnOrder - b.turnOrder);
    setPlayers(ordered);

    const posArr =
      (Room.roomPlayers ?? [])
        .sort((a: any, b: any) => (a.turnOrder ?? 0) - (b.turnOrder ?? 0))
        .map((rp: any) => rp.position ?? rp.Position ?? 0);

    setPositions(posArr);
    setCurrentTurnOrder(Room.currentTurnOrder ?? 0);
    setWinnerName(null);
  }, [Room]);

  // 5) SignalR – Suscripción a eventos del juego

  const subscribed = useRef(false);
  useEffect(() => {
    (async () => {
      await ensureStarted();
      if (subscribed.current) return;
      subscribed.current = true;

      const conn = getConnection();

      conn.on("GameStarted", (payload: any) => {

        const ps: UIPlayer[] = (payload?.Players ?? []).map((p: any) => ({
          id: p.playerId ?? p.PlayerId,
          name: p.name ?? p.Name,
          turnOrder: p.turnOrder ?? p.TurnOrder ?? 0,
          color: colorFromName(p.name ?? p.Name ?? "P"),
        }));
        const ordered = [...ps].sort((a, b) => a.turnOrder - b.turnOrder);
        setPlayers(ordered);
        setPositions(ordered.map(() => 0));      // servidor empieza en 0
        setCurrentTurnOrder(payload?.firstTurnOrder ?? 0);
        setWinnerName(null);
        setDiceFace(undefined);                  // limpia el dado al iniciar
        setDiceSpinning(false);
      });

      // dentro del mismo useEffect de suscripción
      conn.on("GameUpdated", (dto: any) => {
        // dto: { roomId, state, currentTurnPlayer } (según tu GameStateDto)
        const state = dto?.state ?? dto?.State ?? {};
        // intenta sacar posiciones desde el estado (ajusta a tu shape real)
        const pos = state.positions ?? state.Positions;
        if (Array.isArray(pos)) {
          setPositions(pos);
        }

        // si tu state trae el turno como número:
        const turnFromState = state.currentTurnOrder ?? state.CurrentTurnOrder;
        if (typeof turnFromState === "number") {
          setCurrentTurnOrder(turnFromState);
        }

        // si tu GameStateDto usa "CurrentTurnPlayer" (nombre) en vez de número,
        // puedes mapear a order si lo necesitas, p.ej.:
        const currentTurnPlayerName = dto?.currentTurnPlayer ?? dto?.CurrentTurnPlayer;
        if (!Number.isFinite(turnFromState) && currentTurnPlayerName) {
          const p = players.find(x => (x.name ?? "").toLowerCase() === String(currentTurnPlayerName).toLowerCase());
          if (p) setCurrentTurnOrder(p.turnOrder);
        }
      });

      conn.on("TurnChanged", (payload: any) => {
        // el hub envía el "nextPlayer" (string) según tu código;
        // si en cambio envías { turnOrder: number }, soporta ambos:
        const order = payload?.turnOrder ?? payload?.TurnOrder;
        if (typeof order === "number") {
          setCurrentTurnOrder(order);
        } else {
          const name = payload ?? ""; // cuando viene sólo el nombre
          const p = players.find(x => (x.name ?? "").toLowerCase() === String(name).toLowerCase());
          if (p) setCurrentTurnOrder(p.turnOrder);
        }
      });

      // (opcional) deja tus eventos legacy por si en algún flujo REST los usas
      conn.on("DiceRolled", (e: any) => {
        setDiceFace(e?.dice);        // cara real del backend
        setDiceSpinning(false);      // detén animación del dado

        const idx = players.findIndex((p) => p.id === e.playerId);
        if (idx >= 0) {
          setPositions((prev) => {
            const next = [...prev];
            next[idx] = e.to;
            return next;
          });
        }
      });

      conn.on("NextTurn", (e: any) => {
        setCurrentTurnOrder(e?.turnOrder ?? 0);
      });

      conn.on("PlayerWon", (e: any) => {
        setWinnerName(e?.name ?? "Ganador");
      });
    })();

    return () => {
      const c = getConnection();
      c.off("GameStarted");
      c.off("GameUpdated");
      c.off("TurnChanged");
      c.off("DiceRolled");
      c.off("NextTurn");
      c.off("PlayerWon");
      subscribed.current = false;
    };
    // importante: dependemos solo de la longitud para no resincronizar en cada setPositions
  }, [players.length]);

  // 6) ¿Es mi turno?
  const myTurn = useMemo(() => {
    const me = players.find((p) => p.id === myId);
    return me ? me.turnOrder === currentTurnOrder : false;
  }, [players, myId, currentTurnOrder]);

  const turnName = useMemo(
    () => players.find((p) => p.turnOrder === currentTurnOrder)?.name ?? "",
    [players, currentTurnOrder]
  );

  const userName = UserPlayer?.name ?? "Player";
  const groupToJoin = String(Room?.name ?? Room?.code);

  const onTurn = async () => {
    const roomCodeNum = Number(code);
    if (!Number.isFinite(roomCodeNum)) return;

    // Asegúrate de estar unido al grupo (por si acaso)

    setDiceSpinning(true);    // empieza a “rodar”
    setDiceFace(undefined);   // limpia cara previa

    playMutation.mutateAsync(roomCode, {
      onError: () => setDiceSpinning(false),
    });
    await joinSignalRRoom(groupToJoin, userName);
    //useSessionStore.getState().setCurrentRoom(groupToJoin);
    // ENVÍO DE LA ACCIÓN AL HUB
    // await performGameActionSignalR(String(groupToJoin), {
    //   type: 'DiceRolled',
    //   payload: {
        

    //     // agrega lo que tu ApplyActionAsync necesite; por ejemplo:
    //     // requestedById: myId,
    //     //roomCode: roomCodeNum,
    //     // si el server tira el dado, payload puede ir vacío
    //   },
    // });
  };

  const  onInit = async () => {
    const roomCodeNum = Number(code);
    if (!Number.isFinite(roomCodeNum)) return;

    initMutation.mutateAsync(roomCode);
    await joinSignalRRoom(groupToJoin, userName);
  };

  const  onLeave = async () => {
    const roomCodeNum = Number(code);
    if (!Number.isFinite(roomCodeNum)) return;

    navigate({ to: roomByCodeRoute.to, params: { code: String(roomCode)}})
    await leaveSignalRRoom(groupToJoin);
  };

  // 7) UI
  if (!Number.isFinite(roomCode)) {
    return (
      <main className="min-h-screen grid place-items-center text-red-400">
        Código de sala inválido.
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="min-h-screen grid place-items-center text-white/80">
        Cargando sala…
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen grid place-items-center text-red-400">
        Error al cargar la sala.
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0e0f13] text-white flex items-center justify-center">
      <div className="w-full max-w-5xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-4">
        <div className="flex items-center justify-between">
            <button
              onClick={() => { onInit(); }}
              disabled={players.length < 2 || initMutation.isPending}
              className={`px-4 py-2 rounded-xl border border-white/10
                ${players.length < 2 || initMutation.isPending
                  ? "bg-white/5 text-white/40 cursor-not-allowed"
                  : "bg-white/10 hover:bg-white/15"}`}
            >
              {initMutation.isPending ? "Iniciando…" : "Iniciar partida"}
            </button>
          
          <button
            onClick={() => { onLeave() }}
            //disabled={initMutation.isPending}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10"
          >
            Ir a la Sala
          </button>

          {winnerName && (
            <div className="text-emerald-400 font-semibold">Ganó: {winnerName} </div>
          )}
        </div>

        <SnakesLaddersBoard
          rows={5}
          cols={6}
          //  jugadores construidos desde el backend (no quemados)
          players={players.map((p) => ( 
            { id: p.id, name: p.name, color: p.color }))}
          jumps={jumps}
          // posiciones dictadas por el servidor
          positions={positions}
          //  el dado dispara el POST /turn
          onExternalDiceClick={() => { onTurn() }}
          //  restricciones para tirar
          diceDisabled={!myTurn || !!winnerName|| playMutation.isPending}
          // etiqueta del turno
          turnLabel={myTurn ? `Tu turno (${turnName})` : `Turno de: ${turnName}`}
          // onWin lo gestiona el backend vía "PlayerWon"
          onWin={() => {}}
          externalDiceFace={diceFace}                          // cara real del backend
          externalDiceSpinning={diceSpinning} 
        />
        
        

        <div className="w-full max-w-5xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
        {/* ... tu UI arriba ... */}

          {/* Lobby */}
          <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <h3 className="text-xl font-semibold mb-2">Lobby</h3>
            <ul className="mt-4 space-y-1 max-h-64 overflow-y-auto pr-2 nice-scroll">
              {messages.map((message, index) => (
                <li key={index}>{message}</li>
              ))}
            </ul>
          </section>
          {/* Chat */}
          {/* <section> ... </section> */}
        </div>
        
      </div>
    </main>
  );
}
