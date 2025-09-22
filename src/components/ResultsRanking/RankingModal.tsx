import { useEffect, useMemo } from "react";
import { Trophy, Award, X } from "lucide-react";
import { createPortal } from "react-dom";
import { useState } from "react";
import ButtonOptions from "../StartGame/ButtonOptions";

export type RankingEntry = {
  id?: string | number;
  name: string;
  wins: number;
  matchesPlayed: number;
};

type Props = {
  open: boolean;
  onClose: () => void;
  // Si ya tienes los datos, pásalos por props:
  ranking?: RankingEntry[];
  // O deja que el modal haga fetch:
  fetchUrl?: string; // e.g. "/api/ranking/top?take=10"
  maxItems?: number; // e.g. 10
};

function formatPct(wins: number, played: number) {
  if (!played) return "0%";
  return `${Math.round((wins / played) * 100)}%`;
}

export default function RankingModal({
  open,
  onClose,
  ranking,
  fetchUrl,
  maxItems = 10,
}: Props) {
  const [data, setData] = useState<RankingEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // Carga opcional por fetch si no vienen datos por props
  useEffect(() => {
    let abort = false;
    async function load() {
      if (!open) return;
      if (ranking && ranking.length) {
        setData(ranking.slice(0, maxItems));
        return;
      }
      if (!fetchUrl) return;
      setLoading(true);
      setErr(null);
      try {
        const res = await fetch(fetchUrl, { method: "GET" });
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        const json = (await res.json()) as RankingEntry[];
        if (!abort) setData(json.slice(0, maxItems));
      } catch (e: any) {
        if (!abort) setErr(e?.message ?? "Error cargando ranking");
      } finally {
        if (!abort) setLoading(false);
      }
    }
    load();
    return () => {
      abort = true;
    };
  }, [open, ranking, fetchUrl, maxItems]);

  // Ordena por wins desc y luego por matchesPlayed asc
  const sorted = useMemo(() => {
    const src = ranking && ranking.length ? ranking : data;
    return [...src].sort((a, b) => {
      if (b.wins !== a.wins) return b.wins - a.wins;
      return a.matchesPlayed - b.matchesPlayed;
    });
  }, [ranking, data]);

  const winner = sorted[0];

  // Cerrar con Esc
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50"
      aria-modal="true"
      role="dialog"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-3xl rounded-2xl border border-white/10 bg-[#12131a] text-white shadow-2xl shadow-indigo-900/20">
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10">
            <div className="flex items-center gap-3">
              <Trophy className="w-6 h-6 text-yellow-400" />
              <h2 className="text-xl font-semibold">Ranking de Jugadores</h2>
            </div>
            <button
              className="p-2 rounded-lg hover:bg-white/10 active:scale-95 transition"
              aria-label="Cerrar"
              onClick={onClose}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Winner card */}
          <div className="p-4 sm:p-6">
            {loading ? (
              <div className="text-white/70">Cargando…</div>
            ) : err ? (
              <div className="text-red-400 text-sm">{err}</div>
            ) : winner ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-400/20 to-yellow-200/10 border border-yellow-300/20">
                  <Award className="w-7 h-7 text-yellow-300" />
                </div>
                <div className="flex-1">
                  <div className="text-sm uppercase tracking-wide text-white/70">
                    Ganador de la partida
                  </div>
                  <div className="text-2xl font-bold">{winner.name}</div>
                  <div className="text-white/80">
                    {winner.wins} victorias • {winner.matchesPlayed} partidas •{" "}
                    {formatPct(winner.wins, winner.matchesPlayed)} winrate
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-white/70">Sin datos de ranking todavía.</div>
            )}
          </div>

          {/* Table */}
          <div className="px-4 sm:px-6 pb-4 sm:pb-6">
            <div className="overflow-x-auto rounded-2xl border border-white/10">
              <table className="min-w-full text-sm">
                <thead className="bg-white/5">
                  <tr>
                    <th className="text-left p-3 border-b border-white/10">#</th>
                    <th className="text-left p-3 border-b border-white/10">Jugador</th>
                    <th className="text-center p-3 border-b border-white/10">Victorias</th>
                    <th className="text-center p-3 border-b border-white/10">Partidas</th>
                    <th className="text-center p-3 border-b border-white/10">Winrate</th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((p, idx) => (
                    <tr key={p.id ?? `${p.name}-${idx}`} className="odd:bg-white/0 even:bg-white/[0.03]">
                      <td className="p-3">{idx + 1}</td>
                      <td className="p-3 font-medium">{p.name}</td>
                      <td className="p-3 text-center">{p.wins}</td>
                      <td className="p-3 text-center">{p.matchesPlayed}</td>
                      <td className="p-3 text-center">
                        {formatPct(p.wins, p.matchesPlayed)}
                      </td>
                    </tr>
                  ))}
                  {!sorted.length && (
                    <tr>
                      <td colSpan={5} className="p-4 text-center text-white/70">
                        No hay jugadores en el ranking.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer actions */}
            <div className="mt-4 flex items-center justify-end gap-3">
              <ButtonOptions variant="secondary" onClick={onClose}>
                Cerrar
              </ButtonOptions>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
