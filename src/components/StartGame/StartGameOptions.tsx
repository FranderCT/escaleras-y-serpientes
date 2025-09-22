import { useNavigate } from "@tanstack/react-router";
import ButtonOptions from "./ButtonOptions";
import { Trophy, PlusCircle, LogIn } from "lucide-react";
import { useState } from "react";
import RoomCreateModal from "../Modal/CreateRoomModal";
import RoomJoinModal from "../Modal/JoinRoomModal";
import type { RankingEntry } from "../ResultsRanking/RankingModal";
import RankingModal from "../ResultsRanking/RankingModal";

const mockRanking: RankingEntry[] = [
  { name: "María",   wins: 12, matchesPlayed: 18 },
  { name: "Brenda",  wins: 10, matchesPlayed: 15 },
  { name: "Samuel",  wins:  8, matchesPlayed: 14 },
  { name: "Luis",    wins:  7, matchesPlayed: 16 },
  { name: "Frander", wins:  6, matchesPlayed: 12 },
];

const StartGameOptions = () => {
  const [open, setOpen] = useState(false);
  const [openJoin, setOpenJoin] = useState(false);
  const [openRanking, setOpenRanking] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="w-full flex flex-wrap gap-3 sm:gap-4 items-center justify-center">
      <ButtonOptions
        onClick={() => setOpenRanking(true)}
        leftIcon={<Trophy className="w-5 h-5" />}
        variant="secondary"
        size="lg"
        className="backdrop-blur bg-white/5"
      >
        Ver Ranking
      </ButtonOptions>

      <ButtonOptions
        onClick={() => setOpen(true)}
        leftIcon={<PlusCircle className="w-5 h-5" />}
        variant="primary"
        size="lg"
      >
        Crear Sala
      </ButtonOptions>

      <ButtonOptions
        onClick={() => setOpenJoin(true)}
        leftIcon={<LogIn className="w-5 h-5" />}
        variant="primary"
        size="lg"
      >
        Unirme a sala
      </ButtonOptions>

      <RoomCreateModal
        open={open}
        onClose={() => setOpen(false)}
        onCreated={(room) => {
          console.log("Sala creada:", room);
          // navigate({ to: "/room/$code", params: { code: String(room.code) } });
        }}
      />

      <RoomJoinModal
        open={openJoin}
        onClose={() => setOpenJoin(false)}
        onJoined={(room) => {
          console.log("Entré a la sala:", room);
          // navigate({ to: "/room/$code", params: { code: String(room.code) } });
        }}
      />

      {/* Modal de Ranking */}
      <RankingModal
        open={openRanking}
        onClose={() => setOpenRanking(false)}
        ranking={mockRanking}
        // Si prefieres que el modal haga fetch:
        // fetchUrl="/api/ranking/top?take=10"
        maxItems={10}
      />
    </div>
  );
};

export default StartGameOptions;
