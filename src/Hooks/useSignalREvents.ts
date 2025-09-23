
    import { useEffect, useRef } from "react";
    import { ensureStarted, setAuthToken, on as onHub, off as offHub } from "../signalRConnection";
    import { useMessagesStore } from "../stores/messagesStore";

    export function useSignalREvents(token: string) {
        const push = useMessagesStore(s => s.push);
        const subscribedRef = useRef(false);

        useEffect(() => {
            (async () => {
            setAuthToken(token);
            await ensureStarted();
            if (subscribedRef.current) return;
            subscribedRef.current = true;

            onHub("SystemMessage", (t: string) => push(`[SYS] ${t}`));
            onHub("PlayerJoined", (p: string) => push(`[JOIN] ${p} se unió a la sala`));
            onHub("PlayersList", (arr: string[]) => push(`[LIST] Jugadores: ${arr.join(", ")}`));
            onHub("ReceiveChatMessage", (u: string, msg: string) => push(`${u}: ${msg}`));
            onHub("DiceRolled", (p: any) => {
                const { playerName, dice, from, to, overshoot } = p ?? {};
                push(`[DICE] ${playerName ?? "Jugador"} sacó 🎲 ${dice} — ${overshoot ? `se pasa y se queda en ${from}` : `${from} → ${to}`}`);
            });
            onHub("NextTurn", (p: any) => {
                const { turnOrder, lastDice } = p ?? {};
                const info = lastDice ? `Última tirada: ${lastDice.playerName} 🎲 ${lastDice.dice}` : "";
                push(`[TURN] Turno #${turnOrder}. ${info}`.trim());
            });
            onHub("PlayerLeft", (name: string) => push(`[LEFT] ${name} salió de la sala`));

            onHub("GameStarted", (payload: any) => {
                const players = payload?.players
                ? Array.from(payload.players).map((x: any) => x.name ?? x.Player?.Name ?? "Jugador")
                : [];
                push(players.length ? `[START] Comienza la partida. Jugadores: ${players.join(", ")}` : `[START] Comienza la partida`);
            });
            onHub("SnakesLaddersHit", (p: any) => push(`[HIT] Serpiente/Escalera: jugador ${p?.playerId} ${p?.from} → ${p?.to}`));
            onHub("PlayerWon", (p: any) => push(`[WIN] ${p?.name ?? `Jugador ${p?.playerId}`} ganó la partida 🎉`));
            })();

            onHub("GameUpdated", (dto: any) => {
            const who = dto?.currentTurnPlayer ?? dto?.CurrentTurnPlayer ?? "?";
            push(`[STATE] Turno de ${who}`);
            });

            onHub("TurnChanged", (p: any) => {
            const order = p?.turnOrder ?? p?.TurnOrder;
            if (typeof order === "number") {
                push(`[TURN] Cambió el turno → #${order}`);
            } else {
                push(`[TURN] Cambió el turno → ${String(p)}`);
            }
            });

            return () => {
            // Si este hook vive toda la app, normalmente NO desuscribes aquí.
            // offHub("SystemMessage"); ...
            };
        }, [token, push]);
    }







// // src/hooks/useSignalREvents.ts
// import { useEffect, useRef } from "react";
// import { ensureStarted, setAuthToken, on as onHub } from "../signalRConnection";
// import { useMessagesStore } from "../stores/messagesStore";
// import { useSessionStore } from "../stores/sessionStore";

// export function useSignalREvents(token: string) {
//   const push = useMessagesStore(s => s.push);
//   const subscribedRef = useRef(false);

//   useEffect(() => {
//     (async () => {
//       setAuthToken(token);
//       await ensureStarted();
//       if (subscribedRef.current) return;
//       subscribedRef.current = true;

//       // Helper para obtener la sala actual si el payload no trae roomId
//       const currentRoom = () => useSessionStore.getState().currentRoomId ?? "default";

//       // ───── LOBBY ─────
//       onHub("SystemMessage", (t: string, roomId?: string) => {
//         push({ roomId: roomId ?? currentRoom(), channel: "lobby", text: `[SYS] ${t}` });
//       });

//       onHub("PlayerJoined", (name: string, roomId?: string) => {
//         push({ roomId: roomId ?? currentRoom(), channel: "lobby", text: `[JOIN] ${name} se unió` });
//       });

//       onHub("PlayerLeft", (name: string, roomId?: string) => {
//         push({ roomId: roomId ?? currentRoom(), channel: "lobby", text: `[LEFT] ${name} salió` });
//       });

//       onHub("PlayersList", (players: string[], roomId?: string) => {
//         const msg = `[LIST] Jugadores: ${players.join(", ")}`;
//         push({ roomId: roomId ?? currentRoom(), channel: "lobby", text: msg });
//       });

//       // ───── RANKING ─────
//       onHub("RankingUpdated", (summary: string, roomId?: string) => {
//         push({ roomId: roomId ?? currentRoom(), channel: "ranking", text: `[RANK] ${summary}` });
//       });

//       // ───── GAMEPLAY ─────
//       onHub("DiceRolled", (p: any) => {
//         const r = p?.roomId ?? currentRoom();
//         const { playerName, dice, from, to, overshoot } = p ?? {};
//         const text = `[DICE] ${playerName ?? "Jugador"} 🎲 ${dice} — ${overshoot ? `se pasa y queda en ${from}` : `${from} → ${to}`}`;
//         push({ roomId: r, channel: "game", text });
//       });

//       onHub("NextTurn", (p: any) => {
//         const r = p?.roomId ?? currentRoom();
//         const { turnOrder, lastDice } = p ?? {};
//         const info = lastDice ? `Última: ${lastDice.playerName} 🎲 ${lastDice.dice}` : "";
//         push({ roomId: r, channel: "game", text: `[TURN] #${turnOrder}. ${info}`.trim() });
//       });

//       onHub("SnakesLaddersHit", (p: any) => {
//         const r = p?.roomId ?? currentRoom();
//         push({ roomId: r, channel: "game", text: `[HIT] Jugador ${p?.playerId} ${p?.from} → ${p?.to}` });
//       });

//       onHub("GameStarted", (p: any) => {
//         const r = p?.roomId ?? currentRoom();
//         const players = p?.players ? Array.from(p.players).map((x: any) => x.name ?? x.Player?.Name ?? "Jugador") : [];
//         push({ roomId: r, channel: "game", text: players.length ? `[START] ${players.join(", ")}` : `[START]` });
//       });

//       onHub("PlayerWon", (p: any) => {
//         const r = p?.roomId ?? currentRoom();
//         push({ roomId: r, channel: "game", text: `[WIN] ${p?.name ?? `Jugador ${p?.playerId}`} 🎉` });
//       });

//       // ───── CHAT ─────
//       onHub("ReceiveChatMessage", (user: string, message: string, roomId?: string) => {
//         push({ roomId: roomId ?? currentRoom(), channel: "chat", text: `${user}: ${message}` });
//       });
//     })();
//   }, [token, push]);
// }
