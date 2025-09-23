import type { Player } from "../../models/Player";

type Props = {
  player?: Player;
};

const StartGamePlayerName = ({ player }: Props) => {
  return (
    <div className=" rounded-xl px-6 py-4  shadow-md">
      <h2 className="text-white text-2xl font-bold mb-2 text-center">
        Bienvenido, {player?.name} 
      </h2>
    </div>
  );
};

export default StartGamePlayerName;

