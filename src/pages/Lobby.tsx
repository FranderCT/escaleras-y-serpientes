import TopGlobals from "../components/Lobby/TopGlobals";
import type { Player } from "../models/Player";
import binariosFoto from "../assets/binariosFoto.png";

const playersData: Player[] = [
  { Id: 1, NamePlayer: "Frander", TurnOrder: 1, Position: 5, Wins: 3 },
  { Id: 2, NamePlayer: "Brenda", TurnOrder: 2, Position: 10, Wins: 5 },
  { Id: 3, NamePlayer: "Luis", TurnOrder: 3, Position: 2, Wins: 1 },
  { Id: 4, NamePlayer: "Samuel", TurnOrder: 4, Position: 7, Wins: 2 },
  { Id: 5, NamePlayer: "Katherine", TurnOrder: 5, Position: 8, Wins: 4 },
];

export default function Lobby() {
  return (
    <main className="min-h-screen bg-[#222] text-white flex items-center justify-center">
      <div className="mx-auto w-full max-w-5xl px-4 md:px-6 lg:px-8 py-8">
        

        {/* Contenedor principal con flex */}
        <section className="flex flex-row">
          {/* Imagen */}
          <div className="flex-1 rounded-lg flex items-center justify-center">
            <img
              src={binariosFoto}
              alt="Binarios"
              className="h-56 md:h-72 lg:h-72 w-auto object-contain rounded-md shadow-lg shadow-black/30"
              loading="lazy"
            />
          </div>

          {/* Ranking */}
          <div className="flex-1 rounded-lg  p-4">
            <TopGlobals players={playersData} maxItems={10} />
          </div>
        </section>

       
      </div>
    </main>
  );
}
