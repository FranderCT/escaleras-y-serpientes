// src/components/ResultsRanking/SimpleRanking.tsx
import { useEffect, useState } from "react";
import { Trophy } from "lucide-react";
import apiAxios from "../../ApiConfig/ApiConfig";
import { ensureStarted, on as onHub, off as offHub } from "../../signalRConnection";

type RankingPlayer = { id: number; name: string; wins: number };

export default function SimpleRanking() {
  const [list, setList] = useState<RankingPlayer[]>([]);
  const [loading, setLoading] = useState(true);

  // 1) Carga inicial
  useEffect(() => {
    (async () => {
      try {
        const { data } = await apiAxios.get<RankingPlayer[]>("/api/Players/ranking");
        setList(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error cargando ranking:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // 2) Live update vía SignalR
  useEffect(() => {
    (async () => {
      await ensureStarted();
      onHub("RankingUpdated", (payload: any) => {
        // El hub te manda la lista ya ordenada. Si no, ordena aquí:
        // const ordered = [...payload].sort((a,b) => b.wins - a.wins);
        if (Array.isArray(payload)) setList(payload as RankingPlayer[]);
      });
    })();

    return () => {
      offHub("RankingUpdated");
    };
  }, []);

  if (loading) return <div className="text-white/70">Cargando ranking…</div>;

  return (
    <div className="w-full rounded-lg p-4 text-white">
      <h2 className="text-xl font-semibold text-center text-white/90">🏆 Top Jugadores</h2>
      <div className="mt-4 flex h-64 flex-col gap-3 overflow-y-auto pr-2 nice-scroll">
        {list.length > 0 ? (
          list.map((p, i) => (
            <div key={p.id ?? `${p.name}-${i}`} className="flex items-center justify-between rounded-lg bg-[#22232b] px-4 py-3 shadow-md ring-1 ring-white/10">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-indigo-400" />
                <span className="text-white/90">#{i + 1} {p.name}</span>
              </div>
              <span className="rounded-full bg-black/30 px-3 py-1 text-sm font-semibold text-indigo-300">
                🏆 {p.wins}
              </span>
            </div>
          ))
        ) : (
          <div className="text-white/70 text-center py-4">No hay jugadores aún.</div>
        )}
      </div>
    </div>
  );
}
