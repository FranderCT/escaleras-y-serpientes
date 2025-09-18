import StartGameOptions from "../components/StartGame/StartGameOptions";
import StartGamePlayerName from "../components/StartGame/StartGamePlayerName";
import type { Player } from "../models/Player";

const playerData: Player = {
  Id: 1,
  NamePlayer: "Frander",
  TurnOrder: 1,
  Position: 0, // inicio
  Wins: 0,     // inicial
};

const StartGame = () => {
  return (
    <main className="min-h-screen bg-[#0e0f13] text-white flex items-center justify-center">
      <div className="w-full max-w-3xl p-6 sm:p-8 flex flex-col gap-6">
        <header className="mb-6 sm:mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Snakes & Ladders
          </h1>
          <p className="text-white/70 mt-2">Elige una opción para comenzar</p>
        </header>

        {/* Opciones de inicio */}
        <section className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-6 sm:p-8 shadow-2xl shadow-indigo-900/10">
          <StartGameOptions />
        </section>


        {/* Bienvenida del jugador */}
        <section className="">
          <StartGamePlayerName player={playerData} />
        </section>
        
      </div>
    </main>
  );
};

export default StartGame;
