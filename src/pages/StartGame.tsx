import SimpleRanking from "../components/ResultsRanking/SimpleRanking";
import StartGameOptions from "../components/StartGame/StartGameOptions";
import StartGamePlayerName from "../components/StartGame/StartGamePlayerName";
import { useGetPlayer } from "../Hooks/PlayerHooks";

const StartGame = () => {
  const {UserPlayer} = useGetPlayer();
  return (
    <main className="min-h-screen bg-[#0e0f13] text-white flex items-center justify-center">
      <div className="w-full max-w-3xl p-6 sm:p-8 flex flex-col gap-6">
        {/* Bienvenida del jugador */}
        <section className="">
          <StartGamePlayerName player={UserPlayer} />
        </section>
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
         <section className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-indigo-900/10">
          <SimpleRanking />
      </section>
      </div>
    </main>
  );
};

export default StartGame;
