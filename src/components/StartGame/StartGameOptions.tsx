// src/components/StartGameOptions.tsx
import { useNavigate } from "@tanstack/react-router";
import ButtonOptions from "./ButtonOptions";
import { Trophy, PlusCircle, Search, LogIn } from "lucide-react";
import { useState } from "react";
import RoomCreateModal from "../Modal/CreateRoomModal";
import RoomJoinModal from "../Modal/JoinRoomModal";

const StartGameOptions = () => {
  const [open, setOpen] = useState(false);
  const [openJoin, setOpenJoin] = useState(false);
const navigate = useNavigate();


  return (
    <div className="w-full flex flex-wrap gap-3 sm:gap-4 items-center justify-center">
      <ButtonOptions
        onClick={() => console.log("Ver ranking")}
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
            // si tu API devuelve { id } o { code }, puedes navegar:
            // navigate({ to: "/rooms/$id", params: { id: String(room.id) } });
            // o:
            // navigate({ to: "/room/$code", params: { code: String(room.code) } });
            console.log("Sala creada:", room);
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


    </div>
  );
};

export default StartGameOptions;
