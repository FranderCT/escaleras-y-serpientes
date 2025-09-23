// src/components/GameBoard/SnakesLaddersBoard.tsx
import { useEffect, useMemo, useRef, useState } from "react";

type JumpMap = Record<number, number>;
type PlayerItem = { id: number; name: string; color: string };

type Props = {
  rows?: number;
  cols?: number;
  players?: PlayerItem[];
  jumps?: JumpMap;
  onWin?: (winner: PlayerItem) => void;

  /** Controlado por servidor (tu backend) */
  positions?: number[];                 // posiciones absolutas por jugador
  onExternalDiceClick?: () => (void);     // dispara POST /turn
  diceDisabled?: boolean;               // deshabilitar dado desde fuera
  turnLabel?: string;                   // texto “Turno de: …”
  externalDiceFace?: number;   // cara real 1..6
  externalDiceSpinning?: boolean; // true mientras esperas DiceRolled
};

/** Construye filas de ARRIBA hacia ABAJO numerando desde ABAJO-IZQUIERDA */
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

/** Dado con animación; si hay onExternal → no calcula número local */
function Dice({
  disabled,
  onRollNumber,        // solo para modo local
  onExternal,          // si viene => modo servidor
  label,
  externalFace,        // NUEVO: cara real que viene del servidor
  spinning,            // NUEVO: controla el “rodando…”
}: {
  disabled?: boolean;
  onRollNumber?: (value: number) => void;
  onExternal?: () => void;
  label?: string;
  externalFace?: number;  // 1..6
  spinning?: boolean;     // true mientras esperas DiceRolled
}) {
  const [face, setFace] = useState(1);
  const [rolling, setRolling] = useState(false);
  const intervalRef = useRef<number | null>(null);

  // si el padre actualiza la cara (modo servidor), muéstrala
  useEffect(() => {
    if (externalFace && externalFace >= 1 && externalFace <= 6) {
      setFace(externalFace);
    }
  }, [externalFace]);

  const startRoll = async () => {
    if (rolling || disabled) return;

    // modo servidor: NO fijes cara final; solo gira y delega
    if (onExternal) {
      setRolling(true);
      intervalRef.current = window.setInterval(() => {
        setFace(1 + Math.floor(Math.random() * 6));
      }, 70);

      await onExternal();              // dispara POST /turn

      // el stop lo hace el padre al llegar DiceRolled (spinning=false)
      return;
    }

    // modo local: sí decide cara final
    setRolling(true);
    intervalRef.current = window.setInterval(() => {
      setFace(1 + Math.floor(Math.random() * 6));
    }, 70);

    await new Promise((r) => setTimeout(r, 700));
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    const final = 1 + Math.floor(Math.random() * 6);
    setFace(final);
    await new Promise((r) => setTimeout(r, 120));
    onRollNumber?.(final);
    setRolling(false);
  };

  // detener giro cuando el padre diga que ya no está “spinning”
  useEffect(() => {
    if (!onExternal) return; // solo aplica en modo servidor
    if (spinning === false && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setRolling(false);
    }
  }, [spinning, onExternal]);

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        onClick={startRoll}
        disabled={disabled || rolling || spinning}
        className={`relative select-none rounded-2xl border border-white/10 bg-white/10 backdrop-blur text-white 
                    shadow-2xl shadow-indigo-900/20 transition-all
                    ${disabled || rolling || spinning ? "opacity-60 cursor-not-allowed" : "hover:brightness-110 active:scale-95"}`}
        style={{ width: 72, height: 72, boxShadow: "0 10px 25px rgba(0,0,0,.25), inset 0 1px 0 rgba(255,255,255,.15)" }}
        aria-label="Tirar dado"
      >
        <div className="absolute inset-0 grid place-items-center text-3xl font-extrabold" style={{ textShadow: "0 2px 8px rgba(0,0,0,.35)" }}>
          {face}
        </div>

        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-white/90" />
          <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-white/90" />
          <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-white/90" />
          <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-white/90" />
        </div>

        <div
          className={`absolute -inset-1 rounded-2xl blur-lg transition-opacity ${(rolling || spinning) ? "opacity-60" : "opacity-0"}`}
          style={{ background: "conic-gradient(from 180deg,#60a5fa33,#a78bfa33,#34d39933)" }}
        />
      </button>

      <div className="text-xs text-white/80">
        {label ?? (rolling || spinning ? "Rodando..." : "")}
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

  positions: positionsExternal,
  onExternalDiceClick,
  diceDisabled = false,
  turnLabel,
  externalDiceFace,
  externalDiceSpinning,
}: Props) {
  const LAST = rows * cols;

  const players = playersProp ?? [];

  // Si no hay jugadores aún, render “loading”
  if (players.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white/80">
        Esperando a que inicie la partida…
      </div>
    );
  }

  const jumps: JumpMap = {
    3: 22, 11: 2,
    ...jumpsProp,
  };

  const boardRows = useMemo(() => buildBoardRows(rows, cols), [rows, cols]);

  // Estado local SOLO si no vienen positions externas
  const [localPositions, setLocalPositions] = useState<number[]>(players.map(() => 1));
  const [turnLocal, setTurnLocal] = useState(0);
  const [rollingLocal, setRollingLocal] = useState(false);

  // Mantener localPositions sincronizado con el número de jugadores
  useEffect(() => {
    if (!positionsExternal) {
      setLocalPositions((prev) => {
        if (prev.length === players.length) return prev;
        // Re-crear manteniendo el primer valor si existía
        const base = players.map((_, i) => prev[i] ?? 1);
        return base;
      });
      setTurnLocal((t) => (t >= players.length ? 0 : t));
    }
  }, [players.length, positionsExternal]);

  // Si llegan posiciones desde servidor, usamos esas
  const positions = positionsExternal ?? localPositions;

  // players por celda (nota: posición 0 no pinta en el tablero → “fuera”)
  const playersByCell = useMemo(() => {
    const map = new Map<number, number[]>();
    positions.forEach((pos, i) => {
      if (pos > 0) map.set(pos, [...(map.get(pos) ?? []), i]);
    });
    return map;
  }, [positions]);

  const someoneWon = positions.some((p) => p === LAST);

  // ——— Lógica local (solo demo sin servidor) ———
  const animateMove = async (target: number) => {
    const start = localPositions[turnLocal];
    for (let step = start + 1; step <= target; step++) {
      await new Promise((r) => setTimeout(r, 140));
      setLocalPositions((prev) => {
        const copy = [...prev];
        copy[turnLocal] = step;
        return copy;
      });
    }
  };

  const handleRollLocal = async (dice: number) => {
    if (rollingLocal) return;
    setRollingLocal(true);

    const start = localPositions[turnLocal];
    let target = start + dice;
    if (target > LAST) target = LAST;

    await animateMove(target);

    const after = jumps[target] ?? target;
    if (after !== target) {
      await new Promise((r) => setTimeout(r, 180));
      setLocalPositions((prev) => {
        const copy = [...prev];
        copy[turnLocal] = after;
        return copy;
      });
    }

    if (after === LAST) {
      onWin?.(players[turnLocal]);
    } else {
      setTurnLocal((t) => (t + 1) % players.length);
    }
    setRollingLocal(false);
  };

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
                <span className="text-white/90">{p.name}:</span>
                <span className="text-white/70">{positions[i] ?? 0}</span>
              </span>
            ))}
          </div>

          <Dice
            disabled={onExternalDiceClick ? diceDisabled : rollingLocal || someoneWon}
            onExternal={onExternalDiceClick}
            onRollNumber={handleRollLocal}
            label={turnLabel}
            externalFace={externalDiceFace}       
            spinning={externalDiceSpinning}
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

                {/* Marca de serpiente/escalera */}
                {isJump && (
                  <div
                    className={`absolute bottom-1.5 right-1.5 text-xs sm:text-sm font-bold ${
                      goesUp ? "text-emerald-600" : "text-red-500"
                    }`}
                  >
                    {goesUp ? "↗︎" : "↘︎"} {jumps[cell]}
                  </div>
                )}

                {/* Fichas apiladas dentro de la casilla */}
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
      </div>
    </div>
  );
}
