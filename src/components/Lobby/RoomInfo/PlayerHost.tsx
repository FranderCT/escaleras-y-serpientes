import type { Player } from "../../../models/Player";

type Props = {
  player: Player;
};

const PlayerHost = ({ player }: Props) => {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <span className="text-xl text-white/70">
        Sala de {player.name}
      </span>
    </div>
  );
};

export default PlayerHost;
