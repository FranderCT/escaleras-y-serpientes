// src/components/GameBoard/SnakesLaddersBoard.tsx
import { useEffect, useMemo, useRef, useState } from "react";

type JumpMap = Record<number, number>;
type PlayerItem = { id: number; name: string; color: string };

type Props = {
  rows?: number;
  cols?: number;
  players?: PlayerItem[]; // si no se pasa, usa 3 por defecto
  jumps?: JumpMap;
  onWin?: (winner: PlayerItem) => void;
};

// Construye filas de ARRIBA hacia ABAJO numerando desde ABAJO-IZQUIERDA
function buildBoardRows(rows: number, cols: number) {
  const rowsBottomUp: number[][] = [];
  let n = 1;
  for (let r = 0; r < rows; r++) {
    const row = Array.from({ length: cols }, (_, i) => n + i);
    n += cols;
    rowsBottomUp.push(r % 2 === 0 ? row : [...row].reverse());
  }
  return rowsBottomUp.reverse();
}

// Dado interactivo con animación de “giro”
function Dice({
  disabled,
  onRoll,
  label,
}: {
  disabled?: boolean;
  onRoll: (value: number) => void;
  label?: string;
}) {
  const [face, setFace] = useState(1);
  const [rolling, setRolling] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const startRoll = async () => {
    if (rolling || disabled) return;
    setRolling(true);

    // animación de caras aleatorias
    let t = 0;
    intervalRef.current = window.setInterval(() => {
      setFace(1 + Math.floor(Math.random() * 6));
      t += 1;
    }, 70);

    // duración ~700ms
    await new Promise((r) => setTimeout(r, 700));

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // cara final definitiva
    const final = 1 + Math.floor(Math.random() * 6);
    setFace(final);

    // pequeña pausa para “sensación”
    await new Promise((r) => setTimeout(r, 120));

    onRoll(final);
    setRolling(false);
  };

  // limpiar intervalo si desmonta
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        onClick={startRoll}
        disabled={disabled || rolling}
        className={`relative select-none rounded-2xl border border-white/10 bg-white/10 backdrop-blur text-white 
                    shadow-2xl shadow-indigo-900/20 transition-all
                    ${disabled ? "opacity-60 cursor-not-allowed" : "hover:brightness-110 active:scale-95"}
                    `}
        style={{
          width: 72,
          height: 72,
          boxShadow:
            "0 10px 25px rgba(0,0,0,.25), inset 0 1px 0 rgba(255,255,255,.15)",
        }}
        aria-label="Tirar dado"
        title={disabled ? "Esperando…" : "Tirar dado"}
      >
        <div
          className="absolute inset-0 grid place-items-center text-3xl font-extrabold"
          style={{ textShadow: "0 2px 8px rgba(0,0,0,.35)" }}
        >
          {face}
        </div>

        {/* puntitos decorativos tipo dado */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-white/90" />
          <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-white/90" />
          <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-white/90" />
          <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-white/90" />
        </div>

        {/* halo */}
        <div
          className={`absolute -inset-1 rounded-2xl blur-lg transition-opacity ${
            rolling ? "opacity-60" : "opacity-0"
          }`}
          style={{ background: "conic-gradient(from 180deg,#60a5fa33,#a78bfa33,#34d39933)" }}
        />
      </button>

      <div className="text-xs text-white/80">
        {label ? label : rolling ? "Rodando..." : ""}
      </div>
    </div>
  );
}

