// src/components/StartGameOptions.tsx
import { useNavigate } from "@tanstack/react-router";
import ButtonOptions from "./ButtonOptions";
import { Trophy, PlusCircle, Search } from "lucide-react";

const StartGameOptions = () => {
const navigate = useNavigate();

const goRoom = () =>{
  navigate({to : '/lobby'})
}

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
        onClick={goRoom}
        leftIcon={<PlusCircle className="w-5 h-5" />}
        variant="primary"
        size="lg"
      >
        Crear Sala
      </ButtonOptions>

      <ButtonOptions
        onClick={() => alert("Buscar sala")}
        leftIcon={<Search className="w-5 h-5" />}
        variant="ghost"
        size="lg"
        className="ring-1 ring-white/10"
      >
        Buscar Sala
      </ButtonOptions>
    </div>
  );
};

export default StartGameOptions;
