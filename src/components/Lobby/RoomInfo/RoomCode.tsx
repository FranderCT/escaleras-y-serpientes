import type { Room } from "../../../models/Room";

type Props = {
  room: Room;
};

const RoomCode = ({ room }: Props) => {
  return (
    <div className="flex flex-row items-center justify-center text-center gap-3">
      <span className="text-xl text-white/70">Código de la sala</span>
      <span className="text-lg font-mono font-bold tracking-wider text-indigo-300 bg-black/30 px-3 py-1 rounded-lg shadow-inner">
        {room.Code}
      </span>
    </div>
  );
};

export default RoomCode;