export default function SnakesLaddersBoard({
  rows = 5,
  cols = 6,
  players: playersProp,
  jumps: jumpsProp,
  onWin,
}: Props) {
  const LAST = rows * cols;

  const defaultPlayers: PlayerItem[] = useMemo(
    () => [
      { id: 0, name: "Samuel",  color: "#1B6DF5" },
      { id: 1, name: "Jose",    color: "#141032" },
      { id: 2, name: "Frander", color: "#564ba8" },
    ],
    []
  );

  const players = playersProp && playersProp.length ? playersProp : defaultPlayers;

  const jumps: JumpMap = {
    3: 8,  // escalera
    11: 2, // serpiente
    16: 21,
    24: 13,
    26: 22,
    29: 19,
    ...jumpsProp,
  };

  const boardRows = useMemo(() => buildBoardRows(rows, cols), [rows, cols]);

  const [positions, setPositions] = useState<number[]>(players.map(() => 1));
  const [turn, setTurn] = useState(0);
  const [rolling, setRolling] = useState(false);

  const animateMove = async (target: number) => {
    const start = positions[turn];

    for (let step = start + 1; step <= target; step++) {
      await new Promise((r) => setTimeout(r, 140));
      setPositions((prev) => {
        const copy = [...prev];
        copy[turn] = step;
        return copy;
      });
    }
  };

  const handleRoll = async (dice: number) => {
    if (rolling) return;
    setRolling(true);

    const start = positions[turn];
    let target = start + dice;
    if (target > LAST) target = LAST;

    // animación paso a paso
    await animateMove(target);

    // aplicar serpiente / escalera
    const after = jumps[target] ?? target;
    if (after !== target) {
      await new Promise((r) => setTimeout(r, 180));
      setPositions((prev) => {
        const copy = [...prev];
        copy[turn] = after;
        return copy;
      });
    }

    if (after === LAST) {
      onWin?.(players[turn]);
    } else {
      setTurn((t) => (t + 1) % players.length);
    }
    setRolling(false);
  };

  // jugadores por celda (para render directo dentro de la celda)
  const playersByCell = useMemo(() => {
    const map = new Map<number, number[]>();
    positions.forEach((pos, i) => {
      map.set(pos, [...(map.get(pos) ?? []), i]);
    });
    return map;
  }, [positions]);

  const someoneWon = positions.some((p) => p === LAST);
  const currentName = players[turn]?.name ?? "";

  return (
    <div className="grid gap-4">
      {/* Header / marcador */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5 shadow-2xl shadow-indigo-900/10">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* Leyenda con nombres */}
          <div className="flex flex-wrap gap-4">
            {players.map((p, i) => (
              <span key={p.id} className="inline-flex items-center gap-2 font-semibold">
                <span
                  className="inline-grid place-items-center rounded-full border-2 border-white/80 text-[10px] leading-none text-white"
                  style={{ width: 16, height: 16, background: p.color }}
                  title={p.name}
                >
                  {p.name.charAt(0).toUpperCase()}
                </span>
                <span className="text-black">{p.name}:</span>
                <span className="text-black">{positions[i]}</span>
              </span>
            ))}
          </div>

          {/* Dado interactivo */}
          <Dice
            disabled={rolling || someoneWon}
            onRoll={handleRoll}
            label={`Turno de: ${currentName}`}
          />
        </div>
      </div>

      {/* Tablero */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4 shadow-2xl shadow-indigo-900/10">
        <div
          className="grid gap-1.5 sm:gap-2 mx-auto"
          style={{
            gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))`,
            gridTemplateRows: `repeat(${rows}, minmax(0,1fr))`,
            aspectRatio: `${cols} / ${rows}`,
            maxWidth: 720,
          }}
        >
          {boardRows.flat().map((cell) => {
            const here = playersByCell.get(cell) ?? [];
            const isJump = !!jumps[cell];
            const goesUp = (jumps[cell] ?? 0) > cell;

            return (
              <div
                key={cell}
                className="relative grid place-items-center rounded-xl border-2 bg-white text-gray-900 font-extrabold text-lg sm:text-xl"
                style={{ borderColor: "#e5e7eb" }}
              >
                {cell}

                {/* marca de salto */}
                {isJump && (
                  <div
                    className={`absolute bottom-1.5 right-1.5 text-xs sm:text-sm font-bold ${
                      goesUp ? "text-emerald-600" : "text-red-500"
                    }`}
                  >
                    {goesUp ? "↗︎" : "↘︎"} {jumps[cell]}
                  </div>
                )}

                {/* fichas apiladas dentro de la casilla con inicial */}
                {here.length > 0 && (
                  <div className="absolute inset-0 flex items-center justify-center gap-1.5 sm:gap-2">
                    {here.map((pi) => (
                      <div
                        key={pi}
                        title={players[pi].name}
                        className="rounded-full border-4 shadow-md grid place-items-center text-[11px] font-bold text-white"
                        style={{
                          width: "38%",
                          height: "38%",
                          borderColor: "white",
                          background: players[pi].color,
                          textShadow: "0 1px 2px rgba(0,0,0,.35)",
                        }}
                      >
                        {players[pi].name.charAt(0).toUpperCase()}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <p className="mt-3 text-xs text-white/60">
          Personaliza <code className="text-white/80">rows</code>,{" "}
          <code className="text-white/80">cols</code> o <code className="text-white/80">jumps</code> según la sala.
        </p>
      </div>
    </div>
  );
}
