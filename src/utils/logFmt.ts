// src/utils/logFmt.ts
export const fmt = {
    sys: (t: string) => `[SYS] ${t}`,
    join: (n: string) => `[JOIN] ${n} se unió`,
    left: (n: string) => `[LEFT] ${n} salió`,
    list: (arr: string[]) => `[LIST] Jugadores: ${arr.join(", ")}`,
    dice: (n: string, d: number, from: number, to: number, over?: boolean) =>
        `[DICE] ${n} 🎲 ${d} — ${over ? `se pasa y queda en ${from}` : `${from} → ${to}`}`,
    turn: (num: number, last?: { playerName: string; dice: number }) =>
        `[TURN] #${num}${last ? `. Última: ${last.playerName} 🎲 ${last.dice}` : ""}`,
    hit: (pid: any, from: number, to: number) => `[HIT] Jugador ${pid} ${from} → ${to}`,
    win: (n: string) => `[WIN] ${n} 🎉`,
    rank: (t: string) => `[RANK] ${t}`,
};
